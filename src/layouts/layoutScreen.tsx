import { ReactNode } from "react"
import Navbar from "src/components/Navbar"

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />
      {children}
    </div>
  )
}

export default Layout
