import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TrainingInfo() {
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
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle">
                    Trường ĐHYD.TP Hồ Chí Minh
                  </td>
                  <td className="p-4 align-middle">Xét nghiệm</td>
                  <td className="p-4 align-middle">11/2009 - 10/2012</td>
                  <td className="p-4 align-middle">Liên thông</td>
                  <td className="p-4 align-middle">Cử nhân</td>
                </tr>
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
