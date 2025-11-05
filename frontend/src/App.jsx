// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import GetStarted from './pages/GetStarted'
import Dashboard from './pages/Dashboard'
import PinEntry from './pages/PinEntry'
import SimUnlock from './pages/SimUnlock' // ✅ Add this line

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/get-started' element={<GetStarted />} />
        <Route path='/pin-entry' element={<PinEntry />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/simunlock' element={<SimUnlock />} /> {/* ✅ New route */}
      </Routes>
    </BrowserRouter>
  )
}
