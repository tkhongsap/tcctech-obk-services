import SectionBlock from '@components/display/section-block'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Heading from '@components/typography/heading'
import { FormProvider } from 'react-hook-form'
import InputText from '@components/label-input/text'
import InputSelect from '@components/label-input/select'
import map from 'lodash/map'
import QuestionBuilder from '@components/support/faq/questions'
import UpsertPane from '@components/action-pane/upsert'
import { useEffect } from 'react'
import { IDocument } from '@src/types/document'

const tabProps = {
  color: 'rockBlue',
  fontSize: { md: '20px' },
  fontWeight: 700,
  _selected: {
    color: 'astronaut',
    borderColor: 'astronaut',
  },
}

const tabItems = [
  {
    key: 'en',
    label: 'English',
  },
  {
    key: 'th',
    label: 'Thai',
  },
  {
    key: 'cn',
    label: 'Chinese',
  },
]

const FaqCategoryUpsert = (props: any) => {
  const { form, data } = props
  const { register, watch, handleSubmit, setValue } = form
  watch()

  useEffect(() => {
    if (!data) return
    const enDocument = data.documents.map((doc: IDocument) => {
      return {
        question: doc.title?.en,
        answer: doc.body?.en,
      }
    })
    const thDocument = data.documents.map((doc: IDocument) => {
      return {
        question: doc.title?.th,
        answer: doc.body?.th,
      }
    })
    const cnDocument = data.documents.map((doc: IDocument) => {
      return {
        question: doc.title?.cn,
        answer: doc.body?.cn,
      }
    })
    setValue('categoryId', data.id)
    setValue('status', data.active ? 'active' : 'inactive')
    setValue('nameEn', data.title.en)
    setValue('nameTh', data.title.th)
    setValue('nameCn', data.title.cn)
    setValue('en.contents', enDocument)
    setValue('th.contents', thDocument)
    setValue('cn.contents', cnDocument)
  }, [])

  const tabList = map(tabItems, (item) => (
    <Tab key={item.key} {...tabProps}>
      {item.label}
    </Tab>
  ))

  const tabPanelList = map(tabItems, (item): any => {
    const key = `${item.key}.contents`
    return (
      <TabPanel key={item.key} pt='40px' px='0' w='100%'>
        <QuestionBuilder dataKey={key} locale={item.key} />
      </TabPanel>
    )
  })

  const onSubmit = (data: any) => {
    console.log(data)
  }

  const onCancel = () => {}

  const onDelete = (id: string) => {
    console.log('delete', id)
  }

  return (
    <div>
      <FormProvider {...form} onSubmit={handleSubmit(onSubmit)}>
        <div className='md:flex justify-between'>
          <div className='flex-1'>
            <SectionBlock>
              <div>
                <div className='flex justify-between items-center'>
                  <Heading as='h3' color='biscay'>
                    Details
                  </Heading>
                  <UpsertPane />
                </div>

                <div className='flex flex-col justify-between items-center w-full gap-8 pt-8'>
                  <div className='grid grid-cols-3 w-full gap-6'>
                    <div>
                      <InputText
                        label='Category ID'
                        register={register('categoryId')}
                      />
                    </div>
                    <div>
                      <InputSelect
                        label='Status'
                        register={register('status')}
                        items={[
                          {
                            label: 'Active',
                            value: 'active',
                          },
                          {
                            label: 'Inactive',
                            value: 'inactive',
                          },
                        ]}
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-3 w-full gap-6'>
                    <div>
                      <InputText
                        label='Category name (EN)'
                        register={register('nameEn')}
                      />
                    </div>
                    <div>
                      <InputText
                        label='Category name (THAI)'
                        register={register('nameTh')}
                      />
                    </div>
                    <div>
                      <InputText
                        label='Category name (CN)'
                        register={register('nameCn')}
                      />
                    </div>
                  </div>

                  <div className='w-full'>
                    <Tabs isFitted>
                      <TabList>{tabList}</TabList>
                      <TabPanels>{tabPanelList}</TabPanels>
                    </Tabs>
                  </div>
                </div>
              </div>
            </SectionBlock>

            <div className='py-6'>
              <UpsertPane
                onSubmit={handleSubmit(onSubmit)}
                onCancel={onCancel}
                onDelete={onDelete}
              />
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  )
}

export default FaqCategoryUpsert
