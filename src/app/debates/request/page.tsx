'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    PlusCircleIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline'

const RequestThreadPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        importance: '',
        expectedParticipants: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const categories = [
        'Tư tưởng Hồ Chí Minh về độc lập dân tộc',
        'Tư tưởng Hồ Chí Minh về chủ nghĩa xã hội',
        'Tư tưởng Hồ Chí Minh về Đảng Cộng sản',
        'Tư tưởng Hồ Chí Minh về đại đoàn kết dân tộc',
        'Tư tưởng Hồ Chí Minh về con người',
        'Tư tưởng Hồ Chí Minh về đạo đức',
        'Tư tưởng Hồ Chí Minh về văn hóa',
        'Giá trị thời đại của tư tưởng Hồ Chí Minh'
    ]

    const importancelevels = [
        { value: 'high', label: 'Cao - Cần thảo luận gấp', color: 'text-red-600' },
        { value: 'medium', label: 'Trung bình - Thảo luận bình thường', color: 'text-yellow-600' },
        { value: 'low', label: 'Thấp - Có thể chờ', color: 'text-green-600' }
    ]

    // Mock data cho recent requests
    const recentRequests = [
        {
            id: 1,
            title: "Vai trò lãnh đạo của Đảng trong tư tưởng Hồ Chí Minh",
            status: "PENDING",
            createdAt: "2 ngày trước",
            estimatedApproval: "1-2 ngày"
        },
        {
            id: 2,
            title: "Giáo dục đạo đức theo tư tưởng Hồ Chí Minh",
            status: "APPROVED",
            createdAt: "1 tuần trước",
            approvedAt: "5 ngày trước"
        },
        {
            id: 3,
            title: "Tư tưởng Hồ Chí Minh về văn hóa dân tộc",
            status: "REJECTED",
            createdAt: "2 tuần trước",
            rejectReason: "Chủ đề đã được thảo luận gần đây"
        }
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            setSubmitSuccess(true)
            // Reset form
            setFormData({
                title: '',
                description: '',
                category: '',
                importance: '',
                expectedParticipants: ''
            })
        }, 2000)
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800'
            case 'APPROVED':
                return 'bg-green-100 text-green-800'
            case 'REJECTED':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        📝 Yêu cầu chủ đề tranh luận mới
                    </h1>
                    <p className="text-gray-600">
                        Đề xuất chủ đề tranh luận mới về Tư tưởng Hồ Chí Minh để cộng đồng thảo luận
                    </p>
                </motion.div>

                {/* Success Message */}
                {submitSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4"
                    >
                        <div className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                            <p className="text-green-800 font-medium">
                                Yêu cầu của bạn đã được gửi thành công! Admin sẽ xem xét và phản hồi trong 1-2 ngày.
                            </p>
                        </div>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form yêu cầu */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <PlusCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
                                Thông tin chủ đề đề xuất
                            </h3>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Tiêu đề */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tiêu đề chủ đề tranh luận *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Ví dụ: Tư tưởng Hồ Chí Minh trong giáo dục hiện đại"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Tiêu đề ngắn gọn, rõ ràng và thu hút (tối đa 200 ký tự)
                                    </p>
                                </div>

                                {/* Danh mục */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Danh mục *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required
                                    >
                                        <option value="">Chọn danh mục phù hợp</option>
                                        {categories.map((category, index) => (
                                            <option key={index} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Mô tả */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mô tả chi tiết
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Mô tả rõ hơn về chủ đề, tại sao cần thảo luận, những khía cạnh chính cần xem xét..."
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Mô tả giúp admin hiểu rõ hơn về chủ đề và tầm quan trọng của nó
                                    </p>
                                </div>

                                {/* Mức độ quan trọng */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mức độ quan trọng *
                                    </label>
                                    <div className="space-y-2">
                                        {importancelevels.map((level) => (
                                            <label key={level.value} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="importance"
                                                    value={level.value}
                                                    checked={formData.importance === level.value}
                                                    onChange={(e) => setFormData({ ...formData, importance: e.target.value })}
                                                    className="mr-3 text-blue-600"
                                                />
                                                <span className={`${level.color} font-medium`}>
                                                    {level.label}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Số người tham gia dự kiến */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số người tham gia dự kiến
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.expectedParticipants}
                                        onChange={(e) => setFormData({ ...formData, expectedParticipants: e.target.value })}
                                        placeholder="Ví dụ: 20"
                                        min="1"
                                        max="100"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Ước tính số người có thể quan tâm và tham gia thảo luận
                                    </p>
                                </div>

                                {/* Submit button */}
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                            Đang gửi yêu cầu...
                                        </div>
                                    ) : (
                                        'Gửi yêu cầu'
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Hướng dẫn */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-blue-50 border border-blue-200 rounded-xl p-6"
                        >
                            <h4 className="flex items-center font-semibold text-blue-900 mb-3">
                                <InformationCircleIcon className="h-5 w-5 mr-2" />
                                Hướng dẫn
                            </h4>
                            <div className="space-y-3 text-sm text-blue-800">
                                <p>• Chọn tiêu đề rõ ràng, liên quan đến Tư tưởng Hồ Chí Minh</p>
                                <p>• Mô tả cụ thể tại sao chủ đề này cần được thảo luận</p>
                                <p>• Admin sẽ xem xét và phản hồi trong 1-2 ngày làm việc</p>
                                <p>• Chủ đề được duyệt sẽ có 2 kiểm duyệt viên được phân công</p>
                            </div>
                        </motion.div>

                        {/* Quy trình phê duyệt */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                        >
                            <h4 className="font-semibold text-gray-900 mb-4">
                                🔄 Quy trình phê duyệt
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Gửi yêu cầu</p>
                                        <p className="text-sm text-gray-600">Điền form và gửi đề xuất</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Admin xem xét</p>
                                        <p className="text-sm text-gray-600">Đánh giá và quyết định</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                        3
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Phân công moderator</p>
                                        <p className="text-sm text-gray-600">Gán 2 moderator cho chủ đề</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                                        4
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Kích hoạt</p>
                                        <p className="text-sm text-gray-600">Chủ đề sẵn sàng cho thảo luận</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Yêu cầu gần đây */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200"
                        >
                            <div className="p-6 border-b border-gray-200">
                                <h4 className="font-semibold text-gray-900">
                                    📋 Yêu cầu của tôi
                                </h4>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {recentRequests.map((request) => (
                                        <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                                            <h5 className="font-medium text-gray-900 mb-2 text-sm">
                                                {request.title}
                                            </h5>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(request.status)}`}>
                                                    {request.status === 'PENDING' ? 'Chờ duyệt' :
                                                        request.status === 'APPROVED' ? 'Đã duyệt' : 'Bị từ chối'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {request.createdAt}
                                                </span>
                                            </div>
                                            {request.status === 'PENDING' && (
                                                <p className="text-xs text-gray-600">
                                                    ⏳ Dự kiến phê duyệt: {request.estimatedApproval}
                                                </p>
                                            )}
                                            {request.status === 'APPROVED' && (
                                                <p className="text-xs text-green-600">
                                                    ✅ Đã duyệt {request.approvedAt}
                                                </p>
                                            )}
                                            {request.status === 'REJECTED' && request.rejectReason && (
                                                <p className="text-xs text-red-600">
                                                    ❌ {request.rejectReason}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RequestThreadPage
