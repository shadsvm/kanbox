import { ReactNode } from "react"
import Navbar from "src/components/Navbar/Regular"

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}

export default Layout
