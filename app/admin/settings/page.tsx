"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ToastProvider } from "@/components/ui/toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Save, Shield, Mail, SettingsIcon } from "lucide-react";
import Link from "next/link";

// Định nghĩa schema cho form cài đặt chung
const generalSettingsSchema = z.object({
  hospitalName: z
    .string()
    .min(2, { message: "Tên bệnh viện phải có ít nhất 2 ký tự" }),
  address: z.string().min(5, { message: "Địa chỉ phải có ít nhất 5 ký tự" }),
  phone: z
    .string()
    .min(10, { message: "Số điện thoại phải có ít nhất 10 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  website: z
    .string()
    .url({ message: "URL không hợp lệ" })
    .optional()
    .or(z.literal("")),
  logo: z.string().optional(),
});

// Định nghĩa schema cho form cài đặt email
const emailSettingsSchema = z.object({
  smtpServer: z
    .string()
    .min(1, { message: "Vui lòng nhập địa chỉ máy chủ SMTP" }),
  smtpPort: z.string().min(1, { message: "Vui lòng nhập cổng SMTP" }),
  smtpUsername: z
    .string()
    .min(1, { message: "Vui lòng nhập tên đăng nhập SMTP" }),
  smtpPassword: z.string().min(1, { message: "Vui lòng nhập mật khẩu SMTP" }),
  senderEmail: z.string().email({ message: "Email không hợp lệ" }),
  senderName: z.string().min(1, { message: "Vui lòng nhập tên người gửi" }),
});

// Định nghĩa schema cho form cài đặt bảo mật
const securitySettingsSchema = z.object({
  passwordMinLength: z
    .string()
    .min(1, { message: "Vui lòng nhập độ dài tối thiểu của mật khẩu" }),
  passwordExpiration: z
    .string()
    .min(1, { message: "Vui lòng nhập thời gian hết hạn mật khẩu" }),
  loginAttempts: z
    .string()
    .min(1, { message: "Vui lòng nhập số lần đăng nhập tối đa" }),
  twoFactorAuth: z.boolean(),
  sessionTimeout: z
    .string()
    .min(1, { message: "Vui lòng nhập thời gian hết hạn phiên" }),
});

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
type EmailSettingsValues = z.infer<typeof emailSettingsSchema>;
type SecuritySettingsValues = z.infer<typeof securitySettingsSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");

  // Form cho cài đặt chung
  const generalForm = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      hospitalName: "Bệnh viện Đa khoa Trung ương Cần Thơ",
      address: "Số 201 Nguyễn Văn Cừ, P. An Hòa, Q. Ninh Kiều, TP. Cần Thơ",
      phone: "0292.3821.236",
      email: "bvdktw@cantho.gov.vn",
      website: "https://bvdktw-cantho.vn",
      logo: "",
    },
  });

  // Form cho cài đặt email
  const emailForm = useForm<EmailSettingsValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpServer: "smtp.gmail.com",
      smtpPort: "587",
      smtpUsername: "bvdktw@cantho.gov.vn",
      smtpPassword: "********",
      senderEmail: "bvdktw@cantho.gov.vn",
      senderName: "Bệnh viện Đa khoa Trung ương Cần Thơ",
    },
  });

  // Form cho cài đặt bảo mật
  const securityForm = useForm<SecuritySettingsValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      passwordMinLength: "8",
      passwordExpiration: "90",
      loginAttempts: "5",
      twoFactorAuth: false,
      sessionTimeout: "30",
    },
  });

  const onGeneralSubmit = (data: GeneralSettingsValues) => {
    console.log("General settings:", data);
    toast({
      title: "Cài đặt đã được lưu",
      description: "Cài đặt chung đã được cập nhật thành công",
    });
  };

  const onEmailSubmit = (data: EmailSettingsValues) => {
    console.log("Email settings:", data);
    toast({
      title: "Cài đặt đã được lưu",
      description: "Cài đặt email đã được cập nhật thành công",
    });
  };

  const onSecuritySubmit = (data: SecuritySettingsValues) => {
    console.log("Security settings:", data);
    toast({
      title: "Cài đặt đã được lưu",
      description: "Cài đặt bảo mật đã được cập nhật thành công",
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Cài đặt hệ thống
          </h1>
          <p className="text-muted-foreground">
            Quản lý cài đặt và tùy chọn cho hệ thống
          </p>
        </div>

        <Tabs
          defaultValue="general"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden sm:inline-block">Cài đặt chung</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline-block">Cài đặt email</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline-block">Bảo mật</span>
            </TabsTrigger>
          </TabsList>

          {/* Cài đặt chung */}
          <TabsContent value="general" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bệnh viện</CardTitle>
                <CardDescription>
                  Cập nhật thông tin cơ bản của bệnh viện
                </CardDescription>
              </CardHeader>
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={generalForm.control}
                      name="hospitalName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên bệnh viện</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tên bệnh viện"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa chỉ</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Nhập địa chỉ bệnh viện"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={generalForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số điện thoại</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập số điện thoại"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={generalForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={generalForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập địa chỉ website"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-4">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                      field.onChange(
                                        e.target?.result as string
                                      );
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              {field.value && (
                                <div className="h-10 w-10 overflow-hidden rounded-md border">
                                  <img
                                    src={field.value || "/placeholder.svg"}
                                    alt="Logo preview"
                                    className="h-full w-full object-contain"
                                  />
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Tải lên logo của bệnh viện (định dạng PNG, JPG)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="ml-auto">
                      <Save className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>

          {/* Cài đặt email */}
          <TabsContent value="email" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Cấu hình email</CardTitle>
                <CardDescription>
                  Cài đặt cấu hình email để gửi thông báo
                </CardDescription>
              </CardHeader>
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={emailForm.control}
                        name="smtpServer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Máy chủ SMTP</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập địa chỉ máy chủ SMTP"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={emailForm.control}
                        name="smtpPort"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cổng SMTP</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập cổng SMTP" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={emailForm.control}
                        name="smtpUsername"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên đăng nhập SMTP</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập tên đăng nhập SMTP"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={emailForm.control}
                        name="smtpPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mật khẩu SMTP</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Nhập mật khẩu SMTP"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={emailForm.control}
                        name="senderEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email người gửi</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập email người gửi"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={emailForm.control}
                        name="senderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên người gửi</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập tên người gửi"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="ml-auto">
                      <Save className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>

          {/* Cài đặt bảo mật */}
          <TabsContent value="security" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt bảo mật</CardTitle>
                <CardDescription>
                  Cấu hình các tùy chọn bảo mật cho hệ thống
                </CardDescription>
              </CardHeader>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={securityForm.control}
                        name="passwordMinLength"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Độ dài tối thiểu của mật khẩu</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="6"
                                max="20"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Số ký tự tối thiểu cho mật khẩu mới
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={securityForm.control}
                        name="passwordExpiration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Thời gian hết hạn mật khẩu (ngày)
                            </FormLabel>
                            <FormControl>
                              <Input type="number" min="0" {...field} />
                            </FormControl>
                            <FormDescription>
                              Đặt 0 để không bao giờ hết hạn
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={securityForm.control}
                        name="loginAttempts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số lần đăng nhập tối đa</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Số lần đăng nhập sai trước khi khóa tài khoản
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={securityForm.control}
                        name="sessionTimeout"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Thời gian hết hạn phiên (phút)
                            </FormLabel>
                            <FormControl>
                              <Input type="number" min="5" {...field} />
                            </FormControl>
                            <FormDescription>
                              Thời gian không hoạt động trước khi đăng xuất
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={securityForm.control}
                      name="twoFactorAuth"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Xác thực hai yếu tố
                            </FormLabel>
                            <FormDescription>
                              Bật xác thực hai yếu tố để tăng cường bảo mật cho
                              tài khoản
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="ml-auto">
                      <Save className="mr-2 h-4 w-4" />
                      Lưu thay đổi
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Custom Fields Management Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quản lý trường dữ liệu tùy chỉnh</CardTitle>
            <CardDescription>
              Thêm, sửa và xóa các trường dữ liệu tùy chỉnh trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Trường dữ liệu tùy chỉnh cho phép bạn mở rộng hệ thống bằng cách
              thêm các loại dữ liệu mới theo nhu cầu của tổ chức.
            </p>
            <div className="flex justify-end">
              <Button asChild>
                <Link href="/admin/settings/custom-fields">
                  Quản lý trường tùy chỉnh
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toast notifications */}
      <ToastProvider />
    </>
  );
}
