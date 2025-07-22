import ReactQuillNoSSR from '@components/reactQuillNoSSR'
import React, { useEffect, useState } from 'react'

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
      <ReactQuillNoSSR {...props} theme='snow' />
    </div>
  )
}

export default RichText
