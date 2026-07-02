<template>
    <div class="inline-spinner" role="status" aria-live="polite">
        <div class="spinner" aria-hidden="true"></div>
        <p v-if="message">{{ message }}</p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    message?: string
}>()
</script>

<style scoped>
.inline-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 3rem 1rem;
    color: var(--color-text-muted);
    font-size: 1.05rem;
}

.spinner {
    border: 4px solid rgba(102, 126, 234, 0.15);
    border-radius: 50%;
    border-top: 4px solid var(--color-primary);
    width: 40px;
    height: 40px;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
