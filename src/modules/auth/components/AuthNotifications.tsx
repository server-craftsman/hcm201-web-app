'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useNotificationCenter } from '@/shared/providers/NotificationCenter'
import { useRouter } from 'next/navigation'
import { verificationApi } from '../api/verification'

interface AuthNotificationOptions {
    redirectDelay?: number
    showModal?: boolean
    playSound?: boolean
    hapticFeedback?: boolean
}

export function useAuthNotifications() {
    const notification = useNotificationCenter()
    const router = useRouter()

    // Login Success - Corner notification đơn giản
    const showLoginSuccess = (options: AuthNotificationOptions = {}) => {
        const { redirectDelay = 2000, playSound = true, hapticFeedback = true } = options

        notification.showCorner({
            type: 'success',
            title: 'Đăng nhập thành công',
            message: 'Chào mừng bạn!',
            duration: 2500, // Tự đóng sau 2.5 giây
            sound: playSound,
            haptic: hapticFeedback,
            dismissible: true
        })

        // Auto redirect
        setTimeout(() => {
            router.push('/')
        }, redirectDelay)
    }

    // Login Error - Corner notification với retry
    const showLoginError = (error: string, canRetry: boolean = true) => {
        const getErrorConfig = (error: string) => {
            if (error.includes('Invalid credentials') || error.includes('incorrect')) {
                return {
                    title: '❌ Thông tin đăng nhập không chính xác',
                    message: 'Vui lòng kiểm tra lại tên đăng nhập và mật khẩu. Bạn có thể thử reset mật khẩu nếu quên.',
                    actions: [
                        {
                            label: 'Quên mật khẩu?',
                            variant: 'primary' as const,
                            onClick: () => router.push('/forgot-password')
                        }
                    ]
                }
            }

            if (error.includes('User not found') || error.includes('not exist')) {
                return {
                    title: '👤 Tài khoản không tồn tại',
                    message: 'Tài khoản này chưa được đăng ký. Bạn có muốn tạo tài khoản mới không?',
                    actions: [
                        {
                            label: 'Đăng ký ngay',
                            variant: 'primary' as const,
                            onClick: () => router.push('/register')
                        }
                    ]
                }
            }

            if (error.includes('Account locked') || error.includes('suspended')) {
                return {
                    title: '🔒 Tài khoản bị khóa',
                    message: 'Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ bộ phận hỗ trợ để được giải quyết.',
                    actions: [
                        {
                            label: 'Liên hệ hỗ trợ',
                            variant: 'primary' as const,
                            onClick: () => window.open('mailto:support@hcm201.edu.vn', '_blank')
                        }
                    ]
                }
            }

            return {
                title: '⚠️ Đăng nhập thất bại',
                message: error || 'Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.',
                actions: canRetry ? [
                    {
                        label: 'Thử lại',
                        variant: 'primary' as const,
                        onClick: () => window.location.reload()
                    }
                ] : []
            }
        }

        const config = getErrorConfig(error)

        notification.showCorner({
            type: 'error',
            ...config,
            duration: 8000,
            sound: true,
            haptic: true
        })
    }

    // Register Success - Modal celebration với email verification
    const showRegisterSuccess = (user?: any, needsVerification: boolean = false, options: AuthNotificationOptions = {}) => {
        const { showModal = true, playSound = true, hapticFeedback = true } = options

        if (needsVerification) {
            // Email verification required flow
            notification.showModal({
                type: 'warning',
                title: '📧 Xác thực email để hoàn tất đăng ký',
                message: `Chúng tôi đã gửi email xác thực đến ${user?.email || 'email của bạn'}. Vui lòng kiểm tra hộp thư và nhấp vào liên kết để kích hoạt tài khoản.`,
                sound: playSound,
                haptic: hapticFeedback,
                dismissible: false,
                actions: [
                    {
                        label: 'Kiểm tra email',
                        variant: 'primary',
                        onClick: () => {
                            notification.dismissAll()
                            window.open('https://gmail.com', '_blank')
                        }
                    },
                    {
                        label: 'Gửi lại email',
                        variant: 'secondary',
                        onClick: () => {
                            showResendVerificationEmail(user?.email)
                        }
                    },
                    {
                        label: 'Đăng nhập sau',
                        variant: 'secondary',
                        onClick: () => {
                            notification.dismissAll()
                            router.push('/login')
                        }
                    }
                ]
            })

            // Show helpful banner
            setTimeout(() => {
                notification.showBanner({
                    type: 'info',
                    title: '💡 Mẹo: Kiểm tra thư mục Spam',
                    message: 'Nếu không thấy email xác thực, hãy kiểm tra thư mục Spam hoặc Junk. Email có thể đến từ noreply@hcm201.edu.vn',
                    duration: 15000,
                    actions: [
                        {
                            label: 'Hướng dẫn chi tiết',
                            onClick: () => router.push('/help/email-verification')
                        }
                    ]
                })
            }, 2000)
        } else {
            // Direct success without verification - Corner notification đơn giản
            notification.showCorner({
                type: 'success',
                title: 'Đăng ký thành công',
                message: 'Chào mừng bạn đến với HCM201!',
                duration: 3000, // Tự đóng sau 3 giây
                sound: playSound,
                haptic: hapticFeedback,
                dismissible: true
            })
        }
    }

    // Register Error
    const showRegisterError = (error: string) => {
        const getErrorConfig = (error: string) => {
            if (error.includes('email') && error.includes('exists')) {
                return {
                    title: '📧 Email đã được sử dụng',
                    message: 'Email này đã được đăng ký trước đó. Bạn có muốn đăng nhập thay vì đăng ký không?',
                    actions: [
                        {
                            label: 'Đăng nhập',
                            variant: 'primary' as const,
                            onClick: () => router.push('/login')
                        },
                        {
                            label: 'Quên mật khẩu?',
                            variant: 'secondary' as const,
                            onClick: () => router.push('/forgot-password')
                        }
                    ]
                }
            }

            if (error.includes('username') && error.includes('exists')) {
                return {
                    title: '👤 Tên đăng nhập đã tồn tại',
                    message: 'Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác hoặc thêm số để tạo tên độc đáo.',
                    actions: [
                        {
                            label: 'Thử lại',
                            variant: 'primary' as const,
                            onClick: () => window.location.reload()
                        }
                    ]
                }
            }

            return {
                title: '❌ Đăng ký thất bại',
                message: error || 'Có lỗi xảy ra trong quá trình đăng ký. Vui lòng kiểm tra thông tin và thử lại.',
                actions: [
                    {
                        label: 'Thử lại',
                        variant: 'primary' as const,
                        onClick: () => window.location.reload()
                    }
                ]
            }
        }

        const config = getErrorConfig(error)

        notification.showCorner({
            type: 'error',
            ...config,
            duration: 8000,
            sound: true,
            haptic: true
        })
    }

    // Google Login Success - Corner notification đơn giản
    const showGoogleLoginSuccess = (options: AuthNotificationOptions = {}) => {
        const { redirectDelay = 2000, playSound = true, hapticFeedback = true } = options

        notification.showCorner({
            type: 'success',
            title: 'Google đăng nhập thành công',
            message: 'Chào mừng bạn!',
            duration: 2500, // Tự đóng sau 2.5 giây
            sound: playSound,
            haptic: hapticFeedback,
            dismissible: true
        })

        setTimeout(() => {
            router.push('/')
        }, redirectDelay)
    }

    // Google Login Error
    const showGoogleLoginError = (error: string) => {
        notification.showCorner({
            type: 'error',
            title: '🔐 Google đăng nhập thất bại',
            message: 'Không thể đăng nhập qua Google. Vui lòng thử lại hoặc sử dụng email/mật khẩu.',
            duration: 6000,
            sound: true,
            haptic: true,
            actions: [
                {
                    label: 'Thử email',
                    variant: 'primary',
                    onClick: () => router.push('/login')
                },
                {
                    label: 'Thử lại Google',
                    variant: 'secondary',
                    onClick: () => window.location.reload()
                }
            ]
        })
    }

    // Logout Success
    const showLogoutSuccess = () => {
        notification.showCorner({
            type: 'info',
            title: 'Đăng xuất thành công',
            message: 'Cảm ơn bạn đã sử dụng dịch vụ. Hẹn gặp lại bạn!',
            duration: 4000,
            sound: true,
            haptic: false,
            actions: [
                {
                    label: 'Đăng nhập lại',
                    variant: 'primary',
                    onClick: () => router.push('/login')
                }
            ]
        })
    }

    // Loading States
    const showLoadingBanner = (message: string, type: 'login' | 'register' | 'google' = 'login') => {
        const titles = {
            login: '🔐 Đang đăng nhập...',
            register: '📝 Đang tạo tài khoản...',
            google: '🌐 Đang kết nối Google...'
        }

        return notification.showBanner({
            type: 'info',
            title: titles[type],
            message,
            dismissible: false,
            sound: false,
            haptic: false
        })
    }

    // Profile Update Success
    const showProfileUpdateSuccess = () => {
        notification.showCorner({
            type: 'success',
            title: '✅ Cập nhật thành công',
            message: 'Thông tin cá nhân của bạn đã được cập nhật.',
            duration: 3000,
            sound: true,
            haptic: true
        })
    }

    // Profile Update Error
    const showProfileUpdateError = (error: string) => {
        notification.showCorner({
            type: 'error',
            title: '❌ Cập nhật thất bại',
            message: error || 'Không thể cập nhật thông tin. Vui lòng thử lại sau.',
            duration: 5000,
            sound: true,
            haptic: true,
            actions: [
                {
                    label: 'Thử lại',
                    variant: 'primary',
                    onClick: () => window.location.reload()
                }
            ]
        })
    }

    // Session Expired
    const showSessionExpired = () => {
        notification.showModal({
            type: 'warning',
            title: '⏰ Phiên đăng nhập hết hạn',
            message: 'Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.',
            dismissible: false,
            sound: true,
            haptic: true,
            actions: [
                {
                    label: 'Đăng nhập lại',
                    variant: 'primary',
                    onClick: () => {
                        notification.dismissAll()
                        router.push('/login')
                    }
                }
            ]
        })
    }

    // Resend Verification Email
    const showResendVerificationEmail = async (email: string) => {
        // Show loading notification
        const loadingId = notification.showCorner({
            type: 'info',
            title: '📤 Đang gửi email xác thực...',
            message: 'Vui lòng đợi trong giây lát',
            duration: 0,
            dismissible: false,
            sound: false,
            haptic: false
        })

        try {
            // Call actual API
            await verificationApi.resendVerification({ email })

            notification.dismiss(loadingId)

            notification.showCorner({
                type: 'success',
                title: '✅ Email đã được gửi lại',
                message: `Email xác thực mới đã được gửi đến ${email}. Vui lòng kiểm tra hộp thư và thư mục Spam.`,
                duration: 8000,
                sound: true,
                haptic: true,
                actions: [
                    {
                        label: 'Mở Gmail',
                        variant: 'primary',
                        onClick: () => window.open('https://gmail.com', '_blank')
                    },
                    {
                        label: 'Mở Yahoo Mail',
                        variant: 'secondary',
                        onClick: () => window.open('https://mail.yahoo.com', '_blank')
                    }
                ]
            })
        } catch (error) {
            notification.dismiss(loadingId)

            notification.showCorner({
                type: 'error',
                title: '❌ Gửi email thất bại',
                message: (error as Error).message || 'Không thể gửi email xác thực. Vui lòng thử lại sau.',
                duration: 8000,
                sound: true,
                haptic: true,
                actions: [
                    {
                        label: 'Thử lại',
                        variant: 'primary',
                        onClick: () => showResendVerificationEmail(email)
                    },
                    {
                        label: 'Liên hệ hỗ trợ',
                        variant: 'secondary',
                        onClick: () => window.open('mailto:support@hcm201.edu.vn', '_blank')
                    }
                ]
            })
        }
    }

    // Email Verification Success
    const showEmailVerificationSuccess = () => {
        notification.showModal({
            type: 'success',
            title: '🎉 Email đã được xác thực!',
            message: 'Tài khoản của bạn đã được kích hoạt thành công. Bây giờ bạn có thể đăng nhập và sử dụng đầy đủ các tính năng.',
            sound: true,
            haptic: true,
            actions: [
                {
                    label: 'Đăng nhập ngay',
                    variant: 'primary',
                    onClick: () => {
                        notification.dismissAll()
                        router.push('/login')
                    }
                }
            ]
        })
    }

    // Email Verification Failed
    const showEmailVerificationFailed = (error: string) => {
        notification.showModal({
            type: 'error',
            title: '❌ Xác thực email thất bại',
            message: error || 'Liên kết xác thực không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực.',
            sound: true,
            haptic: true,
            actions: [
                {
                    label: 'Gửi lại email',
                    variant: 'primary',
                    onClick: () => {
                        notification.dismissAll()
                        router.push('/resend-verification')
                    }
                },
                {
                    label: 'Đăng ký lại',
                    variant: 'secondary',
                    onClick: () => {
                        notification.dismissAll()
                        router.push('/register')
                    }
                }
            ]
        })
    }

    // Account Not Verified Warning (khi login mà chưa verify)
    const showAccountNotVerified = (email: string) => {
        notification.showModal({
            type: 'warning',
            title: '⚠️ Tài khoản chưa được xác thực',
            message: `Tài khoản ${email} chưa được xác thực email. Vui lòng kiểm tra email và nhấp vào liên kết xác thực trước khi đăng nhập.`,
            dismissible: false,
            sound: true,
            haptic: true,
            actions: [
                {
                    label: 'Kiểm tra email',
                    variant: 'primary',
                    onClick: () => {
                        notification.dismissAll()
                        window.open('https://gmail.com', '_blank')
                    }
                },
                {
                    label: 'Gửi lại email',
                    variant: 'secondary',
                    onClick: () => {
                        showResendVerificationEmail(email)
                    }
                }
            ]
        })
    }

    return {
        showLoginSuccess,
        showLoginError,
        showRegisterSuccess,
        showRegisterError,
        showGoogleLoginSuccess,
        showGoogleLoginError,
        showLogoutSuccess,
        showLoadingBanner,
        showProfileUpdateSuccess,
        showProfileUpdateError,
        showSessionExpired,
        showResendVerificationEmail,
        showEmailVerificationSuccess,
        showEmailVerificationFailed,
        showAccountNotVerified,
        dismiss: notification.dismiss,
        dismissAll: notification.dismissAll
    }
}

// Loading Overlay Component cho auth actions
export const AuthLoadingOverlay: React.FC<{
    isVisible: boolean
    type: 'login' | 'register' | 'google'
    message?: string
}> = ({ isVisible, type, message }) => {
    const getConfig = () => {
        switch (type) {
            case 'login':
                return {
                    icon: '🔐',
                    title: 'Đang đăng nhập',
                    defaultMessage: 'Đang xác thực thông tin của bạn...'
                }
            case 'register':
                return {
                    icon: '📝',
                    title: 'Đang tạo tài khoản',
                    defaultMessage: 'Đang thiết lập tài khoản mới cho bạn...'
                }
            case 'google':
                return {
                    icon: '🌐',
                    title: 'Đang kết nối Google',
                    defaultMessage: 'Đang xác thực với Google...'
                }
        }
    }

    const config = getConfig()

    if (!isVisible) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm flex items-center justify-center"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="text-4xl mb-4"
                >
                    {config.icon}
                </motion.div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {config.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                    {message || config.defaultMessage}
                </p>

                <div className="flex justify-center mt-4">
                    <motion.div
                        className="flex gap-1"
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 bg-blue-500 rounded-full"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    )
}
