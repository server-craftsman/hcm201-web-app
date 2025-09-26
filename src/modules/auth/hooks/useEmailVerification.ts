'use client'

import { useState, useCallback } from 'react'
import { verificationApi } from '../api/verification'
import { useAuthNotifications } from '../components/AuthNotifications'

interface EmailVerificationState {
    isLoading: boolean
    isVerifying: boolean
    isResending: boolean
    error: string | null
}

export function useEmailVerification() {
    const authNotifications = useAuthNotifications()
    const [state, setState] = useState<EmailVerificationState>({
        isLoading: false,
        isVerifying: false,
        isResending: false,
        error: null
    })

    // Resend verification email
    const resendVerification = useCallback(async (email: string) => {
        setState(prev => ({ ...prev, isResending: true, error: null }))

        try {
            await verificationApi.resendVerification({ email })
            setState(prev => ({ ...prev, isResending: false }))

            // Show success notification via AuthNotifications
            authNotifications.showResendVerificationEmail(email)
        } catch (error) {
            setState(prev => ({
                ...prev,
                isResending: false,
                error: (error as Error).message
            }))
            throw error
        }
    }, [authNotifications])

    // Verify email with token
    const verifyEmail = useCallback(async (token: string) => {
        setState(prev => ({ ...prev, isVerifying: true, error: null }))

        try {
            const result = await verificationApi.verifyEmail({ token })
            setState(prev => ({ ...prev, isVerifying: false }))

            // Show success notification
            authNotifications.showEmailVerificationSuccess()

            return result
        } catch (error) {
            setState(prev => ({
                ...prev,
                isVerifying: false,
                error: (error as Error).message
            }))

            // Show error notification
            authNotifications.showEmailVerificationFailed((error as Error).message)

            throw error
        }
    }, [authNotifications])

    // Check verification status
    const checkVerificationStatus = useCallback(async (email: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const result = await verificationApi.checkVerificationStatus(email)
            setState(prev => ({ ...prev, isLoading: false }))

            return result
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: (error as Error).message
            }))

            return { isVerified: false }
        }
    }, [])

    // Show verification reminder
    const showVerificationReminder = useCallback((email: string) => {
        authNotifications.showAccountNotVerified(email)
    }, [authNotifications])

    return {
        ...state,
        resendVerification,
        verifyEmail,
        checkVerificationStatus,
        showVerificationReminder
    }
}

// Hook for email verification page/component
export function useEmailVerificationPage() {
    const { verifyEmail, isVerifying, error } = useEmailVerification()

    // Auto-verify when component mounts with token in URL
    const autoVerifyFromUrl = useCallback(async () => {
        if (typeof window === 'undefined') return

        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')

        if (token) {
            try {
                await verifyEmail(token)
            } catch (error) {
                console.error('Auto verification failed:', error)
            }
        }
    }, [verifyEmail])

    return {
        autoVerifyFromUrl,
        verifyEmail,
        isVerifying,
        error
    }
}
