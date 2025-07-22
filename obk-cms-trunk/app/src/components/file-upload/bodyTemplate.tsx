import { Button } from 'primereact/button'
import { ItemTemplateOptions } from 'primereact/fileupload'

export const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
  const file = inFile as any
  return (
    <div className='flex align-items-center flex-wrap'>
      <div className='flex align-items-center' style={{ width: '40%' }}>
        <img
          alt={file.name}
          role='presentation'
          src={file.objectURL}
          width={100}
        />
        <span className='flex flex-column text-left ml-3'>
          {/* {file.name} */}
          {/* <small>{new Date().toLocaleDateString()}</small> */}
        </span>
      </div>
      {/* <Tag value={props.formatSize} severity="warning" className="px-3 py-2" /> */}
      <Button
        type='button'
        icon='pi pi-times'
        className='p-button-outlined p-button-rounded p-button-danger ml-auto'
        onClick={() => onTemplateRemove(file, props.onRemove)}
      />
    </div>
  )
}

const onTemplateRemove = (file: File, callback: Function) => {
  // setTotalSize(totalSize - file.size);
  callback()
}

export const emptyTemplate = () => {
  return (
    <div className='flex align-items-center flex-column'>
      <i
        className='pi pi-image mt-3 p-5'
        style={{
          fontSize: '5em',
          borderRadius: '50%',
          backgroundColor: 'var(--surface-b)',
          color: 'var(--surface-d)',
        }}
      ></i>
      <span
        style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }}
        className='my-5'
      >
        Drag and Drop Image Here
      </span>
    </div>
  )
}
