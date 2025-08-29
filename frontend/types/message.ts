export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: string
}

export interface Conversation {
  id: string
  participants: string[]
  lastMessage?: Message
  updatedAt: string
}
