import DropdownField from '@components/forms/components/dropdown-field'
import { FormController } from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import Heading from '@components/typography/heading'
import { memberService } from '@src/services/member/service'
import {
  IPrivilegeItem,
  IPrivilege,
  RoleUpsertModel,
  IRoleUpsertModel,
} from '@src/services/role/model'
import { roleService } from '@src/services/role/service'
import { defaultToastMessage } from '@src/utils/default-toast'
import { useRouter } from 'next/router'
import { Accordion, AccordionTab } from 'primereact/accordion'
import { AutoComplete, AutoCompleteChangeEvent } from 'primereact/autocomplete'
import { Button } from 'primereact/button'
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox'
import { confirmDialog } from 'primereact/confirmdialog'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

type Props = {
  data?: IRoleUpsertModel
  privileges: IPrivilege[]
}

type Mode = 'CREATE' | 'EDIT'

export const RoleUpsert = (props: Props) => {
  const router = useRouter()
  const data = new RoleUpsertModel(props.data)
  const mode: Mode = !!data.rid ? 'EDIT' : 'CREATE'
  if (mode === 'CREATE') {
    data.status = 1
  }
  const [privileges, setPrivileges] = useState<IPrivilege[]>(props.privileges)
  const [filteredPrivilegeItems, setFilteredPrivileges] = useState<
    IPrivilegeItem[]
  >([])
  const [loading, setLoading] = useState(false)

  const activeOptions = [
    { name: 'Active', value: 1 },
    { name: 'Inactive', value: 0 },
  ]

  const selectedPrivilege = () =>
    privileges
      .map((x) =>
        x.privilegeItems.every((p) => p.isSelected)
          ? ([{ pid: x.pid, name: `All ${x.name} Access` }] as IPrivilegeItem[])
          : x.privilegeItems.filter((x) => x.isSelected)
      )
      .reduce((pre, cur) => pre.concat(...cur), [])

  const onPrivilegesChange = (e: CheckboxChangeEvent) => {
    let _privileges = [...privileges]
    _privileges
      .find((x) => x.pid === e.value.pid)!
      .privilegeItems.find((x) => x.ptid === e.value.ptid)!.isSelected =
      e.checked
    setPrivileges(_privileges)
  }

  const onSearchPrivilege = (e: { query: string }) => {
    let _selectedPrivileges: IPrivilegeItem[] = []

    if (!e.query.trim().length) {
      _selectedPrivileges = [
        ...privileges
          .map((x) => x.privilegeItems)
          .reduce((pre, cur) => pre.concat(cur))
          .filter((x) => !x.isSelected),
      ]
    } else {
      _selectedPrivileges = [
        ...privileges
          .map((x) => x.privilegeItems)
          .reduce((pre, cur) => pre.concat(cur))
          .filter(
            (x) =>
              !x.isSelected &&
              x.name.toLowerCase().startsWith(e.query.toLowerCase())
          ),
      ]
    }

    setFilteredPrivileges(_selectedPrivileges)
  }

  const onSearchPrivilegeChange = (e: AutoCompleteChangeEvent) => {
    const _selectedPrivilege = [...selectedPrivilege()]
    let _privileges = [...privileges]
    const isAdd =
      (e.value as IPrivilegeItem[]).length > _selectedPrivilege.length
    if (isAdd) {
      const itemAdd = (e.value as IPrivilegeItem[]).find(
        (x) => _selectedPrivilege.indexOf(x) === -1 && !!x.ptid
      )
      if (!itemAdd) return
      _privileges
        .find((x) => x.pid === itemAdd.pid)!
        .privilegeItems.find((x) => x.ptid === itemAdd.ptid)!.isSelected = true
    } else {
      const removeItem = _selectedPrivilege.find(
        (x) => (e.value as IPrivilegeItem[]).indexOf(x) === -1
      )
      if (!removeItem) return
      if (!removeItem?.ptid) {
        _privileges
          .find((x) => x.pid === removeItem.pid)
          ?.privilegeItems.forEach((x) => (x.isSelected = false))
      } else {
        _privileges
          .find((x) => x.pid === removeItem.pid)!
          .privilegeItems.find((x) => x.ptid === removeItem.ptid)!.isSelected =
          false
      }
    }
    setPrivileges(_privileges)
  }

  const onSelectAll = (e: CheckboxChangeEvent) => {
    e.stopPropagation()
    let _privileges = [...privileges]
    _privileges
      .find((x) => x.pid === e.value.pid)!
      .privilegeItems.forEach((x) => {
        x.isSelected = e.checked
      })
    setPrivileges(_privileges)
  }

  const onSubmit = async (data: RoleUpsertModel) => {
    let msgtitle =
      mode === 'CREATE'
        ? 'Are you sure you want to create new role?'
        : 'Are you sure you want to save changes?'
    confirmDialog({
      message: msgtitle,
      closable: false,
      style: { width: '500px' },
      contentClassName: 'flex justify-content-center font-semibold text-lg',
      footer: (option) => (
        <div className='flex justify-content-center gap-3'>
          <Button
            type='submit'
            label='Confirm'
            className='bg-primary-blue'
            onClick={async () => {
              setLoading(true)
              option.accept()
              data.privilegeItems = privileges
                .map((x) => x.privilegeItems.filter((p) => p.isSelected))
                .reduce((pre, cur) => pre.concat(...cur), [])
              const promise = roleService
                .upsert(data)
                .then(() => router.back())
                .finally(() => setLoading(false))
              toast.promise(promise, defaultToastMessage)
            }}
          />
          <Button
            className='text-primary-blue'
            label='Cancel'
            text
            onClick={option.reject}
          />
        </div>
      ),
    })
  }

  const onRemove = () => {
    if (!data.rid) return
    setLoading(true)
    memberService
      .getMembersByRole(data.rid)
      .then((res) => {
        confirmDialog({
          closable: false,
          draggable: false,
          style: { width: '575px' },
          contentClassName: 'flex justify-content-center font-semibold text-lg',
          message: (
            <>
              <div className='flex flex-column text-center text-2xl text-astronaut mb-3'>
                <span>Are you sure you want to removing</span>
                <span>
                  <span className='font-normal'>“{data.roleName}”&nbsp;</span>
                  role from the list
                </span>
              </div>
              <div className='flex text-gray-400 flex-column font-normal text-center text-sm mb-3'>
                <span>
                  These {res.data.length} member{res.data.length > 1 && 's'}{' '}
                  still assigned to this role.
                </span>
                <span>
                  Role will be removed from each member
                  {res.data.length > 1 && 's'} list once you remove the role
                  from the main role list.
                </span>
              </div>
              <div
                className='w-30rem border-1 border-round p-5 text-sm flex flex-column overflow-auto'
                style={{ borderColor: '#A3AED0', maxHeight: '500px' }}
              >
                {res.data.map((x, i) => (
                  <span key={i}>{x.email}</span>
                ))}
              </div>
            </>
          ),
          footer: ({ accept, reject }) => (
            <div className='flex justify-content-center gap-3'>
              <Button
                type='submit'
                label='Remove'
                severity='danger'
                onClick={() => {
                  setLoading(true)
                  accept()
                  roleService
                    .remove(data.rid!)
                    .then(() => router.back())
                    .finally(() => setLoading(false))
                }}
              />
              <Button
                className='text-primary-blue'
                label='Cancel'
                text
                onClick={reject}
              />
            </div>
          ),
        })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let _privileges = [...privileges]
    _privileges.forEach((privilege) => {
      privilege.privilegeItems.forEach((privilegeItem) => {
        if (data.privilegeItems?.some((x) => x.ptid === privilegeItem.ptid)) {
          privilegeItem.isSelected = true
        }
      })
    })
    setPrivileges(_privileges)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const privilegesHeaderTemplate = (privilege: IPrivilege) => (
    <div className='flex justify-content-start align-items-center'>
      <div className='w-3'>
        <span>{privilege.name}</span>
      </div>
      <div
        className='flex align-items-center my-2'
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          inputId={privilege.pid}
          name='privilegeItems'
          value={privilege}
          checked={privileges
            .find((x) => x.pid === privilege.pid)!
            .privilegeItems.every((x) => x.isSelected)}
          onChange={onSelectAll}
        />
        <label htmlFor={privilege.pid} className='ml-2'>
          All {privilege.name} Access
        </label>
      </div>
    </div>
  )

  const privilegesTemplate = (
    <Accordion multiple>
      {privileges.map((privilege, i) => (
        <AccordionTab key={i} header={privilegesHeaderTemplate(privilege)}>
          {privilege.privilegeItems.map((privilegeItem, j) => (
            <div key={j} className='flex align-items-center my-4'>
              <Checkbox
                inputId={privilegeItem.ptid}
                name='privilegeItem'
                value={privilegeItem}
                onChange={onPrivilegesChange}
                checked={privilegeItem.isSelected ?? false}
              />
              <label htmlFor={privilegeItem.ptid} className='ml-2'>
                {privilegeItem.name}
              </label>
            </div>
          ))}
        </AccordionTab>
      ))}
    </Accordion>
  )

  const buttonAction = (
    <div className='flex gap-3'>
      <Button
        type='submit'
        className='bg-primary-blue'
        loading={loading}
        label={mode === 'CREATE' ? 'Create new role' : 'Save changes'}
      />
      {mode === 'EDIT' && (
        <Button
          type='button'
          severity='danger'
          loading={loading}
          label='Remove role'
          onClick={onRemove}
          outlined
        />
      )}
      <Button
        type='button'
        className='text-primary-blue'
        label='Cancel changes'
        text
        onClick={() => router.back()}
      />
    </div>
  )

  return (
    <>
      <FormController defualtValue={data} onSubmit={onSubmit}>
        <div className='card'>
          <div className='flex justify-content-between mb-6'>
            <Heading as='h3' color='biscay'>
              Details
            </Heading>
            {buttonAction}
          </div>
          <div className='grid'>
            <div className='col-12 md:col-4'>
              <TextField
                disabled
                name='rid'
                label='Role ID'
                placeholder='Type role ID'
              />
            </div>
            <div className='col-12 md:col-4'>
              <DropdownField
                name='status'
                label='Status'
                options={activeOptions}
                optionLabel='name'
                optionValue='value'
                placeholder='Choose status'
                rules={{ required: 'Please select status' }}
              />
            </div>
            <div className='col-12 md:col-4'>
              <TextField
                name='roleName'
                label='Role name'
                placeholder='Type name'
                rules={{ required: 'Please enter name' }}
              />
            </div>
          </div>

          <Heading as='h3' color='biscay'>
            Privileges
          </Heading>
          <AutoComplete
            field='name'
            className='w-full mb-3'
            multiple
            value={selectedPrivilege()}
            suggestions={filteredPrivilegeItems}
            completeMethod={onSearchPrivilege}
            onChange={onSearchPrivilegeChange}
            placeholder='Search privileges'
          />
          <span className='text-xs'>
            If you want to create new privilege, please contact admin
          </span>
          {privilegesTemplate}
        </div>
        {buttonAction}
      </FormController>
    </>
  )
}
