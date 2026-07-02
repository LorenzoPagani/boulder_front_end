<template>
    <div class="settings-page">
        <AppNav />

        <main class="content">
            <h2>Impostazioni</h2>

            <ErrorBanner v-if="error" :message="error" type="error" dismissible @dismiss="error = null" />

            <ErrorBanner v-if="successMessage" :message="successMessage" type="info" dismissible
                @dismiss="successMessage = null" />

            <ErrorBanner v-if="isDemo"
                message="🎮 Modalità Demo attiva: stai esplorando l'app con dati di esempio, nulla viene salvato su un server reale."
                type="info" />

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
                        <h4>{{ isDemo ? 'Esci dalla Demo' : 'Logout' }}</h4>
                        <p>{{ isDemo ? 'Torna alla modalità normale e chiudi la sessione demo.' : "Esci dall'applicazione." }}</p>
                    </div>
                    <button @click="handleLogout" :disabled="loading" class="action-btn">
                        {{ isDemo ? 'Esci dalla Demo' : 'Logout' }}
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
import { mockModeEnabled } from '@/utils/mockMode'
import AppNav from '@/components/AppNav.vue'
import ErrorBanner from '@/components/ErrorBanner.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

const router = useRouter()
const authStore = useAuthStore()
const blocksStore = useBlocksStore()
const scoreStore = useScoreStore()
const leaderboardStore = useLeaderboardStore()
const isDemo = mockModeEnabled

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
    background: var(--color-bg);
}

.content {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.content h2 {
    margin: 0 0 2rem 0;
    color: var(--color-text);
    font-size: 1.75rem;
}

.settings-section {
    background: var(--color-surface);
    padding: 2rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    margin-bottom: 2rem;
}

.settings-section h3 {
    margin: 0 0 1.5rem 0;
    color: var(--color-text);
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
    border-radius: var(--radius-md);
}

.info-label {
    font-weight: 600;
    color: var(--color-text-muted);
}

.info-value {
    color: var(--color-text);
}

.action-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    margin-bottom: 1rem;
    gap: 1rem;
    transition: border-color 0.2s;
}

.action-item:hover {
    border-color: #d0d0d0;
}

.action-info {
    flex: 1;
}

.action-info h4 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text);
    font-size: 1.1rem;
}

.action-info p {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 0.9rem;
}

.action-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--color-info);
    background: var(--color-info);
    color: white;
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
}

.action-btn:hover:not(:disabled) {
    background: var(--color-info-dark);
    border-color: var(--color-info-dark);
}

.action-btn.warning {
    border-color: var(--color-warning);
    background: var(--color-warning);
}

.action-btn.warning:hover:not(:disabled) {
    background: var(--color-warning-dark);
    border-color: var(--color-warning-dark);
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
