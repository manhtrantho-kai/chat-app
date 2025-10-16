"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(username, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#313338] p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-[#2b2d31] p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Chào mừng trở lại!</h1>
          <p className="mt-2 text-sm text-gray-400">Rất vui được gặp lại bạn!</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-xs font-semibold uppercase text-gray-400">
                Tên đăng nhập
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 bg-[#1e1f22] border-none text-white placeholder:text-gray-500"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-xs font-semibold uppercase text-gray-400">
                Mật khẩu
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 bg-[#1e1f22] border-none text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <Button type="submit" disabled={isLoading} className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white">
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          <div className="text-sm text-gray-400">
            Bạn chưa có tài khoản?{" "}
            <Link href="/register" className="text-[#00a8fc] hover:underline">
              Đăng ký
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
