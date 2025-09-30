import type { Clan, Category, Channel, Message, User, Sticker } from "./types"

export const mockUser: User = {
  id: "1",
  username: "CurrentUser",
  avatar: "/diverse-user-avatars.png",
  status: "online",
}

export const mockClans: Clan[] = [
  {
    id: "1",
    name: "Gaming Squad",
    icon: "/abstract-gaming-logo.png",
    ownerId: "1",
  },
  {
    id: "2",
    name: "Dev Team",
    icon: "/code-logo.png",
    ownerId: "1",
  },
  {
    id: "3",
    name: "Music Lovers",
    icon: "/abstract-music-logo.png",
    ownerId: "2",
  },
]

export const mockCategories: Category[] = [
  { id: "1", name: "TEXT CHANNELS", clanId: "1", position: 0 },
  { id: "2", name: "VOICE CHANNELS", clanId: "1", position: 1 },
]

export const mockChannels: Channel[] = [
  { id: "1", name: "general", type: "text", categoryId: "1", clanId: "1", position: 0 },
  { id: "2", name: "random", type: "text", categoryId: "1", clanId: "1", position: 1 },
  { id: "3", name: "memes", type: "text", categoryId: "1", clanId: "1", position: 2 },
  { id: "4", name: "General Voice", type: "voice", categoryId: "2", clanId: "1", position: 0 },
  { id: "5", name: "Gaming", type: "voice", categoryId: "2", clanId: "1", position: 1 },
]

export const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hey everyone! Welcome to the server!",
    authorId: "1",
    author: {
      id: "1",
      username: "ServerAdmin",
      avatar: "/admin-avatar.png",
      status: "online",
    },
    channelId: "1",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    content: "Thanks for having me!",
    authorId: "2",
    author: {
      id: "2",
      username: "GamerPro",
      avatar: "/gamer-avatar.png",
      status: "online",
    },
    channelId: "1",
    createdAt: new Date(Date.now() - 3000000).toISOString(),
  },
  {
    id: "3",
    content: "Check out this cool screenshot!",
    authorId: "3",
    author: {
      id: "3",
      username: "DesignGuru",
      avatar: "/diverse-designer-avatars.png",
      status: "idle",
    },
    channelId: "1",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    attachments: [
      {
        id: "1",
        url: "/fantasy-game-battle.png",
        filename: "screenshot.png",
        contentType: "image/png",
        size: 1024000,
      },
    ],
  },
]

export const mockStickers: Sticker[] = [
  { id: "1", name: "Happy", url: "/happy-emoji.png" },
  { id: "2", name: "Sad", url: "/sad-emoji.jpg" },
  { id: "3", name: "Love", url: "/heart-emoji.png" },
  { id: "4", name: "Fire", url: "/fire-emoji.png" },
  { id: "5", name: "Thumbs Up", url: "/thumbs-up.png" },
  { id: "6", name: "Party", url: "/party-emoji.jpg" },
]
