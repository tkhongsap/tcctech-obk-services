import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Flex,
  Collapse,
  VStack,
} from '@chakra-ui/react'
import { useLogout, useMenu } from '@refinedev/core'
import SvgObLogoMenu from '@assets/svg/ob-logo-menu.svg'
import Link from 'next/link'
import SvgArrowDown from '@assets/svg/arrow-down.svg'
import map from 'lodash/map'
import styled, { css } from 'styled-components'
import { useState } from 'react'
import includes from 'lodash/includes'
import remove from 'lodash/remove'
import find from 'lodash/find'

const StyledMenuItemWrap = styled(Box)``

const StyledMenuItem = styled(Box)`
  font-size: 16px;
  text-align: center;
  font-weight: 700;
  line-height: 30px;
  color: #a3aed0;
  padding-bottom: 16px;
  display: flex;
  cursor: pointer;
  &:hover {
    color: #2b3674;
    svg {
      path {
        fill: #2b3674;
      }
    }
  }
`

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

const MobileMenu = (props: any) => {
  const { mobileMenuOpen, setMobileMenuOpen } = props
  const { menuItems, selectedKey } = useMenu()
  const { mutate: logout } = useLogout()
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
              <Link
                href={item.route ?? '/'}
                className={active ? 'active' : ''}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Flex
                  justifyContent='space-between'
                  alignItems='flex-start'
                  pr='16px'
                  cursor='pointer'
                  onClick={handleCollapse}
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
    <Box>
      <Modal
        onClose={() => setMobileMenuOpen(!mobileMenuOpen)}
        size='full'
        isOpen={mobileMenuOpen}
        motionPreset='slideInLeft'
      >
        <ModalOverlay />
        <ModalContent height='inherit'>
          <ModalCloseButton />
          <VStack w='100%' p='15px' justifyContent='space-between' h='inherit'>
            <Box w='100%'>
              <SvgObLogoMenu width={192} />
            </Box>
            <Box pt='20px' w='100%' overflowY='scroll' flex={1}>
              {list}
              <StyledMenuItem onClick={() => logout()}>
                <Box>Logout</Box>
              </StyledMenuItem>
            </Box>
          </VStack>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default MobileMenu
