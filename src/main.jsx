import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { AppStateProvider } from './hooks/useAppState'
import { router } from './router'
import './App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppStateProvider>
      <RouterProvider router={router} />
    </AppStateProvider>
  </StrictMode>
)
