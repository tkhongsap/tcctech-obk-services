import { extendTheme } from '@chakra-ui/react'
import { rgba } from 'polished'

const colors = {
  transparent: 'rgba(0, 0, 0, 0)',
  primaryBlue: '#4318FF',
  astronaut: '#2B3674',
  astronaut50: rgba('#2B3674', 0.5),
  rockBlue: '#A3AED0',
  selago: '#F4F7FE',
  selago80: rgba('#F4F7FE', 0.8),
  porcelain: '#fcfdfd',
  black50: rgba('#000000', 0.5),
  wildBlueYonder: '#707EAE',
  codGray: '#1B1B1B',
  kimberly: '#676B9B',
  bayofMany: '#273281',
  alabaster: '#FCFCFC',
  codGray2: '#1E1E1E',
  christi: '#59B413',
  thunderbird: '#CD1A1A',
  biscay: '#1B2559',
  charade: '#2A2C3C',
  cadetBlue: '#9BA1BC',
  outerSpace: '#262D33',
}

const breakpoints = {
  // min width
  _: '0',
  xs: '375px',
  sm: '768px',
  md: '1024px',
  lg: '1280px',
  xl: '1440px',
}

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors,
  breakpoints,
})

export default theme
