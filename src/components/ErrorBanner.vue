<template>
    <div v-if="message" :class="['error-banner', type]" role="alert">
        <span class="error-icon" aria-hidden="true">{{ icon }}</span>
        <span class="error-message">{{ message }}</span>
        <button v-if="dismissible" @click="$emit('dismiss')" class="dismiss-btn" aria-label="Chiudi messaggio">✕</button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    message: string | null
    type?: 'error' | 'warning' | 'info'
    dismissible?: boolean
}>()

defineEmits<{
    dismiss: []
}>()

const icon = computed(() => (props.type === 'info' ? 'ℹ' : '⚠'))
</script>

<style scoped>
.error-banner {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.95rem;
    animation: slide-in 0.2s ease;
}

@keyframes slide-in {
    from {
        opacity: 0;
        transform: translateY(-6px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.error-banner.error {
    background: #fee;
    border: 1px solid #fcc;
    color: #c33;
}

.error-banner.warning {
    background: #ffeeba;
    border: 1px solid #ffc107;
    color: #856404;
}

.error-banner.info {
    background: #d1ecf1;
    border: 1px solid #bee5eb;
    color: #0c5460;
}

.error-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
}

.error-message {
    flex: 1;
}

.dismiss-btn {
    background: none;
    border: none;
    font-size: 1.1rem;
    line-height: 1;
    cursor: pointer;
    padding: 0.35rem;
    border-radius: 50%;
    color: inherit;
    opacity: 0.7;
    transition: opacity 0.2s, background 0.2s;
    flex-shrink: 0;
}

.dismiss-btn:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.06);
}
</style>
