"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Message } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

interface MessageListProps {
  messages: Message[]
  currentUserId?: string
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-2 text-2xl font-bold text-[#dbdee1]">Welcome to the channel!</div>
          <div className="text-[#949ba4]">This is the beginning of your conversation.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.map((message, index) => {
        const showAvatar = index === 0 || messages[index - 1].authorId !== message.authorId
        const timeDiff =
          index > 0 ? new Date(message.createdAt).getTime() - new Date(messages[index - 1].createdAt).getTime() : 0
        const showTimestamp = showAvatar || timeDiff > 300000 // 5 minutes
        const isCurrentUser = currentUserId && message.authorId === currentUserId

        return (
          <div key={message.id} className="group relative">
            {showTimestamp ? (
              <div className="flex gap-4 hover:bg-[#2e3035]">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={message.author.avatar || "/placeholder.svg"} alt={message.author.username} />
                  <AvatarFallback className="bg-[#5865f2] text-white">
                    {message.author.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-1 flex items-baseline gap-2">
                    <span className="text-base font-semibold text-white">
                      {message.author.username}
                      {isCurrentUser && <span className="ml-2 text-xs text-[#949ba4]">(Bạn)</span>}
                    </span>
                    <span className="text-xs text-[#949ba4]">
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true, locale: vi })}
                    </span>
                  </div>
                  <div className="text-base leading-relaxed text-[#dbdee1]">{message.content}</div>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id} className="overflow-hidden rounded-md">
                          {attachment.contentType.startsWith("image/") ? (
                            <img
                              src={attachment.url || "/placeholder.svg"}
                              alt={attachment.filename}
                              className="max-h-[300px] max-w-[400px] rounded-md object-cover"
                            />
                          ) : (
                            <div className="flex items-center gap-2 rounded bg-[#2b2d31] p-3">
                              <div className="text-sm text-[#dbdee1]">{attachment.filename}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {message.sticker && (
                    <div className="mt-2">
                      <img
                        src={message.sticker.url || "/placeholder.svg"}
                        alt={message.sticker.name}
                        className="h-40 w-40"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex gap-4 pl-14 hover:bg-[#2e3035]">
                <div className="flex-1">
                  <div className="text-base leading-relaxed text-[#dbdee1]">{message.content}</div>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id} className="overflow-hidden rounded-md">
                          {attachment.contentType.startsWith("image/") ? (
                            <img
                              src={attachment.url || "/placeholder.svg"}
                              alt={attachment.filename}
                              className="max-h-[300px] max-w-[400px] rounded-md object-cover"
                            />
                          ) : (
                            <div className="flex items-center gap-2 rounded bg-[#2b2d31] p-3">
                              <div className="text-sm text-[#dbdee1]">{attachment.filename}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {message.sticker && (
                    <div className="mt-2">
                      <img
                        src={message.sticker.url || "/placeholder.svg"}
                        alt={message.sticker.name}
                        className="h-40 w-40"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
