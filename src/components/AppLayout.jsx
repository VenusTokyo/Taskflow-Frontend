import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false)

  // Close drawer when viewport becomes desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const handler = () => { if (mq.matches) setOpen(false) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <div className="app-layout">
      {/* Backdrop — only visible on mobile when sidebar is open */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      <Sidebar isOpen={open} onClose={() => setOpen(false)} />

      <div className="app-content">
        {/* Mobile top bar — hidden on desktop via CSS */}
        <div className="mobile-topbar">
          <button
            className="hamburger-btn"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <span /><span /><span />
          </button>
          <span className="mobile-logo">TaskFlow</span>
        </div>

        <main className="app-main">
          {children}
        </main>
      </div>
    </div>
  )
}
