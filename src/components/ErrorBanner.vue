<template>
    <div v-if="message" :class="['error-banner', type]">
        <span class="error-icon">⚠</span>
        <span class="error-message">{{ message }}</span>
        <button v-if="dismissible" @click="$emit('dismiss')" class="dismiss-btn">✕</button>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    message: string | null
    type?: 'error' | 'warning' | 'info'
    dismissible?: boolean
}>()

defineEmits<{
    dismiss: []
}>()
</script>

<style scoped>
.error-banner {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.95rem;
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
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0;
    color: inherit;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.dismiss-btn:hover {
    opacity: 1;
}
</style>
