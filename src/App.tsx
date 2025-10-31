// src/App.tsx
import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/header'
import LandingPage from '@/pages/LandingPage'
import TokenLauncher from '@/pages/TokenLauncher'
import TokenDetailsPage from '@/pages/TokenDetailsPage'
import AppKitProvider from '@/AppKitProvider'

const App = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDark)
  }, [])

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [darkMode])

  return (
    <AppKitProvider>
      <div className={darkMode ? 'dark' : ''}>
        <Routes>
          <Route path="/" element={
            <LandingPage
              darkMode={darkMode}
              toggleDarkMode={() => setDarkMode(v => !v)}
            />
          } />
          <Route path="/launch" element={
            <>
              <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(v => !v)} />
              <TokenLauncher />
            </>
          } />
          <Route path="/token/:address" element={
            <>
              <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(v => !v)} />
              <TokenDetailsPage />
            </>
          } />
        </Routes>
        <Toaster />
      </div>
    </AppKitProvider>
  )
}

export default App
