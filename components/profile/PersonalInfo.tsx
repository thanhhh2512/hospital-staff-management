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
import { useFormContext, Controller } from "react-hook-form";
import type { ProfileFormData } from "@/lib/profileFormSchema";

interface PersonalInfoProps {
  avatarSrc: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onAvatarUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  isReadOnly?: boolean;
}

export function PersonalInfo({
  avatarSrc,
  fileInputRef,
  onAvatarUpload,
  isReadOnly = false,
}: PersonalInfoProps) {
  const {
    register,
    formState: { errors },
    watch,
    control,
  } = useFormContext<ProfileFormData>();

  // Watch fullName for avatar display
  const fullName = watch("fullName");

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
            <AvatarFallback>
              {fullName
                ? fullName
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "NV"}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isReadOnly}
            >
              <Upload className="mr-2 h-4 w-4" />
              Tải ảnh lên
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={onAvatarUpload}
              disabled={isReadOnly}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="employeeId">
              Mã nhân viên <span className="text-red-500">*</span>
            </Label>
            <Input
              id="employeeId"
              {...register("employeeId")}
              className={errors.employeeId ? "border-red-500" : ""}
              disabled={isReadOnly}
            />
            {errors.employeeId && (
              <p className="text-sm text-red-500">
                {errors.employeeId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">
              Họ và tên <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              {...register("fullName")}
              className={errors.fullName ? "border-red-500" : ""}
              disabled={isReadOnly}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="gender">Giới tính</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isReadOnly}
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
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Ngày sinh</Label>
            <Input
              id="dob"
              type="date"
              {...register("dob")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthPlace">Nơi sinh</Label>
            <Input
              id="birthPlace"
              {...register("birthPlace")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hometown">Quê quán</Label>
            <Input
              id="hometown"
              {...register("hometown")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ethnicity">Dân tộc</Label>
            <Input
              id="ethnicity"
              {...register("ethnicity")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="religion">Tôn giáo</Label>
            <Input
              id="religion"
              {...register("religion")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idNumber">
              Số CMND/CCCD <span className="text-red-500">*</span>
            </Label>
            <Input
              id="idNumber"
              {...register("idNumber")}
              className={errors.idNumber ? "border-red-500" : ""}
              disabled={isReadOnly}
            />
            {errors.idNumber && (
              <p className="text-sm text-red-500">{errors.idNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="idIssueDate">Ngày cấp CMND/CCCD</Label>
            <Input
              id="idIssueDate"
              type="date"
              {...register("idIssueDate")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Số điện thoại <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              {...register("phone")}
              className={errors.phone ? "border-red-500" : ""}
              disabled={isReadOnly}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
              disabled={isReadOnly}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="permanentAddress">Địa chỉ thường trú</Label>
            <Input
              id="permanentAddress"
              {...register("permanentAddress")}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentAddress">Địa chỉ hiện tại</Label>
            <Input
              id="currentAddress"
              {...register("currentAddress")}
              disabled={isReadOnly}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
