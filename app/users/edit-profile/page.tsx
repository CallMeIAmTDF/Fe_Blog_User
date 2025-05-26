"use client"

import React, {useEffect} from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {apiService} from "@/lib/api-service";
import {Gender, UserUpdateRequest} from "@/types/api";
import { uploadToNuuls} from "@/lib/uploadToImgur";

// Mock user data - would be fetched from API in a real application
const MOCK_USER : UserUpdateRequest = {
  id: "user-1",
  name: "IAMTDF",
  avatar: "/placeholder.svg?height=200&width=200&text=JD",
  gender: "FEMALE",
  dob: "2003-09-19"
}

export default function EditProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<UserUpdateRequest>(MOCK_USER)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInf(){
      const response = await apiService.getMyInf();
      if(response.code == 200){
        setUser(response.data)
      }else{
        router.push("/login")
      }
    }

    fetchInf();
  }, []);
  const handleSelectChange = (name: string, value: string) => {
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }



  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)

      const urlImage = await uploadToNuuls(file);
      setAvatarPreview(urlImage);

      setUser((prev) => ({
        ...prev,
        avatar: urlImage,
      }))
    }
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    if(user.name === ""){
      toast({
        title: "Profile update failed",
        description: "Ten la bat buoc",
        duration: 1500,
      })
    }
    // await new Promise((resolve) => setTimeout(resolve, 1500))
    await apiService.updateUser(user)
    const authStateStr = localStorage.getItem('authState');
    if (authStateStr) {
      const authState = JSON.parse(authStateStr);
      authState.user.name = user.name;
      authState.user.avatar = user.avatar ?? null;
      localStorage.setItem('authState', JSON.stringify(authState));
    }

    setIsLoading(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
      duration: 1500,
    })
    router.push(`/users/${user.id}`)
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 md:px-6">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa hồ sơ</h1>
          <p className="text-muted-foreground mt-2">
            Cập nhật thông tin cá nhân của bạn và cách người khác nhìn thấy bạn trên nền tảng.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ảnh đại diện</CardTitle>
                  <CardDescription>Thông tin này sẽ được hiển thị trên trang cá nhân của bạn và trên toàn bộ trang web.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={avatarPreview || user.avatar} alt={user.name} />
                      <AvatarFallback className="text-2xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow"
                    >
                      <Camera className="h-4 w-4" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  {avatarPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAvatarFile(null)
                        setAvatarPreview(null)
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </CardContent>
              </Card>

            </div>

            {/* Right Column - Main Profile Info */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                  <CardDescription>Cập nhật thông tin cá nhân của bạn.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Username</Label>
                    <Input
                        id="name"
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                        placeholder="Your username"
                        required
                    />
                  </div>


                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                          id="dob"
                          name="dob"
                          type="date"
                          value={user.dob}
                          onChange={handleInputChange}
                          required
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                          value={user.gender}
                          onValueChange={(value) =>
                              handleSelectChange("gender", value as Gender)
                          }
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
              Cập nhật
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
