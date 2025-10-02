'use client'

import { usePathname } from 'next/navigation'
import { YouTubeLayout } from '@/shared/layouts/YouTubeLayout'

interface ConditionalLayoutProps {
    children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const pathname = usePathname()

    // Check if current route is an auth route
    const isAuthRoute = pathname?.startsWith('/login') || pathname?.startsWith('/register')

    // If it's an auth route, render children without YouTubeLayout
    if (isAuthRoute) {
        return <>{children}</>
    }

    // For all other routes, use the normal layout with YouTubeLayout
    return (
        <YouTubeLayout>
            {children}
        </YouTubeLayout>
    )
}
