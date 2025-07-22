import GenericFilterPane from '@src/components/role/role/tableListFilters'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import ListAction from '@components/list/action'
import { Paginator } from 'primereact/paginator'
import { Tag } from 'primereact/tag'
import { Tooltip } from 'primereact/tooltip'

const TableList = (props: any) => {
  const { tableProps, onFilter, isLoading } = props

  const privilegeTag = (name: string, props?: any) => (
    <Tag
      key={name}
      rounded
      style={{ background: '#F4F7FE', margin: '3px 3px' }}
      {...props}
    >
      <div
        style={{
          padding: '0 4px',
          color: '#273281',
          fontSize: '12px',
          fontWeight: 600,
        }}
      >
        {name}
      </div>
    </Tag>
  )

  const privilegeTemplete = (rowData: {
    id: string
    privileges: Array<string>
  }) => {
    const privileges = rowData.privileges
    return (
      <div>
        {privileges.slice(0, 2).map((e) => privilegeTag(e))}
        {privileges.length > 2 && (
          <>
            {privilegeTag('...', { id: 'pvl-' + rowData.id })}
            <Tooltip target={'#pvl-' + rowData.id}>
              {privileges.slice(2).map((e: string) => {
                return privilegeTag(e)
              })}
            </Tooltip>
          </>
        )}
      </div>
    )
  }

  const actionTemplete = (rowData: { id: string | number }) => {
    return <ListAction types={['edit']} id={rowData.id} />
  }

  const lastUpdatedTemplete = (rowData: { updated_at: string }) => {
    return new Date(rowData.updated_at).toLocaleString()
  }

  const statusTemplete = (rowData: { status: string }) => {
    const isActive = rowData.status == 'Active'
    return (
      <Tag
        style={{
          background: isActive ? '#59B413' : '#CD1A1A',
        }}
      >
        <div
          style={{
            fontSize: '12px',
          }}
        >
          {isActive ? 'Active' : 'Suspend'}
        </div>
      </Tag>
    )
  }

  return (
    <div style={{ paddingBottom: '60px' }}>
      <div className='flex justify-content-between'>
        <div className='text-2xl'>Role List</div>
        <div>
          <GenericFilterPane onFilter={onFilter} />
        </div>
      </div>

      <DataTable
        value={tableProps.data}
        dataKey='id'
        scrollable
        scrollHeight='700px'
        className='mt-4'
        loading={isLoading}
        rows={tableProps.perPage}
      >
        <Column field='id' header='ID' className='font-bold'></Column>
        <Column
          field='role'
          header='Role'
          style={{ minWidth: '200px' }}
        ></Column>
        <Column
          field='privileges'
          header='Privileges'
          body={privilegeTemplete}
          style={{ minWidth: '300px' }}
        ></Column>
        <Column
          field='updated_at'
          header='Last Updated'
          style={{ minWidth: '200px' }}
          body={lastUpdatedTemplete}
        ></Column>
        <Column
          field='updated_by'
          header='Updated by'
          style={{ minWidth: '150px' }}
        ></Column>
        <Column field='status' header='Status' body={statusTemplete}></Column>
        <Column
          body={actionTemplete}
          // style={{ minWidth: '200px' }}
          alignFrozen='right'
          frozen={true}
        ></Column>
      </DataTable>
      <Paginator
        first={
          tableProps.totalPage - tableProps.totalPage / tableProps.currentPage
        }
        rows={tableProps.perPage}
        totalRecords={tableProps.totalRecords}
        onPageChange={tableProps.pageOnChange}
      />
    </div>
  )
}

export default TableList
