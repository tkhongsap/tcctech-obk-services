import React, { useCallback, useState } from 'react'
import { useFormController } from '@components/forms/components/form-controller'
import { KeyValue } from '@src/types/key-value'
import { Button } from 'primereact/button'
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton'
import Papa from 'papaparse'
import { isEmpty } from 'lodash'
import { UploadCsvTargetGroupNotification } from '@components/notifications/inapp/upload-csv-targetgroup-notification'
import { targetGroupByUserType } from '@components/notifications/types/notification'
import { SelectUserTypeTargetGroupNotification } from '@components/notifications/inapp/targetgroup-usertype-notification'

type Props = {
  // onBackClick?: MouseEventHandler<HTMLButtonElement>
  targetData?: KeyValue[]
  towers?: KeyValue[]
  floors?: { name: string; value: string; towerId: string }[]
}

type CSVData = { account_id: string }[]

export default function TargetStep({
  // onBackClick,
  targetData = [],
  towers,
  floors,
}: Props) {
  const { setValue, watch, setError, clearErrors } = useFormController()
  const watchTargetGroupDetails:
    | {
        name: string
        account_id_group: string[]
        detail: File
        targetGroupByUserType: targetGroupByUserType[]
      }
    | undefined = watch('targetGroupDetails')

  const targets = {
    all: targetData.find((x) => x.name === 'all'),
    custom: { name: 'custom', value: '' },
    userType: { name: 'userType', value: '' },
  }

  const getInitialTargetValue = () => {
    if (
      watchTargetGroupDetails &&
      watchTargetGroupDetails.account_id_group?.length > 0
    ) {
      return targets.custom.name
    }
    if (
      watchTargetGroupDetails &&
      watchTargetGroupDetails.targetGroupByUserType.some(
        (type) => !isEmpty(type.tower)
      )
    ) {
      return targets.userType.name
    }

    return targets.all?.value
  }

  const [selectedTarget, setSelectedTarget] = useState(getInitialTargetValue)
  const [csvData, setCsvData] = useState<CSVData | undefined>(
    watchTargetGroupDetails?.name && watchTargetGroupDetails?.account_id_group
      ? watchTargetGroupDetails.account_id_group.map((account_id) => ({
          account_id,
        }))
      : undefined
  )
  const [csvFile, setCsvFile] = useState<File | undefined>(
    watchTargetGroupDetails && watchTargetGroupDetails?.detail
  )
  const [userTypeData, setUserTypeData] = useState(
    watchTargetGroupDetails?.targetGroupByUserType ?? [
      {
        userType: '',
        tower: '',
        floor: [{ name: '', value: '' }],
        floorOptions: [],
        towerOptions: towers ?? [],
      },
    ]
  )
  const handleTargetChange = (e?: RadioButtonChangeEvent, index?: number) => {
    if (e) {
      setSelectedTarget(e.value)
      setUserTypeData([
        {
          userType: '',
          tower: '',
          floor: [{ name: '', value: '' }],
          floorOptions: [],
          towerOptions: towers ?? [],
        },
      ])

      if (e.value !== targets.custom.name) {
        onRemoveFile()
      }
    } else {
      clearErrorsForTargetGroup(index)
    }
  }

  const onRemoveFile = () => {
    setValue('targetGroupDetails', undefined)
    setCsvFile(undefined)
    setCsvData(undefined)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setCsvFile(file)
    Papa.parse<CSVData[0]>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const headers = result.meta.fields || []
        if (result.data.length > 20000) {
          setError('targetGroupDetails', {
            type: 'manual',
            message: 'CSV file should not contain more than 20000 entries.',
          })
          onRemoveFile()
          return
        }

        if (!headers.includes('account_id')) {
          setError('targetGroupDetails', {
            type: 'manual',
            message: 'CSV file must contain the "account_id" column.',
          })
          onRemoveFile()
          return
        }

        const accountIds = result.data.map((item) => item.account_id)
        setValue('targetGroupDetails', {
          name: file.name.replace('.csv', ''),
          account_id_group: accountIds,
          detail: file,
        })

        setCsvData(result.data)
      },
      error: (error) => {
        console.error('Error while parsing CSV file:', error)
        setError('targetGroupDetails', {
          type: 'manual',
          message: 'Error parsing CSV file.',
        })
      },
    })
  }

  const handleClick = () => {
    if (selectedTarget !== targets.all?.value) {
      setValue('target_groups', '')
    } else {
      setValue('target_groups', selectedTarget)
    }

    setValue('targetGroupDetails', {
      ...watchTargetGroupDetails,
      targetGroupByUserType: userTypeData,
    })
  }
  const updateUserTypeData = useCallback(
    (index: number, updates: Partial<(typeof userTypeData)[0]>) => {
      setUserTypeData((prevData) => {
        const updatedData = prevData.map((item, idx) =>
          idx === index ? { ...item, ...updates } : item
        )
        return updatedData
      })
    },
    []
  )

  const validateUpload = (value: any) => {
    if (selectedTarget !== 'custom') {
      return true
    }

    if (!value.name) {
      return 'Please upload a CSV file.'
    }
    return true
  }

  const clearErrorsForTargetGroup = (index?: number) => {
    clearErrors(`target-building-${index}`)
    clearErrors(`target-floor-${index}`)
    clearErrors(`target-usertype-${index}`)
    clearErrors('targetGroupDetails')
  }
  return (
    <div className='mb-5'>
      <span className='flex text-xl font-bold pl-5 lg:pl-2 text-primary-800 mb-4'>
        Target
      </span>
      <div className='flex w-full mt-2 p-5 lg:p-2'>
        <div className='flex flex-column gap-5 w-full'>
          <div>
            <div className='flex align-items-center'>
              <RadioButton
                inputId='target-all'
                name='target_groups'
                value={targets.all?.value}
                onChange={handleTargetChange}
                checked={selectedTarget === targets.all?.value}
              />
              <label
                htmlFor='target-all'
                className='text-primary-800 font-semibold ml-2'
              >
                All users
              </label>
            </div>
          </div>

          <div className='flex flex-column w-full'>
            <div className='flex align-items-center'>
              <RadioButton
                inputId='target-userType'
                name='target_groups1'
                value={targets.userType.name}
                onChange={handleTargetChange}
                checked={selectedTarget === targets.userType.name}
              />
              <label
                htmlFor='target-userType'
                className='text-primary-800 font-semibold ml-2'
              >
                Specific by User Type
              </label>
            </div>
            <SelectUserTypeTargetGroupNotification
              selectedTarget={selectedTarget}
              userTypeData={userTypeData}
              setUserTypeData={setUserTypeData}
              towers={towers}
              updateUserTypeData={updateUserTypeData}
              floors={floors}
              watchTargetGroupDetails={watchTargetGroupDetails}
              handleTargetChange={handleTargetChange}
              disabled={selectedTarget !== targets.userType.name}
            />
          </div>

          <div className='flex flex-column w-full'>
            <div className='flex align-items-center'>
              <RadioButton
                inputId='target-custom'
                name='target_groups'
                value={targets.custom.name}
                onChange={handleTargetChange}
                checked={selectedTarget === targets.custom.name}
              />
              <label
                htmlFor='target-custom'
                className='text-primary-800 font-semibold ml-2'
              >
                Specific by User ID
              </label>
            </div>
            <div className='flex flex-column pl-5 pt-2 gap-1 w-full'>
              <div className='mt-3'>
                <RadioButton
                  inputId='target-csv'
                  name='target_groups'
                  disabled={selectedTarget !== targets.custom.name}
                  value={targets.custom.name}
                  onChange={handleTargetChange}
                  checked={selectedTarget === targets.custom.name}
                />
                <label
                  htmlFor='target-csv'
                  className='text-primary-800 font-semibold ml-2'
                >
                  Upload .csv file
                </label>
              </div>
              <UploadCsvTargetGroupNotification
                validateUpload={validateUpload}
                csvData={csvData}
                csvFile={csvFile}
                onChange={handleFileUpload}
                onRemoveFile={onRemoveFile}
                selectedUploadCsv={selectedTarget !== targets.custom.name}
                targetGroupDetails={watchTargetGroupDetails}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-content-end w-full gap-3 px-5'>
        {/* <Button
          type='button'
          className='px-5'
          label='Back'
          outlined
          onClick={onBackClick}
        /> */}
        <Button
          type='submit'
          className='px-5 bg-primary-blue'
          label='Next'
          onClick={handleClick}
        />
      </div>
    </div>
  )
}
