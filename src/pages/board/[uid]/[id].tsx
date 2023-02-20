import { useEffect } from "react"
import { useRouter } from "next/router"
import { database } from "src/utils/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"
import Box from "src/components/Box"
import { useAuth } from "src/utils/useAuth"
import Navbar from "src/components/Navbar/Boards"
import useBoardStore from "src/utils/store"
import { Boxes } from "src/utils/types"

const board = () => {
  const { user } = useAuth()
  const router = useRouter()
  const board = useBoardStore()
  const { uid, id } = router.query

  const boardDocRef = (pathSegments?: string[]) => doc(database, `users/${uid}/boards/${id}`, ...(pathSegments?.length ? pathSegments : []))

  const onDragEnd = (result: DropResult) => {
    console.log("%cEvent: Drag and Drop", "color: yellow", result)

    if (!result.destination) return
    const { source, destination } = result

    if (source.droppableId === destination.droppableId) {
      const sourceBoxes = [...board.columns[source.droppableId].boxes]
      sourceBoxes.splice(source.index, 1)
      sourceBoxes.splice(destination.index, 0, result.draggableId)
      board.setColumns({
        ...board.columns,
        [source.droppableId]: {
          ...board.columns[source.droppableId],
          boxes: sourceBoxes,
        },
      })

      updateDoc(boardDocRef(["columns", source.droppableId]), {
        boxes: sourceBoxes,
      })
    } else {
      const sourceBoxes = [...board.columns[source.droppableId].boxes]
      const destinationBoxes = [...board.columns[destination.droppableId].boxes]

      sourceBoxes.splice(source.index, 1)
      destinationBoxes.splice(destination.index, 0, result.draggableId)
      board.setColumns({
        ...board.columns,
        [source.droppableId]: {
          ...board.columns[source.droppableId],
          boxes: sourceBoxes,
        },
        [destination.droppableId]: {
          ...board.columns[destination.droppableId],
          boxes: destinationBoxes,
        },
      })

      updateDoc(boardDocRef(["columns", source.droppableId]), {
        boxes: sourceBoxes,
      })
      updateDoc(boardDocRef(["columns", destination.droppableId]), {
        boxes: destinationBoxes,
      })
    }
  }

  // Fetching data (once)
  useEffect(() => {
    if (router.isReady) {
      board.initializeBoard(uid as string, id as string, user?.uid || "")
    }
  }, [router])

  useEffect(() => {
    if (board.status > 200) router.push("/" + board.status)
  }, [board.status])

  if (board.status === 200)
    return (
      <main className="flex  flex-col ">
        <Navbar />
        <div className="container mx-auto flex flex-wrap items-start justify-center gap-5 p-5 py-10 sm:flex-nowrap ">
          <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
            {/* Columns map */}
            {board.order.map((id: string) => {
              const column = board.columns[id]
              if (column)
                return (
                  <Droppable droppableId={id} key={id}>
                    {(provided, snapshot) => (
                      <div className={`${snapshot.isDraggingOver ? "bg-primary-600/50" : "bg-neutral-700/20"} flex w-full shrink-0 flex-col gap-3 rounded-xl p-3 transition duration-300 sm:w-1/3`}>
                        <header className="ml-1 text-2xl font-semibold">{column.name}</header>
                        <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-3">
                          {/* Boxes map */}
                          {column.boxes.map((id, index) => {
                            const box = board.boxes[id as keyof Boxes]
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
                                      <Box box={box} update={(name) => board.editBox(id, name)} remove={() => board.deleteBox(id)} />
                                    </div>
                                  )}
                                </Draggable>
                              )
                          })}
                          {provided.placeholder}
                        </div>

                        {/* Add box button */}
                        {!board.implementer[id].state ? (
                          <button onClick={() => board.updateImplementer({ [id]: { state: true } })} className="flex w-full items-center justify-start gap-1 text-gray-400  hover:text-gray-100">
                            <p className="bi bi-plus-lg ml-2">Add a box</p>
                          </button>
                        ) : (
                          <form
                            onSubmit={(event) => {
                              event.preventDefault()
                              board.addBox(id)
                            }}
                            className="flex flex-col gap-2"
                          >
                            <input
                              type="text"
                              value={board.implementer[id].value}
                              onChange={(event) =>
                                board.updateImplementer({
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
                                  board.updateImplementer({
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
