import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { database } from "src/utils/firebase"
import { collection, doc, DocumentData, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore"
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"
import { uuidv4 as uuid } from "@firebase/util"
import Layout from "src/layouts/layoutScreen"
import BoxInput from "src/components/BoxInput"

// interface IProject {
//   name: string
//   order: string[]
// }

// interface IColumn {
//   name: string
//   boxes: string[]
// }

// const mockColumns = {
//   "7Mw5G19HTqX9vdd9KJQL": {
//     name: "To do",
//     boxes: ["MvZBcTBp72gpFKk9zq38", "cuWqljhD2BIt3O3pi0k4"],
//   },
//   W30SBFWaNsq56fNKE0PS: {
//     name: "Done",
//     boxes: [],
//   },
// }
// const mockBoxes = {
//   MvZBcTBp72gpFKk9zq38: { name: "box1" },
//   cuWqljhD2BIt3O3pi0k4: { name: "box2" },
// }

interface Implementer {
  [key: string]: {
    state: boolean
    value: string
  }
}

interface IColumns {
  [key: string]: {
    name: string
    boxes: string[]
  }
}

interface IBoxes {
  [key: string]: { name: string }
}
interface ISnapshot {
  [key: string]: DocumentData
}

const project = () => {
  const router = useRouter()
  const { uid, id } = router.query

  const projectPath = useMemo(() => `users/${uid}/projects/${id}`, [uid, id])
  const projectDocRef = (pathSegments?: string[]) => doc(database, projectPath, ...(pathSegments?.length ? pathSegments : []))
  const projectCollectionRef = (pathSegments?: string[]) => collection(database, projectPath, ...(pathSegments?.length ? pathSegments : []))

  const [order, setOrder] = useState<string[]>([])
  const [columns, setColumns] = useState<IColumns>({})
  const [boxes, setBoxes] = useState<IBoxes>({})

  const [implementer, setImplementer] = useState<Implementer>({})
  const updateImplementer = (column: string, value: { state?: boolean; value?: string }) => {
    setImplementer({
      ...implementer,
      [column]: { ...implementer[column], ...value },
    })
  }

  const addBox = (column: string) => {
    const id = uuid()
    const box = { [id]: { name: implementer[column].value } }
    const columnBoxes = [...columns[column].boxes, id]

    setBoxes({ ...boxes, ...box })
    setColumns({
      ...columns,
      [column]: { ...columns[column], boxes: columnBoxes },
    })
    updateDoc(projectDocRef(["columns", column]), { boxes: columnBoxes })
    setDoc(projectDocRef(["boxes", id]), box[id])
    updateImplementer(column, { state: false, value: "" })
  }

  const editBox = (id: string, name: string) => {
    setBoxes({ ...boxes, [id]: { ...boxes[id], name: name } })
    updateDoc(projectDocRef(["boxes", id]), { name: name })
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

      updateDoc(projectDocRef(["columns", source.droppableId]), {
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

      updateDoc(projectDocRef(["columns", source.droppableId]), {
        boxes: sourceBoxes,
      })
      updateDoc(projectDocRef(["columns", destination.droppableId]), {
        boxes: destinationBoxes,
      })
      // console.timeEnd();
    }
  }

  // Fetching data (once)
  useEffect(() => {
    const fetchOrder = async () => {
      const docSnap = await getDoc(projectDocRef())
      if (!docSnap.exists()) return
      setOrder(docSnap.data().order)
      // console.log('%cFetch: Remains', 'color: green', docSnap.data());
    }

    const fetchColumns = async () => {
      const snapshot = await getDocs(projectCollectionRef(["columns"]))
      const snapColumns: ISnapshot = {}
      const implementer: Implementer = {}

      snapshot.forEach((column) => {
        if (column.exists()) {
          snapColumns[column.id] = column.data()
          implementer[column.id] = { state: false, value: "" }
        }
      })

      setColumns(snapColumns as IColumns)
      setImplementer(implementer)
      console.log("%cFetch: Columns", "color: green", snapColumns)
    }

    const fetchBoxes = async () => {
      const snapshotBoxes = await getDocs(projectCollectionRef(["boxes"]))
      const snapBoxes: ISnapshot = {}

      snapshotBoxes.forEach((box) => {
        if (box.exists()) snapBoxes[box.id] = box.data()
      })

      setBoxes(snapBoxes as IBoxes)
      console.log("%cFetch: Boxes", "color: green", snapBoxes)
    }

    fetchOrder()
    fetchColumns()
    fetchBoxes()
  }, [])

  if (columns)
    return (
      <Layout>
        <div className="container mx-auto flex justify-center items-start flex-wrap sm:flex-nowrap gap-5 py-10 p-5 ">
          <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
            {/* Columns map */}
            {order.length > 0 &&
              order.map((id: string) => {
                const column = columns[id]
                if (column)
                  return (
                    <Droppable droppableId={id} key={id}>
                      {(provided, snapshot) => (
                        <div className={`${snapshot.isDraggingOver ? "bg-primary-500/10" : "bg-neutral-700/20"} w-full sm:w-1/3 shrink-0 flex flex-col gap-3 p-3 rounded-xl transition duration-300`}>
                          <header className="text-2xl font-semibold ml-1">{column.name}</header>
                          <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-3">
                            {/* Boxes map */}
                            {boxes &&
                              column.boxes.map((id, index) => {
                                const box = boxes[id as keyof IBoxes]
                                if (box)
                                  return (
                                    <Draggable key={id} draggableId={id} index={index}>
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`${snapshot.isDragging ? "bg-black/80" : "bg-neutral-900"} flex justify-between items-center  rounded-xl px-5 p-3`}
                                        >
                                          <BoxInput box={box} update={(name) => editBox(id, name)} />
                                          <i className="bi bi-grip-vertical text-xl"></i>
                                        </div>
                                      )}
                                    </Draggable>
                                  )
                              })}
                            {provided.placeholder}
                          </div>

                          {/* Add box button */}
                          {implementer && !implementer[id].state && (
                            <button
                              onClick={() => updateImplementer(id, { state: true })}
                              className="flex w-full justify-start items-center gap-1 hover:text-gray-100 text-gray-400 transition duration-200"
                            >
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
                                  updateImplementer(id, {
                                    value: event.target.value,
                                  })
                                }
                                className="bg-neutral-900 rounded-xl p-3"
                                placeholder="Enter a title for this box..."
                              />
                              <div className="flex justify-between items-center p-2">
                                <button type="submit" className="btn  bg-primary-500/80 hover:bg-primary-500">
                                  Add box
                                </button>
                                <button type="button" className="bi bi-x-lg" onClick={() => updateImplementer(id, { state: false })}></button>
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
      </Layout>
    )
}

export default project
