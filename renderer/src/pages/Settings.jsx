import React from 'react'

const Section = ({ title, children }) => (
  <div style={{ background:'var(--surface-container-low)', borderRadius:20, padding:28, marginBottom:20,
    border:'1px solid rgba(72,71,74,0.2)' }}>
    <h3 style={{ fontSize:14, fontWeight:600, color:'var(--on-surface)', marginBottom:20, letterSpacing:'-0.01em' }}>{title}</h3>
    {children}
  </div>
)

const Row = ({ label, children }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0',
    borderBottom:'1px solid rgba(72,71,74,0.15)' }}>
    <span style={{ fontSize:13, color:'var(--on-surface-variant)' }}>{label}</span>
    {children}
  </div>
)

export default function Settings() {
  return (
    <div style={{ padding:'40px 48px', maxWidth:700 }}>
      <div style={{ marginBottom:32 }}>
        <h2 style={{ fontSize:32, fontWeight:700, letterSpacing:'-0.03em', marginBottom:4 }}>Settings</h2>
        <p style={{ fontSize:14, color:'var(--on-surface-variant)' }}>Configure Observer AI behaviour</p>
      </div>

      <Section title="Recording">
        <Row label="Microphone source">
          <select style={{ background:'var(--surface-container)', color:'var(--on-surface)', border:'1px solid rgba(72,71,74,0.4)',
            borderRadius:8, padding:'6px 12px', fontSize:13, cursor:'pointer' }}>
            <option>Default Microphone</option>
          </select>
        </Row>
        <Row label="Screenshot interval (seconds)">
          <input type="number" defaultValue={8} min={5} max={60}
            style={{ width:70, background:'var(--surface-container)', color:'var(--on-surface)',
              border:'1px solid rgba(72,71,74,0.4)', borderRadius:8, padding:'6px 10px', fontSize:13, textAlign:'center' }}/>
        </Row>
        <Row label="Auto-start when Zoom/Meet opens">
          <label style={{ position:'relative', display:'inline-flex', alignItems:'center', cursor:'pointer', gap:10 }}>
            <input type="checkbox" style={{ width:18, height:18, accentColor:'#645efb' }}/>
            <span style={{ fontSize:13, color:'var(--on-surface-variant)' }}>Enable</span>
          </label>
        </Row>
      </Section>

      <Section title="AI & Transcription">
        <Row label="Transcription mode">
          <select style={{ background:'var(--surface-container)', color:'var(--on-surface)', border:'1px solid rgba(72,71,74,0.4)',
            borderRadius:8, padding:'6px 12px', fontSize:13 }}>
            <option>Whisper (OpenAI)</option>
            <option>Mock (Demo)</option>
          </select>
        </Row>
        <Row label="Summary frequency (seconds)">
          <input type="number" defaultValue={30} min={15} max={120}
            style={{ width:70, background:'var(--surface-container)', color:'var(--on-surface)',
              border:'1px solid rgba(72,71,74,0.4)', borderRadius:8, padding:'6px 10px', fontSize:13, textAlign:'center' }}/>
        </Row>
        <Row label="Summary model">
          <select style={{ background:'var(--surface-container)', color:'var(--on-surface)', border:'1px solid rgba(72,71,74,0.4)',
            borderRadius:8, padding:'6px 12px', fontSize:13 }}>
            <option>gpt-4o-mini</option>
            <option>gpt-4o</option>
            <option>Mock</option>
          </select>
        </Row>
      </Section>

      <Section title="Overlay">
        <Row label="Always on top">
          <input type="checkbox" defaultChecked style={{ width:18, height:18, accentColor:'#645efb' }}/>
        </Row>
        <Row label="Start position">
          <select style={{ background:'var(--surface-container)', color:'var(--on-surface)', border:'1px solid rgba(72,71,74,0.4)',
            borderRadius:8, padding:'6px 12px', fontSize:13 }}>
            <option>Top Right</option>
            <option>Top Left</option>
            <option>Bottom Right</option>
          </select>
        </Row>
      </Section>

      <Section title="Database">
        <Row label="MongoDB URI">
          <input type="text" placeholder="mongodb://127.0.0.1:27017/meeting_intelligence"
            style={{ width:340, background:'var(--surface-container)', color:'var(--on-surface)',
              border:'1px solid rgba(72,71,74,0.4)', borderRadius:8, padding:'8px 12px', fontSize:13 }}/>
        </Row>
      </Section>
    </div>
  )
}
