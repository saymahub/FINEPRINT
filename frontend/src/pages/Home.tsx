import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import logo from '../assets/quill-black.svg'

export default function Home() {
  const navigate = useNavigate()
  const wallText = useRef<HTMLDivElement>(null)
  const [snippets, setSnippets] = useState<{ h: string; p: string }[]>([])
  
  useEffect(() => {
    fetch('/policy-snippets.txt')
      .then(res => res.text())
      .then(text => {
        const parsed = text
          .split('\n')
          .filter(line => line.trim())
          .map(line => {
            const [h, p] = line.split('-')
            return { h: h.trim(), p: p.trim() }
          })
        setSnippets(parsed)
      })
  }, [])

  useEffect(() => {
    if (!wallText.current || snippets.length === 0) return

    wallText.current.innerHTML = ''

    for (let c = 0; c < 5; c++) {
      const col = document.createElement('div')
      col.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 20px;
        font-size: 11px;
        line-height: 1.7;
        color: var(--secondary);
        width: 360px;
        flex-shrink: 0;
        animation: ${c % 2 === 0 ? 'scrollUp' : 'scrollDown'} ${c % 2 === 0 ? 22 : 28}s linear infinite;
      `
      const doubled = [...snippets, ...snippets].sort(() => Math.random() - 0.5)
      doubled.forEach(s => {
        col.innerHTML += `
          <div>
            <p style="font-size:10px;font-weight:600;color:var(--primarydark);text-transform:uppercase;letter-spacing:0.5px;margin:0 0 4px">${s.h}</p>
            <p style="margin:0">${s.p}</p>
          </div>`
      })
      wallText.current.appendChild(col)
    }
  }, [snippets])


  return (
    <>
      <style>{`
        @keyframes scrollUp   { from { transform: translateY(0); } to { transform: translateY(-50%); } }
        @keyframes scrollDown { from { transform: translateY(-50%); } to { transform: translateY(0); } }
      `}</style>

      <div className="font-domine" style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#f8f7f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Scrolling text wall */}
        <div ref={wallText} style={{ position: 'absolute', inset: 0, display: 'flex', gap: '20px', padding: '0 16px', pointerEvents: 'none' }} />

        {/* Blur overlay */}
        <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(3px)', background: 'rgba(248,247,245,0.45)' }} />

        {/* Content card */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          background: 'rgba(255,255,255,0.92)',
          border: '0.5px solid #e0ddd8',
          borderRadius: '16px',
          padding: '40px 48px',
          textAlign: 'center',
          maxWidth: '380px',
          width: '100%',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        }}>
          <img src={logo} alt="FinePrint Logo" style={{ width: '125px', display: 'block', margin: '0 auto 20px', translate: '20px'}}/>
        <h1 className="font-inktype" style={{ color: 'var(--primarydark)', fontSize: '60px', fontWeight: 700, letterSpacing: '-1px', margin: 0 }}>
          Fine<span style={{ color: 'var(--primary)' }}>Print</span>
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--secondary)', marginTop: '15px', marginBottom: '10px', maxWidth: '340px', lineHeight: 1.2 }}>
          Check policy coverage in seconds, we'll read the fine print for you.
        </p>
          <button
            onClick={() => navigate('/chat')}
            style={{ padding: '11px 40px', background: 'var(--primary)', color: 'var(--bglight)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', letterSpacing: '0.2px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}
            onMouseOver={e => (e.currentTarget.style.background = 'var(--buttonhover)')}
            onMouseOut={e => (e.currentTarget.style.background = 'var(--primary)')}
          >
            Start Chatting
          </button>
          <p style={{ fontSize: '11px', color: 'var(--secondarylight)', marginTop: '20px' }}>
            Powered by RAG · pgvector · GPT-4o mini
          </p>
        </div>
      </div>
    </>
  )
}