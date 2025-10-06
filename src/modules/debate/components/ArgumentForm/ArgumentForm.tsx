import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    PlusIcon,
    PaperAirplaneIcon,
    XMarkIcon,
    LinkIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    SparklesIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/shared/utils/shadcn'
import { CreateArgumentData } from '@/modules/debate/api/argumentApi'

interface ArgumentFormProps {
    threadId: string
    onSubmit: (data: CreateArgumentData) => Promise<void>
    onCancel?: () => void
    isVisible?: boolean
    openOnMount?: boolean
    defaultArgumentType?: 'SUPPORT' | 'OPPOSE' | 'NEUTRAL'
    onTeamChange?: (type: 'SUPPORT' | 'OPPOSE' | 'NEUTRAL') => void
    className?: string
}

export const ArgumentForm: React.FC<ArgumentFormProps> = ({
    threadId,
    onSubmit,
    onCancel,
    isVisible = true,
    openOnMount = false,
    defaultArgumentType = 'SUPPORT',
    onTeamChange,
    className
}) => {
    const [isOpen, setIsOpen] = useState(openOnMount)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<CreateArgumentData>({
        title: '',
        content: '',
        threadId,
        argumentType: defaultArgumentType,
        source: '',
        evidenceUrls: []
    })
    const [evidenceUrl, setEvidenceUrl] = useState('')
    const [errors, setErrors] = useState<Record<string, string>>({})

    const isValidUrl = (url: string) => {
        if (!url || typeof url !== 'string') return false

        try {
            const u = new URL(url.trim())
            return u.protocol === 'http:' || u.protocol === 'https:'
        } catch {
            return false
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation theo DTO backend
        const newErrors: Record<string, string> = {}

        // threadId bắt buộc
        if (!threadId) {
            newErrors.threadId = 'Thiếu mã chủ đề (threadId)'
        }

        // title: required, maxlength 200
        const title = formData.title?.trim() || ''
        if (!title) {
            newErrors.title = 'Tiêu đề không được để trống'
        } else if (title.length > 200) {
            newErrors.title = 'Tiêu đề tối đa 200 ký tự'
        }

        // content: required, maxlength 2000, gợi ý tối thiểu 20
        const content = formData.content?.trim() || ''
        if (!content) {
            newErrors.content = 'Nội dung không được để trống'
        } else if (content.length > 2000) {
            newErrors.content = 'Nội dung tối đa 2000 ký tự'
        } else if (content.length < 20) {
            newErrors.content = 'Nội dung phải có ít nhất 20 ký tự'
        }

        // source: optional, maxlength 500
        if (formData.source && formData.source.length > 500) {
            newErrors.source = 'Nguồn tham khảo tối đa 500 ký tự'
        }

        // evidenceUrls: optional, max 10, từng URL hợp lệ
        const urls = formData.evidenceUrls || []
        if (urls.length > 10) {
            newErrors.evidenceUrls = 'Tối đa 10 đường dẫn bằng chứng'
        } else if (urls.some(u => !isValidUrl(u))) {
            newErrors.evidenceUrls = 'Mỗi đường dẫn phải là URL hợp lệ (http/https)'
        }

        // argumentType: optional enum kiểm tra cơ bản
        const validTypes = ['SUPPORT', 'OPPOSE', 'NEUTRAL'] as const
        if (formData.argumentType && !validTypes.includes(formData.argumentType)) {
            newErrors.argumentType = 'Loại luận điểm không hợp lệ'
        }

        // evidenceUrls: kiểm tra từng URL
        if (formData.evidenceUrls && formData.evidenceUrls.length > 0) {
            const invalidUrls = []
            for (let i = 0; i < formData.evidenceUrls.length; i++) {
                const url = formData.evidenceUrls[i]
                // Kiểm tra URL không rỗng và không chỉ có khoảng trắng
                if (!url || !url.trim()) {
                    invalidUrls.push(`URL ${i + 1}: "Trống"`)
                } else if (!isValidUrl(url)) {
                    invalidUrls.push(`URL ${i + 1}: "${url}"`)
                }
            }
            if (invalidUrls.length > 0) {
                newErrors.evidenceUrls = `Các URL sau không hợp lệ: ${invalidUrls.join(', ')}`
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsSubmitting(true)
        try {
            // Clean up evidenceUrls before submission
            const cleanedFormData = {
                ...formData,
                evidenceUrls: formData.evidenceUrls
                    ?.filter(url => url && url.trim()) // Remove empty URLs
                    ?.map(url => url.trim()) // Trim whitespace
                    ?.filter((url, index, arr) => arr.indexOf(url) === index) // Remove duplicates
            }

            await onSubmit(cleanedFormData)

            // Reset form
            setFormData({
                title: '',
                content: '',
                threadId,
                argumentType: 'SUPPORT',
                source: '',
                evidenceUrls: []
            })
            setIsOpen(false)
            setErrors({})
        } catch (error) {
            console.error('Error submitting argument:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAddEvidenceUrl = () => {
        const value = evidenceUrl.trim()
        const current = formData.evidenceUrls || []

        if (!value) {
            setErrors(prev => ({ ...prev, evidenceUrls: 'Vui lòng nhập URL' }))
            return
        }

        // Kiểm tra URL không chỉ có khoảng trắng
        if (value.length === 0) {
            setErrors(prev => ({ ...prev, evidenceUrls: 'URL không được để trống' }))
            return
        }

        if (!isValidUrl(value)) {
            setErrors(prev => ({ ...prev, evidenceUrls: 'URL không hợp lệ. Vui lòng nhập URL đúng định dạng (bắt đầu bằng http:// hoặc https://)' }))
            return
        }

        if (current.includes(value)) {
            setErrors(prev => ({ ...prev, evidenceUrls: 'URL này đã tồn tại trong danh sách' }))
            return
        }

        if (current.length >= 10) {
            setErrors(prev => ({ ...prev, evidenceUrls: 'Chỉ được thêm tối đa 10 URL bằng chứng' }))
            return
        }

        setFormData(prev => ({
            ...prev,
            evidenceUrls: [...current, value]
        }))
        setEvidenceUrl('')
        setErrors(prev => ({ ...prev, evidenceUrls: '' }))
    }

    const handleRemoveEvidenceUrl = (index: number) => {
        setFormData(prev => ({
            ...prev,
            evidenceUrls: prev.evidenceUrls?.filter((_, i) => i !== index) || []
        }))
    }

    const getTypeConfig = (type: string) => {
        switch (type) {
            case 'SUPPORT':
                return {
                    label: 'Ủng hộ',
                    color: 'bg-emerald-500 hover:bg-emerald-600',
                    icon: '👍'
                }
            case 'OPPOSE':
                return {
                    label: 'Phản đối',
                    color: 'bg-rose-500 hover:bg-rose-600',
                    icon: '👎'
                }
            case 'NEUTRAL':
                return {
                    label: 'Trung lập',
                    color: 'bg-slate-500 hover:bg-slate-600',
                    icon: '🤔'
                }
        }
    }

    if (!isVisible) return null

    return (
        <div className={cn("w-full", className)}>
            {/* Trigger Button (hidden when openOnMount or already open) */}
            {!isOpen && !openOnMount && (
                <motion.button
                    onClick={() => setIsOpen(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <PlusIcon className="h-5 w-5" />
                    <span>Thêm luận điểm mới</span>
                    <SparklesIcon className="h-5 w-5" />
                </motion.button>
            )}

            {/* Form Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="bg-white border-2 border-blue-200 rounded-xl shadow-xl overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                                    <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                                    <span>Tạo luận điểm mới</span>
                                </h3>
                                <motion.button
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(false)
                                        onCancel?.()
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                                </motion.button>
                            </div>

                            {/* Argument Type Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Loại luận điểm
                                </label>
                                <div className="flex space-x-3">
                                    {(['SUPPORT', 'OPPOSE', 'NEUTRAL'] as const).map((type) => {
                                        const config = getTypeConfig(type)
                                        return (
                                            <motion.button
                                                key={type}
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, argumentType: type }))
                                                }}
                                                className={cn(
                                                    "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200",
                                                    formData.argumentType === type
                                                        ? `${config?.color} text-white shadow-lg`
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                )}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <span>{config?.icon}</span>
                                                <span>{config?.label}</span>
                                            </motion.button>
                                        )
                                    })}
                                </div>
                                {/* Auto selected note */}
                                <p className="mt-2 text-xs text-gray-500">
                                    Đã tự động chọn theo bình chọn của bạn: {defaultArgumentType === 'SUPPORT' ? 'Ủng hộ' : defaultArgumentType === 'OPPOSE' ? 'Phản đối' : 'Trung lập'}
                                </p>
                                {/* Warning when changed against current vote */}
                                {defaultArgumentType !== 'NEUTRAL' && formData.argumentType !== defaultArgumentType && formData.argumentType !== 'NEUTRAL' && (
                                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                                        Bạn đang chọn khác với team đã bình chọn trước đó.
                                        <button
                                            type="button"
                                            onClick={() => onTeamChange?.(formData.argumentType)}
                                            className="ml-2 px-3 py-1 rounded-md bg-amber-600 text-white hover:bg-amber-700"
                                        >
                                            Cập nhật team bình chọn
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tiêu đề luận điểm *
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, title: e.target.value }))
                                        if (errors.title) setErrors(prev => ({ ...prev, title: '' }))
                                    }}
                                    placeholder="Nhập tiêu đề ngắn gọn cho luận điểm của bạn..."
                                    className={cn(
                                        "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                                        errors.title ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                                    )}
                                />
                                <div className="flex justify-between mt-1">
                                    <span className="text-sm text-gray-500">Tối đa 200 ký tự</span>
                                    <span className={cn("text-sm", formData.title.length > 200 ? "text-red-500" : "text-gray-500")}>{formData.title.length}/200</span>
                                </div>
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Content */}
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nội dung chi tiết *
                                </label>
                                <textarea
                                    id="content"
                                    value={formData.content}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, content: e.target.value }))
                                        if (errors.content) setErrors(prev => ({ ...prev, content: '' }))
                                    }}
                                    placeholder="Trình bày luận điểm của bạn một cách chi tiết và có lý lẽ..."
                                    rows={6}
                                    className={cn(
                                        "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none",
                                        errors.content ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"
                                    )}
                                />
                                <div className="flex justify-between items-center mt-1">
                                    {errors.content ? (
                                        <p className="text-sm text-red-600 flex items-center">
                                            <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                                            {errors.content}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            Tối thiểu 20 ký tự, tối đa 2000 ký tự
                                        </p>
                                    )}
                                    <span className={cn(
                                        "text-sm",
                                        formData.content.length < 20 || formData.content.length > 2000 ? "text-red-500" : "text-gray-500"
                                    )}>
                                        {formData.content.length}/2000
                                    </span>
                                </div>
                            </div>

                            {/* Source */}
                            <div>
                                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nguồn tham khảo
                                </label>
                                <input
                                    id="source"
                                    type="text"
                                    value={formData.source}
                                    onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                                    placeholder="Ví dụ: Toàn tập Hồ Chí Minh, tập 4..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200"
                                />
                                <div className="flex justify-between mt-1">
                                    <span className="text-sm text-gray-500">Tối đa 500 ký tự</span>
                                    <span className={cn("text-sm", (formData.source?.length || 0) > 500 ? "text-red-500" : "text-gray-500")}>{formData.source?.length || 0}/500</span>
                                </div>
                                {errors.source && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                                        {errors.source}
                                    </p>
                                )}
                            </div>

                            {/* Evidence URLs */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tài liệu bằng chứng (URL)
                                </label>
                                <div className="flex space-x-2 mb-3">
                                    <input
                                        type="url"
                                        value={evidenceUrl}
                                        onChange={(e) => {
                                            setEvidenceUrl(e.target.value)
                                            // Clear error when user starts typing
                                            if (errors.evidenceUrls) {
                                                setErrors(prev => ({ ...prev, evidenceUrls: '' }))
                                            }
                                        }}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                handleAddEvidenceUrl()
                                            }
                                        }}
                                        placeholder="https://example.com/tai-lieu"
                                        className={cn(
                                            "flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200",
                                            errors.evidenceUrls ? "border-red-300 bg-red-50" : "border-gray-300"
                                        )}
                                    />
                                    <motion.button
                                        type="button"
                                        onClick={handleAddEvidenceUrl}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-1"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <LinkIcon className="h-4 w-4" />
                                        <span>Thêm</span>
                                    </motion.button>
                                </div>

                                {/* Evidence URL List */}
                                {formData.evidenceUrls && formData.evidenceUrls.length > 0 && (
                                    <div className="space-y-2">
                                        {formData.evidenceUrls.map((url, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg"
                                            >
                                                <LinkIcon className="h-4 w-4 text-blue-500" />
                                                <span className="flex-1 text-sm text-blue-700 truncate">{url}</span>
                                                <motion.button
                                                    type="button"
                                                    onClick={() => handleRemoveEvidenceUrl(index)}
                                                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <XMarkIcon className="h-4 w-4" />
                                                </motion.button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                                {errors.evidenceUrls && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                                    >
                                        <p className="text-sm text-red-600 flex items-center">
                                            <ExclamationTriangleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                                            <span>{errors.evidenceUrls}</span>
                                        </p>
                                    </motion.div>
                                )}
                            </div>

                            {/* Submission Notice */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <div className="flex items-start space-x-2">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-amber-800">
                                        <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                                        <p>Luận điểm của bạn sẽ được gửi đến kiểm duyệt trước khi hiển thị công khai. Vui lòng đảm bảo nội dung tuân thủ quy định của cộng đồng.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                <motion.button
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(false)
                                        onCancel?.()
                                    }}
                                    className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Hủy
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={cn(
                                        "px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2",
                                        isSubmitting
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg"
                                    )}
                                    whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                                    whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Đang gửi...</span>
                                        </>
                                    ) : (
                                        <>
                                            <PaperAirplaneIcon className="h-4 w-4" />
                                            <span>Gửi luận điểm</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
