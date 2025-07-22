import SvgBell from '@assets/svg/bell.svg'
import { InputGroup, InputLeftElement } from '@chakra-ui/react'
// import Table from '@components/list/table'
import SectionTitle from '@components/display/section-title'
import { useNavigation, useResource } from '@refinedev/core'
import RoundedButton from '@components/button/rounded'
import { Search2Icon } from '@chakra-ui/icons'
import InputText from '@components/input/text'
import HeadlessVersionListing from '@components/table/headlessVersionListing'

const VersionList = (props: any) => {
  const {
    currentVersionList,
    olderVersionList,
    tableTools,
    isLoading,
    currentVersionTitle,
    searchable = true,
    createable = true,
    onFilter,
    isSearchFilter,
    customFilter,
    btnLabel = 'Create new version',
  } = props
  const resources = useResource()
  const { create } = useNavigation()

  return (
    <div>
      <div className='tw-flex tw-items-center tw-justify-between tw-w-full tw-flex-wrap tw-mb-[60px]'>
        <SectionTitle>{resources?.resource?.meta?.label}</SectionTitle>
        <div className='tw-flex tw-items-center tw-gap-[34px]'>
          {createable && (
            <RoundedButton
              bg='primaryBlue'
              color='white'
              onClick={() => create(resources.identifier || '')}
            >
              {btnLabel}
            </RoundedButton>
          )}

          {searchable && (
            <div>
              <div className='tw-rounded-[30px] tw-flex tw-items-center tw-py-2.5 tw-px-[18px] tw-gap-[11px] tw-bg-white'>
                <div>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents='none'
                      color='inherit'
                      fontSize='1.2em'
                      height='calc(var(--input-height))'
                    >
                      <Search2Icon width='12px' />
                    </InputLeftElement>

                    <InputText
                      placeholder='Search'
                      bg='selago'
                      borderRadius='30px'
                      pl='40px'
                      border='0px'
                      minW='300px'
                      fontSize='14px'
                    />
                  </InputGroup>
                </div>
                <div>
                  <SvgBell width='24' />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <HeadlessVersionListing
        currentVersionList={currentVersionList}
        olderVersionList={olderVersionList}
        tableTools={tableTools}
        isLoading={isLoading}
        currentVersionTitle={currentVersionTitle}
        onFilter={onFilter}
        isSearchFilter={isSearchFilter}
        customFilter={customFilter}
      />
      {/* <Flex pt='35px' justifyContent='flex-end'>
        <ListPagination {...paginationProps} />
      </Flex> */}
    </div>
  )
}

export default VersionList
