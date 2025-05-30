"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Plus,
  FileText,
  Calendar,
  MapPin,
  Trash2,
  Loader2,
  Upload,
  Check,
  FileImage,
  Award,
  Download,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface Vaccination {
  id: string;
  name: string;
  date: string;
  location: string;
  notes?: string;
  file: string | null;
  nextDose?: string;
}

interface Certificate {
  id: string;
  name: string;
  issueDate: string;
  expiryDate?: string;
  issuer: string;
  file: string | null;
}

const vaccinationFormSchema = z.object({
  name: z.string().min(2, { message: "Tên vắc xin phải có ít nhất 2 ký tự" }),
  date: z.string().min(1, { message: "Vui lòng chọn ngày tiêm" }),
  location: z
    .string()
    .min(2, { message: "Địa điểm tiêm phải có ít nhất 2 ký tự" }),
  notes: z.string().optional(),
  nextDose: z.string().optional(),
});

type VaccinationFormValues = z.infer<typeof vaccinationFormSchema>;

export default function VaccinationPage() {
  const { toast } = useToast();
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([
    {
      id: "1",
      name: "Vắc-xin COVID-19 (Pfizer)",
      date: "2021-08-15",
      location: "Trung tâm Y tế Quận Ninh Kiều",
      notes: "Mũi 1",
      file: null,
      nextDose: "2021-09-05",
    },
    {
      id: "2",
      name: "Vắc-xin COVID-19 (Pfizer)",
      date: "2021-09-05",
      location: "Trung tâm Y tế Quận Ninh Kiều",
      notes: "Mũi 2",
      file: null,
    },
  ]);

  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: "1",
      name: "Chứng nhận tiêm chủng COVID-19",
      issueDate: "2021-09-15",
      issuer: "Sở Y tế Thành phố Cần Thơ",
      file: null,
    },
    {
      id: "2",
      name: "Chứng nhận tiêm phòng Viêm gan B",
      issueDate: "2020-03-10",
      expiryDate: "2030-03-10",
      issuer: "Bệnh viện Đa khoa Thành phố Cần Thơ",
      file: null,
    },
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [vaccinationToDelete, setVaccinationToDelete] = useState<string | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedVaccination, setSelectedVaccination] =
    useState<Vaccination | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<VaccinationFormValues>({
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

      // Preview the file
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    setIsUploading(true);

    // Simulate file upload
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsUploading(false);
        resolve(filePreview);
      }, 1500);
    });
  };

  const onSubmit = async (data: VaccinationFormValues) => {
    setIsSubmitting(true);

    try {
      // Upload file first if it exists
      const fileUrl = await uploadFile();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add new vaccination
      const newVaccination: Vaccination = {
        id: Date.now().toString(),
        ...data,
        file: fileUrl,
      };

      setVaccinations((prev) => [...prev, newVaccination]);

      // Reset form
      form.reset();
      setSelectedFile(null);
      setFilePreview(null);
      setIsAddDialogOpen(false);

      // Show success toast
      toast({
        title: "Thêm thành công",
        description: "Đã thêm phiếu tiêm chủng mới",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã có lỗi xảy ra khi thêm phiếu tiêm chủng",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setVaccinationToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteVaccination = async () => {
    if (!vaccinationToDelete) return;

    setIsDeleting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setVaccinations((prev) =>
        prev.filter((v) => v.id !== vaccinationToDelete)
      );
      setIsDeleteDialogOpen(false);
      setVaccinationToDelete(null);

      toast({
        title: "Xóa thành công",
        description: "Đã xóa phiếu tiêm chủng",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã có lỗi xảy ra khi xóa phiếu tiêm chủng",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleDetailClick = (vaccination: Vaccination) => {
    setSelectedVaccination(vaccination);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Phiếu tiêm chủng
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin tiêm chủng của bạn
          </p>
        </div>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm phiếu tiêm chủng
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm phiếu tiêm chủng mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin chi tiết về mũi tiêm để quản lý lịch sử tiêm
                chủng
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 py-4"
              >
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

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <LoadingButton
                    type="submit"
                    isLoading={isSubmitting || isUploading}
                    loadingText="Đang lưu..."
                  >
                    Lưu
                  </LoadingButton>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Danh sách phiếu tiêm chủng */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vaccinations.map((vaccination) => (
          <Card key={vaccination.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{vaccination.name}</CardTitle>
              <CardDescription>
                <div className="flex items-center mt-1 space-x-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(vaccination.date).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">{vaccination.location}</span>
                </div>
                {vaccination.notes && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Ghi chú:</span>{" "}
                    {vaccination.notes}
                  </p>
                )}
                {vaccination.nextDose && (
                  <div className="pt-1">
                    <Badge
                      variant="secondary"
                      className="flex items-center space-x-1 w-fit"
                    >
                      <Calendar className="h-3 w-3" />
                      <span>
                        Liều tiếp theo:{" "}
                        {new Date(vaccination.nextDose).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4 pb-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleDetailClick(vaccination)}
              >
                Xem chi tiết
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDeleteClick(vaccination.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Sheet hiển thị chi tiết */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Thông tin tiêm chủng</SheetTitle>
            <SheetDescription>
              Xem chi tiết phiếu tiêm chủng và chứng chỉ liên quan
            </SheetDescription>
          </SheetHeader>

          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Chi tiết tiêm chủng</TabsTrigger>
              <TabsTrigger value="certificates">Bằng cấp/Chứng chỉ</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              {selectedVaccination && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">
                      {selectedVaccination.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Ngày tiêm
                        </p>
                        <p>
                          {new Date(
                            selectedVaccination.date
                          ).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      {selectedVaccination.nextDose && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Ngày tiêm tiếp theo
                          </p>
                          <p>
                            {new Date(
                              selectedVaccination.nextDose
                            ).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Địa điểm tiêm
                    </p>
                    <p>{selectedVaccination.location}</p>
                  </div>

                  {selectedVaccination.notes && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Ghi chú
                        </p>
                        <p>{selectedVaccination.notes}</p>
                      </div>
                    </>
                  )}

                  {selectedVaccination.file && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Tài liệu đính kèm
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center p-2 border rounded-md flex-1">
                            <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                            <span className="text-sm truncate">
                              Phiếu tiêm chủng
                            </span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Tải xuống
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="certificates" className="mt-4">
              <div className="space-y-4">
                {certificates.length > 0 ? (
                  certificates.map((certificate) => (
                    <Card key={certificate.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">
                            {certificate.name}
                          </CardTitle>
                          <Award className="h-5 w-5 text-primary" />
                        </div>
                        <CardDescription>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Ngày cấp:{" "}
                              {new Date(
                                certificate.issueDate
                              ).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm">Nơi cấp: {certificate.issuer}</p>
                        {certificate.expiryDate && (
                          <Badge className="mt-2">
                            Hết hạn:{" "}
                            {new Date(
                              certificate.expiryDate
                            ).toLocaleDateString("vi-VN")}
                          </Badge>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        {certificate.file ? (
                          <Button variant="outline" size="sm" className="gap-1">
                            <FileImage className="h-4 w-4" />
                            Xem
                          </Button>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Không có tệp đính kèm
                          </p>
                        )}
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Award className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="font-medium">Không có bằng cấp/chứng chỉ</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Chưa có bằng cấp hoặc chứng chỉ nào liên quan
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Đóng
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Alert dialog xác nhận xóa */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa phiếu tiêm chủng này? Hành động này
              không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteVaccination();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
