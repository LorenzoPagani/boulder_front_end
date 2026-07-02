import type {
    AthleteDto,
    BlockDto,
    BlockScoreDetailDto,
    LeaderboardResponseDto,
    LoginRequestDto,
    LoginResponseDto,
    ScoreDetailsResponseDto,
    ScoreResponseDto
} from '@/types'
import { createMockBlocks, mockAthlete, mockLeaderboardBase } from './mockData'

const MOCK_TOKEN = 'mock-demo-token'
const BLOCKS_STORAGE_KEY = 'boulder_mock_blocks_state'
const SIMULATED_LATENCY_MS = 350

function loadBlocksState(): BlockDto[] {
    const raw = localStorage.getItem(BLOCKS_STORAGE_KEY)

    if (raw) {
        try {
            return JSON.parse(raw) as BlockDto[]
        } catch {
            // Corrupted/old data, fall back to a fresh demo state below
        }
    }

    return createMockBlocks()
}

let blocksState: BlockDto[] = loadBlocksState()

function persistBlocksState(): void {
    localStorage.setItem(BLOCKS_STORAGE_KEY, JSON.stringify(blocksState))
}

function delay<T>(value: T): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS))
}

function buildScoreSummary(): { score: number; totalBlocks: number; completedBlocks: number } {
    const completed = blocksState.filter(b => b.completed)
    const score = completed.reduce((sum, b) => sum + b.current_score, 0)
    return { score, totalBlocks: blocksState.length, completedBlocks: completed.length }
}

export const mockAuthApi = {
    async login(_credentials: LoginRequestDto): Promise<LoginResponseDto> {
        blocksState = createMockBlocks()
        persistBlocksState()
        return delay({ athlete: mockAthlete, token: MOCK_TOKEN })
    },

    async logout(): Promise<void> {
        localStorage.removeItem(BLOCKS_STORAGE_KEY)
        blocksState = createMockBlocks()
        return delay(undefined)
    },

    async me(): Promise<AthleteDto> {
        return delay(mockAthlete)
    }
}

export const mockBlocksApi = {
    async getBlocks(): Promise<BlockDto[]> {
        return delay(blocksState.map(b => ({ ...b })))
    },

    async toggleComplete(blockId: number): Promise<BlockDto[]> {
        blocksState = blocksState.map(b => {
            if (b.id !== blockId) return b

            if (b.completed) {
                const completedCount = Math.max(1, b.completed_count - 1)
                return { ...b, completed: false, completed_at: null, completed_count: completedCount, current_score: b.base_score / completedCount }
            }

            const completedCount = b.completed_count + 1
            return { ...b, completed: true, completed_at: new Date().toISOString(), completed_count: completedCount, current_score: b.base_score / completedCount }
        })

        persistBlocksState()
        return delay(blocksState.map(b => ({ ...b })))
    },

    async reset(): Promise<void> {
        blocksState = blocksState.map(b => ({ ...b, completed: false, completed_at: null }))
        persistBlocksState()
        return delay(undefined)
    }
}

export const mockScoreApi = {
    async getScore(): Promise<ScoreResponseDto> {
        return delay(buildScoreSummary())
    },

    async getScoreDetails(): Promise<ScoreDetailsResponseDto> {
        const block_scores: BlockScoreDetailDto[] = blocksState.map(b => ({
            block_id: b.id,
            block_number: b.number,
            difficulty: b.difficulty,
            base_score: b.base_score,
            completed_count: b.completed_count,
            score: b.current_score,
            completed_at: b.completed_at
        }))

        return delay({ block_scores })
    },

    async getLeaderboard(): Promise<LeaderboardResponseDto> {
        const { score, completedBlocks } = buildScoreSummary()

        const entries = [
            ...mockLeaderboardBase,
            {
                id: mockAthlete.id,
                name: mockAthlete.name,
                bib_number: mockAthlete.bibNumber,
                display_name: mockAthlete.name,
                score,
                completed_blocks: completedBlocks
            }
        ].sort((a, b) => b.score - a.score)

        const athleteRank = entries.findIndex(e => e.id === mockAthlete.id) + 1

        return delay({
            leaderboard: entries,
            athlete_rank: athleteRank,
            total_athletes: entries.length
        })
    }
}
