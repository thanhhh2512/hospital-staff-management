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
            <Input id="fullName" defaultValue="Lê Thị Mức" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Giới tính</Label>
            <Select defaultValue="female">
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
            <Input id="dob" type="date" defaultValue="1983-03-11" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthPlace">Nơi sinh</Label>
            <Input
              id="birthPlace"
              defaultValue="Ấp Đông Giữa, Xã Nam Thái, Huyện An Biên, Tỉnh Kiên Giang"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hometown">Quê quán</Label>
            <Input
              id="hometown"
              defaultValue="Ấp Đông Giữa, Xã Nam Thái, Huyện An Biên, Tỉnh Kiên Giang"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ethnicity">Dân tộc</Label>
            <Input id="ethnicity" defaultValue="Kinh" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="religion">Tôn giáo</Label>
            <Input id="religion" defaultValue="Không" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idNumber">Số CMND/CCCD</Label>
            <Input id="idNumber" defaultValue="091183011022" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idIssueDate">Ngày cấp</Label>
            <Input id="idIssueDate" type="date" defaultValue="2023-01-27" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input id="phone" defaultValue="0919.474.649" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="muchau99@gmail.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="permanentAddress">
              Nơi đăng ký hộ khẩu thường trú
            </Label>
            <Input
              id="permanentAddress"
              defaultValue="Ấp Đông Giữa, Xã Nam Thái, Huyện An Biên, Tỉnh Kiên Giang"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentAddress">Nơi ở hiện nay</Label>
            <Input
              id="currentAddress"
              defaultValue="Số 204 Trần Việt Châu Phường An Hòa Quận Ninh Kiều TP. Cần Thơ"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
