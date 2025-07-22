import { useEffect } from 'react'
import { useLayoutContext } from './context/layoutcontext'
import { usePathname } from 'next/navigation'

export const AppMenuAction = () => {
  const pathname = usePathname()
  const { menuAction, setMenuAction } = useLayoutContext()

  useEffect(() => {
    setMenuAction(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return <>{menuAction && menuAction}</>
}
