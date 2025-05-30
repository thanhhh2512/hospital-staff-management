import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, FileText, Settings, Users } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const cards = [
    {
      title: "Quản lý nhân viên",
      description: "Xem và quản lý thông tin nhân viên",
      icon: Users,
      href: "/admin/employees",
      count: 124,
    },
    {
      title: "Bằng cấp & Chứng chỉ",
      description: "Quản lý bằng cấp và chứng chỉ hành nghề",
      icon: Award,
      href: "/admin/certificates",
      count: 87,
    },
    {
      title: "Hồ sơ nhân sự",
      description: "Quản lý các tài liệu hồ sơ nhân sự",
      icon: FileText,
      href: "/admin/documents",
      count: 243,
    },
    {
      title: "Cài đặt",
      description: "Cấu hình hệ thống và quyền truy cập",
      icon: Settings,
      href: "/admin/settings",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trang quản trị</h1>
        <p className="text-muted-foreground">Quản lý nhân viên và hồ sơ nhân sự</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                <card.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>{card.description}</CardDescription>
                {card.count && <p className="mt-2 text-2xl font-bold">{card.count}</p>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
