import AutoCompleteField from '@components/forms/components/autocomplete-field'
import { useFormController } from '@components/forms/components/form-controller'
import TextField from '@components/forms/components/text-field'
import {
  IActionList,
  ICreatetActivityProcedures,
  IGetSubTask,
} from '@src/services/guardtour/activityprocedures/model'
import { uniqBy } from 'lodash'
import { AutoCompleteCompleteEvent } from 'primereact/autocomplete'
import { Button } from 'primereact/button'
import { useState } from 'react'
import { useFieldArray } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  actionsTag: IActionList[]
}

export const ActivityProceduresActivity = (props: Props) => {
  const { actionsTag } = props
  const { watch, control } = useFormController<ICreatetActivityProcedures>()
  const { append, remove, update } = useFieldArray<ICreatetActivityProcedures>({
    name: 'subtaskActions',
    control,
  })
  const watchData: IGetSubTask[] = watch('subtaskActions')

  const [filterActions, setFilterActions] = useState<IActionList[]>([])

  const search = (event: AutoCompleteCompleteEvent, index: number) => {
    setTimeout(() => {
      let _filterActions: IActionList[] = []

      if (!event.query.trim().length) {
        _filterActions = [...actionsTag]
      } else {
        const filtered = actionsTag.filter((actions) =>
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

      _filterActions = _filterActions.filter(
        (x) =>
          !(watchData[index].actions as IActionList[]).find(
            (y) => y.id === x.id
          )
      )

      setFilterActions(_filterActions)
    }, 250)
  }

  const onRemoveActivity = (index: number) => {
    remove(index)
  }

  return (
    <>
      {watchData &&
        watchData.map((act, index) => (
          <div key={act.id} className='formgrid grid mb-3'>
            <div className='field col-12 md:col-4'>
              <TextField
                label='Sub Task Name'
                rules={{ required: 'Sub Task Name is required.' }}
                name={`subtaskActions.${index}.name`}
                onChange={(e) => {
                  const activity = watchData[index]
                  activity.name = e.target.value
                  update(index, activity)
                }}
              />
            </div>
            <div className='field col-12 md:col-7 p-fluid'>
              <AutoCompleteField
                name={`subtaskActions.${index}.actions`}
                label='Actions'
                multiple
                dropdown
                field='name'
                suggestions={uniqBy(filterActions, 'id')}
                completeMethod={(e) => search(e, index)}
                rules={{ required: 'Actions are required.' }}
              />
            </div>
            <div
              className='field col-12 md:col-1 flex flex-column justify-content-center'
              style={{ marginTop: 'auto' }}
            >
              {index !== 0 && (
                <Button
                  className='px-2 text-red-600'
                  icon='pi pi-trash'
                  type='button'
                  onClick={() => onRemoveActivity(index)}
                  tooltip='Delete Sub Task'
                  tooltipOptions={{ position: 'top' }}
                  disabled={index === 0}
                  outlined
                />
              )}
            </div>
          </div>
        ))}

      <div className='formgrid grid'>
        <Button
          className='px-3 text-primary-blue w-full'
          type='button'
          label='Add New Sub Task'
          onClick={() => append({ name: '', actions: [], id: uuidv4() })}
          outlined
        />
      </div>
    </>
  )
}
