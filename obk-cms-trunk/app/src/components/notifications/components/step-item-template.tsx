import { classNames } from 'primereact/utils'

type Props = {
  activeIndex: number
  index: number
}

export default function StepItemTemplate(props: Props) {
  const { activeIndex, index } = props

  return (
    <span
      className={classNames(
        'inline-flex align-items-center justify-content-center align-items-center border-circle h-2rem w-2rem z-1 cursor-pointer text-white',
        {
          'bg-primary-blue': activeIndex === index,
          'bg-green': activeIndex > index,
          'bg-echo-blue': activeIndex < index,
        }
      )}
      style={{
        marginTop: '-25px',
      }}
    >
      {activeIndex > index ? (
        <i className='pi pi-check text-white' />
      ) : (
        <span>{index + 1}</span>
      )}
    </span>
  )
}
