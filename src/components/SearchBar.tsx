import Link from "next/link"

const SearchBar = ({search, setSearch}: {search: string, setSearch: (text:string) => void}) => {

  return (
    <div className="flex justify-center items-center gap-5 w-full  ">
      <input
        type="text"
        className="bg-black rounded px-4 py-3 w-full max-w-2xl"
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        maxLength={10}
      ></input>
      <Link href="/projects/create">
        <button className="px-4 py-2 whitespace-nowrap rounded bg-gray-300 text-black">
          Add new...
        </button>
      </Link>
    </div>
  )
}

export default SearchBar
