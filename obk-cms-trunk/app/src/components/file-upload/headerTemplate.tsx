import { FileUploadHeaderTemplateOptions } from 'primereact/fileupload'

export function headerTemplate(options: FileUploadHeaderTemplateOptions) {
  const { className } = options
  return (
    <div
      className={className}
      style={{
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className='flex align-items-center gap-3 ml-auto'></div>
    </div>
  )
}
