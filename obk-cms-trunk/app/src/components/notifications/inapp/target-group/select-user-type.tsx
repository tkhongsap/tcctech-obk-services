import { Grid, GridItem } from '@chakra-ui/react'
import DropdownField from '@components/forms/components/dropdown-field'
import MultipleSelectField from '@components/forms/components/multiple-select-field'
import { KeyValue } from '@src/types/key-value'
import { Button } from 'primereact/button'
import { RadioButtonChangeEvent } from 'primereact/radiobutton'
import { DropdownChangeEvent } from 'primereact/dropdown'

type Props = {
  onChange(e: DropdownChangeEvent, field: string, index: number): void
  onDelete(index: number): void
  optionTowers?: KeyValue[]
  floorOptions?: KeyValue[]
  selectedFloors?: { name: string; value: string | undefined }[]
  selectedTower?: string
  selectedUserType?: string
  disabled?: boolean
  index: number
  handleTargetChange(e?: RadioButtonChangeEvent, index?: number): void
  validateUserType(value: any, index: number): true | string
  validateBuilding(index: number, selectedUserType?: string): true | string
  validateFloor(
    value: any,
    index: number,
    selectedTower?: string
  ): true | string
}

export const SelectUserTypeNotification = (props: Props) => {
  const {
    onChange,
    selectedUserType,
    optionTowers,
    floorOptions,
    selectedFloors,
    selectedTower,
    disabled,
    index,
    onDelete,
    handleTargetChange,
    validateUserType,
    validateBuilding,
    validateFloor,
  } = props
  const dropdownStyles = {
    backgroundColor: '#F4F7FE',
    border: 'none',
  }

  const filteredValues = selectedFloors
    ?.filter((floor) => floor.name.trim() !== '')
    .map((floor) => floor.value)

  handleTargetChange(undefined, index)

  return (
    <div className='mt-3'>
      <Grid
        templateRows='repeat(1, 1fr)'
        templateColumns='repeat(7, 1fr)'
        gap={10}
      >
        <GridItem colSpan={2} h={105}>
          <div>
            <p className='text-sm tw-text-[#273281] tw-font-medium'>
              User Type *
            </p>

            <DropdownField
              disabled={disabled}
              name={`target-usertype-${index}`}
              options={[{ name: 'Office Worker', value: 'custom' }]}
              optionLabel='name'
              optionValue='value'
              placeholder='select'
              className='w-full'
              showRequiredLabel={false}
              rules={{
                validate: (e) => validateUserType(e, index),
              }}
              showClear
              value={selectedUserType}
              onChange={(e) => onChange(e, 'userType', index)}
              dropdownStyles={disabled ? dropdownStyles : {}}
            />
          </div>
        </GridItem>
        <GridItem colSpan={2} h={105}>
          <div>
            <p className='text-sm tw-text-[#273281] tw-font-medium'>
              Building *
            </p>
            <DropdownField
              name={`target-building-${index}`}
              disabled={!selectedUserType}
              options={optionTowers}
              showRequiredLabel={false}
              optionLabel='name'
              optionValue='value'
              placeholder='select'
              className='w-full'
              rules={{
                validate: () => validateBuilding(index, selectedUserType),
              }}
              showClear
              value={selectedTower}
              dropdownStyles={selectedUserType ? {} : dropdownStyles}
              onChange={(e) => onChange(e, 'tower', index)}
            />
          </div>
        </GridItem>
        <GridItem colSpan={2} h={105}>
          <div>
            <p className='text-sm tw-text-[#273281] tw-font-medium'>Floor *</p>
            <MultipleSelectField
              disabled={!selectedTower}
              name={`target-floor-${index}`}
              placeholder='Select'
              options={floorOptions}
              onChange={(e) => onChange(e, 'floor', index)}
              rules={{
                validate: (e) => validateFloor(e, index, selectedTower),
              }}
              optionLabel='name'
              optionValue='value'
              showRequiredLabel={false}
              showSelectAll={false}
              showClear
              value={filteredValues}
            />
          </div>
        </GridItem>
        <GridItem colSpan={1} className='align-content-center' h={105}>
          <div>
            {index > 0 && (
              <Button
                type='button'
                className=''
                label='x'
                rounded
                size='large'
                text
                onClick={() => onDelete(index)}
              />
            )}
          </div>
        </GridItem>
      </Grid>
    </div>
  )
}
