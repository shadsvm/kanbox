import { create } from "zustand"
import { uuidv4 as uuid } from "@firebase/util"
import { Boxes, Columns, Board, Snapshot, Implementer } from "src/utils/types"
import { collection, DocumentReference, DocumentData, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc, Query } from "firebase/firestore"
import { database } from "src/utils/firebase"

interface Store {
  path: string
  order: string[]
  boxes: Boxes
  board: Board | null
  columns: Columns
  implementer: Implementer
  status: number

  boardDocRef: (pathSegments?: string[]) => DocumentReference
  boardCollectionRef: (pathSegments?: string[]) => Query<DocumentData>

  setPath: (buid: string, bid: string) => void
  setColumns: (payload: any) => void
  updateImplementer: (payload: any) => void

  addBox: (column: string) => void
  editBox: (id: string, name: string) => void
  deleteBox: (id: string) => void

  updateBoard: (payload: any) => void

  fetchBoard: (boardUserUid: string, userUid: string) => void
  fetchBoxes: () => void
  fetchColumns: () => void
  initializeBoard: (buid: string, bid: string, uid: string) => void
}

const useBoardStore = create<Store>((set, get) => ({
  path: "",
  order: [],
  boxes: {},
  board: null,
  columns: {},
  implementer: {},
  status: 0,

  boardDocRef: (pathSegments?: string[]) => doc(database, get().path, ...(pathSegments?.length ? pathSegments : [])),
  boardCollectionRef: (pathSegments?: string[]) => collection(database, get().path, ...(pathSegments?.length ? pathSegments : [])),

  setPath: (buid: string, bid: string) => set({ path: `users/${buid}/boards/${bid}` }),
  setColumns: (payload: any) => set({ columns: payload }),
  updateImplementer: (payload: any) => set((state) => ({ implementer: { ...state.implementer, ...payload } })),

  addBox: (column: string) => {
    if (!get().implementer[column].value) return
    const id = uuid()
    const box = { [id]: { name: get().implementer[column].value } }
    const columnBoxes = [...get().columns[column].boxes, id]

    set({ boxes: { ...get().boxes, ...box } })
    set({
      columns: {
        ...get().columns,
        [column]: { ...get().columns[column], boxes: columnBoxes },
      },
    })
    updateDoc(get().boardDocRef(["columns", column]), { boxes: columnBoxes })
    setDoc(get().boardDocRef(["boxes", id]), box[id])
    get().updateImplementer({ [column]: { state: false, value: "" } })
  },

  editBox: (id: string, name: string) => {
    set({ boxes: { ...get().boxes, [id]: { ...get().boxes[id], name: name } } })
    updateDoc(get().boardDocRef(["boxes", id]), { name: name })
  },

  deleteBox: async (id: string) => {
    await deleteDoc(get().boardDocRef(["boxes", id]))
    set((state) => {
      const boxes = { ...state.boxes }
      delete boxes[id]
      return { boxes }
    })
  },

  updateBoard: async (payload: any) => {
    await updateDoc(get().boardDocRef(), payload)
    set({ board: payload })
  },

  fetchBoard: async (boardUserUid: string, userUid: string) => {
    const docSnap = await getDoc(get().boardDocRef())

    if (!docSnap.exists()) return set({ status: 404 })
    if (!docSnap.data().public && userUid !== boardUserUid) return set({ status: 401 })

    set({ order: docSnap.data().order, board: docSnap.data() as Board, status: 200 })
    console.log("%cFetch: Board", "color: green", docSnap.data())
  },

  fetchColumns: async () => {
    const snapshot = await getDocs(get().boardCollectionRef(["columns"]))
    const snapColumns: Snapshot = {}
    const implementer: Implementer = {}

    snapshot.forEach((column) => {
      if (column.exists()) {
        snapColumns[column.id] = column.data()
        implementer[column.id] = { state: false, value: "" }
      }
    })

    set({ columns: snapColumns as Columns, implementer })
    console.log("%cFetch: Columns", "color: green", snapColumns)
  },

  fetchBoxes: async () => {
    const snapshotBoxes = await getDocs(get().boardCollectionRef(["boxes"]))
    const snapBoxes: Snapshot = {}

    snapshotBoxes.forEach((box) => {
      if (box.exists()) snapBoxes[box.id] = box.data()
    })

    set({ boxes: snapBoxes as Boxes })
    console.log("%cFetch: Boxes", "color: green", snapBoxes)
  },

  initializeBoard: (buid: string, bid: string, uid: string) => {
    if (!buid || !bid) return
    get().setPath(buid, bid)
    get().fetchBoard(buid, uid)
    get().fetchBoxes()
    get().fetchColumns()
  },
}))

export default useBoardStore
