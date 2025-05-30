export interface Vaccination {
  id: string;
  name: string;
  date: string;
  location: string;
  notes?: string;
  file: string | null;
  nextDose?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issueDate: string;
  expiryDate?: string;
  issuer: string;
  file: string | null;
}

export interface VaccinationFormData {
  name: string;
  date: string;
  location: string;
  notes?: string;
  nextDose?: string;
}
