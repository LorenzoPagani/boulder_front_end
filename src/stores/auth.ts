import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/api/endpoints'
import { apiClient } from '@/api/client'
import { mapAthlete } from '@/utils/mappers'
import type { Athlete, LoginRequestDto } from '@/types'

export const useAuthStore = defineStore('auth', () => {
    const athlete = ref<Athlete | null>(null)
    const isAuthenticated = ref(false)
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function login(credentials: LoginRequestDto) {
        loading.value = true
        error.value = null

        try {
            const response = await authApi.login(credentials)

            // Save token
            apiClient.setToken(response.token)

            // Save athlete
            athlete.value = mapAthlete(response.athlete)
            isAuthenticated.value = true

            return true
        } catch (err: any) {
            error.value = err.message || 'Login fallito'
            isAuthenticated.value = false
            athlete.value = null
            return false
        } finally {
            loading.value = false
        }
    }

    async function logout() {
        loading.value = true
        error.value = null

        try {
            await authApi.logout()
        } catch (err: any) {
            // Ignore logout errors, clear state anyway
            console.error('Logout error:', err)
        } finally {
            // Clear state
            athlete.value = null
            isAuthenticated.value = false
            apiClient.clearToken()
            loading.value = false
        }
    }

    async function loadSession() {
        const token = apiClient.getToken()

        if (!token) {
            isAuthenticated.value = false
            athlete.value = null
            return false
        }

        loading.value = true
        error.value = null

        try {
            const athleteDto = await authApi.me()
            athlete.value = mapAthlete(athleteDto)
            isAuthenticated.value = true
            return true
        } catch (err: any) {
            // Token invalid or expired
            error.value = err.message
            athlete.value = null
            isAuthenticated.value = false
            apiClient.clearToken()
            return false
        } finally {
            loading.value = false
        }
    }

    function clearError() {
        error.value = null
    }

    return {
        athlete,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        loadSession,
        clearError
    }
})
