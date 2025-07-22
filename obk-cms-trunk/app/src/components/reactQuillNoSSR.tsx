import React from 'react'
import dynamic from 'next/dynamic'

const ReactQuillNoSSR = dynamic(
  () => {
    return import('react-quill')
  },
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
)

export default ReactQuillNoSSR
