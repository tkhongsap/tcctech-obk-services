import { Modal } from 'antd'

interface ProcessingLoadingProps {
  loading: boolean
}

export const ProcessingLoading = ({ loading }: ProcessingLoadingProps) => {
  return (
    <Modal
      open={loading}
      footer={null}
      closable={false}
      maskClosable={false}
      centered
      styles={{
        mask: { padding: '16px', border: 'none' },
        body: { padding: 0 },
      }}
    >
      <div id='processing-loader' className='custom-modal-content'>
        <div className='flex align-items-center'>
          <h4 className='tw-text-[#273281] font-bold justify-content-center mr-2 mb-0'>
            Processing
          </h4>
          <div className='loader-container'>
            <div className='dot-loader'>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
        <p className='tw-text-lg p-4'>This may take a moment.</p>
      </div>
    </Modal>
  )
}
