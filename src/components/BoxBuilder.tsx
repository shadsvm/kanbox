import useBoardStore from "src/utils/store"

const BoxBuilder = ({ columnID }: { columnID: string }) => {
  const board = useBoardStore()

  if (!board.builder[columnID].state)
    return (
      <button onClick={() => board.updateBuilder({ [columnID]: { state: true } })} className="flex w-full items-center justify-start gap-1 text-gray-400  hover:text-gray-100">
        <p className="bi bi-plus-lg ml-2">Add a box</p>
      </button>
    )
  else
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault()
          board.addBox(columnID)
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          value={board.builder[columnID].value}
          onChange={(event) =>
            board.updateBuilder({
              [columnID]: {
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
              board.updateBuilder({
                [columnID]: { state: false },
              })
            }
          ></button>
        </div>
      </form>
    )
}

export default BoxBuilder
