// API configuration for Go backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface UploadResponse {
  urls: string[]
}

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
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (!response.ok || data.error) {
      // Map backend error messages to user-friendly Vietnamese messages
      const errorMessages: Record<string, string> = {
        "Invalid request": "Yêu cầu không hợp lệ",
        "User not found": "Không tìm thấy người dùng",
        "Wrong password": "Mật khẩu không đúng",
        "Token creation error": "Lỗi tạo phiên đăng nhập. Vui lòng thử lại.",
      }

      const errorMessage = errorMessages[data.error] || data.error || "Đăng nhập thất bại"
      throw new Error(errorMessage)
    }

    return data
  }

  async register(username: string, email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })

    const data = await response.json()

    if (!response.ok || data.error) {
      // Map backend error messages to user-friendly Vietnamese messages
      const errorMessages: Record<string, string> = {
        "Invalid request": "Yêu cầu không hợp lệ",
        "Hash error": "Lỗi mã hóa mật khẩu. Vui lòng thử lại.",
        "User exists": "Tên đăng nhập đã tồn tại",
        "Token creation error": "Lỗi tạo phiên đăng nhập. Vui lòng thử lại.",
      }

      const errorMessage = errorMessages[data.error] || data.error || "Đăng ký thất bại"
      throw new Error(errorMessage)
    }

    return data
  }

  async getCurrentUser(token: string) {
    return this.request("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // User endpoints
  async updateUser(data: any) {
    return this.request("/user/update", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Image upload endpoint
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append("files", file) // Backend expects "files" field name

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    const response = await fetch(`${this.baseUrl}/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // Clan management endpoints
  async createClan(name: string, avatar: string) {
    return this.request("/clans", {
      method: "POST",
      body: JSON.stringify({ name, avatar }),
    })
  }

  // Category management endpoints
  async createCategory(clanId: string, name: string, position: number) {
    return this.request(`/clans/${clanId}/categories`, {
      method: "POST",
      body: JSON.stringify({ name, position }),
    })
  }

  // Channel management endpoints
  async createChannel(clanId: string, name: string, type: string, position: number) {
    return this.request(`/clans/${clanId}/channels`, {
      method: "POST",
      body: JSON.stringify({ name, type, position }),
    })
  }
}

export const apiClient = new ApiClient()
