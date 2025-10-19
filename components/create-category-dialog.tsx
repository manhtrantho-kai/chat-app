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

interface CreateCategoryDialogProps {
  clanId: string
  onCategoryCreated?: () => void
  trigger?: React.ReactNode
}

export function CreateCategoryDialog({ clanId, onCategoryCreated, trigger }: CreateCategoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await apiClient.createCategory(clanId, name, 0)

      setOpen(false)
      setName("")
      onCategoryCreated?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo category")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-4 w-4 text-[#80848e] hover:text-[#dbdee1]">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-[#313338] text-white border-none">
        <DialogHeader>
          <DialogTitle>Tạo Category</DialogTitle>
          <DialogDescription className="text-[#b5bac1]">Tạo category mới để tổ chức các channel</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="category-name" className="text-xs font-semibold uppercase text-[#b5bac1]">
                Tên Category
              </Label>
              <Input
                id="category-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 bg-[#1e1f22] border-none text-white"
                placeholder="Category mới"
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
              {isLoading ? "Đang tạo..." : "Tạo Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
