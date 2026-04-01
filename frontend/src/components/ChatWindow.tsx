import { useState } from 'react'
import { sendMessage, type ChatResponse, type Source } from '../api/client'

interface Message {
  role: 'user' | 'bot'
  text: string
  sources?: Source[]
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSend() {
    const question = input.trim()
    if (!question || loading) return

    setMessages(prev => [...prev, { role: 'user', text: question }])
    setInput('')
    setLoading(true)

    try {
      const res: ChatResponse = await sendMessage(question)
      setMessages(prev => [...prev, {
        role: 'bot',
        text: res.answer,
        sources: res.sources
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: 'Something went wrong. Is the API running?'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', minHeight: 0 }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.length === 0 && (
          <p style={{ color: 'var(--secondary)', fontSize: '13px', textAlign: 'center', marginTop: '40px' }}>
            Upload a policy PDF and ask a question.
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              background: msg.role === 'user' ? '#3EA86E' : '#f4f4f4',
              color: msg.role === 'user' ? '#fff' : '#111',
              fontSize: '13px',
              lineHeight: 1.6,
              textAlign: msg.role === 'user' ? 'right' : 'left',
            }}>
              {msg.text}
            </div>
            {msg.sources && msg.sources.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                {msg.sources.map((s, j) => (
                  <span key={j} style={{
                    background: '#E6F1FB',
                    color: '#3EA86E',
                    fontSize: '11px',
                    fontWeight: 500,
                    padding: '3px 8px',
                    borderRadius: '4px',
                  }}>
                    {s.fileName} · chunk {s.chunkIndex}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', fontSize: '13px', color: 'var(--secondary)', padding: '10px 14px' }}>
            Thinking...
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px', flexShrink: 0, borderTop: '0.5px solid #e5e5e5', display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about a policy..."
          style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '0.5px solid #ddd', fontSize: '13px', outline: 'none' }}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px' }}
          onMouseOver={e => (e.currentTarget.style.background = 'var(--buttonhover)')}
          onMouseOut={e => (e.currentTarget.style.background = 'var(--primary)')}
        >
          Send
        </button>
      </div>
    </div>
  )
}