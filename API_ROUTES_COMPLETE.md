# 🏥 Hospital Management Backend - Complete API Routes

## 📋 Base Information
- **Base URL**: `http://localhost:5000/api/v1`
- **Content-Type**: `application/json`
- **Authentication**: Bearer Token (JWT)

---

## 🔐 Authentication Routes (`/api/v1/auth`)

### 1. User Registration
```http
POST /api/v1/auth/register
```

**Rate Limit**: 5 requests / 15 minutes

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "role": "client", // Optional: "admin" | "client"
  "employeeId": "64f1b2c3d4e5f6789abcdef0" // Optional
}
```

**Validation Rules:**
- `email`: Valid email format, required
- `password`: Min 8 chars, uppercase, lowercase, number, special char
- `role`: Optional, "admin" or "client"
- `employeeId`: Optional, valid ObjectId

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64f1b2c3d4e5f6789abcdef0",
      "email": "user@example.com",
      "role": "client",
      "isActive": true,
      "createdAt": "2023-10-06T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 2. User Login
```http
POST /api/v1/auth/login
```

**Rate Limit**: 5 requests / 15 minutes

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Validation Rules:**
- `email`: Valid email format, required
- `password`: Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64f1b2c3d4e5f6789abcdef0",
      "email": "user@example.com",
      "role": "client",
      "isActive": true
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### 3. Refresh Token
```http
POST /api/v1/auth/refresh-token
```

**Rate Limit**: 5 requests / 15 minutes

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 4. Logout
```http
POST /api/v1/auth/logout
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 5. Get User Profile
```http
GET /api/v1/auth/profile
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "64f1b2c3d4e5f6789abcdef0",
    "email": "user@example.com",
    "role": "client",
    "isActive": true,
    "employeeId": {
      "id": "64f1b2c3d4e5f6789abcdef1",
      "name": "Nguyễn Văn A",
      "department": "IT"
    },
    "createdAt": "2023-10-06T00:00:00.000Z"
  }
}
```

### 6. Forgot Password
```http
POST /api/v1/auth/forgot-password
```

**Rate Limit**: 5 requests / 15 minutes

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

## 👥 Employee Routes (`/api/v1/employees`)

**All routes require authentication**

