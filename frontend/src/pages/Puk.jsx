import React from 'react'
export default function Puk(){
  React.useEffect(()=>{ window.location.href = '/puk' },[])
  return <div style={{color:'#fff',padding:20}}>Redirecting to PUK page...</div>
}
