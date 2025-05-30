import { RefObject, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateProfilePDF } from "./pdfUtils";

interface ProfilePreviewProps {
  profileRef: RefObject<HTMLDivElement | null>;
  avatarSrc: string | null;
}

export function ProfilePreview({ profileRef, avatarSrc }: ProfilePreviewProps) {
  const handleExportPDF = () => {
    if (profileRef.current) {
      generateProfilePDF(profileRef.current, avatarSrc);
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
            <span className="material-icons text-sm">download</span>
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
                  <span className="font-semibold">1) Họ và tên:</span> LÊ THỊ
                  MỨC
                </p>
                <p>
                  <span className="font-semibold">2) Ngày sinh:</span>{" "}
                  11/03/1983
                </p>
                <p>
                  <span className="font-semibold">3) Quê quán:</span> Ấp Đông
                  Giữa, Xã Nam Thái, Huyện An Biên, Tỉnh Kiên Giang
                </p>
                <p>
                  <span className="font-semibold">4) Điện thoại:</span>{" "}
                  0919.474.649
                </p>
                <p>
                  <span className="font-semibold">5) Email:</span>{" "}
                  muchau99@gmail.com
                </p>
                <p>
                  <span className="font-semibold">6) Dân tộc:</span> Kinh
                </p>
                <p>
                  <span className="font-semibold">7) Tôn giáo:</span> Không
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <div className="h-32 w-24 overflow-hidden rounded border">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc || "/placeholder.svg"}
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
                Ấp Đông Giữa, Xã Nam Thái, Huyện An Biên, Tỉnh Kiên Giang
              </p>
              <p>
                <span className="font-semibold">9) Nơi ở hiện nay:</span> Số 204
                Trần Việt Châu Phường An Hòa Quận Ninh Kiều TP. Cần Thơ
              </p>
              <p>
                <span className="font-semibold">
                  10) Nghề nghiệp khi được tuyển dụng:
                </span>{" "}
                Kỹ thuật viên xét nghiệm đa khoa
              </p>
              <p>
                <span className="font-semibold">11) Ngày tuyển dụng:</span>{" "}
                10/08/2006, Cơ quan tuyển dụng: BVĐK Trung Ương Cần Thơ
              </p>
              <p>
                <span className="font-semibold">12) Chức vụ hiện tại:</span>{" "}
              </p>
              <p>
                <span className="font-semibold">
                  13) Công việc chính được giao:
                </span>{" "}
                Chuyên khoa xét nghiệm
              </p>
              <p>
                <span className="font-semibold">14) Ngạch viên chức:</span> Kỹ
                thuật y hạng III, Mã ngạch: V.08.07.18
              </p>
              <p>
                <span className="font-semibold">15) Bậc lương:</span> 5/9, Hệ
                số: 3.66, Ngày hưởng: 15/07/2022
              </p>
              <p>
                <span className="font-semibold">
                  15.1- Trình độ giáo dục phổ thông:
                </span>{" "}
                12/12 hệ chính quy
              </p>
              <p>
                <span className="font-semibold">
                  15.2- Trình độ chuyên môn cao nhất:
                </span>{" "}
                Cử nhân xét nghiệm
              </p>
              <p>
                <span className="font-semibold">15.3- Lý luận chính trị:</span>{" "}
              </p>
              <p>
                <span className="font-semibold">15.4- Quản lý nhà nước:</span>{" "}
              </p>
              <p>
                <span className="font-semibold">15.5- Ngoại ngữ:</span> Anh văn
                B
              </p>
              <p>
                <span className="font-semibold">15.6- Tin học:</span> Ứng dụng
                công nghệ thông tin nâng cao
              </p>
              <p>
                <span className="font-semibold">
                  16) Ngày vào Đảng Cộng sản Việt Nam:
                </span>{" "}
                17/12/2016, Ngày chính thức: 17/12/2017
              </p>
              <p>
                <span className="font-semibold">23) Tình trạng sức khỏe:</span>{" "}
                Tốt, Chiều cao: 150cm, Cân nặng: 44kg, Nhóm máu: O Rh(+)
              </p>
              <p>
                <span className="font-semibold">24) Là thương binh hạng:</span>{" "}
                , Là con gia đình chính sách: Con thương binh hạng 2
              </p>
              <p>
                <span className="font-semibold">
                  25) Số chứng minh nhân dân:
                </span>{" "}
                091183011022, Ngày cấp: 27/01/2023
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
