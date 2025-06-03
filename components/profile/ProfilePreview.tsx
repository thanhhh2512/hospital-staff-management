import { RefObject, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateProfilePDF } from "./pdfUtils";
import { useProfileStore } from "@/stores";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FileDown } from 'lucide-react';

interface ProfilePreviewProps {
  profileRef: RefObject<HTMLDivElement | null>;
  avatarSrc: string | null;
}

export function ProfilePreview({ profileRef, avatarSrc }: ProfilePreviewProps) {
  const { profile } = useProfileStore();

  const handleExportPDF = () => {
    if (profileRef.current) {
      generateProfilePDF(profileRef.current, avatarSrc);
    }
  };

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex h-[600px] items-center justify-center">
            <p className="text-muted-foreground">Không có dữ liệu</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex justify-end">
          <Button
            onClick={handleExportPDF}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <span className="material-icons text-sm"><FileDown /></span>
            Xuất PDF
          </Button>
        </div>
        <div
          ref={profileRef}
          className="space-y-8 p-4"
          style={{
            backgroundColor: "#ffffff",
            color: "#000000",
          }}
        >
          <div className="border-b pb-4 text-center">
            <h2 className="text-2xl font-bold">LÝ LỊCH CÁ NHÂN</h2>
            <div className="mt-4 flex items-start justify-between">
              <div className="flex-1 space-y-2 text-left">
                <p>
                  <span className="font-semibold">1) Họ và tên:</span>{" "}
                  {profile.fullName.toUpperCase()}
                </p>
                <p>
                  <span className="font-semibold">2) Ngày sinh:</span>{" "}
                  {formatDate(profile.dob)}
                </p>
                <p>
                  <span className="font-semibold">3) Quê quán:</span>{" "}
                  {profile.hometown}
                </p>
                <p>
                  <span className="font-semibold">4) Điện thoại:</span>{" "}
                  {profile.phone}
                </p>
                <p>
                  <span className="font-semibold">5) Email:</span>{" "}
                  {profile.email}
                </p>
                <p>
                  <span className="font-semibold">6) Dân tộc:</span>{" "}
                  {profile.ethnicity}
                </p>
                <p>
                  <span className="font-semibold">7) Tôn giáo:</span>{" "}
                  {profile.religion}
                </p>
              </div>
              <div className="mx-6  flex-shrink-0">
                <div className="h-44 w-32 overflow-hidden rounded border">
                  {avatarSrc || profile.avatar ? (
                    <img
                      src={avatarSrc || profile.avatar || "/placeholder.svg"}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                      Ảnh 3x4
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-left">
              <p>
                <span className="font-semibold">
                  8) Nơi đăng ký hộ khẩu thường trú:
                </span>{" "}
                {profile.permanentAddress}
              </p>
              <p>
                <span className="font-semibold">9) Nơi ở hiện nay:</span>{" "}
                {profile.currentAddress}
              </p>
              <p>
                <span className="font-semibold">
                  10) Nghề nghiệp khi được tuyển dụng:
                </span>{" "}
                {profile.jobTitle}
              </p>
              <p>
                <span className="font-semibold">11) Ngày tuyển dụng:</span>{" "}
                {formatDate(profile.hireDate)}, Cơ quan tuyển dụng:{" "}
                {profile.hireAgency}
              </p>
              <p>
                <span className="font-semibold">12) Chức vụ hiện tại:</span>{" "}
                {profile.position}
              </p>
              <p>
                <span className="font-semibold">
                  13) Công việc chính được giao:
                </span>{" "}
                {profile.department}
              </p>
              <p>
                <span className="font-semibold">14) Ngạch viên chức:</span>{" "}
                {profile.rank}
              </p>
              <p>
                <span className="font-semibold">15) Bậc lương:</span>{" "}
                {profile.salary}, Ngày hưởng: {formatDate(profile.salaryDate)}
              </p>
              <p>
                <span className="font-semibold">
                  15.1- Trình độ giáo dục phổ thông:
                </span>{" "}
                {profile.education}
              </p>
              <p>
                <span className="font-semibold">
                  15.2- Trình độ chuyên môn cao nhất:
                </span>{" "}
                {profile.specialization}
              </p>
              <p>
                <span className="font-semibold">15.3- Lý luận chính trị:</span>{" "}
                {profile.politics || ""}
              </p>
              <p>
                <span className="font-semibold">15.4- Quản lý nhà nước:</span>{" "}
                {profile.management || ""}
              </p>
              <p>
                <span className="font-semibold">15.5- Ngoại ngữ:</span>{" "}
                {profile.language}
              </p>
              <p>
                <span className="font-semibold">15.6- Tin học:</span>{" "}
                {profile.it}
              </p>
              <p>
                <span className="font-semibold">
                  16) Ngày vào Đảng Cộng sản Việt Nam:
                </span>{" "}
                {profile.partyJoinDate ? formatDate(profile.partyJoinDate) : ""}
                , Ngày chính thức:{" "}
                {profile.partyOfficialDate
                  ? formatDate(profile.partyOfficialDate)
                  : ""}
              </p>
              <p>
                <span className="font-semibold">23) Tình trạng sức khỏe:</span>{" "}
                {profile.health}
              </p>
              <p>
                <span className="font-semibold">24) Là thương binh hạng:</span>{" "}
                , Là con gia đình chính sách: {profile.familyPolicy}
              </p>
              <p>
                <span className="font-semibold">
                  25) Số chứng minh nhân dân:
                </span>{" "}
                {profile.idNumber}, Ngày cấp: {formatDate(profile.idIssueDate)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">
              27) Đào tạo, bồi dưỡng về chuyên môn, nghiệp vụ, lý luận chính
              trị, ngoại ngữ, tin học
            </h3>
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
          </div>

          <div className="mt-8 border-t pt-4 text-right">
            <p>Phiên bản: 1.0</p>
            <p>Trang: 1/2</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
