'use client'

import { useState, useEffect, useCallback } from 'react'
import { User, LoginCredentials, RegisterData } from '@/shared/types'
import authConfig from '@/core/config/auth.config'

// Mock users for frontend-only demo
const mockUsers = authConfig.mockUsers

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
}

export type UseAuthReturn = AuthState & AuthActions

export function useAuth(): UseAuthReturn {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: false,
    })

    const initializeAuth = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true }))

            // Check localStorage for saved user session
            const savedUser = localStorage.getItem('currentUser')

            if (savedUser) {
                const user = JSON.parse(savedUser)
                setState(prev => ({
                    ...prev,
                    user,
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
            // Clear any corrupted data
            localStorage.removeItem('currentUser')
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

    const login = useCallback(async (credentials: LoginCredentials) => {
        try {
            setState(prev => ({ ...prev, isLoading: true }))

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Find user in mock data
            const user = mockUsers.find(u => u.email === credentials.email)

            if (!user) {
                throw new Error('Email không tồn tại')
            }

            // Simple password check (in real app, this would be handled server-side)
            if (credentials.password !== 'password123') {
                throw new Error('Mật khẩu không đúng')
            }

            // Save user to localStorage
            localStorage.setItem('currentUser', JSON.stringify(user))

            setState(prev => ({
                ...prev,
                user: user as unknown as User,
                isAuthenticated: true,
                isLoading: false,
            }))
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }))
            throw error
        }
    }, [])

    const register = useCallback(async (data: RegisterData) => {
        try {
            setState(prev => ({ ...prev, isLoading: true }))

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Check if email already exists
            const existingUser = mockUsers.find(u => u.email === data.email)
            if (existingUser) {
                throw new Error('Email đã tồn tại')
            }

            // Create new user
            const newUser: User = {
                id: crypto.randomUUID(), // Generate a unique ID
                username: data.username,
                isEmailVerified: false,
                isActive: true,
                email: data.email,
                displayName: data.displayName,
                avatar: '/images/avatars/default.jpg',
                role: 'student',
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            // Save user to localStorage
            localStorage.setItem('currentUser', JSON.stringify(newUser))

            setState(prev => ({
                ...prev,
                user: newUser,
                isAuthenticated: true,
                isLoading: false,
            }))
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }))
            throw error
        }
    }, [])

    const logout = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true }))

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))

            // Clear local storage
            localStorage.removeItem('currentUser')

            setState(prev => ({
                ...prev,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            }))
        } catch (error) {
            // Even if something fails, clear local state
            localStorage.removeItem('currentUser')
            setState(prev => ({
                ...prev,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            }))
            throw error
        }
    }, [])

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
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }))
            throw error
        }
    }, [state.user])

    return {
        ...state,
        login,
        register,
        logout,
        refreshAuth,
        updateProfile,
    }
}

// Context version for providing auth state globally

