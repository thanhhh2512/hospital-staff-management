import type {
  Certificate,
  Employee,
  JobAssignment,
  JobDescription,
  Profile,
  TrainingHistory,
  Vaccination,
} from "@/types";

export const mockProfile: Profile = {
  fullName: "Lê Thị Mức",
  gender: "female",
  dob: "1983-03-11",
  birthPlace: "Ấp Đông Giữa, Xã Nam Thái, Huyện An Biên, Tỉnh Kiên Giang",
  hometown: "Ấp Đông Giữa, Xã Nam Thái, Huyện An Biên, Tỉnh Kiên Giang",
  ethnicity: "Kinh",
  religion: "Không",
  idNumber: "091183011022",
  idIssueDate: "2023-01-27",
  phone: "0919.474.649",
  email: "muchau99@gmail.com",
  permanentAddress: "Ấp Đông Giữa, Xã Nam Thái, Huyện An Biên, Tỉnh Kiên Giang",
  currentAddress:
    "Số 204 Trần Việt Châu Phường An Hòa Quận Ninh Kiều TP. Cần Thơ",
  position: "Kỹ thuật viên xét nghiệm",
  department: "Chuyên khoa xét nghiệm",
  jobTitle: "Kỹ thuật viên xét nghiệm đa khoa",
  hireDate: "2006-08-10",
  hireAgency: "BVĐK Trung Ương Cần Thơ",
  rank: "Kỹ thuật y hạng III, Mã ngạch: V.08.07.18",
  salary: "5/9, Hệ số: 3.66",
  salaryDate: "2022-07-15",
  education: "12/12 hệ chính quy",
  specialization: "Cử nhân xét nghiệm",
  language: "Anh văn B",
  it: "Ứng dụng công nghệ thông tin nâng cao",
  partyJoinDate: "2016-12-17",
  partyOfficialDate: "2017-12-17",
  health: "Tốt, Chiều cao: 150cm, Cân nặng: 44kg, Nhóm máu: O Rh(+)",
  familyPolicy: "Con thương binh hạng 2",
};

export const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Lê Thị Mức",
    position: "Kỹ thuật viên xét nghiệm",
    department: "Chuyên khoa xét nghiệm",
    email: "muchau99@gmail.com",
    phone: "0919.474.649",
    hireDate: "2006-08-10",
    status: "active",
  },
  {
    id: "2",
    name: "Nguyễn Văn A",
    position: "Bác sĩ",
    department: "Khoa Nội",
    email: "nguyenvana@hospital.com",
    phone: "0912.345.678",
    hireDate: "2010-03-15",
    status: "active",
  },
  {
    id: "3",
    name: "Trần Thị B",
    position: "Điều dưỡng",
    department: "Khoa Ngoại",
    email: "tranthib@hospital.com",
    phone: "0987.654.321",
    hireDate: "2015-05-22",
    status: "onleave",
  },
  {
    id: "4",
    name: "Phạm Văn C",
    position: "Bác sĩ",
    department: "Khoa Cấp cứu",
    email: "phamvanc@hospital.com",
    phone: "0923.456.789",
    hireDate: "2018-11-08",
    status: "active",
  },
  {
    id: "5",
    name: "Hoàng Thị D",
    position: "Dược sĩ",
    department: "Khoa Dược",
    email: "hoangthid@hospital.com",
    phone: "0934.567.890",
    hireDate: "2019-02-14",
    status: "inactive",
  },
];

export const mockCertificates: Certificate[] = [
  {
    id: "1",
    name: "Bằng Cử nhân Xét nghiệm Y học",
    type: "degree",
    issueDate: "2012-10-15",
    issuer: "Trường Đại học Y Dược TP. Hồ Chí Minh",
    description: "Tốt nghiệp loại Khá",
    employeeName: "Lê Thị Mức",
    employeeId: "NV001",
    status: "active",
    file: null,
  },
  {
    id: "2",
    name: "Chứng chỉ hành nghề Bác sĩ đa khoa",
    type: "certificate",
    issueDate: "2018-05-20",
    issuer: "Bộ Y tế",
    description: "Tốt nghiệp loại Giỏi",
    employeeName: "Nguyễn Văn A",
    employeeId: "NV002",
    status: "active",
    file: null,
  },
  {
    id: "3",
    name: "Chứng chỉ Điều dưỡng",
    type: "certificate",
    issueDate: "2019-03-10",
    issuer: "Bộ Y tế",
    description: "Tốt nghiệp loại Khá",
    employeeName: "Trần Thị B",
    employeeId: "NV003",
    status: "active",
    file: null,
  },
];

export const mockTrainingHistory: TrainingHistory[] = [
  {
    id: "1",
    school: "Trường ĐHYD.TP Hồ Chí Minh",
    major: "Xét nghiệm",
    startDate: "11/2009",
    endDate: "10/2012",
    type: "Liên thông",
    degree: "Cử nhân",
  },
];

export const mockVaccinations: Vaccination[] = [
  {
    id: "1",
    name: "Vắc-xin COVID-19 (Pfizer)",
    date: "2021-08-15",
    location: "Trung tâm Y tế Quận Ninh Kiều",
    notes: "Mũi 1",
    file: null,
    nextDose: "2021-09-05",
  },
  {
    id: "2",
    name: "Vắc-xin COVID-19 (Pfizer)",
    date: "2021-09-05",
    location: "Trung tâm Y tế Quận Ninh Kiều",
    notes: "Mũi 2",
    file: null,
  },
];

