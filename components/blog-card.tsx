"use client"

import Link from "next/link"
import Image from "next/image"
import {
  AlertTriangle,
  Clock,
  Eye,
  MessageSquare,
  MoreVertical,
  Tag,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { PostSummaryResponse } from "@/types/api"
import { formatDate } from "@/lib/utils"

interface BlogCardProps {
  post: PostSummaryResponse
  hideAuthor?: boolean
  isAuthor?: boolean
}

export function BlogCard({ post, hideAuthor = false, isAuthor = false }: BlogCardProps) {
  if (!post) return null
  const { toast } = useToast()
  const coverImage = `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(
      post.title
  )}`

  return (
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative">
          <Link href={`/blogs/${post.id}`} className="block overflow-hidden">
            <div className="aspect-video relative bg-muted">
              <Image
                  src={post.cover || coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform hover:scale-105"
              />
            </div>
          </Link>

          {/* Nút 3 chấm */}
          {
            isAuthor && (
                  <div className="absolute top-2 right-2 z-20">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-md bg-white/80 backdrop-blur hover:bg-white shadow">
                          <MoreVertical className="w-5 h-5 text-muted-foreground"/>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={async () => {
                              const API = "http://13.229.84.255:8888/api/v1"
                              if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
                                const res = await fetch(`${API}/blog/post/${post.id}`, {
                                  method: "DELETE",
                                  headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("authState") as string)?.accessToken}`,
                                  },
                                })

                                if(res.ok) {
                                  toast({
                                    title: "Xóa thành công",
                                    description: "Xóa thành công!",
                                    duration: 1500
                                  })
                                }

                              }
                            }}
                            className="text-red-600"
                        >
                          🗑 Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
              )
          }

          {post.hasSensitiveContent && (
              <div className="absolute top-2 left-2 z-20">
                <Badge
                    variant="destructive"
                    className="font-medium flex items-center gap-1 px-2 py-1 shadow-md"
                >
                  <AlertTriangle className="h-3.5 w-3.5"/>
                  <span>Nội dung nhạy cảm</span>
                </Badge>
              </div>
          )}
        </div>

        <CardHeader className="p-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {post.category &&
                  post.category.map((cat) => (
                      <Badge key={cat} variant="secondary" className="font-normal">
                        <Tag className="h-3 w-3 mr-1"/>
                        {cat}
                      </Badge>
                  ))}
            </div>
            <Link href={`/blogs/${post.id}`} className="hover:underline">
              <h3 className="font-bold text-xl line-clamp-2">{post.title}</h3>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-grow">
          <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex flex-col gap-4">
          <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{post.viewsCount} lượt đọc</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>{post.commentsCount} bình luận</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>

          {!hideAuthor && (
              <div className="flex items-center gap-2 w-full">
                {post.userResponse ? (
                    <Link
                        href={`/users/${post.userResponse.id}`}
                        className="flex items-center gap-2 hover:underline"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={post.userResponse.avatar || "/placeholder.svg"}
                            alt={post.userResponse.name}
                        />
                        <AvatarFallback>
                          {post.userResponse.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{post.userResponse.name}</span>
                    </Link>
                ) : (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>??</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-muted-foreground">
                  Tác giả ẩn danh
                </span>
                    </div>
                )}
              </div>
          )}
        </CardFooter>
      </Card>
  )
}
