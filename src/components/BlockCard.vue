<template>
    <div class="block-card" :class="{ completed: block.completedAt }">
        <div class="block-header">
            <div class="block-number">#{{ block.blockNumber }}</div>
            <div class="difficulty-badge" :style="{ backgroundColor: difficultyConfig.color }">
                {{ difficultyConfig.label }}
            </div>
        </div>

        <div class="block-stats">
            <div class="stat">
                <span class="stat-label">Punteggio:</span>
                <span class="stat-value">{{ formatScore(block.currentScore) }}</span>
            </div>
            <div class="stat">
                <span class="stat-label">Completamenti:</span>
                <span class="stat-value">{{ block.completedCount }}</span>
            </div>
        </div>

        <div v-if="block.completedAt" class="completed-info">
            ✓ Completato il {{ formatDate(block.completedAt) }}
        </div>

        <button @click="$emit('toggle')" :disabled="disabled" class="toggle-btn"
            :class="{ completed: block.completedAt }">
            {{ block.completedAt ? 'Rimuovi completamento' : 'Segna come completato' }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Block } from '@/types'
import { DIFFICULTY_CONFIG } from '@/types'
import { formatScore, formatDate } from '@/utils/format'

const props = defineProps<{
    block: Block
    disabled?: boolean
}>()

defineEmits<{
    toggle: []
}>()

const difficultyConfig = computed(() => DIFFICULTY_CONFIG[props.block.difficulty])
</script>

<style scoped>
.block-card {
    border: 2px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 1.25rem;
    background: var(--color-surface);
    transition: all 0.2s ease;
}

.block-card.completed {
    border-color: var(--color-success);
    background: #f1f8f4;
}

.block-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
}

.block-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.block-number {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-text);
}

.difficulty-badge {
    padding: 0.35rem 0.75rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #333;
}

.block-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.stat-label {
    font-size: 0.85rem;
    color: var(--color-text-muted);
}

.stat-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text);
}

.completed-info {
    font-size: 0.85rem;
    color: var(--color-success);
    margin-bottom: 0.75rem;
    padding: 0.5rem;
    background: rgba(76, 175, 80, 0.1);
    border-radius: var(--radius-sm);
}

.toggle-btn {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--color-info);
    background: var(--color-info);
    color: white;
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.toggle-btn:hover:not(:disabled) {
    background: var(--color-info-dark);
    border-color: var(--color-info-dark);
}

.toggle-btn.completed {
    background: white;
    color: var(--color-danger);
    border-color: var(--color-danger);
}

.toggle-btn.completed:hover:not(:disabled) {
    background: var(--color-danger);
    color: white;
}

.toggle-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
