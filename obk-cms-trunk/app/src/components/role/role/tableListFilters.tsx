import { useRouter } from 'next/router'
import { useState } from 'react'
import mapValues from 'lodash/mapValues'
import defaultsDeep from 'lodash/defaultsDeep'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'

const defaultFilter = {
  search: {
    value: '',
  },
  privilege: {
    value: '',
  },
}

export const GenericFilterPane = (props: any) => {
  const [filter, setFilter] = useState(defaultFilter)
  const { onFilter } = props
  const router = useRouter()

  const dispatchFilter = (filterItems: any) => {
    router.push({
      pathname: router.pathname,
      query: mapValues(filterItems, 'value'),
    })

    if (onFilter) {
      onFilter(filterItems)
    }
  }

  const setfilterByInput = (name: string, value: string) => {
    const newValue = defaultsDeep({ [name]: { value } }, filter)
    setFilter(newValue)
    dispatchFilter(newValue)
  }

  const privilege = [
    { name: 'All', value: '' },
    {
      name: 'Edit News and Update Section',
      value: 'Edit News and Update Section',
    },
    { name: 'Opperation Admin', value: 'Opperation Admin' },
    { name: 'Marketing Admin', value: 'Marketing Admin' },
  ]

  return (
    <>
      <div className='flex gap-2 flex-wrap'>
        <div className='p-input-icon-left'>
          <i className='pi pi-search' />
          <InputText
            name='search'
            style={{
              paddingLeft: '40px',
              height: '50px', // TODO: fixed input height is bug when use with icon wrap
              width: '230px',
            }}
            placeholder='ID, Team, Role, Priviledge'
            onChange={({ target: { value, name } }) =>
              setfilterByInput(name, value)
            }
          />
        </div>

        <Dropdown
          onChange={({ target: { value, name } }) =>
            setfilterByInput(name, value)
          }
          name='privilege'
          options={privilege}
          optionLabel='name'
          optionValue='value'
          placeholder='Privilege'
          className='w-full md:w-14rem'
          value={filter.privilege.value}
        />
      </div>
    </>
  )
}

export default GenericFilterPane
