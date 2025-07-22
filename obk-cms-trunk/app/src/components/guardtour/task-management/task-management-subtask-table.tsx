import {
  FormControllerRef,
  useFormController,
} from '@components/forms/components/form-controller'
import { Table } from '@components/table/Table'
import { useTranslate } from '@refinedev/core'
import {
  IActionList,
  VisibleDialog,
} from '@src/services/guardtour/activityprocedures/model'
import {
  IGetSubTask,
  UpsertTaskManagement,
} from '@src/services/guardtour/task-management/model'
import { Button } from 'primereact/button'
import { ColumnProps } from 'primereact/column'
import { Dialog } from 'primereact/dialog'
import { ForwardedRef, forwardRef, useImperativeHandle, useMemo } from 'react'
import { useFieldArray } from 'react-hook-form'

type Props = {
  actions: IActionList[]
  visibleDialog: VisibleDialog
  setVisibleDialog: React.Dispatch<React.SetStateAction<VisibleDialog>>
  formSubtaskRef: React.RefObject<FormControllerRef<IGetSubTask>>
  errorMessage?: string
  MODE: 'CREATE' | 'EDIT' | 'VIEW'
}

const TaskManagementSubtaskTableComponent = (
  props: Props,
  ref: ForwardedRef<{ upsertSubtask: () => Promise<boolean> | undefined }>
) => {
  const {
    actions,
    visibleDialog,
    setVisibleDialog,
    formSubtaskRef,
    errorMessage,
    MODE,
  } = props
  const translate = useTranslate()
  const { watch, control } = useFormController<UpsertTaskManagement>()
  const { append, remove, update } = useFieldArray<UpsertTaskManagement>({
    name: 'subtasks',
    control,
  })
  const watchSubtasks: IGetSubTask[] = watch('subtasks')
  const watchStatusId = watch('statusId')

  const showAddSubtask =
    (watchStatusId === '0' || MODE === 'CREATE') && MODE !== 'VIEW'

  const columns = useMemo<ColumnProps[]>(
    () => [
      {
        field: 'name',
        header: 'Sub Task Name',
        style: { minWidth: '100px' },
      },
      {
        field: 'actions',
        header: 'Action',
        style: { maxWidth: '300px', minWidth: '100px' },
        body: (data: IGetSubTask) => {
          const getAction = () => {
            return data.actionIds
              .map((a) => {
                return actions.find((x) => x.id === a)?.name
              })
              .join(', ')
          }
          return <span>{getAction()}</span>
        },
      },
      {
        id: 'actions',
        accessorKey: 'id',
        header: translate('table.actions'),
        style: { maxWidth: '100px' },
        frozen: true,
        alignFrozen: 'right',
        body: (data: IGetSubTask, opt) => {
          return (
            <div className='flex'>
              <a
                className='p-button p-component p-button-text font-bold cursor-pointer text-primary-blue'
                onClick={() => onUpsertSubtask(opt.rowIndex, data)}
              >
                Edit
              </a>
              <a
                className='p-button p-component p-button-text font-bold cursor-pointer text-primary-blue'
                onClick={() =>
                  setVisibleDialog({ deleteSubtaskIndex: opt.rowIndex })
                }
              >
                Delete
              </a>
            </div>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [translate, actions]
  )

  const onUpsertSubtask = (index: number, data?: IGetSubTask) => {
    if (index >= 0 && data) {
      const actionsValue =
        data.actionIds.map((x) => actions.find((a) => a.id === x)!) ?? []
      formSubtaskRef.current?.setValue('name', data.name)
      formSubtaskRef.current?.setValue(`actionIds`, actionsValue)
    } else {
      formSubtaskRef.current?.reset()
    }
    formSubtaskRef.current?.clearErrors()
    setVisibleDialog({ subtaskIndex: index })
  }

  useImperativeHandle(ref, () => ({
    upsertSubtask: () => {
      return formSubtaskRef.current?.trigger().then((isValid) => {
        if (isValid) {
          const value = formSubtaskRef.current?.getValues()

          const data: IGetSubTask = {
            name: value!.name!,
            actionIds: (value?.actionIds as IActionList[]).map(
              (x: IActionList) => x.id
            ),
            statusId: 0,
          }

          const index = visibleDialog.subtaskIndex
          if (index !== undefined && index >= 0) {
            update(index, data)
          } else {
            append(data)
          }
          setVisibleDialog({})
          return true
        }
        return false
      })
    },
  }))

  return (
    <>
      <div className='card'>
        <div className='flex mb-4 justify-content-between'>
          <h3 className='tw-text-2xl tw-text-[#1B2559] tw-font-bold m-0 h-auto'>
            {watchSubtasks.length > 1 ? 'Subtasks' : 'Subtask'}
          </h3>
          {showAddSubtask && (
            <>
              <Button
                className='px-3 text-primary-blue'
                type='button'
                label='Add Subtask'
                onClick={() => onUpsertSubtask(-1)}
                outlined
              />
            </>
          )}
        </div>
        <div>
          {errorMessage && <div className='text-red-500'>{errorMessage}</div>}
          <Table
            columns={columns}
            data={watchSubtasks}
            sortField='updatedAt'
            sortOrder={-1}
            paginator={false}
          />
        </div>
      </div>

      <Dialog
        draggable={false}
        blockScroll={true}
        visible={visibleDialog.deleteSubtaskIndex !== undefined}
        style={{ minWidth: '30vw' }}
        onHide={() => {
          setVisibleDialog({})
        }}
        modal
        content={({ hide }) => (
          <div className='flex flex-column bg-white p-5 border-round-lg'>
            <span className='font-bold'>
              Are you sure you want to delete this subtask?
            </span>
            <div className='flex gap-3 mt-5'>
              <Button
                className='bg-primary-blue'
                label='Confirm'
                onClick={() => {
                  if (
                    visibleDialog.deleteSubtaskIndex !== undefined &&
                    visibleDialog.deleteSubtaskIndex >= 0
                  ) {
                    remove(visibleDialog.deleteSubtaskIndex)
                    setVisibleDialog({})
                  }
                }}
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
    </>
  )
}

export const TaskManagementSubtaskTable = forwardRef(
  TaskManagementSubtaskTableComponent
)
