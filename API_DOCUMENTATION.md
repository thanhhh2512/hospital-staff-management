# 🏥 Hospital Management Backend - API Documentation

## 📋 Tổng quan

**Hospital Management Backend** là một REST API được xây dựng với Node.js, Express.js, TypeScript và MongoDB để quản lý nhân viên bệnh viện.

### Thông tin cơ bản
- **Base URL**: `http://localhost:5000/api/v1`
- **Authentication**: JWT (JSON Web Token)
- **Content-Type**: `application/json`
- **Version**: v1.0.0

### Cấu trúc Response chung
```json
{
  "success": boolean,
  "message": string,
  "data": any,
  "errors": object (optional)
}
```

### Cấu trúc Response có phân trang
```json
{
  "success": boolean,
  "message": string,
  "data": array,
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number,
    "hasNext": boolean,
    "hasPrev": boolean
  }
}
```

---

## 🔐 Authentication APIs

### 1. Đăng ký người dùng
```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "EMPLOYEE", // ADMIN | MANAGER | EMPLOYEE
  "employeeId": "64f1b2c3d4e5f6789abcdef0" // optional
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64f1b2c3d4e5f6789abcdef0",
      "email": "user@example.com",
      "role": "EMPLOYEE",
      "isActive": true
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### 2. Đăng nhập
```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64f1b2c3d4e5f6789abcdef0",
      "email": "user@example.com",
      "role": "EMPLOYEE"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### 3. Làm mới token
```http
POST /api/v1/auth/refresh-token
```

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

### 4. Đăng xuất
```http
POST /api/v1/auth/logout
```

**Headers:**
```
Authorization: Bearer <access_token>
```

### 5. Lấy thông tin profile người dùng
```http
GET /api/v1/auth/profile
```

**Headers:**
```
Authorization: Bearer <access_token>
```

### 6. Quên mật khẩu
```http
POST /api/v1/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

---

## 👥 Employee APIs

### 1. Lấy danh sách nhân viên
```http
GET /api/v1/employees
```

**Query Parameters:**
- `page` (number, default: 1): Trang hiện tại
- `limit` (number, default: 10, max: 100): Số lượng bản ghi mỗi trang
- `search` (string): Tìm kiếm theo tên, email
- `sortBy` (string, default: 'createdAt'): Trường sắp xếp
- `sortOrder` (string, default: 'desc'): 'asc' hoặc 'desc'
- `department` (string): Lọc theo phòng ban
- `position` (string): Lọc theo vị trí
- `status` (string): ACTIVE | INACTIVE | ON_LEAVE

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
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
      "department": "Khoa Nội",
      "position": "Bác sĩ",
      "hireDate": "2023-01-15T00:00:00.000Z",
      "status": "ACTIVE",
      "createdAt": "2023-01-01T00:00:00.000Z"
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

### 2. Lấy thông tin nhân viên theo ID
```http
GET /api/v1/employees/:id
```

**Headers:**
```
Authorization: Bearer <access_token>
```

### 3. Tạo nhân viên mới
```http
POST /api/v1/employees
```

**Headers:**
```
Authorization: Bearer <access_token>
```
**Permission:** Admin only

**Request Body:**
```json
{
  "name": "Nguyễn Văn B",
  "email": "nguyenvanb@hospital.com",
  "phone": "0987654321",
  "department": "Khoa Ngoại",
  "position": "Y tá",
  "hireDate": "2023-10-06",
  "status": "ACTIVE"
}
```

### 4. Cập nhật thông tin nhân viên
```http
PUT /api/v1/employees/:id
```

**Headers:**
```
Authorization: Bearer <access_token>
```
**Permission:** Admin only

### 5. Xóa nhân viên
```http
DELETE /api/v1/employees/:id
```

**Headers:**
```
Authorization: Bearer <access_token>
```
**Permission:** Admin only

### 6. Lấy thống kê nhân viên
```http
GET /api/v1/employees/stats
```

**Headers:**
```
Authorization: Bearer <access_token>
```
**Permission:** Admin only

**Response (200):**
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
      "Khoa Nội": 30,
      "Khoa Ngoại": 25,
      "Khoa Cấp cứu": 20
    }
  }
}
```

---

## 📄 Profile APIs

