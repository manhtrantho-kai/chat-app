"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Plus, ImageIcon, Smile, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { StickerPicker } from "@/components/sticker-picker"

interface MessageInputProps {
  channelName: string
  onSendMessage: (content: string, attachments?: File[], stickerId?: string) => void
}

export function MessageInput({ channelName, onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments)
      setMessage("")
      setAttachments([])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleStickerSelect = (stickerId: string) => {
    onSendMessage("", [], stickerId)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Attachment Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 rounded-lg bg-[#2b2d31] p-3">
          {attachments.map((file, index) => (
            <div key={index} className="relative">
              {file.type.startsWith("image/") ? (
                <div className="group relative h-20 w-20 overflow-hidden rounded">
                  <img
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-6 w-6 rounded-full bg-[#313338] opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-4 w-4 text-white" />
                  </Button>
                </div>
              ) : (
                <div className="group relative flex items-center gap-2 rounded bg-[#1e1f22] p-2">
                  <div className="max-w-[150px] truncate text-sm text-[#dbdee1]">{file.name}</div>
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeAttachment(index)}>
                    <X className="h-3 w-3 text-[#b5bac1]" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-center gap-2 rounded-lg bg-[#383a40] px-4 py-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-[#b5bac1] hover:text-[#dbdee1]"
          onClick={() => fileInputRef.current?.click()}
        >
          <Plus className="h-5 w-5" />
        </Button>

        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Message #${channelName}`}
          className="flex-1 border-0 bg-transparent text-base text-[#dbdee1] placeholder:text-[#6d6f78] focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-[#b5bac1] hover:text-[#dbdee1]"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-5 w-5" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-[#b5bac1] hover:text-[#dbdee1]">
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] border-[#1e1f22] bg-[#2b2d31] p-0">
            <StickerPicker onSelectSticker={handleStickerSelect} />
          </PopoverContent>
        </Popover>

        {(message.trim() || attachments.length > 0) && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-[#5865f2] hover:text-[#4752c4]"
            onClick={handleSend}
          >
            <Send className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
