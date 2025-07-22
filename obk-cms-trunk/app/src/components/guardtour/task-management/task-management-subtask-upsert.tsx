import AutoCompleteField from '@components/forms/components/autocomplete-field'
import {
  FormController,
  FormControllerRef,
} from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import {
  IActionList,
  VisibleDialog,
} from '@src/services/guardtour/activityprocedures/model'
import { IGetSubTask } from '@src/services/guardtour/task-management/model'
import { uniqBy } from 'lodash'
import { AutoCompleteCompleteEvent } from 'primereact/autocomplete'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { useState } from 'react'

type Props = {
  actions: IActionList[]
  formSubtaskRef: React.RefObject<FormControllerRef<IGetSubTask>>
  visibleDialog: VisibleDialog
  setVisibleDialog: React.Dispatch<React.SetStateAction<VisibleDialog>>
  onSubmitCallBack: () => void
}
export const TaskManagementSubtaskUpsert = (props: Props) => {
  const {
    actions,
    formSubtaskRef,
    visibleDialog,
    setVisibleDialog,
    onSubmitCallBack,
  } = props
  const [filterActions, setFilterActions] = useState<IActionList[]>([])

  const search = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filterActions: IActionList[] = []

      if (!event.query.trim().length) {
        _filterActions = [...actions]
      } else {
        const filtered = actions.filter((actions) =>
          actions.name.toLowerCase().includes(event.query.toLowerCase())
        )

        const uniqueNames = new Set()
        _filterActions = filtered.filter((action) => {
          if (uniqueNames.has(action.name)) {
            return false
          }
          uniqueNames.add(action.name)
          return true
        })
      }

      const value = formSubtaskRef.current?.getValues()
      _filterActions = _filterActions.filter(
        (x) => !(value?.actionIds as IActionList[]).find((y) => y.id === x.id)
      )

      setFilterActions(_filterActions)
    }, 250)
  }

  return (
    <FormController
      defualtValue={{ name: '', statusId: 0, actionIds: [] }}
      ref={formSubtaskRef}
      onSubmit={() => {}}
    >
      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visibleDialog?.subtaskIndex !== undefined}
        style={{ minWidth: '30vw', maxWidth: '50vw' }}
        onHide={() => {
          setVisibleDialog({ subtaskIndex: undefined })
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <div className='flex text-xl tw-text-[#2B3674] font-bold mb-5 p-0'>
              {visibleDialog!.subtaskIndex! > 0
                ? 'Edit Sub Task'
                : 'Create New Sub Task'}
            </div>
            <div className='formgrid grid mb-3 p-2'>
              <div className='w-full'>
                <TextField
                  label='Sub Task Name'
                  name='name'
                  rules={{ required: 'Sub Task Name is required.' }}
                />
              </div>
            </div>
            <div className='formgrid grid p-2'>
              <div className='w-full'>
                <AutoCompleteField
                  field='name'
                  name='actionIds'
                  label='Actions'
                  multiple
                  dropdown
                  suggestions={uniqBy(filterActions, 'id')}
                  completeMethod={search}
                  rules={{ required: 'At least one action is required.' }}
                />
              </div>
            </div>
            <div className='flex gap-3 mt-5'>
              <Button
                className='bg-primary-blue'
                label='Confirm'
                onClick={onSubmitCallBack}
              />
              <Button
                className='text-primary-blue'
                onClick={(e) => hide(e)}
                label='Cancel'
                outlined
              />
            </div>
          </div>
        )}
      ></Dialog>
    </FormController>
  )
}
