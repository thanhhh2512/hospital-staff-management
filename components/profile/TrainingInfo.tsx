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
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

const trainingSchema = z.object({
  school: z.string().min(1, "Tên trường không được để trống"),
  major: z.string().min(1, "Chuyên ngành không được để trống"),
  startDate: z.string().min(1, "Bắt buộc"),
  endDate: z.string().min(1, "Bắt buộc"),
  type: z.string().min(1, "Hình thức đào tạo không được để trống"),
  degree: z.string().min(1, "Văn bằng, chứng chỉ không được để trống"),
});

type TrainingForm = z.infer<typeof trainingSchema>;

const isValidDate = (dateStr: string) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
};

export function TrainingInfo() {
  const { trainings, addTraining } = useTrainingStore();
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TrainingForm>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      school: "",
      major: "",
      startDate: "",
      endDate: "",
      type: "",
      degree: "",
    },
  });

  const onSubmit = (data: TrainingForm) => {
    addTraining({ id: uuidv4(), ...data });
    reset();
    setShowForm(false);
  };

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
          {showForm ? (
            <form
              className="space-y-2 border p-4 rounded-md bg-muted/30"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    placeholder="Tên trường"
                    {...register("school")}
                  />
                  {errors.school && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.school.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    placeholder="Chuyên ngành"
                    {...register("major")}
                  />
                  {errors.major && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.major.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    type="date"
                    placeholder="Từ ngày"
                    {...register("startDate")}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    type="date"
                    placeholder="Đến ngày"
                    {...register("endDate")}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    placeholder="Hình thức đào tạo"
                    {...register("type")}
                  />
                  {errors.type && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.type.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    placeholder="Văn bằng, chứng chỉ"
                    {...register("degree")}
                  />
                  {errors.degree && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.degree.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" type="submit">
                  Lưu
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    reset();
                  }}
                >
                  Hủy
                </Button>
              </div>
            </form>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowForm(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Thêm quá trình đào tạo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
