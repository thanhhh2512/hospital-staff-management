import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ViewFileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: string | File | null
  fileName: string
}

export function ViewFileDialog({ open, onOpenChange, file, fileName }: ViewFileDialogProps) {
  const handleDownload = () => {
    if (!file) return

    if (file instanceof File) {
      const url = URL.createObjectURL(file)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      // Handle string (URL/path) case
      window.open(file, '_blank')
    }
  }

  const getFileUrl = () => {
    if (!file) return ''
    return file instanceof File ? URL.createObjectURL(file) : file
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Xem tài liệu</DialogTitle>
          <DialogDescription>Xem và tải xuống tài liệu đính kèm</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {file ? (
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{fileName}</span>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Tải xuống
                </Button>
              </div>
              <div className="mt-4">
                <iframe
                  src={getFileUrl()}
                  className="w-full h-[500px] border rounded-md"
                  title="File preview"
                />
              </div>
            </div>
          ) : (
            <div className="flex h-[100px] items-center justify-center rounded-md border">
              <p className="text-muted-foreground">Không có tài liệu đính kèm</p>
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 