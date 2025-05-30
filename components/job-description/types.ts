export interface JobDescription {
  id: string;
  title: string;
  department: string;
  uploadDate: string;
  status: "active" | "archived";
  content: string;
}
