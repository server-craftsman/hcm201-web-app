'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Input, Card } from '@/shared/components/ui'
import { useAuth } from '../../hooks'
import { RegisterData } from '@/shared/types'
import { isValidEmail } from '@/shared/utils'
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
    const { register, isLoading } = useAuth()

    const [formData, setFormData] = useState<RegisterData>({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        agreeToTerms: false,
    })

    const [errors, setErrors] = useState<Partial<RegisterData>>({})

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
            await register(formData)
            onSuccess?.()
        } catch (error) {
            console.error('Register error:', error)
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <Card padding="lg" className={className}>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-neutral-900">Tạo tài khoản</h2>
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

                    <Button type="submit" variant="luxury" size="lg" isLoading={isLoading}>
                        {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                    </Button>

                    <div className="my-4 flex items-center gap-4">
                        <div className="h-px flex-1 bg-neutral-200" />
                        <span className="text-xs uppercase tracking-wider text-neutral-500">hoặc</span>
                        <div className="h-px flex-1 bg-neutral-200" />
                    </div>

                    <a href="/api/auth/google" className="group flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white py-3 shadow-sm hover:shadow transition-all">
                        <Image src="/images/google.svg" alt="Google" width={20} height={20} />
                        <span className="font-medium text-neutral-700 group-hover:text-neutral-900">Đăng ký với Google</span>
                    </a>
                </form>
            </Card>
        </motion.div>
    )
}