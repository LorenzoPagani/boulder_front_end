<template>
    <nav class="app-nav">
        <div class="nav-container">
            <div class="nav-brand">
                <h1>🧗 Boulder Score</h1>
                <p v-if="athlete" class="athlete-info">
                    {{ athlete.name }}
                    <span v-if="athlete.bibNumber">(#{{ athlete.bibNumber }})</span>
                </p>
            </div>

            <ul class="nav-menu">
                <li>
                    <router-link to="/blocks" class="nav-link">Blocchi</router-link>
                </li>
                <li>
                    <router-link to="/score" class="nav-link">Punteggio</router-link>
                </li>
                <li>
                    <router-link to="/leaderboard" class="nav-link">Classifica</router-link>
                </li>
                <li>
                    <router-link to="/settings" class="nav-link">Impostazioni</router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const athlete = computed(() => authStore.athlete)
</script>

<style scoped>
.app-nav {
    background: #2c3e50;
    color: white;
    padding: 1rem 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.nav-brand h1 {
    margin: 0;
    font-size: 1.5rem;
}

.athlete-info {
    margin: 0.25rem 0 0 0;
    font-size: 0.85rem;
    opacity: 0.9;
}

.nav-menu {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 1.5rem;
}

.nav-link {
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: background 0.2s;
}

.nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
    background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
    .nav-container {
        flex-direction: column;
        align-items: flex-start;
    }

    .nav-menu {
        width: 100%;
        flex-wrap: wrap;
    }
}
</style>
