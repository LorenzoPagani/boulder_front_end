import { ref } from 'vue'

const STORAGE_KEY = 'boulder_mock_mode'

export const mockModeEnabled = ref(localStorage.getItem(STORAGE_KEY) === 'true')

export function setMockMode(enabled: boolean): void {
    mockModeEnabled.value = enabled

    if (enabled) {
        localStorage.setItem(STORAGE_KEY, 'true')
    } else {
        localStorage.removeItem(STORAGE_KEY)
    }
}
