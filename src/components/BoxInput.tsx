import { useEffect, useState } from "react"

const BoxInput = ({ box, update }: { box: { name: string }; update: (name: string) => void }) => {
  if (box && Object.keys(box).length) {
    const [name, setName] = useState(box.name)

    useEffect(() => {
      if (box.name !== name) update(name)
    }, [name])

    return (
      <div className="flex justify-between items-center">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className=" bg-inherit" />
      </div>
    )
  } else return null
}

export default BoxInput
