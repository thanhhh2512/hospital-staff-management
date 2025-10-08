import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateProfilePDF } from "./pdfUtils";
import { useProfileStore } from "@/stores";
import { useTrainingStore } from "@/stores";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FileDown } from "lucide-react";
import type { Profile } from "@/types";
import type { ProfileFormData } from "@/lib/profileFormSchema";

interface ProfilePreviewProps {
  avatarSrc: string | null;
}

export function ProfilePreview({ avatarSrc }: ProfilePreviewProps) {
  const { profile: storeProfile } = useProfileStore();
  const { trainings } = useTrainingStore();
  const { watch } = useFormContext<ProfileFormData>();

  // Watch all form values for real-time preview
  const formValues = watch();

  // Merge store profile with current form values for preview
  const previewData: Profile = {
    ...storeProfile!,
    ...formValues,
    avatar: storeProfile?.avatar || null, // Keep original avatar unless changed
  };

  const profileRef = useRef<HTMLDivElement>(null);

  // Use preview data if available, otherwise fallback to store profile
  const profile = previewData || storeProfile;

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

  const isValidDate = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return !isNaN(d.getTime());
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
            <span className="material-icons text-sm">
              <FileDown />
            </span>
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
                <span className="font-semibold">Bậc lương:</span>{" "}
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
                <span className="font-semibold ms-4">
                  15.4- Quản lý nhà nước:
                </span>{" "}
                {profile.management || ""}
              </p>
              <p>
                <span className="font-semibold">15.5- Ngoại ngữ:</span>{" "}
                {profile.languageLevel}
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
                <span className="font-semibold">
                  17) Ngày tham gia tổ chức chính trị - xã hội:
                </span>{" "}
                {profile.socialOrgJoinDate
                  ? formatDate(profile.socialOrgJoinDate)
                  : ""}
              </p>
              <p>
                <span className="font-semibold">18) Ngày nhập ngũ:</span>{" "}
                {profile.enlistmentDate
                  ? formatDate(profile.enlistmentDate)
                  : ""}{" "}
                <span className="font-semibold ms-4">Ngày xuất ngũ:</span>{" "}
                {profile.dischargeDate ? formatDate(profile.dischargeDate) : ""}{" "}
                <span className="font-semibold ms-4">Quân hàm cao nhất:</span>{" "}
                {profile.highestMilitaryRank || ""}
              </p>
              <p>
                <span className="font-semibold">
                  19) Danh hiệu được phong tặng cao nhất:
                </span>{" "}
                {profile.highestTitle || ""}
              </p>
              <p>
                <span className="font-semibold">20) Sở trường công tác:</span>{" "}
                {profile.forte || ""}
              </p>
              <p>
                <span className="font-semibold">21) Khen thưởng:</span>{" "}
                {profile.reward || ""}{" "}
                <span className="font-semibold ms-6">22) Kỷ luật:</span>{" "}
                {profile.discipline || ""}
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
              <p>
                <span className="font-semibold">26) Số sổ BHXH:</span>{" "}
                {profile.bhxhNumber || ""}
              </p>
            </div>
          </div>
          <div className="my-2">
            <span className="font-semibold">
              27) Đào tạo, bồi dưỡng về chuyên môn, nghiệp vụ, lý luận chính
              trị, ngoại ngữ, tin học
            </span>
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
                    trainings.map((training) => (
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
          </div>
          {/* 
          <div className="mt-8 border-t pt-4 text-right">
            <p>Phiên bản: 1.0</p>
            <p>Trang: 1/2</p>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}
