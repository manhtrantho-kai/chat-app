"use client"

import { ChevronDown, Hash, Volume2, Settings, UserPlus, Plus, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import type { Clan, Category, Channel } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface ChannelSidebarProps {
  clan?: Clan
  categories: Category[]
  channels: Channel[]
  selectedChannelId: string
  onSelectChannel: (channelId: string) => void
}

export function ChannelSidebar({
  clan,
  categories,
  channels,
  selectedChannelId,
  onSelectChannel,
}: ChannelSidebarProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!clan) {
    return (
      <div className="flex w-60 flex-col bg-[#2b2d31]">
        <div className="flex h-12 items-center px-4 text-sm font-semibold text-white shadow-md">Select a server</div>
      </div>
    )
  }

  return (
    <div className="flex w-60 flex-col bg-[#2b2d31]">
      {/* Server Header */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-12 w-full justify-between rounded-none px-4 text-base font-semibold text-white hover:bg-[#35373c]"
          >
            <span className="truncate">{clan.name}</span>
            <ChevronDown className="h-5 w-5 flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-[#111214] text-[#b5bac1]">
          <DropdownMenuItem className="text-[#949ba4] hover:bg-[#5865f2] hover:text-white focus:bg-[#5865f2] focus:text-white">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite People
          </DropdownMenuItem>
          <DropdownMenuItem className="text-[#949ba4] hover:bg-[#5865f2] hover:text-white focus:bg-[#5865f2] focus:text-white">
            <Settings className="mr-2 h-4 w-4" />
            Server Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[#3f4147]" />
          <DropdownMenuItem className="text-[#f23f42] hover:bg-[#f23f42] hover:text-white focus:bg-[#f23f42] focus:text-white">
            Leave Server
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Channels List */}
      <ScrollArea className="flex-1">
        <div className="px-2 py-3">
          {categories.map((category) => {
            const categoryChannels = channels.filter((ch) => ch.categoryId === category.id)

            return (
              <div key={category.id} className="mb-2">
                {/* Category Header */}
                <div className="group mb-1 flex items-center justify-between px-2 py-1">
                  <div className="flex items-center gap-1">
                    <ChevronDown className="h-3 w-3 text-[#80848e]" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#80848e]">
                      {category.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 opacity-0 transition-opacity hover:text-[#dbdee1] group-hover:opacity-100"
                  >
                    <Plus className="h-4 w-4 text-[#80848e]" />
                  </Button>
                </div>

                {/* Channels in Category */}
                {categoryChannels.map((channel) => (
                  <Button
                    key={channel.id}
                    variant="ghost"
                    className={cn(
                      "mb-0.5 h-8 w-full justify-start gap-1.5 rounded px-2 text-[#80848e] hover:bg-[#35373c] hover:text-[#dbdee1]",
                      selectedChannelId === channel.id && "bg-[#404249] text-white hover:bg-[#404249] hover:text-white",
                    )}
                    onClick={() => onSelectChannel(channel.id)}
                  >
                    {channel.type === "text" ? (
                      <Hash className="h-5 w-5 flex-shrink-0" />
                    ) : (
                      <Volume2 className="h-5 w-5 flex-shrink-0" />
                    )}
                    <span className="truncate text-base">{channel.name}</span>
                  </Button>
                ))}
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {/* User Panel */}
      <div className="flex h-[52px] items-center gap-2 bg-[#232428] px-2">
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          <div className="relative">
            {user?.avatar ? (
              <img src={user.avatar || "/placeholder.svg"} alt={user.username} className="h-8 w-8 rounded-full" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-[#5865f2]" />
            )}
            <div
              className={cn(
                "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#232428]",
                user?.status === "online" && "bg-[#23a559]",
                user?.status === "idle" && "bg-[#f0b232]",
                user?.status === "dnd" && "bg-[#f23f42]",
                user?.status === "offline" && "bg-[#80848e]",
              )}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="truncate text-sm font-semibold text-white">{user?.username || "User"}</div>
            <div className="truncate text-xs text-[#80848e]">#{user?.id.slice(0, 4) || "0000"}</div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#b5bac1] hover:bg-[#35373c] hover:text-[#dbdee1]"
          onClick={() => router.push("/settings")}
        >
          <Settings className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#b5bac1] hover:bg-[#35373c] hover:text-[#f23f42]"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
