'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Button, Input, Card, CardHeader, CardContent } from '@/shared/components/ui'
import { useAuth } from '../../hooks'
import { LoginCredentials } from '@/shared/types'
import { cn } from '@/shared/utils/shadcn'
import Image from 'next/image'

interface LoginFormProps {
    onSuccess?: () => void
    onSwitchToRegister?: () => void
    showRememberMe?: boolean
    className?: string
}

export const LoginForm: React.FC<LoginFormProps> = ({
    onSuccess,
    onSwitchToRegister,
    showRememberMe = true,
    className,
}) => {
    const { login, loginWithGoogle, isLoading } = useAuth()
    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState<LoginCredentials>({
        username: '',
        password: '',
        remember: false,
    })

    const [errors, setErrors] = useState<Partial<LoginCredentials>>({})
    const [submitError, setSubmitError] = useState<string | null>(null)

    const validateForm = (): boolean => {
        const newErrors: Partial<LoginCredentials> = {}

        if (!formData.username) {
            newErrors.username = 'Tên đăng nhập là bắt buộc'
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Tên đăng nhập không hợp lệ'
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (field: keyof LoginCredentials) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = field === 'remember' ? e.target.checked : e.target.value
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
            await login(formData)
            onSuccess?.()
        } catch (error) {
            const message = (error as any)?.response?.data?.message || (error as Error)?.message || 'Đăng nhập thất bại'
            setSubmitError(message)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            setSubmitError(null)
            await loginWithGoogle()
            onSuccess?.()
        } catch (error) {
            const message = (error as any)?.response?.data?.message || (error as Error)?.message || 'Google đăng nhập thất bại'
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
            <Card variant="luxury" className={cn("w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden", className)}>
                {/* Header */}
                <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-black mb-2">
                        Đăng nhập
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Chào mừng bạn trở lại với cộng đồng
                    </p>
                </div>

                <CardContent className="px-8 pb-8">
                    {/* Google Login Button */}
                    <motion.button
                        type="button"
                        onClick={handleGoogleLogin}
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
                            {isLoading ? 'Đang kết nối...' : 'Tiếp tục với Google'}
                        </span>
                    </motion.button>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-gray-300" />
                        <span className="text-sm text-gray-500">hoặc</span>
                        <div className="h-px flex-1 bg-gray-300" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {submitError && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm"
                            >
                                {submitError}
                            </motion.div>
                        )}

                        {/* Username Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Tên đăng nhập</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Nhập tên đăng nhập"
                                    value={formData.username}
                                    onChange={handleChange('username')}
                                    className={`w-full px-4 py-3 pl-10 pr-4 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.username
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                                        }`}
                                    required
                                />
                                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Mật khẩu</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Nhập mật khẩu"
                                    value={formData.password}
                                    onChange={handleChange('password')}
                                    className={`w-full px-4 py-3 pl-10 pr-10 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.password
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300 hover:border-gray-400 focus:bg-white'
                                        }`}
                                    required
                                />
                                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                                >
                                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>

                        {showRememberMe && (
                            <div className="flex items-center justify-between">
                                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={formData.remember}
                                        onChange={handleChange('remember')}
                                        className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    Ghi nhớ đăng nhập
                                </label>
                                <button type="button" className="text-sm text-orange-600 hover:text-orange-700 font-medium">Quên mật khẩu?</button>
                            </div>
                        )}

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
                                        <span>Đang đăng nhập...</span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="default"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <span>Đăng nhập</span>
                                        <ArrowRightIcon className="w-4 h-4" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    )
}