### 1. Lấy thông tin profile nhân viên
```http
GET /api/v1/profiles/:employeeId
```

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
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
      "department": "Khoa Nội"
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
    }
  }
}
```

### 2. Tạo/Cập nhật profile nhân viên
```http
PUT /api/v1/profiles/:employeeId
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

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

### 3. Xóa profile nhân viên
```http
DELETE /api/v1/profiles/:employeeId
```

**Headers:**
```
Authorization: Bearer <access_token>
```
**Permission:** Admin only

---

## 🏆 Certificate APIs

### 1. Lấy danh sách chứng chỉ
```http
GET /api/v1/certificates
```

**Query Parameters:**
- `page`, `limit`, `search`, `sortBy`, `sortOrder` (giống Employee APIs)
- `type` (string): Lọc theo loại chứng chỉ
- `status` (string): ACTIVE | EXPIRED | SUSPENDED
- `employeeId` (string): Lọc theo nhân viên

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
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
        "department": "Khoa Nội"
      },
      "name": "Chứng chỉ hành nghề y",
      "type": "PROFESSIONAL",
      "issuer": "Bộ Y tế",
      "issueDate": "2020-01-15T00:00:00.000Z",
      "expiryDate": "2025-01-15T00:00:00.000Z",
      "status": "ACTIVE",
      "certificateUrl": "https://res.cloudinary.com/...",
      "description": "Chứng chỉ hành nghề y khoa"
    }
  ],
  "pagination": {...}
}
```

### 2. Lấy thông tin chứng chỉ theo ID
```http
GET /api/v1/certificates/:id
```

### 3. Tạo chứng chỉ mới
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
name: "Chứng chỉ hành nghề y"
type: "PROFESSIONAL"
issuer: "Bộ Y tế"
issueDate: "2020-01-15"
expiryDate: "2025-01-15"
status: "ACTIVE"
description: "Chứng chỉ hành nghề y khoa"
certificate: [file]
```

### 4. Cập nhật chứng chỉ
```http
PUT /api/v1/certificates/:id
```

### 5. Xóa chứng chỉ
```http
DELETE /api/v1/certificates/:id
```

**Permission:** Admin only

### 6. Lấy danh sách chứng chỉ sắp hết hạn
```http
GET /api/v1/certificates/expiring
```

**Query Parameters:**
- `days` (number, default: 30): Số ngày trước khi hết hạn

---

## 💉 Vaccination APIs

### 1. Lấy danh sách tiêm chủng
```http
GET /api/v1/vaccinations
```

**Query Parameters:**
- `page`, `limit`, `search`, `sortBy`, `sortOrder`
- `employeeId` (string): Lọc theo nhân viên
- `dateFrom` (string): Lọc từ ngày (YYYY-MM-DD)
- `dateTo` (string): Lọc đến ngày (YYYY-MM-DD)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
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
        "department": "Khoa Nội"
      },
      "name": "Vaccine COVID-19",
      "date": "2023-01-15T00:00:00.000Z",
      "location": "Bệnh viện ABC",
      "batchNumber": "LOT123456",
      "nextDose": "2023-07-15T00:00:00.000Z",
      "notes": "Liều đầu tiên",
      "certificateUrl": "https://res.cloudinary.com/..."
    }
  ],
  "pagination": {...}
}
```

### 2. Tạo bản ghi tiêm chủng mới
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
name: "Vaccine COVID-19"
date: "2023-01-15"
location: "Bệnh viện ABC"
batchNumber: "LOT123456"
nextDose: "2023-07-15"
notes: "Liều đầu tiên"
certificate: [file] (optional)
```

### 3. Cập nhật bản ghi tiêm chủng
```http
PUT /api/v1/vaccinations/:id
```

### 4. Xóa bản ghi tiêm chủng
```http
DELETE /api/v1/vaccinations/:id
```

**Permission:** Admin only

---

## 📁 Upload APIs

### 1. Upload file đơn
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

**Response (200):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "filename": "uploaded_file_name",
    "originalName": "original_file_name.pdf",
    "mimetype": "application/pdf",
    "size": 1024000
  }
}
```

### 2. Upload nhiều file
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
files: [file1, file2, file3]
```

