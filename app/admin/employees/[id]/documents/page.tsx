"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable } from "@/components/data-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ViewDocumentDialog } from "@/components/admin-documents/ViewDocumentDialog";
import { useDocumentsView } from "@/hooks/use-documents-view";
import { useEmployeeStore } from "@/stores";
import type { DocumentView } from "@/types";

const categories = [
  { id: "all", name: "Tất cả" },
  { id: "personal", name: "Lý lịch cá nhân" },
  { id: "degree", name: "Bằng cấp" },
  { id: "certificate", name: "Chứng chỉ" },
  { id: "vaccination", name: "Phiếu tiêm chủng" },
  { id: "health", name: "Hồ sơ sức khỏe" },
  { id: "other", name: "Khác" },
];

export default function EmployeeDocumentsPage() {
  const params = useParams();
  const employeeId = params.id as string;
  const { employees } = useEmployeeStore();
  const employee = employees.find((emp) => emp.id === employeeId);
  const { documents, filterDocuments } = useDocumentsView();
  const [selectedDocument, setSelectedDocument] = useState<DocumentView | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  // Filter documents for this employee
  const employeeDocuments = documents.filter(
    (doc) => doc.employeeId === employeeId
  );

  const filteredDocuments = employeeDocuments.filter((doc) => {
    const matchSearch =
      search === "" ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.description?.toLowerCase().includes(search.toLowerCase());

    const matchCategory = activeTab === "all" || doc.category === activeTab;

    return matchSearch && matchCategory;
  });

  const documentColumns = [
    {
      accessorKey: "title",
      header: "Tiêu đề",
    },
    {
      accessorKey: "category",
      header: "Loại",
      cell: ({ row }: { row: any }) => {
        const category = row.getValue("category") as string;
        const categoryMap: Record<string, string> = {
          personal: "Lý lịch cá nhân",
          degree: "Bằng cấp",
          certificate: "Chứng chỉ",
          vaccination: "Phiếu tiêm chủng",
          health: "Hồ sơ sức khỏe",
          other: "Khác",
        };
        return categoryMap[category] || category;
      },
    },
    {
      accessorKey: "uploadDate",
      header: "Ngày tải lên",
      cell: ({ row }: { row: any }) => {
        const date = new Date(row.getValue("uploadDate"));
        return date.toLocaleDateString("vi-VN");
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }: { row: any }) => {
        const status = row.getValue("status") as string;
        return status === "active"
          ? "Hiện hành"
          : status === "archived"
          ? "Lưu trữ"
          : "Chờ duyệt";
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => {
        const document = row.original as DocumentView;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedDocument(document);
                setIsViewDialogOpen(true);
              }}
            >
              Xem chi tiết
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                window.location.href = `/admin/${document.sourceType}s/${document.sourceId}`;
              }}
            >
              Đi tới nguồn
            </Button>
          </div>
        );
      },
    },
  ];

  if (!employee) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={employee.email} alt={employee.name} />
            <AvatarFallback>
              {employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{employee.name}</h1>
            <p className="text-muted-foreground">{employee.position}</p>
            <p className="text-muted-foreground">{employee.department}</p>
            <p className="text-sm font-medium">Mã NV: {employee.id}</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-4">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm tài liệu..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-4">
          <DataTable
            columns={documentColumns}
            data={filteredDocuments}
            searchColumn="title"
          />
        </TabsContent>
      </Tabs>

      <ViewDocumentDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        document={selectedDocument}
        categories={categories}
      />
    </div>
  );
} 