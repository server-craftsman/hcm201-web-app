'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    ArrowRightIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { verificationApi } from '@/modules/auth/api/verification'
import { toast } from 'react-hot-toast'

type VerificationStatus = 'loading' | 'success' | 'error' | 'expired'

function ConfirmEmailContent() {
    const [status, setStatus] = useState<VerificationStatus>('loading')
    const [message, setMessage] = useState('')
    const searchParams = useSearchParams()
    const router = useRouter()

    const hash = searchParams.get('hash')

    useEffect(() => {
        if (!hash) {
            setStatus('error')
            setMessage('Hash xác thực không hợp lệ')
            return
        }

        verifyEmail(hash)
    }, [hash])

    const verifyEmail = async (emailHash: string) => {
        try {
            setStatus('loading')

            const response = await verificationApi.verifyEmailWithHash(emailHash)

            setStatus('success')
            setMessage('Email đã được xác thực thành công! Bạn có thể đăng nhập ngay bây giờ.')

            toast.success('Email xác thực thành công!', {
                duration: 5000,
                style: {
                    background: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500'
                },
                icon: '✅'
            })
        } catch (error: any) {
            console.error('Email verification error:', error)

            const errorMessage = error?.message || 'Có lỗi xảy ra khi xác thực email'

            if (errorMessage.includes('hết hạn') || errorMessage.includes('expired') || errorMessage.includes('invalid')) {
                setStatus('expired')
                setMessage('Link xác thực đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu gửi lại email xác thực.')
            } else {
                setStatus('error')
                setMessage(errorMessage)
            }

            toast.error('Xác thực email thất bại', {
                duration: 5000,
                style: {
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500'
                },
                icon: '❌'
            })
        }
    }

    const getStatusIcon = () => {
        switch (status) {
            case 'loading':
                return (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full"
                    />
                )
            case 'success':
                return (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center"
                    >
                        <CheckCircleIcon className="w-10 h-10 text-white" />
                    </motion.div>
                )
            case 'error':
                return (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"
                    >
                        <XCircleIcon className="w-10 h-10 text-white" />
                    </motion.div>
                )
            case 'expired':
                return (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center"
                    >
                        <ExclamationTriangleIcon className="w-10 h-10 text-white" />
                    </motion.div>
                )
        }
    }

    const getStatusColor = () => {
        switch (status) {
            case 'success':
                return 'text-green-600 dark:text-green-400'
            case 'error':
                return 'text-red-600 dark:text-red-400'
            case 'expired':
                return 'text-amber-600 dark:text-amber-400'
            default:
                return 'text-slate-600 dark:text-slate-300'
        }
    }

    const getBackgroundColor = () => {
        switch (status) {
            case 'success':
                return 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
            case 'error':
                return 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20'
            case 'expired':
                return 'from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20'
            default:
                return 'from-slate-50 to-gray-50 dark:from-slate-900 dark:to-slate-800'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/40 to-amber-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full bg-rose-500/10 blur-3xl animate-pulse" />
                <div className="absolute -bottom-24 -right-24 w-[36rem] h-[36rem] rounded-full bg-amber-400/10 blur-3xl animate-pulse" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full bg-blue-400/5 blur-3xl animate-pulse" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    {/* Status Card */}
                    <div className={`bg-gradient-to-br ${getBackgroundColor()} backdrop-blur border border-white/40 dark:border-slate-700 rounded-3xl shadow-2xl p-8 text-center`}>
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            {getStatusIcon()}
                        </div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-2xl font-bold text-slate-900 dark:text-white mb-4"
                        >
                            {status === 'loading' && 'Đang xác thực email...'}
                            {status === 'success' && 'Xác thực thành công!'}
                            {status === 'error' && 'Xác thực thất bại'}
                            {status === 'expired' && 'Link đã hết hạn'}
                        </motion.h1>

                        {/* Message */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className={`text-lg ${getStatusColor()} mb-8 leading-relaxed`}
                        >
                            {message}
                        </motion.p>

                        {/* Hash Display (for debugging) */}
                        {hash && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="mb-6 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg"
                            >
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Hash:</p>
                                <code className="text-xs text-slate-700 dark:text-slate-300 break-all">
                                    {hash}
                                </code>
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className="space-y-4"
                        >
                            {status === 'success' && (
                                <div className="space-y-3">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-2xl hover:from-rose-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <span>Đăng nhập ngay</span>
                                        <ArrowRightIcon className="w-5 h-5 ml-2" />
                                    </Link>
                                    <Link
                                        href="/"
                                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl hover:bg-white/80 dark:hover:bg-slate-600/60 transition-all duration-300 border border-slate-200 dark:border-slate-600"
                                    >
                                        Về trang chủ
                                    </Link>
                                </div>
                            )}

                            {status === 'error' && (
                                <div className="space-y-3">
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-2xl hover:from-rose-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <EnvelopeIcon className="w-5 h-5 mr-2" />
                                        <span>Đăng ký lại</span>
                                    </Link>
                                    <Link
                                        href="/"
                                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl hover:bg-white/80 dark:hover:bg-slate-600/60 transition-all duration-300 border border-slate-200 dark:border-slate-600"
                                    >
                                        Về trang chủ
                                    </Link>
                                </div>
                            )}

                            {status === 'expired' && (
                                <div className="space-y-3">
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <EnvelopeIcon className="w-5 h-5 mr-2" />
                                        <span>Gửi lại email xác thực</span>
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl hover:bg-white/80 dark:hover:bg-slate-600/60 transition-all duration-300 border border-slate-200 dark:border-slate-600"
                                    >
                                        Thử đăng nhập
                                    </Link>
                                </div>
                            )}

                            {status === 'loading' && (
                                <div className="space-y-3">
                                    <div className="text-sm text-slate-500 dark:text-slate-400">
                                        Vui lòng chờ trong giây lát...
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Footer Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Cần hỗ trợ?{' '}
                            <Link href="/contact" className="text-rose-600 hover:text-rose-700 font-medium">
                                Liên hệ chúng tôi
                            </Link>
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

// Loading component for Suspense fallback
function ConfirmEmailLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/40 to-amber-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full bg-rose-500/10 blur-3xl animate-pulse" />
                <div className="absolute -bottom-24 -right-24 w-[36rem] h-[36rem] rounded-full bg-amber-400/10 blur-3xl animate-pulse" />
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-white/40 dark:border-slate-700 rounded-3xl shadow-2xl p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            Đang tải...
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300">
                            Vui lòng chờ trong giây lát
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ConfirmEmailPage() {
    return (
        <Suspense fallback={<ConfirmEmailLoading />}>
            <ConfirmEmailContent />
        </Suspense>
    )
}
