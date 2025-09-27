'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export const useSidebar = () => {
    const [collapsed, setCollapsed] = useState(false)
    const [showMobileDrawer, setShowMobileDrawer] = useState(false)
    const pathname = usePathname()

    // Check if we're on a detail page
    const isDetailPage = () => {
        const detailPatterns = [
            /\/debates\/[^/]+$/, // /debates/123
            /\/study\/[^/]+$/,   // /study/123
            /\/community\/[^/]+$/, // /community/123
            /\/admin\/[^/]+\/[^/]+$/, // /admin/threads/123
            /\/moderation\/[^/]+\/[^/]+$/, // /moderation/queue/123
            /\/my-[^/]+\/[^/]+$/, // /my-arguments/123
        ]

        return detailPatterns.some(pattern => pattern.test(pathname))
    }

    // Auto-collapse on smaller screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1280) { // xl breakpoint
                setCollapsed(true)
            } else {
                setCollapsed(false)
            }
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Close mobile drawer when route changes
    useEffect(() => {
        setShowMobileDrawer(false)
    }, [pathname])

    const toggleCollapsed = () => {
        setCollapsed(!collapsed)
    }

    const toggleMobileDrawer = () => {
        setShowMobileDrawer(!showMobileDrawer)
    }

    const closeMobileDrawer = () => {
        setShowMobileDrawer(false)
    }

    return {
        collapsed,
        showMobileDrawer,
        isDetailPage: isDetailPage(),
        toggleCollapsed,
        toggleMobileDrawer,
        closeMobileDrawer
    }
}
