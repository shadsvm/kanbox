import { useEffect, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import Layout from "src/layouts/layoutStatic"
import SearchBar from "src/components/SearchBar"
import BoardGrid from "src/components/BoardGrid"
import ProtectedRoute from "src/components/ProtectedRoute"
import type { Board } from "src/utils/types"
import { database } from "src/utils/firebase"
import { useAuth } from "src/utils/useAuth"

const index = () => {
  const { user } = useAuth()
  const [boards, setBoards] = useState<Board[]>([])
  const [search, setSearch] = useState("")

  // const fetchProjectsOnce = async () => {
  //   if (!user) return
  //   const q = collection(database, 'users', user.uid, 'projects')
  //   const snapshot = await getDocs(q)
  //   snauserCollectionshot.forEach(doc => {
  //     console.log(doc.data());
  //   })
  // }

  useEffect(() => {
    if (!user) return
    const userCollection = collection(database, "users", user.uid, "boards")
    const unsub = onSnapshot(userCollection, (snapshot) => {
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() }
        setBoards((prev: Board[]) => {
          if (prev.find((board) => board.id === data.id)) return [...prev] as Board[]
          else return [...prev, data] as Board[]
        })
      })
    })

    return () => unsub()
  }, [])

  return (
    <ProtectedRoute>
      <Layout>
        <header className="flex !h-10 w-full items-center justify-center bg-gradient-to-r from-indigo-500/50 to-cyan-500/50">
          <button className="text-lg tracking-wider">New update! Checkout what changed!</button>
        </header>
        <main className="container mx-auto px-5 py-8 md:px-0 ">
          <SearchBar search={search} setSearch={setSearch} />
          <BoardGrid boards={boards} search={search} />
        </main>
      </Layout>
    </ProtectedRoute>
  )
}

export default index
