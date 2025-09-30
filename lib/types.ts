export interface User {
  id: string
  username: string
  avatar?: string
  status: "online" | "idle" | "dnd" | "offline"
}

export interface Clan {
  id: string
  name: string
  icon?: string
  ownerId: string
}

export interface Category {
  id: string
  name: string
  clanId: string
  position: number
}

export interface Channel {
  id: string
  name: string
  type: "text" | "voice"
  categoryId: string
  clanId: string
  position: number
}

export interface Message {
  id: string
  content: string
  authorId: string
  author: User
  channelId: string
  createdAt: string
  updatedAt?: string
  attachments?: MessageAttachment[]
  sticker?: Sticker
}

export interface MessageAttachment {
  id: string
  url: string
  filename: string
  contentType: string
  size: number
}

export interface Sticker {
  id: string
  name: string
  url: string
}
