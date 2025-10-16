"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
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
import { apiClient } from "@/lib/api"
import type { UploadResponse } from "@/lib/types"

interface CreateClanDialogProps {
  onClanCreated?: () => void
}

export function CreateClanDialog({ onClanCreated }: CreateClanDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      let avatarUrl = ""

      if (avatarFile) {
        const uploadResponse: UploadResponse = await apiClient.uploadImage(avatarFile)
        avatarUrl = uploadResponse.urls[0]
      }

      await apiClient.createClan(name, avatarUrl)

      setOpen(false)
      setName("")
      setAvatarFile(null)
      setAvatarPreview("")
      onClanCreated?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo server")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-[24px] bg-[#313338] text-[#23a559] transition-all hover:rounded-[16px] hover:bg-[#23a559] hover:text-white"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#313338] text-white border-none">
        <DialogHeader>
          <DialogTitle>Tạo Server</DialogTitle>
          <DialogDescription className="text-[#b5bac1]">
            Tạo server mới để bắt đầu trò chuyện với bạn bè
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview || "/placeholder.svg"}
                    alt="Avatar preview"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-[#5865f2] flex items-center justify-center">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-xs text-[#b5bac1]">Click để tải lên avatar</p>
            </div>

            <div>
              <Label htmlFor="clan-name" className="text-xs font-semibold uppercase text-[#b5bac1]">
                Tên Server
              </Label>
              <Input
                id="clan-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 bg-[#1e1f22] border-none text-white"
                placeholder="Server của tôi"
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
              {isLoading ? "Đang tạo..." : "Tạo Server"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
