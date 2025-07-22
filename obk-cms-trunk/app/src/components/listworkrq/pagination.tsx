import { Box, HStack, Input, Stack } from '@chakra-ui/react'
import styled, { css } from 'styled-components'
import SvgArrowLeft from '@assets/svg/pagination-arrow-left.svg'
import SvgDoubleArrowLeft from '@assets/svg/pagination-double-arrow-left.svg'
import map from 'lodash/map'
import { useState } from 'react'

const StyledSvgArrowLeft = styled(SvgArrowLeft)`
  cursor: pointer;
  ${(props: any) =>
    props?.active === 'n' &&
    css`
      cursor: not-allowed;
      path {
        fill: ${(props) => props.theme.colors.rockBlue};
      }
    `}
`
const StyledSvgDoubleArrowLeft = styled(SvgDoubleArrowLeft)`
  cursor: pointer;
  ${(props: any) =>
    props?.active === 'n' &&
    css`
      cursor: not-allowed;
      path {
        fill: ${(props) => props.theme.colors.rockBlue};
      }
    `}
`

const StyledSvgArrowRight = styled(StyledSvgArrowLeft)`
  transform: rotate(180deg);
`
const StyledSvgDoubleArrowRight = styled(StyledSvgDoubleArrowLeft)`
  transform: rotate(180deg);
`

const StyledPage = styled(Box)`
  color: ${(props) => props.theme.colors.charade};
  cursor: pointer;
  ${(props: any) =>
    props?.active === 'y' &&
    css`
      cursor: not-allowed;
      padding: 8px 16px;
      background-color: ${(props) => props.theme.colors.primaryBlue};
      border-radius: 16px;
      color: white;
    `}
`

const ListPagination = (props: any) => {
  const { currentPage, totalPage, pageOnChange } = props
  const range = 5
  const [localPage, setLocalPage] = useState(currentPage)
  let pages = []

  if (totalPage < range) {
    const minPage = 1
    const maxPage = totalPage
    pages = Array.from(Array(maxPage - minPage + 1).keys()).map(
      (i) => i + minPage
    )
  } else {
    const left = currentPage - Math.floor(range / 2) >= 1
    const right = currentPage + Math.floor(range / 2) <= totalPage
    let maxPage,
      minPage = 0
    if (left && right) {
      minPage = currentPage - Math.floor(range / 2)
      maxPage = minPage + range - 1
    } else {
      if (left) {
        minPage = totalPage - range + 1
        maxPage = totalPage
      } else {
        minPage = 1
        maxPage = range
      }
    }
    pages = Array.from(Array(maxPage - minPage + 1).keys()).map(
      (i) => i + minPage
    )
  }

  const goToPage = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPage) {
      setLocalPage(page)
      if (pageOnChange) pageOnChange(page)
    }
  }

  const handleKeyDown = (e: any) => {
    const code = e?.code || ''
    const page = Number(e?.target?.value || 1)
    if (code === 'Enter' && page) {
      goToPage(page)
    }
  }

  const pageList = map(pages, (page) => {
    const isActive = page === currentPage
    return (
      <StyledPage
        onClick={() => goToPage(page)}
        active={isActive ? 'y' : 'n'}
        key={`pagination-${page}`}
        fontWeight={500}
      >
        {page}
      </StyledPage>
    )
  })

  const hasNext = currentPage < totalPage
  const hasPrev = currentPage > 1

  const prev = () => {
    if (hasPrev) {
      goToPage(localPage - 1)
    }
  }

  const next = () => {
    if (hasNext) {
      goToPage(localPage + 1)
    }
  }

  const handleOnChange = (e: any) => {
    const page = Number(e?.target?.value)
    if (page !== currentPage && page >= 1 && page <= totalPage) {
      setLocalPage(page)
    } else if (page === 0) {
      setLocalPage('')
    }
  }

  return (
    <Stack
      spacing='13px'
      fontSize='16px'
      lineHeight='26px'
      direction={{ _: 'column', lg: 'row' }}
    >
      <HStack spacing='13px' justifyContent='center' flex={1} w='100%'>
        <Box>
          <StyledSvgDoubleArrowLeft
            active={hasPrev ? 'y' : 'n'}
            onClick={() => goToPage(1)}
          />
        </Box>
        <Box>
          <StyledSvgArrowLeft active={hasPrev ? 'y' : 'n'} onClick={prev} />
        </Box>
        {pageList}
        <Box>
          <StyledSvgArrowRight active={hasNext ? 'y' : 'n'} onClick={next} />
        </Box>
        <Box>
          <StyledSvgDoubleArrowRight
            active={hasNext ? 'y' : 'n'}
            onClick={() => goToPage(totalPage)}
          />
        </Box>
      </HStack>

      <HStack spacing='12px' justifyContent='center'>
        <Box>
          <Input
            value={localPage}
            w='50px'
            onKeyDown={handleKeyDown}
            onChange={handleOnChange}
          />
        </Box>
        <Box>of {totalPage}</Box>
      </HStack>
    </Stack>
  )
}

export default ListPagination
