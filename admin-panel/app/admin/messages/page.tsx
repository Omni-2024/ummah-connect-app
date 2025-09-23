"use client"
import {ChatWidgetWrapper} from "@/components/getStream/chat/ChatWidgetWrapper";
import {useChat} from "@/components/getStream/chat/ChatContextProvider"
import {useCurrentUser} from "@/lib/hooks/useUserInfo";
import {useEffect} from "react";
export default function AdminMessagesPage() {
    const { setUserId } = useChat();
    const { data: currentUser } = useCurrentUser()
    useEffect(() => {
        if (currentUser) setUserId(currentUser.id);
    }, [currentUser]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-2">Platform communication and support messages</p>
      </div>

      <div className="bg-card p-8 rounded-lg border border-border text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">Message Center</h2>
          <ChatWidgetWrapper />
      </div>
    </div>
  )
}
