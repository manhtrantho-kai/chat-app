"use client"

import { useState } from "react"
import { ServerSidebar } from "@/components/server-sidebar"
import { ChannelSidebar } from "@/components/channel-sidebar"
import { ChatArea } from "@/components/chat-area"
import { mockClans, mockCategories, mockChannels } from "@/lib/mock-data"

export default function DiscordApp() {
  const [selectedClanId, setSelectedClanId] = useState("1")
  const [selectedChannelId, setSelectedChannelId] = useState("1")

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
