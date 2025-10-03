'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    PlusIcon,
    SparklesIcon,
    ChartBarIcon,
    ChatBubbleLeftRightIcon,
    TrophyIcon,
    UsersIcon
} from '@heroicons/react/24/outline'
import bannerDebate from '@/shared/assets/images/bg-debate-1.jpg'
import { useNotificationCenter } from '@/shared/providers/NotificationCenter'
import { useAuth } from '@/modules/auth/hooks'

export function HeroSection() {
    const { user } = useAuth()
    const router = useRouter()
    const notification = useNotificationCenter()


    // Handler cho nút CTA
    const handleJoinDebate = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!user) {
            e.preventDefault()
            notification.showCorner({
                type: 'warning',
                title: 'Vui lòng đăng nhập trước khi tham gia tranh luận',
                message: '',
                duration: 3000, // Tự đóng sau 2.5 giây
                dismissible: true
            })
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        }
        // Nếu đã đăng nhập thì không làm gì, Link sẽ hoạt động bình thường
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={bannerDebate.src}
                    alt="Debate Banner"
                    className="w-full h-full object-cover"
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70" />

                {/* Animated gradient overlay - Red & Yellow theme */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-red-600/15 via-yellow-500/10 to-red-500/15"
                    animate={{
                        background: [
                            "linear-gradient(45deg, rgba(220, 38, 38, 0.15), rgba(251, 191, 36, 0.1), rgba(220, 38, 38, 0.15))",
                            "linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(220, 38, 38, 0.1), rgba(251, 191, 36, 0.15))",
                            "linear-gradient(225deg, rgba(220, 38, 38, 0.15), rgba(251, 191, 36, 0.1), rgba(220, 38, 38, 0.15))",
                            "linear-gradient(315deg, rgba(251, 191, 36, 0.15), rgba(220, 38, 38, 0.1), rgba(251, 191, 36, 0.15))"
                        ]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                {/* Floating orbs - Red & Yellow theme */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500/8 to-red-600/12 rounded-full blur-3xl"
                    animate={{
                        x: [0, 100, -50, 0],
                        y: [0, -50, 100, 0],
                        scale: [1, 1.2, 0.8, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-yellow-500/8 to-yellow-600/12 rounded-full blur-3xl"
                    animate={{
                        x: [0, -80, 60, 0],
                        y: [0, 60, -80, 0],
                        scale: [1, 0.8, 1.3, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-red-400/8 to-yellow-500/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, 120, -40, 0],
                        y: [0, -40, 120, 0],
                        scale: [1, 1.4, 0.6, 1]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Geometric patterns overlay */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M50 0L100 50L50 100L0 50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '100px 100px'
                }} />
            </div>

            {/* Animated particles */}
            <div className="absolute inset-0">
                {Array.from({ length: 30 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Main content - Minimalist Design */}
            <div className="relative z-10 container mx-auto px-4 py-20">
                <div className="flex flex-col lg:flex-row items-center justify-between min-h-[70vh] gap-12">
                    {/* Left side - Minimal text */}
                    <motion.div
                        className="flex-1 text-center lg:text-left"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        {/* Simple badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="inline-flex items-center space-x-2 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-full px-4 py-2 mb-6"
                        >
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                            <span className="text-red-100 font-medium text-sm">Nền tảng tranh luận</span>
                        </motion.div>

                        {/* Main title - Simplified */}
                        <motion.h1
                            className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <span className="block text-white">Tranh luận</span>
                            <span className="block text-red-200 text-3xl lg:text-5xl font-light mt-2">
                                Tư tưởng Hồ Chí Minh
                            </span>
                        </motion.h1>

                        {/* Minimal subtitle */}
                        <motion.p
                            className="text-lg text-white/80 max-w-md leading-relaxed mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            Chia sẻ các quan điểm đa chiều
                        </motion.p>

                        {/* Single CTA button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1 }}
                        >
                            <Link href={user ? "/debates/request" : "#"} legacyBehavior>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-red-500/25 transition-all duration-300 cursor-pointer"
                                    onClick={handleJoinDebate}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    />
                                    <span className="relative flex items-center gap-3">
                                        <PlusIcon className="h-5 w-5" />
                                        Tham gia tranh luận
                                    </span>
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right side - Visual elements */}
                    <motion.div
                        className="flex-1 flex justify-center lg:justify-end"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        {/* Floating debate elements */}
                        <div className="relative">
                            {/* Main podium */}
                            <motion.div
                                className="w-32 h-32 bg-gradient-to-br from-red-500/20 to-red-600/30 backdrop-blur-sm border border-red-400/30 rounded-2xl flex items-center justify-center shadow-xl"
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, 2, 0]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <ChatBubbleLeftRightIcon className="h-12 w-12 text-red-200" />
                            </motion.div>

                            {/* Floating microphones */}
                            <motion.div
                                className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400/80 rounded-full flex items-center justify-center shadow-lg"
                                animate={{
                                    y: [0, -5, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            >
                                <div className="w-2 h-2 bg-yellow-600 rounded-full" />
                            </motion.div>

                            <motion.div
                                className="absolute -bottom-4 -right-4 w-8 h-8 bg-yellow-400/80 rounded-full flex items-center justify-center shadow-lg"
                                animate={{
                                    y: [0, -5, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <div className="w-2 h-2 bg-yellow-600 rounded-full" />
                            </motion.div>

                            {/* Floating birds */}
                            <motion.div
                                className="absolute top-8 -right-8 w-6 h-6 text-red-300"
                                animate={{
                                    x: [0, 20, 0],
                                    y: [0, -10, 0]
                                }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            </motion.div>

                            <motion.div
                                className="absolute bottom-8 -left-8 w-6 h-6 text-red-300"
                                animate={{
                                    x: [0, -20, 0],
                                    y: [0, -10, 0]
                                }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Decorative elements - Red & Yellow theme */}
            <div className="absolute top-20 left-20 w-2 h-2 bg-red-400/60 rounded-full animate-pulse" />
            <div className="absolute top-40 right-32 w-3 h-3 bg-yellow-400/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-40 left-32 w-2 h-2 bg-red-400/70 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-20 right-20 w-4 h-4 bg-yellow-400/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />

            {/* Scroll indicator - Red theme */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="w-6 h-10 border-2 border-red-400/40 rounded-full flex justify-center">
                    <motion.div
                        className="w-1 h-3 bg-red-400/60 rounded-full mt-2"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>
        </motion.div>
    )
}
