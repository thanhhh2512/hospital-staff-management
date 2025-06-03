import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTrainingStore } from "@/stores";
import type { TrainingHistory } from "@/types";

export function TrainingInfo() {
  const { trainings } = useTrainingStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đào tạo, bồi dưỡng</CardTitle>
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
                {trainings.length > 0 ? (
                  trainings.map((training: TrainingHistory) => (
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
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-4 text-center text-muted-foreground"
                    >
                      Chưa có thông tin đào tạo
                  </td>
                </tr>
                )}
              </tbody>
            </table>
          </div>
          <Button variant="outline" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Thêm quá trình đào tạo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
