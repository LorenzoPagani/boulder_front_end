import axios, { type AxiosInstance, type AxiosError } from 'axios'
import type { ApiResponse } from '@/types'
import router from '@/router'

class ApiClient {
    private client: AxiosInstance
    private tokenKey = 'boulder_token'

    constructor() {
        this.client = axios.create({
            baseURL: '/api',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })

        this.setupInterceptors()
    }

    private setupInterceptors() {
        // Request interceptor - add Bearer token
        this.client.interceptors.request.use(
            (config) => {
                const token = this.getToken()
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            (error) => Promise.reject(error)
        )

        // Response interceptor - handle errors
        this.client.interceptors.response.use(
            (response) => {
                // Check if response has success field
                const data = response.data as ApiResponse

                if (data.success === false) {
                    // Backend returned success: false
                    throw new Error(data.message || 'Operation failed')
                }

                return response
            },
            (error: AxiosError<ApiResponse>) => {
                // Handle HTTP errors
                if (error.response) {
                    const status = error.response.status
                    const data = error.response.data

                    // 401 Unauthorized - clear token and redirect to login
                    if (status === 401) {
                        this.clearToken()
                        if (router.currentRoute.value.path !== '/login') {
                            router.push('/login')
                        }
                        throw new Error(data?.message || 'Non autorizzato. Effettua il login.')
                    }

                    // 429 Too Many Requests
                    if (status === 429) {
                        throw new Error('Troppe richieste. Riprova tra qualche istante.')
                    }

                    // 422 Validation Error
                    if (status === 422) {
                        throw new Error(data?.message || 'Errore di validazione.')
                    }

                    // Other errors
                    throw new Error(data?.message || `Errore: ${status}`)
                }

                // Network error
                if (error.request) {
                    throw new Error('Impossibile contattare il server. Verifica che il backend sia attivo.')
                }

                throw new Error(error.message || 'Errore sconosciuto')
            }
        )
    }

    // Token management
    public setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token)
    }

    public getToken(): string | null {
        return localStorage.getItem(this.tokenKey)
    }

    public clearToken(): void {
        localStorage.removeItem(this.tokenKey)
    }

    // HTTP methods
    public async get<T>(url: string): Promise<T> {
        const response = await this.client.get<ApiResponse<T>>(url)
        return response.data.data as T
    }

    public async post<T>(url: string, data?: any): Promise<T> {
        const response = await this.client.post<ApiResponse<T>>(url, data)
        return response.data.data as T
    }

    public async put<T>(url: string, data?: any): Promise<T> {
        const response = await this.client.put<ApiResponse<T>>(url, data)
        return response.data.data as T
    }

    public async delete<T>(url: string): Promise<T> {
        const response = await this.client.delete<ApiResponse<T>>(url)
        return response.data.data as T
    }
}

export const apiClient = new ApiClient()
