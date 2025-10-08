'use client'

import { motion } from 'framer-motion'
import { LoginForm } from '@/modules/auth'
import Link from 'next/link'

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#faf9f7] relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute inset-0">
                {/* Hand-drawn style lines */}
                <div className="absolute top-20 left-10 w-32 h-0.5 bg-black/20 rotate-12"></div>
                <div className="absolute top-40 right-20 w-24 h-0.5 bg-black/20 -rotate-12"></div>
                <div className="absolute bottom-32 left-1/4 w-20 h-0.5 bg-black/20 rotate-45"></div>

                {/* Dotted patterns */}
                <div className="absolute top-32 right-1/4 w-16 h-16 bg-yellow-200 rounded-full opacity-60"></div>
                <div className="absolute bottom-40 right-10 w-12 h-12 bg-yellow-200 rounded-full opacity-60"></div>

                {/* Geometric shapes */}
                <div className="absolute top-1/3 right-1/3 w-8 h-8 border-2 border-black/30 rounded"></div>
                <div className="absolute bottom-1/4 left-1/3 w-6 h-6 bg-orange-200 rounded"></div>
            </div>

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-6">
                <div className="flex justify-between items-center">
                    <Link href="/">
                        <div>
                            <h1 className="text-2xl font-bold text-black">HCM202</h1>
                            <p className="text-sm text-gray-600">Tư tưởng Hồ Chí Minh</p>
                        </div>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/register"
                            className="text-black hover:text-orange-600 transition-colors"
                        >
                            Đăng ký
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex items-center justify-center min-h-screen pt-20">
                <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center px-6">
                    {/* Left Side - Login Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex justify-center lg:justify-start"
                    >
                        <div className="w-full max-w-md">
                            <LoginForm className="w-full" />

                            {/* Switch to Register */}
                            <div className="mt-6 text-center">
                                <p className="text-gray-600">
                                    Chưa có tài khoản?{' '}
                                    <Link
                                        href="/register"
                                        className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                                    >
                                        Đăng ký ngay
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hidden lg:block relative"
                    >
                        {/* Person Illustration */}
                        <div className="relative">
                            {/* Person sitting on block */}
                            <div className="relative">
                                {/* White block */}
                                <div className="w-32 h-20 bg-white border-2 border-black/20 rounded-lg shadow-lg"></div>

                                {/* Person figure */}
                                <div className="absolute -top-16 left-4">
                                    {/* Head */}
                                    <div className="w-8 h-8 bg-black rounded-full"></div>

                                    {/* Hair (bun) */}
                                    <div className="absolute -top-2 left-1 w-6 h-6 bg-black rounded-full"></div>

                                    {/* Body */}
                                    <div className="w-12 h-16 bg-white border-2 border-black/20 rounded-lg mt-2"></div>

                                    {/* Arms */}
                                    <div className="absolute top-4 -left-2 w-4 h-8 bg-black/20 rounded-full"></div>
                                    <div className="absolute top-4 -right-2 w-4 h-8 bg-black/20 rounded-full"></div>

                                    {/* Legs */}
                                    <div className="absolute bottom-0 left-2 w-3 h-8 bg-black/20 rounded-full"></div>
                                    <div className="absolute bottom-0 right-2 w-3 h-8 bg-black/20 rounded-full"></div>
                                </div>

                                {/* Laptop */}
                                <div className="absolute top-2 right-4 w-16 h-10 bg-green-200 border-2 border-black/20 rounded-lg"></div>
                            </div>

                            {/* Background shapes */}
                            <div className="absolute -top-8 -right-8 w-24 h-24 bg-orange-200 rounded-lg opacity-60"></div>
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-200 rounded-lg opacity-60"></div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-center text-sm text-gray-500">
                    Copyright @HCM202 {new Date().getFullYear()} | Chính sách bảo mật
                </p>
            </div>
        </div>
    )
}