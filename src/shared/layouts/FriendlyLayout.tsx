'use client'

import React from 'react'
import { FriendlyNavbar } from '@/shared/components/layout/Navbar'
import { AuthDebug } from '@/shared/components/debug/AuthDebug'
import { EnvDebug } from '@/shared/components/debug/EnvDebug'

interface FriendlyLayoutProps {
    children: React.ReactNode
}

export const FriendlyLayout: React.FC<FriendlyLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <FriendlyNavbar showNavigation={true} />

            {/* Main Content */}
            <main className="pt-16">
                {children}
            </main>

            {/* Debug Components (only in development) */}
            {/* <AuthDebug /> */}
            {/* <EnvDebug /> */}
        </div>
    )
}
