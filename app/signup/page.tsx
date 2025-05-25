"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import type { RegisterData } from "@/contexts/auth-context"

export default function SignupPage() {
  const router = useRouter()
  const { register } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    dob: "",
    gender: "MALE",
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value as "MALE" | "FEMALE" | "OTHER",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password || !confirmPassword || !formData.dob) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
        duration: 1500
      })
      return
    }

    if (formData.password !== confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
        duration: 1500
      })
      return
    }

    if (!acceptTerms) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chấp nhận điều khoản dịch vụ",
        variant: "destructive",
        duration: 1500
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await register(formData)

      if (success) {
        toast({
          title: "Đăng ký thành công",
          description: "Vui lòng kiểm tra email của bạn để xác minh tài khoản.",
          duration: 1500
        })
        // Redirect to verification pending page or home page
        router.push("/signup/verification-pending")
      } else {
        toast({
          title: "Đăng ký thất bại",
          description: "Có lỗi xảy ra khi đăng ký tài khoản. Email có thể đã được sử dụng.",
          variant: "destructive",
          duration: 1500
        })
      }
    } catch (error) {
      toast({
        title: "Đăng ký thất bại",
        description: "Có lỗi xảy ra khi đăng ký tài khoản",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true)

    try {
      // Trong thực tế, bạn sẽ chuyển hướng đến URL đăng nhập Google
      // window.location.href = `${API_BASE_URL}/auth/google/login`;

      // Giả lập đăng nhập Google thành công
      toast({
        title: "Chức năng đang phát triển",
        description: "Đăng ký bằng Google sẽ sớm được hỗ trợ.",
        duration: 1500
      })
    } catch (error) {
      toast({
        title: "Đăng ký thất bại",
        description: "Có lỗi xảy ra khi đăng ký bằng Google",
        variant: "destructive",
        duration: 1500
      })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
      <div className="container max-w-md mx-auto py-12 px-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Đăng Ký</CardTitle>
            <CardDescription className="text-center">Tạo tài khoản mới để bắt đầu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {/*<Button variant="outline" onClick={handleGoogleSignup} disabled={isGoogleLoading} className="relative">*/}
              {/*  {isGoogleLoading ? (*/}
              {/*      <Loader2 className="h-4 w-4 mr-2 animate-spin" />*/}
              {/*  ) : (*/}
              {/*      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">*/}
              {/*        <path*/}
              {/*            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"*/}
              {/*            fill="#4285F4"*/}
              {/*        />*/}
              {/*        <path*/}
              {/*            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"*/}
              {/*            fill="#34A853"*/}
              {/*        />*/}
              {/*        <path*/}
              {/*            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"*/}
              {/*            fill="#FBBC05"*/}
              {/*        />*/}
              {/*        <path*/}
              {/*            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"*/}
              {/*            fill="#EA4335"*/}
              {/*        />*/}
              {/*      </svg>*/}
              {/*  )}*/}
              {/*  Đăng ký bằng Google*/}
              {/*</Button>*/}

              {/*<div className="relative">*/}
              {/*  <div className="absolute inset-0 flex items-center">*/}
              {/*    <span className="w-full border-t" />*/}
              {/*  </div>*/}
              {/*  <div className="relative flex justify-center text-xs uppercase">*/}
              {/*    <span className="bg-background px-2 text-muted-foreground">Hoặc đăng ký bằng email</span>*/}
              {/*  </div>*/}
              {/*</div>*/}

              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Tài khoản</Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="IAmTDF"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <div className="relative">
                      <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          required
                      />
                      <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                      >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}</span>
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                    <div className="relative">
                      <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isLoading}
                          required
                      />
                      <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}</span>
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dob">Ngày sinh</Label>
                    <Input
                        id="dob"
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="gender">Giới tính</Label>
                    <Select value={formData.gender} onValueChange={handleGenderChange} disabled={isLoading}>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Nam</SelectItem>
                        <SelectItem value="FEMALE">Nữ</SelectItem>
                        <SelectItem value="OTHER">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Tôi đồng ý với{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Điều khoản dịch vụ
                      </Link>{" "}
                      và{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Chính sách bảo mật
                      </Link>
                    </label>
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Đăng ký
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm text-muted-foreground mt-2">
              Đã có tài khoản?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Đăng nhập
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
  )
}
