'use client'

import React from 'react'
import { Navbar } from '@/shared/components/layout/Navbar'
import { Footer } from '@/shared/components/layout/Footer'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export interface MainLayoutProps {
    children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    const pathname = usePathname()

    return (
        <div className="min-h-screen flex flex-col relative overflow-x-hidden">
            {/* Background gradient */}
            <div className="fixed inset-0 bg-gradient-to-br from-white via-neutral-50 to-primary-50/30 pointer-events-none" />

            {/* Animated background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100/20 rounded-full blur-3xl animate-luxury-float" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-100/20 rounded-full blur-3xl animate-luxury-float" style={{ animationDelay: '4s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-50/30 rounded-full blur-2xl animate-luxury-float" style={{ animationDelay: '2s' }} />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <AnimatePresence mode="wait">
                    <motion.main
                        key={pathname}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="flex-1 transition-all duration-300"
                    >
                        {children}
                    </motion.main>
                </AnimatePresence>
                <Footer />
            </div>
        </div>
    )
}

export default MainLayout


