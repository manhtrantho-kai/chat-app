// API configuration for Go backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
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

  // Authentication endpoints
  async login(username: string, password: string) {
    return this.request<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  async register(username: string, email: string, password: string) {
    return this.request<{ token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    })
  }

  async getCurrentUser(token: string) {
    return this.request("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }
}

export const apiClient = new ApiClient()
