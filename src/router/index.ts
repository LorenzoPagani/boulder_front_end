import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginPage from '@/pages/LoginPage.vue'
import BlocksPage from '@/pages/BlocksPage.vue'
import ScorePage from '@/pages/ScorePage.vue'
import LeaderboardPage from '@/pages/LeaderboardPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/blocks'
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage,
            meta: { requiresAuth: false }
        },
        {
            path: '/blocks',
            name: 'blocks',
            component: BlocksPage,
            meta: { requiresAuth: true }
        },
        {
            path: '/score',
            name: 'score',
            component: ScorePage,
            meta: { requiresAuth: true }
        },
        {
            path: '/leaderboard',
            name: 'leaderboard',
            component: LeaderboardPage,
            meta: { requiresAuth: true }
        },
        {
            path: '/settings',
            name: 'settings',
            component: SettingsPage,
            meta: { requiresAuth: true }
        }
    ]
})

// Navigation guard
router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore()
    const requiresAuth = to.meta.requiresAuth

    // If route requires auth and user is not authenticated
    if (requiresAuth && !authStore.isAuthenticated) {
        // Try to restore session from token
        const hasValidSession = await authStore.loadSession()

        if (!hasValidSession) {
            // Redirect to login
            next('/login')
            return
        }
    }

    // If user is authenticated and tries to access login, redirect to blocks
    if (to.path === '/login' && authStore.isAuthenticated) {
        next('/blocks')
        return
    }

    next()
})

export default router
