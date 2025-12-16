// Format ISO date string to readable format
export function formatDate(isoDate: string | null): string {
    if (!isoDate) return '-'

    try {
        const date = new Date(isoDate)
        return new Intl.DateTimeFormat('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date)
    } catch {
        return isoDate
    }
}

// Format score to 2 decimal places
export function formatScore(score: number): string {
    return score.toFixed(2)
}
