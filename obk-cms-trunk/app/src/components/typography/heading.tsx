import { Heading as CHeading, HeadingProps } from '@chakra-ui/react'

const Heading = (props: HeadingProps) => {
  const { children, as = 'h1' } = props
  let predefinedProps = {}
  switch (as) {
    case 'h2':
      predefinedProps = {
        fontSize: '28px',
        fontWeight: 700,
        lineHeight: '36px',
        letterSpacing: '-0.02em',
      }
      break
    case 'h3':
      predefinedProps = {
        fontSize: '24px',
        fontWeight: 700,
        lineHeight: '32px',
        letterSpacing: '-0.02em',
      }
      break
    case 'h4':
      predefinedProps = {
        fontSize: '20px',
        fontWeight: 700,
        lineHeight: '32px',
        letterSpacing: '-0.02em',
      }
      break
    default:
      predefinedProps = {
        fontSize: '34px',
        fontWeight: 700,
        lineHeight: '42px',
        letterSpacing: '-0.02em',
      }
      break
  }

  return (
    <CHeading as={as} {...predefinedProps} {...props}>
      {children}
    </CHeading>
  )
}

export default Heading
