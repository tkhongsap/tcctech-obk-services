import { CloseIcon } from '@chakra-ui/icons'
import { Grid, IconButton } from '@chakra-ui/react'
import {
  FormController,
  FormControllerRef,
  useFormController,
} from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import { RedemptionDetailModal } from '@pages/car-park/self-redemption-record/show/[id]'
import Image from 'next/image'
import { Receipt, ReceiptStatus } from 'ob-parking-sdk/dist/api'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { useRef, useState } from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import DropdownField from '@components/forms/components/dropdown-field'
import { InputMask } from 'primereact/inputmask'
import * as OB_PARKING_SDK from 'ob-parking-sdk'

type Props = {
  isShowModal: RedemptionDetailModal
  setIsShowModal: (val: RedemptionDetailModal) => void
  receipt: Receipt
}

type ReceiptFormValues = {
  hashed_receipt?: string
  message?: string
  total: string
  image_url: string
  status: ReceiptStatus
  merchant_name?: string
  transaction_date?: string
  transaction_time?: string
  tax_id?: string
  receipt_no?: string
  address?: string
  unit_no?: string
  mall_name?: string

  items: {
    description?: string
    total_price?: string
    quantity?: number
  }[]
}

export const ReceiptForm = ({
  isShowModal,
  setIsShowModal,
  receipt,
}: Props) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef<FormControllerRef<ReceiptFormValues>>(null)

  const handleSubmit = async (data: ReceiptFormValues) => {
    setIsLoading(true)
    try {
      const res = await OB_PARKING_SDK.client.receiptUpdateReceipt({
        id: receipt.id,
        message: data?.message || '',
        merchant_name: data.merchant_name || '',
        transaction_date: data.transaction_date ?? '',
        transaction_time: data.transaction_time ?? '',
        tax_id: data.tax_id ?? '',
        receipt_no: data.receipt_no ?? '',
        address: data.address ?? '',
        unit_no: data.unit_no ?? '',
        mall_name: data.mall_name ?? '',
        hashed_receipt: data.hashed_receipt ?? '',
        items: data.items.map((item) => ({
          description: item?.description ?? '',
          quantity: item?.quantity ? item.quantity : undefined,
          total_price: item.total_price ?? '',
        })),
        total: data.total,
        status: data.status,
      })
      if (res.data && res.status === 200) {
        router.refresh()
        setIsLoading(false)
      } else {
        setIsLoading(false)
        setIsShowModal('update-receipt-failed')
      }
    } catch (error) {
      setIsLoading(false)
      setIsShowModal('update-receipt-failed')
    }
  }
  const shouldEditStatus =
    receipt.status === ReceiptStatus.Success ||
    receipt.status === ReceiptStatus.Declined

  return (
    <div>
      <Dialog
        draggable={false}
        blockScroll={true}
        visible={isShowModal === 'update-receipt-form'}
        style={{ minWidth: '30vw', width: '80vw' }}
        onHide={() => {
          setIsShowModal(undefined)
        }}
        modal
        content={({ hide }) => (
          <div className='bg-white tw-w-full tw-p-10 border-round-lg tw-h-full'>
            <FormController
              defualtValue={{
                ...receipt,
              }}
              ref={formRef}
              onSubmit={handleSubmit}
            >
              <div className='flex tw-w-full tw-flex-col tw-gap-6'>
                <div className='flex tw-gap-6 tw-items-center'>
                  <span className='text-info flex flex-1 tw-text-2xl tw-font-bold'>
                    Receipt no. {receipt.receipt_no}
                  </span>
                  <div>
                    <span className='text-info'>Status</span>
                    <DropdownField
                      disabled={isLoading || !shouldEditStatus}
                      name='status'
                      options={[
                        { name: 'Success', value: ReceiptStatus.Success },
                        { name: 'Declined', value: ReceiptStatus.Declined },
                      ]}
                      optionLabel='name'
                      optionValue='value'
                      placeholder='select'
                    />
                  </div>
                  <div>
                    <span className='text-info'>Reason</span>
                    <TextField
                      disabled={isLoading}
                      name='message'
                      showRequiredLabel={false}
                    />
                  </div>
                </div>
                <div style={{ borderBottom: '1px solid #A3AED0' }} />
                <div
                  style={{ maxHeight: '30rem', position: 'relative' }}
                  className='tw-w-full flex tw-justify-between tw-overflow-auto'
                >
                  <div
                    style={{
                      width: '45%',
                      position: 'sticky',
                      top: '0',
                    }}
                    className='flex tw-items-center tw-justify-center'
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '30rem',
                      }}
                    >
                      <Image
                        alt='receipt'
                        src={receipt.image_url}
                        fill
                        style={{
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{ width: '50%', gap: 10 }}
                    className='tw-w-2/3 flex tw-flex-col'
                  >
                    <div>
                      <span className='text-info'>Store name</span>
                      <TextField
                        disabled={isLoading}
                        name='merchant_name'
                        showRequiredLabel={false}
                      />
                    </div>
                    <div style={{ gap: 10 }} className='flex'>
                      <div className='tw-w-full'>
                        <span className='text-info'>Mall name</span>
                        <TextField
                          disabled={isLoading}
                          name='mall_name'
                          showRequiredLabel={false}
                        />
                      </div>
                      <div className='tw-w-full'>
                        <span className='text-info'>Unit number</span>
                        <TextField
                          disabled={isLoading}
                          name='unit_no'
                          showRequiredLabel={false}
                        />
                      </div>
                    </div>
                    <div>
                      <span className='text-info'>Store address</span>
                      <TextField
                        disabled={isLoading}
                        name='address'
                        showRequiredLabel={false}
                      />
                    </div>
                    <DateTimeInput isLoading={isLoading} />
                    <div>
                      <span className='text-info'>Receipt ID</span>
                      <TextField
                        disabled={isLoading}
                        name='receipt_no'
                        showRequiredLabel={false}
                      />
                    </div>
                    <div>
                      <span className='text-info'>Hashed receipt</span>
                      <TextField
                        disabled={isLoading}
                        name='hashed_receipt'
                        showRequiredLabel={false}
                      />
                    </div>
                    <div>
                      <span className='text-info'>Tax ID</span>
                      <TextField
                        disabled={isLoading}
                        name='tax_id'
                        showRequiredLabel={false}
                      />
                    </div>
                    <div>
                      <ReceiptItem isLoading={isLoading} />
                    </div>
                  </div>
                </div>
                <div className='flex gap-5'>
                  <Button
                    disabled={isLoading}
                    label='Save changes'
                    type='submit'
                    className='bg-primary-blue'
                  />
                  <Button
                    disabled={isLoading}
                    style={{ color: '#4318FF' }}
                    text
                    label='Cancel'
                    type='reset'
                    onClick={(e) => hide(e)}
                  />
                </div>
              </div>
            </FormController>
          </div>
        )}
      ></Dialog>
    </div>
  )
}

