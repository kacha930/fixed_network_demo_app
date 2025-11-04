import React from 'react'
export default function Loader({message='Connecting…'}){
  return (
    <div className='loader-overlay' role='status' aria-live='polite'>
      <div className='loader-box'>
        <div className='spinner' />
        <div>{message}</div>
      </div>
    </div>
  )
}
