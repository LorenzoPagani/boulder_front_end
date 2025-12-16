<template>
    <div class="login-page">
        <div class="login-container">
            <div class="login-header">
                <h1>🧗 Boulder Score</h1>
                <p>Accedi per visualizzare i tuoi progressi</p>
            </div>

            <ErrorBanner v-if="authStore.error" :message="authStore.error" type="error" dismissible
                @dismiss="authStore.clearError()" />

            <form @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                    <label for="eventCode">Codice Evento*</label>
                    <input id="eventCode" v-model="form.eventCode" type="text" placeholder="es. BOULDER2025" required
                        :disabled="authStore.loading" />
                </div>

                <div class="form-group">
                    <label for="name">Nome*</label>
                    <input id="name" v-model="form.name" type="text" placeholder="es. Marco Rossi" required
                        :disabled="authStore.loading" />
                </div>

                <div class="form-group">
                    <label for="bibNumber">Numero Pettorale (opzionale)</label>
                    <input id="bibNumber" v-model="form.bibNumber" type="text" placeholder="es. 101"
                        :disabled="authStore.loading" />
                </div>

                <button type="submit" class="login-btn" :disabled="authStore.loading || !isFormValid">
                    {{ authStore.loading ? 'Accesso in corso...' : 'Accedi' }}
                </button>
            </form>

            <div class="login-footer">
                <p class="help-text">
                    <strong>Dati demo:</strong><br>
                    Codice evento: <code>BOULDER2025</code><br>
                    Nome: <code>Marco Rossi</code> o qualsiasi altro nome<br>
                    Pettorale: <code>101</code> (opzionale)
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ErrorBanner from '@/components/ErrorBanner.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
    eventCode: '',
    name: '',
    bibNumber: ''
})

const isFormValid = computed(() => {
    return form.value.eventCode.trim() !== '' && form.value.name.trim() !== ''
})

async function handleLogin() {
    const success = await authStore.login({
        eventCode: form.value.eventCode.trim(),
        name: form.value.name.trim(),
        bibNumber: form.value.bibNumber.trim() || undefined
    })

    if (success) {
        router.push('/blocks')
    }
}
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1rem;
}

.login-container {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    max-width: 450px;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.login-header {
    text-align: center;
    margin-bottom: 2rem;
}

.login-header h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    color: #333;
}

.login-header p {
    margin: 0;
    color: #666;
    font-size: 0.95rem;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-weight: 600;
    color: #333;
    font-size: 0.95rem;
}

.form-group input {
    padding: 0.85rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
}

.form-group input:focus {
    outline: none;
    border-color: #667eea;
}

.form-group input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
}

.login-btn {
    padding: 1rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: 0.5rem;
}

.login-btn:hover:not(:disabled) {
    background: #5568d3;
}

.login-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.login-footer {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e0e0e0;
}

.help-text {
    font-size: 0.85rem;
    color: #666;
    line-height: 1.6;
    margin: 0;
}

.help-text code {
    background: #f5f5f5;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: monospace;
    color: #667eea;
}
</style>
