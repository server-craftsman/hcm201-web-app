import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    EyeIcon,
    UserIcon,
    DocumentTextIcon,
    ChatBubbleLeftEllipsisIcon,
    ExclamationTriangleIcon,
    UserGroupIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/shared/utils/shadcn'
import { threadApi, ThreadRequest, ApproveThreadData } from '@/modules/debate/api/threadApi'

interface ThreadApprovalQueueProps {
    userRole: 'ADMIN' | 'MODERATOR' | 'USER'
    className?: string
}

export const ThreadApprovalQueue: React.FC<ThreadApprovalQueueProps> = ({
    userRole,
    className
}) => {
    const [requests, setRequests] = useState<ThreadRequest[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING')
    const [selectedRequest, setSelectedRequest] = useState<ThreadRequest | null>(null)
    const [showApprovalModal, setShowApprovalModal] = useState(false)
    const [approvalData, setApprovalData] = useState<ApproveThreadData>({
        modForSideA: '',
        modForSideB: '',
        adminNotes: ''
    })
    const [isProcessing, setIsProcessing] = useState(false)

    // Mock moderators list
    const mockModerators = [
        { id: 'mod1', name: 'PGS.TS Nguyễn Văn A', email: 'nguyenvana@hcm.edu.vn' },
        { id: 'mod2', name: 'TS Trần Thị B', email: 'tranthib@hcm.edu.vn' },
        { id: 'mod3', name: 'PGS Lê Văn C', email: 'levanc@hcm.edu.vn' },
        { id: 'mod4', name: 'TS Phạm Thị D', email: 'phamthid@hcm.edu.vn' }
    ]

    useEffect(() => {
        loadRequests()
    }, [filter])

    const loadRequests = async () => {
        setIsLoading(true)
        try {
            const response = await threadApi.getThreadRequests(1, 20, filter === 'ALL' ? undefined : filter)
            setRequests(response.data.items)
        } catch (error) {
            console.error('Error loading thread requests:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleApprove = async () => {
        if (!selectedRequest || !approvalData.modForSideA || !approvalData.modForSideB) return

        setIsProcessing(true)
        try {
            await threadApi.approveThreadRequest(selectedRequest._id, approvalData)
            setRequests(prev => prev.map(req =>
                req._id === selectedRequest._id
                    ? { ...req, status: 'APPROVED', adminNotes: approvalData.adminNotes }
                    : req
            ))
            setShowApprovalModal(false)
            setSelectedRequest(null)
            setApprovalData({ modForSideA: '', modForSideB: '', adminNotes: '' })
        } catch (error) {
            console.error('Error approving thread request:', error)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleReject = async (requestId: string, reason: string) => {
        setIsProcessing(true)
        try {
            await threadApi.rejectThreadRequest(requestId, reason)
            setRequests(prev => prev.map(req =>
                req._id === requestId
                    ? { ...req, status: 'REJECTED', adminNotes: reason }
                    : req
            ))
        } catch (error) {
            console.error('Error rejecting thread request:', error)
        } finally {
            setIsProcessing(false)
        }
    }

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

        if (diffInMinutes < 1) return 'Vừa xong'
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
        return `${Math.floor(diffInMinutes / 1440)} ngày trước`
    }

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'PENDING':
                return {
                    icon: ClockIcon,
                    label: 'Chờ duyệt',
                    color: 'text-amber-700 bg-amber-100 border-amber-300'
                }
            case 'APPROVED':
                return {
                    icon: CheckCircleIcon,
                    label: 'Đã duyệt',
                    color: 'text-green-700 bg-green-100 border-green-300'
                }
            case 'REJECTED':
                return {
                    icon: XCircleIcon,
                    label: 'Bị từ chối',
                    color: 'text-red-700 bg-red-100 border-red-300'
                }
            default:
                return {
                    icon: ClockIcon,
                    label: 'Không xác định',
                    color: 'text-gray-700 bg-gray-100 border-gray-300'
                }
        }
    }

    if (userRole !== 'ADMIN') {
        return (
            <div className="text-center py-12">
                <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có quyền truy cập</h3>
                <p className="text-gray-600">Chỉ admin mới có thể xem hàng chờ phê duyệt chủ đề.</p>
            </div>
        )
    }

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-indigo-500 rounded-lg">
                        <AcademicCapIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Hàng chờ phê duyệt chủ đề</h2>
                        <p className="text-gray-600">Quản lý các đề xuất chủ đề tranh luận từ cộng đồng</p>
                    </div>
                </div>

                {/* Filter */}
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                    <option value="PENDING">Chờ duyệt</option>
                    <option value="ALL">Tất cả</option>
                    <option value="APPROVED">Đã duyệt</option>
                    <option value="REJECTED">Bị từ chối</option>
                </select>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Tổng đề xuất', value: requests.length, color: 'bg-blue-500', icon: DocumentTextIcon },
                    { label: 'Chờ duyệt', value: requests.filter(r => r.status === 'PENDING').length, color: 'bg-amber-500', icon: ClockIcon },
                    { label: 'Đã duyệt', value: requests.filter(r => r.status === 'APPROVED').length, color: 'bg-green-500', icon: CheckCircleIcon },
                    { label: 'Bị từ chối', value: requests.filter(r => r.status === 'REJECTED').length, color: 'bg-red-500', icon: XCircleIcon }
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
                    >
                        <div className="flex items-center space-x-4">
                            <div className={cn("p-3 rounded-lg", stat.color)}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Requests List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Danh sách đề xuất ({requests.length})
                    </h3>
                </div>

                <div className="divide-y divide-gray-200">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-gray-600">Đang tải...</span>
                            </div>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-12">
                            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đề xuất nào</h3>
                            <p className="text-gray-600">
                                {filter === 'PENDING' ? 'Hiện tại không có đề xuất nào chờ duyệt.' : 'Không tìm thấy đề xuất phù hợp với bộ lọc.'}
                            </p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {requests.map((request, index) => {
                                const statusConfig = getStatusConfig(request.status)

                                return (
                                    <motion.div
                                        key={request._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-6 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 space-y-3">
                                                {/* Header */}
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                                            {request.title}
                                                        </h4>

                                                        {/* Description */}
                                                        {request.description && (
                                                            <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                                                                {request.description}
                                                            </p>
                                                        )}

                                                        {/* Requester and time */}
                                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                            <div className="flex items-center space-x-2">
                                                                <UserIcon className="h-4 w-4" />
                                                                <span>
                                                                    {request.requester.firstName} {request.requester.lastName}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <ClockIcon className="h-4 w-4" />
                                                                <span>{formatRelativeTime(request.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className={cn(
                                                        "flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full border ml-4",
                                                        statusConfig.color
                                                    )}>
                                                        <statusConfig.icon className="h-3 w-3" />
                                                        <span>{statusConfig.label}</span>
                                                    </div>
                                                </div>

                                                {/* Admin Notes */}
                                                {request.adminNotes && (
                                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                        <p className="text-sm text-blue-800">
                                                            <strong>Ghi chú admin:</strong> {request.adminNotes}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                {request.status === 'PENDING' && (
                                                    <div className="flex items-center space-x-3 pt-3">
                                                        <motion.button
                                                            onClick={() => {
                                                                setSelectedRequest(request)
                                                                setShowApprovalModal(true)
                                                            }}
                                                            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <CheckCircleIcon className="h-4 w-4" />
                                                            <span>Phê duyệt</span>
                                                        </motion.button>

                                                        <motion.button
                                                            onClick={() => {
                                                                const reason = prompt('Lý do từ chối:')
                                                                if (reason) {
                                                                    handleReject(request._id, reason)
                                                                }
                                                            }}
                                                            className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <XCircleIcon className="h-4 w-4" />
                                                            <span>Từ chối</span>
                                                        </motion.button>

                                                        <motion.button
                                                            onClick={() => setSelectedRequest(request)}
                                                            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <EyeIcon className="h-4 w-4" />
                                                            <span>Xem chi tiết</span>
                                                        </motion.button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Approval Modal */}
            <AnimatePresence>
                {showApprovalModal && selectedRequest && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900">Phê duyệt chủ đề tranh luận</h3>
                                <p className="text-gray-600 mt-1">Gán moderator và kích hoạt chủ đề</p>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Thread Info */}
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Thông tin chủ đề:</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h5 className="font-medium text-gray-900 mb-2">{selectedRequest.title}</h5>
                                        {selectedRequest.description && (
                                            <p className="text-gray-700 text-sm">{selectedRequest.description}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Moderator Assignment */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Moderator phía Ủng hộ *
                                        </label>
                                        <select
                                            value={approvalData.modForSideA}
                                            onChange={(e) => setApprovalData(prev => ({ ...prev, modForSideA: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="">Chọn moderator...</option>
                                            {mockModerators.map(mod => (
                                                <option key={mod.id} value={mod.id}>{mod.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Moderator phía Phản đối *
                                        </label>
                                        <select
                                            value={approvalData.modForSideB}
                                            onChange={(e) => setApprovalData(prev => ({ ...prev, modForSideB: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="">Chọn moderator...</option>
                                            {mockModerators.filter(mod => mod.id !== approvalData.modForSideA).map(mod => (
                                                <option key={mod.id} value={mod.id}>{mod.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Admin Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ghi chú admin (tùy chọn)
                                    </label>
                                    <textarea
                                        value={approvalData.adminNotes}
                                        onChange={(e) => setApprovalData(prev => ({ ...prev, adminNotes: e.target.value }))}
                                        placeholder="Ghi chú về quyết định phê duyệt..."
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowApprovalModal(false)
                                        setSelectedRequest(null)
                                        setApprovalData({ modForSideA: '', modForSideB: '', adminNotes: '' })
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <motion.button
                                    onClick={handleApprove}
                                    disabled={isProcessing || !approvalData.modForSideA || !approvalData.modForSideB}
                                    className={cn(
                                        "px-6 py-2 bg-green-500 text-white rounded-lg font-medium transition-colors flex items-center space-x-2",
                                        isProcessing || !approvalData.modForSideA || !approvalData.modForSideB
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-green-600"
                                    )}
                                    whileHover={!isProcessing && approvalData.modForSideA && approvalData.modForSideB ? { scale: 1.05 } : {}}
                                    whileTap={!isProcessing && approvalData.modForSideA && approvalData.modForSideB ? { scale: 0.95 } : {}}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Đang xử lý...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircleIcon className="h-4 w-4" />
                                            <span>Phê duyệt và kích hoạt</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
