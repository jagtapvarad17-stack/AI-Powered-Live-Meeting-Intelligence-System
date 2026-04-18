import React from 'react'
import { useNavigate } from 'react-router-dom'

const card = {
  background: 'var(--surface-container-low)', borderRadius: 20,
  padding: '24px', position: 'relative', overflow: 'hidden',
}
const gradOverlay = {
  position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.02),transparent)',
  pointerEvents:'none',
}

function StatCard({ label, value, icon, color, sub }) {
  return (
    <div style={card}>
      <div style={gradOverlay}/>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <span style={{ fontSize:11, textTransform:'uppercase', letterSpacing:'0.05em', color:'var(--on-surface-variant)', fontWeight:600 }}>{label}</span>
        <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--surface-container-high)',
          display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(72,71,74,0.2)' }}>
          <span className="material-symbols-outlined" style={{ fontSize:16, color }}>{icon}</span>
        </div>
      </div>
      <div style={{ fontSize:40, fontWeight:700, letterSpacing:'-0.03em', color:'var(--on-surface)', lineHeight:1 }}>{value}</div>
      <div style={{ marginTop:8, fontSize:12, color:'var(--on-surface-variant)', display:'flex', alignItems:'center', gap:4 }}>{sub}</div>
    </div>
  )
}

export default function Dashboard({ recording, transcript, tasks, summary, meetings, startRecording, stopRecording }) {
  const navigate = useNavigate()

  const handleStart = async () => {
    await startRecording('Dashboard Meeting')
    navigate('/live')
  }

  return (
    <div style={{ padding:'40px 48px', maxWidth:1200 }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:40 }}>
        <div>
          <h2 style={{ fontSize:36, fontWeight:700, letterSpacing:'-0.03em', color:'var(--on-surface)', marginBottom:4 }}>Overview</h2>
          <p style={{ color:'var(--on-surface-variant)', fontSize:14 }}>Passive intelligence gathering {recording ? 'active.' : 'idle.'}</p>
        </div>
        <button onClick={recording ? stopRecording : handleStart}
          style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 24px',
            background: recording ? 'linear-gradient(135deg,#a70138,#d73357)' : 'linear-gradient(135deg,#4f46e5,#7c3aed)',
            border:'none', borderRadius:12, color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer',
            boxShadow:'0 8px 24px rgba(79,70,229,0.3)', transition:'opacity .15s' }}
          onMouseEnter={e=>e.currentTarget.style.opacity='.85'}
          onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
          <span className="material-symbols-outlined" style={{ fontSize:18, position:'relative' }}>
            {recording ? 'stop_circle' : 'mic'}
          </span>
          {recording ? 'Stop Recording' : 'Start Background Recording'}
          {recording && <span style={{ width:8, height:8, borderRadius:'50%', background:'#fff' }} className="animate-pulse"/>}
        </button>
      </div>

      {/* Bento grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20, marginBottom:24 }}>
        <StatCard label="Meetings Recorded" value={meetings.length || 124} icon="mic_external_on" color="var(--primary-dim)"
          sub={<><span className="material-symbols-outlined" style={{fontSize:12,color:'var(--primary-dim)'}}>trending_up</span>+{meetings.length} this session</>}/>
        <StatCard label="Tasks Detected" value={tasks.length || 0} icon="check_circle" color="var(--secondary-dim)"
          sub={<><span className="material-symbols-outlined" style={{fontSize:12,color:'var(--secondary-dim)'}}>auto_awesome</span>Real-time detection</>}/>
        <StatCard label="Pending Tasks" value={tasks.filter(t=>!t.done).length || 0} icon="pending_actions" color="var(--tertiary-dim)"
          sub={<><span className="material-symbols-outlined" style={{fontSize:12,color:'var(--error-dim)'}}>priority_high</span>{tasks.filter(t=>t.confidence>0.8).length} high confidence</>}/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:20 }}>
        {/* AI Insights */}
        <div style={{ background:'rgba(96,1,209,0.15)', borderRadius:20, padding:24, border:'1px solid rgba(96,1,209,0.25)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, right:0, width:120, height:120, background:'rgba(138,76,252,0.2)', borderRadius:'50%', filter:'blur(40px)', transform:'translate(50%,-50%)' }}/>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
            <span className="material-symbols-outlined" style={{ color:'var(--secondary-dim)', fontVariationSettings:"'FILL' 1" }}>psychology</span>
            <h3 style={{ fontSize:13, fontWeight:600, color:'var(--on-surface)' }}>Active AI Insights</h3>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ background:'rgba(25,25,28,0.5)', borderRadius:12, padding:16, border:'1px solid rgba(72,71,74,0.15)' }}>
              <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--primary-dim)', marginTop:5, flexShrink:0 }} className="animate-pulse"/>
                <div>
                  <p style={{ fontSize:13, color:'var(--on-surface)', fontWeight:500, marginBottom:4 }}>{tasks.length} Action Items Detected</p>
                  <p style={{ fontSize:12, color:'var(--on-surface-variant)', lineHeight:1.5 }}>From current live session.</p>
                </div>
              </div>
            </div>
            <div style={{ background:'rgba(25,25,28,0.5)', borderRadius:12, padding:16, border:'1px solid rgba(72,71,74,0.15)' }}>
              <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--secondary-dim)', marginTop:5, flexShrink:0 }}/>
                <div>
                  <p style={{ fontSize:13, color:'var(--on-surface)', fontWeight:500, marginBottom:4 }}>
                    {recording ? 'Live transcription running' : 'Ready to record'}
                  </p>
                  <p style={{ fontSize:12, color:'var(--on-surface-variant)', lineHeight:1.5 }}>{summary || 'Start a recording to see insights.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Meetings */}
        <div style={{ background:'var(--surface-container-low)', borderRadius:20, padding:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 style={{ fontSize:13, fontWeight:600, color:'var(--on-surface)' }}>Recent Meetings</h3>
            <button style={{ fontSize:12, color:'var(--on-surface-variant)', background:'none', border:'none', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.05em' }}>View All</button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {meetings.length === 0 ? (
              <p style={{ color:'var(--on-surface-variant)', fontSize:13, padding:'20px 0', textAlign:'center' }}>No meetings recorded yet.</p>
            ) : meetings.slice(0,5).map((m, i) => (
              <div key={m._id || i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px',
                borderRadius:12, cursor:'pointer', border:'1px solid transparent', transition:'all .15s',
                ':hover':{ background:'var(--surface-container-high)' } }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:'var(--surface-container)',
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize:18, color:'var(--on-surface-variant)' }}>groups</span>
                  </div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:500, color:'var(--on-surface)', marginBottom:2 }}>{m.title || 'Meeting'}</p>
                    <p style={{ fontSize:11, color:'var(--on-surface-variant)', textTransform:'uppercase', letterSpacing:'0.04em' }}>
                      {new Date(m.startedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 10px',
                  background:'rgba(96,1,209,0.15)', borderRadius:8, border:'1px solid rgba(96,1,209,0.25)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:12, color:'var(--secondary-dim)' }}>auto_awesome</span>
                  <span style={{ fontSize:11, color:'var(--secondary-dim)', textTransform:'uppercase', letterSpacing:'0.04em' }}>
                    {m.status === 'completed' ? 'Processed' : 'Active'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
