<template>
    <div v-if="visible" class="loading-overlay">
        <div class="spinner"></div>
        <p v-if="message">{{ message }}</p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    visible: boolean
    message?: string
}>()
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    color: white;
}

.spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 4px solid white;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

p {
    margin-top: 1rem;
    font-size: 1rem;
}
</style>
