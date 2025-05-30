"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate password reset process
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="absolute right-4 top-4">
        <ModeToggle />
      </div>
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Quên mật khẩu</CardTitle>
            <CardDescription>Nhập email của bạn để nhận liên kết đặt lại mật khẩu</CardDescription>
          </CardHeader>
          {isSubmitted ? (
            <CardContent className="space-y-4">
              <Alert className="border-green-500 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Yêu cầu đã được gửi!</AlertTitle>
                <AlertDescription>
                  Chúng tôi đã gửi email với liên kết đặt lại mật khẩu đến địa chỉ email của bạn. Vui lòng kiểm tra hộp
                  thư đến.
                </AlertDescription>
              </Alert>
              <div className="text-center">
                <Link href="/login">
                  <Button variant="link">Quay lại trang đăng nhập</Button>
                </Link>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="example@hospital.com" required />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi liên kết đặt lại mật khẩu"
                  )}
                </Button>
                <div className="text-center text-sm">
                  <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                    Quay lại trang đăng nhập
                  </Link>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </main>
    </div>
  )
}
