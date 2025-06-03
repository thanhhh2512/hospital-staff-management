import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmployeeFiltersProps {
  positions: string[];
  departments: string[];
  filterPosition: string;
  filterDepartment: string;
  onPositionChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
}

export function EmployeeFilters({
  positions,
  departments,
  filterPosition,
  filterDepartment,
  onPositionChange,
  onDepartmentChange,
}: EmployeeFiltersProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="w-full md:w-1/3">
        <Label htmlFor="position-filter">Lọc theo chức vụ</Label>
        <Select value={filterPosition} onValueChange={onPositionChange}>
          <SelectTrigger id="position-filter">
            <SelectValue placeholder="Tất cả chức vụ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_positions">Tất cả chức vụ</SelectItem>
            {positions.map((position) => (
              <SelectItem key={position} value={position}>
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-1/3">
        <Label htmlFor="department-filter">Lọc theo phòng ban</Label>
        <Select value={filterDepartment} onValueChange={onDepartmentChange}>
          <SelectTrigger id="department-filter">
            <SelectValue placeholder="Tất cả phòng ban" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả phòng ban</SelectItem>
            {departments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
