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

                <InlineSpinner v-if="scoreStore.loading && !scoreStore.details" message="Caricamento dettagli..." />

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
import InlineSpinner from '@/components/InlineSpinner.vue'

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
    background: var(--color-bg);
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
    color: var(--color-text);
    font-size: 1.75rem;
}

.refresh-btn {
    padding: 0.65rem 1.25rem;
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
    border-color: var(--color-info);
    color: var(--color-info);
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
    background: var(--color-surface);
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    text-align: center;
    transition: box-shadow 0.2s, transform 0.2s;
}

.summary-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
}

.summary-card.highlight {
    background: var(--gradient-primary);
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
    background: var(--color-surface);
    padding: 2rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
}

.details-section h3 {
    margin: 0 0 1.5rem 0;
    color: var(--color-text);
}

.details-table-container {
    overflow-x: auto;
}

.details-table {
    width: 100%;
    border-collapse: collapse;
}

.details-table th {
    background: var(--color-bg);
    padding: 0.75rem;
    text-align: left;
    font-weight: 600;
    color: var(--color-text);
    border-bottom: 2px solid var(--color-border);
}

.details-table td {
    padding: 0.75rem;
    border-bottom: 1px solid #f0f0f0;
}

.details-table tbody tr {
    transition: background 0.15s;
}

.details-table tbody tr:hover {
    background: #fafafa;
}

.details-table tr.completed {
    background: #f1f8f4;
}

.details-table tr.completed:hover {
    background: #e9f5ed;
}

.block-number {
    font-weight: 600;
    color: var(--color-text);
}

.current-score {
    font-weight: 600;
    color: var(--color-info);
}

.difficulty-badge {
    display: inline-block;
    padding: 0.3rem 0.6rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #333;
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
