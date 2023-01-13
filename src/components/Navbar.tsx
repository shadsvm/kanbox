import Link from "next/link"
import { useAuth } from "../utils/useAuth"

const Navbar = () => {
  const { user, signOut } = useAuth()

  return (
    <nav className="w-full  p-5 bg-black">
      <div className="container mx-auto flex items-center justify-between gap-5 text-xl">
        <Link href={user ? "/projects" : "/"}>
          <button className="text-3xl font-mono mr-10">
            Kan<span className="text-primary-500">Box</span>
          </button>
        </Link>
        {user && (
          <button className="bi bi-arrow-bar-left flex items-center gap-1 text-base btn hover:scale-110" onClick={signOut}>
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
