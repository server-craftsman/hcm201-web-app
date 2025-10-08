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
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <Card padding="lg" className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-white/40 dark:border-slate-700 shadow-2xl ${className}`}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {submitError && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 text-sm font-medium"
                        >
                            {submitError}
                        </motion.div>
                    )}
                    <div className="text-center pb-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mb-6"
                        >
                            <div className="w-16 h-16 mx-auto bg-[#dc2626] rounded-2xl flex items-center justify-center mb-4">
                                <UserPlusIcon className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold bg-[#dc2626] bg-clip-text text-transparent">
                                Tạo tài khoản
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mt-2">
                                Tham gia cộng đồng học tập và tranh luận
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <Input type="email" label="Email" placeholder="you@example.com" value={formData.email} onChange={handleChange('email')} error={errors.email} required fullWidth />
                        <Input type="text" label="Tên hiển thị" placeholder="Nguyễn Văn A" value={formData.displayName} onChange={handleChange('displayName')} error={errors.displayName} required fullWidth />
                        <Input type="text" label="Tên đăng nhập" placeholder="ten_dang_nhap" value={formData.username} onChange={handleChange('username')} error={errors.username} hint="Chỉ gồm chữ, số và gạch dưới" required fullWidth />
                        <Input type="password" label="Mật khẩu" placeholder="••••••••" value={formData.password} onChange={handleChange('password')} error={errors.password} hint="Ít nhất 8 ký tự, có chữ hoa, chữ thường và số" required fullWidth />
                        <Input type="password" label="Xác nhận mật khẩu" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange('confirmPassword')} error={errors.confirmPassword} required fullWidth />
                        <label className="inline-flex items-start gap-3 text-sm text-neutral-800">
                            <input type="checkbox" checked={formData.agreeToTerms} onChange={handleChange('agreeToTerms')} className="h-4 w-4 rounded border-neutral-300 text-red-600 focus:ring-red-500 mt-0.5" />
                            <span>
                                Tôi đồng ý với <a href="/terms" className="text-red-600 hover:text-red-700 font-medium">điều khoản sử dụng</a> và <a href="/privacy" className="text-red-600 hover:text-red-700 font-medium">chính sách bảo mật</a>
                            </span>
                        </label>
                        {errors.agreeToTerms && (<p className="form-error">{errors.agreeToTerms}</p>)}
                    </div>

                    <Button
                        type="submit"
                        variant="default"
                        size="lg"
                        className="w-full group relative overflow-hidden bg-[#dc2626] shadow-lg hover:shadow-xl"
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center gap-2"
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
                                    className="flex items-center gap-2"
                                >
                                    <UserPlusIcon className="w-5 h-5" />
                                    <span>Tạo tài khoản</span>
                                    <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>

                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-600" />
                        <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">hoặc</span>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-600" />
                    </div>

                    <motion.button
                        type="button"
                        onClick={() => loginWithGoogle()}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-600 bg-white/60 dark:bg-slate-700/60 backdrop-blur py-4 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:y-0"
                    >
                        <motion.div
                            animate={isLoading ? { rotate: 360 } : {}}
                            transition={isLoading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
                        >
                            <Image src="/images/google.svg" alt="Google" width={20} height={20} />
                        </motion.div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">
                            {isLoading ? 'Đang kết nối...' : 'Đăng ký với Google'}
                        </span>
                    </motion.button>
                </form>
            </Card>
        </motion.div>
    )
}