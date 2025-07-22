import Link from 'next/link'
import meta from '@/src/translation/meta'
import { useRouter } from 'next/router'

import { Box, FormControl, MenuItem, Select } from '@mui/material'
function LangSwitcher() {
  const { asPath, locale, locales } = useRouter()

  return (
    <Box>
      <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
        <Select
          autoWidth
          id="language-select"
          value={locale}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
          }}
        >
          {locales?.map((lang, i) => (
            <MenuItem key={i} value={lang}>
              {lang !== locale ? (
                <Link
                  style={{ textDecoration: 'none', color: 'white' }}
                  href={asPath}
                  locale={lang}
                >
                  {meta[lang].label}
                </Link>
              ) : (
                <div style={{ textDecoration: 'none', color: 'white' }}>
                  {meta[lang].label}
                </div>
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}
export default LangSwitcher