### 1. Get Employees List
```http
GET /api/v1/employees
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 10, max: 100): Items per page
- `search` (string): Search in name, email
- `sortBy` (string, default: 'createdAt'): Sort field
- `sortOrder` (string, default: 'desc'): 'asc' or 'desc'
- `department` (string): Filter by department
- `position` (string): Filter by position
- `status` (string): ACTIVE | INACTIVE | ON_LEAVE

**Example Request:**
```http
GET /api/v1/employees?page=1&limit=10&search=nguyen&department=IT&status=ACTIVE&sortBy=name&sortOrder=asc
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": [
    {
      "id": "64f1b2c3d4e5f6789abcdef0",
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@hospital.com",
      "phone": "0123456789",
      "department": "IT",
      "position": "Developer",
      "hireDate": "2023-01-15T00:00:00.000Z",
      "status": "ACTIVE",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. Get Employee by ID
```http
GET /api/v1/employees/:id
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Parameters:**
- `id` (string): Valid ObjectId

**Success Response (200):**
```json
{
  "success": true,
  "message": "Employee retrieved successfully",
  "data": {
    "id": "64f1b2c3d4e5f6789abcdef0",
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@hospital.com",
    "phone": "0123456789",
    "department": "IT",
    "position": "Developer",
    "hireDate": "2023-01-15T00:00:00.000Z",
    "status": "ACTIVE",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 3. Create Employee (Admin Only)
```http
POST /api/v1/employees
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission**: Admin only

**Request Body:**
```json
{
  "name": "Nguyễn Văn B",
  "email": "nguyenvanb@hospital.com",
  "phone": "0987654321",
  "department": "HR",
  "position": "Manager",
  "hireDate": "2023-10-06",
  "status": "ACTIVE"
}
```

**Validation Rules:**
- `name`: 2-100 characters, required
- `email`: Valid email, required, unique
- `phone`: Valid phone format, required
- `department`: 2-100 characters, required
- `position`: 2-100 characters, required
- `hireDate`: Valid ISO8601 date, required
- `status`: Optional, ACTIVE | INACTIVE | ON_LEAVE

**Success Response (201):**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": "64f1b2c3d4e5f6789abcdef0",
    "name": "Nguyễn Văn B",
    "email": "nguyenvanb@hospital.com",
    "phone": "0987654321",
    "department": "HR",
    "position": "Manager",
    "hireDate": "2023-10-06T00:00:00.000Z",
    "status": "ACTIVE",
    "createdAt": "2023-10-06T00:00:00.000Z",
    "updatedAt": "2023-10-06T00:00:00.000Z"
  }
}
```

### 4. Update Employee (Admin Only)
```http
PUT /api/v1/employees/:id
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission**: Admin only

**Request Body:** (Same as Create Employee, all fields optional)
```json
{
  "name": "Nguyễn Văn B Updated",
  "department": "IT",
  "status": "INACTIVE"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "id": "64f1b2c3d4e5f6789abcdef0",
    "name": "Nguyễn Văn B Updated",
    "email": "nguyenvanb@hospital.com",
    "phone": "0987654321",
    "department": "IT",
    "position": "Manager",
    "hireDate": "2023-10-06T00:00:00.000Z",
    "status": "INACTIVE",
    "createdAt": "2023-10-06T00:00:00.000Z",
    "updatedAt": "2023-10-07T00:00:00.000Z"
  }
}
```

### 5. Delete Employee (Admin Only)
```http
DELETE /api/v1/employees/:id
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission**: Admin only

**Success Response (200):**
```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

### 6. Get Employee Statistics (Admin Only)
```http
GET /api/v1/employees/stats
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission**: Admin only

**Success Response (200):**
```json
{
  "success": true,
  "message": "Employee statistics retrieved successfully",
  "data": {
    "totalEmployees": 150,
    "activeEmployees": 140,
    "inactiveEmployees": 5,
    "onLeaveEmployees": 5,
    "departmentStats": {
      "IT": 30,
      "HR": 25,
      "Finance": 20,
      "Operations": 35,
      "Management": 10
    },
    "positionStats": {
      "Developer": 25,
      "Manager": 15,
      "Analyst": 20,
      "Coordinator": 30,
      "Director": 5
    }
  }
}
```

---

## 📄 Profile Routes (`/api/v1/profiles`)

**All routes require authentication**

### 1. Get Employee Profile
```http
GET /api/v1/profiles/:employeeId
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Parameters:**
- `employeeId` (string): Valid ObjectId

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "64f1b2c3d4e5f6789abcdef0",
    "employeeId": {
      "id": "64f1b2c3d4e5f6789abcdef1",
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@hospital.com",
      "department": "IT",
      "position": "Developer"
    },
    "fullName": "Nguyễn Văn A",
    "gender": "MALE",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "placeOfBirth": "Hà Nội",
    "nationality": "Việt Nam",
    "religion": "Không",
    "idNumber": "123456789",
    "idIssueDate": "2010-01-01T00:00:00.000Z",
    "idIssuePlace": "Hà Nội",
    "avatar": "https://res.cloudinary.com/...",
    "address": {
      "street": "123 Đường ABC",
      "ward": "Phường XYZ",
      "district": "Quận 1",
      "city": "TP.HCM",
      "zipCode": "70000"
    },
    "emergencyContact": {
      "name": "Nguyễn Thị B",
      "relationship": "Vợ",
      "phone": "0987654321",
      "address": "123 Đường ABC, TP.HCM"
    },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 2. Create/Update Employee Profile
```http
PUT /api/v1/profiles/:employeeId
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Parameters:**
- `employeeId` (string): Valid ObjectId

**Request Body (Form Data):**
```
fullName: "Nguyễn Văn A"
gender: "MALE"
dateOfBirth: "1990-01-01"
placeOfBirth: "Hà Nội"
nationality: "Việt Nam"
religion: "Không"
idNumber: "123456789"
idIssueDate: "2010-01-01"
idIssuePlace: "Hà Nội"
avatar: [file] (optional)
address[street]: "123 Đường ABC"
address[ward]: "Phường XYZ"
address[district]: "Quận 1"
address[city]: "TP.HCM"
address[zipCode]: "70000"
emergencyContact[name]: "Nguyễn Thị B"
emergencyContact[relationship]: "Vợ"
emergencyContact[phone]: "0987654321"
emergencyContact[address]: "123 Đường ABC, TP.HCM"
```

**Validation Rules:**
- `fullName`: 2-100 characters, required
- `gender`: MALE | FEMALE | OTHER, required
- `dateOfBirth`: Valid date in past, required
- `idNumber`: 9-12 digits, required
- `avatar`: Image file (JPEG, PNG, WebP), max 5MB

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "64f1b2c3d4e5f6789abcdef0",
    "employeeId": {
      "id": "64f1b2c3d4e5f6789abcdef1",
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@hospital.com",
      "department": "IT",
      "position": "Developer"
    },
    "fullName": "Nguyễn Văn A",
    "gender": "MALE",
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "avatar": "https://res.cloudinary.com/...",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-10-06T00:00:00.000Z"
  }
}
```

### 3. Delete Employee Profile (Admin Only)
```http
DELETE /api/v1/profiles/:employeeId
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Permission**: Admin only

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile deleted successfully"
}
```

---

## 🏆 Certificate Routes (`/api/v1/certificates`)

**All routes require authentication**

### 1. Get Certificates List
```http
GET /api/v1/certificates
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page`, `limit`, `search`, `sortBy`, `sortOrder` (same as employees)
- `type` (string): Filter by certificate type
- `status` (string): ACTIVE | EXPIRED | SUSPENDED
- `employeeId` (string): Filter by employee

**Success Response (200):**
```json
{
  "success": true,
  "message": "Certificates retrieved successfully",
  "data": [
    {
      "id": "64f1b2c3d4e5f6789abcdef0",
      "employeeId": {
        "id": "64f1b2c3d4e5f6789abcdef1",
        "name": "Nguyễn Văn A",
        "email": "nguyenvana@hospital.com",
        "department": "IT",
        "position": "Developer"
      },
      "name": "AWS Certified Developer",
      "type": "CERTIFICATE",
      "issuer": "Amazon Web Services",
      "issueDate": "2023-01-15T00:00:00.000Z",
      "expiryDate": "2026-01-15T00:00:00.000Z",
      "status": "ACTIVE",
      "certificateUrl": "https://res.cloudinary.com/...",
      "description": "AWS Developer certification",
      "createdAt": "2023-01-15T00:00:00.000Z",
      "updatedAt": "2023-01-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. Get Certificate by ID
```http
GET /api/v1/certificates/:id
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Certificate retrieved successfully",
  "data": {
    "id": "64f1b2c3d4e5f6789abcdef0",
    "employeeId": {
      "id": "64f1b2c3d4e5f6789abcdef1",
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@hospital.com",
      "department": "IT",
      "position": "Developer"
    },
    "name": "AWS Certified Developer",
    "type": "CERTIFICATE",
    "issuer": "Amazon Web Services",
    "issueDate": "2023-01-15T00:00:00.000Z",
    "expiryDate": "2026-01-15T00:00:00.000Z",
    "status": "ACTIVE",
    "certificateUrl": "https://res.cloudinary.com/...",
    "description": "AWS Developer certification",
    "createdAt": "2023-01-15T00:00:00.000Z",
    "updatedAt": "2023-01-15T00:00:00.000Z"
  }
}
```

### 3. Create Certificate
```http
POST /api/v1/certificates
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
employeeId: "64f1b2c3d4e5f6789abcdef1"
name: "AWS Certified Developer"
type: "CERTIFICATE"
issuer: "Amazon Web Services"
issueDate: "2023-01-15"
expiryDate: "2026-01-15"
status: "ACTIVE"
description: "AWS Developer certification"
certificate: [file]
```

**Validation Rules:**
- `employeeId`: Valid ObjectId, required
- `name`: 2-200 characters, required
- `type`: DEGREE | CERTIFICATE | OTHER, required
- `issuer`: 2-200 characters, required
- `issueDate`: Valid ISO8601 date, required
- `expiryDate`: Valid ISO8601 date, optional
- `certificate`: PDF/Image file, max 5MB

**Success Response (201):**
```json
{
  "success": true,
  "message": "Certificate created successfully",
  "data": {
    "id": "64f1b2c3d4e5f6789abcdef0",
    "employeeId": "64f1b2c3d4e5f6789abcdef1",
    "name": "AWS Certified Developer",
    "type": "CERTIFICATE",
    "issuer": "Amazon Web Services",
    "issueDate": "2023-01-15T00:00:00.000Z",
    "expiryDate": "2026-01-15T00:00:00.000Z",
    "status": "ACTIVE",
    "certificateUrl": "https://res.cloudinary.com/...",
    "description": "AWS Developer certification",
    "createdAt": "2023-10-06T00:00:00.000Z",
    "updatedAt": "2023-10-06T00:00:00.000Z"
  }
}
```

### 4. Update Certificate
```http
PUT /api/v1/certificates/:id
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body:** (Same as create, all fields optional)

### 5. Delete Certificate (Admin Only)
```http
DELETE /api/v1/certificates/:id
```

**Permission**: Admin only

### 6. Get Expiring Certificates
```http
GET /api/v1/certificates/expiring
```

**Query Parameters:**
- `days` (number, default: 30): Days before expiry

**Success Response (200):**
```json
{
  "success": true,
  "message": "Expiring certificates retrieved successfully",
  "data": [
    {
      "id": "64f1b2c3d4e5f6789abcdef0",
      "employeeId": {
        "id": "64f1b2c3d4e5f6789abcdef1",
        "name": "Nguyễn Văn A",
        "department": "IT"
      },
      "name": "AWS Certified Developer",
      "expiryDate": "2023-11-01T00:00:00.000Z",
      "daysUntilExpiry": 25
    }
  ],
  "pagination": {...}
}
```

---

## 💉 Vaccination Routes (`/api/v1/vaccinations`)

**All routes require authentication**

### 1. Get Vaccinations List
```http
GET /api/v1/vaccinations
```

**Query Parameters:**
- `page`, `limit`, `search`, `sortBy`, `sortOrder`
- `employeeId` (string): Filter by employee
- `dateFrom` (string): Filter from date (YYYY-MM-DD)
- `dateTo` (string): Filter to date (YYYY-MM-DD)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Vaccinations retrieved successfully",
  "data": [
    {
      "id": "64f1b2c3d4e5f6789abcdef0",
      "employeeId": {
        "id": "64f1b2c3d4e5f6789abcdef1",
        "name": "Nguyễn Văn A",
        "email": "nguyenvana@hospital.com",
        "department": "IT"
      },
      "name": "COVID-19 Vaccine",
      "date": "2023-01-15T00:00:00.000Z",
      "location": "Bệnh viện ABC",
      "batchNumber": "LOT123456",
      "nextDose": "2023-07-15T00:00:00.000Z",
      "notes": "First dose",
      "certificateUrl": "https://res.cloudinary.com/...",
      "createdAt": "2023-01-15T00:00:00.000Z",
      "updatedAt": "2023-01-15T00:00:00.000Z"
    }
  ],
  "pagination": {...}
}
```

### 2. Create Vaccination Record
```http
POST /api/v1/vaccinations
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
employeeId: "64f1b2c3d4e5f6789abcdef1"
name: "COVID-19 Vaccine"
date: "2023-01-15"
location: "Bệnh viện ABC"
batchNumber: "LOT123456"
nextDose: "2023-07-15"
notes: "First dose"
vaccination: [file] (optional)
```

**Validation Rules:**
- `employeeId`: Valid ObjectId, required
- `name`: 2-200 characters, required
- `date`: Valid ISO8601 date, required
- `location`: 2-200 characters, required
- `notes`: Max 1000 characters, optional
- `nextDose`: Valid ISO8601 date, optional

**Success Response (201):**
```json
{
  "success": true,
  "message": "Vaccination record created successfully",
  "data": {
    "id": "64f1b2c3d4e5f6789abcdef0",
    "employeeId": "64f1b2c3d4e5f6789abcdef1",
    "name": "COVID-19 Vaccine",
    "date": "2023-01-15T00:00:00.000Z",
    "location": "Bệnh viện ABC",
    "batchNumber": "LOT123456",
    "nextDose": "2023-07-15T00:00:00.000Z",
    "notes": "First dose",
    "certificateUrl": "https://res.cloudinary.com/...",
    "createdAt": "2023-10-06T00:00:00.000Z",
    "updatedAt": "2023-10-06T00:00:00.000Z"
  }
}
```

### 3. Update Vaccination Record
```http
PUT /api/v1/vaccinations/:id
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

### 4. Delete Vaccination Record (Admin Only)
```http
DELETE /api/v1/vaccinations/:id
```

**Permission**: Admin only

---

## 📁 Upload Routes (`/api/v1/upload`)

**All routes require authentication and have upload rate limiting (10 requests / 15 minutes)**

### 1. Upload Single File
```http
POST /api/v1/upload/single
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
file: [file]
```

**File Constraints:**
- Max size: 5MB
- Allowed types: JPEG, PNG, WebP, PDF

**Success Response (200):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "filename": "uploaded_file_1696579200",
    "originalName": "document.pdf",
    "mimetype": "application/pdf",
    "size": 1024000
  }
}
```

### 2. Upload Multiple Files
```http
POST /api/v1/upload/multiple
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
files: [file1, file2, file3] (max 10 files)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "data": [
    {
      "url": "https://res.cloudinary.com/...",
      "filename": "uploaded_file_1_1696579200",
      "originalName": "document1.pdf",
      "mimetype": "application/pdf",
      "size": 1024000
    },
    {
      "url": "https://res.cloudinary.com/...",
      "filename": "uploaded_file_2_1696579200",
      "originalName": "image1.jpg",
      "mimetype": "image/jpeg",
      "size": 512000
    }
  ]
}
```

---

## 🔧 Utility Routes

### 1. Health Check
```http
GET /api/v1/health
```

**No authentication required**

**Success Response (200):**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2023-10-06T09:05:50.006Z",
  "version": "v1"
}
```

---

## 📝 Common Response Formats

### Success Response Structure
```json
{
  "success": true,
  "message": "Operation successful",
  "data": any // Single object or array
}
```

### Paginated Response Structure
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [], // Array of items
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Response Structure
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Please provide a valid email"],
    "password": ["Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character"]
  }
}
```

---

## 🔒 Security & Rate Limiting

### Rate Limits
- **Authentication endpoints**: 5 requests / 15 minutes
- **General API endpoints**: 100 requests / 15 minutes
- **File upload endpoints**: 10 requests / 15 minutes

### Authentication
All protected endpoints require the Authorization header:
```
Authorization: Bearer <access_token>
```

### File Upload Security
- Max file size: 5MB
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`
- Files stored in Cloudinary with organized folder structure

---

## 📊 HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200    | OK - Request successful |
| 201    | Created - Resource created successfully |
| 400    | Bad Request - Invalid request data |
| 401    | Unauthorized - Authentication required |
| 403    | Forbidden - Insufficient permissions |
| 404    | Not Found - Resource not found |
| 409    | Conflict - Resource already exists |
| 413    | Payload Too Large - File too large |
| 422    | Unprocessable Entity - Validation error |
| 429    | Too Many Requests - Rate limit exceeded |
| 500    | Internal Server Error - Server error |

---

## 🧪 Example cURL Commands

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.com",
    "password": "Password123!"
  }'
```

### Get Employees
```bash
curl -X GET "http://localhost:5000/api/v1/employees?page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

### Upload File
```bash
curl -X POST http://localhost:5000/api/v1/upload/single \
  -H "Authorization: Bearer <access_token>" \
  -F "file=@/path/to/document.pdf"
```

### Create Employee
```bash
curl -X POST http://localhost:5000/api/v1/employees \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn Test",
    "email": "test@hospital.com",
    "phone": "0123456789",
    "department": "IT",
    "position": "Developer",
    "hireDate": "2023-10-06"
  }'
```