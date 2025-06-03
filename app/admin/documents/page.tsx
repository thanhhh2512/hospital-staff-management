"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEmployeeStore } from "@/stores";
import type { Employee } from "@/types";

const departments = [
  { id: "all", name: "Tất cả phòng ban" },
  { id: "cardiology", name: "Khoa Tim mạch" },
  { id: "neurology", name: "Khoa Thần kinh" },
  { id: "pediatrics", name: "Khoa Nhi" },
  { id: "emergency", name: "Khoa Cấp cứu" },
  { id: "surgery", name: "Khoa Phẫu thuật" },
];

export default function DocumentsPage() {
  const { employees } = useEmployeeStore();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");

  const filteredEmployees = employees.filter((employee) => {
    const matchSearch =
      search === "" ||
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.position.toLowerCase().includes(search.toLowerCase());

    const matchDepartment =
      department === "all" || employee.department === department;

    return matchSearch && matchDepartment;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Quản lý hồ sơ nhân sự
        </h1>
        <p className="text-muted-foreground">
          Xem và quản lý hồ sơ của nhân viên
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc vị trí..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Chọn phòng ban" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={employee.email} alt={employee.name} />
                  <AvatarFallback>
                    {employee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center">
                  <h3 className="font-medium">{employee.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {employee.position}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {employee.department}
                  </p>
                  <p className="text-sm font-medium">Mã NV: {employee.id}</p>
                </div>
                <Link
                  href={`/admin/employees/${employee.id}/documents`}
                  className="w-full"
                >
                  <Button className="w-full" variant="outline">
                    Xem hồ sơ
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
