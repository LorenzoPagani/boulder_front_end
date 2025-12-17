<template>
    <div class="settings-page">
        <AppNav />

        <main class="content">
            <h2>Impostazioni</h2>

            <ErrorBanner v-if="error" :message="error" type="error" dismissible @dismiss="error = null" />

            <ErrorBanner v-if="successMessage" :message="successMessage" type="info" dismissible
                @dismiss="successMessage = null" />

            <!-- Athlete Info -->
            <section class="settings-section">
                <h3>Informazioni Atleta</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Nome:</span>
                        <span class="info-value">{{ authStore.athlete?.name }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Evento:</span>
                        <span class="info-value">{{ authStore.athlete?.eventCode }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Pettorale:</span>
                        <span class="info-value">{{ authStore.athlete?.bibNumber || 'Non specificato' }}</span>
                    </div>
                </div>
            </section>

            <!-- Actions -->
            <section class="settings-section">
                <h3>Azioni</h3>

                <div class="action-item">
                    <div class="action-info">
                        <h4>Reset Blocchi</h4>
                        <p>Rimuove tutti i completamenti dei blocchi mantenendo l'account.</p>
                    </div>
                    <button @click="handleResetBlocks" :disabled="loading" class="action-btn warning">
                        Reset Blocchi
                    </button>
                </div>


                <div class="action-item">
                    <div class="action-info">
                        <h4>Logout</h4>
                        <p>Esci dall'applicazione.</p>
                    </div>
                    <button @click="handleLogout" :disabled="loading" class="action-btn">
                        Logout
                    </button>
                </div>
            </section>
        </main>

        <LoadingOverlay :visible="loading" message="Operazione in corso..." />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBlocksStore } from '@/stores/blocks'
import { useScoreStore } from '@/stores/score'
import { useLeaderboardStore } from '@/stores/leaderboard'
import { devApi } from '@/api/endpoints'
import AppNav from '@/components/AppNav.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

const router = useRouter()
const authStore = useAuthStore()
const blocksStore = useBlocksStore()
const scoreStore = useScoreStore()
const leaderboardStore = useLeaderboardStore()

const loading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

async function handleResetBlocks() {
    if (!confirm('Sei sicuro di voler resettare tutti i completamenti dei blocchi?')) {
        return
    }

    loading.value = true
    error.value = null
    successMessage.value = null

    try {
        const success = await blocksStore.resetBlocks()
        if (success) {
            successMessage.value = 'Blocchi resettati con successo!'
            // Refresh score and leaderboard
            await Promise.all([
                scoreStore.fetchScore(),
                scoreStore.fetchScoreDetails(),
                leaderboardStore.fetchLeaderboard()
            ])
        }
    } catch (err: any) {
        error.value = err.message || 'Errore durante il reset dei blocchi'
    } finally {
        loading.value = false
    }
}

async function handleResetAll() {
    if (!confirm('⚠️ ATTENZIONE! Questa operazione eliminerà TUTTI i dati dell\'evento.\n\nSei assolutamente sicuro di voler continuare?')) {
        return
    }

    if (!confirm('Conferma ancora una volta: vuoi davvero eliminare TUTTI i dati?')) {
        return
    }

    loading.value = true
    error.value = null
    successMessage.value = null

    try {
        await devApi.resetAll()
        // Clear all stores
        scoreStore.reset()
        leaderboardStore.reset()
        // Logout
        await authStore.logout()
        router.push('/login')
    } catch (err: any) {
        error.value = err.message || 'Errore durante il reset totale'
    } finally {
        loading.value = false
    }
}

async function handleLogout() {
    if (!confirm('Sei sicuro di voler uscire?')) {
        return
    }

    loading.value = true

    try {
        await authStore.logout()
        router.push('/login')
    } catch (err: any) {
        error.value = err.message || 'Errore durante il logout'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.settings-page {
    min-height: 100vh;
    background: #f5f5f5;
}

.content {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.content h2 {
    margin: 0 0 2rem 0;
    color: #333;
    font-size: 1.75rem;
}

.settings-section {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.settings-section h3 {
    margin: 0 0 1.5rem 0;
    color: #333;
    font-size: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #f0f0f0;
}

.info-grid {
    display: grid;
    gap: 1rem;
}

.info-item {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    background: #f9f9f9;
    border-radius: 8px;
}

.info-label {
    font-weight: 600;
    color: #666;
}

.info-value {
    color: #333;
}

.action-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 1rem;
    gap: 1rem;
}

.action-item.danger-zone {
    border-color: #f44336;
    background: #fff5f5;
}

.action-info {
    flex: 1;
}

.action-info h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1.1rem;
}

.action-info p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
}

.action-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid #2196f3;
    background: #2196f3;
    color: white;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
}

.action-btn:hover:not(:disabled) {
    background: #1976d2;
    border-color: #1976d2;
}

.action-btn.warning {
    border-color: #ff9800;
    background: #ff9800;
}

.action-btn.warning:hover:not(:disabled) {
    background: #f57c00;
    border-color: #f57c00;
}

.action-btn.danger {
    border-color: #f44336;
    background: #f44336;
}

.action-btn.danger:hover:not(:disabled) {
    background: #d32f2f;
    border-color: #d32f2f;
}

.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .action-item {
        flex-direction: column;
        align-items: flex-start;
    }

    .action-btn {
        width: 100%;
    }
}
</style>
