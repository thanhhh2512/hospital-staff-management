import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { JobAssignment } from "@/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "application/x-rar-compressed",
  "application/zip",
];

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  employeeName: z.string().min(1, "Vui lòng nhập tên nhân viên"),
  employeeId: z.string().min(1, "Vui lòng nhập mã nhân viên"),
  department: z.string().min(1, "Vui lòng chọn phòng/ban"),
  assignDate: z.string().min(1, "Vui lòng chọn ngày giao việc"),
  dueDate: z.string().min(1, "Vui lòng chọn hạn hoàn thành"),
  status: z.enum(["active", "completed", "overdue"]),
  description: z.string().min(1, "Vui lòng nhập mô tả công việc"),
});

interface EditJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobAssignment | null;
  onSubmit: (data: JobAssignment) => void;
}

export function EditJobDialog({
  open,
  onOpenChange,
  job,
  onSubmit,
}: EditJobDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      employeeName: "",
      employeeId: "",
      department: "",
      assignDate: "",
      dueDate: "",
      status: "active",
      description: "",
    },
  });

  useEffect(() => {
    if (job) {
      form.reset({
        title: job.title,
        employeeName: job.employeeName,
        employeeId: job.employeeId,
        department: job.department,
        assignDate: job.assignDate,
        dueDate: job.dueDate,
        status: job.status,
        description: job.description,
      });
    }
  }, [job, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError("");

    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setFileError("Kích thước file không được vượt quá 10MB");
        return;
      }

      if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
        setFileError(
          "Chỉ chấp nhận file PDF, Word, hình ảnh (JPEG, PNG) hoặc nén (RAR, ZIP)"
        );
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!job) return;

    if (fileError) {
      return;
    }

    onSubmit({
      ...values,
      id: job.id,
      file: file || job.file,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa công việc</DialogTitle>
          <DialogDescription>Cập nhật thông tin công việc</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input autoFocus={false} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employeeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên nhân viên</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã nhân viên</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phòng/Ban</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phòng/ban" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Khoa Nội">Khoa Nội</SelectItem>
                        <SelectItem value="Khoa Ngoại">Khoa Ngoại</SelectItem>
                        <SelectItem value="Khoa Cấp cứu">
                          Khoa Cấp cứu
                        </SelectItem>
                        <SelectItem value="Chuyên khoa xét nghiệm">
                          Chuyên khoa xét nghiệm
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assignDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày giao</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hạn hoàn thành</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Đang thực hiện</SelectItem>
                        <SelectItem value="completed">Hoàn thành</SelectItem>
                        <SelectItem value="overdue">Quá hạn</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Tài liệu đính kèm</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.rar,.zip"
                    onChange={handleFileChange}
                  />
                </FormControl>
                {fileError && (
                  <p className="text-sm font-medium text-destructive">
                    {fileError}
                  </p>
                )}
                {job?.file && !file && (
                  <p className="text-sm text-muted-foreground">
                    File hiện tại:{" "}
                    {typeof job.file === "string" ? job.file : job.file.name}
                  </p>
                )}
              </FormItem>
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả công việc</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit">Lưu thay đổi</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
