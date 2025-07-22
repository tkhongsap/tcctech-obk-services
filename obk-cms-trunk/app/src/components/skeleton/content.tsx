import clsx from 'clsx'
import React from 'react'

const ContentSkeleton = ({ className }: { className?: string }) => (
  <div className={clsx(className, 'tw-w-full tw-mb-4 last:tw-mb-0')}>
    <div role='status' className='tw-space-y-2.5 tw-animate-pulse'>
      <div className='tw-flex tw-items-center tw-w-full'>
        <div className='tw-h-2.5 tw-mr-2 tw-bg-gray-200 tw-rounded-full tw-w-32'></div>
        <div className='tw-h-2.5 tw-mr-2 tw-bg-gray-300 tw-rounded-full tw-w-24'></div>
        <div className='tw-h-2.5 tw-mr-2 tw-bg-gray-300 tw-rounded-full tw-w-full'></div>
      </div>
      <div className='tw-flex tw-items-center tw-w-full'>
        <div className='tw-h-2.5 tw-mr-2 tw-bg-gray-200 tw-rounded-full tw-w-full'></div>
        <div className='tw-h-2.5 tw-mr-2 tw-bg-gray-300 tw-rounded-full tw-w-full'></div>
        <div className='tw-h-2.5 tw-mr-2 tw-bg-gray-300 tw-rounded-full tw-w-24'></div>
      </div>
      <div className='tw-flex tw-items-center tw-w-full tw-max-w-[400px]'>
        <div className='tw-h-2.5 tw-mr-2 tw-bg-gray-300 tw-rounded-full tw-w-full'></div>
        <div className='tw-h-2.5 tw-mr-2 tw-bg-gray-200 tw-rounded-full tw-w-80'></div>
        <div className='tw-h-2.5 tw-mr-2 tw-bg-gray-300 tw-rounded-full tw-w-full'></div>
      </div>
      <div className='tw-flex tw-items-center tw-w-full'>
        <div className='tw-h-2.5 tw-mr-2 tw-bg-gray-200 tw-rounded-full tw-w-full'></div>
        <div className='tw-h-2.5 tw-mr-2 tw-bg-gray-300 tw-rounded-full tw-w-full'></div>
        <div className='tw-h-2.5 tw-mr-2 tw-bg-gray-300 tw-rounded-full tw-w-24'></div>
      </div>
      <div className='tw-flex tw-items-center tw-w-full'>
        <div className='tw-h-2.5 tw-mr-2 tw-bg-gray-300 tw-rounded-full tw-w-32'></div>
        <div className='tw-h-2.5 tw-mr-2 tw-bg-gray-300 tw-rounded-full tw-w-24'></div>
        <div className='tw-h-2.5 tw-mr-2 tw-bg-gray-200 tw-rounded-full tw-w-full'></div>
      </div>
      <div className='tw-flex tw-items-center tw-w-full'>
        <div className='tw-h-2.5 tw-mr-2 tw-bg-gray-300 tw-rounded-full tw-w-full'></div>
        <div className='tw-h-2.5 tw-mr-2 tw-bg-gray-200 tw-rounded-full tw-w-80'></div>
        <div className='tw-h-2.5 tw-mr-2 tw-bg-gray-300 tw-rounded-full tw-w-full'></div>
      </div>
    </div>
  </div>
)

export default ContentSkeleton
