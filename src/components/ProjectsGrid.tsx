import Link from "next/link"
import { useAuth } from "src/utils/useAuth"
import type { IProject } from "src/utils/types"
import dayjs from "dayjs"

const ProjectsGrid = ({ projects }: { projects: IProject[] }) => {
  const { user } = useAuth()

  if (projects.length > 0)
    return (
      <div className=" grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 pt-10 md:pt-20 ">
        {projects.map((project) => (
          <Link href={`/projects/${user.uid}/${project.id}`} key={project.id}>
            <button className=" flex flex-col gap-5 p-4 text-start items-start bg-black rounded-lg shadow-xl hover:scale-105 transition duration-200">
              <div className="w-full flex justify-between items-center">
                <h1 className="text-2xl">{project.name}</h1>
                <button className="bi bi-chevron-down"></button>
              </div>
              <h4 className="text-gray-500">{project.description}</h4>
              <p className="text-gray-500">
                {dayjs(project.createdAt).format("DD/MM/YYYY")}
              </p>
            </button>
          </Link>
        ))}
      </div>
    )
  else return null
}

export default ProjectsGrid
