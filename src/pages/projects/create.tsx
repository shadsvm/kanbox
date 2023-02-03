import Link from "next/link"
import Layout from "src/layouts/layoutScreen"

import { addDoc, collection, doc, updateDoc } from "firebase/firestore"
import { Dispatch, FormEvent, SetStateAction, useReducer, useState } from "react"
import { database } from "src/utils/firebase"
import { useAuth } from "src/utils/useAuth"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import ProtectedRoute from "src/components/ProtectedRoute"

const Create = () => {
  const { user } = useAuth()
  if (!user) return null

  const router = useRouter()
  const [form, updateForm] = useReducer(
    (prev: { [key: string]: any }, next: { [key: string]: any }) => {
      const newEvent = { ...prev, ...next }
      if (newEvent.name.length > 10 || newEvent.description.length > 20) return prev
      else return newEvent
    },
    { name: "", description: "", public: true }
  )

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!form.name) return
    const project = await addDoc(collection(database, "users", user.uid, "projects"), { ...form, createdAt: dayjs().format() })
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
        <main className="max-w-2xl mx-auto flex flex-col gap-5 justify-center items-center flex-1">
          <h1 className="text-4xl font-semibold ">Lets create new project</h1>
          <form onSubmit={submit} className="flex flex-col gap-3 w-full max-w-xl">
            <input type="text" placeholder="Name" className="bg-black rounded px-4 py-3 text-xl" maxLength={15} value={form.name} onChange={(e) => updateForm({ name: e.target.value })} required />
            <input
              type="text"
              placeholder="Description (optional)"
              className="bg-black  rounded px-4 py-3"
              maxLength={20}
              value={form.description}
              onChange={(e) => updateForm({ description: e.target.value })}
            />

            <div className="w-full flex justify-between items-center gap-5 mt-5">
              <button type="button" onClick={() => updateForm({ public: !form.public })} className="flex items-center text-lg gap-2">
                <i className={`bi bi-${form.public ? "unlock" : "lock"}`} />
                {form.public ? "Public" : "Private"}
              </button>

              <div className="flex justify-end items-center gap-5 ">
                <Link href="/projects">
                  <button className="btn !px-4 !py-2 bg-black rounded">Cancel</button>
                </Link>
                <button type="submit" className="btn !px-4 !py-2 bg-primary-500 hover:bg-primary-600 rounded">
                  Create
                </button>
              </div>
            </div>
          </form>
        </main>
      </ProtectedRoute>
    </Layout>
  )
}

export default Create
