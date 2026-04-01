import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DocumentUploader from '../components/DocumentUploader'
import ChatWindow from '../components/ChatWindow'
import { listDocuments } from '../api/client'

export default function Chat() {
  const navigate = useNavigate()
  const [docs, setDocs] = useState<string[]>([])
  const [loadingDocs, setLoadingDocs] = useState(true)

  useEffect(() => {
    listDocuments()
      .then(files => setDocs(files))
      .finally(() => setLoadingDocs(false))
  }, [])

  return (
    <div className="font-domine" style={{ display: 'flex', height: '100vh', overflow: 'hidden', }}>
      <div style={{ width: '240px', borderRight: '0.5px solid #e5e5e5', display: 'flex', flexDirection: 'column', background: '#fafafa' }}>
        <div className="translate-y-[10px]" style={{ padding: '14px 16px', borderBottom: '0.5px solid #e5e5e5' }}>
          <span 
            className="font-inktype" 
            onClick={() => navigate('/')}
            style={{ color: 'var(--primarydark)', fontWeight: 600, fontSize: '30px', letterSpacing: '-0.3px', cursor: 'pointer', }}>
            Fine<span style={{ color: 'var(--primary)' }}>Print</span>
          </span>
        </div>
        <DocumentUploader onUploaded={name => setDocs(prev => [...prev, name])} />
        <div style={{ padding: '4px 8px' }}>
          <p style={{ fontSize: '11px', color: '#aaa', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Loaded policies
          </p>


          {loadingDocs && (
            <p style={{ fontSize: '12px', color: '#bbb', padding: '4px 8px' }}>Loading...</p>
          )}

          {!loadingDocs && docs.length === 0 && (
            <p style={{ fontSize: '12px', color: '#bbb', padding: '4px 8px' }}>None yet</p>
          )}

          {!loadingDocs && docs.map((doc, i) => (
            <div key={i} style={{
              padding: '8px',
              fontSize: '12px',
              color: '#333',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '3px solid #afaaaa',
              marginBottom: '5px',
            }}>
              {doc}
            </div>
          ))}


        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',}}>
        <div style={{ padding: '14px 20px', borderBottom: '0.5px solid #e5e5e5' }}>
          <p style={{ fontWeight: 500, fontSize: '14px' }}>Claims assistant</p>
          <p style={{ fontSize: '12px', color: '#aaa' }}>Ask questions about loaded policy documents</p>
        </div>
        <ChatWindow />
      </div>
    </div>
  )
}