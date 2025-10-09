import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Award,
  Briefcase,
  FileText,
  Syringe,
  User,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
  const cards = [
    {
      title: "Lý lịch cá nhân",
      description: "Xem và cập nhật thông tin cá nhân của bạn",
      icon: User,
      href: "/client/profile",
    },
    {
      title: "Bằng cấp & Chứng chỉ",
      description: "Quản lý bằng cấp và chứng chỉ hành nghề",
      icon: Award,
      href: "/client/certificates",
    },
    {
      title: "Quá trình đào tạo",
      description: "Quản lý quá trình đào tạo và học tập",
      icon: GraduationCap,
      href: "/client/training",
    },
    {
      title: "Mô tả công việc",
      description: "Xem mô tả công việc được giao",
      icon: Briefcase,
      href: "/client/job-description",
    },
    {
      title: "Phiếu tiêm chủng",
      description: "Quản lý thông tin tiêm chủng",
      icon: Syringe,
      href: "/client/vaccination",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Trang chủ</h1>
        <p className="text-muted-foreground">
          Chào mừng đến với hệ thống quản lý nhân viên bệnh viện
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>{card.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
