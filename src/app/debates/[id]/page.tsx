'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import {
    ArrowLeftIcon,
    EyeIcon,
    ChatBubbleLeftRightIcon,
    ClockIcon,
    UsersIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { cn } from '@/shared/utils/shadcn'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useDebateThreads } from '@/modules/debate/hooks/useDebateApi'
import { useDebateVoting } from '@/modules/debate/hooks/useDebateVoting'
import { VotingSystem } from '@/modules/debate/components/VotingSystem'
import { ArgumentCard } from '@/modules/debate/components/ArgumentCard'
import { ArgumentForm } from '@/modules/debate/components/ArgumentForm'
import { argumentApi, Argument } from '@/modules/debate/api/argumentApi'
import { DebateDebug } from '@/shared/components/debug/DebateDebug'
import { useNotificationCenter } from '@shared/providers/NotificationCenter'

const DebateDetailPage: React.FC = () => {
    const params = useParams()
    const threadId = params.id as string
    const { user } = useAuth()
    const notification = useNotificationCenter();

    const { threads, loading: threadsLoading } = useDebateThreads()
    const { stats, userVote, vote, isVoting } = useDebateVoting({
        threadId: threadId || '',
        autoRefresh: true
    })

    const [arguments_, setArguments] = useState<Argument[]>([])
    const [isLoadingArguments, setIsLoadingArguments] = useState(true)
    const [showArgumentForm, setShowArgumentForm] = useState(false)
    const [argumentFilter, setArgumentFilter] = useState<'ALL' | 'SUPPORT' | 'OPPOSE' | 'NEUTRAL'>('ALL')
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'APPROVED' | 'PENDING'>('ALL')
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most_liked'>('newest')
    const [searchQuery, setSearchQuery] = useState('')

    // Find current thread
    const currentThread = threads.find(t => t._id === threadId)

    // Debug logs
    useEffect(() => {
        console.log('DebateDetailPage mounted with threadId:', threadId)
        console.log('Available threads:', threads)
        console.log('Current thread found:', currentThread)
        console.log('Threads loading:', threadsLoading)
    }, [threadId, threads, currentThread, threadsLoading])


    // Load arguments
    const loadArguments = useCallback(async () => {
        if (!threadId) {
            console.warn('No threadId provided')
            return
        }

        setIsLoadingArguments(true)
        try {
            console.log('Loading arguments for thread:', threadId)
            const response = await argumentApi.getArguments({
                threadId,
                status: statusFilter === 'ALL' ? undefined : statusFilter,
                argumentType: argumentFilter === 'ALL' ? undefined : argumentFilter,
                search: searchQuery || undefined
            })

            console.log('Arguments response:', response)

            if (!response || !response.data || !response.data.items) {
                console.error('Invalid response structure:', response)
                setArguments([])
                return
            }

            let sortedArguments = response.data.items

            // Sort arguments
            switch (sortBy) {
                case 'newest':
                    sortedArguments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    break
                case 'oldest':
                    sortedArguments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                    break
                case 'most_liked':
                    sortedArguments.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
                    break
            }

            setArguments(sortedArguments)
        } catch (error: any) {
            console.error('Error loading arguments:', error)
            const statusCode = error?.response?.status
            const errorMessage = error?.response?.data?.message || error?.message

            // Show error notification
            if (statusCode === 500) {
                notification.showCorner({
                    type: 'error',
                    title: 'Lỗi server',
                    message: 'Lỗi server khi tải luận điểm. Vui lòng thử lại sau.',
                    duration: 5000
                })
            } else if (statusCode === 403) {
                notification.showCorner({
                    type: 'error',
                    title: 'Không có quyền',
                    message: 'Không có quyền xem luận điểm này',
                    duration: 5000
                })
            } else if (errorMessage) {
                notification.showCorner({
                    type: 'error',
                    title: 'Lỗi tải luận điểm',
                    message: errorMessage,
                    duration: 5000
                })
            }

            setArguments([]) // Set empty array on error
        } finally {
            setIsLoadingArguments(false)
        }
    }, [threadId, argumentFilter, statusFilter, sortBy, searchQuery])

    useEffect(() => {
        loadArguments()
    }, [loadArguments])

    // --- Moderation handlers ---

    // Helper function to handle API errors
    const handleModerationError = (error: any, defaultMessage: string) => {
        console.error('Moderation error:', error)

        // Parse error response
        const errorMessage = error?.response?.data?.message || error?.message || defaultMessage
        const statusCode = error?.response?.status || error?.response?.data?.statusCode || error?.statusCode

        // Handle specific error cases
        if (statusCode === 403) {
            // Translate common permission messages to Vietnamese
            let vietnameseMessage = errorMessage
            if (errorMessage?.includes('SUPPORT arguments only')) {
                vietnameseMessage = 'Bạn chỉ được phép kiểm duyệt luận điểm ỦNG HỘ'
            } else if (errorMessage?.includes('OPPOSE arguments only')) {
                vietnameseMessage = 'Bạn chỉ được phép kiểm duyệt luận điểm PHẢN ĐỐI'
            }

            notification.showCorner({
                type: 'error',
                title: 'Không có quyền',
                message: vietnameseMessage,
                duration: 3500
            })

        } else if (statusCode === 401) {
            notification.showCorner({
                type: 'error',
                title: 'Cần đăng nhập',
                message: 'Vui lòng đăng nhập để thực hiện thao tác này',
                duration: 4000
            })
        } else {
            notification.showCorner({
                type: 'error',
                title: 'Lỗi',
                message: errorMessage,
                duration: 5000
            })
        }
    }

    // Approve argument
    const handleApproveArgument = async (argumentId: string) => {
        try {
            await argumentApi.approveArgument(argumentId)
            setArguments(prev =>
                prev.map(arg =>
                    arg._id === argumentId ? { ...arg, status: 'APPROVED' } : arg
                )
            )
            notification.showCorner({
                type: 'success',
                title: 'Thành công',
                message: 'Đã phê duyệt luận điểm',
                duration: 3000
            })
        } catch (error) {
            handleModerationError(error, 'Không thể phê duyệt luận điểm')
        }
    }

    // Reject argument
    const handleRejectArgument = async (argumentId: string) => {
        try {
            await argumentApi.rejectArgument(argumentId)
            setArguments(prev =>
                prev.map(arg =>
                    arg._id === argumentId ? { ...arg, status: 'REJECTED' } : arg
                )
            )
            notification.showCorner({
                type: 'success',
                title: 'Thành công',
                message: 'Đã từ chối luận điểm',
                duration: 3000
            })
        } catch (error) {
            handleModerationError(error, 'Không thể từ chối luận điểm')
        }
    }

    // Highlight argument
    const handleHighlightArgument = async (argumentId: string) => {
        try {
            await argumentApi.highlightArgument(argumentId)
            setArguments(prev =>
                prev.map(arg =>
                    arg._id === argumentId ? { ...arg, isHighlighted: true } : arg
                )
            )
            notification.showCorner({
                type: 'success',
                title: 'Thành công',
                message: 'Đã đánh dấu luận điểm nổi bật',
                duration: 3000
            })
        } catch (error) {
            handleModerationError(error, 'Không thể đánh dấu nổi bật')
        }
    }

    // Unhighlight argument
    const handleUnhighlightArgument = async (argumentId: string) => {
        try {
            await argumentApi.unhighlightArgument(argumentId)
            setArguments(prev =>
                prev.map(arg =>
                    arg._id === argumentId ? { ...arg, isHighlighted: false } : arg
                )
            )
            notification.showCorner({
                type: 'success',
                title: 'Thành công',
                message: 'Đã bỏ đánh dấu nổi bật',
                duration: 3000
            })
        } catch (error) {
            handleModerationError(error, 'Không thể bỏ đánh dấu nổi bật')
        }
    }

    // Flag argument (new)
    const handleFlagArgument = async (argumentId: string) => {
        try {
            await argumentApi.moderateArgument({
                argumentId,
                action: 'FLAG'
            })
            notification.showCorner({
                type: 'success',
                title: 'Thành công',
                message: 'Đã đánh dấu luận điểm',
                duration: 3000
            })
            // We don't change status locally; refresh arguments list instead
            loadArguments()
        } catch (error) {
            handleModerationError(error, 'Không thể đánh dấu luận điểm')
        }
    }

    // Add feedback to argument
    const handleAddFeedback = async (argumentId: string, feedback: string) => {
        try {
            const updated = await argumentApi.addFeedback(argumentId, feedback)
            setArguments(prev =>
                prev.map(arg =>
                    arg._id === argumentId ? { ...arg, moderationNotes: updated.moderationNotes } : arg
                )
            )
            notification.showCorner({
                type: 'success',
                title: 'Thành công',
                message: 'Đã thêm phản hồi',
                duration: 3000
            })
        } catch (error) {
            handleModerationError(error, 'Không thể thêm phản hồi')
        }
    }

    // Like/dislike handlers
    const handleArgumentLike = async (argumentId: string) => {
        try {
            const response = await argumentApi.likeArgument(argumentId)
            setArguments(prev => prev.map(arg =>
                arg._id === argumentId
                    ? { ...arg, likesCount: response.likesCount, dislikesCount: response.dislikesCount }
                    : arg
            ))
        } catch (error) {
            console.error('Error liking argument:', error)
        }
    }

    const handleArgumentDislike = async (argumentId: string) => {
        try {
            const response = await argumentApi.dislikeArgument(argumentId)
            setArguments(prev => prev.map(arg =>
                arg._id === argumentId
                    ? { ...arg, likesCount: response.likesCount, dislikesCount: response.dislikesCount }
                    : arg
            ))
        } catch (error) {
            console.error('Error disliking argument:', error)
        }
    }

    // Argument submit
    const handleArgumentSubmit = async (data: any) => {
        try {
            // Kiểm tra xem user đã vote chưa (phải vote SUPPORT hoặc OPPOSE)
            if (!userVote) {
                notification.showCorner({
                    type: 'warning',
                    title: 'Cần vote trước',
                    message: 'Bạn cần bình chọn Ủng hộ hoặc Phản đối trước khi đóng góp luận điểm',
                    duration: 4000
                })
                return
            }

            const newArgument = await argumentApi.createArgument(data)
            setArguments(prev => [newArgument, ...prev])
            setShowArgumentForm(false)
            notification.showCorner({
                type: 'success',
                title: 'Thành công',
                message: 'Đã thêm luận điểm thành công',
                duration: 3000
            })
        } catch (error: any) {
            console.error('Error creating argument:', error)

            // Parse error response for better user feedback
            const errorResponse = error?.response?.data
            let errorMessage = 'Không thể tạo luận điểm'

            if (errorResponse?.message) {
                if (Array.isArray(errorResponse.message)) {
                    // Handle validation errors array
                    errorMessage = errorResponse.message.join(', ')
                } else {
                    errorMessage = errorResponse.message
                }
            } else if (error?.message) {
                errorMessage = error.message
            }

            // Show specific error for evidenceUrls validation
            if (errorMessage.includes('evidenceUrls') && errorMessage.includes('URL address')) {
                notification.showCorner({
                    type: 'error',
                    title: 'Lỗi tài liệu bằng chứng',
                    message: 'Vui lòng nhập URL đúng định dạng',
                    duration: 5000
                })
            } else if (errorMessage.includes('each value in evidenceUrls must be a URL address')) {
                notification.showCorner({
                    type: 'error',
                    title: 'Lỗi tài liệu bằng chứng',
                    message: 'Tất cả URL phải có định dạng hợp lệ',
                    duration: 5000
                })
            } else {
                notification.showCorner({
                    type: 'error',
                    title: 'Lỗi tạo luận điểm',
                    message: errorMessage,
                    duration: 5000
                })
            }
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

    // Filter arguments
    const filteredArguments = arguments_.filter(arg => {
        const matchesFilter = argumentFilter === 'ALL' || arg.argumentType === argumentFilter

        // Status filter logic - USER can see all statuses, but only MODERATOR/ADMIN can filter by status
        let matchesStatus = true
        if (user?.role === 'USER') {
            // USER sees all statuses (APPROVED, PENDING, REJECTED, etc.)
            matchesStatus = true
        } else {
            // MODERATOR/ADMIN can filter by status
            matchesStatus = statusFilter === 'ALL' || arg.status === statusFilter
        }

        const matchesSearch = !searchQuery ||
            arg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            arg.content.toLowerCase().includes(searchQuery.toLowerCase())
        // Chỉ hiển thị các argument không có parentArgumentId (argument chính)
        const isMainArgument = !arg.parentArgumentId

        return matchesFilter && matchesStatus && matchesSearch && isMainArgument
    })

    if (threadsLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl"
                >
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <div>
                            <h3 className="font-semibold text-gray-900">Đang tải...</h3>
                            <p className="text-sm text-gray-600">Đang tải thông tin tranh luận</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }

    if (!threadsLoading && !currentThread) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl text-center"
                >
                    <h3 className="font-semibold text-gray-900 mb-2">Không tìm thấy tranh luận</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Tranh luận này có thể đã bị xóa hoặc không tồn tại. (Thread ID: {threadId})
                    </p>
                    <Link
                        href="/debates"
                        className="inline-flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        <span>Quay lại danh sách</span>
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="border-b border-gray-200 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/debates"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 line-clamp-1">
                                    {currentThread?.title || 'Đang tải...'}
                                </h1>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                    {/* <div className="flex items-center space-x-1">
                                        <EyeIcon className="h-4 w-4" />
                                        <span>0 lượt xem</span>
                                    </div> */}
                                    <div className="flex items-center space-x-1">
                                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                        <span>{arguments_.length} luận điểm</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <ClockIcon className="h-4 w-4" />
                                        <span>{currentThread?.createdAt ? formatRelativeTime(currentThread.createdAt) : 'Không rõ'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className={cn(
                                "px-3 py-1 text-xs font-medium rounded-full",
                                currentThread?.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                    currentThread?.status === 'CLOSED' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                            )}>
                                {currentThread?.status === 'ACTIVE' ? 'Đang hoạt động' :
                                    currentThread?.status === 'CLOSED' ? 'Đã đóng' : 'Chờ duyệt'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Thread Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                        >
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mô tả tranh luận</h2>
                            <p className="text-gray-700 leading-relaxed">
                                {currentThread?.description || 'Không có mô tả chi tiết.'}
                            </p>
                        </motion.div>

                        {/* Voting System */}
                        {threadId && stats && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                            >
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Bình chọn của cộng đồng</h2>
                                <VotingSystem
                                    threadId={threadId}
                                    stats={stats!}
                                    userVote={userVote?.voteType || null}
                                    onVote={vote}
                                    isLoading={isVoting}
                                    disabled={!user}
                                    showDetailedStats={true}
                                />
                                {!user && (
                                    <p className="text-center text-sm text-gray-500 mt-4">
                                        <Link href="/login" className="text-blue-600 hover:underline">
                                            Đăng nhập
                                        </Link> để tham gia bình chọn
                                    </p>
                                )}
                            </motion.div>
                        )}

                        {/* Arguments Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl shadow-lg border border-gray-200"
                        >
                            {/* Arguments Header */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Luận điểm ({filteredArguments.length})
                                    </h2>
                                    {user && (
                                        <div className="relative group">
                                            <motion.button
                                                onClick={() => {
                                                    // Check if user has voted
                                                    if (!userVote) {
                                                        notification.showCorner({
                                                            type: 'warning',
                                                            title: 'Cần vote trước',
                                                            message: 'Bạn cần bình chọn Ủng hộ hoặc Phản đối trước khi đóng góp luận điểm',
                                                            duration: 4000
                                                        })
                                                        return
                                                    }
                                                    setShowArgumentForm(!showArgumentForm)
                                                }}
                                                className={cn(
                                                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors",
                                                    !userVote
                                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                                )}
                                                whileHover={{ scale: !userVote ? 1 : 1.05 }}
                                                whileTap={{ scale: !userVote ? 1 : 0.95 }}
                                            >
                                                <PlusIcon className="h-4 w-4" />
                                                <span>Thêm luận điểm</span>
                                            </motion.button>

                                            {/* Tooltip khi chưa vote */}
                                            {!userVote && (
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                    Vote trước khi thêm luận điểm
                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                                        <div className="border-4 border-transparent border-t-gray-900"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Search and Filters */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Search */}
                                    <div className="relative flex-1">
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm luận điểm..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* Filters */}
                                    <div className="flex flex-wrap gap-2">
                                        <select
                                            value={argumentFilter}
                                            onChange={(e) => setArgumentFilter(e.target.value as any)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="ALL">Tất cả loại</option>
                                            <option value="SUPPORT">Ủng hộ</option>
                                            <option value="OPPOSE">Phản đối</option>
                                            <option value="NEUTRAL">Trung lập</option>
                                        </select>

                                        {/* Status filter - only show for MODERATOR/ADMIN */}
                                        {(user?.role === 'MODERATOR' || user?.role === 'ADMIN') && (
                                            <select
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="ALL">Tất cả trạng thái</option>
                                                <option value="APPROVED">Đã duyệt</option>
                                                <option value="PENDING">Chờ duyệt</option>
                                            </select>
                                        )}

                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as any)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="newest">Mới nhất</option>
                                            <option value="oldest">Cũ nhất</option>
                                            <option value="most_liked">Được thích nhất</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Argument Form */}
                            <AnimatePresence>
                                {showArgumentForm && user && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-6 border-b border-gray-200"
                                    >
                                        <ArgumentForm
                                            threadId={threadId}
                                            onSubmit={handleArgumentSubmit}
                                            onCancel={() => setShowArgumentForm(false)}
                                            openOnMount
                                            defaultArgumentType={userVote?.voteType || 'NEUTRAL'}
                                            onTeamChange={(type) => {
                                                // Sync user's vote to selected team when they choose different team
                                                if (!user) return
                                                if (type === 'NEUTRAL') return
                                                vote({ threadId, voteType: type })
                                            }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Arguments List */}
                            <div className="p-6">
                                {isLoadingArguments ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                            <span className="text-gray-600">Đang tải luận điểm...</span>
                                        </div>
                                    </div>
                                ) : filteredArguments.length === 0 ? (
                                    <div className="text-center py-12">
                                        <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có luận điểm</h3>
                                        <p className="text-gray-600 mb-4">
                                            {user ? 'Hãy là người đầu tiên đóng góp luận điểm cho cuộc tranh luận này.' : 'Đăng nhập để thêm luận điểm đầu tiên.'}
                                        </p>
                                        {user && (
                                            <div className="relative group inline-block">
                                                <motion.button
                                                    onClick={() => {
                                                        // Check if user has voted
                                                        if (!userVote) {
                                                            notification.showCorner({
                                                                type: 'warning',
                                                                title: 'Cần vote trước',
                                                                message: '💥 Bạn cần bình chọn Ủng hộ hoặc Phản đối trước khi đóng góp luận điểm',
                                                                duration: 4000
                                                            })
                                                            return
                                                        }
                                                        setShowArgumentForm(true)
                                                    }}
                                                    className={cn(
                                                        "px-6 py-2 rounded-lg transition-colors",
                                                        !userVote
                                                            ? "bg-gray-400 text-white cursor-not-allowed"
                                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                                    )}
                                                    whileHover={{ scale: !userVote ? 1 : 1.05 }}
                                                    whileTap={{ scale: !userVote ? 1 : 0.95 }}
                                                >
                                                    Thêm luận điểm đầu tiên
                                                </motion.button>

                                                {/* Tooltip khi chưa vote */}
                                                {!userVote && (
                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                                        💥 Vote trước khi thêm luận điểm
                                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                                            <div className="border-4 border-transparent border-t-gray-900"></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <AnimatePresence>
                                            {filteredArguments.map((argument, index) => {
                                                // Determine if current user is moderator/admin
                                                const isModerator = user?.role === 'MODERATOR' || user?.role === 'ADMIN'
                                                // Only show approve/reject/highlight/unhighlight for correct side:
                                                // - Only show approve/reject for arguments of the same team as the moderator's vote (if any)
                                                // - Only show highlight/unhighlight for approved arguments
                                                // - Only allow add feedback if not highlighted
                                                // - Hide approve/reject for arguments of the opposite team
                                                let canModerate = false
                                                let canApproveReject = false
                                                let canHighlight = false
                                                let canUnhighlight = false
                                                let canAddFeedback = false

                                                if (isModerator) {
                                                    // Admins can moderate all arguments
                                                    const isAdmin = user?.role === 'ADMIN'

                                                    // For now, allow moderators to moderate any arguments
                                                    // TODO: Implement proper moderator assignment system based on thread.modForSideA/modForSideB
                                                    const canModerateArgument = isAdmin || true // All moderators can moderate all arguments for now

                                                    if (canModerateArgument) {
                                                        // Allow approve/reject for pending arguments
                                                        if (argument.status === 'PENDING') {
                                                            canApproveReject = true
                                                        }

                                                        // Allow highlight/unhighlight for approved arguments
                                                        if (argument.status === 'APPROVED') {
                                                            if (!argument.isHighlighted) {
                                                                canHighlight = true
                                                            } else {
                                                                canUnhighlight = true
                                                            }
                                                        }

                                                        // Allow add feedback for approved arguments (both highlighted and non-highlighted)
                                                        if (argument.status === 'APPROVED') {
                                                            canAddFeedback = true
                                                        }
                                                    }

                                                    canModerate = canApproveReject || canHighlight || canUnhighlight || canAddFeedback
                                                }

                                                return (
                                                    <motion.div
                                                        key={argument._id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ delay: index * 0.1 }}
                                                    >
                                                        <ArgumentCard
                                                            argument={argument}
                                                            onLike={handleArgumentLike}
                                                            onDislike={handleArgumentDislike}
                                                            currentUserRole={user?.role as 'USER' | 'MODERATOR' | 'ADMIN' || 'USER'}
                                                            showModerationActions={canModerate}
                                                            onModerate={(argumentId, action, notes) => {
                                                                switch (action) {
                                                                    case 'APPROVE':
                                                                        handleApproveArgument(argumentId)
                                                                        break
                                                                    case 'REJECT':
                                                                        handleRejectArgument(argumentId)
                                                                        break
                                                                    case 'HIGHLIGHT':
                                                                        handleHighlightArgument(argumentId)
                                                                        break
                                                                    case 'UNHIGHLIGHT':
                                                                        handleUnhighlightArgument(argumentId)
                                                                        break
                                                                    case 'FLAG': // new case
                                                                        handleFlagArgument(argumentId)
                                                                        break
                                                                    case 'ADD_FEEDBACK':
                                                                        if (notes) handleAddFeedback(argumentId, notes)
                                                                        break
                                                                }
                                                            }}
                                                            currentUser={user}
                                                        />
                                                    </motion.div>
                                                )
                                            })}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Thread Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tranh luận</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold overflow-hidden bg-gray-200">
                                        {currentThread?.createdBy?.avatar && currentThread?.createdBy?.avatar.startsWith('http') ? (
                                            <img
                                                src={currentThread.createdBy.avatar}
                                                alt={`${currentThread?.createdBy?.firstName || ''} ${currentThread?.createdBy?.lastName || ''}`.trim() || 'User'}
                                                className="w-8 h-8 object-cover rounded-full"
                                            />
                                        ) : (
                                            currentThread?.createdBy?.lastName?.[0] ||
                                            currentThread?.createdBy?.firstName?.[0] ||
                                            '👤'
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {currentThread?.createdBy?.firstName} {currentThread?.createdBy?.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500">Người tạo</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Ngày tạo:</span>
                                        <span className="text-gray-900">
                                            {currentThread?.createdAt ? new Date(currentThread.createdAt).toLocaleDateString('vi-VN') : 'Không rõ'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Cập nhật:</span>
                                        <span className="text-gray-900">
                                            {currentThread?.updatedAt ? formatRelativeTime(currentThread.updatedAt) : 'Không rõ'}
                                        </span>
                                    </div>
                                    {/* <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Lượt xem:</span>
                                        <span className="text-gray-900">0</span>
                                    </div> */}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Luận điểm:</span>
                                        <span className="text-gray-900">{arguments_.length}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Stats */}
                        {stats && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhanh</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <UsersIcon className="h-5 w-5 text-blue-500" />
                                            <span className="text-sm text-gray-600">Tổng bình chọn</span>
                                        </div>
                                        <span className="text-lg font-bold text-gray-900">{stats?.totalVotes || 0}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-green-500">👍</span>
                                            <span className="text-sm text-gray-600">Ủng hộ</span>
                                        </div>
                                        <span className="text-lg font-bold text-green-600">{stats?.support || 0}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-red-500">👎</span>
                                            <span className="text-sm text-gray-600">Phản đối</span>
                                        </div>
                                        <span className="text-lg font-bold text-red-600">{stats?.oppose || 0}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Related Threads */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tranh luận liên quan</h3>
                            <div className="space-y-3">
                                {threads.filter(t => t._id !== threadId && t.status === 'ACTIVE').slice(0, 3).map((thread) => (
                                    <Link
                                        key={thread._id}
                                        href={`/debates/${thread._id}`}
                                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                                            {thread.title}
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                            {thread.totalArguments || 0} luận điểm • {formatRelativeTime(thread.createdAt)}
                                        </p>
                                    </Link>
                                ))}
                                {threads.filter(t => t._id !== threadId && t.status === 'ACTIVE').length === 0 && (
                                    <p className="text-sm text-gray-500 text-center py-4">
                                        Không có tranh luận liên quan nào đang hoạt động
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Debug Component */}
            <DebateDebug
                threadId={threadId}
                threads={threads}
                currentThread={currentThread}
                isLoading={threadsLoading || isLoadingArguments}
                arguments_={arguments_}
                error={null}
            />
        </div>
    )
}

export default DebateDetailPage