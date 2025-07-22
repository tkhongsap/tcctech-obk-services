import { CheckIcon } from '@chakra-ui/icons'
import { IconCell } from '@components/art-and-culture/table/IconCell'
import { Table } from '@components/table/Table'
import withGenericServer from '@hocs/server/generic'
import { useTranslate } from '@refinedev/core'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { artCAddOnServices } from '@src/services/art-and-culture/art-c-add-on-service'
import { IAddOnItem } from '@src/services/art-and-culture/model'
import clsx from 'clsx'
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

interface IAddOnTableContent {
  id: number
  type: string
  name: string
  nameTH?: string
  nameEN?: string
  nameZH?: string
  isPublished: boolean
  publishedAt?: Date
  updatedAt: Date
}

export default function ArtCultureAddOnsPage() {
  const translate = useTranslate()
  const router = useRouter()
  const { query } = router

  const [isLoading, setIsLoading] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const [tableContent, setTableContent] = useState<IAddOnTableContent[]>([])
  const [isLoadedContentError, setIsLoadedContentError] =
    useState<boolean>(false)

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'name',
        header: 'Name',
        sortable: true,
      },
      {
        field: 'type',
        header: 'Type',
        sortable: true,
        body: (data: IAddOnTableContent) => (
          <Tag
            className={clsx([
              'capitalize text-white',
              data.type === 'story' && 'bg-indigo-500',
              data.type === 'audio' && 'bg-yellow-500',
              data.type === 'video' && 'bg-red-500',
            ])}
            value={data.type}
          />
        ),
      },
      {
        field: 'en',
        header: 'EN',
        sortable: false,
        style: { minWidth: '90px' },
        body: (data: IAddOnTableContent) => (
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
        body: (data: IAddOnTableContent) => (
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
        body: (data: IAddOnTableContent) => (
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
        body: (data: IAddOnTableContent) => {
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
        body: (data: IAddOnTableContent) => {
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
        body: (data: IAddOnTableContent) => {
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
        body: (data: IAddOnTableContent) => {
          return (
            <Link
              href={`/art-and-culture/add-on/edit/${data.id}`}
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
      toast.success('Successfully created add-on')
    } else if (status === 'updateSuccess') {
      toast.success('Successfully updated add-on')
    } else if (status === 'error') {
      toast.error('Failed to update add-on')
    }
  }

  useEffect(() => {
    displayToast()

    setMenuName('Add-Ons')
    setMenuAction(
      <div className='flex gap-3'>
        <Button
          className='px-5 py-3 bg-primary-blue text-white'
          label='Create Add-On'
          onClick={() => {
            router.push({
              pathname: '/art-and-culture/add-on/create',
            })
          }}
        />
      </div>
    )
  }, [setMenuName, setMenuAction, router])

  const fetchContent = async () => {
    setIsLoading(true)

    await artCAddOnServices
      .getAll('all')
      .then((res) => {
        const { data } = res.data

        const tempTableContent: IAddOnTableContent[] = []
        data.forEach((item: IAddOnItem) => {
          if (!item.addOnTranslation || item.addOnTranslation.length === 0) {
            return
          }

          let nameEN = ''
          let nameTH = ''
          let nameZH = ''
          item.addOnTranslation.forEach((translation) => {
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
            type: item.type,
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
      })
      .catch(() => {
        setIsLoadedContentError(true)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchContent()
  }, [])

  const [search, setSearch] = useState({ keyword: '', type: '', status: -1 })

  return (
    <>
      <div className='card'>
        <div>
          <div className='mb-4'>
            <span className='font-bold text-2xl'>List of add-ons</span>
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
                value={search.type}
                onChange={(e) => {
                  setSearch({
                    ...search,
                    type: e.value,
                  })
                }}
                options={[
                  { label: 'All', value: '' },
                  { label: 'Story', value: 'story' },
                  { label: 'Audio', value: 'audio' },
                  { label: 'Video', value: 'video' },
                ]}
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

                  if (search.type !== '' && item.type !== search.type) {
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

ArtCultureAddOnsPage.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }

  return ctx
}, {})
