<template>
    <div class="leaderboard-page">
        <AppNav />

        <main class="content">
            <div class="header">
                <h2>Classifica</h2>
                <button @click="refreshLeaderboard" :disabled="leaderboardStore.loading" class="refresh-btn">
                    🔄 Ricarica
                </button>
            </div>

            <ErrorBanner v-if="leaderboardStore.error" :message="leaderboardStore.error" type="error" dismissible
                @dismiss="leaderboardStore.clearError()" />

            <div v-if="leaderboardStore.loading && !leaderboardStore.leaderboard" class="loading-state">
                <p>Caricamento classifica...</p>
            </div>

            <div v-else-if="leaderboardStore.leaderboard" class="leaderboard-container">
                <!-- Athlete Rank Info -->
                <div class="rank-info">
                    <div class="rank-card">
                        <div class="rank-label">La Tua Posizione</div>
                        <div class="rank-value">{{ leaderboardStore.leaderboard.athleteRank }}</div>
                    </div>
                    <div class="rank-card">
                        <div class="rank-label">Totale Atleti</div>
                        <div class="rank-value">{{ leaderboardStore.leaderboard.totalAthletes }}</div>
                    </div>
                </div>

                <!-- Leaderboard Table -->
                <div class="leaderboard-table-container">
                    <table class="leaderboard-table">
                        <thead>
                            <tr>
                                <th class="rank-col">Pos.</th>
                                <th>Atleta</th>
                                <th class="number-col">Pettorale</th>
                                <th class="number-col">Punteggio</th>
                                <th class="number-col">Completati</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(entry, index) in leaderboardStore.leaderboard.entries" :key="index" :class="{
                                'current-athlete': isCurrentAthlete(entry),
                                'top-3': index < 3
                            }">
                                <td class="rank-col">
                                    <span class="rank-badge" :class="getRankClass(index)">
                                        {{ getRankDisplay(index) }}
                                    </span>
                                </td>
                                <td class="athlete-name">
                                    {{ entry.displayName }}
                                    <span v-if="isCurrentAthlete(entry)" class="you-badge">Tu</span>
                                </td>
                                <td class="number-col">{{ entry.bibNumber || '-' }}</td>
                                <td class="number-col score">{{ formatScore(entry.totalScore) }}</td>
                                <td class="number-col">{{ entry.completedBlocks }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useLeaderboardStore } from '@/stores/leaderboard'
import { useAuthStore } from '@/stores/auth'
import { formatScore } from '@/utils/format'
import AppNav from '@/components/AppNav.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import type { LeaderboardEntry } from '@/types'

const leaderboardStore = useLeaderboardStore()
const authStore = useAuthStore()

const currentAthleteName = computed(() => authStore.athlete?.name)

onMounted(async () => {
    await leaderboardStore.fetchLeaderboard()
})

async function refreshLeaderboard() {
    await leaderboardStore.fetchLeaderboard()
}

function isCurrentAthlete(entry: LeaderboardEntry): boolean {
    return entry.displayName === currentAthleteName.value
}

function getRankDisplay(index: number): string {
    const rank = index + 1
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank.toString()
}

function getRankClass(index: number): string {
    if (index === 0) return 'gold'
    if (index === 1) return 'silver'
    if (index === 2) return 'bronze'
    return ''
}
</script>

<style scoped>
.leaderboard-page {
    min-height: 100vh;
    background: #f5f5f5;
}

.content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.header h2 {
    margin: 0;
    color: #333;
    font-size: 1.75rem;
}

.refresh-btn {
    padding: 0.65rem 1.25rem;
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
    border-color: #2196f3;
    color: #2196f3;
}

.refresh-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.loading-state {
    text-align: center;
    padding: 3rem;
    color: #666;
    font-size: 1.1rem;
}

.leaderboard-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.rank-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.rank-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.rank-label {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 0.5rem;
}

.rank-value {
    font-size: 2.5rem;
    font-weight: bold;
    color: #667eea;
}

.leaderboard-table-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.leaderboard-table {
    width: 100%;
    border-collapse: collapse;
}

.leaderboard-table th {
    background: #2c3e50;
    color: white;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
}

.leaderboard-table td {
    padding: 1rem;
    border-bottom: 1px solid #f0f0f0;
}

.leaderboard-table tr:last-child td {
    border-bottom: none;
}

.leaderboard-table tr.top-3 {
    background: #fffef0;
}

.leaderboard-table tr.current-athlete {
    background: #e3f2fd;
    font-weight: 600;
}

.rank-col {
    width: 80px;
    text-align: center !important;
}

.number-col {
    text-align: center;
    width: 120px;
}

.rank-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    border-radius: 50%;
    font-weight: bold;
    font-size: 1.2rem;
}

.rank-badge.gold {
    font-size: 2rem;
}

.rank-badge.silver {
    font-size: 2rem;
}

.rank-badge.bronze {
    font-size: 2rem;
}

.athlete-name {
    font-weight: 500;
    color: #333;
}

.you-badge {
    display: inline-block;
    margin-left: 0.5rem;
    padding: 0.2rem 0.6rem;
    background: #667eea;
    color: white;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
}

.score {
    font-weight: 600;
    color: #2196f3;
    font-size: 1.1rem;
}

@media (max-width: 768px) {
    .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }

    .leaderboard-table {
        font-size: 0.9rem;
    }

    .leaderboard-table th,
    .leaderboard-table td {
        padding: 0.75rem 0.5rem;
    }
}
</style>
