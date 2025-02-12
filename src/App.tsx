import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/login'
import NotFound from './pages/notFound'
import Dashboard from './pages/dashboard'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'


export function App() {
  const [time, setTime] = useState(new Date())
  const updateClock = () => {
    setTime(new Date())
  }
  useEffect(() => {
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-screen flex flex-col items-center mx-auto bg-[url(background.jpg)] bg-cover">
      <div className="bg-white p-3 text-center rounded-b-xl z-10 shadow-lg w-auto px-6 h-[50px] items-center flex flex-col">
        <p className="text-black text-lg font-mono">
          {format(time, 'EEEE, MMMM do yyyy | hh:mm:ss a')}
        </p>
      </div>
      <div className="mt-[-50px] pt-[50px] flex flex-grow justify-center h-screen w-screen items-center">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div >
  )
}

export function WrappedApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}
