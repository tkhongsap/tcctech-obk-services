import { useEffect, useMemo, useState } from 'react'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { ColumnProps } from 'primereact/column'
import { useTranslate } from '@refinedev/core'
import { Table } from '@components/table/Table'
import Link from 'next/link'
import { IArtCTypeItem } from '@src/services/art-and-culture/model'
import { Button } from 'primereact/button'
import { useRouter } from 'next/router'
import withGenericServer from '@hocs/server/generic'
import dayjs from 'dayjs'
import { CheckIcon } from '@chakra-ui/icons'
import { toast } from 'react-toastify'
import { IconCell } from '@components/art-and-culture/table/IconCell'
import { artCServices } from '@src/services/art-and-culture/art-c-services'

interface IArtCTableContent {
  id: number
  name: string
  nameTH?: string
  nameEN?: string
  nameZH?: string
  updatedAt: Date
}

export default function ArtCPages() {
  const router = useRouter()
  const { query } = router
  const translate = useTranslate()

  const [isLoading, setIsLoading] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const [tableContent, setTableContent] = useState<IArtCTableContent[]>([])
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
        body: (data: IArtCTableContent) => (
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
        body: (data: IArtCTableContent) => (
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
        body: (data: IArtCTableContent) => (
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
        style: { minWidth: '100px' },
        body: (data: IArtCTableContent) => {
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
        body: (data: IArtCTableContent) => {
          return (
            <>
              <Link
                href={`/art-and-culture/art-c/edit/${data.id}`}
                className='p-button p-component p-button-text'
              >
                <span className='p-button-label p-c'>Edit</span>
              </Link>
              <Link
                href={`/art-and-culture/art-c/category/${data.id}`}
                className='p-button p-component p-button-text'
              >
                <span className='p-button-label p-c'>Sub Category</span>
              </Link>
            </>
          )
        },
      },
    ],
    [translate]
  )

  const displayToast = () => {
    const { status } = query

    if (status === 'createSuccess') {
      toast.success('Successfully created art & culture category')
    } else if (status === 'updateSuccess') {
      toast.success('Successfully updated art & culture category')
    } else if (status === 'error') {
      toast.error('Failed to update art & culture category')
    }
  }

  useEffect(() => {
    displayToast()

    setMenuName('Art & Culture Categories')
    setMenuAction(
      <div className='flex gap-3'>
        <Button
          className='px-5 py-3 bg-primary-blue text-white'
          label='Create Art & Culture Category'
          onClick={() => {
            router.push({
              pathname: '/art-and-culture/art-c/create',
            })
          }}
        />
      </div>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMenuName])

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

  return (
    <>
      <div className='card'>
        <div>
          <div className='mb-4'>
            <span className='font-bold text-2xl'>
              List of Art & Culture Categories
            </span>
          </div>
          <div>
            {!isLoadedContentError ? (
              <Table
                columns={columns}
                data={tableContent}
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

ArtCPages.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }
  return ctx
}, {})
