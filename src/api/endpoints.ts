import { apiClient } from './client'
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
        return apiClient.post<LoginResponseDto>('/auth/login', credentials)
    },

    async logout(): Promise<void> {
        await apiClient.post<void>('/auth/logout')
        apiClient.clearToken()
    },

    async me(): Promise<AthleteDto> {
        return apiClient.get<AthleteDto>('/auth/me')
    }
}

// ============================================
// Blocks Endpoints
// ============================================

export const blocksApi = {
    async getBlocks(): Promise<BlockDto[]> {
        return apiClient.get<BlockDto[]>('/blocks')
    },

    async toggleComplete(blockId: number): Promise<BlockDto[]> {
        return apiClient.post<BlockDto[]>(`/blocks/${blockId}/complete`)
    },

    async reset(): Promise<void> {
        await apiClient.post<void>('/blocks/reset')
    }
}

// ============================================
// Score Endpoints
// ============================================

export const scoreApi = {
    async getScore(): Promise<ScoreResponseDto> {
        return apiClient.get<ScoreResponseDto>('/score')
    },

    async getScoreDetails(): Promise<ScoreDetailsResponseDto> {
        return apiClient.get<ScoreDetailsResponseDto>('/score/details')
    },

    async getLeaderboard(): Promise<LeaderboardResponseDto> {
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
