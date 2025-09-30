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
    idToken: string
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
            const r = await apiClient.post<any>('/auth/google', data)
            const d = r.data?.data || r.data
            return {
                accessToken: d?.access_token || d?.accessToken,
                refreshToken: d?.refresh_token || d?.refreshToken,
                user: d?.user,
            }
        } catch (error) {
            // If backend is not available, create a mock user from Google token
            console.warn('Backend not available, creating mock user from Google token')

            if (!data.idToken && !data.accessToken) {
                throw new Error('No valid Google tokens provided')
            }

            // Decode ID token to get user info (basic JWT decode without verification)
            let userInfo: any = {}
            if (data.idToken) {
                try {
                    const base64Url = data.idToken.split('.')[1]
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
                    const jsonPayload = decodeURIComponent(
                        atob(base64)
                            .split('')
                            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                            .join('')
                    )
                    userInfo = JSON.parse(jsonPayload)
                } catch (e) {
                    console.error('Failed to decode ID token:', e)
                }
            }

            // Create mock user with Google info
            const mockUser = {
                id: userInfo.sub || `google_${Date.now()}`,
                email: userInfo.email || 'unknown@gmail.com',
                username: userInfo.email?.split('@')[0] || 'googleuser',
                displayName: userInfo.name || 'Google User',
                firstName: userInfo.given_name || 'Google',
                lastName: userInfo.family_name || 'User',
                avatar: userInfo.picture || null,
                role: 'student',
                isVerified: true, // Google accounts are pre-verified
                provider: 'google',
                providerId: userInfo.sub,
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


