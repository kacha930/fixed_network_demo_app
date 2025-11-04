import React, {useRef, useState, useEffect} from 'react'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom'

export default function PinEntry(){
  const inputs = [useRef(null), useRef(null), useRef(null), useRef(null)]
  const [values, setValues] = useState(['','','',''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  useEffect(()=>{ inputs[0].current && inputs[0].current.focus() }, [])

  function onChange(i, e){
    const v = e.target.value.replace(/\D/g,'').slice(0,1)
    const next = [...values]
    next[i]=v
    setValues(next)
    if (v && i<3){
      inputs[i+1].current.focus()
    }
  }

  function onKeyDown(i,e){
    if (e.key === 'Backspace' && !values[i] && i>0){
      inputs[i-1].current.focus()
    }
  }

  async function handleUnlock(){
    setError('')
    const pin = values.join('')
    if (pin.length !== 4){ setError('Enter 4 digits'); return }
    setLoading(true)
    try{
      const res = await fetch('/api/sim/unlock', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ pin })
      })
      const data = await res.json()
      await new Promise(r=>setTimeout(r,2000))
      if (res.ok && data.status === 'success'){
        nav('/dashboard')
      } else {
        setError(data.message || 'Incorrect PIN')
      }
    }catch(err){
      setError('Network error')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{width:420,maxWidth:'95%'}}>
        <div className='card' style={{padding:24}}>
          <h2>SIM Locked - Enter PIN</h2>
          <p style={{color:'#444'}}>Enter the 4-digit SIM PIN to unlock your SIM card.</p>

          <div className='pin-wrap' style={{marginTop:18}}>
            {values.map((v,i)=> (
              <div key={i} className='pin-digit' >
                <input
                  ref={inputs[i]}
                  value={v}
                  onChange={(e)=>onChange(i,e)}
                  onKeyDown={(e)=>onKeyDown(i,e)}
                  maxLength='1'
                  inputMode='numeric'
                  style={{width:'100%',height:'100%',border:'none',background:'transparent',textAlign:'center',fontSize:22}}
                />
              </div>
            ))}
          </div>

          {error && <p style={{color:'#c71',marginTop:12}}>{error}</p>}

          <div style={{display:'flex',justifyContent:'center',marginTop:18,gap:12}}>
            <button className='btn' onClick={handleUnlock} disabled={loading || values.join('').length!==4}>Unlock</button>
            <button className='btn' style={{background:'#eee',color:'#02123B'}} onClick={()=>nav('/dashboard')}>Cancel</button>
          </div>
        </div>
        {loading && <Loader message='Connecting…' />}
      </div>
    </div>
  )
}
