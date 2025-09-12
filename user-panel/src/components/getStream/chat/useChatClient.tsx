"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { StreamChat, Channel as StreamChannel } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";
import { useMutation } from "@tanstack/react-query";

import { useGeneralUser } from "@/lib/hooks/useUser";
import { getStreamChatTokenFn, type GetChatTokenParams } from "@/lib/endpoints/streamFns";
import { Toast } from "@/components/base/Toast";
import { getErrorMessage } from "@/lib/helpers/errors";
import {UserRole} from "@/lib/constants";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY_CHAT || "";

export const useChatClient = (userId: string, otherUserId: string = "") => {
    const [client, setClient] = useState<StreamChat | null>(null);
    const [channel, setChannel] = useState<StreamChannel | null>(null);
    const [allChannels, setAllChannels] = useState<StreamChannel[]>([]);
    const chatClientRef = useRef<StreamChat | null>(null);

    const { data: userData } = useGeneralUser(userId);

    const { mutateAsync: fetchChatToken } = useMutation({
        mutationFn: getStreamChatTokenFn,
    });

    const role: UserRole | undefined = userData?.role as UserRole | undefined;

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
        if (!userId || !role || !safeApiKey) return;
        if (!chatClientRef.current) {
            chatClientRef.current = StreamChat.getInstance(safeApiKey);
        }

        let mounted = true;
        const currentClient = chatClientRef.current!;

        const init = async () => {
            try {
                const token = await fetchChatToken({
                    id: userId,
                    name: userData?.name ?? userId,
                    role,
                } as GetChatTokenParams);

                if (!currentClient.userID) {
                    await currentClient.connectUser(
                        { id: userId, name: userData?.name ?? undefined },
                        token
                    );
                }

                if (mounted) setClient(currentClient);

                // 3) role-based logic
                if (role === "admin") {
                    const adminChannels = await fetchAdminChannels(currentClient);
                    if (adminChannels.length > 0) {
                        await selectChannel(adminChannels[0]);
                    } else {
                        setChannel(null);
                    }
                } else if (role === "user" && otherUserId) {
                    const sorted = [userId, otherUserId].sort();
                    const channelId = `dm_${sorted[0]}_${sorted[1]}`;

                    // Try to find the channel by id
                    const channels = await currentClient.queryChannels(
                        { type: "messaging", id: { $eq: channelId } }, // correct id filter
                        {},
                        { watch: true, state: true }
                    );

                    if (channels.length === 0) {
                        const name = `${userData?.name ?? userId} & ${otherUserId} Chat`;
                        const newChannel = currentClient.channel("messaging", channelId, {
                            members: sorted,
                            created_by_id: userId,
                            name,
                        });
                        await newChannel.watch();
                        setChannel(newChannel);
                    } else {
                        setChannel(channels[0]);
                    }
                }
            } catch (e:any) {
                console.error("Error initializing chat:", e);
                Toast.error(getErrorMessage(e));
            }
        };

        init();

        return () => {
            mounted = false;
            // Disconnect the same client on unmount
            if (currentClient.userID) {
                currentClient.disconnectUser();
            }
        };
    }, [userId, role, otherUserId, userData?.name, safeApiKey]);

    return {
        client,
        channel,
        allChannels,
        selectChannel,
        isAdmin: role === "admin",
    };
};
