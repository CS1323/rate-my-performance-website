import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { AdsProvider } from './context/AdsContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AdsProvider>
        <App />
      </AdsProvider>
    </BrowserRouter>
  </StrictMode>,
)