const ReceiptItem = ({ isLoading }: { isLoading: boolean }) => {
  const { control, watch } = useFormController<ReceiptFormValues>()
  const watchItem = watch('items')
  const currentTotalItem = watchItem.length
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })
  return (
    <>
      <div
        style={{
          borderTop: '3px solid #A3AED0',
          borderBottom: '3px solid #A3AED0',
        }}
        className='py-4'
      >
        <Grid
          templateColumns='2fr 1fr 1fr auto'
          gap={4}
          alignItems='center'
          mb={10}
        >
          <span className='font-bold'>Item</span>
          <span className='font-bold'>Qty</span>
          <span className='font-bold'>Price</span>
        </Grid>

        {fields.map((field, index) => (
          <Grid
            key={field.id}
            templateColumns='2fr 1fr 1fr auto'
            gap={10}
            alignItems='center'
            mb={2}
          >
            <TextField
              disabled={isLoading}
              name={`items.${index}.description`}
              showRequiredLabel={false}
              className='col-span-6'
            />
            <TextField
              type='number'
              disabled={isLoading}
              name={`items.${index}.quantity`}
              className='col-span-3'
              showRequiredLabel={false}
            />
            <TextField
              type='number'
              disabled={isLoading}
              name={`items.${index}.total_price`}
              className='col-span-3'
              showRequiredLabel={false}
            />
            <IconButton
              disabled={isLoading}
              className='tw-cursor-pointer'
              style={{
                border: 'none',
                color: '#4318FF',
                backgroundColor: 'transparent',
              }}
              icon={<CloseIcon />}
              aria-label='Remove item'
              onClick={() => remove(index)}
            />
          </Grid>
        ))}

        <Button
          type='button'
          disabled={isLoading}
          outlined
          style={{ marginTop: 10, color: '#4318FF' }}
          onClick={() =>
            append({ description: '', quantity: 1, total_price: '0' })
          }
        >
          Add item
        </Button>
      </div>
      <div
        style={{
          marginTop: 14,
          gap: 4,
          alignItems: 'baseline',
        }}
        className='flex'
      >
        <div className='font-bold tw-flex-1 '>Subtotal</div>
        <div style={{ gap: 10 }} className='flex'>
          <InputText
            style={{ maxWidth: 96 }}
            disabled={isLoading}
            className='tw-mt-2'
            value={currentTotalItem.toString()}
          />
          <Controller
            name='total'
            control={control}
            render={({
              field: { value, onChange, onBlur },
              fieldState: { error },
            }) => (
              <>
                <InputText
                  invalid={Boolean(error?.message)}
                  style={{ maxWidth: 96 }}
                  type='number'
                  className='tw-mt-2'
                  disabled={isLoading}
                  value={value}
                  onChange={(e) => {
                    onChange(e.target.value)
                  }}
                  onBlur={(e) => {
                    const val = e.target.value
                    const num = parseFloat(val)
                    if (val === '' || isNaN(num) || num < 0) {
                      onChange('0')
                    }
                    onBlur()
                  }}
                />
              </>
            )}
          />
        </div>
      </div>
      <div
        style={{
          marginTop: 16,
          borderBottom: '3px solid #A3AED0',
        }}
      />
    </>
  )
}

