'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { Button, Input, Card, CardHeader, CardContent, CardFooter } from '@/shared/components/ui'
import { useAuth } from '../../hooks'
import { LoginCredentials } from '@/shared/types'
import { isValidEmail } from '@/shared/utils'
import { cn } from '@/shared/utils/shadcn'

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
    const { login, isLoading } = useAuth()
    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState<LoginCredentials>({
        email: '',
        password: '',
        remember: false,
    })

    const [errors, setErrors] = useState<Partial<LoginCredentials>>({})

    const validateForm = (): boolean => {
        const newErrors: Partial<LoginCredentials> = {}

        if (!formData.email) {
            newErrors.email = 'Email là bắt buộc'
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Email không hợp lệ'
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
            await login(formData)
            onSuccess?.()
        } catch (error) {
            console.error('Login error:', error)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            <Card variant="luxury" className={cn("w-full max-w-md relative overflow-hidden", className)}>
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-200/30 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary-200/30 rounded-full blur-2xl" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary-100/40 rounded-full blur-xl" />
                </div>

                <CardHeader className="text-center space-y-4 relative z-10">
                    <motion.div
                        className="mx-auto w-16 h-16 hcm-gradient-luxury rounded-2xl flex items-center justify-center shadow-luxury ring-4 ring-white/20"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                        <span className="text-white font-bold text-2xl font-serif">H</span>
                    </motion.div>

                    <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h2 className="text-3xl font-bold hcm-text-gradient-luxury font-serif">
                            Đăng nhập
                        </h2>
                        <p className="text-neutral-600 leading-relaxed">
                            Chào mừng bạn trở lại với cộng đồng tranh luận
                        </p>
                    </motion.div>
                </CardHeader>

                <CardContent className="relative z-10">
                    <motion.form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                        >
                            <Input
                                variant="luxury"
                                type="email"
                                label="Email"
                                placeholder="Nhập email của bạn"
                                value={formData.email}
                                onChange={handleChange('email')}
                                error={errors.email}
                                leftIcon={<EnvelopeIcon className="h-5 w-5" />}
                                required
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                        >
                            <Input
                                variant="luxury"
                                type={showPassword ? "text" : "password"}
                                label="Mật khẩu"
                                placeholder="Nhập mật khẩu"
                                value={formData.password}
                                onChange={handleChange('password')}
                                error={errors.password}
                                leftIcon={<LockClosedIcon className="h-5 w-5" />}
                                rightIcon={
                                    <motion.button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-neutral-500 hover:text-neutral-700 transition-colors p-1"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <AnimatePresence mode="wait">
                                            {showPassword ? (
                                                <motion.div
                                                    key="hide"
                                                    initial={{ opacity: 0, rotate: -90 }}
                                                    animate={{ opacity: 1, rotate: 0 }}
                                                    exit={{ opacity: 0, rotate: 90 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <EyeSlashIcon className="h-5 w-5" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="show"
                                                    initial={{ opacity: 0, rotate: 90 }}
                                                    animate={{ opacity: 1, rotate: 0 }}
                                                    exit={{ opacity: 0, rotate: -90 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                }
                                required
                            />
                        </motion.div>

                        {showRememberMe && (
                            <motion.div
                                className="flex items-center space-x-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.7 }}
                            >
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={formData.remember}
                                    onChange={handleChange('remember')}
                                    className="h-4 w-4 text-primary-500 focus:ring-primary-400 border-neutral-300 rounded transition-colors"
                                />
                                <label htmlFor="remember" className="text-sm text-neutral-700 cursor-pointer font-medium">
                                    Ghi nhớ đăng nhập
                                </label>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 }}
                        >
                            <Button
                                type="submit"
                                variant="luxury"
                                size="lg"
                                className="w-full"
                                isLoading={isLoading}
                                shimmer
                            >
                                {isLoading ? (
                                    <motion.div
                                        className="flex items-center gap-3"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <motion.div
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        Đang đăng nhập...
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        className="flex items-center gap-2"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <SparklesIcon className="h-5 w-5" />
                                        Đăng nhập
                                    </motion.div>
                                )}
                            </Button>
                        </motion.div>

                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.9 }}
                        >
                            <Button
                                type="button"
                                variant="link"
                                onClick={() => {
                                    // Handle forgot password
                                    console.log('Forgot password clicked')
                                }}
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Quên mật khẩu?
                            </Button>
                        </motion.div>
                    </motion.form>
                </CardContent>

                {onSwitchToRegister && (
                    <CardFooter className="text-center border-t border-neutral-100/50 relative z-10">
                        <motion.p
                            className="text-neutral-600 text-sm"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 1.0 }}
                        >
                            Chưa có tài khoản?{' '}
                            <Button
                                type="button"
                                variant="link"
                                onClick={onSwitchToRegister}
                                className="p-0 h-auto font-semibold text-primary-600 hover:text-primary-700"
                            >
                                Đăng ký ngay
                            </Button>
                        </motion.p>
                    </CardFooter>
                )}
            </Card>
        </motion.div>
    )
}