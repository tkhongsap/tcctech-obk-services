import React from 'react'
import clsx from 'clsx'

const ListSkeleton = ({ className }: { className?: string }) => (
  <div className={clsx(className, 'tw-w-full')}>
    <div className='tw-p-6 tw-space-y-6 tw-divide-y tw-divide-gray-200 tw-rounded tw-animate-pulse tw-w-full'>
      {Array.apply(null, Array(2)).map((_, index) => (
        <div
          className='tw-flex tw-items-center tw-justify-between tw-pt-6 first:tw-pt-0'
          key={`skeleton-list-${index}`}
        >
          <div className='tw-w-[60%]'>
            <div className='tw-h-2.5 tw-bg-gray-300 tw-rounded-full tw-w-[80%] tw-mb-2.5'></div>
            <div className='tw-w-full tw-h-2 tw-bg-gray-200 tw-rounded-full'></div>
          </div>
          <div className='tw-h-2.5 tw-bg-gray-300 tw-rounded-full tw-w-12'></div>
        </div>
      ))}
    </div>
  </div>
)

export default ListSkeleton
