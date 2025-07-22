import { IPartnerItem } from '@src/services/art-and-culture/model'
import { useEffect, useMemo, useState } from 'react'
import { useTranslate } from '@refinedev/core'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { ColumnProps } from 'primereact/column'
import Link from 'next/link'
import { Table } from '@components/table/Table'
import { Button } from 'primereact/button'
import { useRouter } from 'next/router'
import withGenericServer from '@hocs/server/generic'
import dayjs from 'dayjs'
import { IconCell } from '@components/art-and-culture/table/IconCell'
import { CheckIcon } from '@chakra-ui/icons'
import { artCPartnerServices } from '@src/services/art-and-culture/art-c-partner-services'
import { InputText } from 'primereact/inputtext'
import { toast } from 'react-toastify'

interface IPartnerTableContent {
  id: number
  name: string
  nameTH?: string
  nameEN?: string
  nameZH?: string
  updatedAt: Date
}

export default function ArtCulturePartner() {
  const translate = useTranslate()
  const router = useRouter()
  const { query } = router

  const [isLoading, setIsLoading] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const [tableContent, setTableContent] = useState<IPartnerTableContent[]>([])
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
        body: (data: IPartnerTableContent) => (
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
        body: (data: IPartnerTableContent) => (
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
        body: (data: IPartnerTableContent) => (
          <IconCell
            value={data.nameZH}
            IconComponent={CheckIcon}
            color='#59B413'
          />
        ),
      },
      {
        field: 'updatedAt',
        header: 'Last update',
        sortable: true,
        body: (data: IPartnerTableContent) => {
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
        body: (data: IPartnerTableContent) => {
          return (
            <Link
              href={`/art-and-culture/partners/edit/${data.id}`}
              className='p-button p-component p-button-text'
            >
              <span className='p-button-label p-c'>Edit</span>
            </Link>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate]
  )

  const displayToast = () => {
    const { status } = query

    if (status === 'createSuccess') {
      toast.success('Successfully created partner')
    } else if (status === 'updateSuccess') {
      toast.success('Successfully updated partner')
    } else if (status === 'error') {
      toast.error('Failed to update partner')
    }
  }

  const fetchContent = async () => {
    setIsLoading(true)

    await artCPartnerServices
      .getAll('all')
      .then((res) => {
        const { data } = res.data

        const tempTableContent: IPartnerTableContent[] = []
        data.forEach((item: IPartnerItem) => {
          if (
            !item.partnerTranslation ||
            item.partnerTranslation.length === 0
          ) {
            return
          }

          let nameEN = ''
          let nameTH = ''
          let nameZH = ''
          item.partnerTranslation.forEach((translation) => {
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
    displayToast()

    setMenuName('Partners')
    setMenuAction(
      <div className='flex gap-3'>
        <Button
          className='px-5 py-3 bg-primary-blue text-white'
          label='Create Partner'
          onClick={() => {
            router.push({
              pathname: '/art-and-culture/partners/create',
            })
          }}
        />
      </div>
    )
  }, [setMenuName, setMenuAction, router])

  useEffect(() => {
    fetchContent()
  }, [])

  const [search, setSearch] = useState({ keyword: '' })

  return (
    <>
      <div className='card'>
        <div>
          <div className='mb-2'>
            <span className='font-bold text-2xl'>List of partners</span>
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

ArtCulturePartner.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }

  return ctx
}, {})
