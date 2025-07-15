import axios, { type AxiosInstance } from 'axios'

// Instância do Axios com baseURL do .env
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 60000,
})

export default http
