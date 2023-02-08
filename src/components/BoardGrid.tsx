import Link from "next/link"
import { useAuth } from "src/utils/useAuth"
import type { Board } from "src/utils/types"
import dayjs from "dayjs"

const BoardGrid = ({ boards, search }: { boards: Board[]; search: string }) => {
  const { user } = useAuth()

  if (!user || !boards.length) return null
  else
    return (
      <div className="md:pt-18 grid gap-10 pt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
        {boards
          .filter((board) => board.name.toLowerCase().includes(search.toLowerCase()))
          .map((board) => (
            <Link href={`/board/${user.uid}/${board.id}`} key={board.id}>
              <button className="group flex flex-col items-start justify-evenly gap-5 rounded-lg border border-gray-800 bg-black p-7 text-start shadow-xl transition duration-200 hover:border-white">
                <div className="flex w-full items-center justify-between text-2xl">
                  <h1 className="">{board.name}</h1>
                  <i className="bi bi-box-arrow-in-up-right invisible group-hover:visible"></i>
                </div>
                <h4 className="text-gray-500">{board.description}</h4>
                <p className="text-gray-500">{dayjs(board.createdAt).format("DD/MM/YYYY")}</p>
              </button>
            </Link>
          ))}
      </div>
    )
}

export default BoardGrid
