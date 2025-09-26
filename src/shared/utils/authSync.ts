'use client'

// Auth synchronization utilities
export const authSync = {
    // Trigger auth state change event
    triggerAuthChange: () => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('authStateChanged', {
                detail: { timestamp: Date.now() }
            }))
        }
    },

    // Force refresh auth state
    forceRefreshAuth: () => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('forceAuthRefresh', {
                detail: { timestamp: Date.now() }
            }))
        }
    },

    // Check if user data exists in localStorage
    hasStoredUser: (): boolean => {
        if (typeof window === 'undefined') return false
        return !!(localStorage.getItem('currentUser') && localStorage.getItem('accessToken'))
    },

    // Get stored user data
    getStoredUser: () => {
        if (typeof window === 'undefined') return null
        try {
            const userData = localStorage.getItem('currentUser')
            return userData ? JSON.parse(userData) : null
        } catch (error) {
            console.error('Error parsing stored user data:', error)
            return null
        }
    },

    // Clear all auth data
    clearAuthData: () => {
        if (typeof window === 'undefined') return
        localStorage.removeItem('currentUser')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        authSync.triggerAuthChange()
    },

    // Store auth data
    storeAuthData: (user: any, tokens: { accessToken?: string, refreshToken?: string }) => {
        if (typeof window === 'undefined') return

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user))
        }
        if (tokens.accessToken) {
            localStorage.setItem('accessToken', tokens.accessToken)
        }
        if (tokens.refreshToken) {
            localStorage.setItem('refreshToken', tokens.refreshToken)
        }

        authSync.triggerAuthChange()
    }
}
