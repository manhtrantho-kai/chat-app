"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mockStickers } from "@/lib/mock-data"

interface StickerPickerProps {
  onSelectSticker: (stickerId: string) => void
}

export function StickerPicker({ onSelectSticker }: StickerPickerProps) {
  const [selectedTab, setSelectedTab] = useState("stickers")

  return (
    <div className="h-[400px] w-full">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full">
        <TabsList className="w-full justify-start rounded-none border-b border-[#1e1f22] bg-transparent p-0">
          <TabsTrigger
            value="emoji"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#5865f2] data-[state=active]:bg-transparent data-[state=active]:text-white"
          >
            Emoji
          </TabsTrigger>
          <TabsTrigger
            value="stickers"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#5865f2] data-[state=active]:bg-transparent data-[state=active]:text-white"
          >
            Stickers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="emoji" className="mt-0 h-[calc(100%-40px)]">
          <ScrollArea className="h-full p-4">
            <div className="grid grid-cols-8 gap-2">
              {[
                "😀",
                "😃",
                "😄",
                "😁",
                "😆",
                "😅",
                "🤣",
                "😂",
                "🙂",
                "🙃",
                "😉",
                "😊",
                "😇",
                "🥰",
                "😍",
                "🤩",
                "😘",
                "😗",
                "😚",
                "😙",
                "🥲",
                "😋",
                "😛",
                "😜",
                "🤪",
                "😝",
                "🤑",
                "🤗",
                "🤭",
                "🤫",
                "🤔",
                "🤐",
              ].map((emoji, index) => (
                <button
                  key={index}
                  className="flex h-10 w-10 items-center justify-center rounded text-2xl transition-colors hover:bg-[#404249]"
                  onClick={() => {
                    // In a real app, this would insert the emoji into the message
                    console.log("Selected emoji:", emoji)
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="stickers" className="mt-0 h-[calc(100%-40px)]">
          <ScrollArea className="h-full p-4">
            <div className="grid grid-cols-3 gap-3">
              {mockStickers.map((sticker) => (
                <button
                  key={sticker.id}
                  className="group relative aspect-square overflow-hidden rounded-lg transition-transform hover:scale-105"
                  onClick={() => onSelectSticker(sticker.id)}
                >
                  <img
                    src={sticker.url || "/placeholder.svg"}
                    alt={sticker.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-sm font-medium text-white">{sticker.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
