'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Button, Input, Card, CardHeader, CardContent } from '@/shared/components/ui'
import { useAuth } from '../../hooks'
import { LoginCredentials } from '@/shared/types'
import { isValidEmail } from '@/shared/utils'
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

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <Card variant="luxury" className={cn("w-full max-w-md", className)}>
                <CardHeader className="text-center">
                    <h2 className="text-2xl font-bold text-neutral-900">Đăng nhập</h2>
                </CardHeader>
                <CardContent>
                    <motion.button
                        type="button"
                        onClick={() => loginWithGoogle()}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="group flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white py-3 shadow-sm hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:y-0"
                    >
                        <motion.div
                            animate={isLoading ? { rotate: 360 } : {}}
                            transition={isLoading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
                        >
                            <Image src="/images/google.svg" alt="Google" width={20} height={20} />
                        </motion.div>
                        <span className="font-medium text-neutral-700 group-hover:text-neutral-900">
                            {isLoading ? 'Đang kết nối...' : 'Tiếp tục với Google'}
                        </span>
                    </motion.button>

                    <div className="my-5 flex items-center gap-4">
                        <div className="h-px flex-1 bg-neutral-200" />
                        <span className="text-xs uppercase tracking-wider text-neutral-500">hoặc</span>
                        <div className="h-px flex-1 bg-neutral-200" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {submitError && (
                            <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
                                {submitError}
                            </div>
                        )}
                        <Input
                            variant="luxury"
                            type="text"
                            label="Tên đăng nhập"
                            placeholder="ten_dang_nhap"
                            value={formData.username}
                            onChange={handleChange('username')}
                            error={errors.username}
                            leftIcon={<UserIcon className="h-5 w-5" />}
                            required
                        />

                        <Input
                            variant="luxury"
                            type={showPassword ? 'text' : 'password'}
                            label="Mật khẩu"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange('password')}
                            error={errors.password}
                            leftIcon={<LockClosedIcon className="h-5 w-5" />}
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-neutral-500 hover:text-neutral-700 transition-colors p-1"
                                >
                                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                            }
                            required
                        />

                        {showRememberMe && (
                            <div className="flex items-center justify-between">
                                <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
                                    <input type="checkbox" checked={formData.remember} onChange={handleChange('remember')} className="h-4 w-4 rounded border-neutral-300 text-red-600 focus:ring-red-500" />
                                    Ghi nhớ đăng nhập
                                </label>
                                <button type="button" className="text-sm text-red-600 hover:text-red-700">Quên mật khẩu?</button>
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="luxury"
                            size="lg"
                            className="w-full group relative overflow-hidden"
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
                                        <span>Đang đăng nhập...</span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="default"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="flex items-center gap-2"
                                    >
                                        <span>Đăng nhập</span>
                                        <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    )
}