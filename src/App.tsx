import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/login'
import NotFound from './pages/notFound'
import Dashboard from './pages/dashboard'
import { format } from 'date-fns'
import { useEffect, useRef } from 'react'


export function App() {
  const timeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const updateClock = () => {
      if (timeRef.current) {
        timeRef.current.innerText = format(new Date(), 'EEEE, MMMM do yyyy | hh:mm:ss a');
      }
      requestAnimationFrame(updateClock);
    };
    updateClock();
  }, []);

  return (
    <div className="w-screen flex flex-col items-center mx-auto bg-[url(background.jpg)] bg-cover">
      <div className="bg-white p-3 text-center rounded-b-xl z-10 shadow-lg w-auto px-6 h-[50px] items-center flex flex-col">
        <p ref={timeRef} className="text-black text-lg font-mono">
          {format(new Date(), 'EEEE, MMMM do yyyy | hh:mm:ss a')}
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
