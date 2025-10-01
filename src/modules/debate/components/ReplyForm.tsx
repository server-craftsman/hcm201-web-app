'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    PaperAirplaneIcon,
    XMarkIcon,
    LinkIcon,
    PhotoIcon,
    DocumentIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { CreateReplyData } from '../api/argumentApi'

interface ReplyFormProps {
    argumentId: string
    onSubmit: (data: CreateReplyData) => Promise<void>
    onCancel: () => void
    isLoading?: boolean
}

export const ReplyForm: React.FC<ReplyFormProps> = ({
    argumentId,
    onSubmit,
    onCancel,
    isLoading = false
}) => {
    const [formData, setFormData] = useState<CreateReplyData>({
        title: '',
        content: '',
        source: '',
        evidenceUrls: []
    })
    const [evidenceUrl, setEvidenceUrl] = useState('')
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Tiêu đề không được để trống'
        } else if (formData.title.length < 5) {
            newErrors.title = 'Tiêu đề phải có ít nhất 5 ký tự'
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Nội dung không được để trống'
        } else if (formData.content.length < 20) {
            newErrors.content = 'Nội dung phải có ít nhất 20 ký tự'
        }

        if (formData.source && !isValidUrl(formData.source)) {
            newErrors.source = 'URL nguồn không hợp lệ'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const isValidUrl = (url: string) => {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            await onSubmit(formData)
            setFormData({ title: '', content: '', source: '', evidenceUrls: [] })
            setEvidenceUrl('')
            setErrors({})
        } catch (error) {
            console.error('Error submitting reply:', error)
        }
    }

    const addEvidenceUrl = () => {
        if (evidenceUrl.trim() && isValidUrl(evidenceUrl)) {
            setFormData(prev => ({
                ...prev,
                evidenceUrls: [...prev.evidenceUrls!, evidenceUrl.trim()]
            }))
            setEvidenceUrl('')
        }
    }

    const removeEvidenceUrl = (index: number) => {
        setFormData(prev => ({
            ...prev,
            evidenceUrls: prev.evidenceUrls!.filter((_, i) => i !== index)
        }))
    }

    const getFileTypeIcon = (url: string) => {
        if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            return <PhotoIcon className="h-4 w-4 text-blue-500" />
        } else if (url.match(/\.(pdf|doc|docx)$/i)) {
            return <DocumentIcon className="h-4 w-4 text-red-500" />
        } else {
            return <LinkIcon className="h-4 w-4 text-gray-500" />
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 rounded-2xl border border-blue-200/50 shadow-xl backdrop-blur-sm"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <PaperAirplaneIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Trả lời luận điểm</h3>
                            <p className="text-blue-100 text-sm">Đóng góp ý kiến và bằng chứng</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onCancel}
                        className="p-2 bg-white/20 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
                    >
                        <XMarkIcon className="h-5 w-5 text-white" />
                    </motion.button>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Tiêu đề phản hồi *
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Nhập tiêu đề cho phản hồi của bạn..."
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                            }`}
                    />
                    {errors.title && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <ExclamationTriangleIcon className="h-4 w-4" />
                            <span>{errors.title}</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Nội dung phản hồi *
                    </label>
                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Trình bày quan điểm và lập luận của bạn một cách chi tiết..."
                        rows={6}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none ${errors.content ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                            }`}
                    />
                    {errors.content && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <ExclamationTriangleIcon className="h-4 w-4" />
                            <span>{errors.content}</span>
                        </div>
                    )}
                </div>

                {/* Source */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Nguồn tham khảo
                    </label>
                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="url"
                            value={formData.source}
                            onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                            placeholder="https://example.com/source"
                            className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.source ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                                }`}
                        />
                    </div>
                    {errors.source && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <ExclamationTriangleIcon className="h-4 w-4" />
                            <span>{errors.source}</span>
                        </div>
                    )}
                </div>

                {/* Evidence URLs */}
                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                        Bằng chứng hỗ trợ
                    </label>

                    {/* Add Evidence URL */}
                    <div className="flex space-x-2">
                        <div className="relative flex-1">
                            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="url"
                                value={evidenceUrl}
                                onChange={(e) => setEvidenceUrl(e.target.value)}
                                placeholder="Thêm URL bằng chứng (hình ảnh, tài liệu...)"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                        </div>
                        <motion.button
                            type="button"
                            onClick={addEvidenceUrl}
                            disabled={!evidenceUrl.trim() || !isValidUrl(evidenceUrl)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Thêm
                        </motion.button>
                    </div>

                    {/* Evidence URLs List */}
                    <AnimatePresence>
                        {formData.evidenceUrls && formData.evidenceUrls.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2"
                            >
                                {formData.evidenceUrls.map((url, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                                    >
                                        {getFileTypeIcon(url)}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900 truncate">{url}</p>
                                        </div>
                                        <motion.button
                                            type="button"
                                            onClick={() => removeEvidenceUrl(index)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        >
                                            <XMarkIcon className="h-4 w-4" />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            <span>Phản hồi sẽ được hiển thị công khai</span>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <motion.button
                            type="button"
                            onClick={onCancel}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                        >
                            Hủy
                        </motion.button>
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Đang gửi...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <PaperAirplaneIcon className="h-4 w-4" />
                                    <span>Gửi phản hồi</span>
                                </div>
                            )}
                        </motion.button>
                    </div>
                </div>
            </form>
        </motion.div>
    )
}
