import axios, { AxiosInstance, AxiosError } from 'axios'
import type { AxiosResponse } from 'axios'

const ONBOARDING_API = import.meta.env.VITE_ONBOARDING_API || 'http://localhost:3000'
const TRANSACTION_API = import.meta.env.VITE_TRANSACTION_API || 'http://localhost:3001'

interface ApiErrorResponse {
  status: string
  code: number
  message: string
  errors?: Array<{
    field?: string
    message: string
  }>
}

// Create separate clients for each service
export const onboardingClient: AxiosInstance = axios.create({
  baseURL: ONBOARDING_API,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const transactionClient: AxiosInstance = axios.create({
  baseURL: TRANSACTION_API,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
const setupRequestInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      config.headers['X-Requested-With'] = 'XMLHttpRequest'
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}

// Response interceptor - handle errors
const setupResponseInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
      if (error.response?.status === 401) {
        // Unauthorized - clear token and redirect
        localStorage.removeItem('authToken')
        window.location.href = '/login'
        return Promise.reject(new Error('Unauthorized - please login again'))
      }

      if (error.response?.status === 403) {
        return Promise.reject(new Error('Forbidden - insufficient permissions'))
      }

      if (error.response?.status === 404) {
        return Promise.reject(new Error('Resource not found'))
      }

      if (error.response?.status === 422) {
        const apiError = error.response.data
        const errorMessages = apiError.errors?.map((e) => e.message).join(', ')
        return Promise.reject(new Error(errorMessages || 'Validation failed'))
      }

      if (error.response?.status && error.response.status >= 500) {
        return Promise.reject(new Error('Server error - please try again later'))
      }

      return Promise.reject(error)
    }
  )
}

// Setup interceptors for both clients
setupRequestInterceptor(onboardingClient)
setupResponseInterceptor(onboardingClient)
setupRequestInterceptor(transactionClient)
setupResponseInterceptor(transactionClient)

export { AxiosResponse, AxiosError }
