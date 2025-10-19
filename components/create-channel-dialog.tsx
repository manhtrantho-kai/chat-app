"use client"

import type React from "react"

import { useState } from "react"
import { Hash, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { apiClient } from "@/lib/api"

interface CreateChannelDialogProps {
  clanId: string
  categoryId: string
  trigger?: React.ReactNode
  onChannelCreated?: () => void
}

export function CreateChannelDialog({ clanId, categoryId, trigger, onChannelCreated }: CreateChannelDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [type, setType] = useState<"text" | "voice">("text")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await apiClient.createChannel(categoryId, name, type, 0)

      setOpen(false)
      setName("")
      setType("text")
      onChannelCreated?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo channel")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-[#313338] text-white border-none">
        <DialogHeader>
          <DialogTitle>Tạo Channel</DialogTitle>
          <DialogDescription className="text-[#b5bac1]">Tạo channel mới để trò chuyện</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-xs font-semibold uppercase text-[#b5bac1]">Loại Channel</Label>
              <RadioGroup value={type} onValueChange={(value) => setType(value as "text" | "voice")} className="mt-2">
                <div className="flex items-center space-x-2 rounded p-3 hover:bg-[#2b2d31] cursor-pointer">
                  <RadioGroupItem value="text" id="text" />
                  <Label htmlFor="text" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Hash className="h-5 w-5 text-[#80848e]" />
                    <div>
                      <div className="font-semibold">Text</div>
                      <div className="text-xs text-[#b5bac1]">Gửi tin nhắn, hình ảnh, sticker</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded p-3 hover:bg-[#2b2d31] cursor-pointer">
                  <RadioGroupItem value="voice" id="voice" />
                  <Label htmlFor="voice" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Volume2 className="h-5 w-5 text-[#80848e]" />
                    <div>
                      <div className="font-semibold">Voice</div>
                      <div className="text-xs text-[#b5bac1]">Trò chuyện bằng giọng nói</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="channel-name" className="text-xs font-semibold uppercase text-[#b5bac1]">
                Tên Channel
              </Label>
              <Input
                id="channel-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 bg-[#1e1f22] border-none text-white"
                placeholder="channel-mới"
              />
            </div>

            {error && <div className="text-sm text-red-400">{error}</div>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-white hover:bg-[#4e5058]"
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading || !name} className="bg-[#5865f2] hover:bg-[#4752c4]">
              {isLoading ? "Đang tạo..." : "Tạo Channel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
