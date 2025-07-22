import { CheckIcon } from '@chakra-ui/icons'
import { IconCell } from '@components/art-and-culture/table/IconCell'
import { Table } from '@components/table/Table'
import withGenericServer from '@hocs/server/generic'
import { useTranslate } from '@refinedev/core'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { artCPlaylistServices } from '@src/services/art-and-culture/art-c-playlist-services'
import { IPlaylist } from '@src/services/art-and-culture/model'
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

interface IPlaylistTableContent {
  id: number
  name: string
  nameTH?: string
  nameEN?: string
  nameZH?: string
  isPublished: boolean
  publishedAt?: Date
  updatedAt: Date
}

export default function ArtCulturePlaylistPage() {
  const translate = useTranslate()
  const router = useRouter()
  const { query } = router

  const [isLoading, setIsLoading] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const [tableContent, setTableContent] = useState<IPlaylistTableContent[]>([])
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
        field: 'en',
        header: 'EN',
        sortable: false,
        style: { minWidth: '90px' },
        body: (data: IPlaylistTableContent) => (
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
        body: (data: IPlaylistTableContent) => (
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
        body: (data: IPlaylistTableContent) => (
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
        body: (data: IPlaylistTableContent) => {
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
        body: (data: IPlaylistTableContent) => {
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
        body: (data: IPlaylistTableContent) => {
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
        body: (data: IPlaylistTableContent) => {
          return (
            <Link
              href={`/art-and-culture/playlist/edit/${data.id}`}
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
      toast.success('Successfully created playlist')
    } else if (status === 'updateSuccess') {
      toast.success('Successfully updated playlist')
    } else if (status === 'error') {
      toast.error('Failed to update playlist')
    }
  }

  useEffect(() => {
    displayToast()

    setMenuName('Playlist')
    setMenuAction(
      <div className='flex gap-3'>
        <Button
          className='px-5 py-3 bg-primary-blue text-white'
          label='Create Playlist'
          onClick={() => {
            router.push({
              pathname: '/art-and-culture/playlist/create',
            })
          }}
        />
      </div>
    )
  }, [setMenuName, setMenuAction, router])

  const fetchContent = async () => {
    setIsLoading(true)

    await artCPlaylistServices
      .getAll('all')
      .then((res) => {
        const { data } = res.data

        const tempTableContent: IPlaylistTableContent[] = []
        data.forEach((item: IPlaylist) => {
          if (
            !item.playlistTranslation ||
            item.playlistTranslation.length === 0
          ) {
            return
          }

          let nameEN = ''
          let nameTH = ''
          let nameZH = ''
          item.playlistTranslation.forEach((translation) => {
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
            isPublished: item.isPublished ? true : false,
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

  const [search, setSearch] = useState({ keyword: '', status: -1 })

  return (
    <>
      <div className='card'>
        <div>
          <div className='mb-2'>
            <span className='font-bold text-2xl'>List of playlist</span>
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
            {!isLoadedContentError ? (
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
                paginator
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

ArtCulturePlaylistPage.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }
  return ctx
}, {})
