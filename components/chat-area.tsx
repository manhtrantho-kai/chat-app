"use client"

import { useState, useEffect, useRef } from "react"
import { Hash, Users, Bell, Pin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageList } from "@/components/message-list"
import { MessageInput } from "@/components/message-input"
import { mockMessages } from "@/lib/mock-data"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"
import type { Message } from "@/lib/types"

interface ChatAreaProps {
  channelId: string
  channelName: string
}

export function ChatArea({ channelId, channelName }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchMessages = async () => {
      if (!channelId) return

      setIsLoading(true)
      try {
        console.log("[v0] Fetching messages for channel:", channelId)
        const data = await apiClient.getMessages(channelId)
        console.log("[v0] Messages fetched:", data)
        setMessages(data as Message[])
      } catch (error) {
        console.error("[v0] Failed to fetch messages:", error)
        // Fallback to mock data
        const filteredMockMessages = mockMessages.filter((m) => m.channelId === channelId)
        console.log("[v0] Using mock messages:", filteredMockMessages.length)
        setMessages(filteredMockMessages)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [channelId])

  const handleSendMessage = async (content: string, attachments?: File[], stickerId?: string) => {
    if (!user) {
      console.error("[v0] No user logged in")
      return
    }

    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      authorId: user.id,
      author: {
        id: user.id,
        username: user.username,
        avatar: user.avatar || "/placeholder.svg",
        status: user.status,
      },
      channelId,
      createdAt: new Date().toISOString(),
      attachments: attachments?.map((file, index) => ({
        id: `temp-${Date.now()}-${index}`,
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

    setMessages((prev) => [...prev, optimisticMessage])

    try {
      if (stickerId) {
        console.log("[v0] Sending sticker:", stickerId)
        await apiClient.sendSticker(channelId, stickerId)
      } else {
        console.log("[v0] Sending message:", { content, attachments: attachments?.length })
        await apiClient.sendMessage(channelId, content, attachments)
      }
      console.log("[v0] Message sent successfully")

      const data = await apiClient.getMessages(channelId)
      setMessages(data as Message[])
    } catch (error) {
      console.error("[v0] Failed to send message:", error)
      // Keep the optimistic message in UI even if API fails
    }
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
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-[#b5bac1]">Đang tải tin nhắn...</div>
          </div>
        ) : (
          <MessageList messages={messages} currentUserId={user?.id} />
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4">
        <MessageInput channelName={channelName} onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}
