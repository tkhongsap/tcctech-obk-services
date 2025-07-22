import React, { useEffect, useMemo, useState } from 'react'
import { ColumnProps } from 'primereact/column'
import { Table } from '@components/table/Table'
import {
  IArtCCategoryItem,
  IArtCTranslation,
} from '@src/services/art-and-culture/model'
import Link from 'next/link'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import { useTranslate } from '@refinedev/core'
import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
import withGenericServer from '@hocs/server/generic'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { CheckIcon } from '@chakra-ui/icons'
import { IconCell } from '@components/art-and-culture/table/IconCell'
import { artCCategoryServices } from '@src/services/art-and-culture/art-c-category-services'
import { artCServices } from '@src/services/art-and-culture/art-c-services'

interface IArtCTableContent {
  id: number
  artCTypeId: number
  name: string
  nameTH?: string
  nameEN?: string
  nameZH?: string
  updatedAt: Date
}

export default function ArtCCategoryPage() {
  const router = useRouter()
  const { query } = router
  const { typeId } = query

  const translate = useTranslate()

  const [isLoading, setIsLoading] = useState(false)
  const { setMenuName, setMenuAction } = useLayoutContext()
  const [artCTypeTitle, setArtCTypeTitle] = useState<string>('')
  const [tableContent, setTableContent] = useState<IArtCTableContent[]>([])
  const [isLoadedContentError, setIsLoadedContentError] =
    useState<boolean>(false)

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'name',
        header: 'Name',
        sortable: false,
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
        sortable: false,
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
            <Link
              href={`/art-and-culture/art-c/category/${data.artCTypeId}/edit/${data.id}`}
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
      toast.success('Successfully created art & culture sub category')
    } else if (status === 'updateSuccess') {
      toast.success('Successfully updated art & culture sub category')
    } else if (status === 'error') {
      toast.error('Failed to update art & culture sub category')
    }
  }

  const fetchContent = async () => {
    if (!typeId) router.push('/art-and-culture/art-c')
    setIsLoading(true)

    await artCServices
      .get(`${typeId}`, 'all')
      .then((res) => {
        const { data } = res.data
        if (data) {
          if (!data.artCTranslation || data.artCTranslation.length === 0) {
            return <span>-</span>
          }

          let translation: IArtCTranslation | undefined
          for (let item of ['en', 'th', 'zh']) {
            translation = data.artCTranslation.find(
              (tItem: any) => tItem.locale === item
            )

            if (translation) {
              break
            }
          }

          setArtCTypeTitle(translation?.title || '')
        }
      })
      .catch(() => {
        alert("Something went wrong, can't fetch content.")
        router.push('/art-and-culture/art-c')
      })
      .finally(() => {
        setIsLoading(false)
      })

    await artCCategoryServices
      .getAll(`${typeId}`, 'all')
      .then((res) => {
        const { data } = res.data

        const tempTableContent: IArtCTableContent[] = []
        data.forEach((item: IArtCCategoryItem) => {
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
            artCTypeId: item.artCTypeId,
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

    setMenuName(`Art & Culture Sub Category`)
    setMenuAction(
      <div className='flex gap-3'>
        <Button
          className='px-5 py-3 bg-primary-blue text-white'
          label={`Create Sub Category`}
          onClick={() => {
            router.push({
              pathname: `/art-and-culture/art-c/category/${typeId}/create`,
            })
          }}
        />
      </div>
    )
  }, [setMenuName, typeId])

  useEffect(() => {
    fetchContent()
  }, [typeId])

  return (
    <>
      <div className='card'>
        <div>
          <div className='mb-4'>
            <span className='font-bold text-2xl'>
              List of &quot;{artCTypeTitle}&quot; category
            </span>
          </div>
          <div>
            {!isLoadedContentError ? (
              <Table
                columns={columns}
                data={tableContent}
                loading={isLoading}
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

ArtCCategoryPage.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }
  return ctx
}, {})
