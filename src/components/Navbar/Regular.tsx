import Link from "next/link"
import { useAuth } from "src/utils/useAuth"

const Navbar = () => {
  const { user, signOut } = useAuth()

  return (
    <nav className="w-full  bg-black p-5">
      <div className="container mx-auto flex items-center justify-between gap-5 text-xl">
        <Link href={user ? "/board" : "/"}>
          <button className="mr-10 font-mono text-3xl">
            Kan<span className="text-primary-500">Box</span>
          </button>
        </Link>
        {user && (
          <button className=" btn flex items-center gap-2 text-base hover:scale-110" onClick={signOut}>
            Sign Out
            <i className="bi bi-box-arrow-right text-lg" />
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar
