import React, { useState } from 'react'

const STATUS_COLORS = { pending: '#ff6e84', 'in-progress': '#a7a5ff', done: '#8a4cfc' }

export default function Tasks({ tasks }) {
  const [filter, setFilter] = useState('all')

  const filtered = tasks.filter(t => filter === 'all' || t.status === filter || (!t.status && filter === 'pending'))

  return (
    <div style={{ padding:'40px 48px' }}>
      <div style={{ marginBottom:32 }}>
        <h2 style={{ fontSize:32, fontWeight:700, letterSpacing:'-0.03em', color:'var(--on-surface)', marginBottom:4 }}>Tasks</h2>
        <p style={{ color:'var(--on-surface-variant)', fontSize:14 }}>Action items detected from your meetings</p>
      </div>

      {/* Filter pills */}
      <div style={{ display:'flex', gap:8, marginBottom:24 }}>
        {['all','pending','in-progress','done'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:'8px 16px', borderRadius:30, border:'none', cursor:'pointer', fontSize:12, fontWeight:600,
            textTransform:'capitalize', letterSpacing:'0.03em',
            background: filter===f ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'var(--surface-container)',
            color: filter===f ? '#fff' : 'var(--on-surface-variant)',
          }}>{f}</button>
        ))}
        <span style={{ marginLeft:'auto', fontSize:13, color:'var(--on-surface-variant)', alignSelf:'center' }}>
          {filtered.length} task{filtered.length!==1?'s':''}
        </span>
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 0', color:'var(--on-surface-variant)' }}>
          <span className="material-symbols-outlined" style={{ fontSize:48, opacity:.3, display:'block', marginBottom:12 }}>assignment</span>
          <p style={{ fontSize:15 }}>No tasks here. Start a meeting to detect action items.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {filtered.map((t, i) => (
            <div key={i} style={{ background:'var(--surface-container-low)', borderRadius:16, padding:'18px 20px',
              border:'1px solid rgba(72,71,74,0.2)', display:'flex', alignItems:'center', gap:16,
              transition:'border-color .15s', cursor:'default' }}>
              {/* Status dot */}
              <span style={{ width:10, height:10, borderRadius:'50%', flexShrink:0,
                background: STATUS_COLORS[t.status || 'pending'] }}/>
              {/* Content */}
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, color:'var(--on-surface)', fontWeight:500, marginBottom:4 }}>{t.task}</p>
                <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                  <span style={{ fontSize:12, color:'var(--secondary-dim)' }}>
                    <strong style={{color:'var(--secondary)'}}>{t.assignee}</strong>
                  </span>
                  <span style={{ width:3, height:3, borderRadius:'50%', background:'var(--outline-variant)' }}/>
                  <span style={{ fontSize:11, color:'var(--on-surface-variant)' }}>
                    {Math.round((t.confidence||0)*100)}% confidence
                  </span>
                  <span style={{ width:3, height:3, borderRadius:'50%', background:'var(--outline-variant)' }}/>
                  <span style={{ fontSize:11, color:'var(--on-surface-variant)' }}>
                    {t.timestamp ? new Date(t.timestamp).toLocaleTimeString() : ''}
                  </span>
                </div>
              </div>
              {/* Status badge */}
              <span style={{ padding:'4px 12px', borderRadius:8, fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.04em',
                background:`${STATUS_COLORS[t.status||'pending']}20`, color: STATUS_COLORS[t.status||'pending'] }}>
                {t.status || 'pending'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
