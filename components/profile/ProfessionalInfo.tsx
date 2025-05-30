import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ProfessionalInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin nghề nghiệp</CardTitle>
        <CardDescription>
          Cập nhật thông tin nghề nghiệp của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="position">Chức vụ hiện tại</Label>
            <Input id="position" placeholder="Nhập chức vụ hiện tại" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Phòng/Ban</Label>
            <Input
              id="department"
              defaultValue="Chuyên khoa xét nghiệm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">
              Nghề nghiệp khi được tuyển dụng
            </Label>
            <Input
              id="jobTitle"
              defaultValue="Kỹ thuật viên xét nghiệm đa khoa"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hireDate">Ngày tuyển dụng</Label>
            <Input id="hireDate" type="date" defaultValue="2006-08-10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hireAgency">Cơ quan tuyển dụng</Label>
            <Input
              id="hireAgency"
              defaultValue="BVĐK Trung Ương Cần Thơ"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rank">Ngạch viên chức</Label>
            <Input
              id="rank"
              defaultValue="Kỹ thuật y hạng III, Mã ngạch: V.08.07.18"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Bậc lương</Label>
            <Input id="salary" defaultValue="5/9, Hệ số: 3.66" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salaryDate">Ngày hưởng</Label>
            <Input
              id="salaryDate"
              type="date"
              defaultValue="2022-07-15"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="education">Trình độ giáo dục phổ thông</Label>
            <Input id="education" defaultValue="12/12 hệ chính quy" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">
              Trình độ chuyên môn cao nhất
            </Label>
            <Input
              id="specialization"
              defaultValue="Cử nhân xét nghiệm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="politics">Lý luận chính trị</Label>
            <Input
              id="politics"
              placeholder="Nhập trình độ lý luận chính trị"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="management">Quản lý nhà nước</Label>
            <Input
              id="management"
              placeholder="Nhập trình độ quản lý nhà nước"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Ngoại ngữ</Label>
            <Input id="language" defaultValue="Anh văn B" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="it">Tin học</Label>
            <Input
              id="it"
              defaultValue="Ứng dụng công nghệ thông tin nâng cao"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="partyJoinDate">
              Ngày vào Đảng Cộng sản Việt Nam
            </Label>
            <Input
              id="partyJoinDate"
              type="date"
              defaultValue="2016-12-17"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="partyOfficialDate">Ngày chính thức</Label>
            <Input
              id="partyOfficialDate"
              type="date"
              defaultValue="2017-12-17"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="health">Tình trạng sức khỏe</Label>
            <Input
              id="health"
              defaultValue="Tốt, Chiều cao: 150cm, Cân nặng: 44kg, Nhóm máu: O Rh(+)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="familyPolicy">Là thương binh hạng</Label>
            <Input
              id="familyPolicy"
              placeholder="Nhập thông tin nếu có"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="familyPolicy2">
              Là con gia đình chính sách
            </Label>
            <Input
              id="familyPolicy2"
              defaultValue="Con thương binh hạng 2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 