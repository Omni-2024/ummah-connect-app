"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { StreamChat, Channel as StreamChannel } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";
import { useMutation } from "@tanstack/react-query";

import {useCurrentUser, useGeneralUser} from "@/lib/hooks/useUser";
import { getStreamChatTokenFn, type GetChatTokenParams } from "@/lib/endpoints/streamFns";
import { Toast } from "@/components/base/Toast";
import { getErrorMessage } from "@/lib/helpers/errors";
import {UserRole} from "@/lib/constants";
import envs from "@/lib/env";
import crypto from 'crypto';
import {useProviderChatState} from "@/features/provider/context/useProviderChatState";


const apiKey = envs.streamApiKey;

export const useChatClient = (userId: string | null, otherUserId: string | null) => {
    const [client, setClient] = useState<StreamChat | null>(null);
    const [channel, setChannel] = useState<StreamChannel | null>(null);
    const [allChannels, setAllChannels] = useState<StreamChannel[]>([]);
    const chatClientRef = useRef<StreamChat | null>(null);
    const {isOneChat}=useProviderChatState()



    const didConnectRef = useRef(false);       // ✅ new
    const isCleaningUpRef = useRef(false);     // ✅ helps prevent race renders

    // Only fetch otherUserData when otherUserId exists
    const { data: otherUserData } = useGeneralUser(otherUserId || "");
    const currentUserData = useCurrentUser();

    const { data: userData } = useGeneralUser(userId || undefined);

    const { mutateAsync: fetchChatToken } = useMutation({
        mutationFn: getStreamChatTokenFn,
    });

    const role: UserRole | undefined = userData?.role as UserRole | undefined;

    const createChannelId = (userId: string, otherUserId: string) => {
        const sorted = [userId, otherUserId].sort();
        const combined = `${sorted[0]}_${sorted[1]}`;
        const hash = crypto.createHash('md5').update(combined).digest('hex');
        return `dm_${hash.substring(0, 50)}`;
    };

    const createChannelName = () => {
        if (!currentUserData?.data?.name || !otherUserData?.name) return "";
        return `${currentUserData.data.name} & ${otherUserData.name} Chat`;
    };


    const safeApiKey = useMemo(() => {
        if (!apiKey) {
            console.warn("NEXT_PUBLIC_STREAM_API_KEY_CHAT is missing.");
        }
        return apiKey;
    }, []);

    const selectChannel = async (selected: StreamChannel) => {
        try {
            await selected.watch();
            setChannel(selected);
        } catch (e) {
            console.error("Error selecting channel:", e);
        }
    };

    const fetchAdminChannels = async (currentClient: StreamChat) => {
        try {
            const channels = await currentClient.queryChannels(
                { type: "messaging", members: { $in: [userId] } },
                { last_message_at: -1 },
                { watch: true, state: true, limit: 30 }
            );
            // Keep only channels where the creator is currently active (per your API)
            const checks = channels.map(async (ch) => {
                const creatorId = (ch.data?.created_by as { id?: string } | undefined)?.id;
                if (!creatorId) return null;
                return ch ;
            });

            const filtered = (await Promise.all(checks)).filter(Boolean) as StreamChannel[];
            setAllChannels(filtered);
            return filtered;
        } catch (e) {
            console.error("Error fetching admin channels:", e);
            return [];
        }
    };

    useEffect(() => {
        // CRITICAL: Don't initialize if essential data is missing
        if (!userId || !role || !safeApiKey) {
            console.log("Skipping chat initialization - missing required data:", { userId, role, safeApiKey: !!safeApiKey });
            return;
        }

        // If isOneChat mode, we MUST have otherUserId
        if (isOneChat && !otherUserId) {
            console.log("Skipping chat initialization - isOneChat mode requires otherUserId");
            return;
        }

        if (!chatClientRef.current) {
            chatClientRef.current = StreamChat.getInstance(safeApiKey);
        }

        let mounted = true;
        const currentClient = chatClientRef.current!;

        isCleaningUpRef.current = false;
        setChannel(null);

        const init = async () => {
            try {
                const token = await fetchChatToken({
                    id: userId,
                    name: userData?.name ?? userId,
                    role,
                } as GetChatTokenParams);

                // ✅ Only connect if not connected OR different user
                if (!currentClient.userID || currentClient.userID !== userId) {
                    // If a different user is connected, disconnect first
                    if (currentClient.userID && currentClient.userID !== userId) {
                        await currentClient.disconnectUser();
                    }

                    await currentClient.connectUser(
                        { id: userId, name: userData?.name ?? undefined },
                        token
                    );
                    didConnectRef.current = true; // ✅ we own the connection
                } else {
                    didConnectRef.current = false; // ✅ someone else already connected it
                }

                if (!mounted) return;

                setClient(currentClient);

                if (!isOneChat) {
                    const adminChannels = await fetchAdminChannels(currentClient);
                    if (!mounted) return;

                    setAllChannels(adminChannels);
                    setChannel(adminChannels[0] ?? null);
                } else if (otherUserId) {
                    const channelId = createChannelId(userId, otherUserId);

                    const channels = await currentClient.queryChannels(
                        { type: "messaging", id: { $eq: channelId } },
                        {},
                        { watch: true, state: true }
                    );

                    if (!mounted) return;

                    if (channels.length === 0) {
                        const newChannel = currentClient.channel("messaging", channelId, {
                            members: [userId, otherUserId].sort(),
                            created_by_id: userId,
                            name: createChannelName(),
                        });
                        await newChannel.watch();
                        if (!mounted) return;
                        setChannel(newChannel);
                    } else {
                        setChannel(channels[0]);
                    }
                }
            } catch (e: any) {
                if (mounted) Toast.error(getErrorMessage(e));
            }
        };

        init();



        return () => {
            mounted = false;
            // Disconnect when component unmounts
            isCleaningUpRef.current = true;

            setChannel(null);
            setAllChannels([]);
            setClient(null);


            if (didConnectRef.current && currentClient.userID) {
                currentClient.disconnectUser().catch((err) => {
                    console.error("Error disconnecting user:", err);
                });
            }
        };
    }, [userId, role, otherUserId, isOneChat, userData?.name, safeApiKey]);

    return {
        client,
        channel,
        allChannels,
        selectChannel,
        isAdmin: !isOneChat,
    };
};