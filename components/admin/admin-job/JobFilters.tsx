import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table"
import type { JobAssignment } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"

interface JobFiltersProps {
  data: JobAssignment[]
  columns: ColumnDef<JobAssignment>[]
}

export function JobFilters({ data, columns }: JobFiltersProps) {
  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">Tất cả</TabsTrigger>
        <TabsTrigger value="active">Đang thực hiện</TabsTrigger>
        <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
        <TabsTrigger value="overdue">Quá hạn</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="mt-4">
        <DataTable
          columns={columns}
          data={data}
          searchColumn="employeeName"
          searchPlaceholder="Tìm kiếm theo tên nhân viên..."
        />
      </TabsContent>
      <TabsContent value="active" className="mt-4">
        <DataTable
          columns={columns}
          data={data.filter((job) => job.status === "active")}
          searchColumn="employeeName"
          searchPlaceholder="Tìm kiếm theo tên nhân viên..."
        />
      </TabsContent>
      <TabsContent value="completed" className="mt-4">
        <DataTable
          columns={columns}
          data={data.filter((job) => job.status === "completed")}
          searchColumn="employeeName"
          searchPlaceholder="Tìm kiếm theo tên nhân viên..."
        />
      </TabsContent>
      <TabsContent value="overdue" className="mt-4">
        <DataTable
          columns={columns}
          data={data.filter((job) => job.status === "overdue")}
          searchColumn="employeeName"
          searchPlaceholder="Tìm kiếm theo tên nhân viên..."
        />
      </TabsContent>
    </Tabs>
  )
}