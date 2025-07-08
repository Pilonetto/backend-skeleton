export type Campaign = {
  id: number
  name: string
  type: 'text' | 'media'
  status: 'scheduled' | 'pending' | 'executing' | 'completed' | 'failed'
  scheduledAt?: string
  createdAt: string
}
