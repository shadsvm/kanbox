import { DocumentData } from "firebase/firestore"

export interface Implementer {
  [key: string]: {
    state: boolean
    value: string
  }
}

export interface Columns {
  [key: string]: {
    name: string
    boxes: string[]
  }
}

export interface Boxes {
  [key: string]: { name: string }
}

export interface Snapshot {
  [key: string]: DocumentData
}
export interface Board {
  id?: string
  order: string[]
  name: string
  description: string
  createdAt: string
  public: boolean
}
