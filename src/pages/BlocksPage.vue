<template>
    <div class="blocks-page">
        <AppNav />

        <main class="content">
            <div class="header">
                <h2>Blocchi dell'Evento</h2>
                <button @click="refreshBlocks" :disabled="blocksStore.loading" class="refresh-btn">
                    🔄 Ricarica
                </button>
            </div>

            <ErrorBanner v-if="blocksStore.error" :message="blocksStore.error" type="error" dismissible
                @dismiss="blocksStore.clearError()" />

            <InlineSpinner v-if="blocksStore.loading && blocksStore.blocks.length === 0" message="Caricamento blocchi..." />

            <div v-else-if="blocksStore.blocks.length === 0" class="empty-state">
                <span class="empty-icon" aria-hidden="true">🧗</span>
                <p>Nessun blocco disponibile per questo evento.</p>
            </div>

            <div v-else class="blocks-grid">
                <BlockCard v-for="block in blocksStore.blocks" :key="block.id" :block="block"
                    :disabled="blocksStore.toggling === block.id" @toggle="handleToggle(block.id)" />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBlocksStore } from '@/stores/blocks'
import { useScoreStore } from '@/stores/score'
import AppNav from '@/components/AppNav.vue'
import BlockCard from '@/components/BlockCard.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import InlineSpinner from '@/components/InlineSpinner.vue'

const blocksStore = useBlocksStore()
const scoreStore = useScoreStore()

onMounted(async () => {
    await blocksStore.fetchBlocks()
})

async function handleToggle(blockId: number) {
    const success = await blocksStore.toggleComplete(blockId)

    if (success) {
        // Refresh score after toggle
        await scoreStore.fetchScore()
    }
}

async function refreshBlocks() {
    await blocksStore.fetchBlocks()
}
</script>

<style scoped>
.blocks-page {
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

.blocks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.empty-state {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-muted);
    font-size: 1.1rem;
}

.empty-icon {
    display: block;
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
}

@media (max-width: 768px) {
    .blocks-grid {
        grid-template-columns: 1fr;
    }

    .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
}
</style>
