'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { toast, Toaster } from 'react-hot-toast'
import { useModerationQueue } from '@/modules/debate/hooks'
import { debateApi } from '@/modules/debate/api/debateApi'
import { argumentApi } from '@/modules/debate/api/argumentApi'
import {
    ClipboardDocumentListIcon,
    CheckCircleIcon,
    XCircleIcon,
    FlagIcon,
    EyeIcon,
    FunnelIcon,
    ClockIcon,
    UserIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    StarIcon,
    ArrowPathIcon,
    HandThumbUpIcon,
    HandThumbDownIcon
} from '@heroicons/react/24/outline'

const ModerationQueuePage = () => {
    const [selectedFilter, setSelectedFilter] = useState('pending')
    const [selectedArgument, setSelectedArgument] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [moderationNote, setModerationNote] = useState('')
    const [modalAction, setModalAction] = useState<'APPROVE' | 'REJECT' | 'FLAG' | null>(null)
    const [moderatorStats, setModeratorStats] = useState<any>(null)
    const [statsLoading, setStatsLoading] = useState(false)
    // Removed assignedThreads and assignedThreadsLoading
    const [argumentDetails, setArgumentDetails] = useState<any>(null)
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
    const [detailsLoading, setDetailsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('PENDING')

    // Use API hook for real moderation queue data
    const {
        items: apiQueueItems,
        loading: apiLoading,
        error: apiError,
        meta: apiMeta,
        refetch: refetchQueue,
        groupedItems
    } = useModerationQueue({
        status: activeTab,
        page: 1,
        limit: 20,
        groupBySide: true
    })

    // Get current user information from localStorage
    const [currentUser, setCurrentUser] = useState<any>(null)

    useEffect(() => {
        // Load user data from localStorage
        try {
            const userData = localStorage.getItem('currentUser')
            if (userData) {
                setCurrentUser(JSON.parse(userData))
            }
        } catch (error) {
            console.error('Error loading user data:', error)
        }
    }, [])

    // Use ONLY moderation-stats API for dashboard (KHÔNG dựa vào queue list)
    // Response từ /api/v1/debate/moderator/moderation-stats:
    // { totalModerated, approvedToday, rejectedToday, pendingCount, moderationRate }
    const queueStats = {
        totalHandled: moderatorStats?.totalModerated || 0,      // Tổng đã xử lý
        pending: moderatorStats?.pendingCount || 0,             // Chờ duyệt
        approved: moderatorStats?.approvedToday || 0,           // Đã duyệt hôm nay
        rejected: moderatorStats?.rejectedToday || 0,           // Đã từ chối hôm nay
        moderationRate: moderatorStats?.moderationRate || 0     // Tỷ lệ kiểm duyệt %
    }


    // Convert API data to UI format
    const convertedApiItems = apiQueueItems.map((item: any) => ({
        id: item._id,
        title: item.title,
        content: item.content,
        author: {
            name: `${item.authorId?.firstName || ''} ${item.authorId?.lastName || ''}`.trim() || item.authorId?.username || 'User',
            avatar: item.authorId?.avatar || `${item.authorId?.firstName?.charAt(0) || 'U'}`,
            username: item.authorId?.username || '',
            email: item.authorId?.email || '',
            role: "USER",
            reputation: 85
        },
        thread: {
            id: item.threadId,
            title: `Thread ${item.threadId}`,
            category: "API Data"
        },
        argumentType: item.argumentType,
        status: item.status,
        priority: "MEDIUM",
        createdAt: item.createdAt,
        waitTime: Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 60000),
        wordCount: item.content.length,
        sources: [],
        assignedTo: "current_moderator",
        flags: [],
        relatedArguments: 1,
        // Additional API data
        upvotes: item.upvotes || 0,
        downvotes: item.downvotes || 0,
        score: item.score || 0,
        viewCount: item.viewCount || 0,
        isHighlighted: item.isHighlighted || false
    }))

    // Use only API data
    const allArgumentsData = convertedApiItems

    // Không cần lọc theo selectedFilter nữa vì đã sử dụng activeTab để lọc từ API
    const filteredArgumentsData = allArgumentsData

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800'
            case 'FLAGGED':
                return 'bg-red-100 text-red-800'
            case 'APPROVED':
                return 'bg-green-100 text-green-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

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

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'HIGH':
                return 'text-red-600'
            case 'MEDIUM':
                return 'text-yellow-600'
            case 'LOW':
                return 'text-green-600'
            default:
                return 'text-gray-600'
        }
    }

    // Load moderator statistics
    const loadModeratorStats = async () => {
        try {
            setStatsLoading(true)
            const response = await debateApi.getModeratorStats()
            setModeratorStats(response.data)
            console.log('📊 Moderator stats loaded:', response.data)
        } catch (error) {
            console.error('Failed to load moderator stats:', error)
            // Set fallback stats
            setModeratorStats({
                totalModerated: 0,
                approvedToday: 0,
                rejectedToday: 0,
                pendingCount: 0,
                moderationRate: 0
            })
        } finally {
            setStatsLoading(false)
        }
    }

    // Removed loadAssignedThreads

    const handleModerationAction = async (notes: string = '') => {
        if (!selectedArgument || !modalAction) return

        try {
            console.log(`${modalAction} argument ${selectedArgument.id} with notes: ${notes}`)

            // Call real API
            await argumentApi.moderateArgument({
                argumentId: selectedArgument.id.toString(),
                action: modalAction,
                notes: notes || undefined
            })

            // Show success toast
            const actionText = modalAction === 'APPROVE' ? 'Duyệt' :
                modalAction === 'REJECT' ? 'Từ chối' :
                    modalAction === 'FLAG' ? 'Đánh dấu' : 'Xử lý'

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

            // Refresh queue data and stats
            refetchQueue()
            loadModeratorStats()

        } catch (error: any) {
            console.error('Moderation action failed:', error)

            // Parse error response
            const errorMessage = error?.response?.data?.message || error?.message
            const statusCode = error?.response?.status || error?.response?.data?.statusCode

            // Handle specific error cases
            if (statusCode === 403) {
                // Translate permission messages to Vietnamese
                let vietnameseMessage = errorMessage
                if (errorMessage?.includes('SUPPORT arguments only')) {
                    vietnameseMessage = 'Bạn chỉ được phép kiểm duyệt luận điểm ỦNG HỘ'
                } else if (errorMessage?.includes('OPPOSE arguments only')) {
                    vietnameseMessage = 'Bạn chỉ được phép kiểm duyệt luận điểm PHẢN ĐỐI'
                }

                toast.error(`⚠️ Không có quyền: ${vietnameseMessage}`, {
                    duration: 5000,
                    style: {
                        background: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: '500'
                    },
                    icon: '🚫'
                })
            } else {
                toast.error(errorMessage || 'Có lỗi xảy ra khi xử lý luận điểm', {
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
        } finally {
            setIsModalOpen(false)
            setSelectedArgument(null)
            setModalAction(null)
            setModerationNote('')
        }
    }

    const handleHighlightAction = async (argumentId: string | number, action: 'HIGHLIGHT' | 'UNHIGHLIGHT') => {
        try {
            console.log(`${action} argument ${argumentId}`)

            // Call real API
            await argumentApi.moderateArgument({
                argumentId: argumentId.toString(),
                action: action
            })

            // Show success toast
            const actionText = action === 'HIGHLIGHT' ? 'Đánh dấu nổi bật' : 'Bỏ đánh dấu nổi bật'

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

            // Refresh queue data and stats
            refetchQueue()
            loadModeratorStats()

        } catch (error: any) {
            console.error('Highlight action failed:', error)

            // Parse error response
            const errorMessage = error?.response?.data?.message || error?.message
            const statusCode = error?.response?.status || error?.response?.data?.statusCode

            // Handle specific error cases
            if (statusCode === 403) {
                // Translate permission messages to Vietnamese
                let vietnameseMessage = errorMessage
                if (errorMessage?.includes('SUPPORT arguments only')) {
                    vietnameseMessage = 'Bạn chỉ được phép kiểm duyệt luận điểm ỦNG HỘ'
                } else if (errorMessage?.includes('OPPOSE arguments only')) {
                    vietnameseMessage = 'Bạn chỉ được phép kiểm duyệt luận điểm PHẢN ĐỐI'
                }

                toast.error(`⚠️ Không có quyền: ${vietnameseMessage}`, {
                    duration: 5000,
                    style: {
                        background: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: '500'
                    },
                    icon: '🚫'
                })
            } else {
                toast.error(errorMessage || 'Có lỗi xảy ra khi xử lý luận điểm', {
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
    }

    const openModerationModal = (argument: any, action: 'APPROVE' | 'REJECT' | 'FLAG') => {
        setSelectedArgument(argument)
        setModalAction(action)
        setIsModalOpen(true)
        setModerationNote('')
    }

    const openArgumentDetailsModal = async (argumentId: string) => {
        try {
            setDetailsLoading(true)
            setIsDetailsModalOpen(true)
            const response = await argumentApi.getArgumentById(argumentId)
            setArgumentDetails(response)
            console.log('Argument details loaded:', response)
        } catch (error) {
            console.error('Failed to load argument details:', error)
            toast.error('Không thể tải chi tiết luận điểm', {
                duration: 3000,
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
            setIsDetailsModalOpen(false)
        } finally {
            setDetailsLoading(false)
        }
    }

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) return 'Vừa xong'
        if (diffInHours < 24) return `${diffInHours} giờ trước`
        return `${Math.floor(diffInHours / 24)} ngày trước`
    }

    // Load moderator stats on component mount
    useEffect(() => {
        loadModeratorStats()
    }, [])

    // Removed useEffect for assigned threads

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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        📋 Hàng chờ kiểm duyệt
                    </h1>
                    <p className="text-gray-600">
                        Xem xét và kiểm duyệt các luận điểm đang chờ phê duyệt
                    </p>
                </motion.div>

                {/* Quick Stats - Hiển thị đầy đủ thông tin từ moderation-stats API */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {/* Card 1: Tổng đã xử lý */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng đã xử lý</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {statsLoading ? '...' : queueStats.totalHandled}
                                </p>
                            </div>
                            <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />
                        </div>
                    </motion.div>

                    {/* Card 2: Chờ duyệt */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {statsLoading ? '...' : queueStats.pending}
                                </p>
                            </div>
                            <ClockIcon className="h-8 w-8 text-yellow-600" />
                        </div>
                    </motion.div>

                    {/* Card 3: Đã duyệt hôm nay */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Duyệt hôm nay</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {statsLoading ? '...' : queueStats.approved}
                                </p>
                            </div>
                            <CheckCircleIcon className="h-8 w-8 text-green-600" />
                        </div>
                    </motion.div>

                    {/* Card 4: Đã từ chối hôm nay */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Từ chối hôm nay</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {statsLoading ? '...' : queueStats.rejected}
                                </p>
                            </div>
                            <XCircleIcon className="h-8 w-8 text-red-600" />
                        </div>
                    </motion.div>

                    {/* Card 5: Tỷ lệ kiểm duyệt */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm border border-indigo-200 p-4 text-white hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-100">Tỷ lệ kiểm duyệt</p>
                                <p className="text-2xl font-bold text-white">
                                    {statsLoading ? '...' : `${queueStats.moderationRate}%`}
                                </p>
                            </div>
                            <UserIcon className="h-8 w-8 text-purple-100" />
                        </div>
                    </motion.div>
                </div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <FunnelIcon className="h-5 w-5 mr-2 text-gray-600" />
                            Trạng thái
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveTab('PENDING')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Chờ duyệt
                        </button>
                        <button
                            onClick={() => setActiveTab('APPROVED')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'APPROVED'
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Đã duyệt
                        </button>
                        <button
                            onClick={() => setActiveTab('REJECTED')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'REJECTED'
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Đã từ chối
                        </button>
                        <button
                            onClick={() => setActiveTab('FLAGGED')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'FLAGGED'
                                ? 'bg-orange-100 text-orange-800 border border-orange-300'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Đã flag
                        </button>
                    </div>

                </motion.div>

                {/* Moderator Statistics Section */}
                {moderatorStats && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-sm border border-purple-200 p-6 mb-8"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <UserIcon className="h-5 w-5 mr-2 text-purple-600" />
                                Thống kê kiểm duyệt của tôi
                            </h3>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={loadModeratorStats}
                                disabled={statsLoading}
                                className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center space-x-2">
                                    <ArrowPathIcon className={`h-5 w-5 ${statsLoading ? 'animate-spin' : ''}`} />
                                    <span>Làm mới</span>
                                </div>
                                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            </motion.button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Tổng đã kiểm duyệt</p>
                                        <p className="text-2xl font-bold text-purple-600">{moderatorStats.totalModerated}</p>
                                    </div>
                                    <ClipboardDocumentListIcon className="h-8 w-8 text-purple-600" />
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Duyệt hôm nay</p>
                                        <p className="text-2xl font-bold text-green-600">{moderatorStats.approvedToday}</p>
                                    </div>
                                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Từ chối hôm nay</p>
                                        <p className="text-2xl font-bold text-red-600">{moderatorStats.rejectedToday}</p>
                                    </div>
                                    <XCircleIcon className="h-8 w-8 text-red-600" />
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Tỷ lệ kiểm duyệt</p>
                                        <p className="text-2xl font-bold text-blue-600">{moderatorStats.moderationRate}%</p>
                                    </div>
                                    <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Arguments List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-6"
                >
                    {apiLoading ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600 text-lg">Đang tải hàng chờ kiểm duyệt...</p>
                        </div>
                    ) : apiError ? (
                        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <XCircleIcon className="h-8 w-8 text-red-400" />
                            </div>
                            <p className="text-red-600 text-lg">Có lỗi khi tải dữ liệu</p>
                            <p className="text-red-400 text-sm mt-1">Vui lòng thử lại sau</p>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => refetchQueue()}
                                className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 mt-4"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center space-x-2">
                                    <ArrowPathIcon className="h-5 w-5" />
                                    <span>Thử lại</span>
                                </div>
                                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            </motion.button>
                        </div>
                    ) : filteredArgumentsData.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ClipboardDocumentListIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg">Không có luận điểm nào trong hàng chờ</p>
                            <p className="text-gray-400 text-sm mt-1">Các luận điểm sẽ hiển thị ở đây khi có</p>
                        </div>
                    ) : (
                        filteredArgumentsData.map((argument) => (
                            <div key={argument.id} className="border border-gray-200 rounded-lg p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h4 className="font-semibold text-gray-900">{argument.title}</h4>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getArgumentTypeStyle(argument.argumentType)}`}>
                                                {argument.argumentType === 'SUPPORT' ? 'Ủng hộ' :
                                                    argument.argumentType === 'OPPOSE' ? 'Phản đối' : 'Trung lập'}
                                            </span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(argument.status)}`}>
                                                {argument.status === 'PENDING' ? 'Chờ duyệt' :
                                                    argument.status === 'APPROVED' ? 'Đã duyệt' :
                                                        argument.status === 'FLAGGED' ? 'Đã flag' : argument.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Chủ đề: {argument.thread.title}
                                        </p>
                                        <p className="text-gray-700 mb-3 line-clamp-3">
                                            {argument.content}
                                        </p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span>👤 {argument.author.name}</span>
                                            <span>⏰ {formatTimeAgo(argument.createdAt)}</span>
                                            <span>📝 {argument.wordCount} từ</span>
                                            <span>👍 {(argument as any).upvotes || 0} • 👎 {(argument as any).downvotes || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        {/* Chỉ hiển thị các nút hành động khi status là PENDING */}
                                        {argument.status === 'PENDING' && (
                                            <>
                                                {/* Approve Button */}
                                                <motion.button
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => openModerationModal(argument, 'APPROVE')}
                                                    className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative flex items-center space-x-2">
                                                        <CheckCircleIcon className="h-5 w-5" />
                                                        <span>Duyệt</span>
                                                    </div>
                                                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                                </motion.button>

                                                {/* Reject Button */}
                                                <motion.button
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => openModerationModal(argument, 'REJECT')}
                                                    className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative flex items-center space-x-2">
                                                        <XCircleIcon className="h-5 w-5" />
                                                        <span>Từ chối</span>
                                                    </div>
                                                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                                </motion.button>

                                                {/* Flag Button */}
                                                <motion.button
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => openModerationModal(argument, 'FLAG')}
                                                    className="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    <div className="relative flex items-center space-x-2">
                                                        <FlagIcon className="h-5 w-5" />
                                                        <span>Flag</span>
                                                    </div>
                                                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                                </motion.button>
                                            </>
                                        )}
                                        {argument.status !== 'PENDING' && (
                                            <div className="text-sm text-gray-500 italic">
                                                Luận điểm đã được xử lý ({argument.status === 'APPROVED' ? 'Đã duyệt' :
                                                    argument.status === 'REJECTED' ? 'Đã từ chối' :
                                                        argument.status === 'FLAGGED' ? 'Đã đánh dấu' : argument.status})
                                            </div>
                                        )}
                                    </div>

                                    {/* View Details Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => openArgumentDetailsModal(argument.id)}
                                        className="group relative overflow-hidden bg-gradient-to-r from-slate-600 to-gray-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative flex items-center space-x-2">
                                            <EyeIcon className="h-5 w-5" />
                                            <span>Xem chi tiết</span>
                                        </div>
                                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    </motion.button>
                                </div>
                            </div>
                        ))
                    )}
                </motion.div>

                {/* Modal for moderation action */}
                <AnimatePresence>
                    {isModalOpen && selectedArgument && modalAction && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-white/95 backdrop-blur-md rounded-2xl max-w-2xl w-full shadow-2xl border border-white/20"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className={`p-6 rounded-t-2xl ${modalAction === 'APPROVE' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                    modalAction === 'REJECT' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                        'bg-gradient-to-r from-yellow-500 to-yellow-600'
                                    }`}>
                                    <div className="flex items-center space-x-3">
                                        {modalAction === 'APPROVE' && (
                                            <div className="p-2 bg-white/20 rounded-lg">
                                                <CheckCircleIcon className="h-6 w-6 text-white" />
                                            </div>
                                        )}
                                        {modalAction === 'REJECT' && (
                                            <div className="p-2 bg-white/20 rounded-lg">
                                                <XCircleIcon className="h-6 w-6 text-white" />
                                            </div>
                                        )}
                                        {modalAction === 'FLAG' && (
                                            <div className="p-2 bg-white/20 rounded-lg">
                                                <FlagIcon className="h-6 w-6 text-white" />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-xl font-bold text-white">
                                                {modalAction === 'APPROVE' ? 'Duyệt luận điểm' :
                                                    modalAction === 'REJECT' ? 'Từ chối luận điểm' :
                                                        'Đánh dấu luận điểm'}
                                            </h3>
                                            <p className="text-white/80 text-sm">
                                                {modalAction === 'APPROVE' ? 'Xác nhận duyệt luận điểm này' :
                                                    modalAction === 'REJECT' ? 'Từ chối luận điểm này' :
                                                        'Đánh dấu luận điểm để xem xét'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Argument Preview */}
                                    <div className="mb-6">
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0">
                                                    {selectedArgument.author.avatar && selectedArgument.author.avatar.startsWith('http') ? (
                                                        <Image
                                                            src={selectedArgument.author.avatar}
                                                            alt={selectedArgument.author.name}
                                                            width={40}
                                                            height={40}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                            {selectedArgument.author.avatar}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <h4 className="font-semibold text-gray-900 truncate">{selectedArgument.title}</h4>
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedArgument.argumentType === 'SUPPORT' ? 'bg-green-100 text-green-800' :
                                                            selectedArgument.argumentType === 'OPPOSE' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {selectedArgument.argumentType === 'SUPPORT' ? 'Ủng hộ' :
                                                                selectedArgument.argumentType === 'OPPOSE' ? 'Phản đối' : 'Trung lập'}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700 text-sm line-clamp-3 mb-2">{selectedArgument.content}</p>
                                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                        <span>@{selectedArgument.author.username}</span>
                                                        <span>📝 {selectedArgument.wordCount} từ</span>
                                                        <span>👀 {(selectedArgument as any).viewCount || 0} lượt xem</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes Input */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Ghi chú kiểm duyệt
                                            <span className="text-gray-500 font-normal ml-1">(Tùy chọn)</span>
                                        </label>
                                        <textarea
                                            value={moderationNote}
                                            onChange={(e) => setModerationNote(e.target.value)}
                                            placeholder={`Nhập ghi chú cho việc ${modalAction === 'APPROVE' ? 'duyệt' : modalAction === 'REJECT' ? 'từ chối' : 'đánh dấu'} luận điểm này...`}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50/80 to-gray-100/80 rounded-b-2xl">
                                    <div className="flex justify-end space-x-4">
                                        {/* Cancel Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsModalOpen(false)}
                                            className="group relative overflow-hidden bg-white text-gray-700 border-2 border-gray-300 px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-2">
                                                <span>Hủy</span>
                                            </div>
                                            <div className="absolute inset-0 bg-gray-200/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                        </motion.button>

                                        {/* Action Button */}
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleModerationAction(moderationNote)}
                                            className={`group relative overflow-hidden text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 ${modalAction === 'APPROVE' ? 'bg-gradient-to-r from-emerald-500 to-green-600' :
                                                modalAction === 'REJECT' ? 'bg-gradient-to-r from-red-500 to-rose-600' :
                                                    'bg-gradient-to-r from-amber-500 to-orange-600'
                                                }`}
                                        >
                                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${modalAction === 'APPROVE' ? 'bg-gradient-to-r from-emerald-600 to-green-700' :
                                                modalAction === 'REJECT' ? 'bg-gradient-to-r from-red-600 to-rose-700' :
                                                    'bg-gradient-to-r from-amber-600 to-orange-700'
                                                }`}></div>
                                            <div className="relative flex items-center space-x-2">
                                                {modalAction === 'APPROVE' && <CheckCircleIcon className="h-5 w-5" />}
                                                {modalAction === 'REJECT' && <XCircleIcon className="h-5 w-5" />}
                                                {modalAction === 'FLAG' && <FlagIcon className="h-5 w-5" />}
                                                <span>
                                                    {modalAction === 'APPROVE' ? 'Duyệt luận điểm' :
                                                        modalAction === 'REJECT' ? 'Từ chối luận điểm' :
                                                            'Đánh dấu luận điểm'}
                                                </span>
                                            </div>
                                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Argument Details Modal */}
                <AnimatePresence>
                    {isDetailsModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
                            onClick={() => setIsDetailsModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-white/95 backdrop-blur-xl rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/30"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 p-8 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                                <DocumentTextIcon className="h-8 w-8" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold">Chi tiết luận điểm</h2>
                                                <p className="text-blue-100 text-sm mt-1">Thông tin đầy đủ về luận điểm</p>
                                            </div>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setIsDetailsModalOpen(false)}
                                            className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
                                        >
                                            <XCircleIcon className="h-6 w-6" />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 max-h-[calc(90vh-200px)] overflow-y-auto">
                                    {detailsLoading ? (
                                        <div className="flex items-center justify-center py-16">
                                            <div className="text-center">
                                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                                <p className="text-gray-600 text-lg">Đang tải chi tiết luận điểm...</p>
                                            </div>
                                        </div>
                                    ) : argumentDetails ? (
                                        <div className="space-y-8">
                                            {/* Argument Info */}
                                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                                                <div className="flex items-start space-x-4 mb-6">
                                                    <div className="flex-shrink-0">
                                                        {argumentDetails.authorId?.avatar && argumentDetails.authorId.avatar.startsWith('http') ? (
                                                            <Image
                                                                src={argumentDetails.authorId.avatar}
                                                                alt={argumentDetails.authorId.firstName}
                                                                width={60}
                                                                height={60}
                                                                className="w-15 h-15 rounded-full object-cover border-4 border-white shadow-lg"
                                                            />
                                                        ) : (
                                                            <div className="w-15 h-15 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-lg">
                                                                {argumentDetails.authorId?.firstName?.charAt(0) || 'U'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <h3 className="text-xl font-bold text-gray-900">{argumentDetails.title}</h3>
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${argumentDetails.argumentType === 'SUPPORT' ? 'bg-green-100 text-green-800' :
                                                                argumentDetails.argumentType === 'OPPOSE' ? 'bg-red-100 text-red-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {argumentDetails.argumentType === 'SUPPORT' ? 'Ủng hộ' :
                                                                    argumentDetails.argumentType === 'OPPOSE' ? 'Phản đối' : 'Trung lập'}
                                                            </span>
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${argumentDetails.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                                argumentDetails.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                                    argumentDetails.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {argumentDetails.status === 'APPROVED' ? 'Đã duyệt' :
                                                                    argumentDetails.status === 'REJECTED' ? 'Đã từ chối' :
                                                                        argumentDetails.status === 'PENDING' ? 'Chờ duyệt' : argumentDetails.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                                            <span className="flex items-center">
                                                                <UserIcon className="h-4 w-4 mr-1" />
                                                                {argumentDetails.authorId?.firstName} {argumentDetails.authorId?.lastName}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <ClockIcon className="h-4 w-4 mr-1" />
                                                                {formatTimeAgo(argumentDetails.createdAt)}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <EyeIcon className="h-4 w-4 mr-1" />
                                                                {argumentDetails.viewCount} lượt xem
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-white rounded-xl p-4 border border-gray-200">
                                                    <p className="text-gray-800 leading-relaxed">{argumentDetails.content}</p>
                                                </div>
                                            </div>

                                            {/* Thread Info */}
                                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                    <DocumentTextIcon className="h-5 w-5 mr-2 text-purple-600" />
                                                    Thông tin chủ đề
                                                </h4>
                                                <div className="bg-white rounded-xl p-4 border border-purple-200">
                                                    <h5 className="font-semibold text-gray-900 mb-2">{argumentDetails.threadId?.title}</h5>
                                                    <p className="text-gray-600 text-sm mb-3">{argumentDetails.threadId?.description}</p>
                                                    <div className="flex items-center space-x-4">
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${argumentDetails.threadId?.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                                            argumentDetails.threadId?.status === 'CLOSED' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {argumentDetails.threadId?.status === 'ACTIVE' ? 'Đang hoạt động' :
                                                                argumentDetails.threadId?.status === 'CLOSED' ? 'Đã đóng' : argumentDetails.threadId?.status}
                                                        </span>
                                                        <span className="text-xs text-gray-500">ID: {argumentDetails.threadId?._id}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-green-600">Upvotes</p>
                                                            <p className="text-3xl font-bold text-green-700">{argumentDetails.upvotes}</p>
                                                        </div>
                                                        <HandThumbUpIcon className="h-8 w-8 text-green-600" />
                                                    </div>
                                                </div>
                                                <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-red-600">Downvotes</p>
                                                            <p className="text-3xl font-bold text-red-700">{argumentDetails.downvotes}</p>
                                                        </div>
                                                        <HandThumbDownIcon className="h-8 w-8 text-red-600" />
                                                    </div>
                                                </div>
                                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-blue-600">Score</p>
                                                            <p className={`text-3xl font-bold ${argumentDetails.score >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                                                                {argumentDetails.score}
                                                            </p>
                                                        </div>
                                                        <StarIcon className="h-8 w-8 text-blue-600" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Moderation Info */}
                                            {argumentDetails.moderatedBy && (
                                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                        <CheckCircleIcon className="h-5 w-5 mr-2 text-amber-600" />
                                                        Thông tin kiểm duyệt
                                                    </h4>
                                                    <div className="bg-white rounded-xl p-4 border border-amber-200">
                                                        <div className="flex items-center space-x-4 mb-3">
                                                            <div className="flex-shrink-0">
                                                                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                                    {argumentDetails.moderatedBy.firstName?.charAt(0) || 'M'}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    {argumentDetails.moderatedBy.firstName} {argumentDetails.moderatedBy.lastName}
                                                                </p>
                                                                <p className="text-sm text-gray-600">@{argumentDetails.moderatedBy.username}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-sm text-gray-600 mb-2">
                                                            <span className="font-medium">Kiểm duyệt lúc:</span> {formatTimeAgo(argumentDetails.moderatedAt)}
                                                        </div>
                                                        {argumentDetails.moderationNotes && (
                                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                                <p className="text-sm text-gray-700">
                                                                    <span className="font-medium">Ghi chú:</span> {argumentDetails.moderationNotes}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16">
                                            <ExclamationTriangleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500 text-lg">Không thể tải chi tiết luận điểm</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50/80 to-gray-100/80">
                                    <div className="flex justify-end">
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setIsDetailsModalOpen(false)}
                                            className="group relative overflow-hidden bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative flex items-center space-x-2">
                                                <span>Đóng</span>
                                            </div>
                                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ModerationQueuePage
