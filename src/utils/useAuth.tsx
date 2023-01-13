import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, User } from 'firebase/auth'
import { doc, setDoc } from "firebase/firestore"
import { auth, database } from './firebase'
import dayjs from 'dayjs'
// import { ref, set } from 'firebase/database'

interface IContext {
  user: User | null,
  signIn: (email: string, password: string) => void,
  signUp: (name: string, email: string, password: string) => void,
  signOut: () => void
}

const AuthContext = createContext<IContext>({
  user: null,
  signIn: (email: string, password: string) => {},
  signUp: (name: string, email: string, password: string) => {},
  signOut: () => {}
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      alert(error)
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(response.user, { displayName: name, photoURL: 'https://64.media.tumblr.com/0d27c049c7d42f394dbc431214df71ba/tumblr_n2wxzd4y7w1rpwm80o1_250.jpg' })
      await setDoc(doc(database, 'users', response.user.uid), { name: name, createdAt: dayjs().format() })
    } catch (error) {
      alert(error)
    }
  }

  const signOut = () => auth.signOut()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])


  const contextValues = {
    user, signIn, signUp, signOut
  }
  return (
    <AuthContext.Provider value={contextValues}>
      {!loading && children}
    </AuthContext.Provider>)
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) throw Error('Context must be used within Provider')
  return context
}
