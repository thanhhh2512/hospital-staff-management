import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import type { ProfileFormData } from "@/lib/profileFormSchema";

interface ProfessionalInfoProps {
  isReadOnly?: boolean;
}

export function ProfessionalInfo({
  isReadOnly = false,
}: ProfessionalInfoProps) {
  const { register } = useFormContext<ProfileFormData>();

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
              {...register("position")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Phòng ban</Label>
            <Input
              id="department"
              {...register("department")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle">Chức danh nghề nghiệp</Label>
            <Input
              id="jobTitle"
              {...register("jobTitle")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hireDate">Ngày tuyển dụng</Label>
            <Input
              id="hireDate"
              type="date"
              {...register("hireDate")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hireAgency">Cơ quan tuyển dụng</Label>
            <Input
              id="hireAgency"
              {...register("hireAgency")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rank">Bậc lương</Label>
            <Input id="rank" {...register("rank")} disabled={isReadOnly} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Mức lương</Label>
            <Input id="salary" {...register("salary")} disabled={isReadOnly} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryDate">Ngày hưởng lương</Label>
            <Input
              id="salaryDate"
              type="date"
              {...register("salaryDate")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Trình độ học vấn</Label>
            <Input
              id="education"
              {...register("education")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Chuyên môn</Label>
            <Input
              id="specialization"
              {...register("specialization")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="politics">Lý luận chính trị</Label>
            <Input
              id="politics"
              {...register("politics")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="management">Quản lý nhà nước</Label>
            <Input
              id="management"
              {...register("management")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="languageLevel">Ngoại ngữ</Label>
            <Input
              id="languageLevel"
              {...register("languageLevel")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="it">Tin học</Label>
            <Input id="it" {...register("it")} disabled={isReadOnly} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="partyJoinDate">Ngày vào Đảng</Label>
            <Input
              id="partyJoinDate"
              type="date"
              {...register("partyJoinDate")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="partyOfficialDate">Ngày chính thức</Label>
            <Input
              id="partyOfficialDate"
              type="date"
              {...register("partyOfficialDate")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="health">Sức khỏe</Label>
            <Input id="health" {...register("health")} disabled={isReadOnly} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="familyPolicy">Chính sách gia đình</Label>
            <Input
              id="familyPolicy"
              {...register("familyPolicy")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="socialOrgJoinDate">Ngày vào tổ chức XH-CT</Label>
            <Input
              id="socialOrgJoinDate"
              type="date"
              {...register("socialOrgJoinDate")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="enlistmentDate">Ngày nhập ngũ</Label>
            <Input
              id="enlistmentDate"
              type="date"
              {...register("enlistmentDate")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dischargeDate">Ngày xuất ngũ</Label>
            <Input
              id="dischargeDate"
              type="date"
              {...register("dischargeDate")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="highestMilitaryRank">Cấp bậc cao nhất (QĐ)</Label>
            <Input
              id="highestMilitaryRank"
              {...register("highestMilitaryRank")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="highestTitle">Chức danh cao nhất</Label>
            <Input
              id="highestTitle"
              {...register("highestTitle")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="forte">Sở trường công tác</Label>
            <Input id="forte" {...register("forte")} disabled={isReadOnly} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reward">Khen thưởng</Label>
            <Input id="reward" {...register("reward")} disabled={isReadOnly} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discipline">Kỷ luật</Label>
            <Input
              id="discipline"
              {...register("discipline")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bhxhNumber">Số sổ BHXH</Label>
            <Input
              id="bhxhNumber"
              {...register("bhxhNumber")}
              disabled={isReadOnly}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}