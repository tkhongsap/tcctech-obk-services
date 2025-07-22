import React, { useEffect, useMemo, useState } from 'react'
import { IFaqItem } from '@src/services/art-and-culture/model'
import { useTranslate } from '@refinedev/core'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { ColumnProps } from 'primereact/column'
import Link from 'next/link'
import { Table } from '@components/table/Table'
import { Button } from 'primereact/button'
import { useRouter } from 'next/router'
import withGenericServer from '@hocs/server/generic'
import { Tag } from 'primereact/tag'
import dayjs from 'dayjs'
import { IconCell } from '@components/art-and-culture/table/IconCell'
import { CheckIcon } from '@chakra-ui/icons'
import { artCFaqsServices } from '@src/services/art-and-culture/art-c-faqs-services'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { toast } from 'react-toastify'

interface IFaqTableContent {
  id: number
  name: string
  nameTH?: string
  nameEN?: string
  nameZH?: string
  isPublished: boolean
  publishedAt?: Date
  updatedAt: Date
}

export default function ArtCultureFaqs() {
  const translate = useTranslate()
  const router = useRouter()
  const { query } = router

  const [isLoading, setIsLoading] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const [tableContent, setTableContent] = useState<IFaqTableContent[]>([])
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
        body: (data: IFaqTableContent) => (
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
        body: (data: IFaqTableContent) => (
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
        body: (data: IFaqTableContent) => (
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
        body: (data: IFaqTableContent) => {
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
        body: (data: IFaqTableContent) => {
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
        body: (data: IFaqTableContent) => {
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
        body: (data: IFaqTableContent) => {
          return (
            <Link
              href={`/art-and-culture/faqs/edit/${data.id}`}
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
      toast.success('Successfully created faq')
    } else if (status === 'updateSuccess') {
      toast.success('Successfully updated faq')
    } else if (status === 'orderSuccess') {
      toast.success('Successfully ordered faq')
    } else if (status === 'error') {
      toast.error('Failed to update faq')
    }
  }

  useEffect(() => {
    displayToast()

    setMenuName('Faqs')
    setMenuAction(
      <div className='flex gap-3'>
        <Button
          className='px-5 py-3 bg-primary-blue text-white'
          label='Order Faqs'
          onClick={() => {
            router.push({
              pathname: '/art-and-culture/faqs/order',
            })
          }}
        />
        <Button
          className='px-5 py-3 bg-primary-blue text-white'
          label='Create Faq'
          onClick={() => {
            router.push({
              pathname: '/art-and-culture/faqs/create',
            })
          }}
        />
      </div>
    )
  }, [setMenuName, setMenuAction, router])

  const fetchContent = async () => {
    setIsLoading(true)

    await artCFaqsServices
      .getAll('all')
      .then((res) => {
        const { data } = res.data

        const tempTableContent: IFaqTableContent[] = []
        data.forEach((item: IFaqItem) => {
          if (!item.faqTranslation || item.faqTranslation.length === 0) {
            return
          }

          let nameEN = ''
          let nameTH = ''
          let nameZH = ''
          item.faqTranslation.forEach((translation) => {
            if (translation.locale === 'en') {
              nameEN = translation.question
            } else if (translation.locale === 'th') {
              nameTH = translation.question
            } else if (translation.locale === 'zh') {
              nameZH = translation.question
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
            <span className='font-bold text-2xl'>List of faqs</span>
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

ArtCultureFaqs.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }

  return ctx
}, {})
