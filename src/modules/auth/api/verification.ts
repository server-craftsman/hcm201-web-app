'use client'

import { apiClient } from '@/core/utils/api'

export interface ResendVerificationRequest {
    email: string
}

export interface ResendVerificationResponse {
    statusCode: number
    message: string
    timestamp: string
}

export interface VerifyEmailRequest {
    token: string
}

export interface VerifyEmailResponse {
    statusCode: number
    message: string
    data?: {
        user: any
    }
    timestamp: string
}

export const verificationApi = {
    // Resend verification email
    async resendVerification(data: ResendVerificationRequest): Promise<ResendVerificationResponse> {
        try {
            const response = await apiClient.post('/v1/auth/email/resend-verification', data)
            return response.data
        } catch (error: any) {
            console.error('Resend verification API error:', error)
            throw new Error(
                error.response?.data?.message ||
                'Không thể gửi lại email xác thực. Vui lòng thử lại sau.'
            )
        }
    },

    // Verify email with token
    async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
        try {
            const response = await apiClient.post('/v1/auth/email/verify-email', data)
            return response.data
        } catch (error: any) {
            console.error('Verify email API error:', error)
            throw new Error(
                error.response?.data?.message ||
                'Không thể xác thực email. Liên kết có thể đã hết hạn.'
            )
        }
    },

    // Check verification status
    async checkVerificationStatus(email: string): Promise<{ isVerified: boolean }> {
        try {
            const response = await apiClient.get(`/v1/auth/email/verification-status?email=${encodeURIComponent(email)}`)
            return response.data
        } catch (error: any) {
            console.error('Check verification status error:', error)
            return { isVerified: false }
        }
    }
}
