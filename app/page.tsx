import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <span className="hidden sm:inline-block">Hệ Thống Quản Lý Nhân Viên Bệnh Viện</span>
            <span className="sm:hidden">QLNVBV</span>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Link href="/login">
              <Button variant="outline" size="sm">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Đăng ký</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Hệ Thống Quản Lý Nhân Viên Bệnh Viện
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Quản lý hồ sơ nhân viên, bằng cấp, chứng chỉ và thông tin cá nhân một cách hiệu quả.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/login">
                  <Button size="lg">Đăng nhập</Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Hệ Thống Quản Lý Nhân Viên Bệnh Viện. Đã đăng ký bản quyền.
          </p>
        </div>
      </footer>
    </div>
  )
}
