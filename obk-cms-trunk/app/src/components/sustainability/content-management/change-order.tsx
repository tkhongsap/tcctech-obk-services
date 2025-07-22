import { Dropdown } from 'primereact/dropdown'

const ChangeOrder = (props: any) => {
  const { order, onChangeOrder, optOrder, id, lstData = [] } = props

  return (
    <Dropdown
      className={'w-full'}
      value={order}
      onChange={(e) => {
        onChangeOrder(order, e.value, id, lstData)
      }}
      options={optOrder}
      optionLabel='name'
      optionValue='value'
      placeholder=''
    />
  )
}

export default ChangeOrder
