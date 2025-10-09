import { Button } from "@/components/ui/button";
import { Upload, Loader2, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { TrainingHistory } from "@/types";

interface TrainingTableProps {
  trainingHistory: TrainingHistory[];
  onAddClick: () => void;
  onEditClick: (training: TrainingHistory) => void;
  onDeleteClick: (training: TrainingHistory) => void;
  isLoading?: boolean;
}

export function TrainingTable({
  trainingHistory,
  onAddClick,
  onEditClick,
  onDeleteClick,
  isLoading = false,
}: TrainingTableProps) {
  return (
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Đang tải dữ liệu đào tạo...</span>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Tên trường
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Chuyên ngành đào tạo, bồi dưỡng
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Từ tháng, năm - đến tháng, năm
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Hình thức đào tạo
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Văn bằng, chứng chỉ
                      </th>
                      <th className="h-12 px-4 text-right align-middle font-medium">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainingHistory.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-8 text-center text-muted-foreground"
                        >
                          Chưa có thông tin đào tạo nào.
                        </td>
                      </tr>
                    ) : (
                      trainingHistory.map((training) => (
                        <tr
                          key={training.id}
                          className="border-b transition-colors hover:bg-muted/50"
                        >
                          <td className="p-4 align-middle">
                            {training.school}
                          </td>
                          <td className="p-4 align-middle">{training.major}</td>
                          <td className="p-4 align-middle">
                            {training.startDate} -{" "}
                            {training.endDate || "Hiện tại"}
                          </td>
                          <td className="p-4 align-middle">
                            {training.type === "DEGREE"
                              ? "Bằng cấp"
                              : training.type === "CERTIFICATE"
                              ? "Chứng chỉ"
                              : training.type === "COURSE"
                              ? "Khóa học"
                              : "Khác"}
                          </td>
                          <td className="p-4 align-middle">
                            {training.degree}
                          </td>
                          <td className="p-4 align-middle text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Mở menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => onEditClick(training)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onDeleteClick(training)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
          <Button variant="outline" className="w-full" onClick={onAddClick}>
            <Upload className="mr-2 h-4 w-4" />
            Thêm quá trình đào tạo
          </Button>
        </div>

  );
}
