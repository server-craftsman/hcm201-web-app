'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import {
    ArrowLeftIcon,
    EyeIcon,
    ChatBubbleLeftRightIcon,
    ClockIcon,
    UsersIcon,
    FireIcon,
    CheckBadgeIcon,
    ExclamationTriangleIcon,
    FunnelIcon,
    AdjustmentsHorizontalIcon,
    PlusIcon,
    MagnifyingGlassIcon
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

const DebateDetailPage: React.FC = () => {
    const params = useParams()
    const threadId = params.id as string
    const { user } = useAuth()

    const { threads, loading: threadsLoading } = useDebateThreads()
    const { stats, userVote, vote, isVoting } = useDebateVoting({
        threadId: threadId || '',
        autoRefresh: true
    })

    const [arguments_, setArguments] = useState<Argument[]>([])
    const [isLoadingArguments, setIsLoadingArguments] = useState(true)
    const [showArgumentForm, setShowArgumentForm] = useState(false)
    const [argumentFilter, setArgumentFilter] = useState<'ALL' | 'SUPPORT' | 'OPPOSE' | 'NEUTRAL'>('ALL')
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'APPROVED' | 'PENDING'>('APPROVED')
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
    useEffect(() => {
        const loadArguments = async () => {
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
            } catch (error) {
                console.error('Error loading arguments:', error)
                setArguments([]) // Set empty array on error
            } finally {
                setIsLoadingArguments(false)
            }
        }

        loadArguments()
    }, [threadId, argumentFilter, statusFilter, sortBy, searchQuery])

    const handleArgumentSubmit = async (data: any) => {
        try {
            const newArgument = await argumentApi.createArgument(data)
            setArguments(prev => [newArgument, ...prev])
            setShowArgumentForm(false)
        } catch (error) {
            console.error('Error creating argument:', error)
        }
    }

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

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

        if (diffInMinutes < 1) return 'Vừa xong'
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
        return `${Math.floor(diffInMinutes / 1440)} ngày trước`
    }

    const filteredArguments = arguments_.filter(arg => {
        const matchesFilter = argumentFilter === 'ALL' || arg.argumentType === argumentFilter
        const matchesStatus = statusFilter === 'ALL' || arg.status === statusFilter
        const matchesSearch = !searchQuery ||
            arg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            arg.content.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesFilter && matchesStatus && matchesSearch
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
                                    <div className="flex items-center space-x-1">
                                        <EyeIcon className="h-4 w-4" />
                                        <span>0 lượt xem</span>
                                    </div>
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
                                        <motion.button
                                            onClick={() => setShowArgumentForm(!showArgumentForm)}
                                            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <PlusIcon className="h-4 w-4" />
                                            <span>Thêm luận điểm</span>
                                        </motion.button>
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
                                    <div className="flex space-x-2">
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

                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value as any)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="APPROVED">Đã duyệt</option>
                                            <option value="ALL">Tất cả trạng thái</option>
                                            <option value="PENDING">Chờ duyệt</option>
                                        </select>

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
                                            <motion.button
                                                onClick={() => setShowArgumentForm(true)}
                                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Thêm luận điểm đầu tiên
                                            </motion.button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <AnimatePresence>
                                            {filteredArguments.map((argument, index) => (
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
                                                        showModerationActions={user?.role === 'MODERATOR' || user?.role === 'ADMIN'}
                                                    />
                                                </motion.div>
                                            ))}
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
                                    <div className="w-8 h-8 hcm-gradient-luxury rounded-full flex items-center justify-center text-white text-sm font-bold">
                                        {currentThread?.createdBy?.lastName?.[0] || currentThread?.createdBy?.firstName?.[0] || '👤'}
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
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Lượt xem:</span>
                                        <span className="text-gray-900">0</span>
                                    </div>
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