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

            <div v-if="blocksStore.loading && blocksStore.blocks.length === 0" class="loading-state">
                <p>Caricamento blocchi...</p>
            </div>

            <div v-else-if="blocksStore.blocks.length === 0" class="empty-state">
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

.blocks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.loading-state,
.empty-state {
    text-align: center;
    padding: 3rem;
    color: #666;
    font-size: 1.1rem;
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
