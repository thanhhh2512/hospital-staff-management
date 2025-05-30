"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import {
  JobDescriptionHeader,
  JobDescriptionCard,
  JobDescriptionViewer,
  EmptyState,
  JobDescription,
} from "@/components/job-description"

export default function JobDescriptionPage() {
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Sample job descriptions
  const jobDescriptions: JobDescription[] = [
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
  ]

  const handleViewJob = (job: JobDescription) => {
    setSelectedJob(job)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <JobDescriptionHeader />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobDescriptions.map((job) => (
          <JobDescriptionCard
            key={job.id}
            job={job}
            onView={() => handleViewJob(job)}
          />
        ))}
      </div>

      {jobDescriptions.length === 0 && <EmptyState />}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <JobDescriptionViewer
          job={selectedJob}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </Dialog>
    </div>
  )
}
