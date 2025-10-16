"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { X, Camera } from "lucide-react"
import { apiClient } from "@/lib/api"

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: (user as any)?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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
    setSuccess("")
    setIsLoading(true)

    try {
      let avatarUrl = user?.avatar

      if (avatarFile) {
        const uploadResponse = await apiClient.uploadImage(avatarFile)
        // Take only the first URL from the response
        avatarUrl = uploadResponse.urls[0]
      }

      // Prepare update data
      const updateData: any = {}

      if (formData.username !== user?.username) {
        updateData.username = formData.username
      }

      if (formData.email !== (user as any)?.email) {
        updateData.email = formData.email
      }

      if (avatarUrl !== user?.avatar) {
        updateData.avatar = avatarUrl
      }

      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("New passwords do not match")
        }
        if (!formData.currentPassword) {
          throw new Error("Current password is required to change password")
        }
        updateData.old_password = formData.currentPassword
        updateData.password = formData.newPassword
      }

      if (Object.keys(updateData).length > 0) {
        await updateUser(updateData)
        setSuccess("Profile updated successfully!")

        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }))
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#313338]">
      {/* Sidebar */}
      <div className="w-60 bg-[#2b2d31] p-4">
        <div className="mb-6">
          <h2 className="mb-2 text-xs font-semibold uppercase text-[#949ba4]">User Settings</h2>
          <div className="space-y-1">
            <div className="rounded bg-[#404249] px-3 py-2 text-sm text-white">My Account</div>
            <div className="cursor-pointer rounded px-3 py-2 text-sm text-[#b5bac1] hover:bg-[#35373c] hover:text-[#dbdee1]">
              Privacy & Safety
            </div>
            <div className="cursor-pointer rounded px-3 py-2 text-sm text-[#b5bac1] hover:bg-[#35373c] hover:text-[#dbdee1]">
              Authorized Apps
            </div>
            <div className="cursor-pointer rounded px-3 py-2 text-sm text-[#b5bac1] hover:bg-[#35373c] hover:text-[#dbdee1]">
              Connections
            </div>
          </div>
        </div>

        <Separator className="my-4 bg-[#3f4147]" />

        <div className="space-y-1">
          <div className="cursor-pointer rounded px-3 py-2 text-sm text-[#f23f42] hover:bg-[#35373c]" onClick={logout}>
            Log Out
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mx-auto max-w-[740px] p-10">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">My Account</h1>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#b5bac1] hover:text-white"
              onClick={() => router.back()}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Profile Section */}
          <div className="mb-6 rounded-lg bg-[#111214] p-4">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="h-20 w-20 overflow-hidden rounded-full bg-[#5865f2]">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview || "/placeholder.svg"}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                      {user?.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <Button
                  size="icon"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-[#5865f2] hover:bg-[#4752c4]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="mb-1 text-xl font-semibold text-white">{user?.username}</div>
                <div className="text-sm text-[#b5bac1]">{(user as any)?.email || "No email set"}</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <Label htmlFor="username" className="mb-2 block text-xs font-semibold uppercase text-[#b5bac1]">
                Username
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="border-[#1e1f22] bg-[#1e1f22] text-white focus-visible:ring-[#5865f2]"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase text-[#b5bac1]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border-[#1e1f22] bg-[#1e1f22] text-white focus-visible:ring-[#5865f2]"
              />
            </div>

            <Separator className="bg-[#3f4147]" />

            {/* Password Change Section */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white">Change Password</h3>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="currentPassword"
                    className="mb-2 block text-xs font-semibold uppercase text-[#b5bac1]"
                  >
                    Current Password
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="border-[#1e1f22] bg-[#1e1f22] text-white focus-visible:ring-[#5865f2]"
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword" className="mb-2 block text-xs font-semibold uppercase text-[#b5bac1]">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="border-[#1e1f22] bg-[#1e1f22] text-white focus-visible:ring-[#5865f2]"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-xs font-semibold uppercase text-[#b5bac1]"
                  >
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="border-[#1e1f22] bg-[#1e1f22] text-white focus-visible:ring-[#5865f2]"
                  />
                </div>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && <div className="rounded bg-[#f23f42]/10 p-3 text-sm text-[#f23f42]">{error}</div>}
            {success && <div className="rounded bg-[#23a559]/10 p-3 text-sm text-[#23a559]">{success}</div>}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="bg-[#5865f2] hover:bg-[#4752c4]">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
