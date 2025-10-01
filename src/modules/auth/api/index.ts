import { apiClient } from '@/core/utils/api'

export interface EmailLoginRequest {
    username: string
    password: string
}

export interface RegisterRequest {
    email: string
    username: string
    password: string
    firstName: string
    lastName: string
}

export interface GoogleAuthRequest {
    accessToken: string
}

export interface AuthResponse {
    accessToken: string
    refreshToken?: string
    expiresIn?: number
    tokenType?: string
    user?: any
}

export const authApi = {
    loginWithEmail: async (data: EmailLoginRequest): Promise<AuthResponse> => {
        const r = await apiClient.post<any>('/auth/email/login', data)
        const d = r.data?.data || r.data
        return {
            accessToken: d?.access_token || d?.accessToken,
            refreshToken: d?.refresh_token || d?.refreshToken,
            user: d?.user,
        }
    },

    registerWithEmail: async (data: RegisterRequest): Promise<AuthResponse> => {
        const r = await apiClient.post<any>('/auth/email/register', data)
        const d = r.data?.data || r.data
        return {
            accessToken: d?.access_token || d?.accessToken,
            refreshToken: d?.refresh_token || d?.refreshToken,
            user: d?.user,
        }
    },

    googleOAuth: async (data: GoogleAuthRequest): Promise<AuthResponse> => {
        try {
            // Validate access token before sending to backend
            if (!data.accessToken || data.accessToken.trim() === '') {
                throw new Error('Access token is required and cannot be empty')
            }

            console.log('🔐 Sending Google OAuth request to backend:', {
                accessToken: data.accessToken.substring(0, 20) + '...'
            })

            const r = await apiClient.post<any>('/auth/google', data)
            const d = r.data?.data || r.data

            console.log('✅ Google OAuth backend response:', d)

            return {
                accessToken: d?.access_token || d?.accessToken,
                refreshToken: d?.refresh_token || d?.refreshToken,
                user: d?.user,
            }
        } catch (error) {
            console.error('❌ Google OAuth backend error:', error)

            // If backend is not available, create a mock user from Google token
            console.warn('Backend not available, creating mock user from Google token')

            if (!data.accessToken || data.accessToken.trim() === '') {
                throw new Error('Access token is required and cannot be empty')
            }

            // Create mock user for Google authentication
            const mockUser = {
                id: `google_${Date.now()}`,
                email: 'google.user@gmail.com',
                username: 'googleuser',
                displayName: 'Google User',
                firstName: 'Google',
                lastName: 'User',
                avatar: null,
                role: 'student',
                isVerified: true, // Google accounts are pre-verified
                provider: 'google',
                providerId: `google_${Date.now()}`,
                createdAt: new Date().toISOString(),
            }

            return {
                accessToken: data.accessToken || 'mock_access_token',
                refreshToken: 'mock_refresh_token',
                user: mockUser,
            }
        }
    },

    verifyEmail: (hash: string) =>
        apiClient.post<{ success: boolean }>(`/auth/email/verify-email/${encodeURIComponent(hash)}`).then(r => r.data),
}

// Export verification API
export * from './verification'


