<template>
    <label class="toggle-switch">
        <input type="checkbox" role="switch" :aria-checked="modelValue" :checked="modelValue"
            @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)" />
        <span class="track">
            <span class="thumb"></span>
        </span>
    </label>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: boolean
}>()

defineEmits<{
    'update:modelValue': [value: boolean]
}>()
</script>

<style scoped>
.toggle-switch {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    cursor: pointer;
}

.toggle-switch input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    cursor: pointer;
}

.track {
    width: 46px;
    height: 26px;
    background: var(--color-border);
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    padding: 3px;
    transition: background 0.2s;
}

.thumb {
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s;
}

.toggle-switch input:checked+.track {
    background: var(--color-primary);
}

.toggle-switch input:checked+.track .thumb {
    transform: translateX(20px);
}

.toggle-switch input:focus-visible+.track {
    outline: 3px solid rgba(102, 126, 234, 0.5);
    outline-offset: 2px;
}
</style>
