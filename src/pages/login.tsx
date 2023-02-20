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

  if (user) router.push("/board")
  else
    return (
      <Layout>
        <main className={styles.pattern}>
          <form onSubmit={submit} className="flex w-full max-w-xs flex-col gap-4 rounded-xl bg-black p-8 sm:max-w-sm">
            <header className="my-5 text-center text-5xl">
              Kan<span className="text-primary-500">Box</span>
            </header>
            <input
              type="email"
              className="rounded bg-neutral-800 px-4 py-1 text-lg"
              value={credentials.email}
              onChange={(event) => updateCredentials({ email: event.target.value })}
              placeholder="Email"
              required
            />
            <input
              type="password"
              className="rounded bg-neutral-800 px-4 py-1 text-lg"
              value={credentials.password}
              onChange={(event) => updateCredentials({ password: event.target.value })}
              placeholder="Password"
              required
            />
            <button
              type="submit"
              className="btn flex items-center justify-center rounded bg-primary-500 !py-2 text-lg disabled:bg-primary-300/50"
              disabled={loading || !credentials.email.length || !credentials.password.length}
            >
              {!loading ? "Sign In" : <p className="bi bi-arrow-clockwise"></p>}
            </button>

            <Link href={"/register"}>
              <button className="mt-2 text-neutral-400">I don't have an account</button>
            </Link>
          </form>
        </main>
      </Layout>
    )
}

export default login
