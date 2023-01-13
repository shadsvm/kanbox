import { useAuth } from "../utils/useAuth"
import { ReactNode } from "react"
import { useRouter } from "next/router"

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const router = useRouter()
  if (!user) {
    router.push("/login")
    return null
  } else return <>{children}</>
}

export default ProtectedRoute
