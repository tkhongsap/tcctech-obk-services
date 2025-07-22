import { useLogout, useMenu } from '@refinedev/core'
import Link from 'next/link'
import SvgObLogoMenu from '@assets/svg/ob-logo-menu.svg'
import { Box, Collapse, Flex, VStack } from '@chakra-ui/react'
import styled, { css } from 'styled-components'
import SvgLogout from '@assets/svg/logout.svg'
import SvgArrowDown from '@assets/svg/arrow-down.svg'
import map from 'lodash/map'
import find from 'lodash/find'
import includes from 'lodash/includes'
import remove from 'lodash/remove'
import { useState } from 'react'

const StyledSvgArrowDown = styled(SvgArrowDown)`
  transition: 0.2s;
  ${(props) =>
    props.expended === 'y' &&
    css`
      transform: rotate(180deg);
    `}
  path {
    stroke: ${(props) => props.theme.colors.rockBlue};
  }
`

const StyledMenuItemWrap = styled(Box)``

const StyledMenuItem = styled(Box)`
  font-size: 16px;
  font-weight: 700;
  line-height: 30px;
  color: ${(props) => props.theme.colors.rockBlue};
  display: flex;
  cursor: pointer;
  svg {
    path {
      fill: ${(props) => props.theme.colors.rockBlue};
    }
  }
  &:hover {
    color: ${(props) => props.theme.colors.astronaut};
    svg {
      path {
        fill: ${(props) => props.theme.colors.primaryBlue};
      }
    }
  }

  ${(props: any) =>
    props?.active === 'y' &&
    css`
      color: ${(props) => props.theme.colors.astronaut};
      svg {
        path {
          fill: ${(props) => props.theme.colors.primaryBlue};
        }
      }
    `}
`

export const Menu = () => {
  const { mutate: logout } = useLogout()
  const { menuItems, selectedKey } = useMenu()
  const [collapseItems, setCollapseItems] = useState([]) as any

  const renderMenu = (items: any) => {
    return map(items, (item: any) => {
      const collapsable = (item?.children || []).length > 0
      const active = collapsable
        ? !!find(item?.children, (_item) => selectedKey === _item.key)
        : selectedKey === item.key
      const expended = includes(collapseItems, item.key) || active

      const handleCollapse = () => {
        setCollapseItems((prev: any) => {
          if (!expended) {
            return [...prev, item.key]
          } else {
            return remove(prev, (_item) => _item !== item.key)
          }
        })
      }
      return (
        <Box key={item.key}>
          <StyledMenuItemWrap>
            {item?.route ? (
              <Link href={item.route ?? '/'} className={active ? 'active' : ''}>
                <Flex
                  justifyContent='space-between'
                  alignItems='flex-start'
                  pr='16px'
                  cursor='pointer'
                  onClick={handleCollapse}
                  pb='16px'
                >
                  <StyledMenuItem active={active ? 'y' : 'n'}>
                    {item?.meta?.icon && (
                      <Box mr='12px'>
                        <item.meta.icon width={24} />
                      </Box>
                    )}
                    <Box>{item.label}</Box>
                  </StyledMenuItem>
                  {collapsable && (
                    <Box>
                      <StyledSvgArrowDown expended={expended ? 'y' : 'n'} />
                    </Box>
                  )}
                </Flex>
              </Link>
            ) : (
              <Flex
                justifyContent='space-between'
                alignItems='center'
                pr='16px'
                cursor='pointer'
                onClick={handleCollapse}
                pb='16px'
              >
                <StyledMenuItem active={active ? 'y' : 'n'}>
                  {item?.meta?.icon && (
                    <Box mr='12px'>
                      <item.meta.icon width={24} />
                    </Box>
                  )}
                  <Box>{item.label}</Box>
                </StyledMenuItem>
                {collapsable && (
                  <Box>
                    <StyledSvgArrowDown expended={expended ? 'y' : 'n'} />
                  </Box>
                )}
              </Flex>
            )}

            {collapsable && (
              <Collapse in={expended}>
                <Box pl='12px'>{renderMenu(item.children)}</Box>
              </Collapse>
            )}
          </StyledMenuItemWrap>
        </Box>
      )
    })
  }

  const list = renderMenu(menuItems)
  return (
    <VStack pl='30px' pt='50px' height='inherit' w='100%'>
      <Box
        borderBottom='1px solid'
        pb='30px'
        borderColor='rockBlue'
        w='inherit'
      >
        <SvgObLogoMenu width={192} />
      </Box>
      <VStack
        pt='16px'
        pb='30px'
        flex='1'
        height='100%'
        justifyContent='space-between'
        w='100%'
      >
        <Box w='inherit'>{list}</Box>
        <Box w='inherit'>
          <StyledMenuItemWrap onClick={() => logout()}>
            <StyledMenuItem active='y'>
              <Box mr='12px'>
                <SvgLogout width={24} />
              </Box>
              <Box>Logout</Box>
            </StyledMenuItem>
          </StyledMenuItemWrap>
        </Box>
      </VStack>
    </VStack>
  )
}
