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
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    padding: 1.25rem;
    background: white;
    transition: all 0.3s ease;
}

.block-card.completed {
    border-color: #4caf50;
    background: #f1f8f4;
}

.block-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
    color: #333;
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
    color: #666;
}

.stat-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
}

.completed-info {
    font-size: 0.85rem;
    color: #4caf50;
    margin-bottom: 0.75rem;
    padding: 0.5rem;
    background: rgba(76, 175, 80, 0.1);
    border-radius: 6px;
}

.toggle-btn {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #2196f3;
    background: #2196f3;
    color: white;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.toggle-btn:hover:not(:disabled) {
    background: #1976d2;
    border-color: #1976d2;
}

.toggle-btn.completed {
    background: white;
    color: #f44336;
    border-color: #f44336;
}

.toggle-btn.completed:hover:not(:disabled) {
    background: #f44336;
    color: white;
}

.toggle-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
