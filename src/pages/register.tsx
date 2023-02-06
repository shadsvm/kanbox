import { useRouter } from "next/router"
import { FormEvent, useReducer, useState } from "react"
import { useAuth } from "../utils/useAuth"
import Link from "next/link"
import Layout from "src/layouts/layoutScreen"
import styles from "src/styles/bg.module.css"

interface Credentials {
  name: string
  email: string
  password: string
}

const register = () => {
  const router = useRouter()
  const { user, signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [credentials, updateCredentials] = useReducer((prev: Credentials, next: { [key: string]: string }) => ({ ...prev, ...next }), {
    name: "",
    email: "",
    password: "",
  })
  const submit = (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    signUp(credentials.name, credentials.email, credentials.password)
    setLoading(false)
  }

  if (user) router.push("/board")
  else
    return (
      <Layout>
        <main className={styles.pattern}>
          <form onSubmit={submit} className="flex w-full max-w-sm flex-col gap-4 rounded-xl bg-black p-8">
            <header className="my-5 text-center text-5xl">
              Kan<span className="text-primary-500">Box</span>
            </header>
            <input
              type="name"
              className="rounded bg-neutral-800 px-4 py-1 text-lg"
              value={credentials.name}
              onChange={(event) => updateCredentials({ name: event.target.value })}
              placeholder="Name"
              maxLength={15}
              required
            />
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
              disabled={loading || !credentials.name.length || !credentials.email.length || !credentials.password.length}
            >
              {!loading ? "Submit" : <p className="bi bi-arrow-clockwise"></p>}
            </button>

            <Link href={"/login"}>
              <button className="mt-2 text-neutral-400">I already have an account</button>
            </Link>
          </form>
        </main>
      </Layout>
    )
}

export default register
