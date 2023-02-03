import { useState } from "react"

interface Props {
  box: {
    name: string
  }
  update: (name: string) => void
  remove: () => void
}

const Box = ({ box, update, remove }: Props) => {
  const [edit, setEdit] = useState(false)
  const [name, setName] = useState(box.name)
  return (
    <div className="w-full group flex justify-between items-center ">
      <div className="w-full flex justify-start items-center gap-2 ">
        <i className="bi bi-grip-vertical text-gray-500 text-xl"></i>
        {edit ? (
          <form className="flex  ">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-inherit w-full animate-pulse  " />
          </form>
        ) : (
          <div className="">{box.name}</div>
        )}
      </div>
      <div className="flex items-center justify-end gap-2">
        {edit ? (
          <>
            <button
              onClick={() => {
                update(name)
                setEdit(false)
              }}
              className="bi bi-check-lg text-xl text-green-500"
            ></button>
            <button
              onClick={() => {
                setEdit(false)
                setName(box.name)
              }}
              className="bi bi-x-lg text-red-500"
            ></button>
          </>
        ) : (
          <>
            <button onClick={() => setEdit(!edit)} className="bi bi-pen text-gray-600 group-hover:text-yellow-600  transition duration-200 "></button>
            <button onClick={remove} className="bi bi-trash text-gray-600 group-hover:text-red-600 transition duration-200 "></button>
          </>
        )}
      </div>
    </div>
  )
}

export default Box
