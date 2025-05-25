"use client"

import Link from "next/link"
import { MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerificationPendingPage() {
    return (
        <div className="container max-w-md mx-auto py-12 px-4">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Xác Minh Email</CardTitle>
                    <CardDescription className="text-center">
                        Vui lòng kiểm tra email của bạn để hoàn tất quá trình đăng ký
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-4">
                            <MailCheck className="h-12 w-12 text-primary" />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="font-medium">Email xác minh đã được gửi!</p>
                            <p className="text-muted-foreground">
                                Chúng tôi đã gửi một email xác minh đến địa chỉ email bạn đã đăng ký. Vui lòng kiểm tra hộp thư đến và
                                nhấp vào liên kết xác minh để hoàn tất quá trình đăng ký.
                            </p>
                            <p className="text-sm text-muted-foreground mt-4">
                                Nếu bạn không nhận được email trong vòng vài phút, vui lòng kiểm tra thư mục spam hoặc thử đăng ký lại.
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button asChild className="w-full">
                        <Link href="/login">Đến trang đăng nhập</Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/">Về trang chủ</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
