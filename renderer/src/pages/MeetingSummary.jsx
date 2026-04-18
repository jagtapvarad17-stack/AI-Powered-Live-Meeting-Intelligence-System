import React, { useState } from 'react'

export default function MeetingSummary({ meetings }) {
  const [selected, setSelected] = useState(null)
  const meeting = selected !== null ? meetings[selected] : null

  return (
    <div style={{ padding:'40px 48px', display:'flex', gap:24, height:'100%' }}>
      {/* List */}
      <div style={{ width:300, flexShrink:0 }}>
        <h2 style={{ fontSize:28, fontWeight:700, letterSpacing:'-0.03em', marginBottom:8 }}>Summaries</h2>
        <p style={{ fontSize:14, color:'var(--on-surface-variant)', marginBottom:24 }}>Post-meeting AI analysis</p>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {meetings.length === 0 && (
            <p style={{ fontSize:13, color:'var(--on-surface-variant)', padding:'20px 0' }}>No completed meetings yet.</p>
          )}
          {meetings.map((m, i) => (
            <button key={m._id||i} onClick={() => setSelected(i)} style={{
              background: selected===i ? 'linear-gradient(135deg,rgba(79,70,229,0.3),rgba(124,58,237,0.3))' : 'var(--surface-container-low)',
              border: `1px solid ${selected===i ? 'rgba(79,70,229,0.5)' : 'rgba(72,71,74,0.2)'}`,
              borderRadius:14, padding:'14px 16px', textAlign:'left', cursor:'pointer', width:'100%',
              transition:'all .15s',
            }}>
              <p style={{ fontSize:13, fontWeight:500, color:'var(--on-surface)', marginBottom:4 }}>{m.title||'Meeting'}</p>
              <p style={{ fontSize:11, color:'var(--on-surface-variant)', textTransform:'uppercase', letterSpacing:'0.04em' }}>
                {new Date(m.startedAt).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div style={{ flex:1, background:'var(--surface-container-low)', borderRadius:20, padding:32, overflowY:'auto',
        border:'1px solid rgba(72,71,74,0.2)' }}>
        {!meeting ? (
          <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center',
            flexDirection:'column', color:'var(--on-surface-variant)', gap:12 }}>
            <span className="material-symbols-outlined" style={{ fontSize:48, opacity:.3 }}>receipt_long</span>
            <p>Select a meeting to view its summary</p>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize:22, fontWeight:700, letterSpacing:'-0.02em', marginBottom:4 }}>{meeting.title}</h3>
            <p style={{ fontSize:13, color:'var(--on-surface-variant)', marginBottom:28 }}>
              {new Date(meeting.startedAt).toLocaleString()} {meeting.endedAt ? `→ ${new Date(meeting.endedAt).toLocaleTimeString()}` : '(ongoing)'}
            </p>

            {/* Summary */}
            <div style={{ background:'rgba(96,1,209,0.1)', borderRadius:16, padding:20, marginBottom:24,
              border:'1px solid rgba(96,1,209,0.2)' }}>
              <h4 style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--primary)',
                fontWeight:600, marginBottom:12, display:'flex', gap:6 }}>
                <span className="material-symbols-outlined" style={{ fontSize:14 }}>auto_awesome</span>AI Summary
              </h4>
              <p style={{ fontSize:14, color:'var(--on-surface)', lineHeight:1.7 }}>
                {meeting.summary || 'No summary generated yet.'}
              </p>
            </div>

            {/* Transcript */}
            {meeting.transcript && (
              <div style={{ marginBottom:24 }}>
                <h4 style={{ fontSize:12, textTransform:'uppercase', letterSpacing:'0.06em',
                  color:'var(--on-surface-variant)', fontWeight:600, marginBottom:12 }}>Full Transcript</h4>
                <div style={{ background:'var(--surface-container)', borderRadius:14, padding:20,
                  fontSize:13, color:'var(--on-surface)', lineHeight:1.8, maxHeight:300, overflowY:'auto' }}>
                  {meeting.transcript}
                </div>
              </div>
            )}

            {/* Tasks from this meeting */}
            {meeting.tasks?.length > 0 && (
              <div>
                <h4 style={{ fontSize:12, textTransform:'uppercase', letterSpacing:'0.06em',
                  color:'var(--on-surface-variant)', fontWeight:600, marginBottom:12 }}>Action Items</h4>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {meeting.tasks.map((t, i) => (
                    <div key={i} style={{ display:'flex', gap:12, padding:'10px 14px',
                      background:'var(--surface-container)', borderRadius:10 }}>
                      <span className="material-symbols-outlined" style={{ fontSize:16, color:'var(--secondary-dim)', marginTop:2 }}>task_alt</span>
                      <div>
                        <p style={{ fontSize:13, color:'var(--on-surface)' }}>{t.task||t}</p>
                        {t.assignee && <p style={{ fontSize:11, color:'var(--secondary-dim)', marginTop:2 }}>→ {t.assignee}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
