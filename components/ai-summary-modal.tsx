"use client"

import { useState, useEffect } from "react"
import { Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { apiService } from "@/lib/api-service"

interface AISummaryModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string
}

export function AISummaryModal({ isOpen, onClose, postId }: AISummaryModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Fetch AI summary when modal is opened
  useEffect(() => {
    if (isOpen && postId) {
      fetchSummary()
    }
  }, [isOpen, postId])

  const fetchSummary = async () => {
    if (!postId) return

    setIsLoading(true)
    setSummary("")
    setError(null)

    try {
      const response = await apiService.getBlogSummary(postId)

      if (response.code === 200 && response.data.summary) {
        // Xử lý chuỗi summary nếu cần (ví dụ: loại bỏ dấu ngoặc kép thừa)
        let formattedSummary = response.data.summary

        // Nếu summary được bao quanh bởi dấu ngoặc kép, loại bỏ chúng
        if (formattedSummary.startsWith('"') && formattedSummary.endsWith('"')) {
          formattedSummary = formattedSummary.slice(1, -1)
        }

        setSummary(formattedSummary)
      } else {
        setError("Không thể tạo tóm tắt cho bài viết này.")
      }
    } catch (error) {
      console.error("Error fetching AI summary:", error)
      setError("Đã xảy ra lỗi khi tạo tóm tắt. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <DialogTitle>AI Summary</DialogTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 p-0">
              </Button>
            </div>
            <DialogDescription>Tóm tắt bài viết được tạo bởi AI.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[95%]" />
                  <Skeleton className="h-4 w-[85%]" />
                  <div className="py-2"></div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[92%]" />
                  <Skeleton className="h-4 w-[88%]" />
                </div>
            ) : error ? (
                <div className="text-center py-4 text-destructive">
                  <p>{error}</p>
                </div>
            ) : (
                <div className="text-sm leading-relaxed space-y-4">
                  {summary.split("\n\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                  ))}
                </div>
            )}
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <div className="text-xs text-muted-foreground">
              {isLoading ? "Đang tạo tóm tắt..." : "Tóm tắt được tạo bởi AI"}
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  )
}
