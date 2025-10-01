'use client'

import { useState, useEffect, useCallback } from 'react'
import { User, LoginCredentials, RegisterData, AuthResult } from '@/shared/types'
import { authApi } from '@/modules/auth/api'
import { getGoogleTokens } from '@/shared/utils'
import { useNotificationCenterOptional } from '@/shared/providers/NotificationCenter'
import { useAuthNotifications } from '../components/AuthNotifications'
import authConfig from '@/core/config/auth.config'
import { useRouter } from 'next/navigation'
import { authSync } from '@/shared/utils/authSync'

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    isInitialized: boolean
}

interface AuthActions {
    login: (credentials: LoginCredentials) => Promise<void>
    register: (data: RegisterData) => Promise<void>
    logout: () => Promise<void>
    refreshAuth: () => Promise<void>
    updateProfile: (data: Partial<User>) => Promise<void>
    loginWithGoogle: (clientId?: string) => Promise<void>
}

export type UseAuthReturn = AuthState & AuthActions

export function useAuth(): UseAuthReturn {
    const notification = useNotificationCenterOptional()
    const authNotifications = useAuthNotifications()
    const router = useRouter()
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: false,
    })

    const initializeAuth = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true }))

            // Use authSync utility to get stored user
            const storedUser = authSync.getStoredUser()
            const hasAuthData = authSync.hasStoredUser()

            if (storedUser && hasAuthData) {
                setState(prev => ({
                    ...prev,
                    user: storedUser,
                    isAuthenticated: true,
                    isLoading: false,
                    isInitialized: true,
                }))
            } else {
                setState(prev => ({
                    ...prev,
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    isInitialized: true,
                }))
            }
        } catch (error) {
            // Clear any corrupted data using authSync
            authSync.clearAuthData()
            setState(prev => ({
                ...prev,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                isInitialized: true,
            }))
        }
    }, [])

    // Initialize auth state on mount
    useEffect(() => {
        initializeAuth()
    }, [initializeAuth])

    // Listen for localStorage changes (for multi-tab sync)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'currentUser' || e.key === 'accessToken') {
                initializeAuth()
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [initializeAuth])

    // Listen for custom auth events
    useEffect(() => {
        const handleAuthChange = () => {
            initializeAuth()
        }

        window.addEventListener('authStateChanged', handleAuthChange)
        return () => window.removeEventListener('authStateChanged', handleAuthChange)
    }, [initializeAuth])

    const login = useCallback(async (credentials: LoginCredentials) => {
        try {
            setState(prev => ({ ...prev, isLoading: true }))

            const payload = { username: credentials.username, password: credentials.password }
            const result: AuthResult = await authApi.loginWithEmail(payload as any)

            // Store auth data and trigger sync
            authSync.storeAuthData(result.user, {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            })

            setState(prev => ({
                ...prev,
                user: (result.user || null) as User | null,
                isAuthenticated: true,
                isLoading: false,
            }))

            authNotifications.showLoginSuccess({
                redirectDelay: 2000,
                playSound: true,
                hapticFeedback: true
            })
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }))
            const errorMessage = (error as any)?.response?.data?.message || (error as Error)?.message || 'Đăng nhập thất bại'

            // Check if error is due to unverified account
            if (errorMessage.includes('verify') || errorMessage.includes('verification') || errorMessage.includes('not verified')) {
                authNotifications.showAccountNotVerified(credentials.username)
            } else {
                authNotifications.showLoginError(errorMessage)
            }
            throw error
        }
    }, [authNotifications, router])

    const register = useCallback(async (data: RegisterData) => {
        try {
            setState(prev => ({ ...prev, isLoading: true }))

            const payload = {
                email: data.email,
                username: data.username,
                password: data.password,
                firstName: data.displayName?.split(' ').slice(0, -1).join(' ') || data.displayName,
                lastName: data.displayName?.split(' ').slice(-1).join(' ') || '',
            }

            const result: AuthResult = await authApi.registerWithEmail(payload as any)

            // Store auth data and trigger sync
            authSync.storeAuthData(result.user, {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            })

            setState(prev => ({
                ...prev,
                user: (result.user || null) as User | null,
                isAuthenticated: true,
                isLoading: false,
            }))

            // Check if user needs email verification
            const needsVerification = result.user && !result.user.isVerified

            authNotifications.showRegisterSuccess(
                result.user,
                needsVerification,
                {
                    playSound: true,
                    hapticFeedback: true
                }
            )
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }))
            const errorMessage = (error as any)?.response?.data?.message || (error as Error)?.message || 'Đăng ký thất bại'
            authNotifications.showRegisterError(errorMessage)
            throw error
        }
    }, [authNotifications, router])

    const logout = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true }))

            // Clear auth data and trigger sync
            authSync.clearAuthData()

            setState(prev => ({
                ...prev,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            }))

            authNotifications.showLogoutSuccess()
            router.push('/login')
        } catch (error) {
            // Even if something fails, clear local state
            localStorage.removeItem('currentUser')
            setState(prev => ({
                ...prev,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            }))
            authNotifications.showLogoutSuccess()
            throw error
        }
    }, [authNotifications])

    const refreshAuth = useCallback(async () => {
        // For frontend-only, just re-initialize from localStorage
        await initializeAuth()
    }, [initializeAuth])

    const updateProfile = useCallback(async (data: Partial<User>) => {
        try {
            setState(prev => ({ ...prev, isLoading: true }))

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            if (!state.user) {
                throw new Error('User not authenticated')
            }

            const updatedUser = { ...state.user, ...data }

            // Update localStorage
            localStorage.setItem('currentUser', JSON.stringify(updatedUser))

            setState(prev => ({
                ...prev,
                user: updatedUser,
                isLoading: false,
            }))

            authNotifications.showProfileUpdateSuccess()
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }))
            const errorMessage = (error as any)?.response?.data?.message || (error as Error)?.message || 'Cập nhật thất bại'
            authNotifications.showProfileUpdateError(errorMessage)
            throw error
        }
    }, [state.user, authNotifications])

    const loginWithGoogle = useCallback(async (clientId?: string) => {
        try {
            setState(prev => ({ ...prev, isLoading: true }))

            // Use clientId from config if not provided
            const googleClientId = clientId || authConfig.google.clientId
            if (!googleClientId) {
                throw new Error('Google Client ID not configured')
            }

            console.log('🔐 Starting Google login process...')

            const { accessToken } = await getGoogleTokens(googleClientId, authConfig.google.scopes)

            console.log('✅ Google access token received, sending to backend...')

            const result: AuthResult = await authApi.googleOAuth({ accessToken })

            console.log('✅ Backend authentication successful, storing user data...')

            // Store auth data and trigger sync
            authSync.storeAuthData(result.user, {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            })

            setState(prev => ({
                ...prev,
                user: (result.user || null) as User | null,
                isAuthenticated: true,
                isLoading: false,
            }))

            authNotifications.showGoogleLoginSuccess({
                redirectDelay: 2000,
                playSound: true,
                hapticFeedback: true
            })
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }))
            const errorMessage = (error as any)?.response?.data?.message || (error as Error)?.message || 'Google đăng nhập thất bại'

            console.error('❌ Google login error:', errorMessage)

            // Check if it's an ad blocker issue
            if (errorMessage.includes('blocked') || errorMessage.includes('ad blocker')) {
                // Show special notification for ad blocker issues
                authNotifications.showGoogleLoginError('Google Sign-In bị chặn bởi trình chặn quảng cáo. Vui lòng tắt trình chặn quảng cáo cho trang web này.')
            } else if (errorMessage.includes('Access token is required')) {
                authNotifications.showGoogleLoginError('Không thể lấy Access token từ Google. Vui lòng thử lại hoặc kiểm tra trình chặn quảng cáo.')
            } else {
                authNotifications.showGoogleLoginError(errorMessage)
            }
            throw error
        }
    }, [authNotifications, router])

    return {
        ...state,
        login,
        register,
        logout,
        refreshAuth,
        updateProfile,
        loginWithGoogle,
    }
}

// Context version for providing auth state globally

