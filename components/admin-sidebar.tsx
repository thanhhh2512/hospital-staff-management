"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  Users,
  Award,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Plus,
  Briefcase,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Định nghĩa kiểu dữ liệu cho trường tùy chỉnh
interface CustomField {
  id: string;
  name: string;
  slug: string;
}

const defaultNavItems = [
  {
    title: "Trang chủ",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Quản lý nhân viên",
    href: "/admin/employees",
    icon: Users,
  },
  {
    title: "Bằng cấp & Chứng chỉ",
    href: "/admin/certificates",
    icon: Award,
  },
  {
    title: "Giao việc",
    href: "/admin/job-assignments",
    icon: Briefcase,
  },
  {
    title: "Hồ sơ nhân sự",
    href: "/admin/documents",
    icon: FileText,
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [newFieldName, setNewFieldName] = useState("");

  // Lấy danh sách trường tùy chỉnh từ localStorage khi component được mount
  useEffect(() => {
    const storedFields = localStorage.getItem("customFields");
    if (storedFields) {
      setCustomFields(JSON.parse(storedFields));
    }
  }, []);

  const handleAddField = () => {
    if (newFieldName.trim()) {
      const slug = newFieldName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

      const newField = {
        id: Date.now().toString(),
        name: newFieldName.trim(),
        slug: slug,
      };

      const updatedFields = [...customFields, newField];
      setCustomFields(updatedFields);

      // Lưu vào localStorage
      localStorage.setItem("customFields", JSON.stringify(updatedFields));

      setNewFieldName("");

      toast({
        title: "Thêm trường thành công",
        description: `Đã thêm trường "${newFieldName}" vào hệ thống.`,
      });

      // Chuyển hướng đến trang mới tạo
      router.push(`/admin/custom/${slug}`);
    }
  };

  const handleEditField = (field: CustomField) => {
    // Open edit dialog or navigate to edit page
    router.push(`/admin/settings/custom-fields?edit=${field.id}`);
  };

  const handleDeleteField = (field: CustomField, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm(`Bạn có chắc chắn muốn xóa trường "${field.name}"?`)) {
      const updatedFields = customFields.filter((f) => f.id !== field.id);
      setCustomFields(updatedFields);
      localStorage.setItem("customFields", JSON.stringify(updatedFields));

      toast({
        title: "Xóa trường thành công",
        description: `Đã xóa trường "${field.name}" khỏi hệ thống.`,
      });
    }
  };

  return (
    <>
      <div className="fixed top-0 z-40 flex h-14 w-full items-center justify-between border-b bg-background px-4 lg:hidden">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(true)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Mở menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <span className="font-bold">Quản Trị Hệ Thống</span>
        </div>
        <ModeToggle />
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden",
          isOpen ? "block" : "hidden"
        )}
      >
        <div className="fixed left-0 top-0 h-full w-3/4 max-w-xs border-r bg-background p-6 shadow-lg overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">Menu Quản Trị</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
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
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "transparent"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}

            {customFields.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between px-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Trường tùy chỉnh
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => router.push("/admin/settings/custom-fields")}
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span className="sr-only">Quản lý trường tùy chỉnh</span>
                  </Button>
                </div>
                {customFields.map((field) => (
                  <div key={field.id} className="group relative">
                    <Link
                      href={`/admin/custom/${field.slug}`}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === `/admin/custom/${field.slug}`
                          ? "bg-accent text-accent-foreground"
                          : "transparent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        {field.name}
                      </div>
                      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditField(field);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="sr-only">Chỉnh sửa</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-destructive"
                          onClick={(e) => handleDeleteField(field, e)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Xóa</span>
                        </Button>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Thêm trường mới
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm trường mới</DialogTitle>
                  <DialogDescription>
                    Thêm trường mới vào hệ thống để nhân viên có thể upload tài
                    liệu.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên trường</Label>
                    <Input
                      id="name"
                      placeholder="Nhập tên trường"
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddField}>Thêm trường</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
          <span className="font-bold">Quản Trị Hệ Thống</span>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto">
          <nav className="flex flex-1 flex-col gap-1">
            {defaultNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "transparent"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}

            {customFields.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between px-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Trường tùy chỉnh
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => router.push("/admin/settings/custom-fields")}
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span className="sr-only">Quản lý trường tùy chỉnh</span>
                  </Button>
                </div>
                {customFields.map((field) => (
                  <div key={field.id} className="group relative">
                    <Link
                      href={`/admin/custom/${field.slug}`}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        pathname === `/admin/custom/${field.slug}`
                          ? "bg-accent text-accent-foreground"
                          : "transparent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        {field.name}
                      </div>
                      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditField(field);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="sr-only">Chỉnh sửa</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-destructive"
                          onClick={(e) => handleDeleteField(field, e)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Xóa</span>
                        </Button>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </nav>

          <div className="mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Thêm trường mới
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm trường mới</DialogTitle>
                  <DialogDescription>
                    Thêm trường mới vào hệ thống để nhân viên có thể upload tài
                    liệu.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên trường</Label>
                    <Input
                      id="name"
                      placeholder="Nhập tên trường"
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddField}>Thêm trường</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

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
  );
}
