import FieldUploadButtonField from '@components/forms/components/file-upload-button-field'
import { Button } from 'primereact/button'

type Props = {
  csvData: { account_id: string }[] | undefined
  csvFile?: File
  onChange?(e: any): void
  onRemoveFile(): void
  selectedUploadCsv?: boolean
  targetGroupDetails:
    | { name: string; account_id_group: string[]; detail: File }
    | undefined
  validateUpload(e: any): true | string
}

export const UploadCsvTargetGroupNotification = (props: Props) => {
  const {
    csvData,
    csvFile,
    onChange,
    onRemoveFile,
    targetGroupDetails,
    selectedUploadCsv,
    validateUpload,
  } = props
  const hasFileUpload = csvData && csvData.length > 0 && csvFile

  const renderFileInfo = () => (
    <div
      className='flex align-items-center   justify-between bg-[#E7E7E7] w-5 p-2 tw-rounded-md'
      style={{ backgroundColor: '#E7E7E7' }}
    >
      <div className='flex align-items-center flex-1' style={{ width: '70%' }}>
        <span className='flex flex-column text-left ml-3 '>
          {csvFile?.name ?? targetGroupDetails?.name}
          <small>{csvFile ? new Date().toLocaleDateString() : ''}</small>
        </span>
      </div>
      <div
        className='flex items-center justify-center border-circle
           bg-white cursor-pointer  p-1 mr-2'
        onClick={onRemoveFile}
      >
        <i className='pi pi-times text-primary-blue'></i>
      </div>
    </div>
  )

  const handleDownloadCsv = () => {
    fetch('/csv-template/csv-template.csv').then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob)
        let a = document.createElement('a')
        a.href = url
        a.download = 'CsvTemplate.csv'
        a.click()
      })
    })
  }
  return (
    <div className='w-full mt-3 ml-5 pr-4'>
      <Button
        disabled={selectedUploadCsv}
        type='button'
        className='px-5 mt-1'
        label='Download .csv template'
        outlined
        onClick={handleDownloadCsv}
      />
      <p className='text-sm tw-text-[#273281] tw-font-medium mt-3'>
        Upload .csv file
      </p>

      {hasFileUpload ? (
        <div className='w-full border-dashed border-1 p-3'>
          <div className='w-[200px]'>{renderFileInfo()}</div>
        </div>
      ) : (
        <FieldUploadButtonField
          disabled={selectedUploadCsv}
          key={csvFile ? csvFile.name : 'reset'}
          name='targetGroupDetails'
          outputType='file'
          mode='single'
          acceptTypes='.csv,text/csv'
          onChange={onChange}
          rules={{ validate: (e) => validateUpload(e) }}
        />
      )}
      <div className='mt-2'>
        <small className='text-500'>
          {csvData
            ? `[${csvData.length}] user IDs have been successfully extracted from the CSV file.`
            : `[0] user IDs have been successfully extracted from the CSV file.`}
        </small>
      </div>
    </div>
  )
}
