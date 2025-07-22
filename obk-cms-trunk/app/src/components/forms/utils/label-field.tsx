import clsx from 'clsx'
import React from 'react'

type Props = {
  label?: string
  children: React.ReactNode
  htmlFor?: string
  className?: string
  labelClassName?: string
  isRequired?: boolean
  error?: boolean
  helperText?: string
}

const LabelField = (props: Props) => {
  const {
    label,
    children,
    className,
    labelClassName,
    isRequired,
    helperText,
    error,
  } = props

  return (
    <div className={className}>
      <label
        className={clsx(
          'font-bold',
          labelClassName,
          error ? 'tw-text-[#CD1A1A]' : 'text-primary-800'
        )}
        htmlFor={props.htmlFor}
      >
        {label}{' '}
        {isRequired && (
          <span
            className={clsx({
              'tw-text-[#CD1A1A]': error,
              'text-primary-800': !error,
            })}
          >
            *
          </span>
        )}
      </label>
      <div className='mt-2'>{children}</div>
      {helperText && (
        <div className='mt-2'>
          <span className=' tw-text-[#676B9B]'>{helperText}</span>
        </div>
      )}
    </div>
  )
}

export default LabelField
