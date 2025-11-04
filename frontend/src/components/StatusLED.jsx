import React from 'react'
export default function StatusLED({connected}){
  return <span style={{display:'inline-flex',alignItems:'center'}}><span className={'led '+(connected?'green':'grey')}></span>{connected? 'Connected' : 'Disconnected'}</span>
}
