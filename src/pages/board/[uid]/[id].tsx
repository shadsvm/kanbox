import { useEffect } from "react"
import { useRouter } from "next/router"
import { updateDoc } from "firebase/firestore"
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"
import Box from "src/components/Box"
import { useAuth } from "src/utils/useAuth"
import Navbar from "src/components/Navbar/Boards"
import useBoardStore from "src/utils/store"
import { Boxes } from "src/utils/types"
import BoxBuilder from "src/components/BoxBuilder"

const board = () => {
  const { user } = useAuth()
  const router = useRouter()
  const board = useBoardStore()
  const { uid, id } = router.query

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

      updateDoc(board.boardDocRef(["columns", source.droppableId]), {
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

      updateDoc(board.boardDocRef(["columns", source.droppableId]), {
        boxes: sourceBoxes,
      })
      updateDoc(board.boardDocRef(["columns", destination.droppableId]), {
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
            {board.order.map((columnID: string) => {
              const column = board.columns[columnID]
              if (column)
                return (
                  <Droppable droppableId={columnID} key={columnID}>
                    {(provided, snapshot) => (
                      <div className={`${snapshot.isDraggingOver ? "bg-gray-700/70" : "bg-gray-800"} flex w-full shrink-0 flex-col gap-3 rounded-xl p-3 transition duration-300 sm:w-1/3`}>
                        <header className="flex items-center justify-between">
                          <h1 className="ml-1 text-2xl font-semibold">{column.name}</h1>
                          <button
                            onClick={() => board.deleteAllColumnBoxes(columnID)}
                            className={`rounded border border-gray-900 bg-gray-700 px-3 py-1 hover:bg-primary-500  ${column.boxes.length > 2 ? "opacity-100" : "opacity-0"}`}
                          >
                            {" "}
                            Clear all
                          </button>
                        </header>
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
                                      className={`${snapshot.isDragging ? "bg-primary-900" : "bg-gray-900"} group flex items-center justify-between overflow-hidden rounded-xl p-3 px-4`}
                                    >
                                      <Box box={box} update={(name) => board.editBox(id, name)} remove={() => board.deleteBox(columnID, id)} />
                                    </div>
                                  )}
                                </Draggable>
                              )
                          })}
                          {provided.placeholder}
                        </div>

                        {/* Add box button */}
                        <BoxBuilder columnID={columnID} />
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
