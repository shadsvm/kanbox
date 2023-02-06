import { useEffect, useMemo, useReducer, useState } from "react"
import { useRouter } from "next/router"
import { database } from "src/utils/firebase"
import { uuidv4 as uuid } from "@firebase/util"
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore"
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"
import Box from "src/components/Box"
import { useAuth } from "src/utils/useAuth"
import Navbar from "src/components/Navbar/Boards"
import { Boxes, Columns, Board, Snapshot, Implementer } from "src/utils/types"

const board = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { uid, id } = router.query

  const boardPath = useMemo(() => `users/${uid}/boards/${id}`, [uid, id])
  const boardDocRef = (pathSegments?: string[]) => doc(database, boardPath, ...(pathSegments?.length ? pathSegments : []))
  const boardCollectionRef = (pathSegments?: string[]) => collection(database, boardPath, ...(pathSegments?.length ? pathSegments : []))

  const [order, setOrder] = useState<string[]>([])
  const [boxes, setBoxes] = useState<Boxes>({})
  const [board, setBoard] = useState<Board>()
  const [columns, setColumns] = useState<Columns>({})

  const [implementer, updateImplementer] = useReducer((prev: Implementer, next: any) => ({ ...prev, ...next }), {})

  const addBox = (column: string) => {
    if (!implementer[column].value) return
    const id = uuid()
    const box = { [id]: { name: implementer[column].value } }
    const columnBoxes = [...columns[column].boxes, id]

    setBoxes({ ...boxes, ...box })
    setColumns({
      ...columns,
      [column]: { ...columns[column], boxes: columnBoxes },
    })
    updateDoc(boardDocRef(["columns", column]), { boxes: columnBoxes })
    setDoc(boardDocRef(["boxes", id]), box[id])
    updateImplementer({ [column]: { state: false, value: "" } })
  }

  const editBox = (id: string, name: string) => {
    setBoxes({ ...boxes, [id]: { ...boxes[id], name: name } })
    updateDoc(boardDocRef(["boxes", id]), { name: name })
  }

  const deleteBox = async (id: string) => {
    await deleteDoc(boardDocRef(["boxes", id]))
    setBoxes((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const onDragEnd = (result: DropResult) => {
    console.log("%cEvent: Drag and Drop", "color: yellow", result)
    // console.time()

    if (!result.destination) return
    const { source, destination } = result

    if (source.droppableId === destination.droppableId) {
      const sourceBoxes = [...columns[source.droppableId].boxes]
      sourceBoxes.splice(source.index, 1)
      sourceBoxes.splice(destination.index, 0, result.draggableId)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...columns[source.droppableId],
          boxes: sourceBoxes,
        },
      })

      updateDoc(boardDocRef(["columns", source.droppableId]), {
        boxes: sourceBoxes,
      })
      // console.timeEnd();
    } else {
      const sourceBoxes = [...columns[source.droppableId].boxes]
      const destinationBoxes = [...columns[destination.droppableId].boxes]

      sourceBoxes.splice(source.index, 1)
      destinationBoxes.splice(destination.index, 0, result.draggableId)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...columns[source.droppableId],
          boxes: sourceBoxes,
        },
        [destination.droppableId]: {
          ...columns[destination.droppableId],
          boxes: destinationBoxes,
        },
      })

      updateDoc(boardDocRef(["columns", source.droppableId]), {
        boxes: sourceBoxes,
      })
      updateDoc(boardDocRef(["columns", destination.droppableId]), {
        boxes: destinationBoxes,
      })
      // console.timeEnd();
    }
  }

  // Fetching data (once)
  useEffect(() => {
    const fetchOrder = async () => {
      const docSnap = await getDoc(boardDocRef())
      if (!docSnap.exists()) return console.warn("Unable to fetch board data")
      if (!docSnap.data().public && user?.uid !== uid) return router.push("/401")
      setOrder(docSnap.data().order)
      setBoard(docSnap.data() as Board)
      console.log("%cFetch: Remains", "color: green", docSnap.data())
    }

    const fetchColumns = async () => {
      const snapshot = await getDocs(boardCollectionRef(["columns"]))
      const snapColumns: Snapshot = {}
      const implementer: Implementer = {}

      snapshot.forEach((column) => {
        if (column.exists()) {
          snapColumns[column.id] = column.data()
          implementer[column.id] = { state: false, value: "" }
        }
      })

      setColumns(snapColumns as Columns)
      updateImplementer(implementer)
      console.log("%cFetch: Columns", "color: green", snapColumns)
    }

    const fetchBoxes = async () => {
      const snapshotBoxes = await getDocs(boardCollectionRef(["boxes"]))
      const snapBoxes: Snapshot = {}

      snapshotBoxes.forEach((box) => {
        if (box.exists()) snapBoxes[box.id] = box.data()
      })

      setBoxes(snapBoxes as Boxes)
      console.log("%cFetch: Boxes", "color: green", snapBoxes)
    }

    if (router.isReady) {
      fetchOrder()
      fetchColumns()
      fetchBoxes()
    }
  }, [router])

  if (columns && board && order.length && boxes)
    return (
      <main className="flex  flex-col ">
        <Navbar board={board} />
        <div className="container mx-auto flex flex-wrap items-start justify-center gap-5 p-5 py-10 sm:flex-nowrap ">
          <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
            {/* Columns map */}
            {order.map((id: string) => {
              const column = columns[id]
              if (column)
                return (
                  <Droppable droppableId={id} key={id}>
                    {(provided, snapshot) => (
                      <div className={`${snapshot.isDraggingOver ? "bg-primary-500/10" : "bg-neutral-700/20"} flex w-full shrink-0 flex-col gap-3 rounded-xl p-3 transition duration-300 sm:w-1/3`}>
                        <header className="ml-1 text-2xl font-semibold">{column.name}</header>
                        <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-3">
                          {/* Boxes map */}
                          {column.boxes.map((id, index) => {
                            const box = boxes[id as keyof Boxes]
                            if (box)
                              return (
                                <Draggable key={id} draggableId={id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={`${snapshot.isDragging ? "bg-black/80" : "bg-neutral-900"} group flex items-center justify-between overflow-hidden rounded-xl p-3 px-4`}
                                    >
                                      <Box box={box} update={(name) => editBox(id, name)} remove={() => deleteBox(id)} />
                                    </div>
                                  )}
                                </Draggable>
                              )
                          })}
                          {provided.placeholder}
                        </div>

                        {/* Add box button */}
                        {implementer && !implementer[id].state && (
                          <button onClick={() => updateImplementer({ [id]: { state: true } })} className="flex w-full items-center justify-start gap-1 text-gray-400  hover:text-gray-100">
                            <p className="bi bi-plus-lg ml-2"> Add a box</p>
                          </button>
                        )}

                        {/* implementer */}
                        {implementer && implementer[id].state && (
                          <form
                            onSubmit={(event) => {
                              event.preventDefault()
                              addBox(id)
                            }}
                            className="flex flex-col gap-2"
                          >
                            <input
                              type="text"
                              value={implementer[id].value}
                              onChange={(event) =>
                                updateImplementer({
                                  [id]: {
                                    state: true,
                                    value: event.target.value,
                                  },
                                })
                              }
                              className="rounded-xl bg-neutral-900 p-3 px-4"
                              placeholder="Enter a title for this box..."
                            />
                            <div className="flex items-center justify-between p-2">
                              <button type="submit" className="btn  bg-primary-500/80 hover:bg-primary-500">
                                Add box
                              </button>
                              <button
                                type="button"
                                className="bi bi-x-lg"
                                onClick={() =>
                                  updateImplementer({
                                    [id]: { state: false },
                                  })
                                }
                              ></button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </Droppable>
                )
            })}
          </DragDropContext>
        </div>
      </main>
    )
}

export default board
