"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ServerSidebar } from "@/components/server-sidebar"
import { ChannelSidebar } from "@/components/channel-sidebar"
import { ChatArea } from "@/components/chat-area"
import { mockClans, mockCategories, mockChannels } from "@/lib/mock-data"

export default function ChatPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [selectedClanId, setSelectedClanId] = useState("1")
  const [selectedChannelId, setSelectedChannelId] = useState("1")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#313338]">
        <div className="text-white">Đang tải...</div>
      </div>
    )
  }

  const selectedClan = mockClans.find((c) => c.id === selectedClanId)
  const clanCategories = mockCategories.filter((c) => c.clanId === selectedClanId)
  const clanChannels = mockChannels.filter((c) => c.clanId === selectedClanId)

  return (
    <div className="flex h-screen overflow-hidden dark">
      <ServerSidebar clans={mockClans} selectedClanId={selectedClanId} onSelectClan={setSelectedClanId} />
      <ChannelSidebar
        clan={selectedClan}
        categories={clanCategories}
        channels={clanChannels}
        selectedChannelId={selectedChannelId}
        onSelectChannel={setSelectedChannelId}
      />
      <ChatArea
        channelId={selectedChannelId}
        channelName={clanChannels.find((c) => c.id === selectedChannelId)?.name || ""}
      />
    </div>
  )
}
