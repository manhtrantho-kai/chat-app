"use client"

import { useState, useEffect, useRef } from "react"
import { Hash, Users, Bell, Pin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageList } from "@/components/message-list"
import { MessageInput } from "@/components/message-input"
import { mockMessages } from "@/lib/mock-data"
import type { Message } from "@/lib/types"

interface ChatAreaProps {
  channelId: string
  channelName: string
}

export function ChatArea({ channelId, channelName }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate loading messages for the selected channel
    setMessages(mockMessages.filter((m) => m.channelId === channelId))
  }, [channelId])

  const handleSendMessage = (content: string, attachments?: File[], stickerId?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      authorId: "1",
      author: {
        id: "1",
        username: "CurrentUser",
        avatar: "/diverse-user-avatars.png",
        status: "online",
      },
      channelId,
      createdAt: new Date().toISOString(),
      attachments: attachments?.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        filename: file.name,
        contentType: file.type,
        size: file.size,
      })),
      sticker: stickerId
        ? {
            id: stickerId,
            name: "Sticker",
            url: "/placeholder.svg",
          }
        : undefined,
    }

    setMessages((prev) => [...prev, newMessage])
  }

  return (
    <div className="flex flex-1 flex-col bg-[#313338]">
      {/* Channel Header */}
      <div className="flex h-12 items-center justify-between border-b border-[#26272b] px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Hash className="h-6 w-6 text-[#80848e]" />
          <span className="text-base font-semibold text-white">{channelName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-[#b5bac1] hover:text-[#dbdee1]">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-[#b5bac1] hover:text-[#dbdee1]">
            <Pin className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-[#b5bac1] hover:text-[#dbdee1]">
            <Users className="h-5 w-5" />
          </Button>
          <div className="ml-2 h-6 w-px bg-[#3f4147]" />
          <Button variant="ghost" size="icon" className="h-6 w-6 text-[#b5bac1] hover:text-[#dbdee1]">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <MessageList messages={messages} />
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4">
        <MessageInput channelName={channelName} onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}
