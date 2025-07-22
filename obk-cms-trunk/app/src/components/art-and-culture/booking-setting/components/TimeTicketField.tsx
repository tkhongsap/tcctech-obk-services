import styled from '@emotion/styled'
import { isEmpty } from 'lodash'
import { InputText } from 'primereact/inputtext'
import { Nullable } from 'primereact/ts-helpers'
import { useCallback, useEffect, useMemo, useState } from 'react'
import React from 'react'
import { EnumBookingTimeStatus } from '../utils/constants'

export interface IShowtimeItem {
  id: string | null
  startHH: string | null
  startMM: string | null
  endHH: string | null
  endMM: string | null
  maxTicket: string | null
  status: EnumBookingTimeStatus
  booked: boolean
}

export const defaultShowtimeItem: IShowtimeItem = {
  id: null,
  startHH: null,
  startMM: null,
  endHH: null,
  endMM: null,
  maxTicket: null,
  status: EnumBookingTimeStatus.waiting,
  booked: false,
}

const Container = styled.div<{ ['has-error-message']?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  padding-bottom: ${(props) =>
    isEmpty(props['has-error-message']) ? '0px' : '20px'};
`

const SpaceSection = styled.div`
  font-size: 16px;
  margin: 0px 4px;
`

const UntilSpacing = styled.div`
  font-size: 16px;
  margin: 0px 12px;
`

const CustomInputText = styled(InputText)`
  width: 75px;
`

const ErrorMessage = styled('div')`
  position: absolute;
  left: 0;
  bottom: 0;
  color: #cd1a1a;
`

interface TimeTicketFieldProps {
  showtimeItem: IShowtimeItem
  upperShowtimeItem?: IShowtimeItem
  disabled?: boolean
  onChange: (values: IShowtimeItem) => void
  onInvalid: (isValid: boolean) => void
}

export function TimeTicketField({
  showtimeItem,
  upperShowtimeItem,
  disabled = false,

  onChange,
  onInvalid,
}: TimeTicketFieldProps) {
  const [values, setValues] = useState(showtimeItem)

  const handleFieldChange = (
    key: keyof IShowtimeItem,
    value: Nullable<string>,
    min: number = 0,
    max: number
  ) => {
    if (isEmpty(value) || value === null) {
      setValues({ ...values, [key]: null })
    } else if (Number(value) > max) {
      setValues({ ...values, [key]: max.toString() })
    } else if (Number(value) < min) {
      setValues({ ...values, [key]: min.toString() })
    } else {
      setValues({ ...values, [key]: value })
    }
  }

  const handleBlur = useCallback(
    (key: keyof IShowtimeItem) => {
      if (values[key] && key !== 'booked')
        setValues({ ...values, [key]: values[key]?.padStart(2, '0') })
    },
    [values]
  )

  const isInvalid = useMemo(() => {
    if (isEmpty(values.startHH) || isEmpty(values.endHH)) return undefined
    if (Number(values.startHH) === Number(values.endHH)) {
      if (isEmpty(values.startMM) || isEmpty(values.endMM)) return undefined
      if (Number(values.startMM) >= Number(values.endMM))
        return '* กรุณาใส่เวลาให้ถูกต้อง'
    }
    if (Number(values.startHH) > Number(values.endHH))
      return '* กรุณาใส่เวลาให้ถูกต้อง'

    if (upperShowtimeItem) {
      if (
        isEmpty(upperShowtimeItem.startHH) ||
        isEmpty(upperShowtimeItem.endHH)
      )
        return undefined
      if (Number(values.startHH) < Number(upperShowtimeItem.endHH))
        return '* กรุณาใส่เวลาให้มากกว่าเวลาด้านบน'
      else if (Number(values.startHH) === Number(upperShowtimeItem.endHH)) {
        if (
          isEmpty(upperShowtimeItem.startMM) ||
          isEmpty(upperShowtimeItem.endMM)
        )
          return undefined
        if (Number(values.startMM) < Number(upperShowtimeItem.endMM))
          return '* กรุณาใส่เวลาให้มากกว่าเวลาด้านบน'
      }
    }
  }, [
    upperShowtimeItem,
    values.endHH,
    values.endMM,
    values.startHH,
    values.startMM,
  ])

  useEffect(() => {
    onChange(values)
  }, [onChange, values])

  useEffect(() => {
    onInvalid(!isInvalid)
  }, [isInvalid, onInvalid])

  return (
    <>
      <Container has-error-message={isInvalid}>
        <CustomInputText
          type='number'
          placeholder='hh'
          onChange={(e) => handleFieldChange('startHH', e.target.value, 0, 23)}
          style={{ width: '75px' }}
          maxLength={2}
          minLength={0}
          value={values.startHH || undefined}
          onBlur={() => handleBlur('startHH')}
          disabled={disabled}
        />
        <SpaceSection>:</SpaceSection>
        <CustomInputText
          type='number'
          placeholder='mm'
          onChange={(e) => handleFieldChange('startMM', e.target.value, 0, 59)}
          style={{ width: '75px' }}
          maxLength={2}
          minLength={0}
          value={values.startMM || undefined}
          onBlur={() => handleBlur('startMM')}
          disabled={disabled}
        />
        <UntilSpacing>-</UntilSpacing>
        <CustomInputText
          type='number'
          placeholder='hh'
          onChange={(e) => handleFieldChange('endHH', e.target.value, 0, 23)}
          style={{ width: '75px' }}
          maxLength={2}
          minLength={0}
          value={values.endHH || undefined}
          onBlur={() => handleBlur('endHH')}
          disabled={disabled}
        />
        <SpaceSection>:</SpaceSection>
        <CustomInputText
          type='number'
          placeholder='mm'
          onChange={(e) => handleFieldChange('endMM', e.target.value, 0, 59)}
          style={{ width: '75px' }}
          maxLength={2}
          minLength={0}
          value={values.endMM || undefined}
          onBlur={() => handleBlur('endMM')}
          disabled={disabled}
        />
        <div
          className='mx-4'
          style={{ width: '1px', height: '100%', backgroundColor: '#D9D9D9' }}
        ></div>

        <CustomInputText
          placeholder='Max tickets'
          onChange={(e) =>
            handleFieldChange('maxTicket', e.target.value, 0, 999)
          }
          style={{ width: '115px' }}
          type='number'
          value={values.maxTicket || undefined}
          onBlur={() => handleBlur('maxTicket')}
          maxLength={3}
          minLength={0}
          disabled={disabled}
        />
        <ErrorMessage>{isInvalid}</ErrorMessage>
      </Container>
    </>
  )
}
