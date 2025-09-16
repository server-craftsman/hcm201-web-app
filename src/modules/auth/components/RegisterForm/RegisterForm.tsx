'use client'

import React, { useState } from 'react'
import { Button, Input, Card } from '@/shared/components/ui'
import { useAuth } from '../../hooks'
import { RegisterData } from '@/shared/types'
import { isValidEmail } from '@/shared/utils'

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
        <Card className={className} padding="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                        Tạo tài khoản
                    </h2>
                    <p className="text-neutral-600">
                        Tham gia cộng đồng tranh luận về tư tưởng Hồ Chí Minh
                    </p>
                </div>

                <div className="space-y-4">
                    <Input
                        type="email"
                        label="Email"
                        placeholder="Nhập email của bạn"
                        value={formData.email}
                        onChange={handleChange('email')}
                        error={errors.email}
                        required
                        fullWidth
                    />

                    <Input
                        type="text"
                        label="Tên đăng nhập"
                        placeholder="Chọn tên đăng nhập"
                        value={formData.username}
                        onChange={handleChange('username')}
                        error={errors.username}
                        hint="Chỉ được chứa chữ cái, số và dấu gạch dưới"
                        required
                        fullWidth
                    />

                    <Input
                        type="text"
                        label="Tên hiển thị"
                        placeholder="Tên hiển thị của bạn"
                        value={formData.displayName}
                        onChange={handleChange('displayName')}
                        error={errors.displayName}
                        required
                        fullWidth
                    />

                    <Input
                        type="password"
                        label="Mật khẩu"
                        placeholder="Tạo mật khẩu mạnh"
                        value={formData.password}
                        onChange={handleChange('password')}
                        error={errors.password}
                        hint="Ít nhất 8 ký tự, có chữ hoa, chữ thường và số"
                        required
                        fullWidth
                    />

                    <Input
                        type="password"
                        label="Xác nhận mật khẩu"
                        placeholder="Nhập lại mật khẩu"
                        value={formData.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        error={errors.confirmPassword}
                        required
                        fullWidth
                    />

                    <div className="space-y-2">
                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleChange('agreeToTerms')}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded mt-1"
                            />
                            <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-neutral-900">
                                Tôi đồng ý với{' '}
                                <a href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                                    điều khoản sử dụng
                                </a>{' '}
                                và{' '}
                                <a href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                                    chính sách bảo mật
                                </a>
                            </label>
                        </div>
                        {errors.agreeToTerms && (
                            <p className="form-error">{errors.agreeToTerms}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <Button
                        type="submit"
                        variant="vietnamese"
                        size="lg"
                        isLoading={isLoading}
                    >
                        {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                    </Button>

                    {onSwitchToLogin && (
                        <div className="text-center pt-4 border-t border-neutral-200">
                            <p className="text-neutral-600">
                                Đã có tài khoản?{' '}
                                <button
                                    type="button"
                                    onClick={onSwitchToLogin}
                                    className="text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Đăng nhập ngay
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </form>
        </Card>
    )
}