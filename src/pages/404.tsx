import Layout from "src/layouts/layoutScreen"

const UnauthorizedPage = () => {
  return (
    <Layout>
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <h1 className="text-3xl font-semibold sm:text-4xl">This board doesn't exists!</h1>
        <h3 className="text-lg text-gray-400 sm:text-xl">Make sure you typed URL right</h3>
      </div>
    </Layout>
  )
}

export default UnauthorizedPage
