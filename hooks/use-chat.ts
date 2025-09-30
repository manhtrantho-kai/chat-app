"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api"
import type { Message } from "@/lib/types"

export function useChat(channelId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      const data = await apiClient.getMessages(channelId)
      setMessages(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages")
    } finally {
      setLoading(false)
    }
  }, [channelId])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const sendMessage = async (content: string, attachments?: File[]) => {
    try {
      const newMessage = await apiClient.sendMessage(channelId, content, attachments)
      setMessages((prev) => [...prev, newMessage])
      return newMessage
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message")
      throw err
    }
  }

  const sendSticker = async (stickerId: string) => {
    try {
      const newMessage = await apiClient.sendSticker(channelId, stickerId)
      setMessages((prev) => [...prev, newMessage])
      return newMessage
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send sticker")
      throw err
    }
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
    sendSticker,
    refetch: fetchMessages,
  }
}
