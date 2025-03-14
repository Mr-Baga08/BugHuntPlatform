// bug_dashboard/src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'
import { configureAxios } from './assets/Componets/Admin Dashboard/config'

// Configure axios globally
configureAxios(axios);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
