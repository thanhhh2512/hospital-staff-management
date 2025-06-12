import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChangeEvent, RefObject } from "react";
import { useProfileStore } from "@/stores";

interface PersonalInfoProps {
  avatarSrc: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleAvatarUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function PersonalInfo({
  avatarSrc,
  fileInputRef,
  handleAvatarUpload,
}: PersonalInfoProps) {
  const { profile, updateProfile } = useProfileStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
        <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarSrc || ""} />
            <AvatarFallback>NV</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Tải ảnh lên
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              value={profile?.fullName || ""}
              onChange={(e) => updateProfile({ fullName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Giới tính</Label>
            <Select
              value={profile?.gender || ""}
              onValueChange={(value) => updateProfile({ gender: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Nam</SelectItem>
                <SelectItem value="female">Nữ</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Ngày sinh</Label>
            <Input
              id="dob"
              type="date"
              value={profile?.dob || ""}
              onChange={(e) => updateProfile({ dob: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthPlace">Nơi sinh</Label>
            <Input
              id="birthPlace"
              value={profile?.birthPlace || ""}
              onChange={(e) => updateProfile({ birthPlace: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hometown">Quê quán</Label>
            <Input
              id="hometown"
              value={profile?.hometown || ""}
              onChange={(e) => updateProfile({ hometown: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ethnicity">Dân tộc</Label>
            <Input
              id="ethnicity"
              value={profile?.ethnicity || ""}
              onChange={(e) => updateProfile({ ethnicity: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="religion">Tôn giáo</Label>
            <Input
              id="religion"
              value={profile?.religion || ""}
              onChange={(e) => updateProfile({ religion: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idNumber">Số CMND/CCCD</Label>
            <Input
              id="idNumber"
              value={profile?.idNumber || ""}
              onChange={(e) => updateProfile({ idNumber: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idIssueDate">Ngày cấp</Label>
            <Input
              id="idIssueDate"
              type="date"
              value={profile?.idIssueDate || ""}
              onChange={(e) => updateProfile({ idIssueDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              value={profile?.phone || ""}
              onChange={(e) => updateProfile({ phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile?.email || ""}
              onChange={(e) => updateProfile({ email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="permanentAddress">
              Nơi đăng ký hộ khẩu thường trú
            </Label>
            <Input
              id="permanentAddress"
              value={profile?.permanentAddress || ""}
              onChange={(e) =>
                updateProfile({ permanentAddress: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentAddress">Nơi ở hiện nay</Label>
            <Input
              id="currentAddress"
              value={profile?.currentAddress || ""}
              onChange={(e) =>
                updateProfile({ currentAddress: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="socialOrgJoinDate">
              Ngày tham gia tổ chức chính trị - xã hội
            </Label>
            <Input
              id="socialOrgJoinDate"
              type="date"
              value={profile?.socialOrgJoinDate || ""}
              onChange={(e) =>
                updateProfile({ socialOrgJoinDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="enlistmentDate">Ngày nhập ngũ</Label>
            <Input
              id="enlistmentDate"
              type="date"
              value={profile?.enlistmentDate || ""}
              onChange={(e) =>
                updateProfile({ enlistmentDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dischargeDate">Ngày xuất ngũ</Label>
            <Input
              id="dischargeDate"
              type="date"
              value={profile?.dischargeDate || ""}
              onChange={(e) => updateProfile({ dischargeDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="highestMilitaryRank">Quân hàm cao nhất</Label>
            <Input
              id="highestMilitaryRank"
              placeholder="Nhập quân hàm cao nhất"
              value={profile?.highestMilitaryRank || ""}
              onChange={(e) =>
                updateProfile({ highestMilitaryRank: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bhxhNumber">Số sổ BHXH</Label>
            <Input
              id="bhxhNumber"
              value={profile?.bhxhNumber || ""}
              onChange={(e) => updateProfile({ bhxhNumber: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
