import Link from "next/link"
import { useAuth } from "src/utils/useAuth"
import type { IProject } from "src/utils/types"
import dayjs from "dayjs"

const ProjectsGrid = ({ projects, search }: { projects: IProject[]; search: string }) => {
  const { user } = useAuth()

  if (!user || !projects.length) return null
  else
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 pt-10 md:pt-20 ">
        {projects
          .filter((project) => project.name.toLowerCase().includes(search.toLowerCase()))
          .map((project) => (
            <Link href={`/projects/${user.uid}/${project.id}`} key={project.id}>
              <button className="group flex flex-col gap-5 p-7 text-start justify-evenly items-start bg-black rounded-lg shadow-xl border border-gray-800 hover:border-white transition duration-200">
                <div className="w-full flex justify-between items-center text-2xl">
                  <h1 className="">{project.name}</h1>
                  <i className="invisible group-hover:visible bi bi-box-arrow-in-up-right"></i>
                </div>
                <h4 className="text-gray-500">{project.description}</h4>
                <p className="text-gray-500">{dayjs(project.createdAt).format("DD/MM/YYYY")}</p>
              </button>
            </Link>
          ))}
      </div>
    )
}

export default ProjectsGrid
