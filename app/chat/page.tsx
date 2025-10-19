"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ServerSidebar } from "@/components/server-sidebar"
import { ChannelSidebar } from "@/components/channel-sidebar"
import { ChatArea } from "@/components/chat-area"
import { apiClient } from "@/lib/api"
import type { Clan, Category, Channel } from "@/lib/types"
import { Hash } from "lucide-react"

export default function ChatPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [selectedClanId, setSelectedClanId] = useState<string | null>(null)
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null)

  const [clans, setClans] = useState<Clan[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)

  const selectedClan = clans.find((c) => c.id === selectedClanId)
  const clanCategories = categories.filter((c) => c.clanId === selectedClanId)
  const clanChannels = channels.filter((c) => c.clanId === selectedClanId)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user && !isLoading) {
      const fetchClans = async () => {
        try {
          const data = await apiClient.getClans()
          console.log("[v0] Fetched clans:", data)
          setClans(data)
          if (data.length > 0) {
            setSelectedClanId(data[0].id)
          }
        } catch (error) {
          console.error("Failed to fetch clans:", error)
          console.log("[v0] API URL:", process.env.NEXT_PUBLIC_API_URL)
          console.log("[v0] Token:", localStorage.getItem("token"))

          const mockClans = [
            { id: "1", name: "General", icon: "/abstract-gaming-logo.png", ownerId: user.id },
            { id: "2", name: "Development", icon: "/code-logo.png", ownerId: user.id },
            { id: "3", name: "Music", icon: "/abstract-music-logo.png", ownerId: user.id },
          ]
          setClans(mockClans)
          setSelectedClanId(mockClans[0].id)
        }
      }
      fetchClans()
    }
  }, [user, isLoading])

  useEffect(() => {
    if (selectedClanId) {
      const fetchCategories = async () => {
        try {
          const data = await apiClient.getCategories(selectedClanId)
          console.log("[v0] Fetched categories:", data)
          setCategories(data)
          if (data.length === 0) {
            setChannels([])
            setLoading(false)
          }
        } catch (error) {
          console.error("Failed to fetch categories:", error)
          const mockCategories = [
            { id: "1", name: "TEXT CHANNELS", clanId: selectedClanId, position: 0 },
            { id: "2", name: "VOICE CHANNELS", clanId: selectedClanId, position: 1 },
          ]
          setCategories(mockCategories)
        }
      }
      fetchCategories()
    }
  }, [selectedClanId])

  useEffect(() => {
    if (categories.length > 0) {
      const fetchAllChannels = async () => {
        try {
          const allChannels: Channel[] = []
          console.log("[v0] Fetching channels for categories:", categories)
          for (const category of categories) {
            try {
              const data = await apiClient.getChannels(category.id)
              console.log(`[v0] Fetched channels for category ${category.id}:`, data)
              const channelsWithClanId = data.map((ch) => ({
                ...ch,
                clanId: ch.clanId || selectedClanId || category.clanId,
              }))
              allChannels.push(...channelsWithClanId)
            } catch (error) {
              console.error(`Failed to fetch channels for category ${category.id}:`, error)
              const mockChannels = [
                {
                  id: "1",
                  name: "general",
                  type: "text" as const,
                  categoryId: category.id,
                  clanId: selectedClanId || "1",
                  position: 0,
                },
                {
                  id: "2",
                  name: "random",
                  type: "text" as const,
                  categoryId: category.id,
                  clanId: selectedClanId || "1",
                  position: 1,
                },
              ]
              allChannels.push(...mockChannels)
            }
          }
          console.log("[v0] All fetched channels:", allChannels)
          setChannels(allChannels)
          if (allChannels.length > 0 && !selectedChannelId) {
            setSelectedChannelId(allChannels[0].id)
          }
          setLoading(false)
        } catch (error) {
          console.error("Failed to fetch channels:", error)
          setLoading(false)
        }
      }
      fetchAllChannels()
    } else if (selectedClanId && categories.length === 0) {
      setLoading(false)
    }
  }, [categories, selectedChannelId, selectedClanId])

  console.log("[v0] Render state:", {
    clans: clans.length,
    selectedClanId,
    selectedClan: !!selectedClan,
    loading,
    categories: categories.length,
    channels: channels.length,
    clanChannels: clanChannels.length,
  })

  return (
    <div className="flex h-screen overflow-hidden dark">
      <ServerSidebar clans={clans} selectedClanId={selectedClanId || ""} onSelectClan={setSelectedClanId} />
      <ChannelSidebar
        clan={selectedClan}
        categories={clanCategories}
        channels={clanChannels}
        selectedChannelId={selectedChannelId || ""}
        onSelectChannel={setSelectedChannelId}
      />
      {!selectedClan ? (
        <div className="flex flex-1 items-center justify-center bg-[#313338]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Chào mừng đến với Discord!</h2>
            <p className="text-[#b5bac1] mb-4">Tạo server đầu tiên của bạn để bắt đầu</p>
          </div>
        </div>
      ) : !selectedChannelId ? (
        <div className="flex flex-1 items-center justify-center bg-[#313338]">
          <div className="text-center">
            <Hash className="h-16 w-16 text-[#80848e] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Chọn một channel</h2>
            <p className="text-[#b5bac1]">
              {clanChannels.length === 0
                ? "Chưa có channel nào. Tạo channel đầu tiên để bắt đầu trò chuyện!"
                : "Chọn một channel từ sidebar để bắt đầu trò chuyện"}
            </p>
          </div>
        </div>
      ) : (
        <ChatArea
          channelId={selectedChannelId}
          channelName={clanChannels.find((c) => c.id === selectedChannelId)?.name || ""}
        />
      )}
    </div>
  )
}
