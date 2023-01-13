import Link from "next/link"
import Layout from "src/layouts/layoutScreen"

import { addDoc, collection, doc, updateDoc } from "firebase/firestore"
import { Dispatch, FormEvent, SetStateAction, useState } from "react"
import { database } from "src/utils/firebase"
import { useAuth } from "src/utils/useAuth"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import ProtectedRoute from "src/components/ProtectedRoute"

const Create = () => {
  const { user } = useAuth()
  if (!user) return null

  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    description: "",
  })

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!form.name) return
    const project = await addDoc(collection(database, "users", user.uid, "projects"), { name: form.name, description: form.description, createdAt: dayjs().format() })
    const order = []
    for (let name of ["To do", "In Progress", "Done"]) {
      const column = await addDoc(collection(database, "users", user.uid, "projects", project.id, "columns"), { name: name, boxes: [] })
      order.push(column.id)
    }
    updateDoc(doc(database, "users", user.uid, "projects", project.id), { order: order })
    router.push(`/projects/${user.uid}/${project.id}`)
  }
  return (
    <Layout>
      <ProtectedRoute>
        <main className="container mx-auto flex flex-col gap-5 justify-center items-center flex-1">
          <h1 className="text-2xl font-semibold ">Lets create new project</h1>
          <form onSubmit={submit} className="flex flex-col gap-2 w-full max-w-xl">
            <input type="text" placeholder="Name" className="bg-black rounded px-4 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input
              type="text"
              placeholder="Description (optional)"
              className="bg-black rounded px-4 py-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="flex justify-end items-center gap-5">
              <Link href="/projects">
                <button className="px-4 py-2 bg-black rounded">Cancel</button>
              </Link>
              <button type="submit" className="bg-white text-black py-2 px-4 rounded">
                Submit
              </button>
            </div>
          </form>
        </main>
      </ProtectedRoute>
    </Layout>
  )
}

export default Create
