import { useLayoutContext } from '@src/layout/context/layoutcontext'
import map from 'lodash/map'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { classNames } from 'primereact/utils'

type ActionTypes = 'show' | 'edit'
interface ListActionProps {
  types?: ActionTypes[]
  id?: any
  vertical?: boolean
}

export default function ListAction(props: any) {
  const { currentMenuItem } = useLayoutContext()
  const {
    types = ['show', 'edit'],
    id,
    vertical = false,
  }: ListActionProps = props
  const router = useRouter()

  const listAction = useMemo(() => {
    return map(types, (type) => {
      return (
        <a
          className='cursor-pointer text-primary-blue'
          key={type}
          onClick={() => {
            const destinationMenu = currentMenuItem?.items?.find(
              (x) => x.type === type.toUpperCase()
            )
            if (destinationMenu && destinationMenu.to) {
              const path = destinationMenu.to
                ?.split('/')
                .map((x) => (x.startsWith(':') ? id : x))
                .join('/')
              router.push(path)
            }
          }}
        >
          {type === 'show' && 'View'}
          {type === 'edit' && 'Edit'}
        </a>
      )
    })
  }, [types, currentMenuItem?.items, router, id])

  return (
    <div
      className={classNames(
        'flex justify-content-start gap-2 font-xl font-bold',
        {
          'flex-column': vertical,
        }
      )}
    >
      {listAction}
    </div>
  )
}
