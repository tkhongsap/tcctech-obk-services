import { PaletteMode } from '@mui/material'
import { red } from '@mui/material/colors'

// const primaryDark = '#6a1b9a'
const primaryLight = '#556cd6'
const secondaryLight = '#fff' // '#19857b'

const lightTheme = {
  primary: {
    main: primaryLight,
  },
  secondary: {
    main: secondaryLight,
  },
  error: {
    main: red.A400,
  },
}

const darkTheme = {
  mode: 'dark',
  primary: {
    main: primaryLight,
  },
  secondary: {
    main: secondaryLight,
  },
  error: {
    main: red.A400,
  },
}
export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light' ? lightTheme : darkTheme),
  },
  typography: {
    fontFamily: ['OneBangkok', 'sans-serif'].join(','),
  },
})
