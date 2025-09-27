'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { YouTubeSidebar } from '@/shared/components/layout/Sidebar'
import { FriendlyNavbar } from '@/shared/components/layout/Navbar'
import { useSidebar } from '@/shared/hooks'
import { cn } from '@/shared/utils'
import { Bars3Icon } from '@heroicons/react/24/outline'

interface YouTubeLayoutProps {
    children: React.ReactNode
}

export const YouTubeLayout: React.FC<YouTubeLayoutProps> = ({ children }) => {
    const {
        collapsed,
        showMobileDrawer,
        isDetailPage,
        toggleCollapsed,
        toggleMobileDrawer,
        closeMobileDrawer
    } = useSidebar()

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
            {/* Sidebar for desktop */}
            {!isDetailPage && (
                <YouTubeSidebar
                    collapsed={collapsed}
                    onToggleCollapsed={toggleCollapsed}
                />
            )}

            {/* Mobile Drawer */}
            {showMobileDrawer && (
                <YouTubeSidebar
                    collapsed={false}
                    onToggleCollapsed={toggleMobileDrawer}
                    isDrawer={true}
                    onClose={closeMobileDrawer}
                />
            )}

            {/* Main Content Area */}
            <div className={cn(
                "flex-1 flex flex-col overflow-hidden transition-all duration-300",
                !isDetailPage && !collapsed ? "lg:ml-[280px]" : !isDetailPage ? "lg:ml-[72px]" : "ml-0"
            )}>
                {/* Top Navigation */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700"
                >
                    <div className="flex items-center justify-between px-4 h-16">
                        {/* Mobile menu button or back button for detail pages */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={isDetailPage ? () => window.history.back() : toggleMobileDrawer}
                                className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                {isDetailPage ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                ) : (
                                    <Bars3Icon className="h-5 w-5" />
                                )}
                            </button>

                            {/* Logo for mobile or detail pages */}
                            <div className="flex items-center space-x-3 lg:hidden">
                                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-amber-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">HCM</span>
                                </div>
                                <span className="font-bold text-lg text-slate-900 dark:text-white hidden sm:block">
                                    Tư tưởng HCM
                                </span>
                            </div>
                        </div>

                        {/* Right side of navbar */}
                        <div className="flex items-center space-x-4">
                            {/* Search Bar */}
                            <div className="hidden md:flex items-center max-w-md mx-4">
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        className="w-full px-4 py-2 pl-10 pr-4 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                    />
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* User Menu - Use existing FriendlyNavbar user section */}
                            <FriendlyNavbar showNavigation={false} className="bg-transparent border-none shadow-none" />
                        </div>
                    </div>
                </motion.header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="h-full"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    )
}
