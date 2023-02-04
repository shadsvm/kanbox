import { useEffect, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import Layout from "src/layouts/layoutStatic"
import SearchBar from "src/components/SearchBar"
import ProjectsGrid from "src/components/ProjectsGrid"
import ProtectedRoute from "src/components/ProtectedRoute"
import type { IProject } from "src/utils/types"
import { database } from "src/utils/firebase"
import { useAuth } from "src/utils/useAuth"

const index = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState<IProject[]>([])
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
    const userCollection = collection(database, "users", user.uid, "projects")
    const unsub = onSnapshot(userCollection, (snapshot) => {
      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() }
        setProjects((prev: IProject[]) => {
          if (prev.find((project) => project.id === data.id)) return [...prev] as IProject[]
          else return [...prev, data] as IProject[]
        })
      })
    })

    return () => unsub()
  }, [])

  return (
    <ProtectedRoute>
      <Layout>
        <header className="w-full !h-10 flex justify-center items-center from-indigo-500/50 to-cyan-500/50 bg-gradient-to-r">
          <button className="tracking-wider text-lg">New update! Lorem ipsum checkout what changed!</button>
        </header>
        <main className="container mx-auto px-5 md:px-0 py-8 ">
          <SearchBar search={search} setSearch={setSearch} />
          <ProjectsGrid projects={projects} search={search} />
        </main>
      </Layout>
    </ProtectedRoute>
  )
}

export default index
