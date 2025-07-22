import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { ReactNode } from 'react'
import { NotificationMessageBlock } from '../types/notification'
import { classNames } from 'primereact/utils'

type Props = {
  value: NotificationMessageBlock
  onChange?(event: DropdownChangeEvent): void
  onRemove?(): void
  index: number
  displayIndex: number
  children: ReactNode
}

export default function BlockItem(props: Props) {
  const block = [
    { name: 'Image', value: 'image' },
    { name: 'Hyperlink', value: 'hyperlink' },
    { name: 'Text', value: 'text' },
  ]

  const { index, children, onChange, onRemove, value, displayIndex } = props
  return (
    <div
      className={classNames('flex flex-column gap-1 w-full', {
        'p-3': index >= 0,
      })}
      style={{ background: index >= 0 ? '#F6F6F6' : 'white' }}
    >
      <div className='flex justify-content-between'>
        <span className='flex text-xl font-bold text-primary-800'>
          Block {displayIndex}
        </span>
        {onRemove && (
          <i className='pi pi-times cursor-pointer' onClick={onRemove}></i>
        )}
      </div>
      {onChange && (
        <div className='flex flex-column gap-1 w-4'>
          <label htmlFor='block' className='text-primary-800'>
            basic block
          </label>
          <Dropdown
            value={value.type}
            options={block}
            optionLabel='name'
            placeholder='Select block type'
            className='w-full'
            onChange={onChange}
          />
        </div>
      )}
      {children}
    </div>
  )
}
