export type SenderNumber = {
  id?: number
  phoneNumber: string
  provider: 'official' | 'unofficial'
  token?: string
  phoneNumberId?: string
  cadenceInMs: number
  lastSentAt?: string
  active: boolean
  createdAt?: string
  updatedAt?: string
  wabaId?: string
}
