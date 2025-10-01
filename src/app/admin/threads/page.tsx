'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
    ShieldCheckIcon,
    PlusCircleIcon,
    UserGroupIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    PauseIcon,
    PlayIcon,
    ArchiveBoxIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline'
import { threadApi } from '@/modules/debate/api/threadApi'
import { debateApi } from '@/modules/debate/api/debateApi'
import { apiClient } from '@/core/utils/api'
import { toast, Toaster } from 'react-hot-toast'

const AdminThreadsPage = () => {
    const router = useRouter()
    const [selectedTab, setSelectedTab] = useState('DRAFT')
    const [selectedThread, setSelectedThread] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedModerators, setSelectedModerators] = useState({ sideA: '', sideB: '' })
    const [loading, setLoading] = useState(false)
    const [threads, setThreads] = useState<any[]>([])
    const [threadStats, setThreadStats] = useState({ pending: 0, active: 0, paused: 0, closed: 0, archived: 0 })
    const [availableModerators, setAvailableModerators] = useState<any[]>([])
    const [loadingModerators, setLoadingModerators] = useState(false)
    const [rejectModalOpen, setRejectModalOpen] = useState(false)
    const [rejectReason, setRejectReason] = useState('')
    const [threadToReject, setThreadToReject] = useState<string | null>(null)

    const loadModerators = async () => {
        try {
            setLoadingModerators(true)
            const response = await apiClient.get('/users', {
                params: {
                    role: 'MODERATOR',
                    page: 1,
                    limit: 50,
                    status: 'ONLINE'
                }
            })

            const apiModerators = response.data.data.items.map((mod: any) => ({
                id: mod._id,
                name: `${mod.firstName} ${mod.lastName}`,
                username: mod.username,
                email: mod.email,
                avatar: mod.avatar,
                specialty: 'Kiểm duyệt chuyên nghiệp',
                workload: mod.workload || 0,
                status: mod.status || 'ONLINE',
                lastActive: mod.lastActive || new Date().toISOString(),
                experience: mod.experience || 0,
                rating: mod.rating || '0.0'
            }))

            setAvailableModerators(apiModerators)
        } catch (error) {
            console.error('Failed to load moderators:', error)
            setAvailableModerators([])
        } finally {
            setLoadingModerators(false)
        }
    }

    const loadData = async (tab: string) => {
        try {
            setLoading(true)

            // Load thread statistics first
            try {
                const statsRes = await debateApi.getThreadStats()
                const stats = statsRes.data
                setThreadStats({
                    pending: stats.pending || 0,
                    active: stats.active || 0,
                    paused: stats.paused || 0,
                    closed: stats.closed || 0,
                    archived: stats.archived || 0
                })
                console.log('📊 Thread stats loaded:', stats)
            } catch (statsError) {
                console.warn('Failed to load thread stats:', statsError)
                // Keep existing stats if API fails
            }

            if (tab === 'pending') {
                const res = await threadApi.getThreadRequests(1, 20, 'DRAFT')
                const items = res.data.items.map((r) => ({
                    id: r._id,
                    title: r.title,
                    description: r.description,
                    author: { name: `${r.requester?.firstName || ''} ${r.requester?.lastName || ''}`.trim() || r.requester?.username || 'User', avatar: (r.requester?.firstName || 'U').slice(0, 1).toUpperCase(), reputation: 0 },
                    status: 'DRAFT',
                    priority: 'MEDIUM',
                    createdAt: r.createdAt,
                    relatedTopics: [],
                    assignedModerators: null
                }))
                setThreads(items)
            } else {
                // Map tab names to API status values
                const statusMap: { [key: string]: string } = {
                    'active': 'ACTIVE',
                    'paused': 'PAUSED',
                    'closed': 'CLOSED',
                    'archived': 'ARCHIVED'
                }
                const apiStatus = statusMap[tab] || 'ACTIVE'

                const res = await debateApi.getDebateThreads({
                    status: apiStatus as any,
                    page: 1,
                    limit: 20,
                    search: '',
                    sort: 'createdAt:-1'
                })
                const items = res.data.items.map((t) => ({
                    id: t._id,
                    title: t.title,
                    description: t.description,
                    author: { name: `${t.createdBy?.firstName || ''} ${t.createdBy?.lastName || ''}`.trim() || t.createdBy?.username || 'User', avatar: (t.createdBy?.firstName || 'U').slice(0, 1).toUpperCase(), reputation: 0 },
                    status: t.status,
                    priority: 'LOW',
                    createdAt: t.createdAt,
                    relatedTopics: [],
                    assignedModerators: (t.modForSideA || t.modForSideB) ? { sideA: { id: t.modForSideA, name: 'Mod A' }, sideB: { id: t.modForSideB, name: 'Mod B' } } : null,
                    stats: {
                        arguments: t.totalArguments,
                        votes: t.totalVotes,
                        participants: t.totalVotes,
                        pendingModeration: t.requireModeration ? (t.totalArguments - t.totalApprovedArguments) : 0
                    }
                }))
                setThreads(items)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData(selectedTab)
        loadModerators()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTab])

    const filteredThreads = threads.filter(thread => {
        switch (selectedTab) {
            case 'pending':
                return thread.status === 'DRAFT'
            case 'active':
                return thread.status === 'ACTIVE'
            case 'paused':
                return thread.status === 'PAUSED'
            case 'closed':
                return thread.status === 'CLOSED'
            case 'archived':
                return thread.status === 'ARCHIVED'
            default:
                return true
        }
    })

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PENDING':
            case 'DRAFT':
                return 'bg-yellow-100 text-yellow-800'
            case 'ACTIVE':
                return 'bg-green-100 text-green-800'
            case 'PAUSED':
                return 'bg-orange-100 text-orange-800'
            case 'CLOSED':
                return 'bg-red-100 text-red-800'
            case 'ARCHIVED':
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

    const handleApproveThread = async (threadId: string | number) => {
        if (!selectedModerators.sideA || !selectedModerators.sideB) {
            toast.error('Vui lòng chọn 2 kiểm duyệt viên cho thread này', {
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
                icon: '⚠️'
            })
            return
        }
        try {
            await debateApi.approveThreadRequest(String(threadId), {
                modForSideA: selectedModerators.sideA,
                modForSideB: selectedModerators.sideB
            })
            await loadData('pending')
            await refreshStats()
            toast.success('Duyệt thread thành công!', {
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
        } catch (e) {
            console.error(e)
            toast.error('Lỗi khi duyệt thread: ' + ((e as any)?.response?.data?.message || e), {
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
                icon: '❌'
            })
        }
        setIsModalOpen(false)
        setSelectedThread(null)
        setSelectedModerators({ sideA: '', sideB: '' })
    }

    const handleThreadAction = async (threadId: string | number, action: string) => {
        try {
            let status = ''
            let reason = ''
            let successMessage = ''

            switch (action) {
                case 'REJECT':
                    // Open reject modal instead of direct action
                    setThreadToReject(String(threadId))
                    setRejectModalOpen(true)
                    return
                case 'PAUSE':
                    status = 'PAUSED'
                    reason = 'Tạm dừng để kiểm tra và điều chỉnh nội dung'
                    successMessage = '⏸️ Tạm dừng thread thành công!'
                    break
                case 'RESUME':
                    status = 'ACTIVE'
                    reason = 'Tiếp tục hoạt động sau khi kiểm tra'
                    successMessage = '▶️ Tiếp tục thread thành công!'
                    break
                case 'CLOSE':
                    status = 'CLOSED'
                    reason = 'Đóng thread do vi phạm quy định hoặc kết thúc thời gian'
                    successMessage = '🔒 Đóng thread thành công!'
                    break
                default:
                    throw new Error(`Unknown action: ${action}`)
            }

            await debateApi.updateThreadStatus(String(threadId), status, reason)
            await loadData(selectedTab)
            await refreshStats()

            // Show success toast based on action
            const toastConfig = {
                duration: 3000,
                style: {
                    background: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500'
                }
            }

            switch (action) {
                case 'PAUSE':
                    toast.success('Tạm dừng thread thành công!', { ...toastConfig, icon: '⏸️' })
                    break
                case 'RESUME':
                    toast.success('Tiếp tục thread thành công!', { ...toastConfig, icon: '▶️' })
                    break
                case 'CLOSE':
                    toast.success('Đóng thread thành công!', { ...toastConfig, icon: '🔒' })
                    break
            }
        } catch (e) {
            console.error(e)
            toast.error('Lỗi khi thực hiện hành động: ' + ((e as any)?.response?.data?.message || e), {
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
                icon: '❌'
            })
        }
    }

    const handleRejectThread = async () => {
        if (!threadToReject || !rejectReason.trim()) {
            toast.error('Vui lòng nhập lý do từ chối', {
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
                icon: '⚠️'
            })
            return
        }
        try {
            await debateApi.updateThreadStatus(threadToReject, 'REJECTED', rejectReason.trim())
            await loadData(selectedTab)
            await refreshStats()
            toast.success('Từ chối thread thành công!', {
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
            setRejectModalOpen(false)
            setRejectReason('')
            setThreadToReject(null)
        } catch (e) {
            console.error(e)
            toast.error('Lỗi khi từ chối thread: ' + ((e as any)?.response?.data?.message || e), {
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
                icon: '❌'
            })
        }
    }

    const openApprovalModal = (thread: any) => {
        setSelectedThread(thread)
        setIsModalOpen(true)
    }

    const handleViewThreadDetails = (threadId: string) => {
        router.push(`/debates/${threadId}`)
    }

    const refreshStats = async () => {
        try {
            const statsRes = await debateApi.getThreadStats()
            const stats = statsRes.data
            setThreadStats({
                pending: stats.pending || 0,
                active: stats.active || 0,
                paused: stats.paused || 0,
                closed: stats.closed || 0,
                archived: stats.archived || 0
            })
            console.log('📊 Stats refreshed:', stats)
        } catch (error) {
            console.warn('Failed to refresh stats:', error)
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
                                🛡️ Quản lý chủ đề tranh luận
                            </h1>
                            <p className="text-gray-600">
                                Duyệt, quản lý và giám sát các chủ đề tranh luận trong hệ thống
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={refreshStats}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <ArrowPathIcon className="h-4 w-4 mr-2" />
                            Làm mới thống kê
                        </motion.button>
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                                <p className="text-2xl font-bold text-yellow-600">{threadStats.pending}</p>
                            </div>
                            <ClockIcon className="h-8 w-8 text-yellow-600" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                                <p className="text-2xl font-bold text-green-600">{threadStats.active}</p>
                            </div>
                            <PlayIcon className="h-8 w-8 text-green-600" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tạm dừng</p>
                                <p className="text-2xl font-bold text-orange-600">{threadStats.paused}</p>
                            </div>
                            <PauseIcon className="h-8 w-8 text-orange-600" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Đã đóng</p>
                                <p className="text-2xl font-bold text-red-600">{threadStats.closed}</p>
                            </div>
                            <XCircleIcon className="h-8 w-8 text-red-600" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Lưu trữ</p>
                                <p className="text-2xl font-bold text-gray-600">{threadStats.archived}</p>
                            </div>
                            <ArchiveBoxIcon className="h-8 w-8 text-gray-600" />
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {[
                                { id: 'pending', label: 'Chờ duyệt', count: threadStats.pending },
                                { id: 'active', label: 'Đang hoạt động', count: threadStats.active },
                                { id: 'paused', label: 'Tạm dừng', count: threadStats.paused },
                                { id: 'closed', label: 'Đã đóng', count: threadStats.closed },
                                { id: 'archived', label: 'Lưu trữ', count: threadStats.archived }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedTab(tab.id)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${selectedTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.label} ({tab.count})
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Threads List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-6"
                >
                    {loading && (
                        <div className="bg-white rounded-xl border p-6 text-gray-600">Đang tải...</div>
                    )}
                    {!loading && filteredThreads.map((thread) => (
                        <div key={thread.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h4 className="text-lg font-semibold text-gray-900">{thread.title}</h4>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(thread.status)}`}>
                                            {thread.status === 'DRAFT' ? 'Chờ duyệt' :
                                                thread.status === 'ACTIVE' ? 'Đang hoạt động' :
                                                    thread.status === 'PAUSED' ? 'Tạm dừng' :
                                                        thread.status === 'CLOSED' ? 'Đã đóng' : 'Lưu trữ'}
                                        </span>
                                        {thread.priority === 'HIGH' && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                                                Ưu tiên cao
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 mb-3">
                                        {thread.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">{formatTimeAgo(thread.createdAt)}</p>
                                    <p className="text-xs text-gray-400">~ {thread.estimatedParticipants} người tham gia</p>
                                </div>
                            </div>

                            {/* Author & Topics */}
                            <div className="mb-4">
                                <div className="flex items-center space-x-4 mb-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            {thread.author.avatar}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{thread.author.name}</p>
                                            <p className="text-xs text-gray-500">Đề xuất bởi • {thread.author.reputation} điểm</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {thread.relatedTopics.map((topic: string, index: number) => (
                                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Moderators */}
                            {thread.assignedModerators && (
                                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                                    <p className="text-sm font-medium text-green-800 mb-2">Kiểm duyệt viên được phân công:</p>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-green-700">Bên A:</span>
                                            <span className="text-sm font-medium text-green-900">
                                                {thread.assignedModerators.sideA.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-green-700">Bên B:</span>
                                            <span className="text-sm font-medium text-green-900">
                                                {thread.assignedModerators.sideB.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Stats for active threads */}
                            {thread.stats && (
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                    <div className="grid grid-cols-4 gap-4 text-center">
                                        <div>
                                            <p className="text-lg font-bold text-blue-900">{thread.stats.arguments}</p>
                                            <p className="text-xs text-blue-700">Luận điểm</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-blue-900">{thread.stats.votes}</p>
                                            <p className="text-xs text-blue-700">Bình chọn</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-blue-900">{thread.stats.participants}</p>
                                            <p className="text-xs text-blue-700">Người tham gia</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-orange-900">{thread.stats.pendingModeration}</p>
                                            <p className="text-xs text-orange-700">Chờ kiểm duyệt</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Pause reason */}
                            {thread.status === 'PAUSED' && thread.pauseReason && (
                                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                    <p className="text-sm text-orange-800">
                                        <strong>Lý do tạm dừng:</strong> {thread.pauseReason}
                                    </p>
                                </div>
                            )}

                            {/* Closed status info */}
                            {thread.status === 'CLOSED' && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-800">
                                        <strong>Trạng thái:</strong> Thread đã được đóng và không thể hoạt động trở lại
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                {thread.status === 'DRAFT' ? (
                                    <div className="flex items-center space-x-3">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => openApprovalModal(thread)}
                                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                                            Duyệt & Phân công
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleThreadAction(thread.id, 'REJECT')}
                                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            <XCircleIcon className="h-4 w-4 mr-1" />
                                            Từ chối
                                        </motion.button>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        {thread.status === 'ACTIVE' && (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleThreadAction(thread.id, 'PAUSE')}
                                                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                                            >
                                                <PauseIcon className="h-4 w-4 mr-1" />
                                                Tạm dừng
                                            </motion.button>
                                        )}
                                        {thread.status === 'PAUSED' && (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleThreadAction(thread.id, 'RESUME')}
                                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <PlayIcon className="h-4 w-4 mr-1" />
                                                Tiếp tục
                                            </motion.button>
                                        )}
                                        {thread.status !== 'CLOSED' && (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleThreadAction(thread.id, 'CLOSE')}
                                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                            >
                                                <XCircleIcon className="h-4 w-4 mr-1" />
                                                Đóng
                                            </motion.button>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center space-x-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleViewThreadDetails(thread.id)}
                                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <EyeIcon className="h-4 w-4 mr-1" />
                                        Xem chi tiết
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Approval Modal */}
                <AnimatePresence>
                    {isModalOpen && selectedThread && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white/95 backdrop-blur-md rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Duyệt và phân công kiểm duyệt viên
                                    </h3>
                                    <p className="text-gray-600 mt-1">
                                        {selectedThread.title}
                                    </p>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-8">
                                        {/* Moderator Selection for Side A */}
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">A</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900">Bên A - Ủng hộ</h4>
                                                    <p className="text-sm text-gray-600">Chọn kiểm duyệt viên cho phe ủng hộ</p>
                                                </div>
                                            </div>

                                            {loadingModerators ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                        <span className="text-gray-600">Đang tải danh sách kiểm duyệt viên...</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <select
                                                        value={selectedModerators.sideA}
                                                        onChange={(e) => setSelectedModerators({ ...selectedModerators, sideA: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Chọn kiểm duyệt viên cho bên A...</option>
                                                        {availableModerators.map((mod) => (
                                                            <option
                                                                key={mod.id}
                                                                value={mod.id}
                                                                disabled={mod.id === selectedModerators.sideB}
                                                            >
                                                                {mod.name} (@{mod.username}) - ⭐{mod.rating} - 📊{mod.workload} việc - {mod.status === 'ONLINE' ? '🟢 Trực tuyến' : '⚫ Ngoại tuyến'}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Moderator Selection for Side B */}
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">B</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900">Bên B - Phản đối</h4>
                                                    <p className="text-sm text-gray-600">Chọn kiểm duyệt viên cho phe phản đối</p>
                                                </div>
                                            </div>

                                            {loadingModerators ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                        <span className="text-gray-600">Đang tải danh sách kiểm duyệt viên...</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <select
                                                        value={selectedModerators.sideB}
                                                        onChange={(e) => setSelectedModerators({ ...selectedModerators, sideB: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Chọn kiểm duyệt viên cho bên B...</option>
                                                        {availableModerators.map((mod) => (
                                                            <option
                                                                key={mod.id}
                                                                value={mod.id}
                                                                disabled={mod.id === selectedModerators.sideA}
                                                            >
                                                                {mod.name} (@{mod.username}) - ⭐{mod.rating} - 📊{mod.workload} việc - {mod.status === 'ONLINE' ? '🟢 Trực tuyến' : '⚫ Ngoại tuyến'}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-sm text-blue-800">
                                                <strong>Lưu ý:</strong> Mỗi kiểm duyệt viên sẽ chịu trách nhiệm kiểm duyệt các luận điểm thuộc bên mình được phân công.
                                                Sau khi duyệt, chủ đề sẽ chuyển sang trạng thái ACTIVE và mở cho người dùng tham gia.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            {selectedModerators.sideA && selectedModerators.sideB ? (
                                                <span className="text-green-600 font-medium">✅ Đã chọn đủ 2 kiểm duyệt viên</span>
                                            ) : (
                                                <span className="text-orange-600">⚠️ Vui lòng chọn đủ 2 kiểm duyệt viên</span>
                                            )}
                                        </div>

                                        <div className="flex space-x-3">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setIsModalOpen(false)}
                                                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                            >
                                                Hủy
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleApproveThread(selectedThread.id)}
                                                disabled={!selectedModerators.sideA || !selectedModerators.sideB}
                                                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <CheckCircleIcon className="w-4 h-4" />
                                                    <span>Duyệt và Kích hoạt</span>
                                                </div>
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Reject Modal */}
                <AnimatePresence>
                    {rejectModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            onClick={() => setRejectModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white/95 backdrop-blur-md rounded-xl max-w-md w-full border border-white/20 shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <XCircleIcon className="h-6 w-6 mr-2 text-red-600" />
                                        Từ chối Thread
                                    </h3>
                                    <p className="text-gray-600 mt-1">
                                        Vui lòng nhập lý do từ chối thread này
                                    </p>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Lý do từ chối *
                                            </label>
                                            <textarea
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                                placeholder="Nhập lý do từ chối thread..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none"
                                                rows={4}
                                            />
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <p className="text-sm text-red-800">
                                                <strong>Lưu ý:</strong> Thread sẽ được đánh dấu là REJECTED và không thể hoạt động trở lại.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-red-50">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            {rejectReason.trim() ? (
                                                <span className="text-green-600 font-medium">✅ Đã nhập lý do từ chối</span>
                                            ) : (
                                                <span className="text-orange-600">⚠️ Vui lòng nhập lý do từ chối</span>
                                            )}
                                        </div>

                                        <div className="flex space-x-3">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setRejectModalOpen(false)}
                                                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                            >
                                                Hủy
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleRejectThread}
                                                disabled={!rejectReason.trim()}
                                                className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <XCircleIcon className="w-4 h-4" />
                                                    <span>Từ chối Thread</span>
                                                </div>
                                            </motion.button>
                                        </div>
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

export default AdminThreadsPage
