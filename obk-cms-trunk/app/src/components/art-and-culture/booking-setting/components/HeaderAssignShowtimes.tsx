import { Button } from 'primereact/button'
import { CSSProperties } from 'styled-components'

export const SubHeaderShowtimeModal = ({
  label,
  seq,
  styles,
}: {
  seq: number
  label: string
  styles?: CSSProperties
}) => (
  <div className='flex mb-5' style={{ alignItems: 'center', ...styles }}>
    <div
      style={{
        background: '#273281',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        lineHeight: '1',
        marginRight: '8px',
        fontSize: '20px',
      }}
    >
      {seq}
    </div>
    <h3 className='tw-text-[#273281] text-xl my-0'>{label}</h3>
  </div>
)

interface HeaderAssignShowtimesProps {
  onClickAddShowTime: () => void
  showtimeLength: number
  disableAddShowTime: boolean
}

export const HeaderAssignShowtimes = ({
  onClickAddShowTime,
  showtimeLength,
  disableAddShowTime,
}: HeaderAssignShowtimesProps) => {
  return (
    <>
      <SubHeaderShowtimeModal
        seq={2}
        label='Assign showtimes and set max tickets'
      />
      <div className='flex tw-justify-between tw-items-center '>
        <p className='tw-text-lg tw-text-[#273281] m-0'>
          {showtimeLength} showtimes per day
        </p>
        <Button
          type='button'
          text
          onClick={onClickAddShowTime}
          disabled={disableAddShowTime}
          className='text-primary-blue'
        >
          Add showtime
        </Button>
      </div>
      <p className='tw-text mb-5' style={{ fontSize: '0.7rem' }}>
        *Please enter the time in 24-hour format, without using AM/PM. For
        example 18:45.
      </p>
    </>
  )
}
