<template>
    <router-view />
</template>

<script setup lang="ts">
// App is intentionally minimal - all layout is handled by pages
</script>

<style>
/* Global Styles */
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
}

#app {
    min-height: 100vh;
}

code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
        monospace;
}
</style>
