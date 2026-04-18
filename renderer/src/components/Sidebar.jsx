import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const NAV = [
  { to: '/',        icon: 'dashboard',              label: 'Dashboard' },
  { to: '/live',    icon: 'video_chat',              label: 'Live Meeting' },
  { to: '/tasks',   icon: 'assignment',              label: 'Tasks' },
  { to: '/summary', icon: 'receipt_long',            label: 'Summaries' },
  { to: '/settings',icon: 'settings',                label: 'Settings' },
]

export default function Sidebar({ recording, isSidebarOpen, setIsSidebarOpen }) {
  const navigate = useNavigate()

  return (
    <nav 
      className="fixed left-0 top-0 bottom-0 flex flex-col z-40 transition-all duration-300"
      style={{ 
        width: isSidebarOpen ? '240px' : '70px',
        background: 'rgba(14,14,16,0.7)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(72,71,74,0.2)',
        padding: isSidebarOpen ? '24px 20px' : '24px 10px'
      }}
    >
      {/* Toggle button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute -right-3.5 top-8 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer transition-colors z-50 shadow-md"
        style={{ background: 'var(--surface-container-high)', border: '1px solid rgba(72,71,74,0.4)', color: 'var(--on-surface-variant)' }}
        onMouseEnter={e=>e.currentTarget.style.color='var(--primary)'}
        onMouseLeave={e=>e.currentTarget.style.color='var(--on-surface-variant)'}
        title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          {isSidebarOpen ? 'chevron_left' : 'chevron_right'}
        </span>
      </button>

      {/* Header / Logo */}
      <div className={`flex items-center mb-8 ${isSidebarOpen ? 'pl-1 gap-3.5' : 'justify-center'}`}>
        <div 
          className="flex-shrink-0 flex items-center justify-center rounded-xl shadow-lg transition-all duration-300"
          style={{ 
            width: isSidebarOpen ? 40 : 36, 
            height: isSidebarOpen ? 40 : 36, 
            background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
            boxShadow: '0 8px 24px rgba(79,70,229,0.3)'
          }}
        >
          <span className="material-symbols-outlined" style={{ color:'#fff', fontSize: isSidebarOpen ? 20 : 18, fontVariationSettings:"'FILL' 1" }}>visibility</span>
        </div>
        
        {isSidebarOpen && (
          <div className="overflow-hidden whitespace-nowrap transition-opacity duration-300">
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>Observer AI</div>
            <div style={{ fontSize: 11, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginTop: 2 }}>Intelligence</div>
          </div>
        )}
      </div>

      {/* New Meeting button */}
      <button 
        onClick={() => navigate('/live')}
        className={`flex items-center justify-center border-none rounded-xl text-white font-medium cursor-pointer transition-all duration-300 mb-6 flex-shrink-0 ${isSidebarOpen ? 'w-full py-3 gap-2 text-sm' : 'w-10 h-10 mx-auto'}`}
        style={{ 
          background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
          boxShadow: '0 8px 24px rgba(79,70,229,0.25)',
        }}
        title="New Meeting"
        onMouseEnter={e=>e.currentTarget.style.opacity='.85'}
        onMouseLeave={e=>e.currentTarget.style.opacity='1'}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
        {isSidebarOpen && <span>New Meeting</span>}
      </button>

      {/* Recording indicator */}
      {recording && isSidebarOpen && (
        <div className="flex items-center gap-2 mb-3 rounded-lg px-3 py-2"
             style={{ background: 'rgba(215,51,87,0.12)', border: '1px solid rgba(215,51,87,0.25)' }}>
          <span className="w-2 h-2 rounded-full bg-error animate-pulse" style={{ background: '#ff6e84' }}/>
          <span className="text-xs font-semibold" style={{ color: '#ff6e84', fontSize: 11, letterSpacing: '0.05em' }}>RECORDING</span>
        </div>
      )}
      
      {recording && !isSidebarOpen && (
        <div className="flex justify-center mb-4 transition-all duration-300">
          <span className="w-3 h-3 rounded-full bg-error animate-pulse shadow-md" style={{ background: '#ff6e84', boxShadow:'0 0 8px rgba(255,110,132,0.6)' }} title="Recording Active"/>
        </div>
      )}

      {/* Nav links */}
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto overflow-x-hidden">
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to==='/'} title={!isSidebarOpen ? label : ''} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center',
            gap: isSidebarOpen ? 12 : 0, 
            padding: isSidebarOpen ? '11px 14px' : '11px 0',
            justifyContent: isSidebarOpen ? 'flex-start' : 'center',
            borderRadius: 12, textDecoration: 'none', fontSize: 13, fontWeight: 500,
            transition: 'all .15s',
            ...(isActive
              ? { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff',
                  boxShadow: '0 8px 20px rgba(79,70,229,0.25)' }
              : { color: 'var(--on-surface-variant)',
                  ':hover': { background: 'rgba(255,255,255,0.05)' } }),
          })}>
            <span className="material-symbols-outlined shrink-0" style={{ fontSize: 20 }}>{icon}</span>
            {isSidebarOpen && <span className="whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </div>

      {/* Overlay toggle */}
      <div className={`pt-4 mt-auto border-t transition-all duration-300 flex ${isSidebarOpen ? 'px-0' : 'justify-center'}`} style={{ borderTopColor: 'rgba(72,71,74,0.2)' }}>
        <button 
          onClick={() => window.electronAPI?.toggleOverlay()}
          title="Toggle Overlay"
          className={`flex items-center border rounded-lg cursor-pointer transition-all duration-200 shrink-0 ${isSidebarOpen ? 'w-full py-2.5 px-4 gap-2 text-xs justify-center' : 'w-10 h-10 px-0 justify-center'}`}
          style={{ 
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(72,71,74,0.3)', 
            color: 'var(--on-surface-variant)'
          }}
          onMouseEnter={e=>Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.08)', color: 'var(--on-surface)' })}
          onMouseLeave={e=>Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.04)', color: 'var(--on-surface-variant)' })}
        >
          <span className="material-symbols-outlined shrink-0" style={{ fontSize: 18 }}>picture_in_picture</span>
          {isSidebarOpen && <span className="whitespace-nowrap">Toggle Overlay</span>}
        </button>
      </div>
    </nav>
  )
}
