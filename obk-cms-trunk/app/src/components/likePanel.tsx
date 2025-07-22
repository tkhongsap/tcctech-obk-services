import React from 'react'

import SvgLike from '@assets/svg/like.svg'
import SvgDislike from '@assets/svg/dislike.svg'

const LikePanel = ({
  like = 0,
  dislike = 0,
}: {
  like?: number
  dislike?: number
}) => (
  <div className='tw-flex tw-items-center tw-gap-x-4'>
    <div className='tw-flex tw-items-center tw-gap-x-2'>
      <SvgLike />
      <span className='tw-text-[#59B413] tw-text-sm'>{like}</span>
    </div>
    <div className='tw-flex tw-items-center tw-gap-x-2'>
      <SvgDislike />
      <span className='tw-text-[#CD1A1A] tw-text-sm'>{dislike}</span>
    </div>
  </div>
)

export default LikePanel
