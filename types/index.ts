export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  status: "active" | "inactive" | "onleave";
}

export interface Certificate {
  id: string;
  name: string;
  type: "DEGREE" | "CERTIFICATE" | "OTHER";
  issueDate: string;
  expiryDate?: string;
  issuer: string;
  description: string;
  fileUrl: string | null;
  employeeName?: string;
  employeeId?: string;
  status: "ACTIVE" | "EXPIRED" | "PENDING";
}

export interface TrainingHistory {
  id: string;
  employeeId: string;
  school: string;
  major: string;
  startDate: string;
  endDate?: string;
  type: 'DEGREE' | 'CERTIFICATE' | 'COURSE' | 'OTHER';
  degree: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Vaccination {
  id: string;
  name: string;
  date: string;
  location: string;
  notes?: string;
  fileUrl: string | null;
  nextDose?: string;
}

export interface VaccinationCertificate {
  id: string;
  name: string;
  issueDate: string;
  expiryDate?: string;
  issuer: string;
  fileUrl: string | null;
}

export interface VaccinationFormData {
  name: string;
  date: string;
  location: string;
  notes?: string;
  nextDose?: string;
}

export interface JobAssignment {
  id: string;
  title: string;
  employeeName: string;
  employeeId: string;
  department: string;
  assignDate: string;
  dueDate: string;
  status: "active" | "completed" | "overdue";
  description: string;
  file: string | File | null;
}

export interface JobDescription {
  id: string;
  title: string;
  department: string;
  uploadDate: string;
  status: "active" | "inactive";
  content: string;
}

export interface Profile {
  // Thông tin cá nhân
  fullName: string;
  gender: "male" | "female" | "other";
  dob: string;
  birthPlace: string;
  hometown: string;
  ethnicity: string;
  religion: string;
  idNumber: string;
  idIssueDate: string;
  phone: string;
  email: string;
  permanentAddress: string;
  currentAddress: string;
  avatar?: string | null;

  // Thông tin nghề nghiệp
  position: string;
  department: string;
  jobTitle: string;
  hireDate: string;
  hireAgency: string;
  rank: string;
  salary: string;
  salaryDate: string;
  education: string;
  specialization: string;
  politics?: string;
  management?: string;
  languageLevel: string;
  it: string;
  partyJoinDate?: string;
  partyOfficialDate?: string;
  health: string;
  familyPolicy?: string;
  // Thông tin bổ sung
  socialOrgJoinDate?: string; // Ngày tham gia tổ chức chính trị - xã hội
  enlistmentDate?: string; // Ngày nhập ngũ
  dischargeDate?: string; // Ngày xuất ngũ
  highestMilitaryRank?: string; // Quân hàm cao nhất
  highestTitle?: string; // Danh hiệu được phong tặng cao nhất
  forte?: string; // Sở trường công tác
  reward?: string; // Khen thưởng
  discipline?: string; // Kỷ luật
  bhxhNumber?: string; // Số sổ BHXH
}

export interface Document {
  id: string;
  title: string;
  category: string;
  employeeName: string;
  employeeId: string;
  description?: string;
  uploadDate: string;
  status: "active" | "archived" | "pending";
  file: string | null;
}

export interface DocumentView {
  id: string;
  title: string;
  category:
  | "personal"
  | "degree"
  | "certificate"
  | "vaccination"
  | "health"
  | "other";
  employeeName: string;
  employeeId: string;
  uploadDate: string;
  status: "active" | "archived" | "pending";
  description?: string;
  file: string | null;
  sourceType: "profile" | "certificate" | "vaccination" | "health" | "other";
  sourceId: string;
}
