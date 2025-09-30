import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    PlusIcon,
    PaperAirplaneIcon,
    XMarkIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    SparklesIcon,
    ChatBubbleLeftEllipsisIcon,
    LightBulbIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/shared/utils/shadcn'
import { CreateThreadRequestData } from '@/modules/debate/api/threadApi'

interface ThreadRequestFormProps {
    onSubmit: (data: CreateThreadRequestData) => Promise<void>
    onCancel?: () => void
    isVisible?: boolean
    className?: string
}

export const ThreadRequestForm: React.FC<ThreadRequestFormProps> = ({
    onSubmit,
    onCancel,
    isVisible = true,
    className
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<CreateThreadRequestData>({
        title: '',
        description: ''
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [successData, setSuccessData] = useState<any | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        const newErrors: Record<string, string> = {}

        if (!formData.title.trim()) {
            newErrors.title = 'Tiêu đề không được để trống'
        } else if (formData.title.length < 10) {
            newErrors.title = 'Tiêu đề phải có ít nhất 10 ký tự'
        } else if (formData.title.length > 200) {
            newErrors.title = 'Tiêu đề không được vượt quá 200 ký tự'
        }

        if (formData.description && formData.description.length > 1000) {
            newErrors.description = 'Mô tả không được vượt quá 1000 ký tự'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsSubmitting(true)
        try {
            await onSubmit(formData)

            // Reset form
            setFormData({
                title: '',
                description: ''
            })
            setIsOpen(false)
            setErrors({})
            setSuccessData({ title: formData.title })
        } catch (error) {
            console.error('Error submitting thread request:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const suggestedTopics = [
        'Ảnh hưởng của tư tưởng Hồ Chí Minh đến giáo dục hiện đại',
        'Triết lý độc lập dân tộc trong thời đại toàn cầu hóa',
        'Tư tưởng đại đoàn kết dân tộc trong xây dựng đất nước',
        'Quan điểm về nhân dân và vai trò của nhân dân',
        'Tư tưởng văn hóa-xã hội của Hồ Chí Minh'
    ]

    if (!isVisible) return null

    return (
        <div className={cn("w-full", className)}>
            {/* Success Notice */}
            {successData && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 rounded-xl border-2 border-green-200 bg-green-50"
                >
                    <p className="text-green-800 font-medium">🎉 Đã gửi đề xuất chủ đề thành công!</p>
                    <p className="text-green-700 text-sm mt-1">“{successData.title}” đã được ghi nhận và chờ admin phê duyệt.</p>
                    <div className="mt-3 flex items-center gap-2">
                        <a href="/debates/requests" className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm">Xem yêu cầu của tôi</a>
                        <a href="/debates" className="px-4 py-2 rounded-lg bg-white border border-green-300 text-green-700 hover:bg-green-100 text-sm">Về danh sách tranh luận</a>
                    </div>
                </motion.div>
            )}

            {/* Trigger Button */}
            {!isOpen && (
                <motion.button
                    onClick={() => setIsOpen(true)}
                    className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-6 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <PlusIcon className="h-6 w-6" />
                    <span className="text-lg">Đề xuất chủ đề tranh luận mới</span>
                    <SparklesIcon className="h-6 w-6" />
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
                        className="bg-white border-2 border-indigo-200 rounded-xl shadow-2xl overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center space-x-3">
                                    <ChatBubbleLeftEllipsisIcon className="h-8 w-8" />
                                    <div>
                                        <h3 className="text-2xl font-bold">Đề xuất chủ đề tranh luận</h3>
                                        <p className="text-indigo-100 text-sm">Chia sẻ ý tưởng thảo luận của bạn với cộng đồng</p>
                                    </div>
                                </div>
                                <motion.button
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(false)
                                        onCancel?.()
                                    }}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </motion.button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-lg font-semibold text-gray-900 mb-3">
                                    Tiêu đề chủ đề tranh luận *
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, title: e.target.value }))
                                        if (errors.title) setErrors(prev => ({ ...prev, title: '' }))
                                    }}
                                    placeholder="Ví dụ: Ảnh hưởng của tư tưởng Hồ Chí Minh đến giáo dục hiện đại"
                                    className={cn(
                                        "w-full px-4 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 bg-gray-50 focus:bg-white",
                                        errors.title ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200" : "border-gray-300 hover:border-gray-400"
                                    )}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    {errors.title ? (
                                        <p className="text-red-600 flex items-center text-sm">
                                            <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                                            {errors.title}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 text-sm">
                                            Tiêu đề ngắn gọn, rõ ràng và hấp dẫn
                                        </p>
                                    )}
                                    <span className={cn(
                                        "text-sm",
                                        formData.title.length < 10 ? "text-red-500" :
                                            formData.title.length > 180 ? "text-orange-500" : "text-gray-500"
                                    )}>
                                        {formData.title.length}/200
                                    </span>
                                </div>
                            </div>

                            {/* Suggested Topics */}
                            <div>
                                <div className="flex items-center space-x-2 mb-3">
                                    <LightBulbIcon className="h-5 w-5 text-yellow-500" />
                                    <h4 className="text-md font-medium text-gray-700">Gợi ý chủ đề:</h4>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {suggestedTopics.map((topic, index) => (
                                        <motion.button
                                            key={index}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, title: topic }))}
                                            className="text-left p-3 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 text-sm"
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            💡 {topic}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-lg font-semibold text-gray-900 mb-3">
                                    Mô tả chi tiết (tùy chọn)
                                </label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => {
                                        setFormData(prev => ({ ...prev, description: e.target.value }))
                                        if (errors.description) setErrors(prev => ({ ...prev, description: '' }))
                                    }}
                                    placeholder="Mô tả thêm về chủ đề, bối cảnh, câu hỏi cụ thể mà bạn muốn thảo luận..."
                                    rows={6}
                                    className={cn(
                                        "w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200 resize-none bg-gray-50 focus:bg-white",
                                        errors.description ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200" : "border-gray-300 hover:border-gray-400"
                                    )}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    {errors.description ? (
                                        <p className="text-red-600 flex items-center text-sm">
                                            <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                                            {errors.description}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 text-sm">
                                            Cung cấp ngữ cảnh và hướng thảo luận để thu hút sự quan tâm
                                        </p>
                                    )}
                                    <span className={cn(
                                        "text-sm",
                                        formData.description?.length && formData.description?.length > 900 ? "text-orange-500" : "text-gray-500"
                                    )}>
                                        {formData.description?.length}/1000
                                    </span>
                                </div>
                            </div>

                            {/* Important Notice */}
                            <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
                                <div className="flex items-start space-x-3">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                                    <div className="text-amber-800">
                                        <h4 className="font-bold text-lg mb-2">📋 Quy trình phê duyệt</h4>
                                        <div className="space-y-2 text-sm">
                                            <p><strong>1. Đề xuất:</strong> Bạn gửi ý tưởng chủ đề tranh luận</p>
                                            <p><strong>2. Xem xét:</strong> Ban quản trị sẽ đánh giá tính phù hợp</p>
                                            <p><strong>3. Phê duyệt:</strong> Nếu được chấp nhận, 2 moderator sẽ được phân công</p>
                                            <p><strong>4. Kích hoạt:</strong> Chủ đề chính thức mở cho cộng đồng thảo luận</p>
                                        </div>
                                        <p className="mt-3 text-sm font-medium">
                                            ⏱️ Thời gian xử lý: 1-3 ngày làm việc
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Guidelines */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                                    Hướng dẫn tạo chủ đề hiệu quả
                                </h4>
                                <ul className="space-y-2 text-blue-800 text-sm">
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        <span>Chủ đề liên quan đến tư tưởng Hồ Chí Minh và ứng dụng thực tiễn</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        <span>Có tính tranh luận, nhiều góc nhìn khác nhau</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        <span>Phù hợp với học thuật, tránh nội dung nhạy cảm</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        <span>Rõ ràng, dễ hiểu và thu hút sự quan tâm</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                                <motion.button
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(false)
                                        onCancel?.()
                                    }}
                                    className="px-8 py-3 text-gray-600 hover:text-gray-800 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Hủy bỏ
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting || !formData.title.trim()}
                                    className={cn(
                                        "px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold transition-all duration-200 flex items-center space-x-3 shadow-lg",
                                        isSubmitting || !formData.title.trim()
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl"
                                    )}
                                    whileHover={!isSubmitting && formData.title.trim() ? { scale: 1.05, y: -2 } : {}}
                                    whileTap={!isSubmitting && formData.title.trim() ? { scale: 0.95 } : {}}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Đang gửi đề xuất...</span>
                                        </>
                                    ) : (
                                        <>
                                            <PaperAirplaneIcon className="h-5 w-5" />
                                            <span>Gửi đề xuất chủ đề</span>
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
