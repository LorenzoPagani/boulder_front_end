<template>
    <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
            <component :is="Component" />
        </transition>
    </router-view>
</template>

<script setup lang="ts">
// App is intentionally minimal - all layout is handled by pages
</script>

<style>
/* ============================================
   Design tokens
   ============================================ */
:root {
    --color-primary: #667eea;
    --color-primary-dark: #5568d3;
    --color-primary-gradient-end: #764ba2;
    --color-navy: #2c3e50;
    --color-info: #2196f3;
    --color-info-dark: #1976d2;
    --color-success: #4caf50;
    --color-warning: #ff9800;
    --color-warning-dark: #f57c00;
    --color-danger: #f44336;

    --color-bg: #f5f5f5;
    --color-surface: #ffffff;
    --color-border: #e0e0e0;
    --color-text: #333333;
    --color-text-muted: #666666;

    --radius-sm: 6px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;

    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.12);
    --shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.2);

    --gradient-primary: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-gradient-end) 100%);
}

/* ============================================
   Global Styles
   ============================================ */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--color-bg);
    color: var(--color-text);
}

#app {
    min-height: 100vh;
}

code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
        monospace;
}

/* Consistent, visible keyboard focus across the app */
a:focus-visible,
button:focus-visible,
input:focus-visible,
[tabindex]:focus-visible {
    outline: 3px solid rgba(102, 126, 234, 0.5);
    outline-offset: 2px;
}

/* Route transition */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
