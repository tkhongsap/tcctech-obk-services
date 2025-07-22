import { AppMenuItem } from '@src/types'
import AppMenu from './AppMenu'

type Props = {
  menuItems: AppMenuItem[]
  loading: boolean
  userId: string
}

const AppSidebar = (props: Props) => {
  return <AppMenu {...props} />
}

export default AppSidebar
