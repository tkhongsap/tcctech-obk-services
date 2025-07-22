import { useEffect, useState } from 'react'
import Heading from '@components/typography/heading'
import { Checkbox } from 'primereact/checkbox'
import { AutoComplete, AutoCompleteChangeEvent } from 'primereact/autocomplete'
import { differenceWith, flatMapDeep, isEqual } from 'lodash'
import { Button } from 'primereact/button'
import { useRouter } from 'next/router'
import { Accordion, AccordionTab } from 'primereact/accordion'
import TextField from '@components/forms/components/text-field'
import { FormController } from '@components/forms/components/form-controller'
import DropdownField from '@components/forms/components/dropdown-field'
import LabelValue from '@components/forms/utils/label-field'

interface Props {
  privileges: Privilege[]
  loading: boolean
  onSubmit: Function
}

export interface Privilege {
  id: string
  name: string
  permission: Permission[]
  value: boolean
}

export interface Permission {
  value: boolean
  id: string
  name: string
  groupId: string
}

interface IFormInput {
  status: string
  roleName: string
  privileges: string[]
}

const RoleUpsert = (props: Props) => {
  const { privileges, onSubmit } = props

  const defaultValues = {
    status: '',
    roleName: '',
    privileges: [],
  }

  const router = useRouter()

  const [privilegesForm, setPrivilegesForm] = useState<Privilege[]>([])
  const [filteredPrivileges, setFilteredPrivileges] = useState<Permission[]>([])

  useEffect(() => {
    return setPrivilegesForm(privileges)
  }, [privileges])

  const valueSearchPrivileges = () => {
    let arr = [
      ...flatMapDeep(privilegesForm, ({ permission, ...rest }) => [
        rest,
        ...permission.map((p) => ({ ...p, groupId: rest.id })),
      ]),
    ].filter((a) => a.value) as Permission[]

    arr = arr.filter((f) => !arr.some((s) => !s.groupId && f.groupId === s.id))
    return arr
  }

  const searchPrivileges = (event: { query: string }) => {
    const searchData = flatMapDeep(
      privilegesForm,
      ({ permission, ...rest }) => [
        rest,
        ...permission.map((p) => ({ ...p, groupId: rest.id })),
      ]
    ) as Permission[]

    let _filteredPrivileges = []

    if (!event.query.trim().length) {
      _filteredPrivileges = [...searchData]
    } else {
      _filteredPrivileges = searchData.filter(
        (p) =>
          p.name.toLowerCase().includes(event.query.toLowerCase()) && !p.value
      )
    }
    setFilteredPrivileges(_filteredPrivileges)
  }

  const setPrivilege = (
    groupId: string,
    permissionId: string | null,
    value: boolean
  ) => {
    let result = privilegesForm

    const groupIndex = result.findIndex((g) => g.id === groupId)
    const group = result[groupIndex]
    // if child permission update ?
    if (permissionId) {
      const permissions = group.permission

      const permissionIndex = permissions.findIndex(
        (p) => p.id === permissionId
      )

      // set permission value
      permissions[permissionIndex] = { ...permissions[permissionIndex], value }

      // child permission all checked ?
      group.value = permissions.every((p) => p.value)
    } else {
      // if group update
      group.value = value

      // set child permission
      group.permission.forEach((i) => {
        i.value = value
      })
    }

    setPrivilegesForm([...result])
    return
  }

  const onChangePrivileges = (e: AutoCompleteChangeEvent) => {
    e.value.forEach((v: { groupId: string; id: string }) =>
      setPrivilege(v.groupId || v.id, v.groupId ? v.id : null, true)
    )

    if (valueSearchPrivileges().length > e.value.length) {
      const diff = differenceWith(valueSearchPrivileges(), e.value, isEqual)
      diff.forEach((v) => {
        setPrivilege(v.groupId || v.id, v.groupId ? v.id : null, false)
      })
    }
  }

  const _onSubmit = (e: IFormInput) => {
    const values = {
      ...e,
      privileges: [...valueSearchPrivileges().map((e) => e.id)],
    }
    onSubmit(values)
  }

  const actionSection = (
    <div className='flex gap-2'>
      <Button type='submit'>Create new role</Button>

      <Button
        text
        onClick={() => {
          reset()
        }}
      >
        Cancel change
      </Button>
    </div>
  )

  function reset() {
    router.reload()
  }

  const privilegeSection = (
    <Accordion multiple className='mt-4'>
      {privilegesForm.map((pri) => {
        return (
          <AccordionTab
            key={pri.id}
            header={
              <div className='flex justify-content-between'>
                <div>{pri.name}</div>
                <div className='flex gap-2 align-items-center '>
                  <Checkbox
                    key={pri.id + pri.value}
                    inputId={pri.id}
                    checked={pri.value}
                    // onChange={(e) => onPrivilegeCheckboxChange(e)}
                    onChange={(e) => {
                      setPrivilege(pri.id, null, e.checked || false)
                      e.stopPropagation()
                    }}
                  />
                  <label className='font-normal' htmlFor={pri.id}>
                    All {pri?.name}
                  </label>
                </div>
              </div>
            }
          >
            <div className='permission mt-2'>
              {pri.permission.map((pms) => {
                return (
                  <div key={pri.id + pms.id} className='mt-2'>
                    <div className='flex gap-2'>
                      <Checkbox
                        inputId={pms.id}
                        // checked={pms?.value || false}
                        checked={pms.value}
                        onChange={(e) =>
                          setPrivilege(pri.id, pms.id, e.checked || false)
                        }
                        // onChange={(e) => onPrivilegeCheckboxChange(e)}
                      />
                      <label htmlFor={pms.id}>{pms?.name}</label>
                    </div>
                  </div>
                )
              })}
            </div>
          </AccordionTab>
        )
      })}
    </Accordion>
  )

  return (
    <FormController
      defualtValue={defaultValues}
      onSubmit={(e) => {
        _onSubmit(e)
      }}
    >
      <div className='card'>
        <div>
          <div className='flex justify-content-between gap-4'>
            <Heading as='h3' color='biscay'>
              Details
            </Heading>
            {actionSection}
          </div>

          <div className='flex gap-4 justify-content-center mt-4'>
            <div className='p-fluid'>
              <DropdownField
                name='status'
                label='Status'
                placeholder='Choose status'
                options={[
                  { name: 'Active', value: 'active' },
                  { name: 'InActive', value: 'inactive' },
                ]}
                optionLabel='name'
                optionValue='value'
                rules={{ required: 'Status is required' }}
              />
            </div>

            <div className='w-full p-fluid'>
              <TextField
                rules={{ required: 'Role name is required' }}
                label='Role name'
                name='roleName'
                placeholder='Enter role name'
              />
            </div>
          </div>

          <div className='mt-4 p-fluid'>
            <LabelValue htmlFor={'searchPrivilege'} label={'Privilege'}>
              <AutoComplete
                className=''
                id='searchPrivilege'
                field='name'
                placeholder='Search privileges'
                multiple
                value={valueSearchPrivileges()}
                suggestions={filteredPrivileges}
                completeMethod={searchPrivileges}
                onChange={(e) => onChangePrivileges(e)}
              />
            </LabelValue>
          </div>

          {privilegeSection}
        </div>
      </div>

      <div className='mt-4'>{actionSection}</div>
    </FormController>
  )
}

export default RoleUpsert
