<template>
    <div class="score-page">
        <AppNav />

        <main class="content">
            <div class="header">
                <h2>Il Tuo Punteggio</h2>
                <button @click="refreshScore" :disabled="scoreStore.loading" class="refresh-btn">
                    🔄 Ricarica
                </button>
            </div>

            <ErrorBanner v-if="scoreStore.error" :message="scoreStore.error" type="error" dismissible
                @dismiss="scoreStore.clearError()" />

            <!-- Summary Section -->
            <div v-if="scoreStore.summary" class="summary-section">
                <div class="summary-card highlight">
                    <div class="summary-label">Punteggio Totale</div>
                    <div class="summary-value">{{ formatScore(scoreStore.summary.totalScore) }}</div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">Blocchi Completati</div>
                    <div class="summary-value">
                        {{ scoreStore.summary.completedBlocks }} / {{ scoreStore.summary.totalBlocks }}
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">Media</div>
                    <div class="summary-value">{{ formatScore(scoreStore.summary.averageScore) }}</div>
                </div>
            </div>

            <!-- Details Section -->
            <div class="details-section">
                <h3>Dettaglio Punteggi per Blocco</h3>

                <div v-if="scoreStore.loading && !scoreStore.details" class="loading-state">
                    <p>Caricamento dettagli...</p>
                </div>

                <div v-else-if="scoreStore.details" class="details-table-container">
                    <table class="details-table">
                        <thead>
                            <tr>
                                <th>Blocco</th>
                                <th>Difficoltà</th>
                                <th>Punteggio Base</th>
                                <th>Completamenti</th>
                                <th>Punteggio Attuale</th>
                                <th>Completato</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="block in scoreStore.details.blockScores" :key="block.blockId"
                                :class="{ completed: block.completedAt }">
                                <td class="block-number">#{{ block.blockNumber }}</td>
                                <td>
                                    <span class="difficulty-badge"
                                        :style="{ backgroundColor: getDifficultyColor(block.difficulty) }">
                                        {{ getDifficultyLabel(block.difficulty) }}
                                    </span>
                                </td>
                                <td>{{ formatScore(block.baseScore) }}</td>
                                <td>{{ block.completedCount }}</td>
                                <td class="current-score">{{ formatScore(block.currentScore) }}</td>
                                <td>{{ block.completedAt ? '✓' : '-' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useScoreStore } from '@/stores/score'
import { DIFFICULTY_CONFIG } from '@/types'
import { formatScore } from '@/utils/format'
import AppNav from '@/components/AppNav.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'

const scoreStore = useScoreStore()

onMounted(async () => {
    await Promise.all([
        scoreStore.fetchScore(),
        scoreStore.fetchScoreDetails()
    ])
})

async function refreshScore() {
    await Promise.all([
        scoreStore.fetchScore(),
        scoreStore.fetchScoreDetails()
    ])
}

function getDifficultyLabel(difficulty: string): string {
    return DIFFICULTY_CONFIG[difficulty]?.label || difficulty
}

function getDifficultyColor(difficulty: string): string {
    return DIFFICULTY_CONFIG[difficulty]?.color || '#ccc'
}
</script>

<style scoped>
.score-page {
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

.summary-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.summary-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.summary-card.highlight {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.summary-label {
    font-size: 0.9rem;
    opacity: 0.9;
    margin-bottom: 0.5rem;
}

.summary-card.highlight .summary-label {
    opacity: 1;
}

.summary-value {
    font-size: 2rem;
    font-weight: bold;
}

.details-section {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.details-section h3 {
    margin: 0 0 1.5rem 0;
    color: #333;
}

.details-table-container {
    overflow-x: auto;
}

.details-table {
    width: 100%;
    border-collapse: collapse;
}

.details-table th {
    background: #f5f5f5;
    padding: 0.75rem;
    text-align: left;
    font-weight: 600;
    color: #333;
    border-bottom: 2px solid #e0e0e0;
}

.details-table td {
    padding: 0.75rem;
    border-bottom: 1px solid #f0f0f0;
}

.details-table tr.completed {
    background: #f1f8f4;
}

.block-number {
    font-weight: 600;
    color: #333;
}

.current-score {
    font-weight: 600;
    color: #2196f3;
}

.difficulty-badge {
    display: inline-block;
    padding: 0.3rem 0.6rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #333;
}

.loading-state {
    text-align: center;
    padding: 2rem;
    color: #666;
}

@media (max-width: 768px) {
    .summary-section {
        grid-template-columns: 1fr;
    }

    .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
}
</style>
