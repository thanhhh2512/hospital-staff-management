import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TrainingHistory } from "@/types";

interface TrainingTableProps {
  trainingHistory: TrainingHistory[];
  onAddClick: () => void;
}

export function TrainingTable({
  trainingHistory,
  onAddClick,
}: TrainingTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quá trình đào tạo</CardTitle>
        <CardDescription>
          Thông tin về quá trình đào tạo, bồi dưỡng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
                </tr>
              </thead>
              <tbody>
                {trainingHistory.map((training) => (
                  <tr
                    key={training.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4 align-middle">{training.school}</td>
                    <td className="p-4 align-middle">{training.major}</td>
                    <td className="p-4 align-middle">
                      {training.startDate} - {training.endDate}
                    </td>
                    <td className="p-4 align-middle">{training.type}</td>
                    <td className="p-4 align-middle">{training.degree}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button variant="outline" className="w-full" onClick={onAddClick}>
            <Upload className="mr-2 h-4 w-4" />
            Thêm quá trình đào tạo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
