import React from 'react'

function artCEditorHeader() {
  return (
    <>
      <span className='ql-formats'>
        <button className='ql-bold'></button>
        <button className='ql-italic'></button>
        <button className='ql-underline'></button>
        <button className='ql-strike'></button>
      </span>
      <span className='ql-formats'>
        <select className='ql-color'></select>
        <select className='ql-background'></select>
      </span>
      <span className='ql-formats'>
        <button className='ql-script' value='sub'></button>
        <button className='ql-script' value='super'></button>
      </span>
      <span className='ql-formats'>
        <button className='ql-code-block'></button>
      </span>
      <span className='ql-formats'>
        <button className='ql-list' value='ordered'></button>
        <button className='ql-list' value='bullet'></button>
        <button className='ql-indent' value='-1'></button>
        <button className='ql-indent' value='+1'></button>
      </span>
      <span className='ql-formats'>
        <select className='ql-align'></select>
      </span>
      <span className='ql-formats'>
        <button className='ql-link'></button>
        <button className='ql-image'></button>
        <button className='ql-video'></button>
      </span>
      <span className='ql-formats'>
        <button className='ql-clean'></button>
      </span>
    </>
  )
}

export default artCEditorHeader