**Response (200):**
```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "data": [
    {
      "url": "https://res.cloudinary.com/...",
      "filename": "file1_name",
      "originalName": "original_file1.pdf",
      "mimetype": "application/pdf",
      "size": 1024000
    }
  ]
}
```

---

## 🔧 Utility APIs

### 1. Health Check
```http
GET /api/v1/health
```

**Response (200):**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2023-10-06T09:05:50.006Z",
  "version": "v1"
}
```

---

## 🛡️ Security & Rate Limiting

### Rate Limits
- **Authentication endpoints**: 5 requests/15 minutes
- **General API endpoints**: 100 requests/15 minutes  
- **File upload endpoints**: 10 requests/15 minutes

### File Upload Constraints
- **Max file size**: 5MB
- **Allowed types**: JPEG, PNG, WebP, PDF
- **Storage**: Cloudinary CDN

### Headers bảo mật
- `Content-Security-Policy`
- `Cross-Origin-Opener-Policy`
- `Cross-Origin-Resource-Policy`
- `Origin-Agent-Cluster`
- `Referrer-Policy`
- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `X-DNS-Prefetch-Control`
- `X-Download-Options`
- `X-Frame-Options`
- `X-Permitted-Cross-Domain-Policies`

---

## 📝 Error Codes

### HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | OK - Request thành công |
| 201 | Created - Tạo mới thành công |
| 400 | Bad Request - Dữ liệu đầu vào không hợp lệ |
| 401 | Unauthorized - Chưa xác thực |
| 403 | Forbidden - Không có quyền truy cập |
| 404 | Not Found - Không tìm thấy tài nguyên |
| 409 | Conflict - Dữ liệu bị trung lặp |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Vượt quá rate limit |
| 500 | Internal Server Error - Lỗi máy chủ |

### Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

---

## 🔑 Authentication

### JWT Token Structure

**Access Token** (expires in 7 days):
```json
{
  "userId": "64f1b2c3d4e5f6789abcdef0",
  "email": "user@example.com",
  "role": "EMPLOYEE",
  "iat": 1633420800,
  "exp": 1634025600,
  "iss": "hospital-management-api",
  "aud": "hospital-management-client"
}
```

**Refresh Token** (expires in 30 days):
- Dùng để làm mới access token
- Lưu trữ trong database
- Có thể thu hồi (revoke)

### Authorization Headers

Tất cả protected endpoints yêu cầu header:
```
Authorization: Bearer <access_token>
```

---

## 📚 Data Models

### User Roles
- `ADMIN`: Toàn quyền quản trị
- `MANAGER`: Quản lý phòng ban
- `EMPLOYEE`: Nhân viên thường

### Employee Status
- `ACTIVE`: Đang làm việc
- `INACTIVE`: Không hoạt động
- `ON_LEAVE`: Đang nghỉ phép

### Certificate Types
- `PROFESSIONAL`: Chứng chỉ hành nghề
- `TRAINING`: Chứng chỉ đào tạo
- `SKILL`: Chứng chỉ kỹ năng
- `SAFETY`: Chứng chỉ an toàn

### Document Categories
- `PERSONAL`: Tài liệu cá nhân
- `DEGREE`: Bằng cấp
- `CERTIFICATE`: Chứng chỉ
- `VACCINATION`: Tiêm chủng
- `HEALTH`: Sức khỏe
- `OTHER`: Khác

---

## 🚀 Getting Started

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Flow
1. Đăng ký/Đăng nhập để nhận access token và refresh token
2. Sử dụng access token trong header `Authorization: Bearer <token>`
3. Khi access token hết hạn, sử dụng refresh token để lấy token mới
4. Đăng xuất để vô hiệu hóa refresh token

### Example cURL Request
```bash
# Đăng nhập
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.com",
    "password": "password123"
  }'

# Lấy danh sách nhân viên
curl -X GET http://localhost:5000/api/v1/employees \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json"
```

---

## 📞 Support

Nếu có thắc mắc về API, vui lòng liên hệ team phát triển hoặc tham khảo:
- **Health Check**: `GET /api/v1/health`
- **Error Logs**: Kiểm tra console logs của server
- **Rate Limit**: Kiểm tra headers `X-RateLimit-*` trong response

---

*Last updated: October 6, 2025*