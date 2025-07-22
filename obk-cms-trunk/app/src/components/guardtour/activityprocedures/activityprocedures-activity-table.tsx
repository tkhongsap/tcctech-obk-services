import {
  FormControllerRef,
  useFormController,
} from '@components/forms/components/form-controller'
import { Table } from '@components/table/Table'
import { useTranslate } from '@refinedev/core'
import {
  IActionList,
  IEditActivityProcedures,
  IGetSubTask,
  VisibleDialog,
} from '@src/services/guardtour/activityprocedures/model'
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
}

const ActivityProceduresActivityTableComponent = (
  props: Props,
  ref: ForwardedRef<{ upsertSubtask: () => void }>
) => {
  const { actions, visibleDialog, setVisibleDialog, formSubtaskRef } = props
  const translate = useTranslate()
  const { watch, control } = useFormController<IEditActivityProcedures>()
  const { append, remove, update } = useFieldArray<IEditActivityProcedures>({
    name: 'subtaskActions',
    control,
  })
  const watchSubtasks: IGetSubTask[] = watch('subtaskActions')

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
            return data.actions
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
        data.actions.map((x) => actions.find((a) => a.id === x)!) ?? []
      formSubtaskRef.current?.setValue('name', data.name)
      formSubtaskRef.current?.setValue(`actions`, actionsValue)
    } else {
      formSubtaskRef.current?.reset()
    }
    formSubtaskRef.current?.clearErrors()
    setVisibleDialog({ subtaskIndex: index })
  }

  useImperativeHandle(ref, () => ({
    upsertSubtask: () => {
      formSubtaskRef.current?.trigger().then((isValid) => {
        if (isValid) {
          const value = formSubtaskRef.current?.getValues()

          const data: IGetSubTask = {
            name: value!.name!,
            actions: (value?.actions as IActionList[]).map(
              (x: IActionList) => x.id
            ),
          }

          const index = visibleDialog.subtaskIndex
          if (index !== undefined && index >= 0) {
            update(index, data)
          } else {
            append(data)
          }

          setVisibleDialog({})
        }
      })
    },
  }))

  return (
    <>
      <div className='card'>
        <div>
          <div className='flex mb-4 justify-content-between'>
            <h3 className='tw-text-2xl tw-text-[#1B2559] tw-font-bold m-0 h-auto'>
              All Sub Task
            </h3>
            <Button
              className='px-3 text-primary-blue'
              type='button'
              label='Add new sub task'
              outlined
              onClick={() => onUpsertSubtask(-1)}
            />
          </div>
          <div>
            <Table
              columns={columns}
              data={watchSubtasks}
              rows={100}
              sortField='updatedAt'
              sortOrder={-1}
              paginator={false}
            />
          </div>
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
              Are you sure you want to delete this item?
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

export const ActivityProceduresActivityTable = forwardRef(
  ActivityProceduresActivityTableComponent
)
