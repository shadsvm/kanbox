import { useRouter } from "next/router"
import { Dispatch, SetStateAction } from "react"
import useBoardStore from "src/utils/store"
import Modal from "./Modal"

const BoardDeletion = ({ state, setState }: { state: string; setState: Dispatch<SetStateAction<string>> }) => {
  const deleteBoard = useBoardStore((state) => state.deleteBoard)
  const router = useRouter()

  if (state !== "delete") return null
  else
    return (
      <Modal>
        <div className="w-full max-w-md space-y-5 rounded-lg bg-black p-6 md:max-w-lg ">
          <header className=" flex w-full items-center justify-between">
            <p className="text-xl font-medium">Confirm board deletion</p>
            <button onClick={() => setState("")} className="bi bi-x-lg" />
          </header>

          <p className="text-justify text-base md:text-lg">
            Are you sure you want to delete this board? This action cannot be undone and all data associated with the board will be permanently deleted.
          </p>

          <div className=" flex w-full items-center justify-end gap-3">
            <button onClick={() => setState("")} type="button" className="btn bg-gray-700 hover:bg-gray-600">
              Cancel
            </button>
            <button
              onClick={() => {
                deleteBoard()
                router.push("/board")
              }}
              type="submit"
              className="btn bg-red-500 hover:bg-red-600"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    )
}

export default BoardDeletion
