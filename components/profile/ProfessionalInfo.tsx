import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProfileStore } from "@/stores";

export function ProfessionalInfo() {
  const { profile, updateProfile } = useProfileStore();

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
            <Input
              id="position"
              value={profile?.position || ""}
              onChange={(e) => updateProfile({ position: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Phòng/Ban</Label>
            <Input
              id="department"
              value={profile?.department || ""}
              onChange={(e) => updateProfile({ department: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Nghề nghiệp khi được tuyển dụng</Label>
            <Input
              id="jobTitle"
              value={profile?.jobTitle || ""}
              onChange={(e) => updateProfile({ jobTitle: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hireDate">Ngày tuyển dụng</Label>
            <Input
              id="hireDate"
              type="date"
              value={profile?.hireDate || ""}
              onChange={(e) => updateProfile({ hireDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hireAgency">Cơ quan tuyển dụng</Label>
            <Input
              id="hireAgency"
              value={profile?.hireAgency || ""}
              onChange={(e) => updateProfile({ hireAgency: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rank">Ngạch viên chức</Label>
            <Input
              id="rank"
              value={profile?.rank || ""}
              onChange={(e) => updateProfile({ rank: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Bậc lương</Label>
            <Input
              id="salary"
              value={profile?.salary || ""}
              onChange={(e) => updateProfile({ salary: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salaryDate">Ngày hưởng</Label>
            <Input
              id="salaryDate"
              type="date"
              value={profile?.salaryDate || ""}
              onChange={(e) => updateProfile({ salaryDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="education">Trình độ giáo dục phổ thông</Label>
            <Input
              id="education"
              value={profile?.education || ""}
              onChange={(e) => updateProfile({ education: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">Trình độ chuyên môn cao nhất</Label>
            <Input
              id="specialization"
              value={profile?.specialization || ""}
              onChange={(e) =>
                updateProfile({ specialization: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="politics">Lý luận chính trị</Label>
            <Input
              id="politics"
              value={profile?.politics || ""}
              onChange={(e) => updateProfile({ politics: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="management">Quản lý nhà nước</Label>
            <Input
              id="management"
              value={profile?.management || ""}
              onChange={(e) => updateProfile({ management: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Ngoại ngữ</Label>
            <Input
              id="language"
              value={profile?.language || ""}
              onChange={(e) => updateProfile({ language: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="it">Tin học</Label>
            <Input
              id="it"
              value={profile?.it || ""}
              onChange={(e) => updateProfile({ it: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="partyJoinDate">
              Ngày vào Đảng Cộng sản Việt Nam
            </Label>
            <Input
              id="partyJoinDate"
              type="date"
              value={profile?.partyJoinDate || ""}
              onChange={(e) => updateProfile({ partyJoinDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="partyOfficialDate">Ngày chính thức</Label>
            <Input
              id="partyOfficialDate"
              type="date"
              value={profile?.partyOfficialDate || ""}
              onChange={(e) =>
                updateProfile({ partyOfficialDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="health">Tình trạng sức khỏe</Label>
            <Input
              id="health"
              value={profile?.health || ""}
              onChange={(e) => updateProfile({ health: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="familyPolicy">Là thương binh hạng</Label>
            <Input
              id="familyPolicy"
              value={profile?.familyPolicy || ""}
              onChange={(e) => updateProfile({ familyPolicy: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="highestTitle">
              Danh hiệu được phong tặng cao nhất
            </Label>
            <Input
              id="highestTitle"
              value={profile?.highestTitle || ""}
              onChange={(e) => updateProfile({ highestTitle: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="forte">Sở trường công tác</Label>
            <Input
              id="forte"
              value={profile?.forte || ""}
              onChange={(e) => updateProfile({ forte: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reward">Khen thưởng</Label>
            <Input
              id="reward"
              value={profile?.reward || ""}
              onChange={(e) => updateProfile({ reward: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discipline">Kỷ luật</Label>
            <Input
              id="discipline"
              value={profile?.discipline || ""}
              onChange={(e) => updateProfile({ discipline: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
