import { defineStore } from 'pinia'
import { ref } from 'vue'
import { scoreApi } from '@/api/endpoints'
import { mapLeaderboard } from '@/utils/mappers'
import type { Leaderboard } from '@/types'

export const useLeaderboardStore = defineStore('leaderboard', () => {
    const leaderboard = ref<Leaderboard | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchLeaderboard() {
        loading.value = true
        error.value = null

        try {
            const leaderboardDto = await scoreApi.getLeaderboard()
            leaderboard.value = mapLeaderboard(leaderboardDto)
            return true
        } catch (err: any) {
            error.value = err.message || 'Impossibile caricare la classifica'
            return false
        } finally {
            loading.value = false
        }
    }

    function clearError() {
        error.value = null
    }

    function reset() {
        leaderboard.value = null
        error.value = null
    }

    return {
        leaderboard,
        loading,
        error,
        fetchLeaderboard,
        clearError,
        reset
    }
})
