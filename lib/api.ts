// API configuration for Go backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // Clan endpoints
  async getClans() {
    return this.request("/clans")
  }

  async getClan(clanId: string) {
    return this.request(`/clans/${clanId}`)
  }

  // Category endpoints
  async getCategories(clanId: string) {
    return this.request(`/clans/${clanId}/categories`)
  }

  // Channel endpoints
  async getChannels(clanId: string) {
    return this.request(`/clans/${clanId}/channels`)
  }

  async getChannel(channelId: string) {
    return this.request(`/channels/${channelId}`)
  }

  // Message endpoints
  async getMessages(channelId: string, limit = 50) {
    return this.request(`/channels/${channelId}/messages?limit=${limit}`)
  }

  async sendMessage(channelId: string, content: string, attachments?: File[]) {
    const formData = new FormData()
    formData.append("content", content)

    if (attachments) {
      attachments.forEach((file) => {
        formData.append("attachments", file)
      })
    }

    const response = await fetch(`${this.baseUrl}/channels/${channelId}/messages`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async sendSticker(channelId: string, stickerId: string) {
    return this.request(`/channels/${channelId}/messages`, {
      method: "POST",
      body: JSON.stringify({ stickerId }),
    })
  }

  // Sticker endpoints
  async getStickers() {
    return this.request("/stickers")
  }
}

export const apiClient = new ApiClient()
