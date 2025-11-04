// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import GetStarted from './pages/GetStarted'
import Dashboard from './pages/Dashboard'
import PinEntry from './pages/PinEntry'
import SimUnlock from './pages/SimUnlock'

// ❌ REMOVE THIS LINE: The component is not used here and caused the build error.
// import DataDisplay from './DataDisplay.jsx' 

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/get-started' element={<GetStarted />} />
        <Route path='/pin-entry' element={<PinEntry />} />
        
        {/* The DataDisplay component should be imported and used inside
            Dashboard.jsx or SimUnlock.jsx, not here. */}
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/simunlock' element={<SimUnlock />} />
      </Routes>
    </BrowserRouter>
  )
}