import { useRouter } from 'next/router'
import { useState } from 'react'

const WithList = (Component: any) => {
  const RenderComponent = () => {
    const router = useRouter()
    const { current } = router?.query || {}
    const [currentPage, setCurrentPage] = useState(Number(current) || 1)

    const pageOnChange = (page: any) => {
      setCurrentPage(page)
    }

    return (
      <Component
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageOnChange={pageOnChange}
      />
    )
  }

  return RenderComponent
}

export default WithList
