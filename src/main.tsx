import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { WrappedApp } from './App'
import { Toaster } from './components/ui/toaster'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WrappedApp />
    <Toaster />
  </StrictMode>,
)
