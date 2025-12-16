import { defineStore } from 'pinia'
import { ref } from 'vue'
import { blocksApi } from '@/api/endpoints'
import { mapBlocks } from '@/utils/mappers'
import type { Block } from '@/types'

export const useBlocksStore = defineStore('blocks', () => {
    const blocks = ref<Block[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const toggling = ref<number | null>(null) // Track which block is being toggled

    async function fetchBlocks() {
        loading.value = true
        error.value = null

        try {
            const blocksDto = await blocksApi.getBlocks()
            blocks.value = mapBlocks(blocksDto)
            return true
        } catch (err: any) {
            error.value = err.message || 'Impossibile caricare i blocchi'
            return false
        } finally {
            loading.value = false
        }
    }

    async function toggleComplete(blockId: number) {
        toggling.value = blockId
        error.value = null

        try {
            const blocksDto = await blocksApi.toggleComplete(blockId)
            blocks.value = mapBlocks(blocksDto)
            return true
        } catch (err: any) {
            error.value = err.message || 'Impossibile aggiornare il blocco'
            return false
        } finally {
            toggling.value = null
        }
    }

    async function resetBlocks() {
        loading.value = true
        error.value = null

        try {
            await blocksApi.reset()
            // Reload blocks after reset
            await fetchBlocks()
            return true
        } catch (err: any) {
            error.value = err.message || 'Impossibile resettare i blocchi'
            return false
        } finally {
            loading.value = false
        }
    }

    function clearError() {
        error.value = null
    }

    function getBlockById(id: number): Block | undefined {
        return blocks.value.find(b => b.id === id)
    }

    return {
        blocks,
        loading,
        error,
        toggling,
        fetchBlocks,
        toggleComplete,
        resetBlocks,
        clearError,
        getBlockById
    }
})
