'use client'

import React from 'react'
import { AuthProvider } from '@/modules/auth'
import { NotificationCenter } from './NotificationCenter'
import { ThemeProvider } from '@/shared/contexts/ThemeContext'

export interface AppProvidersProps {
    children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <ThemeProvider defaultTheme="system" storageKey="hcm201-theme">
            <NotificationCenter>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </NotificationCenter>
        </ThemeProvider>
    )
}

export default AppProviders


