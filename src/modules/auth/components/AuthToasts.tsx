'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useEnhancedToast } from '@/shared/providers/EnhancedToastProvider'

interface AuthToastOptions {
    redirectDelay?: number
    onRedirect?: () => void
}

export function useAuthToasts() {
    const toast = useEnhancedToast()

    const showLoginSuccess = (options: AuthToastOptions = {}) => {
        toast.success(
            'Chào mừng bạn quay trở lại! 🎉',
            '✨ Đăng nhập thành công',
            options.onRedirect ? {
                label: 'Đi đến trang chủ',
                onClick: options.onRedirect
            } : undefined
        )
    }

    const showLoginError = (error: string) => {
        const getErrorMessage = (error: string) => {
            if (error.includes('Invalid credentials') || error.includes('incorrect')) {
                return 'Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại.'
            }
            if (error.includes('User not found') || error.includes('not exist')) {
                return 'Tài khoản không tồn tại. Bạn có muốn đăng ký tài khoản mới?'
            }
            if (error.includes('Account locked') || error.includes('suspended')) {
                return 'Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ hỗ trợ.'
            }
            if (error.includes('Network') || error.includes('connection')) {
                return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.'
            }
            return error || 'Đăng nhập thất bại. Vui lòng thử lại sau.'
        }

        toast.error(
            getErrorMessage(error),
            '❌ Đăng nhập thất bại',
            {
                label: 'Thử lại',
                onClick: () => window.location.reload()
            }
        )
    }

    const showRegisterSuccess = (options: AuthToastOptions = {}) => {
        toast.success(
            'Tài khoản của bạn đã được tạo thành công! Hãy bắt đầu khám phá. 🚀',
            '🎊 Chào mừng bạn đến với HCM201',
            options.onRedirect ? {
                label: 'Bắt đầu học',
                onClick: options.onRedirect
            } : undefined
        )
    }

    const showRegisterError = (error: string) => {
        const getErrorMessage = (error: string) => {
            if (error.includes('email') && error.includes('exists')) {
                return 'Email này đã được sử dụng. Bạn có muốn đăng nhập thay vì đăng ký?'
            }
            if (error.includes('username') && error.includes('exists')) {
                return 'Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.'
            }
            if (error.includes('password') && error.includes('weak')) {
                return 'Mật khẩu không đủ mạnh. Vui lòng sử dụng mật khẩu có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.'
            }
            if (error.includes('validation') || error.includes('invalid')) {
                return 'Thông tin không hợp lệ. Vui lòng kiểm tra lại các trường thông tin.'
            }
            return error || 'Đăng ký thất bại. Vui lòng thử lại sau.'
        }

        toast.error(
            getErrorMessage(error),
            '❌ Đăng ký thất bại',
            {
                label: 'Thử lại',
                onClick: () => window.location.reload()
            }
        )
    }

    const showGoogleLoginSuccess = (options: AuthToastOptions = {}) => {
        toast.success(
            'Bạn đã đăng nhập thành công qua Google. Chào mừng! 👋',
            '🔐 Google đăng nhập thành công',
            options.onRedirect ? {
                label: 'Tiếp tục',
                onClick: options.onRedirect
            } : undefined
        )
    }

    const showGoogleLoginError = (error: string) => {
        toast.error(
            'Không thể đăng nhập qua Google. Vui lòng thử lại hoặc sử dụng phương thức đăng nhập khác.',
            '🔐 Google đăng nhập thất bại',
            {
                label: 'Thử lại',
                onClick: () => window.location.reload()
            }
        )
    }

    const showLogoutSuccess = () => {
        toast.info(
            'Cảm ơn bạn đã sử dụng dịch vụ. Hẹn gặp lại! 👋',
            '✨ Đăng xuất thành công',
            {
                label: 'Đăng nhập lại',
                onClick: () => window.location.href = '/login'
            }
        )
    }

    const showProfileUpdateSuccess = () => {
        toast.success(
            'Thông tin của bạn đã được cập nhật thành công. ✅',
            '🔄 Cập nhật thành công'
        )
    }

    const showProfileUpdateError = (error: string) => {
        toast.error(
            error || 'Không thể cập nhật thông tin. Vui lòng thử lại sau.',
            '❌ Cập nhật thất bại',
            {
                label: 'Thử lại',
                onClick: () => window.location.reload()
            }
        )
    }

    return {
        showLoginSuccess,
        showLoginError,
        showRegisterSuccess,
        showRegisterError,
        showGoogleLoginSuccess,
        showGoogleLoginError,
        showLogoutSuccess,
        showProfileUpdateSuccess,
        showProfileUpdateError,
    }
}

// Loading toast component for auth actions
export const AuthLoadingToast: React.FC<{
    message: string
    type: 'login' | 'register' | 'google'
}> = ({ message, type }) => {
    const getIcon = () => {
        switch (type) {
            case 'login': return '🔐'
            case 'register': return '📝'
            case 'google': return '🌐'
            default: return '⏳'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl border border-white/20"
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="text-xl"
            >
                {getIcon()}
            </motion.div>
            <div>
                <p className="text-sm font-medium text-gray-900">{message}</p>
                <div className="flex gap-1 mt-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
