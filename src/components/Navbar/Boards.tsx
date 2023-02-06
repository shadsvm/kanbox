import Link from "next/link"
import { useState } from "react"
import { useAuth } from "src/utils/useAuth"

const Navbar = ({ board }: { board: any }) => {
  const [menu, setMenu] = useState(false)
  const { user, signOut } = useAuth()

  return (
    <div className="w-full bg-black">
      <nav className="container mx-auto flex items-center justify-between p-5 text-lg ">
        <section className="flex items-center gap-8">
          {user && (
            <Link href={"/board"}>
              <button className="bi bi-chevron-left" />
            </Link>
          )}
          <h1 className="text-2xl font-medium">{board?.name}</h1>
          <div className="flex gap-1 rounded-full bg-primary-500 px-4 py-1 text-sm">
            <i className={`bi bi-${board.public ? "unlock" : "lock"}`} />
            {board.public ? "Public" : "Private"}
          </div>
        </section>

        <button onClick={() => setMenu(!menu)} className="bi bi-gear relative text-2xl">
          {menu && (
            <menu className="absolute top-8 right-0 flex flex-col items-start gap-1 whitespace-nowrap rounded-b-lg bg-black p-3 text-base">
              <button className="bi bi-pen menuBtn">Change name</button>
              <button className="bi bi-lock menuBtn">
                Make it
                {board.public ? " public" : " private"}
              </button>
              <button className="bi bi-trash3 menuBtn hover:text-red-400">Delete this board</button>
              <div className="w-full border border-gray-700"></div>
              <button onClick={signOut} className="bi bi-box-arrow-right menuBtn">
                Sign Out
              </button>
            </menu>
          )}
        </button>
      </nav>
    </div>
  )
}

export default Navbar
