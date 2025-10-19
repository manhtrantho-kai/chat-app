"use client"

import { useState } from "react"
import { Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { apiClient } from "@/lib/api"
import type { Clan } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"

interface ClanInfoDialogProps {
  clan: Clan
  open: boolean
  onOpenChange: (open: boolean) => void
  onClanDeleted?: () => void
}

export function ClanInfoDialog({ clan, open, onOpenChange, onClanDeleted }: ClanInfoDialogProps) {
  const { user } = useAuth()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  const isOwner = user?.id === clan.ownerId

  const handleDelete = async () => {
    setError("")
    setIsDeleting(true)

    try {
      await apiClient.deleteClan(clan.id)
      setShowDeleteConfirm(false)
      onOpenChange(false)
      onClanDeleted?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xóa server")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="border-none bg-[#313338] text-white">
          <DialogHeader>
            <DialogTitle>Thông tin Server</DialogTitle>
            <DialogDescription className="text-[#b5bac1]">Chi tiết về server {clan.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Server Avatar */}
            <div className="flex items-center gap-4">
              {clan.icon ? (
                <img
                  src={clan.icon || "/placeholder.svg"}
                  alt={clan.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#5865f2] text-xl font-bold">
                  {clan.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{clan.name}</h3>
                <p className="text-sm text-[#b5bac1]">ID: {clan.id}</p>
              </div>
            </div>

            {/* Owner Info */}
            <div className="rounded-md bg-[#2b2d31] p-3">
              <p className="text-xs font-semibold uppercase text-[#b5bac1]">Chủ sở hữu</p>
              <p className="mt-1 text-sm">{isOwner ? "Bạn" : `User ID: ${clan.ownerId}`}</p>
            </div>

            {/* Delete Section - Only show if user is owner */}
            {isOwner && (
              <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-400" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-400">Vùng nguy hiểm</p>
                    <p className="mt-1 text-xs text-[#b5bac1]">
                      Xóa server sẽ xóa vĩnh viễn tất cả dữ liệu, bao gồm channels, messages và members.
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-3 bg-red-500 hover:bg-red-600"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa Server
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {error && <div className="text-sm text-red-400">{error}</div>}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-white hover:bg-[#4e5058]">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="border-none bg-[#313338] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa server</AlertDialogTitle>
            <AlertDialogDescription className="text-[#b5bac1]">
              Bạn có chắc chắn muốn xóa server <span className="font-semibold text-white">{clan.name}</span>? Hành động
              này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-none bg-[#4e5058] text-white hover:bg-[#5d5f66]">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-500 hover:bg-red-600">
              {isDeleting ? "Đang xóa..." : "Xóa Server"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
