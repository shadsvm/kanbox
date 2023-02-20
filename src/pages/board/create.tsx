import Link from "next/link"
import Layout from "src/layouts/layoutScreen"
import { addDoc, collection, doc, updateDoc } from "firebase/firestore"
import { FormEvent, useReducer } from "react"
import { database } from "src/utils/firebase"
import { useAuth } from "src/utils/useAuth"
import { useRouter } from "next/router"
import ProtectedRoute from "src/components/ProtectedRoute"
import dayjs from "dayjs"

const Create = () => {
  const { user } = useAuth()
  if (!user) return null

  const router = useRouter()
  const [form, updateForm] = useReducer((prev: { [key: string]: any }, next: { [key: string]: any }) => ({ ...prev, ...next }), { name: "", description: "", public: true })

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!form.name) return
    const board = await addDoc(collection(database, "users", user.uid, "boards"), { ...form, createdAt: dayjs().format() })
    const order = []
    for (let name of ["To do", "In Progress", "Done"]) {
      const column = await addDoc(collection(database, "users", user.uid, "boards", board.id, "columns"), { name: name, boxes: [] })
      order.push(column.id)
    }
    updateDoc(doc(database, "users", user.uid, "boards", board.id), { order: order })
    router.push(`/board/${user.uid}/${board.id}`)
  }
  return (
    <Layout>
      <ProtectedRoute>
        <main className="mx-auto flex max-w-xs flex-1 flex-col items-center justify-center gap-5 sm:max-w-xl md:max-w-2xl">
          <h1 className="text-2xl font-semibold sm:text-4xl">Let's create new board</h1>
          <form onSubmit={submit} className="flex w-full max-w-xl flex-col gap-3">
            <input
              type="text"
              placeholder="Name"
              className="rounded bg-black px-4 py-3 text-lg md:text-xl"
              maxLength={15}
              value={form.name}
              onChange={(e) => updateForm({ name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              className="rounded  bg-black px-4 py-3"
              maxLength={30}
              value={form.description}
              onChange={(e) => updateForm({ description: e.target.value })}
            />

            <p className={`my-3 text-center text-xs text-gray-400 sm:text-base ${form.public ? "opacity-100" : "opacity-0"}`}>Everyone with a link will be able to read and write</p>

            <div className=" flex w-full items-center justify-between gap-5">
              <button type="button" onClick={() => updateForm({ public: !form.public })} className="flex items-center gap-2 text-lg">
                <i className={`bi bi-${form.public ? "unlock" : "lock"}`} />
                {form.public ? "Public" : "Only me"}
              </button>

              <div className="flex items-center justify-end gap-5 ">
                <Link href="/board">
                  <button className="btn  bg-black !py-2 text-base">Cancel</button>
                </Link>
                <button type="submit" className="btn  bg-primary-500 !py-2 text-base hover:bg-primary-600">
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
