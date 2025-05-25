"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {  Loader2, TagIcon, Upload, X, ImageIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import {apiService} from "@/lib/api-service";
import {uploadToImgur, uploadToNuuls} from "@/lib/uploadToImgur";

const TinyMCEEditor = dynamic(() => import("@/components/tinymce-editor"), {
  ssr: false,
  loading: () => (
    <div className="border rounded-md p-4 h-[500px] flex items-center justify-center bg-muted">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ),
})

const MOCK_TOPICS = [
  {
    "id": 1,
    "name": "Technology",
    "cdesc": "Công Nghệ"
  },
  {
    "id": 2,
    "name": "Heal",
    "cdesc": "Sức Khỏe & Làm Đẹp"
  },
  {
    "id": 3,
    "name": "Travel",
    "cdesc": "Du Lịch"
  },
  {
    "id": 4,
    "name": "Food",
    "cdesc": "Ẩm Thực"
  },
  {
    "id": 5,
    "name": "Finance",
    "cdesc": "Tài Chính"
  },
  {
    "id": 6,
    "name": "Education",
    "cdesc": "Giáo Dục"
  },
  {
    "id": 7,
    "name": "Entertainment",
    "cdesc": "Giải Trí"
  },
  {
    "id": 8,
    "name": "Science",
    "cdesc": "Khoa Học"
  }
]


export default function NewBlogPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedTopics, setSelectedTopics] = useState<number[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isScheduled, setIsScheduled] = useState(false)
  const [activeTab, setActiveTab] = useState("editor")
  const [isLoading, setIsLoading] = useState(true)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setIsLoading(false)

      if (!isAuthenticated) {
      }
    }

    checkAuth()
  }, [isAuthenticated])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleTopicToggle = (topicId: number) => {
    setSelectedTopics((prev) => (prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCoverImageFile(file)
      const urlImage = await uploadToNuuls(file);
      setCoverImage(urlImage);
    }
  }

  const handleRemoveCoverImage = () => {
    setCoverImage(null)
    setCoverImageFile(null)
  }

  const handlePublish = async () => {
    if(!title || !content){
      toast({
        title: "Đăng bài không thành công",
        description: "Tiêu đề và nội dung không được để trống",
        duration: 1500,
      })
      return
    }

    const response = await apiService.postBlog(title, content, selectedTopics, tags, coverImage)

    if (response.code === 200) {
      toast({
        title: "Post Blog",
        description: "Đăng bài thành công",
        duration: 1500
      })
      router.push("/blogs")
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4 md:px-6 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4 md:px-6">
        <Alert>
          <AlertTitle>Yêu cầu đăng nhập</AlertTitle>
          <AlertDescription>Bạn cần đăng nhập để viết bài mới. Vui lòng đăng nhập để tiếp tục.</AlertDescription>
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button asChild>
            <Link href="/login">Đăng Nhập</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 md:px-6">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Tạo Bài Viết Mới</h1>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{user?.name}</span>
          </div>
        </div>

        <div className="border-b">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("editor")}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                activeTab === "editor"
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Trình Soạn Thảo
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                activeTab === "settings"
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Cài Đặt
            </button>
          </div>
        </div>

        {activeTab === "editor" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu Đề Bài Viết</Label>
              <Input
                id="title"
                placeholder="Nhập tiêu đề mô tả..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Ảnh Bìa (Tùy chọn)</Label>
              <div className="border rounded-md p-4">
                {coverImage ? (
                  <div className="relative">
                    <div className="aspect-video relative rounded-md overflow-hidden">
                      <Image src={coverImage || "/placeholder.svg"} alt="Cover preview" fill className="object-cover" />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveCoverImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-md">
                    <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">Kéo và thả ảnh bìa hoặc nhấp để tải lên</p>
                    <Button variant="outline" asChild>
                      <label className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Tải ảnh lên
                        <input type="file" accept="image/*" className="hidden" onChange={handleCoverImageChange} />
                      </label>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Nội Dung</Label>
              <TinyMCEEditor
                value={content}
                onChange={setContent}
                height={500}
                placeholder="Bắt đầu viết bài viết của bạn..."
              />
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Chủ Đề</h3>
                  <p className="text-sm text-muted-foreground">Chọn chủ đề mô tả bài viết của bạn (tối đa 3)</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {MOCK_TOPICS.map((topic) => {
                      const isSelected = selectedTopics.includes(topic.id)
                      return (
                        <Badge
                          key={topic.id}
                          variant={isSelected ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer",
                            isSelected ? "" : "hover:bg-secondary",
                            selectedTopics.length >= 3 && !isSelected ? "opacity-50 cursor-not-allowed" : "",
                          )}
                          onClick={() => {
                            if (isSelected || selectedTopics.length < 3) {
                              handleTopicToggle(topic.id)
                            }
                          }}
                        >
                          {topic.name}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Thẻ</h3>
                  <p className="text-sm text-muted-foreground">Thêm thẻ để giúp độc giả khám phá bài viết của bạn</p>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Thêm thẻ và nhấn Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      Thêm
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          <TagIcon className="h-3 w-3" />
                          {tag}
                          <button
                            className="ml-1 rounded-full hover:bg-muted p-0.5"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="space-y-4">

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm text-muted-foreground">Thông báo sẽ được gửi cho người theo dõi khi bạn đăng bài viết.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button onClick={handlePublish}>{isScheduled ? "Lên Lịch" : "Xuất Bản"} Bài Viết</Button>
        </div>
      </div>
    </div>
  )
}
