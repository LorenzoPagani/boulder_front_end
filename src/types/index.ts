// ============================================
// Backend DTOs (snake_case as returned by API)
// ============================================

export interface ApiResponse<T = any> {
    success: boolean
    data: T | null
    message: string
}

// Auth DTOs
export interface LoginRequestDto {
    name: string
    eventCode: string
    bibNumber: string
}

export interface AthleteDto {
    id: number
    name: string
    eventCode: string
    bibNumber: string | null
    createdAt: string
}

export interface LoginResponseDto {
    athlete: AthleteDto
    token: string
}

// Block DTOs (from GET /blocks and POST /blocks/{id}/complete)
export interface BlockDto {
    id: number
    number: number // backend usa 'number' non 'block_number'
    difficulty: 'easy' | 'medium' | 'hard' | 'elite'
    base_score: number
    completed_count: number
    current_score: number
    completed: boolean // backend include campo 'completed'
    completed_at: string | null // ISO date string or null
}

// Score DTOs
// GET /score - backend usa 'score' invece di 'totalScore'
export interface ScoreResponseDto {
    score: number // backend usa 'score' non 'totalScore'
    totalBlocks: number
    completedBlocks: number
}

// GET /score/details returns snake_case keys
export interface BlockScoreDetailDto {
    block_id: number
    block_number: number
    difficulty: 'easy' | 'medium' | 'hard' | 'elite'
    base_score: number
    completed_count: number
    score: number // backend usa 'score' non 'current_score'
    completed_at: string | null
}

// Backend ritorna solo array di block_scores, non wrapper con totali
export interface ScoreDetailsResponseDto {
    block_scores: BlockScoreDetailDto[]
}

// Leaderboard DTOs
export interface LeaderboardEntryDto {
    id: number // backend include anche id
    name: string // backend include anche name
    bib_number: string | null
    display_name: string
    score: number // backend usa 'score' non 'total_score'
    completed_blocks: number
}

export interface LeaderboardResponseDto {
    leaderboard: LeaderboardEntryDto[]
    athlete_rank: number
    total_athletes: number
}

// ============================================
// Frontend Models (normalized to camelCase)
// ============================================

export interface Athlete {
    id: number
    name: string
    eventCode: string
    bibNumber: string | null
    createdAt: string
}

export interface Block {
    id: number
    eventId: number
    blockNumber: number
    difficulty: 'easy' | 'medium' | 'hard' | 'elite'
    baseScore: number
    completedCount: number
    currentScore: number
    completedAt: string | null
}

export interface ScoreSummary {
    totalScore: number
    totalBlocks: number
    completedBlocks: number
    averageScore: number
}

export interface BlockScoreDetail {
    blockId: number
    blockNumber: number
    difficulty: 'easy' | 'medium' | 'hard' | 'elite'
    baseScore: number
    completedCount: number
    currentScore: number
    completedAt: string | null
}

export interface ScoreDetails {
    totalScore: number
    totalBlocks: number
    completedBlocks: number
    averageScore: number
    blockScores: BlockScoreDetail[]
}

export interface LeaderboardEntry {
    name: string
    totalScore: number
    completedBlocks: number
}

export interface Leaderboard {
    entries: LeaderboardEntry[]
    athleteRank: number
    totalAthletes: number
}

// ============================================
// Difficulty Configuration
// ============================================

export interface DifficultyConfig {
    label: string
    color: string
}

export const DIFFICULTY_CONFIG: Record<string, DifficultyConfig> = {
    easy: { label: 'Easy', color: '#9BE7A7' },
    medium: { label: 'Medium', color: '#FFE082' },
    hard: { label: 'Hard', color: '#FFB74D' },
    elite: { label: 'Elite', color: '#E57373' }
}
