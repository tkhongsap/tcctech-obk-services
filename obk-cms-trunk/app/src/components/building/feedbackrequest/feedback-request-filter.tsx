import { useState } from 'react'
import { Calendar } from 'primereact/calendar'
import { MultiSelect } from 'primereact/multiselect'
import { Dropdown } from 'primereact/dropdown'
import { Badge } from 'primereact/badge'
import { InputText } from 'primereact/inputtext'
import { Subject } from 'rxjs'
import { Button } from 'primereact/button'
import {
  FilterFeedbackRequest,
  IFilterFeedbackRequest,
} from './types/feedback-request'

interface IDropdownIssue {
  name: string
  id: string
  severity: 'success' | 'warning' | 'info' | 'danger' | null | undefined
}

const locations = [
  'Location1',
  'Location2',
  'Location3',
  'Location4',
  'Location5',
]

const problemTypes = ['All', 'Type1', 'Type2', 'Type3', 'Type4', 'Other']

const issues = ['All', 'Issue1', 'Issue2', 'Issue3', 'Issue4', 'Issue5']

const statuses: IDropdownIssue[] = [
  { name: 'New', id: '1', severity: 'success' },
  { name: 'Closed', id: '2', severity: 'warning' },
  { name: 'Link to Work Order', id: '3', severity: 'info' },
]

export const FeedbackRequestFilter = (props: {
  onFilter?: any
  onFilter$?: Subject<IFilterFeedbackRequest>
}) => {
  const [filter, setFilter] = useState<IFilterFeedbackRequest>(
    new FilterFeedbackRequest(null)
  )
  const { onFilter$ } = props

  const statusOptionTemplate = (option: IDropdownIssue) => {
    return (
      <div className='flex align-items-center'>
        <Badge value={option.name} severity={option.severity}></Badge>
      </div>
    )
  }

  const selectedStatusOptionTemplate = (option: IDropdownIssue, props: any) => {
    if (option) {
      return (
        <div className='flex align-items-center'>
          <Badge value={option.name} severity={option.severity}></Badge>
        </div>
      )
    }

    return <span>{props.placeholder}</span>
  }

  const onChange = async (e: { value: any; target: { name: string } }) => {
    const oldValue = structuredClone(filter) as any
    oldValue[e.target.name] = e.value
    setFilter(oldValue)
    // const value = e?.target?.value || ''
    // setFilter((prev) => {
    //   // const newValue = { ...prev, [e.target.name]: { value } }
    //   const newValue = defaultsDeep({ [e.target.name]: { value } }, prev)
    //   dispatchFilter(newValue)
    //   return newValue
    // })
  }

  const onSearch = async () => {
    onFilter$?.next(filter)
  }

  return (
    <div className='grid w-full'>
      <div className='col-12 md:col-6 lg:col-2'>
        <Calendar
          name='datetime'
          value={filter.datetime}
          onChange={onChange}
          showIcon
          placeholder='date'
          className='w-full'
        />
      </div>
      <div className='col-12 md:col-6 lg:col-2'>
        <MultiSelect
          name='location'
          value={filter.location}
          onChange={onChange}
          options={locations}
          placeholder='Location'
          maxSelectedLabels={3}
          className='w-full'
        />
      </div>
      <div className='col-12 md:col-6 lg:col-2'>
        <Dropdown
          name='problemtype'
          value={filter.problemtype}
          onChange={onChange}
          options={problemTypes}
          placeholder='Problem Type'
          className='w-full'
        />
      </div>
      <div className='col-12 md:col-6 lg:col-2'>
        <Dropdown
          name='issue'
          value={filter.issue}
          onChange={onChange}
          options={issues}
          placeholder='Issue'
          className='w-full'
        />
      </div>
      <div className='col-12 md:col-6 lg:col-2'>
        <Dropdown
          name='status'
          value={filter.status}
          onChange={onChange}
          options={statuses}
          optionLabel='name'
          placeholder='Status'
          valueTemplate={selectedStatusOptionTemplate}
          itemTemplate={statusOptionTemplate}
          className='w-full'
        />
      </div>
      <div className='col-12 md:col-6 lg:col-2'>
        <InputText
          name='keyword'
          placeholder='Enter keyword'
          className='w-full'
        />
      </div>
      <div className='col-4 flex gap-2'>
        <Button
          className='bg-gray-900 border-gray-900 text-gray-50'
          onClick={onSearch}
        >
          Search
        </Button>
        <Button className='bg-gray-50 border-gray-900 text-gray-600'>
          Clear
        </Button>
      </div>
    </div>
  )
}

export default FeedbackRequestFilter
