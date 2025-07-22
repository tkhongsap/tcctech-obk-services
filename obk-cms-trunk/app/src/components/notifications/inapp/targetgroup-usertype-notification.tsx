import { KeyValue } from '@src/types/key-value'
import { Button } from 'primereact/button'
import { SelectUserTypeNotification } from './target-group/select-user-type'
import { useFormController } from '@components/forms/components/form-controller'
import { targetGroupByUserType } from '../types/notification'
import { useCallback, useEffect } from 'react'
import { RadioButtonChangeEvent } from 'primereact/radiobutton'
import { isEmpty } from 'lodash'

type Props = {
  towers?: KeyValue[]
  floors?: { name: string; value: string; towerId: string }[]
  disabled?: boolean
  setUserTypeData: React.Dispatch<React.SetStateAction<targetGroupByUserType[]>>
  userTypeData: targetGroupByUserType[]
  updateUserTypeData(
    index: number,
    updates: Partial<targetGroupByUserType>
  ): void
  watchTargetGroupDetails?:
    | {
        name: string
        account_id_group: string[]
        detail: File
        targetGroupByUserType: targetGroupByUserType[]
      }
    | undefined
  handleTargetChange(e?: RadioButtonChangeEvent, index?: number): void
  selectedTarget?: string
}

export const SelectUserTypeTargetGroupNotification = (props: Props) => {
  const {
    towers,
    floors,
    disabled,
    setUserTypeData,
    userTypeData,
    watchTargetGroupDetails,
    handleTargetChange,
    selectedTarget,
    updateUserTypeData,
  } = props
  const { clearErrors, setValue } = useFormController()

  const sortedFloors = (floors?: { name: string; value: string }[]) => {
    return floors?.sort((a, b) => {
      const regex = /^([A-Za-z]*)(\d+)$/

      const matchA = a.name.match(regex)
      const matchB = b.name.match(regex)

      if (matchA && matchB) {
        const prefixA = matchA[1]
        const numberA = parseInt(matchA[2], 10)
        const prefixB = matchB[1]
        const numberB = parseInt(matchB[2], 10)

        if (prefixA < prefixB) return -1
        if (prefixA > prefixB) return 1

        return numberA - numberB
      }

      if (matchA && !matchB) return -1
      if (!matchA && matchB) return 1

      const floorA = parseInt(a.name, 10)
      const floorB = parseInt(b.name, 10)

      if (!isNaN(floorA) && !isNaN(floorB)) {
        return floorA - floorB
      }

      return a.name.localeCompare(b.name)
    })
  }

  const filterFloorsByTower = useCallback((towerId?: string) => {
    if (!towerId) {
      return []
    }

    const filteredFloors = floors?.filter((floor) => floor.towerId === towerId)

    const floorValue = filteredFloors?.map((item) => ({
      name: item.name,
      value: item.value,
    }))

    return sortedFloors(floorValue)
  }, [])

  const getAvailableTowerOptions = (currentIndex: number) => {
    const selectedTowers = userTypeData
      .filter((_, index) => index !== currentIndex)
      .map((item) => {
        return item.tower
      })

    const currentSelectedTower = userTypeData[currentIndex]?.tower

    if (currentSelectedTower) {
      return towers?.filter((option) => option.value === currentSelectedTower)
    }

    return towers?.filter((option) => !selectedTowers.includes(option.value))
  }

  useEffect(() => {
    const updateAllTowerOptions = () => {
      userTypeData.forEach((_, index) => {
        const availableTowers = getAvailableTowerOptions(index)
        const currentOptions = userTypeData[index].towerOptions
        if (
          JSON.stringify(availableTowers) !== JSON.stringify(currentOptions)
        ) {
          updateUserTypeData(index, { towerOptions: availableTowers })
          const selectedTower = userTypeData[index].tower

          if (!selectedTower) {
            updateUserTypeData(index, { floorOptions: [] })
          } else {
            const floors = filterFloorsByTower(selectedTower)
            updateUserTypeData(index, { floorOptions: floors })
          }
        }
      })
    }

    updateAllTowerOptions()
  }, [userTypeData, updateUserTypeData])

  const handleSelectedTower = (index: number, newTower: string) => {
    if (!newTower) {
      updateUserTypeData(index, {
        tower: undefined,
        floor: [{ name: '', value: '' }],
        floorOptions: [],
      })
    } else {
      updateUserTypeData(index, { tower: newTower })

      const floors = filterFloorsByTower(newTower)

      updateUserTypeData(index, { floorOptions: floors })
    }
  }

  const handleSelectedUserType = (index: number, userType: string) => {
    if (!userType) {
      updateUserTypeData(index, {
        tower: undefined,
        floor: [{ name: '', value: '' }],
        floorOptions: [],
        userType,
      })
    } else {
      updateUserTypeData(index, { userType })
    }
  }

  const handleSelectedFloors = (
    index: number,
    newFloors: string[],
    name: string
  ) => {
    const updatedFloor = newFloors.map((floorValue) => ({
      name: name,
      value: floorValue,
    }))

    const newFloorData = [...userTypeData[index].floor]
    newFloorData.length = newFloors.length
    newFloorData.splice(0, newFloors.length, ...updatedFloor)

    const updatedUserTypeData = [...userTypeData]
    updatedUserTypeData[index] = {
      ...updatedUserTypeData[index],
      floor: newFloorData,
    }

    updateUserTypeData(index, { floor: newFloorData })

    setValue('targetGroupDetails', {
      ...watchTargetGroupDetails,
      targetGroupByUserType: updatedUserTypeData,
    })
  }

  const handleAddUserType = () => {
    const currentIndex = userTypeData.length
    const availableTowers = getAvailableTowerOptions(currentIndex)

    setUserTypeData([
      ...userTypeData,
      {
        userType: '',
        tower: '',
        floor: [],
        towerOptions: availableTowers!,
        floorOptions: [],
      },
    ])
  }

  const onChange = (e: any, field: string, index: number) => {
    const value = e.target.value
    clearErrors(`target-building-${index}`)
    clearErrors(`target-floor-${index}`)
    clearErrors(`target-usertype-${index}`)

    switch (field) {
      case 'userType':
        handleSelectedUserType(index, value)
        return
      case 'tower':
        handleSelectedTower(index, value)
        return
      case 'floor':
        handleSelectedFloors(index, value, e.selectedOption.name)
        return
      default:
        break
    }
  }
  const handleDelete = (index: number) => {
    setUserTypeData((prevData) => prevData.filter((_, i) => i !== index))
  }

  const validateUserType = (value: any, index: number) => {
    if (selectedTarget !== 'userType') return true

    return !userTypeData[index].userType && !value
      ? 'Please select user type'
      : true
  }

  const validateBuilding = (index: number, selectedUserType?: string) => {
    if (!selectedUserType) {
      return true
    }

    if (isEmpty(userTypeData[index].tower)) {
      return 'Please select building'
    }
    return true
  }

  const validateFloor = (value: any, index: number, selectedTower?: string) => {
    if (!selectedTower) {
      return true
    }

    if (
      (!value || value.length === 0) &&
      (userTypeData[index].floor.length === 0 || isEmpty(userTypeData[index]))
    ) {
      return 'Please select floors'
    }

    return true
  }

  return (
    <>
      <div className='flex flex-column pl-5 pt-2 gap-1 w-full'>
        {userTypeData.map((item, index) => {
          return (
            <div key={index} className='user-type-group'>
              <SelectUserTypeNotification
                index={index}
                disabled={disabled}
                onChange={onChange}
                validateUserType={validateUserType}
                validateBuilding={validateBuilding}
                validateFloor={validateFloor}
                selectedUserType={item.userType}
                selectedFloors={item.floor}
                selectedTower={item.tower}
                floorOptions={item.floorOptions}
                optionTowers={item.towerOptions}
                onDelete={handleDelete}
                handleTargetChange={handleTargetChange}
              />
            </div>
          )
        })}
      </div>
      <div className='ml-5 mt-2'>
        <Button
          disabled={disabled}
          icon
          type='button'
          className='px-5'
          label='+ Add'
          outlined
          onClick={handleAddUserType}
        />
      </div>
    </>
  )
}
