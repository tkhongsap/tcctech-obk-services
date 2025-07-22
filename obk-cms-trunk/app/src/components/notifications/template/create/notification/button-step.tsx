import { useFormController } from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import { Button } from 'primereact/button'
import { RadioButton } from 'primereact/radiobutton'
import { TabMenu } from 'primereact/tabmenu'
import {
  Dispatch,
  Fragment,
  MouseEventHandler,
  SetStateAction,
  useState,
} from 'react'
import { InputSwitch } from 'primereact/inputswitch'

type Props = {
  langItems: Lang[]
  activeLang: Lang
  setActiveLang: Dispatch<SetStateAction<Lang>>
  onBackClick?: MouseEventHandler<HTMLButtonElement>
  nextButtonLabel?: string
}

export default function ButtonStep(props: Props) {
  const { langItems, activeLang, setActiveLang, onBackClick, nextButtonLabel } =
    props

  const { watch, setValue, clearErrors, trigger } = useFormController()
  const watchData: boolean = watch('isEnableButton')
  const watchDataToggle: boolean = watch('deeplink_with_account_id')

  const [isDisabledField, setIsDisabledField] = useState(!watchData)
  const [isToggle, setIsToggle] = useState(watchDataToggle)

  return (
    <div className='mb-5'>
      <span className='flex text-xl font-bold pl-5 lg:pl-2 mb-5 text-primary-800'>
        Button
      </span>
      <div className='flex mt-5 p-5 lg:p-0'>
        <div className='flex flex-column gap-5 w-full'>
          <div>
            <div className='flex align-items-center'>
              <RadioButton
                inputId='target41'
                name='isEnableButton'
                onChange={() => {
                  setValue('isEnableButton', false)
                  setIsDisabledField(true)
                  setValue(`deeplink_display_name.en`, '')
                  setValue(`deeplink_display_name.th`, '')
                  setValue(`deeplink_display_name.zh`, '')
                  clearErrors('deeplink_display_name.en')
                  setValue('deeplink', '')
                  clearErrors('deeplink')
                  trigger()
                }}
                checked={isDisabledField}
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
                name='target42'
                onChange={() => {
                  setValue('isEnableButton', true)
                  setIsDisabledField(false)
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
                          name={`deeplink_display_name.${lang.code}`}
                          label={`Button name (${activeLang.label}) *`}
                          placeholder='button name'
                          disabled={isDisabledField}
                          rules={
                            !isDisabledField && lang.code === 'en'
                              ? { required: 'Button name is required' }
                              : { required: undefined }
                          }
                          showRequiredLabel={false}
                        />
                      </div>
                    </div>
                  </Fragment>
                ))}
                <div className='flex flex-column gap-1 w-full'>
                  <TextField
                    name='deeplink'
                    placeholder='Link URL'
                    label='Button link URL *'
                    disabled={isDisabledField}
                    rules={
                      !isDisabledField
                        ? { required: 'Link URL is required' }
                        : { required: undefined }
                    }
                    showRequiredLabel={false}
                  />
                </div>
                <div>
                  <div className='flex align-items-center'>
                    <InputSwitch
                      name='deeplink_with_account_id'
                      type='checkbox'
                      checked={watchDataToggle}
                      disabled={isDisabledField}
                      onChange={() => {
                        setValue('deeplink_with_account_id', !watchDataToggle)
                        setIsToggle(!isToggle)
                      }}
                    />
                    <small className='text-500 ml-2'>Attach Account ID</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-content-end w-full gap-3 px-5 mt-5'>
            <Button
              type='button'
              className='px-5'
              label='Back'
              outlined
              onClick={(e) => {
                onBackClick && onBackClick(e)
              }}
            />
            <Button
              type='submit'
              className='px-5 bg-primary-blue'
              label={nextButtonLabel ?? 'Next'}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
