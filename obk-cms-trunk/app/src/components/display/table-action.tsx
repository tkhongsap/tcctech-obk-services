import { useNavigation, useResource } from '@refinedev/core'
import map from 'lodash/map'
import { Button } from 'primereact/button'
import { useMemo } from 'react'

type ActionTypes = 'show' | 'edit'
type Props = {
  types?: ActionTypes[]
  id?: any
  vertical?: boolean
}

export const TableAction = (props: Props) => {
  const { types = ['show', 'edit'], id } = props
  const nav = useNavigation()
  const resources = useResource()

  const listAction = useMemo(() => {
    return map(types, (type) => {
      return (
        <Button
          key={type}
          label={type === 'show' ? 'View' : 'Edit'}
          onClick={() => nav?.[type](resources?.identifier!, id)}
          text
        />
      )
    })
  }, [types, id, resources.identifier, nav])

  return <div>{listAction}</div>
}
