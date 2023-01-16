import { useRouter } from "next/router"
import { FormEvent, useReducer, useState } from "react"
import { useAuth } from "../utils/useAuth"
import Link from "next/link"
import Layout from "src/layouts/layoutScreen"
import styles from "src/styles/bg.module.css"

interface Credentials {
  email: string
  password: string
}

const login = () => {
  const router = useRouter()
  const { user, signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [credentials, updateCredentials] = useReducer((prev: Credentials, next: { [key: string]: string }) => ({ ...prev, ...next }), { email: "", password: "" })

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
        <main className={styles.pattern}>
          <form onSubmit={submit} className="w-full max-w-sm flex flex-col gap-4 bg-black p-8 rounded-xl">
            <header className="text-5xl text-center my-5">
              Kan<span className="text-primary-500">Box</span>
            </header>
            <input
              type="email"
              className="bg-neutral-800 px-4 py-1 text-lg rounded"
              value={credentials.email}
              onChange={(event) => updateCredentials({ email: event.target.value })}
              placeholder="Email"
              required
            />
            <input
              type="password"
              className="bg-neutral-800 px-4 py-1 text-lg rounded"
              value={credentials.password}
              onChange={(event) => updateCredentials({ password: event.target.value })}
              placeholder="Password"
              required
            />
            <button
              type="submit"
              className="bg-primary-500 disabled:bg-primary-300/50 rounded text-lg btn !py-2 flex justify-center items-center"
              disabled={loading || !credentials.email.length || !credentials.password.length}
            >
              {!loading ? "Sign In" : <p className="bi bi-arrow-clockwise"></p>}
            </button>

            <Link href={"/register"}>
              <button className="text-neutral-400 mt-2">I don't have an account</button>
            </Link>
          </form>
        </main>
      </Layout>
    )
}

export default login
