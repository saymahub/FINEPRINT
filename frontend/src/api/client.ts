import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5082'
})

export interface Source {
  fileName: string
  chunkIndex: number
}

export interface ChatResponse {
  answer: string
  sources: Source[]
}

// upload doc api
export async function uploadDocument(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await api.post('/api/documents/upload', formData)
  return res.data.message
}

// send wuestion api
export async function sendMessage(question: string): Promise<ChatResponse> {
  const res = await api.post('/api/chat', { question })
  return res.data
}

export async function listDocuments(): Promise<string[]> {
  try {
    const res = await api.get('/api/documents/list')
    return res.data
  } catch {
    return []
  }
}