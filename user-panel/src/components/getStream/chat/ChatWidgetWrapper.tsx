'use client'

import { useChat } from '@/components/getStream/chat/ChatContextProvider';
import FloatingChatWidget from '@/components/getStream/chat/ChatWidgetComponent';
import {useGeneralUser} from "@/lib/hooks/useUser";
import {useAuthState} from "@/features/auth/context/useAuthState";

export const ChatWidgetWrapper = () => {
    const { userId } = useChat();
    const {id}=useAuthState()
    const { data: currentUser } = useGeneralUser(id);

    if ( !currentUser) {
        console.log("This is reaching")
        return null;
    }

    return (
        <FloatingChatWidget
            userId={currentUser.id}
            otherUserId={userId ?? ""}
        />
    );
};