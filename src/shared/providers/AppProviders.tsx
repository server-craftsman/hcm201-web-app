'use client'

import React from 'react'
import { AuthProvider } from '@/modules/auth'
import { NotificationCenter } from './NotificationCenter'

export interface AppProvidersProps {
    children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <NotificationCenter>
            <AuthProvider>
                {children}
            </AuthProvider>
        </NotificationCenter>
    )
}

export default AppProviders


