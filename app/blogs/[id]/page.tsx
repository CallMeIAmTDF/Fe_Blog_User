"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  AlertTriangle,
  Calendar,
  Eye,
  FileText,
  MessageSquare,
  Share2,
  Sparkles,
  Tag,
  Loader2,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { TableOfContents } from "@/components/table-of-contents"
import { AISummaryModal } from "@/components/ai-summary-modal"
import { CommentSection } from "@/components/comment-section"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { PostResponse } from "@/types/api"
import { formatDate } from "@/lib/utils"
import { BlogCard } from "@/components/blog-card"
import { apiService } from "@/lib/api-service"

export default function BlogPage({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuth()
  const contentRef = useRef<HTMLDivElement>(null)
  const [showRawContent, setShowRawContent] = useState(false)
  const [showAISummary, setShowAISummary] = useState(false)
  const [blog, setBlog] = useState<PostResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function decodeHtml(html: any) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
  // Fetch blog data
  useEffect(() => {
    async function loadBlog() {
      try {
        setIsLoading(true)
        const response = await apiService.getBlogDetail(params.id)

        if (response.code === 200) {
          setBlog(response.data)
        } else {
          setError("Không thể tải bài viết. Vui lòng thử lại sau.")
        }
      } catch (error) {
        console.error("Error fetching blog:", error)
        setError("Đã xảy ra lỗi khi tải bài viết.")
      } finally {
        setIsLoading(false)
      }
    }

    loadBlog()
  }, [params.id])

  // Fetch follow status if authenticated
  useEffect(() => {
    async function loadFollowStatus() {
      if (!isAuthenticated || !blog?.userResponse) return

      try {
        const response = await apiService.checkFollowStatus(blog.userResponse.id)
        if (response.code === 200) {
          setIsFollowing(response.data)
        }
      } catch (error) {
        console.error("Error checking follow status:", error)
      }
    }

    loadFollowStatus()
  }, [isAuthenticated, blog])

  const toggleFollow = async () => {
    if (!isAuthenticated || !blog?.userResponse) return

    // Optimistic update
    setIsFollowing(!isFollowing)

    try {
      const response = await apiService.toggleFollow(blog.userResponse.id, isFollowing)

      if (response.code !== 200) {
        // Revert optimistic update if API call fails
        setIsFollowing(isFollowing)
      }
    } catch (error) {
      console.error("Error toggling follow status:", error)
      // Revert optimistic update if API call fails
      setIsFollowing(isFollowing)
    }
  }

  if (isLoading) {
    return (
        <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6 flex justify-center items-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Đang tải bài viết...</p>
          </div>
        </div>
    )
  }

  if (error || !blog) {
    return (
        <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
          <Alert variant="destructive">
            <AlertTitle>Không tìm thấy bài viết</AlertTitle>
            <AlertDescription>{error || "Bài viết này không tồn tại hoặc đã bị xóa."}</AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button asChild>
              <Link href="/blogs">Quay lại danh sách bài viết</Link>
            </Button>
          </div>
        </div>
    )
  }

  // Tạo placeholder image cho bài viết nếu có coverImage
  const hasCoverImage = !!blog.cover
  const coverImage = hasCoverImage
      ? blog.cover
      : `/placeholder.svg?height=400&width=800&text=${encodeURIComponent(blog.title)}`

  return (
      <div className="container max-w-7xl mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Blog Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {blog.category && Array.isArray(blog.category) && blog.category.length > 0 ? (
                    blog.category.map((cat) => (
                        <Badge key={cat} variant="secondary" className="font-normal">
                          <Tag className="h-3 w-3 mr-1"/>
                          {cat}
                        </Badge>
                    ))
                ) : (
                    <p></p> // Hoặc không hiển thị gì nếu không có category
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{blog.title}</h1>

              {/* Cập nhật phần hiển thị thông tin tác giả để xử lý userResponse có thể là null */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-center gap-2">
                  {blog.userResponse ? (
                      <Link href={`/users/${blog.userResponse.id}`} className="flex items-center gap-2 hover:underline">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={blog.userResponse.avatar || "/placeholder.svg"} alt={blog.userResponse.name} />
                          <AvatarFallback>{blog.userResponse.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{blog.userResponse.name}</span>
                          <span className="text-xs text-muted-foreground">Đăng vào ngày {formatDate(blog.createdAt)}</span>
                        </div>
                      </Link>
                  ) : (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>??</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">Tác giả ẩn danh</span>
                          <span className="text-xs text-muted-foreground">Đăng vào ngày {formatDate(blog.createdAt)}</span>
                        </div>
                      </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{blog.viewsCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{blog.commentsCount}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Share2 className="h-4 w-4" />
                    Chia Sẻ
                  </Button>
                </div>
              </div>
            </div>

            {/* Sensitive Content Warning Banner - Hiển thị nếu có nội dung nhạy cảm */}
            {blog.hasSensitiveContent && (
                <Alert variant="destructive" className="border-red-500 bg-red-50 dark:bg-red-950/20">
                  <AlertTriangle className="h-5 w-5" />
                  <AlertTitle className="text-red-600 dark:text-red-400 font-bold text-lg">
                    Cảnh báo: Nội dung nhạy cảm
                  </AlertTitle>
                  <AlertDescription className="text-red-600/80 dark:text-red-400/80">
                    <p>
                      Bài viết này chứa nội dung có thể không phù hợp với một số độc giả. Vui lòng cân nhắc khi đọc và chia
                      sẻ.
                    </p>
                  </AlertDescription>
                </Alert>
            )}

            {/* Cover Image - Chỉ hiển thị nếu có ảnh */}
            {hasCoverImage && (
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <Image src={coverImage || "/placeholder.svg"} alt={blog.title} fill className="object-cover" priority />
                </div>
            )}

            {/* Blog Content */}
            <div className="flex justify-between gap-4 flex-wrap">
              <div className="flex gap-2">
                {/* Cập nhật nút AI Summary để luôn có thể nhấn */}
                <Button variant="outline" className="gap-1" onClick={() => setShowAISummary(true)}>
                  <Sparkles className="h-4 w-4" />
                  Tóm Tắt AI
                </Button>

                {isAuthenticated && blog.hasSensitiveContent && (
                    <div className="flex items-center gap-2 border rounded-md px-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Xem Nội Dung Gốc</span>
                      </div>
                      <Switch checked={showRawContent} onCheckedChange={setShowRawContent} />
                    </div>
                )}
              </div>

              {/*<div className="flex items-center gap-2">*/}
              {/*  <Button variant="outline" size="icon">*/}
              {/*    <ThumbsUp className="h-4 w-4" />*/}
              {/*  </Button>*/}
              {/*  <Button variant="outline" size="icon">*/}
              {/*    <ThumbsDown className="h-4 w-4" />*/}
              {/*  </Button>*/}
              {/*</div>*/}
            </div>


            <div
                ref={contentRef}
                className="prose prose-stone dark:prose-invert max-w-none heading-content"
                dangerouslySetInnerHTML={{__html: showRawContent ? blog.rawContent : blog.content}}
            />

            {/* Author Bio */}
            {blog.userResponse && (
                <Card className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={blog.userResponse.avatar || "/placeholder.svg"} alt={blog.userResponse.name} />
                      <AvatarFallback>{blog.userResponse.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="text-lg font-bold">{blog.userResponse.name}</h3>
                      </div>
                      {/*<p className="text-muted-foreground">{blog.userResponse.bio}</p>*/}
                    </div>
                  </div>
                </Card>
            )}

            {/* Comments Section */}
            <CommentSection blogId={blog.id} comments={blog.comments} />

            {/* Related Posts */}
            {blog.relatedPosts && blog.relatedPosts.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Bài Viết Liên Quan</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blog.relatedPosts.map((relatedPost) => (
                        <BlogCard key={relatedPost.id} post={relatedPost} />
                    ))}
                  </div>
                </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="sticky top-20">
              <TableOfContents contentRef={contentRef} />

              <Separator className="my-6" />

              {/* Cập nhật phần hiển thị thông tin tác giả ở sidebar */}
              <div className="space-y-4">
                <h4 className="font-medium">Về Tác Giả</h4>
                {blog.userResponse ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={blog.userResponse.avatar || "/placeholder.svg"} alt={blog.userResponse.name} />
                        <AvatarFallback>{blog.userResponse.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <Link href={`/users/${blog.userResponse.id}`} className="font-medium hover:underline">
                          {blog.userResponse.name}
                        </Link>
                        <span className="text-xs text-muted-foreground">Xem hồ sơ</span>
                      </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>??</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">Tác giả ẩn danh</span>
                      </div>
                    </div>
                )}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h4 className="font-medium">Chi Tiết Bài Viết</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Đăng vào ngày {formatDate(blog.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>{blog.viewsCount} lượt đọc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>{blog.commentsCount} bình luận</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h4 className="font-medium">Thẻ</h4>
                <div className="flex flex-wrap gap-2">
                  {blog.category && Array.isArray(blog.category) && blog.category.length > 0 ? (
                      blog.category.map((cat) => (
                          <Badge key={cat} variant="secondary" className="font-normal">
                            {cat}
                          </Badge>
                      ))
                  ) : (
                      <p></p> // Hoặc không hiển thị gì nếu không có category
                  )}
                </div>
              </div>

              <Separator className="my-6"/>

              <div className="space-y-4">
                <h4 className="font-medium">Hashtags</h4>
                <div className="flex flex-wrap gap-2">
                  {blog.hashtags.map((tag) => (
                      <Badge key={tag} variant="outline" className="font-normal">
                        #{tag}
                      </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary Modal */}
        <AISummaryModal isOpen={showAISummary} onClose={() => setShowAISummary(false)} postId={blog.id} />
      </div>
  )
}
