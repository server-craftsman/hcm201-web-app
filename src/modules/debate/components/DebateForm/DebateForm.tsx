'use client'

import React, { useState, useEffect } from 'react'
import { Button, Input, Card, Select, Textarea } from '@/shared/components/ui'
import { DebateTopic } from '@/shared/types'
import { DEBATE_CATEGORIES, DIFFICULTY_LEVELS, DEBATE_CATEGORY_NAMES, DIFFICULTY_LEVEL_NAMES } from '@/shared/constants'

// Frontend-only types for form data
interface CreateDebateData {
    title: string
    description: string
    content: string
    category: string
    tags: string[]
    difficulty: string
}

interface UpdateDebateData extends CreateDebateData {
    id?: string
}

// Form validation errors
interface FormErrors {
    title?: string
    description?: string
    content?: string
    category?: string
    tags?: string
    difficulty?: string
}

interface DebateFormProps {
    initialData?: DebateTopic
    onSubmit: (data: CreateDebateData | UpdateDebateData) => Promise<void>
    onCancel?: () => void
    isLoading?: boolean
    mode?: 'create' | 'edit'
    className?: string
}

export const DebateForm: React.FC<DebateFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    mode = 'create',
    className,
}) => {
    const [formData, setFormData] = useState<CreateDebateData>({
        title: '',
        description: '',
        content: '',
        category: '',
        tags: [],
        difficulty: '',
    })

    const [tagInput, setTagInput] = useState('')
    const [errors, setErrors] = useState<FormErrors>({})

    // Initialize form with existing data when editing
    useEffect(() => {
        if (initialData && mode === 'edit') {
            setFormData({
                title: String(initialData.title || ''),
                description: String(initialData.description || ''),
                content: String(initialData.content || ''),
                category: String(initialData.category || ''),
                tags: Array.isArray(initialData.tags) ? initialData.tags as string[] : [],
                difficulty: String(initialData.difficulty || ''),
            })
        }
    }, [initialData, mode])

    const categoryOptions = Object.entries(DEBATE_CATEGORY_NAMES).map(([value, label]) => ({
        value,
        label,
    }))

    const difficultyOptions = Object.entries(DIFFICULTY_LEVEL_NAMES).map(([value, label]) => ({
        value,
        label,
    }))

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Tiêu đề là bắt buộc'
        } else if (formData.title.length < 10) {
            newErrors.title = 'Tiêu đề phải có ít nhất 10 ký tự'
        } else if (formData.title.length > 200) {
            newErrors.title = 'Tiêu đề không được vượt quá 200 ký tự'
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Mô tả là bắt buộc'
        } else if (formData.description.length < 20) {
            newErrors.description = 'Mô tả phải có ít nhất 20 ký tự'
        } else if (formData.description.length > 500) {
            newErrors.description = 'Mô tả không được vượt quá 500 ký tự'
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Nội dung là bắt buộc'
        } else if (formData.content.length < 50) {
            newErrors.content = 'Nội dung phải có ít nhất 50 ký tự'
        }

        if (!formData.category) {
            newErrors.category = 'Danh mục là bắt buộc'
        }

        if (!formData.difficulty) {
            newErrors.difficulty = 'Mức độ khó là bắt buộc'
        }

        if (formData.tags.length === 0) {
            newErrors.tags = 'Phải có ít nhất 1 thẻ tag'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (field: keyof CreateDebateData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const handleSelectChange = (field: keyof CreateDebateData) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))

        // Clear error when user selects
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()

            const tag = tagInput.trim().toLowerCase()
            if (tag && !formData.tags.includes(tag)) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, tag]
                }))
                setTagInput('')

                // Clear tags error
                if (errors.tags) {
                    setErrors(prev => ({ ...prev, tags: undefined }))
                }
            }
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            await onSubmit(formData)
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    return (
        <Card className={className} padding="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                        {mode === 'create' ? 'Tạo chủ đề tranh luận mới' : 'Chỉnh sửa chủ đề tranh luận'}
                    </h2>
                    <p className="text-neutral-600">
                        {mode === 'create'
                            ? 'Đưa ra một chủ đề thú vị để cộng đồng thảo luận'
                            : 'Cập nhật thông tin chủ đề tranh luận'
                        }
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Title */}
                    <Input
                        label="Tiêu đề chủ đề"
                        placeholder="Nhập tiêu đề hấp dẫn cho chủ đề tranh luận..."
                        value={formData.title}
                        onChange={handleChange('title')}
                        error={errors.title}
                        hint="10-200 ký tự. Nên đặt câu hỏi hoặc tuyên bố gây tranh cãi."
                        required
                        fullWidth
                    />

                    {/* Description */}
                    <Textarea
                        label="Mô tả ngắn gọn"
                        placeholder="Tóm tắt ngắn gọn về chủ đề này..."
                        value={formData.description}
                        onChange={handleChange('description')}
                        error={errors.description}
                        hint="20-500 ký tự. Giải thích ngắn gọn về chủ đề."
                        rows={3}
                        required

                    />

                    {/* Category and Difficulty */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Danh mục"
                            options={categoryOptions}
                            value={formData.category}
                            onChange={handleSelectChange('category')}
                            error={errors.category}
                            placeholder="Chọn danh mục..."
                            required
                        />

                        <Select
                            label="Mức độ khó"
                            options={difficultyOptions}
                            value={formData.difficulty}
                            onChange={handleSelectChange('difficulty')}
                            error={errors.difficulty}
                            placeholder="Chọn mức độ..."
                            required
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="form-label">
                            Thẻ tag <span className="text-error-500">*</span>
                        </label>

                        <Input
                            placeholder="Nhập tag và nhấn Enter hoặc dấu phẩy..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            hint="Nhấn Enter hoặc dấu phẩy để thêm tag. Ít nhất 1 tag."
                            fullWidth
                        />

                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                                    >
                                        #{tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="text-primary-600 hover:text-primary-800 ml-1"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {errors.tags && <p className="form-error">{errors.tags}</p>}
                    </div>

                    {/* Content */}
                    <Textarea
                        label="Nội dung chi tiết"
                        placeholder="Viết nội dung chi tiết về chủ đề, bao gồm bối cảnh, các quan điểm khác nhau, và câu hỏi thảo luận..."
                        value={formData.content}
                        onChange={handleChange('content')}
                        error={errors.content}
                        hint="Ít nhất 50 ký tự. Bao gồm bối cảnh, lý do tranh luận, và hướng dẫn thảo luận."
                        rows={10}
                        required
                    />
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-neutral-200">
                    <Button
                        type="submit"
                        variant="default"
                        size="lg"
                        isLoading={isLoading}
                        className="sm:flex-1"
                    >
                        {isLoading
                            ? (mode === 'create' ? 'Đang tạo...' : 'Đang cập nhật...')
                            : (mode === 'create' ? 'Tạo chủ đề' : 'Cập nhật chủ đề')
                        }
                    </Button>

                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="sm:flex-1"
                        >
                            Hủy
                        </Button>
                    )}
                </div>
            </form>
        </Card>
    )
}