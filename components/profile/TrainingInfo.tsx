import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import type { ProfileFormData, TrainingHistory } from "@/lib/profileFormSchema";

const isValidDate = (dateStr: string) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
};

interface TrainingInfoProps {
  isReadOnly?: boolean;
}

export function TrainingInfo({ isReadOnly = false }: TrainingInfoProps) {
  const { watch, setValue } = useFormContext<ProfileFormData>();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<TrainingHistory, "id">>({
    school: "",
    major: "",
    startDate: "",
    endDate: "",
    type: "",
    degree: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Watch trainings from the main form
  const trainings = watch("trainings") || [];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.school.trim())
      newErrors.school = "Tên trường không được để trống";
    if (!formData.major.trim())
      newErrors.major = "Chuyên ngành không được để trống";
    if (!formData.startDate) newErrors.startDate = "Bắt buộc";
    if (!formData.endDate) newErrors.endDate = "Bắt buộc";
    if (!formData.type.trim())
      newErrors.type = "Hình thức đào tạo không được để trống";
    if (!formData.degree.trim())
      newErrors.degree = "Văn bằng, chứng chỉ không được để trống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Add new training to the main form
    const newTraining: TrainingHistory = {
      id: uuidv4(),
      ...formData,
    };

    setValue("trainings", [...trainings, newTraining]);

    // Reset form
    setFormData({
      school: "",
      major: "",
      startDate: "",
      endDate: "",
      type: "",
      degree: "",
    });
    setErrors({});
    setShowForm(false);
  };

  const handleInputChange = (
    field: keyof Omit<TrainingHistory, "id">,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
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
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    placeholder="Tên trường"
                    value={formData.school}
                    onChange={(e) =>
                      handleInputChange("school", e.target.value)
                    }
                    disabled={isReadOnly}
                  />
                  {errors.school && (
                    <p className="text-red-500 text-xs mt-1">{errors.school}</p>
                  )}
                </div>
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    placeholder="Chuyên ngành"
                    value={formData.major}
                    onChange={(e) => handleInputChange("major", e.target.value)}
                    disabled={isReadOnly}
                  />
                  {errors.major && (
                    <p className="text-red-500 text-xs mt-1">{errors.major}</p>
                  )}
                </div>
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    type="date"
                    placeholder="Từ ngày"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    disabled={isReadOnly}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    type="date"
                    placeholder="Đến ngày"
                    value={formData.endDate}
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                    disabled={isReadOnly}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    placeholder="Hình thức đào tạo"
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    disabled={isReadOnly}
                  />
                  {errors.type && (
                    <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                  )}
                </div>
                <div>
                  <input
                    className="border p-2 rounded w-full"
                    placeholder="Văn bằng, chứng chỉ"
                    value={formData.degree}
                    onChange={(e) =>
                      handleInputChange("degree", e.target.value)
                    }
                    disabled={isReadOnly}
                  />
                  {errors.degree && (
                    <p className="text-red-500 text-xs mt-1">{errors.degree}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" type="submit" disabled={isReadOnly}>
                  Lưu
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      school: "",
                      major: "",
                      startDate: "",
                      endDate: "",
                      type: "",
                      degree: "",
                    });
                    setErrors({});
                  }}
                  disabled={isReadOnly}
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
              disabled={isReadOnly}
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
