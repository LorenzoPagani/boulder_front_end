import type {
    AthleteDto,
    BlockDto,
    BlockScoreDetailDto,
    ScoreDetailsResponseDto,
    LeaderboardEntryDto,
    LeaderboardResponseDto,
    Athlete,
    Block,
    BlockScoreDetail,
    ScoreDetails,
    Leaderboard,
    LeaderboardEntry
} from '@/types'

// Map AthleteDto to Athlete
export function mapAthlete(dto: AthleteDto): Athlete {
    return {
        id: dto.id,
        name: dto.name,
        eventCode: dto.eventCode,
        bibNumber: dto.bibNumber,
        createdAt: dto.createdAt
    }
}

// Map BlockDto to Block
export function mapBlock(dto: BlockDto): Block {
    return {
        id: dto.id,
        eventId: 0, // backend non ritorna event_id, uso placeholder
        blockNumber: dto.number, // backend usa 'number' non 'block_number'
        difficulty: dto.difficulty,
        baseScore: dto.base_score,
        completedCount: dto.completed_count,
        currentScore: dto.current_score,
        completedAt: dto.completed_at
    }
}

// Map BlockDto array to Block array
export function mapBlocks(dtos: BlockDto[]): Block[] {
    return dtos.map(mapBlock)
}

// Map BlockScoreDetailDto to BlockScoreDetail
export function mapBlockScoreDetail(dto: BlockScoreDetailDto): BlockScoreDetail {
    return {
        blockId: dto.block_id,
        blockNumber: dto.block_number,
        difficulty: dto.difficulty,
        baseScore: dto.base_score,
        completedCount: dto.completed_count,
        currentScore: dto.score, // backend usa 'score' non 'current_score'
        completedAt: dto.completed_at
    }
}

// Map ScoreDetailsResponseDto to ScoreDetails
// Backend ritorna solo array block_scores, calcoliamo i totali localmente
export function mapScoreDetails(dto: ScoreDetailsResponseDto, scoreSummary?: { score: number; totalBlocks: number; completedBlocks: number }): ScoreDetails {
    const blockScores = dto.block_scores.map(mapBlockScoreDetail)

    // Se abbiamo il summary, usiamolo, altrimenti calcoliamo
    const totalScore = scoreSummary?.score ?? blockScores.reduce((sum, b) => sum + (b.completedAt ? b.currentScore : 0), 0)
    const totalBlocks = scoreSummary?.totalBlocks ?? blockScores.length
    const completedBlocks = scoreSummary?.completedBlocks ?? blockScores.filter(b => b.completedAt).length
    const averageScore = completedBlocks > 0 ? totalScore / completedBlocks : 0

    return {
        totalScore,
        totalBlocks,
        completedBlocks,
        averageScore,
        blockScores
    }
}

// Map LeaderboardEntryDto to LeaderboardEntry
export function mapLeaderboardEntry(dto: LeaderboardEntryDto): LeaderboardEntry {
    return {
        name: dto.name,
        totalScore: dto.score, // backend usa 'score' non 'total_score'
        completedBlocks: dto.completed_blocks
    }
}

// Map LeaderboardResponseDto to Leaderboard
export function mapLeaderboard(dto: LeaderboardResponseDto): Leaderboard {
    return {
        entries: dto.leaderboard.map(mapLeaderboardEntry),
        athleteRank: dto.athlete_rank,
        totalAthletes: dto.total_athletes
    }
}
