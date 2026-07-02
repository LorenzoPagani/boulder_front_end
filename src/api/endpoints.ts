import { apiClient } from './client'
import { mockModeEnabled } from '@/utils/mockMode'
import { mockAuthApi, mockBlocksApi, mockScoreApi } from '@/mocks/mockClient'
import type {
    LoginRequestDto,
    LoginResponseDto,
    AthleteDto,
    BlockDto,
    ScoreResponseDto,
    ScoreDetailsResponseDto,
    LeaderboardResponseDto
} from '@/types'

// ============================================
// Auth Endpoints
// ============================================

export const authApi = {
    async login(credentials: LoginRequestDto): Promise<LoginResponseDto> {
        if (mockModeEnabled.value) return mockAuthApi.login(credentials)
        return apiClient.post<LoginResponseDto>('/auth/login', credentials)
    },

    async logout(): Promise<void> {
        if (mockModeEnabled.value) {
            await mockAuthApi.logout()
            apiClient.clearToken()
            return
        }
        await apiClient.post<void>('/auth/logout')
        apiClient.clearToken()
    },

    async me(): Promise<AthleteDto> {
        if (mockModeEnabled.value) return mockAuthApi.me()
        return apiClient.get<AthleteDto>('/auth/me')
    }
}

// ============================================
// Blocks Endpoints
// ============================================

export const blocksApi = {
    async getBlocks(): Promise<BlockDto[]> {
        if (mockModeEnabled.value) return mockBlocksApi.getBlocks()
        return apiClient.get<BlockDto[]>('/blocks')
    },

    async toggleComplete(blockId: number): Promise<BlockDto[]> {
        if (mockModeEnabled.value) return mockBlocksApi.toggleComplete(blockId)
        return apiClient.post<BlockDto[]>(`/blocks/${blockId}/complete`)
    },

    async reset(): Promise<void> {
        if (mockModeEnabled.value) return mockBlocksApi.reset()
        await apiClient.post<void>('/blocks/reset')
    }
}

// ============================================
// Score Endpoints
// ============================================

export const scoreApi = {
    async getScore(): Promise<ScoreResponseDto> {
        if (mockModeEnabled.value) return mockScoreApi.getScore()
        return apiClient.get<ScoreResponseDto>('/score')
    },

    async getScoreDetails(): Promise<ScoreDetailsResponseDto> {
        if (mockModeEnabled.value) return mockScoreApi.getScoreDetails()
        return apiClient.get<ScoreDetailsResponseDto>('/score/details')
    },

    async getLeaderboard(): Promise<LeaderboardResponseDto> {
        if (mockModeEnabled.value) return mockScoreApi.getLeaderboard()
        return apiClient.get<LeaderboardResponseDto>('/score/leaderboard')
    }
}

// ============================================
// Reset Endpoint (dev-only)
// ============================================

export const devApi = {
    async resetAll(): Promise<void> {
        await apiClient.post<void>('/reset')
    }
}

// ============================================
// Health Check
// ============================================

export const healthApi = {
    async check(): Promise<any> {
        return apiClient.get<any>('/health')
    }
}