const DateTimeInput = ({ isLoading }: { isLoading: boolean }) => {
  const { control } = useFormController<ReceiptFormValues>()

  return (
    <div style={{ gap: 10 }} className='flex tw-flex-1'>
      <div className='tw-w-full flex tw-flex-col'>
        <span className='text-info'>Date</span>
        <Controller
          name='transaction_date'
          control={control}
          render={({ field: { value, onChange } }) => (
            <InputMask
              mask='9999-99-99'
              className='tw-mt-2'
              disabled={isLoading}
              placeholder='yyyy:mm:dd'
              value={value}
              onChange={(e) => {
                onChange(e.target.value)
              }}
            />
          )}
        />
      </div>
      <div className='tw-w-full flex tw-flex-col'>
        <span className='text-info'>Time</span>
        <Controller
          name='transaction_time'
          rules={{
            pattern: {
              value: /^([01]\d|2[0-3]):([0-5]\d)$/,
              message: 'Invalid time (HH:mm)',
            },
          }}
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <>
              <InputMask
                mask='99:99'
                className='tw-mt-2'
                disabled={isLoading}
                placeholder='HH:mm'
                value={value}
                onChange={(e) => {
                  onChange(e.target.value)
                }}
              />
              {error && (
                <p className='tw-mt-2 mb-0 text-danger'>{error?.message}</p>
              )}
            </>
          )}
        />
      </div>
    </div>
  )
}
