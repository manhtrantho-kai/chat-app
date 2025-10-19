"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
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
import { useAuth } from "@/contexts/auth-context"
import type { Category, Clan } from "@/lib/types"

interface CategoryInfoDialogProps {
  category: Category
  clan: Clan
  open: boolean
  onOpenChange: (open: boolean) => void
  onCategoryDeleted: () => void
}

export function CategoryInfoDialog({ category, clan, open, onOpenChange, onCategoryDeleted }: CategoryInfoDialogProps) {
  const { user } = useAuth()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isOwner = user?.id === clan.ownerId

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await apiClient.deleteCategory(category.id)
      onCategoryDeleted()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to delete category:", error)
      alert("Không thể xóa category. Vui lòng thử lại.")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#313338] text-white">
          <DialogHeader>
            <DialogTitle>Thông tin Category</DialogTitle>
            <DialogDescription className="text-[#b5bac1]">Chi tiết về category này</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-[#b5bac1]">Tên Category</label>
              <p className="mt-1 text-sm">{category.name}</p>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-[#b5bac1]">ID</label>
              <p className="mt-1 font-mono text-sm text-[#b5bac1]">{category.id}</p>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase text-[#b5bac1]">Vị trí</label>
              <p className="mt-1 text-sm">{category.position}</p>
            </div>
          </div>

          {isOwner && (
            <>
              <div className="mt-6 border-t border-[#3f4147] pt-4">
                <h3 className="mb-2 text-sm font-semibold uppercase text-[#f23f42]">Vùng nguy hiểm</h3>
                <p className="mb-4 text-xs text-[#b5bac1]">
                  Xóa category sẽ xóa tất cả channels bên trong. Hành động này không thể hoàn tác.
                </p>
                <Button
                  variant="destructive"
                  className="w-full bg-[#da373c] hover:bg-[#a12d30]"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa Category
                </Button>
              </div>
            </>
          )}

          <DialogFooter>
            <Button variant="secondary" onClick={() => onOpenChange(false)} className="bg-[#4e5058] hover:bg-[#6d6f78]">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-[#313338] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa category</AlertDialogTitle>
            <AlertDialogDescription className="text-[#b5bac1]">
              Bạn có chắc chắn muốn xóa category <span className="font-semibold">{category.name}</span>? Tất cả channels
              trong category này cũng sẽ bị xóa. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#4e5058] hover:bg-[#6d6f78]">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-[#da373c] hover:bg-[#a12d30]">
              {isDeleting ? "Đang xóa..." : "Xóa Category"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
