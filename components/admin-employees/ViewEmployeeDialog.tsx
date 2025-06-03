import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import type { Employee } from "@/types";
import { mockProfile, mockCertificates } from "@/schemas/mock-data";

interface ViewEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function ViewEmployeeDialog({
  open,
  onOpenChange,
  employee,
}: ViewEmployeeDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!employee) return;
    setIsDownloading(true);

    try {
      const profileElement = document.getElementById("employee-profile");
      if (!profileElement) return;

      const profileClone = profileElement.cloneNode(true) as HTMLElement;
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      container.style.width = profileElement.offsetWidth + "px";
      container.style.color = "black";
      container.style.backgroundColor = "white";

      container.appendChild(profileClone);
      document.body.appendChild(container);

      const allElements = container.querySelectorAll("*");
      allElements.forEach((el) => {
        const element = el as HTMLElement;
        element.style.color = "black";
        if (
          window.getComputedStyle(element).backgroundColor !==
          "rgba(0, 0, 0, 0)"
        ) {
          element.style.backgroundColor = "white";
        }
        if (window.getComputedStyle(element).borderColor) {
          element.style.borderColor = "#e5e7eb";
        }
      });

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "white",
      });

      document.body.removeChild(container);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(
        `ly-lich-${employee.name.replace(/\s+/g, "-").toLowerCase()}.pdf`
      );
    } finally {
      setIsDownloading(false);
    }
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thông tin nhân viên</DialogTitle>
          <DialogDescription>
            Chi tiết thông tin cá nhân và nghề nghiệp
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải xuống...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Tải PDF
                </>
              )}
            </Button>
          </div>

          <div
            id="employee-profile"
            className="space-y-8 rounded-md border p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{employee.name}</h2>
                <p className="text-muted-foreground">{employee.position}</p>
              </div>
              <div className="h-32 w-24 overflow-hidden rounded border">
                <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                  Ảnh 3x4
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  Thông tin cá nhân
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Số điện thoại:</span>
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ngày sinh:</span>
                    <span>{mockProfile.dob}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Giới tính:</span>
                    <span>
                      {mockProfile.gender === "female" ? "Nữ" : "Nam"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">CCCD/CMND:</span>
                    <span>{mockProfile.idNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ngày cấp:</span>
                    <span>{mockProfile.idIssueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Địa chỉ thường trú:</span>
                    <span className="text-right">
                      {mockProfile.permanentAddress}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Địa chỉ hiện tại:</span>
                    <span className="text-right">
                      {mockProfile.currentAddress}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  Thông tin công việc
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Phòng/Ban:</span>
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Chức danh:</span>
                    <span>{mockProfile.jobTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ngày tuyển dụng:</span>
                    <span>
                      {new Date(employee.hireDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Đơn vị tuyển dụng:</span>
                    <span>{mockProfile.hireAgency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ngạch/Bậc:</span>
                    <span>{mockProfile.rank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Bậc lương:</span>
                    <span>{mockProfile.salary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ngày nâng lương:</span>
                    <span>{mockProfile.salaryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Trình độ:</span>
                    <span>{mockProfile.education}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">
                Bằng cấp & Chứng chỉ
              </h3>
              <div className="rounded-md border">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Tên
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Loại
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Ngày cấp
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium">
                        Đơn vị cấp
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCertificates.map((cert) => (
                      <tr
                        key={cert.id}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="p-4 align-middle">{cert.name}</td>
                        <td className="p-4 align-middle capitalize">
                          {cert.type}
                        </td>
                        <td className="p-4 align-middle">{cert.issueDate}</td>
                        <td className="p-4 align-middle">{cert.issuer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">
                Danh mục hồ sơ nhân sự
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span>Sơ yếu lý lịch</span>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span>Bằng cấp, chứng chỉ</span>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span>Giấy khám sức khỏe</span>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span>Hợp đồng lao động</span>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span>Sổ BHXH</span>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span>Phiếu tiêm chủng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
