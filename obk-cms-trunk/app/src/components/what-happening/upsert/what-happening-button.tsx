import { useFormController } from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import { RadioButton } from 'primereact/radiobutton'
import { TabMenu } from 'primereact/tabmenu'
import { Dispatch, Fragment, SetStateAction, useState } from 'react'

type Props = {
  activeLang: Lang
  langItems: Lang[]
  setActiveLang: Dispatch<SetStateAction<Lang>>
  triggerErrorState: () => void
}
const WhatHappeningButton = (props: Props) => {
  const { watch } = useFormController()
  const isShow = watch('button.isShow')
  console.log(isShow)
  const { activeLang, langItems, setActiveLang, triggerErrorState } = props
  const [isDisabledField, setIsDisabledField] = useState(!isShow)
  const { setValue } = useFormController()

  return (
    <div className='card mb-5'>
      <span className='flex text-xl font-bold pl-5 lg:pl-2 mb-5 text-primary-800'>
        Button
      </span>
      <div className='flex mt-5 p-5 lg:p-0'>
        <div className='flex flex-column gap-5 w-full'>
          <div>
            <div className='flex align-items-center'>
              <RadioButton
                inputId='target41'
                name='isShow'
                checked={isDisabledField}
                onChange={() => {
                  setValue('button.isShow', false)
                  setIsDisabledField(true)
                  setValue('button.content.en.name', '')
                  setValue('button.content.th.name', '')
                  setValue('button.content.zh.name', '')
                  setValue('button.url', '')
                }}
              />
              <label htmlFor='target41' className='ml-2 text-primary-800'>
                Proceed without a button
              </label>
            </div>
          </div>
          <div>
            <div className='flex align-items-center'>
              <RadioButton
                inputId='target42'
                name='isShow'
                onChange={() => {
                  setValue('button.isShow', true)
                  setIsDisabledField(false)
                  triggerErrorState()
                }}
                checked={!isDisabledField}
              />
              <label htmlFor='target42' className='ml-2 text-primary-800'>
                Button with a link URL
              </label>
            </div>
            <div className='ml-5 '>
              <small className='text-500'>
                For this option, you can specify an external link or URL to
                which the notification will direct users. Please provide the
                complete URL for directing
                <br /> users to external websites, landing pages, or resources.
              </small>
            </div>
            <div className='ml-5'>
              <div className='my-5'>
                <TabMenu
                  model={langItems}
                  activeIndex={langItems.findIndex(
                    (x) => x.code === activeLang.code
                  )}
                  onTabChange={(e) => setActiveLang(langItems[e.index])}
                />
              </div>
              <div className='flex flex-column gap-3 w-auto'>
                {langItems.map((lang, langIndex) => (
                  <Fragment key={langIndex}>
                    <div hidden={activeLang.code !== lang.code}>
                      <div className='flex flex-column gap-1 w-full'>
                        <TextField
                          name={`button.content.${lang.code}.name`}
                          label={`Button name (${activeLang.label}) *`}
                          placeholder='button name'
                          disabled={isDisabledField}
                          rules={
                            !isDisabledField && lang.code === 'en'
                              ? {
                                  required: 'Button name is required',
                                }
                              : { required: undefined }
                          }
                          showRequiredLabel={false}
                          onChange={triggerErrorState}
                        />
                      </div>
                    </div>
                  </Fragment>
                ))}
                <div className='flex flex-column gap-1 w-full'>
                  <TextField
                    name='button.url'
                    placeholder='Link URL'
                    label='Button link URL *'
                    disabled={isDisabledField}
                    rules={
                      !isDisabledField
                        ? { required: 'Link URL is required' }
                        : { required: undefined }
                    }
                    showRequiredLabel={false}
                    onChange={triggerErrorState}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhatHappeningButton
