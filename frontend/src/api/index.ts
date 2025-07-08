import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import router from '@/router'

// Instância do Axios com baseURL do .env
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 60000,
})

// Intercepta requisições para adicionar o token
// http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   const token = localStorage.getItem('access_token')
//   if (token) {
//     config.headers = config.headers || {}
//   }
//   return config
// })

// // Intercepta respostas e trata erros
// http.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   async (error) => {
//     const status = error?.response?.status

//     if (status === 401) {
//       localStorage.removeItem('access_token')
//       localStorage.removeItem('user')

//       try {
//         await router.push({ name: 'Login' })
//       } catch (pushError) {
//         console.warn('Erro ao redirecionar para login:', pushError)
//       }
//     }

//     return Promise.reject(error)
//   }
// )

export default http
