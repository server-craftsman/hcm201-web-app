'use client'

import React from 'react'
import { AuthProvider } from '@/modules/auth'

export interface AppProvidersProps {
    children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}

export default AppProviders


