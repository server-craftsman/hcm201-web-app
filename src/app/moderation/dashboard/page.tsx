'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast, Toaster } from 'react-hot-toast'
import { useModerationQueue } from '@/modules/debate/hooks'
import { debateApi } from '@/modules/debate/api/debateApi'
import {
    ClipboardDocumentListIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    FlagIcon,
    EyeIcon,
    StarIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    UserIcon,
    ChatBubbleLeftRightIcon,
    HandThumbUpIcon,
    HandThumbDownIcon
} from '@heroicons/react/24/outline'

const ModerationDashboard = () => {
    const [selectedTab, setSelectedTab] = useState('PENDING')
    const [dashboardData, setDashboardData] = useState<any>(null)
    const [moderatorStats, setModeratorStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Use API hook for real moderation queue data
    const {
        items: queueItems,
        loading: queueLoading,
        error: queueError,
        meta: queueMeta,
        refetch: refetchQueue
    } = useModerationQueue({
        status: selectedTab === 'pending' ? 'PENDING' : '',
        page: 1,
        limit: 10
    })

    // Load dashboard data from API
    const loadDashboardData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Load dashboard data and moderator stats in parallel
            const [dashboardResponse, statsResponse] = await Promise.all([
                debateApi.getModeratorDashboard(),
                debateApi.getModeratorStats()
            ])

            setDashboardData(dashboardResponse.data)
            setModeratorStats(statsResponse.data)

            console.log('📊 Dashboard data loaded:', dashboardResponse.data)
            console.log('📈 Moderator stats loaded:', statsResponse.data)

        } catch (error) {
            console.error('Failed to load dashboard data:', error)
            setError('Không thể tải dữ liệu dashboard')

            // Set fallback data
            setDashboardData({
                assignedThreads: 0,
                pendingModeration: 0,
                moderatedToday: 0,
                totalModerated: 0,
                recentActivity: []
            })
            setModeratorStats({
                totalModerated: 0,
                approvedToday: 0,
                rejectedToday: 0,
                pendingCount: 0,
                moderationRate: 0
            })
        } finally {
            setLoading(false)
        }
    }

    // Use API data if available, fallback to mock data
    const stats = {
        pendingArguments: moderatorStats?.pendingCount || queueItems.filter(item => item.status === 'PENDING').length || 0,
        approvedToday: moderatorStats?.approvedToday || 0,
        rejectedToday: moderatorStats?.rejectedToday || 0,
        flaggedArguments: queueItems.filter(item => (item as any).status === 'FLAGGED' || item.status === 'REJECTED').length || 0,
        avgProcessingTime: 35, // phút - would need separate API
        myApprovalRate: moderatorStats?.moderationRate || 0,
        totalProcessed: moderatorStats?.totalModerated || 0,
        assignedThreads: dashboardData?.assignedThreads || 0,
        moderatedToday: dashboardData?.moderatedToday || 0
    }

    const pendingArguments = [
        {
            id: 1,
            title: "Thực học gắn với hành",
            content: "Đề cao giá trị đạo đức và năng lực thực tiễn trong giáo dục...",
            author: "Nguyễn Văn A",
            threadTitle: "Tư tưởng Hồ Chí Minh trong giáo dục",
            argumentType: "SUPPORT",
            createdAt: "10 phút trước",
            wordCount: 245
        },
        {
            id: 2,
            title: "Văn hóa dân tộc",
            content: "Giá trị văn hóa truyền thống cần được bảo tồn và phát triển...",
            author: "Trần Thị B",
            threadTitle: "Giá trị văn hóa dân tộc",
            argumentType: "NEUTRAL",
            createdAt: "25 phút trước",
            wordCount: 198
        },
        {
            id: 3,
            title: "Đạo đức cách mạng",
            content: "Tinh thần hy sinh vì tổ quốc là nền tảng của đạo đức cách mạng...",
            author: "Lê Văn C",
            threadTitle: "Đạo đức cách mạng Hồ Chí Minh",
            argumentType: "OPPOSE",
            createdAt: "1 giờ trước",
            wordCount: 312
        }
    ]

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) return 'Vừa xong'
        if (diffInHours < 24) return `${diffInHours} giờ trước`
        return `${Math.floor(diffInHours / 24)} ngày trước`
    }

    // Convert API recent activity to UI format
    const recentActions = dashboardData?.recentActivity?.slice(0, 5).map((activity: any, index: number) => ({
        id: activity.id || `activity-${index}`, // Ensure unique ID
        action: activity.type === 'argument_created' ? (activity.status === 'APPROVED' ? 'APPROVE' : activity.status === 'REJECTED' ? 'REJECT' : 'FLAG') :
            activity.type === 'vote_cast' ? 'VOTE' : 'THREAD',
        argumentTitle: activity.title,
        author: activity.user,
        timestamp: formatTimeAgo(activity.timestamp),
        notes: activity.type === 'argument_created' ?
            (activity.status === 'APPROVED' ? 'Luận điểm đã được duyệt' :
                activity.status === 'REJECTED' ? 'Luận điểm bị từ chối' : 'Luận điểm mới') :
            activity.type === 'vote_cast' ? `Bình chọn ${activity.status}` : 'Thread mới được tạo'
    })) || []

    // Load data on component mount
    useEffect(() => {
        loadDashboardData()
    }, [])

    const getArgumentTypeStyle = (type: string) => {
        switch (type) {
            case 'SUPPORT':
                return 'bg-green-100 text-green-800'
            case 'OPPOSE':
                return 'bg-red-100 text-red-800'
            case 'NEUTRAL':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getActionStyle = (action: string) => {
        switch (action) {
            case 'APPROVE':
                return 'bg-green-100 text-green-800'
            case 'REJECT':
                return 'bg-red-100 text-red-800'
            case 'FLAG':
                return 'bg-yellow-100 text-yellow-800'
            case 'VOTE':
                return 'bg-blue-100 text-blue-800'
            case 'THREAD':
                return 'bg-purple-100 text-purple-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getActionLabel = (action: string) => {
        switch (action) {
            case 'APPROVE':
                return 'Duyệt'
            case 'REJECT':
                return 'Từ chối'
            case 'FLAG':
                return 'Flag'
            case 'VOTE':
                return 'Bình chọn'
            case 'THREAD':
                return 'Thread'
            default:
                return action
        }
    }

    const handleModerationAction = async (argumentId: number, action: string) => {
        try {
            console.log(`${action} argument ${argumentId}`)

            // Call real API
            await debateApi.moderateArgument(
                argumentId.toString(),
                action as 'APPROVE' | 'REJECT' | 'FLAG' | 'HIGHLIGHT' | 'UNHIGHLIGHT',
                undefined,
                undefined
            )

            // Show success toast
            const actionText = action === 'APPROVE' ? 'Duyệt' :
                action === 'REJECT' ? 'Từ chối' :
                    action === 'FLAG' ? 'Đánh dấu' : 'Xử lý'

            toast.success(`${actionText} luận điểm thành công!`, {
                duration: 3000,
                style: {
                    background: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500'
                },
                icon: '✅'
            })

            // Refresh data
            refetchQueue()
            loadDashboardData()

        } catch (error) {
            console.error('Moderation action failed:', error)
            toast.error('Có lỗi xảy ra khi xử lý luận điểm', {
                duration: 4000,
                style: {
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500'
                },
                icon: '❌'
            })
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-8">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#ffffff',
                        color: '#374151',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }
                }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                🛡️ Dashboard Kiểm duyệt
                            </h1>
                            <p className="text-gray-600">
                                Kiểm duyệt luận điểm và duy trì chất lượng thảo luận
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={loadDashboardData}
                            disabled={loading}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Làm mới
                        </motion.button>
                    </div>
                </motion.div>

                {/* Error State */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4"
                    >
                        <div className="flex items-center">
                            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                            <p className="text-red-800 font-medium">{error}</p>
                        </div>
                    </motion.div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Chờ kiểm duyệt</p>
                                <p className="text-3xl font-bold text-orange-600">
                                    {loading ? '...' : stats.pendingArguments}
                                </p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-full">
                                <ClockIcon className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">Cần xử lý ngay</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Đã duyệt hôm nay</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {loading ? '...' : stats.approvedToday}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">{stats.rejectedToday} bị từ chối</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Thread được gán</p>
                                <p className="text-3xl font-bold text-purple-600">
                                    {loading ? '...' : stats.assignedThreads}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <UserIcon className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">Đang quản lý</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tỷ lệ duyệt</p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {loading ? '...' : stats.myApprovalRate}%
                                </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <StarIcon className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">Hiệu suất tốt</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm border border-indigo-200 p-6 text-white"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-indigo-100">Tổng đã kiểm duyệt</p>
                                <p className="text-3xl font-bold text-white">
                                    {loading ? '...' : stats.totalProcessed}
                                </p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-full">
                                <DocumentTextIcon className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-indigo-100">Tất cả thời gian</span>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Hàng chờ kiểm duyệt */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-orange-600" />
                                    Hàng chờ kiểm duyệt
                                </h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setSelectedTab('pending')}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedTab === 'pending'
                                            ? 'bg-orange-100 text-orange-800'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Chờ duyệt ({stats.pendingArguments})
                                    </button>
                                    <button
                                        onClick={() => setSelectedTab('flagged')}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedTab === 'flagged'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Đã flag ({stats.flaggedArguments})
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {queueLoading && (
                                <div className="space-y-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-6">
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {queueError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                    <p className="text-red-800 font-medium">Lỗi tải dữ liệu:</p>
                                    <p className="text-red-600">{queueError}</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Use API data if available, fallback to mock data */}
                                {(queueItems.length > 0 ? queueItems.map((item: any) => ({
                                    id: parseInt(item.id),
                                    title: item.title || `Luận điểm từ thread ${item.threadId}`,
                                    content: item.content,
                                    author: item.authorId?.firstName && item.authorId?.lastName ?
                                        `${item.authorId.firstName} ${item.authorId.lastName}` :
                                        item.authorId?.username || `User ${item.authorId}`,
                                    threadTitle: `Thread ${item.threadId}`,
                                    argumentType: item.argumentType?.toUpperCase() || 'SUPPORT',
                                    createdAt: new Date(item.createdAt).toLocaleString('vi-VN'),
                                    wordCount: item.content?.length || 0
                                })) : pendingArguments).map((argument) => (
                                    <div key={argument.id} className="border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h4 className="font-semibold text-gray-900">{argument.title}</h4>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getArgumentTypeStyle(argument.argumentType)}`}>
                                                        {argument.argumentType === 'SUPPORT' ? 'Ủng hộ' :
                                                            argument.argumentType === 'OPPOSE' ? 'Phản đối' : 'Trung lập'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Chủ đề: {argument.threadTitle}
                                                </p>
                                                <p className="text-gray-700 mb-3 line-clamp-3">
                                                    {argument.content}
                                                </p>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <span>👤 {argument.author}</span>
                                                    <span>⏰ {argument.createdAt}</span>
                                                    <span>📝 {argument.wordCount} từ</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* ĐÃ XOÁ CÁC BUTTON TRONG HÀNG ĐỢI KIỂM DUYỆT */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Hoạt động gần đây */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
                                Hoạt động gần đây
                            </h3>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="space-y-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="animate-pulse bg-gray-50 rounded-lg p-3">
                                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : recentActions.length === 0 ? (
                                <div className="text-center py-8">
                                    <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Không có hoạt động gần đây</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentActions.map((action: any) => (
                                        <div key={action.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActionStyle(action.action)}`}>
                                                {getActionLabel(action.action)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 text-sm truncate">
                                                    {action.argumentTitle}
                                                </p>
                                                <p className="text-xs text-gray-600 mb-1">
                                                    Bởi {action.author}
                                                </p>
                                                <p className="text-xs text-gray-500 italic">
                                                    "{action.notes}"
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {action.timestamp}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => window.open('/moderation/queue', '_blank')}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Xem hàng chờ kiểm duyệt
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default ModerationDashboard
