import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import type { ProfileFormData, TrainingHistory } from "@/lib/profileFormSchema";

const isValidDate = (dateStr: string) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
};

export function TrainingInfo() {
  const { watch } = useFormContext<ProfileFormData>();

  // Watch trainings from the main form
  const trainings = watch("trainings") || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đào tạo, bồi dưỡng</CardTitle>
        <CardDescription>
          Thông tin về quá trình đào tạo, bồi dưỡng
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                  Từ ngày - đến ngày
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
                      {isValidDate(training.startDate) &&
                      isValidDate(training.endDate)
                        ? `${format(
                            new Date(training.startDate),
                            "dd/MM/yyyy"
                          )} - ${format(
                            new Date(training.endDate),
                            "dd/MM/yyyy"
                          )}`
                        : ""}
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
      </CardContent>
    </Card>
  );
}
