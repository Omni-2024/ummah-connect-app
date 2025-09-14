import {useSnapshot} from "valtio/index";

import {chatState, setIsOneChat, setProviderId} from "@/features/provider/context/ProviderChatState";

export const useProviderChatState = () => {
    const snap = useSnapshot(chatState);
    return {
        providerId: snap.providerId,
        setProviderId:setProviderId,
        isOneChat:snap.isOneChat,
        setIsOneChat:setIsOneChat
    };
};