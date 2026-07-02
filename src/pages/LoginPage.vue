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
                        autocomplete="off" autofocus :disabled="authStore.loading" />
                </div>

                <div class="form-group">
                    <label for="name">Nome*</label>
                    <input id="name" v-model="form.name" type="text" placeholder="es. Marco Rossi" required
                        autocomplete="name" :disabled="authStore.loading" />
                </div>

                <div class="form-group">
                    <label for="bibNumber">Numero Pettorale*</label>
                    <input id="bibNumber" v-model="form.bibNumber" type="text" inputmode="numeric"
                        placeholder="es. 101" required autocomplete="off" :disabled="authStore.loading" />
                </div>

                <button type="submit" class="login-btn" :disabled="authStore.loading || !isFormValid">
                    {{ authStore.loading ? 'Accesso in corso...' : 'Accedi' }}
                </button>
            </form>

            <div class="login-footer">
                <p class="help-text">

                    Made with ❤️ by <code>LOLLOPG</code><br>

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
    return form.value.eventCode.trim() !== '' &&
        form.value.name.trim() !== '' &&
        form.value.bibNumber.trim() !== ''
})

async function handleLogin() {
    const success = await authStore.login({
        eventCode: form.value.eventCode.trim(),
        name: form.value.name.trim(),
        bibNumber: form.value.bibNumber.trim()
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
    background: var(--gradient-primary);
    padding: 1rem;
}

.login-container {
    background: var(--color-surface);
    border-radius: var(--radius-xl);
    padding: 2rem;
    max-width: 450px;
    width: 100%;
    box-shadow: var(--shadow-lg);
    animation: pop-in 0.25s ease;
}

@keyframes pop-in {
    from {
        opacity: 0;
        transform: translateY(8px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.login-header {
    text-align: center;
    margin-bottom: 2rem;
}

.login-header h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    color: var(--color-text);
}

.login-header p {
    margin: 0;
    color: var(--color-text-muted);
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
    color: var(--color-text);
    font-size: 0.95rem;
}

.form-group input {
    padding: 0.85rem;
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    transition: border-color 0.2s;
}

.form-group input:focus {
    border-color: var(--color-primary);
}

.form-group input:focus:not(:focus-visible) {
    outline: none;
}

.form-group input:disabled {
    background: var(--color-bg);
    cursor: not-allowed;
}

.login-btn {
    padding: 1rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    margin-top: 0.5rem;
}

.login-btn:hover:not(:disabled) {
    background: var(--color-primary-dark);
}

.login-btn:active:not(:disabled) {
    transform: scale(0.98);
}

.login-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.login-footer {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border);
}

.help-text {
    font-size: 0.85rem;
    color: var(--color-text-muted);
    line-height: 1.6;
    margin: 0;
}

.help-text code {
    background: var(--color-bg);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: monospace;
    color: var(--color-primary);
}
</style>
