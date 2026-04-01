import { useRef, useState } from 'react'
import { uploadDocument } from '../api/client'

interface Props {
  onUploaded: (filename: string) => void
}

export default function DocumentUploader({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    if (!file.name.endsWith('.pdf')) {
      setError('Only PDF files are supported!')
      return
    }
    setUploading(true)
    setError(null)
    try {
      await uploadDocument(file)
      onUploaded(file.name)
    } catch {
      setError('Upload failed. Check API status')
    } finally {
      setUploading(false)
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={e => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      style={{
        margin: '12px',
        border: '0.5px dashed #888',
        borderRadius: '8px',
        padding: '16px 12px',
        textAlign: 'center',
        cursor: uploading ? 'wait' : 'pointer',
        background: 'var(--color-background-primary, #fff)',
        opacity: uploading ? 0.6 : 1,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <p style={{ fontWeight: 500, fontSize: '13px', marginBottom: '4px' }}>
        {uploading ? 'Uploading...' : 'Upload policy PDF'}
      </p>
      <p style={{ fontSize: '12px', color: '#888' }}>
        Drop or click to browse
      </p>
      {error && (
        <p style={{ fontSize: '12px', color: 'red', marginTop: '6px' }}>{error}</p>
      )}
    </div>
  )
}