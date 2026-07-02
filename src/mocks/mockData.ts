import type { AthleteDto, BlockDto, LeaderboardEntryDto } from '@/types'

export const mockAthlete: AthleteDto = {
    id: 9999,
    name: 'Atleta Demo',
    eventCode: 'DEMO2026',
    bibNumber: '007',
    createdAt: new Date().toISOString()
}

export function createMockBlocks(): BlockDto[] {
    return [
        { id: 1, number: 1, difficulty: 'easy', base_score: 100, completed_count: 12, current_score: 100 / 12, completed: false, completed_at: null },
        { id: 2, number: 2, difficulty: 'easy', base_score: 100, completed_count: 8, current_score: 100 / 8, completed: false, completed_at: null },
        { id: 3, number: 3, difficulty: 'medium', base_score: 200, completed_count: 15, current_score: 200 / 15, completed: false, completed_at: null },
        { id: 4, number: 4, difficulty: 'medium', base_score: 200, completed_count: 6, current_score: 200 / 6, completed: false, completed_at: null },
        { id: 5, number: 5, difficulty: 'hard', base_score: 350, completed_count: 4, current_score: 350 / 4, completed: false, completed_at: null },
        { id: 6, number: 6, difficulty: 'hard', base_score: 350, completed_count: 9, current_score: 350 / 9, completed: false, completed_at: null },
        { id: 7, number: 7, difficulty: 'elite', base_score: 600, completed_count: 2, current_score: 600 / 2, completed: false, completed_at: null },
        { id: 8, number: 8, difficulty: 'elite', base_score: 600, completed_count: 5, current_score: 600 / 5, completed: false, completed_at: null }
    ]
}

export const mockLeaderboardBase: LeaderboardEntryDto[] = [
    { id: 101, name: 'Giulia Ferrari', bib_number: '12', display_name: 'Giulia Ferrari', score: 1450, completed_blocks: 7 },
    { id: 102, name: 'Marco Bianchi', bib_number: '23', display_name: 'Marco Bianchi', score: 1200, completed_blocks: 6 },
    { id: 103, name: 'Sara Colombo', bib_number: '34', display_name: 'Sara Colombo', score: 980, completed_blocks: 5 },
    { id: 104, name: 'Luca Romano', bib_number: '45', display_name: 'Luca Romano', score: 760, completed_blocks: 4 }
]
