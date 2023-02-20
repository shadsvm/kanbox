import { Dispatch, FormEvent, SetStateAction, useReducer } from "react"
import useBoardStore from "src/utils/store"
import Modal from "./Modal"

const BoardSettings = ({ state, setState }: { state: string; setState: Dispatch<SetStateAction<string>> }) => {
  const board = useBoardStore((state) => state.board)
  const updateBoard = useBoardStore((state) => state.updateBoard)

  const [draft, setDraft] = useReducer((prev: any, next: any) => ({ ...prev, ...next }), { ...board })

  const saveChanges = (event: FormEvent) => {
    event.preventDefault()
    console.log(draft)
    updateBoard(draft)
    setState("")
  }

  if (state !== "settings" || !draft) return null
  else
    return (
      <Modal>
        <div className="w-full max-w-md rounded-lg bg-black px-8 py-4 md:max-w-lg ">
          <header className="mb-5 flex w-full items-center justify-between">
            <p className="text-xl font-medium">Board Settings</p>
            <button onClick={() => setState("")} className="bi bi-x-lg" />
          </header>

          <form onSubmit={saveChanges} className="flex flex-col gap-5 p-3">
            <div className="flex flex-col gap-1">
              <label>Rename board</label>
              <input
                type="text"
                maxLength={15}
                value={draft.name}
                onChange={(e) => setDraft({ name: e.target.value })}
                className="max-w-xs rounded border border-gray-700 bg-gray-900 px-4 py-1"
                placeholder="Board name"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>Description</label>
              <input
                type="text"
                maxLength={30}
                value={draft.description}
                onChange={(e) => setDraft({ description: e.target.value })}
                className="max-w-xs rounded border border-gray-700 bg-gray-900 px-4 py-1"
                placeholder="Board description"
              />
            </div>

            <div className="flex flex-col gap-1 ">
              <label className="text-gray-500">Add users to collaborate</label>
              <input type="text" className="max-w-xs rounded border border-gray-700 bg-gray-900 px-4 py-1 disabled:placeholder:text-gray-500" disabled placeholder="Currently unavailable" />
            </div>

            <button onClick={() => setDraft({ public: !draft.public })} type="button" className="mt-4 flex gap-2">
              Security: <span className="font-semibold">{draft.public ? "Public" : "Private"}</span>
              <i className={`bi bi-${draft.public ? "unlock" : "lock"}`} />
            </button>

            <div className="flex w-full items-center justify-end gap-3">
              <button onClick={() => setState("")} type="button" className="btn bg-gray-700 hover:bg-gray-600">
                Cancel
              </button>
              <button type="submit" className="btn bg-primary-500 hover:bg-primary-600">
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>
    )
}

export default BoardSettings
