import { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { useRouter } from 'next/router'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import { useLayoutContext } from '@src/layout/context/layoutcontext'
import {
  IFaqItem,
  IFaqOrderForm,
  IFaqTranslation,
} from '@src/services/art-and-culture/model'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import withGenericServer from '@hocs/server/generic'
import { artCFaqsServices } from '@src/services/art-and-culture/art-c-faqs-services'

export default function ArtCultureFaqsOrder() {
  const formRef = useRef<FormControllerRef<IFaqOrderForm>>(null)

  const router = useRouter()
  const { setMenuName } = useLayoutContext()

  const [isLoading, setIsLoading] = useState(false)
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const [requestError, setRequestError] = useState({
    status: false,
    message: '',
  })

  const [faqList, setFaqList] = useState<IFaqItem[]>([])

  const handleOrderEnd = (result: DropResult) => {
    if (!result || !result.destination) return

    const newList = Array.from(faqList)
    const [draggedItem] = newList.splice(result.source.index, 1)
    newList.splice(result.destination!.index, 0, draggedItem)

    setFaqList(newList)
  }

  const onSubmit = async () => {
    setIsFormSubmitting(true)

    if (faqList.length === 0) return

    const ids: number[] = faqList.map((faq) => faq.id)

    await artCFaqsServices
      .order(ids)
      .then(() => {
        router.push(`/art-and-culture/faqs?status=orderSuccess`)
      })
      .catch(() => {
        setRequestError({
          status: true,
          message: "Something went wrong, can't set order to faq content",
        })
      })
      .finally(() => {
        setIsFormSubmitting(false)
      })
  }

  const onBack = () => router.push('/art-and-culture/faqs')
  const buttonActionTemplate = (
    <div className='flex gap-3 justify-content-center md:justify-content-start'>
      <Button
        disabled={isFormSubmitting}
        className='px-5 py-3 bg-primary-blue text-white'
        label='Publish'
        onClick={formRef.current?.handleSubmit(onSubmit)}
      />
      <Button
        type='button'
        disabled={isFormSubmitting}
        className='px-5 text-primary-blue'
        label='Close'
        text
        onClick={onBack}
      />
    </div>
  )

  const fetchFaq = async () => {
    setIsLoading(true)

    await artCFaqsServices
      .getAll('all')
      .then((res) => {
        const { data } = res.data
        setFaqList(data)
      })
      .catch(() => {
        alert("Something went wrong, can't fetch content.")
        router.push('/art-and-culture/faqs')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchFaq()
    setMenuName('Order Faqs')
  }, [])

  return (
    <>
      <FormController
        ref={formRef}
        defualtValue={{ faqItems: [] }}
        onSubmit={onSubmit}
      >
        <div className='card'>
          <div>
            <div className='mb-4'>
              <span className='font-bold text-2xl'>List of faqs</span>
            </div>

            <div>
              {!isLoading && (
                <DragDropContext onDragEnd={handleOrderEnd}>
                  {faqList.length === 0 ? (
                    <div className='text-center'>There is no faqs content.</div>
                  ) : (
                    <Droppable droppableId='boxes'>
                      {(provided) => (
                        <ul
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className='list-none'
                        >
                          {faqList.map((faq, index) => {
                            let question = '-'

                            let translation: IFaqTranslation | undefined
                            for (let item of ['en', 'th', 'zh']) {
                              translation = faq.faqTranslation.find(
                                (tItem) => tItem.locale === item
                              )

                              if (translation) {
                                break
                              }
                            }

                            if (translation) {
                              question = translation.question
                            }

                            return (
                              <Draggable
                                key={faq.id}
                                draggableId={`faq-${faq.id}`}
                                index={index}
                              >
                                {(provided) => (
                                  <li
                                    ref={provided.innerRef}
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                  >
                                    <div className='w-full border-2 border-gray-200 text-center py-4 my-4 font-bold'>
                                      {question}
                                    </div>
                                  </li>
                                )}
                              </Draggable>
                            )
                          })}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                  )}
                </DragDropContext>
              )}
            </div>
          </div>
        </div>

        {requestError.status && (
          <div className='pb-4 text-red-700 text-sm'>
            {requestError.message}
          </div>
        )}

        <div>{buttonActionTemplate}</div>
      </FormController>
    </>
  )
}

ArtCultureFaqsOrder.activePrime = true
export const getServerSideProps = withGenericServer(async (ctx: any) => {
  ctx.props = { ...ctx.props }

  return ctx
}, {})
