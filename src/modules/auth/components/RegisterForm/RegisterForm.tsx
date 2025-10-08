'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Input, Card } from '@/shared/components/ui'
import { useAuth } from '../../hooks'
import { RegisterData } from '@/shared/types'
import { isValidEmail } from '@/shared/utils'
import { ArrowRightIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface RegisterFormProps {
    onSuccess?: () => void
    onSwitchToLogin?: () => void
    className?: string
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
    onSuccess,
    onSwitchToLogin,
    className,
}) => {
    const { register, loginWithGoogle, isLoading } = useAuth()

    const [formData, setFormData] = useState<RegisterData>({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        agreeToTerms: false,
    })

    const [errors, setErrors] = useState<Partial<RegisterData>>({})
    const [submitError, setSubmitError] = useState<string | null>(null)

    const validateForm = (): boolean => {
        const newErrors: Partial<RegisterData> = {}

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email là bắt buộc'
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Email không hợp lệ'
        }

        // Username validation
        if (!formData.username) {
            newErrors.username = 'Tên đăng nhập là bắt buộc'
        } else if (formData.username.length < 3) {
            newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự'
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'
        }

        // Display name validation
        if (!formData.displayName) {
            newErrors.displayName = 'Tên hiển thị là bắt buộc'
        } else if (formData.displayName.length < 2) {
            newErrors.displayName = 'Tên hiển thị phải có ít nhất 2 ký tự'
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc'
        } else if (formData.password.length < 8) {
            newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự'
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
        }

        // Terms agreement validation
        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'Bạn phải đồng ý với điều khoản sử dụng' as unknown as boolean
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (field: keyof RegisterData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = field === 'agreeToTerms' ? e.target.checked : e.target.value
        setFormData(prev => ({ ...prev, [field]: value }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            setSubmitError(null)
            await register(formData)
            onSuccess?.()
        } catch (error) {
            const message = (error as any)?.response?.data?.message || (error as Error)?.message || 'Đăng ký thất bại'
            setSubmitError(message)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
        >
            <Card padding="lg" className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
                {/* Header */}
                <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto bg-orange-500 rounded-2xl flex items-center justify-center mb-4">
                        <UserPlusIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-black mb-2">
                        Tạo tài khoản
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Tham gia cộng đồng học tập và tranh luận
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
                    {submitError && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm"
                        >
                            {submitError}
                        </motion.div>
                    )}

                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange('email')}
                            className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.email
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                                }`}
                            required
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    {/* Display Name Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Tên hiển thị</label>
                        <input
                            type="text"
                            placeholder="Nguyễn Văn A"
                            value={formData.displayName}
                            onChange={handleChange('displayName')}
                            className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.displayName
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                                }`}
                            required
                        />
                        {errors.displayName && <p className="text-red-500 text-sm">{errors.displayName}</p>}
                    </div>

                    {/* Username Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Tên đăng nhập</label>
                        <input
                            type="text"
                            placeholder="ten_dang_nhap"
                            value={formData.username}
                            onChange={handleChange('username')}
                            className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.username
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                                }`}
                            required
                        />
                        <p className="text-xs text-gray-500">Chỉ gồm chữ, số và gạch dưới</p>
                        {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange('password')}
                            className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.password
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                                }`}
                            required
                        />
                        <p className="text-xs text-gray-500">Ít nhất 8 ký tự, có chữ hoa, chữ thường và số</p>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                    </div>

                    {/* Confirm Password Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange('confirmPassword')}
                            className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.confirmPassword
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                                }`}
                            required
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                    </div>

                    {/* Terms Agreement */}
                    <div className="space-y-2">
                        <label className="inline-flex items-start gap-3 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={formData.agreeToTerms}
                                onChange={handleChange('agreeToTerms')}
                                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 mt-0.5"
                            />
                            <span>
                                Tôi đồng ý với <a href="/terms" className="text-orange-600 hover:text-orange-700 font-medium">điều khoản sử dụng</a> và <a href="/privacy" className="text-orange-600 hover:text-orange-700 font-medium">chính sách bảo mật</a>
                            </span>
                        </label>
                        {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold shadow-sm hover:bg-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center justify-center gap-2"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                    <span>Đang tạo tài khoản...</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="default"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="flex items-center justify-center gap-2"
                                >
                                    <UserPlusIcon className="w-5 h-5" />
                                    <span>Tạo tài khoản</span>
                                    <ArrowRightIcon className="w-4 h-4" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-gray-300" />
                        <span className="text-sm text-gray-500">hoặc</span>
                        <div className="h-px flex-1 bg-gray-300" />
                    </div>

                    {/* Google Button */}
                    <motion.button
                        type="button"
                        onClick={() => loginWithGoogle()}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white py-3 shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <motion.div
                            animate={isLoading ? { rotate: 360 } : {}}
                            transition={isLoading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
                        >
                            <Image src="/images/google.svg" alt="Google" width={20} height={20} />
                        </motion.div>
                        <span className="font-medium text-gray-700">
                            {isLoading ? 'Đang kết nối...' : 'Đăng ký với Google'}
                        </span>
                    </motion.button>
                </form>
            </Card>
        </motion.div>
    )
}