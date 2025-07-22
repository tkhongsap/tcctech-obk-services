import React from 'react'
import { LoadingScreenStyled } from './styled'
import clsx from 'clsx'

const LoadingScreen = ({ isLoading }: { isLoading?: boolean }) => {
  return (
    <LoadingScreenStyled
      className={clsx(
        'fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-[rgba(35,31,32,0.5)] ease-in-out duration-200',
        isLoading ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className='lds-ring'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </LoadingScreenStyled>
  )
}

export default LoadingScreen
