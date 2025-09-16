'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { UseAuthReturn } from '../hooks/useAuth'


const AuthContext = createContext<UseAuthReturn | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuth()

    return (
        <AuthContext.Provider value={auth} >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext(): UseAuthReturn {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider')
    }

    return context
}