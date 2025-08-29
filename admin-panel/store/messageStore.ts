import { proxy } from "valtio"
import type { Message, Conversation } from "@/types/message"

interface MessageStore {
  conversations: Conversation[]
  messages: Record<string, Message[]> // conversationId -> messages
  setConversations: (conversations: Conversation[]) => void
  setMessages: (conversationId: string, messages: Message[]) => void
  addMessage: (conversationId: string, message: Message) => void
  markAsRead: (conversationId: string, messageId: string) => void
}

export const messageStore = proxy<MessageStore>({
  conversations: [],
  messages: {},

  setConversations: (conversations: Conversation[]) => {
    messageStore.conversations = conversations
  },

  setMessages: (conversationId: string, messages: Message[]) => {
    messageStore.messages[conversationId] = messages
  },

  addMessage: (conversationId: string, message: Message) => {
    if (!messageStore.messages[conversationId]) {
      messageStore.messages[conversationId] = []
    }
    messageStore.messages[conversationId].push(message)
  },

  markAsRead: (conversationId: string, messageId: string) => {
    const messages = messageStore.messages[conversationId]
    if (messages) {
      const message = messages.find((m) => m.id === messageId)
      if (message) {
        message.isRead = true
      }
    }
  },
})
