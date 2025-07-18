import axios, { type AxiosInstance } from 'axios'

// Instância do Axios com baseURL do .env
// const http: AxiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || 'https://app.ainternetgroup.com',
//   timeout: 60000,
// })

const http: AxiosInstance = axios.create({
  baseURL: 'https://app.ainternetgroup.com',
  timeout: 60000,
})

export default http
