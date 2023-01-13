import { useEffect, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import Layout from "src/layouts/layoutScreen"
import SearchBar from "src/components/SearchBar"
import ProjectsGrid from "src/components/ProjectsGrid"
import ProtectedRoute from "src/components/ProtectedRoute"
import type { IProject } from "src/utils/types"
import { database } from "src/utils/firebase"
import { useAuth } from "src/utils/useAuth"

const index = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState<IProject[]>([])

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
          if (prev.find((project) => project.id === data.id))
            return [...prev] as IProject[]
          else return [...prev, data] as IProject[]
        })
      })
    })

    return () => unsub()
  }, [])

  return (
    <ProtectedRoute>
      <Layout>
        <header className="w-full h-10 flex justify-center items-center from-indigo-500/30 to-cyan-500/30 bg-gradient-to-r">
          <p>Update! checkout something!</p>
        </header>
        <main className="container mx-auto  p-5">
          <SearchBar />
          <ProjectsGrid projects={projects} />
        </main>
      </Layout>
    </ProtectedRoute>
  )
}

export default index
