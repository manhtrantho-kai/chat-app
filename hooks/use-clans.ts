"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import type { Clan, Category, Channel } from "@/lib/types"

export function useClans() {
  const [clans, setClans] = useState<Clan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClans = async () => {
      try {
        setLoading(true)
        const data = await apiClient.getClans()
        setClans(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch clans")
      } finally {
        setLoading(false)
      }
    }

    fetchClans()
  }, [])

  return { clans, loading, error }
}

export function useClanData(clanId: string) {
  const [categories, setCategories] = useState<Category[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClanData = async () => {
      try {
        setLoading(true)
        const [categoriesData, channelsData] = await Promise.all([
          apiClient.getCategories(clanId),
          apiClient.getChannels(clanId),
        ])
        setCategories(categoriesData)
        setChannels(channelsData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch clan data")
      } finally {
        setLoading(false)
      }
    }

    if (clanId) {
      fetchClanData()
    }
  }, [clanId])

  return { categories, channels, loading, error }
}
