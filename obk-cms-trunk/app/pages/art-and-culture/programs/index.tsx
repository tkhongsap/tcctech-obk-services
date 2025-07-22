import { CheckIcon } from '@chakra-ui/icons'
import { IconCell } from '@components/art-and-culture/table/IconCell'
import { Table } from '@components/table/Table'
import withGenericServer from '@hocs/server/generic'
import { useTranslate } from '@refinedev/core'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { artCProgramServices } from '@src/services/art-and-culture/art-c-program-service'
import { artCServices } from '@src/services/art-and-culture/art-c-services'
import {
  IArtCTranslation,
  IArtCTypeItem,
  IProgram,
  OptionItem,
} from '@src/services/art-and-culture/model'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
import { ColumnProps } from 'primereact/column'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Tag } from 'primereact/tag'
import { toast } from 'react-toastify'
import React, { useEffect, useMemo, useState } from 'react'

interface IArtCTableContent {
  id: number
  name: string
  nameTH?: string
  nameEN?: string
  nameZH?: string
  updatedAt: Date
}

interface ITableContent {
  id: number
  categoryId: string
  category: string
  name: string
  nameTH?: string
  nameEN?: string
  nameZH?: string
  isPublished: boolean
  publishedAt?: Date
  updatedAt: Date
}

