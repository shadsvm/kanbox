import { ReactNode } from "react"
import Navbar from "src/components/Navbar/Regular"

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <Navbar />
      {children}
    </div>
  )
}

export default Layout
