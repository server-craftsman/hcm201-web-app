import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from 'axios'
import appConfig from '@/core/config/app.config'

export interface ApiClientOptions {
    baseURL?: string
    getToken?: () => string | null
}

const defaultOptions: ApiClientOptions = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:51213/api',
    getToken: () => (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null),
}

export class ApiClient {
    private axios: AxiosInstance

    constructor(options: ApiClientOptions = {}) {
        const merged = { ...defaultOptions, ...options }
        this.axios = axios.create({ baseURL: merged.baseURL, withCredentials: true })

        this.axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            const token = merged.getToken?.()
            if (token) {
                // Ensure headers is an AxiosHeaders instance to avoid TS mismatch
                config.headers = config.headers || new AxiosHeaders()
                if (typeof (config.headers as any).set === 'function') {
                    ; (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`)
                } else {
                    ; (config.headers as any)['Authorization'] = `Bearer ${token}`
                }
            }
            return config
        })
    }

    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axios.get<T>(url, config)
    }

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axios.post<T>(url, data, config)
    }

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axios.put<T>(url, data, config)
    }

    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axios.patch<T>(url, data, config)
    }

    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.axios.delete<T>(url, config)
    }
}

export const apiClient = new ApiClient()


