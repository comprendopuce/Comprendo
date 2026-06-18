"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/hooks/useAuth"

interface PublicLayoutProps {
  children: React.ReactNode
  /** Pass false if you don't want the yellow accent bars (e.g. home) */
  accentBars?: boolean
}

export function PublicLayout({ children, accentBars = true }: PublicLayoutProps) {
  const { isLoggedIn, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdf1]">
      <Navbar isLoggedIn={isLoggedIn} onLogout={logout} />
      {accentBars && <div className="h-2 w-full bg-[#F1D87C]" />}
      <div className="flex-1 flex flex-col">{children}</div>
      {accentBars && <div className="h-2 w-full bg-[#F1D87C]" />}
      <Footer />
    </div>
  )
}