export default function ArtCultureProgramsPage() {
  const translate = useTranslate()
  const router = useRouter()
  const { query } = router

  const [isLoading, setIsLoading] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const [content, setContent] = useState<IProgram[]>([])
  const [artCTableContent, setArtCTableContent] = useState<IArtCTableContent[]>(
    []
  )
  const [tableContent, setTableContent] = useState<ITableContent[]>([])
  const [isLoadedContentError, setIsLoadedContentError] =
    useState<boolean>(false)

  const [artCTypeOptions, setArtCTypeOptions] = useState<OptionItem[]>([])

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'name',
        header: 'Name',
        sortable: true,
      },
      {
        field: 'category',
        header: 'Category',
        sortable: true,
        body: (data: ITableContent) => (
          <Tag severity='info' value={data.category}></Tag>
        ),
      },
      {
        field: 'en',
        header: 'EN',
        sortable: false,
        style: { minWidth: '90px' },
        body: (data: ITableContent) => (
          <IconCell
            value={data.nameEN}
            IconComponent={CheckIcon}
            color='#59B413'
          />
        ),
      },
      {
        field: 'th',
        header: 'TH',
        sortable: false,
        style: { minWidth: '90px' },
        body: (data: ITableContent) => (
          <IconCell
            value={data.nameTH}
            IconComponent={CheckIcon}
            color='#59B413'
          />
        ),
      },
      {
        field: 'zh',
        header: 'ZH',
        sortable: false,
        style: { minWidth: '90px' },
        body: (data: ITableContent) => (
          <IconCell
            value={data.nameZH}
            IconComponent={CheckIcon}
            color='#59B413'
          />
        ),
      },
      {
        field: 'isPublished',
        header: 'Status',
        sortable: true,
        body: (data: ITableContent) => {
          return (
            <div>
              {data.isPublished ? (
                <Tag severity='success' value='Publish' />
              ) : (
                <Tag severity='danger' value='Draft' />
              )}
            </div>
          )
        },
      },
      {
        field: 'publishedAt',
        header: 'Published At',
        sortable: true,
        body: (data: ITableContent) => {
          return (
            <span>
              {data.publishedAt
                ? dayjs(data.publishedAt).format('DD/MM/YY HH:mm')
                : '-'}
            </span>
          )
        },
      },
      {
        field: 'updatedAt',
        header: 'Last update',
        sortable: true,
        body: (data: ITableContent) => {
          return <span>{dayjs(data.updatedAt).format('DD/MM/YY HH:mm')}</span>
        },
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: 'Actions',
        style: { minWidth: '100px' },
        frozen: true,
        alignFrozen: 'right',
        body: (data: ITableContent) => {
          return (
            <Link
              href={`/art-and-culture/programs/edit/${data.id}`}
              className='p-button p-component p-button-text'
            >
              <span className='p-button-label p-c'>Edit</span>
            </Link>
          )
        },
      },
    ],
    [translate]
  )

  const displayToast = () => {
    const { status } = query

    if (status === 'createSuccess') {
      toast.success('Successfully created program')
    } else if (status === 'updateSuccess') {
      toast.success('Successfully updated program')
    } else if (status === 'error') {
      toast.error('Failed to update program')
    }
  }

  useEffect(() => {
    displayToast()

    setMenuName('Programs')
    setMenuAction(
      <div className='flex gap-3'>
        <Button
          className='px-5 py-3 bg-primary-blue text-white'
          label='Create Program'
          onClick={() => {
            router.push({
              pathname: '/art-and-culture/programs/create',
            })
          }}
        />
      </div>
    )
  }, [setMenuName, setMenuAction, router])

  const fetchContent = async () => {
    setIsLoading(true)

    await artCServices
      .getAll('all')
      .then((res) => {
        const { data } = res.data

        const tempTableContent: IArtCTableContent[] = []
        data.forEach((item: IArtCTypeItem) => {
          if (!item.artCTranslation || item.artCTranslation.length === 0) {
            return
          }

          let nameEN = ''
          let nameTH = ''
          let nameZH = ''
          item.artCTranslation.forEach((translation) => {
            if (translation.locale === 'en') {
              nameEN = translation.title
            } else if (translation.locale === 'th') {
              nameTH = translation.title
            } else if (translation.locale === 'zh') {
              nameZH = translation.title
            }
          })

          tempTableContent.push({
            id: item.id,
            name: nameEN || nameTH || nameZH || '-',
            nameEN: nameEN || undefined,
            nameTH: nameTH || undefined,
            nameZH: nameZH || undefined,
            updatedAt: item.updatedAt,
          })
        })

        setArtCTableContent(tempTableContent)
      })
      .catch(() => {
        setIsLoadedContentError(true)
      })
      .finally(() => {
        setIsLoading(false)
      })

    await artCProgramServices
      .getAll('all')
      .then((res) => {
        const { data } = res.data
        setContent(data)
      })
      .catch(() => {
        setIsLoadedContentError(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const fetchArtCType = async () => {
    await artCServices
      .getAll('all')
      .then((res) => {
        const { data } = res.data

        const options: OptionItem[] = [{ label: 'All', value: '' }]
        data.forEach((artCType: IArtCTypeItem) => {
          let translation: IArtCTranslation | undefined
          for (let item of ['en', 'th', 'zh']) {
            translation = artCType.artCTranslation?.find(
              (tItem) => tItem.locale === item
            )
            if (translation) {
              break
            }
          }

          if (translation) {
            options.push({ label: translation.title, value: `${artCType.id}` })
          }
        })

        setArtCTypeOptions(options)
      })
      .catch(() => {
        console.log('Error on fetching artCType')
      })
  }

  useEffect(() => {
    fetchContent()
    fetchArtCType()
  }, [])

  const mappingTableContent = () => {
    const tempTableContent: ITableContent[] = []
    content.forEach((item: IProgram) => {
      if (!item.programTranslation || item.programTranslation.length === 0) {
        return
      }

      const category = artCTableContent.find(
        (aItem: IArtCTableContent) => aItem.id === item.artCTypeId
      )

      if (!category) {
        return
      }

      let nameEN = ''
      let nameTH = ''
      let nameZH = ''
      item.programTranslation.forEach((translation) => {
        if (translation.locale === 'en') {
          nameEN = translation.title
        } else if (translation.locale === 'th') {
          nameTH = translation.title
        } else if (translation.locale === 'zh') {
          nameZH = translation.title
        }
      })

      tempTableContent.push({
        id: item.id,
        categoryId: `${item.artCTypeId}`,
        category: category.name,
        name: nameEN || nameTH || nameZH || '-',
        nameEN: nameEN || undefined,
        nameTH: nameTH || undefined,
        nameZH: nameZH || undefined,
        isPublished: item.isPublished,
        publishedAt: item.publishedAt,
        updatedAt: item.updatedAt,
      })
    })

    setTableContent(tempTableContent)
  }

  useEffect(() => {
    if (artCTableContent.length > 0 && content.length > 0) {
      mappingTableContent()
    }
  }, [artCTableContent, content])

  const [search, setSearch] = useState({
    keyword: '',
    category: '',
    status: -1,
  })

  return (
    <>
      <div className='card'>
        <div>
          <div className='mb-4'>
            <span className='font-bold text-2xl'>List of programs</span>
          </div>

          <div className='flex justify-content-end -mx-2 mb-5'>
            <div className='px-2'>
              <InputText
                className='w-full'
                maxLength={255}
                placeholder='Search by name'
                onChange={(e) =>
                  setSearch({
                    ...search,
                    keyword: e.target.value || '',
                  })
                }
                value={search.keyword}
              />
            </div>

            <div className='px-2' style={{ minWidth: '210px' }}>
              <Dropdown
                value={search.category}
                onChange={(e) => {
                  setSearch({
                    ...search,
                    category: e.value,
                  })
                }}
                options={artCTypeOptions}
                placeholder='All'
                className='w-full'
              />
            </div>

            <div className='px-2' style={{ minWidth: '210px' }}>
              <Dropdown
                value={search.status}
                onChange={(e) => {
                  setSearch({
                    ...search,
                    status: e.value,
                  })
                }}
                options={[
                  { label: 'All', value: -1 },
                  { label: 'Publish', value: 1 },
                  { label: 'Draft', value: 0 },
                ]}
                placeholder='All'
                className='w-full'
              />
            </div>
          </div>
          <div>
            {!isLoading && !isLoadedContentError ? (
              <Table
                columns={columns}
                data={(tableContent || []).filter((item) => {
                  if (
                    search.keyword &&
                    !item.name
                      .toLowerCase()
                      .includes(search.keyword.toLowerCase())
                  ) {
                    return null
                  }

                  if (
                    search.category !== '' &&
                    item.categoryId !== search.category
                  ) {
                    return null
                  }

                  if (search.status >= 0) {
                    const status = search.status === 1 ? true : false
                    if ((item.isPublished as boolean) !== status) {
                      return null
                    }
                  }

                  return item
                })}
                totalRecords={tableContent.length}
                loading={isLoading}
                lazy={false}
                rows={10}
              />
            ) : (
              <div className='text-center py-5'>
                Something went wrong on loading content, please try again.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

ArtCultureProgramsPage.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }

  return ctx
}, {})
