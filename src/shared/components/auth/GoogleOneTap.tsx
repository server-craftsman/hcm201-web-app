'use client'

import { useEffect } from 'react'
import { useAuth } from '@/modules/auth/hooks'
import authConfig from '@/core/config/auth.config'
import { authApi } from '@/modules/auth/api'

export function GoogleOneTap() {
    const { isAuthenticated, loginWithGoogle } = useAuth()

    useEffect(() => {
        // Don't show One Tap if user is already authenticated
        if (isAuthenticated) return

        // Don't show in development mode to avoid conflicts
        if (process.env.NODE_ENV === 'development') {
            console.log('🔕 Google One Tap disabled in development mode')
            return
        }

        // Show One Tap after 2 seconds
        const timeout = setTimeout(() => initializeOneTap(), 2000)
        return () => clearTimeout(timeout)
    }, [isAuthenticated])

    const initializeOneTap = () => {
        if (typeof window === 'undefined' || !window) return

        // Check if user already has a token stored
        if (localStorage.getItem('accessToken')) return

        console.log('🎯 Initializing Google One Tap...')

        const { google } = window
        if (!google?.accounts?.id) {
            console.log('⚠️ Google API not available for One Tap')
            return
        }

        const clientId = authConfig.google.clientId
        if (!clientId) {
            console.log('⚠️ Google Client ID not configured')
            return
        }

        try {
            google.accounts.id.initialize({
                client_id: clientId,
                callback: handleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: true,
                use_fedcm_for_prompt: false,
            })

            // Show the One Tap prompt
            google.accounts.id.prompt((notification: any) => {
                if (notification.isNotDisplayed()) {
                    console.log('🚫 One Tap not displayed:', notification.getNotDisplayedReason())
                } else if (notification.isSkippedMoment()) {
                    console.log('⏭️ One Tap skipped:', notification.getSkippedReason())
                } else if (notification.isDismissedMoment()) {
                    console.log('❌ One Tap dismissed:', notification.getDismissedReason())
                }
            })
        } catch (error) {
            console.error('❌ Google One Tap initialization failed:', error)
        }
    }

    const handleCredentialResponse = async (response: any) => {
        try {
            console.log('🎉 Google One Tap credential received')

            if (!response.credential) {
                throw new Error('No credential received from Google One Tap')
            }

            // Use the existing auth system to handle Google login
            const result = await authApi.googleOAuth({
                accessToken: '', // One Tap only provides ID token
                idToken: response.credential
            })

            console.log('✅ Google One Tap login successful')

            // The auth system will handle storing tokens and updating state
            // No need to manually redirect here as the auth context will handle it

        } catch (error) {
            console.error('❌ Google One Tap login failed:', error)
            // Optionally show a fallback login option
        }
    }

    // This component doesn't render anything visible
    return null
}
