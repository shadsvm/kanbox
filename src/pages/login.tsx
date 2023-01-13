import { useRouter } from "next/router"
import { FormEvent, useState } from "react"
import { useAuth } from "../utils/useAuth"
import Link from "next/link"
import Layout from "src/layouts/layoutScreen"

const login = () => {
  const router = useRouter()
  const { user, signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const submit = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    signIn(credentials.email, credentials.password)
    setLoading(false)
  }

  if (user) router.push("/projects")
  else
    return (
      <Layout>
        <main className="flex-1  flex justify-center items-center">
          <form
            onSubmit={submit}
            className=" flex flex-col gap-4 bg-black p-8 rounded-xl"
          >
            <header className="text-5xl text-center my-5">
              Kan<span className="text-primary-500">Box</span>
            </header>
            <input
              type="email"
              className="bg-neutral-800 px-4 py-1 text-lg rounded"
              value={credentials.email}
              onChange={(event) =>
                setCredentials({ ...credentials, email: event.target.value })
              }
              placeholder="Email"
              required
            />
            <input
              type="password"
              className="bg-neutral-800 px-4 py-1 text-lg rounded"
              value={credentials.password}
              onChange={(event) =>
                setCredentials({ ...credentials, password: event.target.value })
              }
              placeholder="Password"
              required
            />
            <button
              type="submit"
              className="bg-primary-500 rounded text-lg py-1 flex justify-center items-center"
              disabled={loading}
            >
              {!loading ? "Submit" : <p className="bi bi-arrow-clockwise"></p>}
            </button>

            <Link href={"/register"}>
              <button className="text-neutral-400 mt-2">
                I don't have an account
              </button>
            </Link>
          </form>
        </main>
      </Layout>
    )
}

export default login
