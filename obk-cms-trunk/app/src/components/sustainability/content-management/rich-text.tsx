import ReactQuillNoSSR from '@components/reactQuillNoSSR'
import React, { useEffect, useState } from 'react'

const customToolbar = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ['clean'],
  [{ customOption: 'value' }],
]

const modules = {
  toolbar: {
    container: customToolbar,
    handlers: {
      customOption: function () {
        alert('Custom button clicked!')
      },
    },
  },
}

const RichText = (props: any) => {
  const { label = 'Label' } = props
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return <></>

  return (
    <div>
      <div className='tw-text-[#2B3674] tw-text-sm mb-3 tw-font-medium'>
        {label}
      </div>
      <ReactQuillNoSSR {...props} theme='snow' modules={modules} />
    </div>
  )
}

export default RichText
