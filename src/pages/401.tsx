import Layout from "src/layouts/layoutScreen"

const UnauthorizedPage = () => {
  return (
    <Layout>
      <div className="flex-1 flex flex-col justify-center items-center gap-3">
        <h1 className="text-4xl sm:text-5xl font-semibold">You are unauthorized!</h1>
        <h3 className="text-xl text-gray-400">Owner of this project set permissions to private</h3>
      </div>
    </Layout>
  )
}

export default UnauthorizedPage
