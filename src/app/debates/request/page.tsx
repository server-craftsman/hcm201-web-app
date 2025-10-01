'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    PlusCircleIcon,
    InformationCircleIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/shared/utils/shadcn'
import { threadApi } from '@/modules/debate'
// Add toast import
import { toast } from 'react-hot-toast'

const RequestThreadPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        importance: '',
        expectedParticipants: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    // Remove submitSuccess state, as we will use toast instead
    // const [submitSuccess, setSubmitSuccess] = useState(false)
    const [myRequests, setMyRequests] = useState<any[]>([])
    const [loadingRequests, setLoadingRequests] = useState<boolean>(true)
    const [loadError, setLoadError] = useState<string | null>(null)
    const router = useRouter()

    const importancelevels = [
        { value: 'high', label: 'Cao - Cần thảo luận gấp', color: 'text-red-600' },
        { value: 'medium', label: 'Trung bình - Thảo luận bình thường', color: 'text-yellow-600' },
        { value: 'low', label: 'Thấp - Có thể chờ', color: 'text-green-600' }
    ]

    // Load user's requests from API
    useEffect(() => {
        const load = async () => {
            try {
                setLoadingRequests(true)
                setLoadError(null)
                const res = await threadApi.getMyThreadRequests(1, 20)
                setMyRequests(res.data.items)
            } catch (e) {
                setLoadError('Không thể tải danh sách yêu cầu')
            } finally {
                setLoadingRequests(false)
            }
        }
        load()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Map importance -> priority enum
            const priority = formData.importance
                ? (formData.importance.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH')
                : undefined

            await threadApi.createThreadRequest({
                title: formData.title,
                description: formData.description || undefined,
                category: formData.category || undefined,
                expectedParticipants: formData.expectedParticipants || undefined,
                priority
            })

            // Show toast success with longer duration before redirect
            toast.success('Đã gửi yêu cầu thành công! Admin sẽ xem xét và phản hồi trong 1-2 ngày làm việc.', {
                duration: 3000
            })

            // Reset form
            setFormData({
                title: '',
                description: '',
                category: '',
                importance: '',
                expectedParticipants: ''
            })

            // Sau khi tạo request thành công, quay về trang home
            router.push('/')

            // Nếu muốn giữ lại refresh requests, có thể để lại đoạn này (nhưng sẽ không chạy vì đã chuyển trang)
            // const res = await threadApi.getMyThreadRequests(1, 20)
            // setMyRequests(res.data.items)
        } catch (err) {
            console.error('Create thread request failed', err)
        } finally {
            setIsSubmitting(false)
        }
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
        <div className="relative min-h-screen pt-20 pb-12 overflow-hidden">
            {/* Luxury gradient background */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-blue-50" />
            <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-300/30 via-fuchsia-300/20 to-purple-300/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-tr from-cyan-300/20 via-sky-300/20 to-indigo-300/20 blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-fuchsia-600 to-rose-600">
                        Yêu cầu chủ đề tranh luận mới
                    </h1>
                    <p className="mt-3 text-gray-600 text-lg">
                        Gửi ý tưởng chất lượng để mở ra một không gian tranh luận công bằng, minh bạch và giàu học thuật.
                    </p>
                </motion.div>

                {/* Success Message */}
                {/* Removed in-page success message, now handled by toast */}
                {/* 
                {submitSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 rounded-xl p-4 bg-gradient-to-r from-green-50 to-emerald-50 ring-1 ring-emerald-200/60 shadow-md"
                    >
                        <div className="flex items-center">
                            <CheckCircleIcon className="h-5 w-5 text-emerald-600 mr-2" />
                            <p className="text-emerald-800 font-medium">
                                Đã gửi yêu cầu thành công! Admin sẽ xem xét và phản hồi trong 1-2 ngày làm việc.
                            </p>
                        </div>
                    </motion.div>
                )}
                */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form yêu cầu */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 }}
                        className="lg:col-span-2 rounded-2xl bg-white/80 backdrop-blur ring-1 ring-gray-200 shadow-xl"
                    >
                        <div className="p-6 border-b border-gray-100">
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
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white/70"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Tiêu đề ngắn gọn, rõ ràng và thu hút (tối đa 200 ký tự)
                                    </p>
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
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white/70"
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
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white/70"
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
                                    className="w-full py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-600 text-white shadow-lg hover:shadow-xl"
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
                            className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl p-6 ring-1 ring-white/50 shadow-sm"
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
                            className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-gray-200 p-6 ring-1 ring-white/60"
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
                            className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-gray-200"
                        >
                            <div className="p-6 border-b border-gray-200">
                                <h4 className="font-semibold text-gray-900">
                                    📋 Yêu cầu của tôi
                                </h4>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {loadingRequests && (
                                        <div className="text-sm text-gray-500">Đang tải yêu cầu...</div>
                                    )}
                                    {loadError && (
                                        <div className="text-sm text-red-600">{loadError}</div>
                                    )}
                                    {!loadingRequests && !loadError && myRequests.map((request) => (
                                        <div key={request._id} className="border border-gray-200 rounded-lg p-4">
                                            <h5 className="font-medium text-gray-900 mb-2 text-sm">
                                                {request.title}
                                            </h5>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(request.status)}`}>
                                                    {request.status === 'PENDING'
                                                        ? 'Chờ duyệt'
                                                        : request.status === 'APPROVED'
                                                            ? 'Đã duyệt'
                                                            : request.status === 'REJECTED'
                                                                ? 'Bị từ chối'
                                                                : request.status === 'DRAFT'
                                                                    ? 'Bản nháp'
                                                                    : request.status === 'ACTIVE'
                                                                        ? 'Đang hoạt động'
                                                                        : request.status === 'PAUSED'
                                                                            ? 'Tạm dừng'
                                                                            : request.status === 'CLOSED'
                                                                                ? 'Đã đóng'
                                                                                : request.status === 'ARCHIVED'
                                                                                    ? 'Lưu trữ'
                                                                                    : request.status}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(request.createdAt).toLocaleString('vi-VN')}
                                                </span>
                                            </div>
                                            {request.adminNotes && (
                                                <p className="text-xs text-gray-600">📝 {request.adminNotes}</p>
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
