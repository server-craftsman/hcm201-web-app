'use client'

import React, { useState, useEffect } from 'react'
import { Button, Card, Select, Textarea, Input } from '@/shared/components/ui'
import { CreateArgumentData, UpdateArgumentData } from '@/modules/arguments/types'
import { ARGUMENT_TYPE_NAMES } from '@/modules/arguments/constants'

interface ArgumentFormProps {
    debateTopicId: string
    parentId?: string
    initialData?: any // Will be typed properly when we have full Argument type
    onSubmit: (data: CreateArgumentData | UpdateArgumentData) => Promise<void>
    onCancel?: () => void
    isLoading?: boolean
    mode?: 'create' | 'edit' | 'reply'
    className?: string
}

type ArgumentSourceData = {
    title: string
    url?: string
    description?: string
    type: 'book' | 'article' | 'website' | 'document' | 'other'
}

export const ArgumentForm: React.FC<ArgumentFormProps> = ({
    debateTopicId,
    parentId,
    initialData,
    onSubmit,
    onCancel,
    isLoading = false,
    mode = 'create',
    className,
}) => {
    const [formData, setFormData] = useState<CreateArgumentData>({
        content: '',
        type: 'neutral',
        debateTopicId,
        parentId,
        sources: [],
    })

    const [sources, setSources] = useState<ArgumentSourceData[]>([])
    const [newSource, setNewSource] = useState<ArgumentSourceData>({
        title: '',
        url: '',
        description: '',
        type: 'article',
    })
    const [errors, setErrors] = useState<Partial<CreateArgumentData>>({})

    // Initialize form with existing data when editing
    useEffect(() => {
        if (initialData && mode === 'edit') {
            setFormData({
                content: initialData.content,
                type: initialData.type,
                debateTopicId,
                parentId,
                sources: initialData.sources || [],
            })
            setSources(initialData.sources || [])
        }
    }, [initialData, mode, debateTopicId, parentId])

    const argumentTypeOptions = Object.entries(ARGUMENT_TYPE_NAMES).map(([value, label]) => ({
        value,
        label,
    }))

    const sourceTypeOptions = [
        { value: 'book', label: 'Sách' },
        { value: 'article', label: 'Bài viết' },
        { value: 'website', label: 'Website' },
        { value: 'document', label: 'Tài liệu' },
        { value: 'other', label: 'Khác' },
    ]

    const validateForm = (): boolean => {
        const newErrors: Partial<CreateArgumentData> = {}

        if (!formData.content.trim()) {
            newErrors.content = 'Nội dung tranh luận là bắt buộc' as unknown as any
        } else if (formData.content.length < 20) {
            newErrors.content = 'Nội dung phải có ít nhất 20 ký tự' as unknown as any
        } else if (formData.content.length > 2000) {
            newErrors.content = 'Nội dung không được vượt quá 2000 ký tự' as unknown as any
        }

        if (!formData.type) {
            // set error as any string message, not ArgumentType
            ; (newErrors as any).type = 'Loại tranh luận là bắt buộc'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (field: keyof CreateArgumentData) => (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData((prev: CreateArgumentData) => ({ ...prev, [field]: e.target.value as any }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev: Partial<CreateArgumentData>) => ({ ...prev, [field]: undefined }))
        }
    }

    const handleSelectChange = (field: keyof CreateArgumentData) => (value: string) => {
        setFormData((prev: CreateArgumentData) => ({ ...prev, [field]: value as any }))

        // Clear error when user selects
        if (errors[field]) {
            setErrors((prev: Partial<CreateArgumentData>) => ({ ...prev, [field]: undefined }))
        }
    }

    const handleSourceChange = (field: keyof ArgumentSourceData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setNewSource((prev: ArgumentSourceData) => ({ ...prev, [field]: e.target.value }))
    }

    const handleAddSource = () => {
        if (newSource.title.trim()) {
            setSources((prev: ArgumentSourceData[]) => [...prev, { ...newSource }])
            setNewSource({
                title: '',
                url: '',
                description: '',
                type: 'article',
            })
        }
    }

    const handleRemoveSource = (index: number) => {
        setSources((prev: ArgumentSourceData[]) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            const submitData = {
                ...formData,
                sources: sources.length > 0 ? sources : undefined,
            }
            await onSubmit(submitData)
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    const getFormTitle = () => {
        switch (mode) {
            case 'reply': return 'Trả lời tranh luận'
            case 'edit': return 'Chỉnh sửa tranh luận'
            default: return 'Tạo tranh luận mới'
        }
    }

    const getFormDescription = () => {
        switch (mode) {
            case 'reply': return 'Đưa ra quan điểm phản hồi cho tranh luận này'
            case 'edit': return 'Cập nhật nội dung tranh luận của bạn'
            default: return 'Chia sẻ quan điểm của bạn về chủ đề này'
        }
    }

    return (
        <Card className={className} padding="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">
                        {getFormTitle()}
                    </h3>
                    <p className="text-neutral-600">
                        {getFormDescription()}
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Argument type */}
                    {mode !== 'reply' && (
                        <Select
                            label="Loại tranh luận"
                            options={argumentTypeOptions}
                            value={formData.type}
                            onChange={handleSelectChange('type')}
                            error={(errors as any).type}
                            required
                        />
                    )}

                    {/* Content */}
                    <Textarea
                        label="Nội dung tranh luận"
                        placeholder="Viết nội dung tranh luận của bạn. Hãy đưa ra lập luận rõ ràng, có căn cứ..."
                        value={formData.content}
                        onChange={handleChange('content')}
                        error={(errors as any).content}
                        hint="20-2000 ký tự. Nên bao gồm lập luận, bằng chứng và kết luận."
                        rows={8}
                        required
                    />

                    {/* Sources section */}
                    <div className="space-y-4">
                        <div className="border-t border-neutral-200 pt-4">
                            <h4 className="font-medium text-neutral-900 mb-4">
                                Nguồn tham khảo (tuỳ chọn)
                            </h4>

                            {/* Existing sources */}
                            {sources.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    {sources.map((source, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 border border-neutral-200 rounded-lg bg-neutral-50"
                                        >
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{source.title}</div>
                                                {source.url && (
                                                    <div className="text-xs text-primary-600 truncate">{source.url}</div>
                                                )}
                                                {source.description && (
                                                    <div className="text-xs text-neutral-600">{source.description}</div>
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveSource(index)}
                                                className="text-error-600 hover:text-error-700"
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add new source */}
                            <div className="space-y-3 p-4 border border-neutral-200 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Input
                                        placeholder="Tiêu đề nguồn"
                                        value={newSource.title}
                                        onChange={handleSourceChange('title')}
                                        fullWidth
                                    />

                                    <Select
                                        options={sourceTypeOptions}
                                        value={newSource.type}
                                        onChange={(value) => setNewSource(prev => ({ ...prev, type: value as any }))}
                                        placeholder="Loại nguồn"
                                    />
                                </div>

                                <Input
                                    placeholder="URL (tuỳ chọn)"
                                    value={newSource.url}
                                    onChange={handleSourceChange('url')}
                                    fullWidth
                                />

                                <Input
                                    placeholder="Mô tả ngắn (tuỳ chọn)"
                                    value={newSource.description}
                                    onChange={handleSourceChange('description')}
                                    fullWidth
                                />

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddSource}
                                    disabled={!newSource.title.trim()}
                                >
                                    + Thêm nguồn
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-neutral-200">
                    <Button
                        type="submit"
                        variant="vietnamese"
                        size="lg"
                        isLoading={isLoading}
                        className="sm:flex-1"
                    >
                        {isLoading
                            ? (mode === 'edit' ? 'Đang cập nhật...' : 'Đang gửi...')
                            : (mode === 'edit' ? 'Cập nhật tranh luận' : 'Gửi tranh luận')
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