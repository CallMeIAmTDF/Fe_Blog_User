"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ThumbsUp, ThumbsDown, Flag, MoreHorizontal } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface UserResponse {
  id: string
  name: string
  avatar: string
}

// Cập nhật interface để phù hợp với API
interface Comment {
  id: number
  content: string
  userResponse: UserResponse | null
  leftValue: number
  rightValue: number
  replies: Comment[]
  createdAt?: string
  parentId?: string
}

interface CommentSectionProps {
  blogId: string
  comments: Comment[]
}

export function CommentSection({ blogId, comments: initialComments }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  // Thay đổi state để theo dõi số lượng replies hiển thị và comments đã tải
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({})
  const [visibleComments, setVisibleComments] = useState<number>(5) // Hiển thị 5 comments đầu tiên

  // Xử lý nested comments từ flat array
  useEffect(() => {
    // Tạo cấu trúc comments phân cấp từ dữ liệu phẳng
    const processComments = (rawComments: Comment[]) => {
      // Lọc ra các comment gốc (không phải reply)
      const rootComments = rawComments.filter((comment) => !comment.parentId)

      // Lọc ra các reply
      const replies = rawComments.filter((comment) => comment.parentId)

      // Gán replies vào comment gốc tương ứng
      const processedComments = rootComments.map((rootComment) => {
        const commentReplies = replies.filter((reply) => reply.parentId === rootComment.id)
        return {
          ...rootComment,
          replies: commentReplies,
        }
      })

      return processedComments
    }

    // Nếu comments đã có cấu trúc phân cấp (có thuộc tính replies), sử dụng trực tiếp
    // Nếu không, xử lý từ dữ liệu phẳng
    if (initialComments.length > 0 && initialComments[0].replies !== undefined) {
      setComments(initialComments)
    } else {
      // Giả định rằng dữ liệu phẳng có thể có trường parentId để xác định mối quan hệ
      setComments(processComments(initialComments))
    }
  }, [initialComments])

  const handleAddComment = async () => {
    if (!newComment.trim() || !isAuthenticated) return

    try {
      // Gọi API để thêm bình luận
      const response = await fetch("http://13.229.84.255:8888/api/v1/blog/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('authState') as string)?.accessToken || ""}`,
        },
        body: JSON.stringify({
          content: newComment,
          pid: blogId,
        }),
      })

      const result = await response.json()

      if (result.code === 200) {
        const newCommentObj: Comment = {
          id: result.data.id,
          content: result.data.content,
          userResponse: {
            id: JSON.parse(localStorage.getItem("authState") as string).user?.id || "",
            name: JSON.parse(localStorage.getItem("authState") as string).user?.name || "",
            avatar: JSON.parse(localStorage.getItem("authState") as string).user?.avatar || "",
          },
          leftValue: result.data.leftValue,
          rightValue: result.data.rightValue,
          replies: [],
          createdAt: result.data.createdAt,
        }

        // Cập nhật state với bình luận mới
        setComments([newCommentObj, ...comments])
        setNewComment("")
      } else {
        console.error("Failed to add comment:", result.message)
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const handleAddReply = async (parentId: string) => {
    if (!replyContent.trim() || !isAuthenticated) return

    try {
      // Gọi API để thêm trả lời
      const response = await fetch("http://13.229.84.255:8888/api/v1/blog/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('authState') as string)?.accessToken || ""}`,
        },
        body: JSON.stringify({
          content: replyContent,
          pid: blogId,
          parentId: parentId,
        }),
      })

      const result = await response.json()

      if (result.code === 200) {
        // Tạo đối tượng reply từ phản hồi API
        const newReply: Comment = {
          id: result.data.id,
          content: result.data.content,
          userResponse: {
            id: user?.id || "",
            name: user?.name || "",
            avatar: user?.avatar || "",
          },
          leftValue: result.data.leftValue,
          rightValue: result.data.rightValue,
          replies: [],
          createdAt: result.data.createdAt,
          parentId: parentId,
        }

        // Cập nhật state với trả lời mới
        const updatedComments = comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply],
            }
          }
          return comment
        })

        setComments(updatedComments)
        setReplyingTo(null)
        setReplyContent("")
      } else {
        console.error("Failed to add reply:", result.message)
      }
    } catch (error) {
      console.error("Error adding reply:", error)
    }
  }



  // Thêm hàm để mở rộng/thu gọn replies của một comment
  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }))
  }

  // Thêm hàm để tải thêm comments
  const loadMoreComments = () => {
    setVisibleComments((prev) => prev + 5) // Tải thêm 5 comments mỗi lần
  }

  // Thay đổi phần render comments để hỗ trợ hiển thị thêm
  return (
      <Card>
        <CardHeader>
          <CardTitle>Bình Luận ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isAuthenticated ? (
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                      placeholder="Viết bình luận..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleAddComment}>Đăng Bình Luận</Button>
                  </div>
                </div>
              </div>
          ) : (
              <div className="text-center p-4 border rounded-md">
                <p className="mb-2">Bạn cần đăng nhập để bình luận</p>
                <Link href="/login">
                  <Button>Đăng Nhập</Button>
                </Link>
              </div>
          )}

          {comments.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>Chưa có bình luận nào</p>
                <p className="text-sm">Hãy là người đầu tiên chia sẻ suy nghĩ của bạn!</p>
              </div>
          ) : (
              <div className="space-y-6">
                {/* Chỉ hiển thị số lượng comments giới hạn */}
                {comments.slice(0, visibleComments).map((comment) => (
                    <div key={comment.id} className="space-y-4">
                      <div className="flex gap-4">
                        {/* Cập nhật phần hiển thị avatar người dùng trong comment */}
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                              src={comment.userResponse?.avatar || "/placeholder.svg"}
                              alt={comment.userResponse?.name || "Ẩn danh"}
                          />
                          <AvatarFallback>
                            {comment.userResponse?.name ? comment.userResponse.name.substring(0, 2).toUpperCase() : "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            {/* Cập nhật phần hiển thị tên người dùng trong comment */}
                            <div>
                              <h4 className="font-medium">{comment.userResponse?.name || "Người dùng ẩn danh"}</h4>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(comment.createdAt || new Date().toISOString())}
                              </p>
                            </div>
                          </div>
                          <p>{comment.content}</p>
                          <div className="flex items-center gap-4">

                            {isAuthenticated && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                >
                                  Trả lời
                                </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {replyingTo === comment.id && (
                          <div className="flex gap-4 ml-12">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                              <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <Textarea
                                  placeholder="Viết câu trả lời..."
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                              />
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setReplyingTo(null)}>
                                  Hủy
                                </Button>
                                <Button onClick={() => handleAddReply(comment.id)}>Đăng Trả Lời</Button>
                              </div>
                            </div>
                          </div>
                      )}

                      {comment.replies && comment.replies.length > 0 && (
                          <>
                            {/* Hiển thị số lượng replies giới hạn hoặc tất cả tùy thuộc vào trạng thái mở rộng */}
                            <div className="ml-12 space-y-4">
                              {(expandedReplies[comment.id] ? comment.replies : comment.replies.slice(0, 2)).map((reply) => (
                                  <div key={reply.id} className="flex gap-4">
                                    {/* Cập nhật phần hiển thị avatar người dùng trong reply */}
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                          src={reply.userResponse?.avatar || "/placeholder.svg"}
                                          alt={reply.userResponse?.name || "Ẩn danh"}
                                      />
                                      <AvatarFallback>
                                        {reply.userResponse?.name ? reply.userResponse.name.substring(0, 2).toUpperCase() : "??"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-2">
                                      <div className="flex justify-between items-start">
                                        {/* Cập nhật phần hiển thị tên người dùng trong reply */}
                                        <div>
                                          <h4 className="font-medium">{reply.userResponse?.name || "Người dùng ẩn danh"}</h4>
                                          <p className="text-xs text-muted-foreground">
                                            {formatDate(reply.createdAt || new Date().toISOString())}
                                          </p>
                                        </div>
                                      </div>
                                      <p>{reply.content}</p>
                                    </div>
                                  </div>
                              ))}
                            </div>

                            {/* Hiển thị nút "Xem thêm" nếu có nhiều replies */}
                            {comment.replies.length > 2 && (
                                <div className="ml-12 mt-2">
                                  <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleReplies(comment.id)}
                                      className="text-muted-foreground"
                                  >
                                    {expandedReplies[comment.id]
                                        ? "Ẩn bớt trả lời"
                                        : `Xem thêm ${comment.replies.length - 2} trả lời`}
                                  </Button>
                                </div>
                            )}
                          </>
                      )}

                      <Separator />
                    </div>
                ))}

                {/* Nút "Xem thêm bình luận" */}
                {comments.length > visibleComments && (
                    <div className="flex justify-center">
                      <Button variant="outline" onClick={loadMoreComments}>
                        Xem thêm bình luận
                      </Button>
                    </div>
                )}
              </div>
          )}
        </CardContent>
      </Card>
  )
}
