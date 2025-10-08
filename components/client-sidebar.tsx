"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, User, Award, Briefcase, Syringe, LogOut, Menu, X, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface CustomField {
  id: string
  name: string
  slug: string
}

const defaultNavItems = [
  {
    title: "Trang chủ",
    href: "/client/dashboard",
    icon: Home,
  },
  {
    title: "Lý lịch cá nhân",
    href: "/client/profile",
    icon: User,
  },
  {
    title: "Bằng cấp & Chứng chỉ",
    href: "/client/certificates",
    icon: Award,
  },
  {
    title: "Mô tả công việc",
    href: "/client/job-description",
    icon: Briefcase,
  },
  {
    title: "Phiếu tiêm chủng",
    href: "/client/vaccination",
    icon: Syringe,
  },
]

export function ClientSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [customFields, setCustomFields] = useState<CustomField[]>([])

  useEffect(() => {
    const storedFields = localStorage.getItem("customFields")
    if (storedFields) {
      setCustomFields(JSON.parse(storedFields))
    }
  }, [])

  return (
    <>
      <div className="fixed top-0 z-40 flex h-14 w-full items-center justify-between border-b bg-background px-4 lg:hidden">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(true)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Mở menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <span className="font-bold">Hệ Thống Quản Lý Nhân Viên</span>
        </div>
        <ModeToggle />
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden", isOpen ? "block" : "hidden")}
      >
        <div className="fixed left-0 top-0 h-full w-3/4 max-w-xs border-r bg-background p-6 shadow-lg overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">Menu</span>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Đóng menu</span>
            </Button>
          </div>
          <div className="mt-6 space-y-1">
            {defaultNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}

            {customFields.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Trường tùy chỉnh
                </h3>
                {customFields.map((field) => (
                  <Link
                    key={field.id}
                    href={`/client/custom/${field.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    <FileText className="h-5 w-5" />
                    {field.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <Link href="/login">
              <Button variant="outline" className="w-full justify-start gap-2">
                <LogOut className="h-5 w-5" />
                Đăng xuất
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden border-r bg-background lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <span className="font-bold">Quản Lý Nhân Viên</span>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto">
          <nav className="flex flex-1 flex-col gap-1">
            {defaultNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}

            {customFields.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Trường tùy chỉnh
                </h3>
                {customFields.map((field) => (
                  <Link
                    key={field.id}
                    href={`/client/custom/${field.slug}`}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === `/client/custom/${field.slug}` ? "bg-accent text-accent-foreground" : "transparent",
                    )}
                  >
                    <FileText className="h-5 w-5" />
                    {field.name}
                  </Link>
                ))}
              </div>
            )}
          </nav>

          <div className="mt-auto">
            <Link href="/login">
              <Button variant="outline" className="w-full justify-start gap-2">
                <LogOut className="h-5 w-5" />
                Đăng xuất
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
