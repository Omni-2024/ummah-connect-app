'use client'

import { useChat } from '@/components/getStream/chat/ChatContextProvider';
import FloatingChatWidget from '@/components/getStream/chat/ChatWidgetComponent';
import { useAuth } from '@/contexts/AuthContexts';

export const ChatWidgetWrapper = () => {
    const { userId } = useChat();
    const { user: currentUser } = useAuth();

    if ( !currentUser) {
        console.log("This is reaching")
        return null;
    }

    return (
        <FloatingChatWidget
            userId={currentUser._id}
            otherUserId={userId ?? ""}
        />
    );
};