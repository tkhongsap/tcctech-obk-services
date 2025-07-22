import { Button } from '@chakra-ui/react'
import omit from 'lodash/omit'
import { rgba } from 'polished'
import { useTheme } from '@chakra-ui/react'
// import isUndefined from 'lodash/isUndefined'

const RoundedButton = (props: any) => {
  const theme = useTheme()
  const defaultProps = {
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '24px',
    letterSpacing: '-0.28px',
    color: 'black',
  }

  // const hoverOpacity = 1

  const color =
    theme?.colors?.[props?.color] || props?.color || defaultProps?.color
  const bg = theme?.colors?.[props?.bg] || props?.bg || rgba(color, 0.05)
  const type = props?.type || 'button'

  return (
    <Button
      {...defaultProps}
      {...omit(props, ['children', 'hoverOpacity'])}
      color={color}
      bg={bg}
      _hover={{
        bg,
      }}
      border={`1px solid ${props?.border || color}`}
      p={props?.p}
      height={props?.height}
      type={type}
    >
      {props.children}
    </Button>
  )
}

export default RoundedButton
