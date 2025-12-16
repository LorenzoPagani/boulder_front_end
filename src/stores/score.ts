import { defineStore } from 'pinia'
import { ref } from 'vue'
import { scoreApi } from '@/api/endpoints'
import { mapScoreDetails } from '@/utils/mappers'
import type { ScoreSummary, ScoreDetails } from '@/types'

export const useScoreStore = defineStore('score', () => {
    const summary = ref<ScoreSummary | null>(null)
    const details = ref<ScoreDetails | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchScore() {
        loading.value = true
        error.value = null

        try {
            const scoreDto = await scoreApi.getScore()
            // Backend usa 'score' invece di 'totalScore'
            summary.value = {
                totalScore: scoreDto.score,
                totalBlocks: scoreDto.totalBlocks,
                completedBlocks: scoreDto.completedBlocks,
                averageScore: scoreDto.completedBlocks > 0 ? scoreDto.score / scoreDto.completedBlocks : 0
            }
            return true
        } catch (err: any) {
            error.value = err.message || 'Impossibile caricare il punteggio'
            return false
        } finally {
            loading.value = false
        }
    }

    async function fetchScoreDetails() {
        loading.value = true
        error.value = null

        try {
            const detailsDto = await scoreApi.getScoreDetails()
            // Passiamo anche il summary se disponibile per avere dati consistenti
            details.value = mapScoreDetails(detailsDto, summary.value ? {
                score: summary.value.totalScore,
                totalBlocks: summary.value.totalBlocks,
                completedBlocks: summary.value.completedBlocks
            } : undefined)
            return true
        } catch (err: any) {
            error.value = err.message || 'Impossibile caricare i dettagli del punteggio'
            return false
        } finally {
            loading.value = false
        }
    }

    function clearError() {
        error.value = null
    }

    function reset() {
        summary.value = null
        details.value = null
        error.value = null
    }

    return {
        summary,
        details,
        loading,
        error,
        fetchScore,
        fetchScoreDetails,
        clearError,
        reset
    }
})
