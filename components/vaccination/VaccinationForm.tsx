import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileText, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VaccinationFormData } from "./types";

const vaccinationFormSchema = z.object({
  name: z.string().min(2, { message: "Tên vắc xin phải có ít nhất 2 ký tự" }),
  date: z.string().min(1, { message: "Vui lòng chọn ngày tiêm" }),
  location: z
    .string()
    .min(2, { message: "Địa điểm tiêm phải có ít nhất 2 ký tự" }),
  notes: z.string().optional(),
  nextDose: z.string().optional(),
});

interface VaccinationFormProps {
  onSubmit: (data: VaccinationFormData, file: File | null) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function VaccinationForm({
  onSubmit,
  isSubmitting,
  onCancel,
}: VaccinationFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<VaccinationFormData>({
    resolver: zodResolver(vaccinationFormSchema),
    defaultValues: {
      name: "",
      date: new Date().toISOString().split("T")[0],
      location: "",
      notes: "",
      nextDose: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (data: VaccinationFormData) => {
    await onSubmit(data, selectedFile);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên vắc-xin</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: Vắc-xin COVID-19 (Pfizer)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày tiêm</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nextDose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày tiêm tiếp theo (nếu có)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa điểm tiêm</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ví dụ: Trung tâm Y tế Quận Ninh Kiều"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ví dụ: Mũi 1, Phản ứng phụ nhẹ, ..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Tài liệu đính kèm</FormLabel>
          <div className="flex flex-col space-y-2">
            <div
              className="border-2 border-dashed rounded-md p-6 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-primary">
                    Nhấp để tải lên
                  </span>{" "}
                  hoặc kéo và thả
                </div>
                <span className="text-xs text-muted-foreground">
                  PDF, PNG, JPG (tối đa 5MB)
                </span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
              />
            </div>

            {filePreview && (
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm truncate max-w-[200px]">
                    {selectedFile?.name}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setFilePreview(null);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <LoadingButton
            type="submit"
            isLoading={isSubmitting}
            loadingText="Đang lưu..."
          >
            Lưu
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
