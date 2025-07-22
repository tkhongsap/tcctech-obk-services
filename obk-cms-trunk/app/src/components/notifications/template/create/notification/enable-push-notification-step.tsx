import { useFormController } from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import { PCODE } from '@src/data/constants/privilege'
import { usePermission } from '@src/hooks/permissionProvider'
import { Button } from 'primereact/button'
import { RadioButton } from 'primereact/radiobutton'
import { TabMenu } from 'primereact/tabmenu'
import { Dispatch, MouseEventHandler, SetStateAction, useState } from 'react'

type Props = {
  langItems: Lang[]
  activeLang: Lang
  setActiveLang: Dispatch<SetStateAction<Lang>>
  onBackClick?: MouseEventHandler<HTMLButtonElement>
  submitLabel?: string
}

export default function EnablePushNotificationStep(props: Props) {
  const { langItems, activeLang, setActiveLang, onBackClick, submitLabel } =
    props
  const { checkAccess } = usePermission()
  const { watch, setValue, trigger } = useFormController()
  const watchData: boolean = watch('isEnablePushNoti')

  const [isDisabledField, setIsDisabledField] = useState(!watchData)

  return (
    <div className='mb-5'>
      <span className='flex text-xl font-bold pl-5 lg:pl-2 mb-5 text-primary-800'>
        Enable push notification
      </span>
      <div className='flex mt-5 p-5 lg:p-0'>
        <div className='flex flex-column gap-5 w-full'>
          <div>
            <div className='flex align-items-center'>
              <RadioButton
                inputId='target41'
                name='isEnablePushNoti'
                onChange={() => {
                  setIsDisabledField(true)
                  langItems.forEach((lang) => {
                    setValue('isEnablePushNoti', false)
                    setValue(`push_notification_data.title.${lang.code}`, '')
                    setValue(`push_notification_data.message.${lang.code}`, '')
                    trigger()
                  })
                }}
                checked={isDisabledField}
              />
              <label htmlFor='target41' className='ml-2 text-primary-800'>
                {"No, I don't want to send push notification for this message."}
              </label>
            </div>
          </div>
          <div>
            <div className='flex align-items-center'>
              <RadioButton
                inputId='target42'
                name='target42'
                value='target42'
                onChange={() => {
                  setValue('isEnablePushNoti', true)
                  setIsDisabledField(false)
                }}
                checked={!isDisabledField}
              />
              <label htmlFor='target42' className='ml-2 text-primary-800'>
                Yes, I want to send push notifications along with the in-app
                notification
              </label>
            </div>
            <div className='ml-5 '>
              <small className='text-500'>
                Please provide the information for push notification.
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

              {langItems.map(
                (lang, langIndex) =>
                  activeLang.code === lang.code && (
                    <div
                      key={langIndex}
                      className='flex flex-column gap-3 w-auto'
                    >
                      <div className='flex flex-column gap-1 w-full'>
                        <TextField
                          name={`push_notification_data.title.${lang.code}`}
                          disabled={isDisabledField}
                          placeholder='Title'
                          rules={
                            !isDisabledField && lang.code === 'en'
                              ? { required: 'Title is required' }
                              : { required: undefined }
                          }
                          label={
                            lang.code === 'en'
                              ? `Title (${lang.label}) *`
                              : `Title (${lang.label})`
                          }
                          showRequiredLabel={false}
                        />
                      </div>
                      <div className='flex flex-column gap-1 w-full'>
                        <TextField
                          name={`push_notification_data.message.${lang.code}`}
                          disabled={isDisabledField}
                          placeholder='Message'
                          rules={
                            !isDisabledField && lang.code === 'en'
                              ? { required: 'Message is required' }
                              : { required: undefined }
                          }
                          label={
                            lang.code === 'en'
                              ? `Message (${lang.label}) *`
                              : `Message (${lang.label})`
                          }
                          showRequiredLabel={false}
                        />
                      </div>
                    </div>
                  )
              )}
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
            {checkAccess(PCODE.APPROVEORREJECTEDTHESUBMITTEDNOTIFICATION) ? (
              <Button
                type='submit'
                className='px-5 bg-primary-blue'
                label={submitLabel ?? 'Next'}
              />
            ) : (
              <Button
                type='submit'
                className='px-5 bg-primary-blue'
                label={submitLabel ?? 'Submit for approval'}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
