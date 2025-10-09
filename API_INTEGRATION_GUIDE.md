# API Integration Guide

This document explains how the frontend stores have been updated to integrate with real API calls while maintaining backward compatibility.

## 🚀 Quick Start

### 1. Environment Setup

Make sure your `.env.local` file is configured:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_DEBUG_API=false
```

### 2. Authentication

The authentication system has been fully integrated with the backend API:

```typescript
import { useAuthStore } from '@/stores';

function LoginComponent() {
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    const success = await login(email, password);
    if (success) {
      // User is now logged in, tokens are stored automatically
      router.push('/dashboard');
    }
  };

  return (
    // Your login form
  );
}
```

### 3. Using Stores with API

All stores now support both the new API methods and legacy compatibility methods:

```typescript
import { useEmployeeStore } from "@/stores";

function EmployeeList() {
  const {
    employees,
    isLoading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployeeStore();

  useEffect(() => {
    // Fetch employees with filters
    fetchEmployees({
      page: 1,
      limit: 10,
      search: "john",
      department: "IT",
      status: "ACTIVE",
    });
  }, [fetchEmployees]);

  const handleCreate = async (data) => {
    const success = await createEmployee(data);
    if (success) {
      // Employee created, list will be updated automatically
    }
  };

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {employees.map((emp) => (
        <div key={emp.id}>{emp.name}</div>
      ))}
    </div>
  );
}
```

## 📚 Store APIs

### Authentication Store (`useAuthStore`)

```typescript
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Methods
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    role?: string,
    employeeId?: string
  ) => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  getProfile: () => Promise<void>;
  checkAuth: () => void;
  clearError: () => void;
}
```

### Employee Store (`useEmployeeStore`)

```typescript
interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  stats: EmployeeStats | null;

  // API Methods
  fetchEmployees: (filters?: EmployeeFilters) => Promise<void>;
  fetchEmployee: (id: string) => Promise<void>;
  createEmployee: (data: Omit<Employee, "id">) => Promise<boolean>;
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<boolean>;
  deleteEmployee: (id: string) => Promise<boolean>;
  fetchStats: () => Promise<void>;

  // Legacy Methods (preserved for compatibility)
  setEmployees: (employees: Employee[]) => void;
  addEmployee: (employee: Employee) => void;
}
```

### Certificate Store (`useCertificateStore`)

```typescript
interface CertificateState {
  certificates: Certificate[];
  selectedCertificate: Certificate | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;

  // API Methods (with file upload support)
  fetchCertificates: (filters?: CertificateFilters) => Promise<void>;
  createCertificate: (data: CertificateFormData) => Promise<boolean>;
  updateCertificate: (
    id: string,
    data: Partial<CertificateFormData>
  ) => Promise<boolean>;
  deleteCertificate: (id: string) => Promise<boolean>;
  fetchExpiringCertificates: (days?: number) => Promise<void>;
}
```

### Vaccination Store (`useVaccinationStore`)

Similar API structure to certificates, with support for vaccination file uploads.

### Profile Store (`useProfileStore`)

```typescript
interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;

  // API Methods (with avatar upload support)
  fetchProfile: (employeeId: string) => Promise<void>;
  updateProfile: (
    employeeId: string,
    data: ProfileFormData
  ) => Promise<boolean>;
  deleteProfile: (employeeId: string) => Promise<boolean>;
}
```

## 🔧 API Client Features

### Automatic Token Management

The API client automatically handles:

- JWT token storage (localStorage)
- Token refresh when expired
- Automatic retry with new token
- Redirect to login when refresh fails

### Error Handling

- Global error toast notifications
- Structured error responses
- Network error handling
- Rate limiting awareness

### File Uploads

The API client supports multipart form data for file uploads:

```typescript
const formData = new FormData();
formData.append("name", "Certificate Name");
formData.append("certificate", fileObject);

await api.postFormData("/certificates", formData);
```

## 🛡️ Security Features

### File Validation

Use the file validation utilities before uploading:

```typescript
import { validateDocumentFile, validateImageFile } from "@/lib/file-utils";

const validation = validateDocumentFile(file);
if (!validation.isValid) {
  toast.error(validation.error);
  return;
}
```

### Input Sanitization

Query parameters are automatically sanitized to prevent injection attacks.

### Token Security

- Tokens are stored in localStorage with prefixed keys
- Automatic cleanup on logout
- SSR-safe token access

## 🔄 Migration from Mock Data

### Before (Mock Data)

```typescript
const { employees } = useEmployeeStore();
// employees were loaded from mockEmployees immediately
```

### After (API Integration)

```typescript
const { employees, fetchEmployees, isLoading } = useEmployeeStore();

useEffect(() => {
  fetchEmployees(); // Load from API
}, [fetchEmployees]);

if (isLoading) return <Spinner />;
```

### Backward Compatibility

All legacy methods are preserved, so existing components continue to work:

```typescript
// This still works
const { setEmployees, addEmployee } = useEmployeeStore();
setEmployees(newEmployees);
addEmployee(newEmployee);
```

## 🎯 Best Practices

### 1. Loading States

Always handle loading states:

```typescript
const { isLoading, error } = useEmployeeStore();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

### 2. Error Handling

Clear errors when appropriate:

```typescript
const { error, clearError } = useEmployeeStore();

useEffect(() => {
  if (error) {
    // Show error for 5 seconds, then clear
    const timer = setTimeout(clearError, 5000);
    return () => clearTimeout(timer);
  }
}, [error, clearError]);
```

### 3. Pagination

Use server-side pagination for large datasets:

```typescript
const { fetchEmployees, pagination } = useEmployeeStore();

const handlePageChange = (page: number) => {
  fetchEmployees({ page, limit: 10 });
};
```

### 4. Search and Filters

Debounce search inputs to avoid excessive API calls:

```typescript
import { useDeferredValue } from "react";

const [search, setSearch] = useState("");
const deferredSearch = useDeferredValue(search);

useEffect(() => {
  fetchEmployees({ search: deferredSearch });
}, [deferredSearch, fetchEmployees]);
```

### 5. File Uploads

Validate files before upload:

```typescript
const handleFileSelect = (file: File) => {
  const validation = validateDocumentFile(file);
  if (!validation.isValid) {
    toast.error(validation.error);
    return;
  }

  // File is valid, proceed with upload
  createCertificate({ ...formData, certificate: file });
};
```

## 🔍 Debugging

Enable API debugging in your `.env.local`:

```env
NEXT_PUBLIC_DEBUG_API=true
```

This will log all API requests and responses to the browser console.

## 📝 Notes

### Job and Training Endpoints

The job and training stores are prepared for API integration but currently use placeholder implementations since these endpoints are not yet defined in the backend API documentation. When the backend endpoints become available, simply uncomment the API calls in these stores and remove the placeholder comments.

### Type Mapping

The stores automatically map between frontend TypeScript interfaces and backend API response formats. This ensures type safety while accommodating any differences in field naming conventions between frontend and backend.

### SSR Compatibility

All stores are designed to work with Next.js SSR. Token access is safely handled on the client side only, preventing hydration mismatches.
