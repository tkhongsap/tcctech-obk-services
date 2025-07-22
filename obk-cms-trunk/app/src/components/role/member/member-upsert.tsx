import DropdownField from '@components/forms/components/dropdown-field'
import { FormController } from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import Heading from '@components/typography/heading'
import {
  IMemberUpsertModel,
  MemberUpsertModel,
} from '@src/services/member/model'
import { memberService } from '@src/services/member/service'
import { IRole } from '@src/services/role/model'
import { useRouter } from 'next/router'
import { Button } from 'primereact/button'
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox'
import { confirmDialog } from 'primereact/confirmdialog'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { AutoComplete, AutoCompleteChangeEvent } from 'primereact/autocomplete'
import { Message } from 'primereact/message'
type Props = {
  data?: IMemberUpsertModel
  role: IRole[]
  csid: string
}
type Mode = 'CREATE' | 'EDIT'
type RoleSelect = IRole & { isSelected?: boolean }
export const MemberUpsert = (props: Props) => {
  const router = useRouter()
  const data = new MemberUpsertModel(props.data)
  const mode: Mode = !!data.mid ? 'EDIT' : 'CREATE'
  const [roles, setRoles] = useState<RoleSelect[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filteredRoleItem, setFilteredRoleItem] = useState<RoleSelect[]>([])
  const [emailError, setEmailError] = useState<string | null>(null)
  const [roleError, setRoleError] = useState<string | null>(null)

  const onResendInvite = () => {
    memberService.resendInviteCode(data.mid!).then(() => {
      toast.success('Success', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      router.push('/roles/member')
    })
  }

  //auto complete
  const selectedRole = () => roles.filter((x) => x.isSelected)

  const onRoleChange = (e: CheckboxChangeEvent) => {
    let _role = [...roles]
    _role.find((x) => x.rid === e.value)!.isSelected = e.checked
    setRoles(_role)
    console.log(roles)
  }

  const onSearchRole = (e: { query: string }) => {
    let _selectedRole: RoleSelect[] = []
    if (!e.query.trim().length) {
      _selectedRole = [...roles.filter((x) => !x.isSelected)]
    } else {
      _selectedRole = [
        ...roles.filter(
          (x) =>
            !x.isSelected &&
            x.name?.toLowerCase().startsWith(e.query.toLowerCase())
        ),
      ]
    }
    setFilteredRoleItem(_selectedRole)
  }

  const onSearchRoleChange = (e: AutoCompleteChangeEvent) => {
    const _selectedRole = selectedRole()
    let _roles = [...roles]
    const isAdd = (e.value as RoleSelect[]).length > _selectedRole.length
    if (isAdd) {
      const itemAdd = (e.value as RoleSelect[]).find(
        (x) => _selectedRole && !!x.rid
      )
      if (!itemAdd) return
      _roles.find((x) => x.rid === itemAdd.rid)!.isSelected = true
    } else {
      const removeItem = _selectedRole.find(
        (x) => (e.value as RoleSelect[]).indexOf(x) === -1
      )
      if (!removeItem) return
      if (!removeItem?.rid) {
        _roles.forEach((x) => (x.isSelected = false))
      } else {
        _roles.find((x) => x.rid === removeItem.rid)!.isSelected = false
      }
    }
    setRoles(_roles)
  }
  //end auto complete

  const onRemoveMember = async () => {
    confirmDialog({
      message:
        'Are you sure you want to delete this member from the assigned list?',
      closable: false,
      style: { width: '500px' },
      contentClassName: 'flex justify-content-center font-semibold text-lg',
      footer: (option) => (
        <div className='flex justify-content-center gap-3'>
          <Button
            loading={isLoading}
            type='submit'
            severity='danger'
            label='Delete Member'
            onClick={async () => {
              option.accept()
              data.status = 3
              data.isActive = false
              toast.promise(
                memberService.upsertMember(data).then(() => {
                  router.push('/roles/member')
                }),
                {
                  pending: 'loading',
                  success: 'Success',
                  error: 'Cannot Delete Member',
                }
              )
            }}
          />
          <Button
            severity='info'
            type='button'
            label='Cancle'
            outlined
            text
            onClick={option.reject}
          />
        </div>
      ),
    })
  }

  const onValidate = (data: MemberUpsertModel): boolean => {
    const emailPattern: RegExp =
      /[\w\.-]*[a-zA-Z0-9._%-]@[\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]/
    let isError = false
    if (data.email?.length === 0) {
      setEmailError(
        'Missing Fields: The required fields are empty or contain invalid data; please check your input.'
      )
      isError = true
    } else if (!emailPattern.test(data.email!)) {
      setEmailError(
        'Worng Email Format: The Email format is not valid please check your input.'
      )
      isError = true
    }

    if (!data.roleItem || data.roleItem.length === 0) {
      console.log(data.roleItem)
      console.log(roleError)
      setRoleError('Role cannot be null')
      isError = true
    }
    if (!isError) {
      setEmailError(null)
      setRoleError(null)
    }
    return isError
  }

  const onSubmit = async (data: MemberUpsertModel) => {
    setRoleError(null)
    setEmailError(null)
    data.roleItem = roles
      .filter((r) => r.isSelected)
      .map((x) => {
        return x.rid
      }) as string[]
    let errorValidate = onValidate(data)
    if (errorValidate) return
    if (mode == 'CREATE') {
      confirmDialog({
        message: 'Are you sure you want to invite this member?',
        closable: false,
        style: { width: '500px' },
        contentClassName: 'flex justify-content-center font-semibold text-lg',
        footer: (option) => (
          <div className='flex justify-content-center gap-3'>
            <Button
              type='submit'
              className='bg-primary-blue'
              label='Invite member'
              onClick={async () => {
                option.accept()
                data.roleItem = roles
                  .filter((r) => r.isSelected)
                  .map((x) => {
                    return x.rid
                  }) as string[]
                if (data.roleItem.length == 0) {
                  toast.error('Please Select Role', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  })
                  return
                }
                toast.promise(
                  memberService.upsert(data).then(() => {
                    router.push('/roles/member')
                  }),
                  {
                    pending: 'loading',
                    success: 'Invite Success',
                    error: 'This email is already in use',
                  }
                )
              }}
            />
            <Button
              loading={isLoading}
              className='text-gray-600'
              label='Cancel'
              text
              onClick={option.reject}
            />
          </div>
        ),
      })
    }
    if (mode == 'EDIT') {
      confirmDialog({
        message: 'Are you sure you want to save the changes?',
        closable: false,
        style: { width: '500px' },
        contentClassName: 'flex justify-content-center font-semibold text-lg',
        footer: (option) => (
          <div className='flex justify-content-center gap-3'>
            <Button
              loading={isLoading}
              type='submit'
              className='bg-primary-blue'
              label='Save changes'
              onClick={async () => {
                setIsLoading(true)
                try {
                  data.roleItem = roles
                    .filter((r) => r.isSelected)
                    .map((x) => {
                      return x.rid
                    }) as string[]
                  if (data.roleItem.length == 0) {
                    toast.error('Please Select Role', {
                      position: 'top-right',
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    })
                    return
                  }
                  await memberService.upsertEditRole(data)
                  router.push('/roles/member')
                  toast.success('Success', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  })
                  // router.push('roles/member')
                } catch (e: any) {
                  toast.error(`${e}`, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  })
                } finally {
                  setIsLoading(false)
                  option.accept()
                }
              }}
            />
            <Button
              loading={isLoading}
              className='text-gray-600'
              label='Cancel'
              text
              onClick={option.reject}
            />
          </div>
        ),
      })
    }
  }
  const statusOptions = () => {
    if (data.status === 1) {
      return [{ name: 'Pending', value: 1 }]
    } else {
      return [
        { name: 'Granted', value: 2 },
        { name: 'Suspended', value: 0 },
      ]
    }
  }

  const roleTemplate = (
    <>
      <div className='grid pt-4'>
        {roles.map((role, i) => (
          <div className='col-4' key={i} style={{ minWidth: '200px' }}>
            <div className='field-chebox '>
              <Checkbox
                inputId={role.rid}
                name={role.name}
                value={role.rid}
                onChange={onRoleChange}
                checked={role.isSelected ?? false}
                className={
                  roleError !== null && roleError.length !== 0
                    ? 'p-invalid'
                    : ''
                }
              />
              <label
                htmlFor={role.rid}
                className={
                  'ml-2 ' +
                  (roleError !== null && roleError.length !== 0
                    ? 'p-error'
                    : '')
                }
              >
                {role.name}
              </label>
            </div>
          </div>
        ))}
      </div>
    </>
  )
  const resendInvite = (
    <>
      {mode === 'EDIT' && data.status === 1 && (
        <div className='card'>
          <Heading as='h3' color='biscay'>
            Resend invitation
          </Heading>
          <Button
            type='button'
            className='bg-primary-blue'
            onClick={onResendInvite}
            label='Resend an invitation email'
          />
        </div>
      )}
    </>
  )
  const buttonAction = (
    <>
      <Button
        type='submit'
        className='bg-primary-blue'
        label={mode === 'CREATE' ? 'Invite a member' : 'Save changes'}
      />
      {mode === 'EDIT' && (
        <Button
          severity='danger'
          type='button'
          label='Delete member'
          outlined
          onClick={onRemoveMember}
        />
      )}
      <Button
        className='text-gray-600'
        label='Cancel changes'
        type='button'
        text
        onClick={() => router.push('/roles/member')}
      />
    </>
  )

  useEffect(() => {
    const _roles: RoleSelect[] = [
      ...props.role.map((x) => {
        const isSlected = data.roleItem?.some((r) => r === x.rid) ?? false
        return { ...x, isSelected: isSlected }
      }),
    ]
    setRoles(_roles)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRoleError, setEmailError])
  return (
    <>
      <FormController defualtValue={data} onSubmit={onSubmit}>
        <div className='flex gap-3 justify-content-end pb-4'>
          {buttonAction}
        </div>
        <div className='card'>
          <div className='flex justify-content-between mb-6'>
            {mode === 'CREATE' && (
              <Heading as='h3' color='biscay'>
                New member
              </Heading>
            )}
            {mode === 'EDIT' && (
              <Heading as='h3' color='biscay'>
                Edit Assigned member
              </Heading>
            )}
          </div>
          {mode == 'CREATE' && (
            <div className='grid'>
              {emailError !== null && emailError.length !== 0 && (
                <div className='col-12'>
                  <Message severity='error' text={emailError} />
                </div>
              )}
              <div className='col-12 md:col-6'>
                <TextField
                  className={emailError !== null ? 'p-invalid' : ''}
                  name='email'
                  label='Member’s  Email'
                  placeholder='Type Email'
                />
              </div>
            </div>
          )}
          {mode == 'EDIT' && (
            <div className='grid'>
              <div className='col-12 md:col-6'>
                <TextField
                  disabled
                  name='mid'
                  label='Member’s  ID'
                  placeholder='-'
                />
              </div>
              <div className='col-12 md:col-6'>
                <DropdownField
                  name='status'
                  label='Status'
                  options={statusOptions()}
                  optionLabel='name'
                  optionValue='value'
                  placeholder='Choose status'
                  rules={{ required: 'Please select status' }}
                  disabled={data.status === 1}
                />
              </div>
              <div className='col-12 md:col-6'>
                <TextField
                  disabled
                  name='email'
                  label='Member’s  Email'
                  placeholder='-'
                />
              </div>
              <div className='col-12 md:col-6'>
                <TextField
                  disabled
                  name='name'
                  label='Member’s  Name'
                  placeholder='-'
                />
              </div>
            </div>
          )}
          <Heading as='h3' color='biscay'>
            Assigned role
          </Heading>
          {/* {roleError !== null && roleError.length !== 0 && (
            <div className='pb-2'>
              <Message
                severity='error'
                text='Missing Fields: The required fields are empty or contain invalid data; please check your input.'
              />
            </div>
          )} */}
          <AutoComplete
            field='name'
            className={
              'w-full mb-3 ' +
              (roleError !== null && roleError.length !== 0 ? 'p-invalid' : '')
            }
            multiple
            value={selectedRole()}
            suggestions={filteredRoleItem}
            completeMethod={onSearchRole}
            onChange={onSearchRoleChange}
            placeholder='Search role'
          />
          <span className='text-xs'>
            If you want to create a new role or custom privilege, please go to
            role management.
          </span>
          <div className='grid'>{roleTemplate}</div>
        </div>
        {resendInvite}
        <div className='flex gap-3 justify-content-start pb-4'>
          {buttonAction}
        </div>
      </FormController>
    </>
  )
}
