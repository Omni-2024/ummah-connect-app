"use client"

import { useChat } from "@/components/getStream/chat/ChatContextProvider"
import FloatingChatWidget from "@/components/getStream/chat/ChatWidgetComponent"
import { useGeneralUser } from "@/lib/hooks/useUser"
import { useAuthState } from "@/features/auth/context/useAuthState"

const ChatWidgetWrapper = () => {
    const { userId } = useChat()
    const { id } = useAuthState()
    const { data: currentUser } = useGeneralUser(id)

    // On build or when not logged in, just render nothing.
    if (!id || !currentUser) {
        return null
    }

    return (
        <FloatingChatWidget
            userId={currentUser.id}
            otherUserId={userId ?? ""}
        />
    )
}

export default ChatWidgetWrapper
