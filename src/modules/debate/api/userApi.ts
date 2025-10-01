import { apiClient } from '@/core/utils/api'

export const userApi = {
    // GET /api/v1/users - Get users list with pagination, filtering, and sorting
    getUsers: async (params: {
        page?: number
        limit?: number
        email?: string
        username?: string
        status?: string
        role?: string
        sortBy?: string
        sortOrder?: string
        createdAtFrom?: string
        createdAtTo?: string
        lastSeenFrom?: string
    }) => {
        try {
            const response = await apiClient.get('/users', { params })
            return response.data
        } catch (error) {
            console.error('Failed to get users:', error)
            throw error
        }
    },

    // PATCH /api/v1/auth/admin/change-role - Admin change user role
    changeUserRole: async (data: {
        userId: string
        newRole: string
        reason: string
    }) => {
        try {
            const response = await apiClient.patch('/auth/admin/change-role', data)
            return response.data
        } catch (error) {
            console.error('Failed to change user role:', error)
            throw error
        }
    },

    // PATCH /api/v1/users/{id} - Update user information by ID
    updateUserProfile: async (userId: string, data: {
        email?: string
        username?: string
        firstName?: string
        lastName?: string
        phone?: number
        dateOfBirth?: string
        gender?: string
        bio?: string
        location?: string
        website?: string
        avatar?: string
        role?: string
    }) => {
        try {
            const response = await apiClient.patch(`/users/${userId}`, data)
            return response.data
        } catch (error) {
            console.error('Failed to update user profile:', error)
            throw error
        }
    },

    // PATCH /api/v1/auth/change-password - User change their own password
    changePassword: async (data: {
        currentPassword: string
        newPassword: string
        confirmPassword: string
    }) => {
        try {
            const response = await apiClient.patch('/auth/change-password', data)
            return response.data
        } catch (error) {
            console.error('Failed to change password:', error)
            throw error
        }
    }
}
