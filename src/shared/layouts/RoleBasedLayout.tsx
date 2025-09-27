'use client'

import { useAuthContext } from '@/modules/auth'
import { UserLayout } from './UserLayout'
import { ModeratorLayout } from './ModeratorLayout'
import { AdminLayout } from './AdminLayout'
import { FriendlyLayout } from './FriendlyLayout'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface RoleBasedLayoutProps {
    children: React.ReactNode
}

export const RoleBasedLayout: React.FC<RoleBasedLayoutProps> = ({ children }) => {
    const { user, isAuthenticated, isLoading } = useAuthContext()
    const pathname = usePathname()

    // Define routes that should use role-based layouts
    const roleBasedRoutes = {
        USER: [
            '/my-dashboard',
            '/my-arguments',
            '/my-votes',
            '/achievements',
            '/profile',
            '/notifications'
        ],
        MODERATOR: [
            '/moderation/dashboard',
            '/moderation/queue',
            '/moderation/logs',
            '/moderation/reports',
            '/monitoring'
        ],
        ADMIN: [
            '/admin/dashboard',
            '/admin/threads',
            '/admin/users',
            '/admin/analytics',
            '/admin/settings',
            '/monitoring'
        ]
    }

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-blue-100"
                >
                    <div className="flex items-center space-x-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"
                        />
                        <div>
                            <h3 className="font-semibold text-gray-900">Đang tải...</h3>
                            <p className="text-sm text-gray-600">Xác thực người dùng</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }

    // If not authenticated, use default FriendlyLayout
    if (!isAuthenticated || !user) {
        return <FriendlyLayout>{children}</FriendlyLayout>
    }

    // Check if current route should use role-based layout
    const userRole = user.role?.toUpperCase() as keyof typeof roleBasedRoutes
    const shouldUseRoleLayout = userRole && roleBasedRoutes[userRole]?.some(route => pathname.startsWith(route))

    // If current route doesn't require role-based layout, use FriendlyLayout
    if (!shouldUseRoleLayout) {
        return <FriendlyLayout>{children}</FriendlyLayout>
    }

    // Choose layout based on user role for specific routes
    switch (userRole) {
        case 'ADMIN':
            return <AdminLayout>{children}</AdminLayout>
        case 'MODERATOR':
            return <ModeratorLayout>{children}</ModeratorLayout>
        case 'USER':
        default:
            return <UserLayout>{children}</UserLayout>
    }
}
