import { VStack, Box, HStack } from '@chakra-ui/react'
import { useNavigation, useResource } from '@refinedev/core'
import map from 'lodash/map'
import { useMemo } from 'react'

type ActionTypes = 'show' | 'edit'
interface ListActionProps {
  types?: ActionTypes[]
  id?: any
  vertical?: boolean
  pageKey?: string
}

export default function ListAction(props: any) {
  const {
    types = ['show', 'edit'],
    id,
    vertical = false,
  }: ListActionProps = props
  const nav = useNavigation() as any
  const resources = useResource()

  const listAction = useMemo(() => {
    return map(types, (type) => {
      return (
        <Box
          key={type}
          onClick={() => nav?.[type](resources?.identifier, id)}
          cursor='pointer'
        >
          {type === 'show' && 'View'}
          {type === 'edit' && 'Edit'}
        </Box>
      )
    })
  }, [types, id, resources.identifier, nav])

  const StackDirection = vertical ? VStack : HStack

  return (
    <StackDirection
      spacing='10px'
      color='primaryBlue'
      fontSize='16px'
      lineHeight='26px'
      fontWeight={700}
      alignItems='flex-start'
    >
      {listAction}
    </StackDirection>
  )
}
