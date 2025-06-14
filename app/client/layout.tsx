import type React from "react"
import { ClientSidebar } from "@/components/client-sidebar"
import { ModeToggle } from "@/components/mode-toggle"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar />
      <div className="lg:pl-60">
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <div />
          <div className="flex items-center gap-4">
            <ModeToggle />
          </div>
        </div>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