export const mockJobAssignments: JobAssignment[] = [
  {
    id: "1",
    title: "Mô tả công việc Kỹ thuật viên xét nghiệm",
    employeeName: "Lê Thị Mức",
    employeeId: "NV001",
    department: "Chuyên khoa xét nghiệm",
    assignDate: "2023-01-15",
    dueDate: "2023-12-31",
    status: "active",
    description:
      "Mô tả chi tiết về công việc và trách nhiệm của kỹ thuật viên xét nghiệm.",
    file: null,
  },
  {
    id: "2",
    title: "Quy trình xét nghiệm mẫu máu",
    employeeName: "Lê Thị Mức",
    employeeId: "NV001",
    department: "Chuyên khoa xét nghiệm",
    assignDate: "2023-03-22",
    dueDate: "2023-12-31",
    status: "active",
    description:
      "Quy trình chi tiết về cách thực hiện xét nghiệm mẫu máu theo tiêu chuẩn mới.",
    file: null,
  },
];

export const mockJobDescriptions: JobDescription[] = [
  {
    id: "1",
    title: "Mô tả công việc Kỹ thuật viên xét nghiệm",
    department: "Chuyên khoa xét nghiệm",
    uploadDate: "2023-01-15",
    status: "active",
    content: `
# Mô tả công việc Kỹ thuật viên xét nghiệm

## Thông tin chung
- **Vị trí:** Kỹ thuật viên xét nghiệm
- **Phòng/Ban:** Chuyên khoa xét nghiệm
- **Báo cáo cho:** Trưởng khoa Xét nghiệm

## Mục tiêu công việc
Thực hiện các xét nghiệm y khoa chính xác và kịp thời để hỗ trợ chẩn đoán và điều trị cho bệnh nhân.

## Nhiệm vụ chính
1. Tiếp nhận và xử lý các mẫu bệnh phẩm theo quy trình
2. Thực hiện các xét nghiệm huyết học, sinh hóa, vi sinh, miễn dịch theo yêu cầu
3. Kiểm tra và bảo đảm chất lượng kết quả xét nghiệm
4. Ghi chép và báo cáo kết quả xét nghiệm chính xác
5. Bảo trì và kiểm tra thiết bị xét nghiệm hàng ngày
6. Tuân thủ các quy định về an toàn sinh học và kiểm soát nhiễm khuẩn
7. Tham gia các chương trình đào tạo và nâng cao nghiệp vụ

## Yêu cầu
- Bằng cử nhân xét nghiệm y học hoặc tương đương
- Chứng chỉ hành nghề theo quy định
- Kỹ năng sử dụng các thiết bị xét nghiệm hiện đại
- Khả năng làm việc độc lập và theo nhóm
- Kỹ năng giao tiếp tốt

## Điều kiện làm việc
- Làm việc theo ca, bao gồm cả ngày nghỉ và ngày lễ khi cần
- Môi trường làm việc có nguy cơ tiếp xúc với các tác nhân sinh học
- Yêu cầu sử dụng đầy đủ trang thiết bị bảo hộ cá nhân
    `,
  },
  {
    id: "2",
    title: "Quy trình xét nghiệm mẫu máu",
    department: "Chuyên khoa xét nghiệm",
    uploadDate: "2023-03-22",
    status: "active",
    content: `
# Quy trình xét nghiệm mẫu máu

## Mục đích
Đảm bảo việc xét nghiệm mẫu máu được thực hiện đúng quy trình, chính xác và an toàn.

## Phạm vi áp dụng
Áp dụng cho tất cả nhân viên khoa xét nghiệm khi thực hiện các xét nghiệm liên quan đến mẫu máu.

## Quy trình chi tiết
1. **Tiếp nhận mẫu**
   - Kiểm tra thông tin bệnh nhân trên ống nghiệm
   - Kiểm tra chất lượng mẫu (đông, tan máu, không đủ thể tích)
   - Ghi nhận vào sổ theo dõi

2. **Chuẩn bị mẫu**
   - Ly tâm mẫu ở tốc độ và thời gian quy định
   - Tách huyết thanh/huyết tương nếu cần

3. **Thực hiện xét nghiệm**
   - Hiệu chuẩn máy trước khi xét nghiệm
   - Chạy mẫu chứng
   - Thực hiện xét nghiệm theo hướng dẫn của nhà sản xuất

4. **Kiểm tra kết quả**
   - Đánh giá tính hợp lý của kết quả
   - So sánh với giá trị tham chiếu
   - Kiểm tra lại nếu kết quả bất thường

5. **Báo cáo kết quả**
   - Nhập kết quả vào hệ thống
   - In và ký xác nhận kết quả
   - Thông báo kết quả khẩn cấp nếu cần

## Lưu ý an toàn
- Luôn sử dụng găng tay, áo choàng và kính bảo hộ
- Xử lý vật sắc nhọn đúng quy định
- Khử trùng bề mặt làm việc sau mỗi ca
    `,
  },
];
