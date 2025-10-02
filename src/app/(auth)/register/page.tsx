'use client'

import { motion } from 'framer-motion'
import { RegisterForm } from '@/modules/auth'
import Link from 'next/link'
import {
    SparklesIcon,
    HeartIcon,
    AcademicCapIcon,
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
    UserGroupIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline'
import logo from '@/shared/assets/images/logo.png'
import Image from 'next/image'

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/40 to-amber-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating Orbs */}
                <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full bg-rose-500/10 blur-3xl animate-pulse" />
                <div className="absolute -bottom-24 -right-24 w-[36rem] h-[36rem] rounded-full bg-amber-400/10 blur-3xl animate-pulse" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full bg-blue-400/5 blur-3xl animate-pulse" />

                {/* Geometric Shapes */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-rose-200/20 to-amber-200/20 rounded-2xl rotate-12 animate-float" />
                <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-xl rotate-45 animate-float" style={{ animationDelay: '4s' }} />

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #374151 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                }} />
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex">
                {/* Left Side - Branding & Features */}
                <div className="hidden lg:flex lg:w-1/2 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-amber-500/5 to-blue-500/5" />

                    <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
                        {/* Logo & Brand */}
                        <Link href="/">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="mb-12"
                            >
                                <div className="flex items-center space-x-4 mb-8">

                                    <div className="relative">
                                        <Image src={logo} alt="HCM201" width={40} height={40} className="relative rounded-full" />
                                    </div>

                                    <div>
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                                            HCM201
                                        </h1>
                                        <p className="text-slate-600 dark:text-slate-300">Tư tưởng Hồ Chí Minh</p>
                                    </div>
                                </div>
                            </motion.div>

                        </Link>

                        {/* Welcome Message */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mb-12"
                        >
                            <h2 className="text-4xl xl:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
                                Tham gia cộng đồng!
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                                Kết nối với hàng nghìn người cùng học tập, tranh luận và
                                khám phá tư tưởng Hồ Chí Minh.
                            </p>
                        </motion.div>

                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="space-y-6"
                        >
                            {[
                                {
                                    icon: UserGroupIcon,
                                    title: "Cộng đồng sôi động",
                                    description: "Kết nối với hàng nghìn thành viên"
                                },
                                {
                                    icon: ChatBubbleLeftRightIcon,
                                    title: "Tranh luận thú vị",
                                    description: "Tham gia thảo luận về các chủ đề thời sự"
                                },
                                {
                                    icon: DocumentTextIcon,
                                    title: "Tác phẩm phong phú",
                                    description: "Khám phá kho tàng tác phẩm bất hủ"
                                },
                                {
                                    icon: AcademicCapIcon,
                                    title: "Học tập không giới hạn",
                                    description: "Quiz và bài học mọi lúc, mọi nơi"
                                }
                            ].map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                                    className="flex items-center space-x-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur border border-white/40 dark:border-slate-700"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-amber-500 rounded-xl flex items-center justify-center">
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Quote */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1 }}
                            className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-rose-500/10 to-amber-500/10 border border-rose-200/20 dark:border-rose-800/20"
                        >
                            <blockquote className="text-lg font-medium text-slate-800 dark:text-slate-200 italic">
                                "Học hỏi là một việc phải tiếp tục suốt đời."
                            </blockquote>
                            <cite className="text-sm text-slate-600 dark:text-slate-400 mt-2 block">
                                — Chủ tịch Hồ Chí Minh
                            </cite>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side - Register Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="w-full max-w-md"
                    >
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="flex items-center justify-center space-x-3 mb-4">
                                <div className="relative">
                                    <Image src={logo} alt="HCM201" width={40} height={40} className="relative rounded-full" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                                        HCM201
                                    </h1>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm">Tư tưởng Hồ Chí Minh</p>
                                </div>
                            </div>
                        </div>

                        <RegisterForm className="w-full" />

                        {/* Switch to Login */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="mt-8 text-center"
                        >
                            <p className="text-slate-600 dark:text-slate-300">
                                Đã có tài khoản?{' '}
                                <Link
                                    href="/login"
                                    className="text-rose-600 hover:text-rose-700 font-semibold transition-colors"
                                >
                                    Đăng nhập ngay
                                </Link>
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}


