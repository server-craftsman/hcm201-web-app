'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const AdminThreadsPage = () => {
    const [selectedTab, setSelectedTab] = useState('pending')
    const [selectedThread, setSelectedThread] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedModerators, setSelectedModerators] = useState({ sideA: '', sideB: '' })

    // Mock data dựa trên DEBATE_SYSTEM_FLOW.md
    const threadStats = {
        pending: 8,
        active: 12,
        paused: 3,
        closed: 15,
        archived: 24
    }

    const availableModerators = [
        { id: 'mod1', name: 'Trần Kiểm Duyệt', specialty: 'Giáo dục', workload: 5 },
        { id: 'mod2', name: 'Lê Giám Sát', specialty: 'Văn hóa', workload: 3 },
        { id: 'mod3', name: 'Nguyễn Kiểm Tra', specialty: 'Đạo đức', workload: 7 },
        { id: 'mod4', name: 'Phạm Duyệt Bài', specialty: 'Chính trị', workload: 4 },
    ]

    const threads = [
        {
            id: 1,
            title: "Tư tưởng Hồ Chí Minh trong giáo dục hiện đại",
            description: "Thảo luận về việc áp dụng tư tưởng giáo dục của Hồ Chí Minh trong bối cảnh giáo dục hiện đại",
            author: {
                name: "Nguyễn Văn An",
                avatar: "NA",
                reputation: 85
            },
            category: "Giáo dục",
            status: "DRAFT",
            priority: "HIGH",
            createdAt: "2024-01-15T10:30:00",
            requestedAt: "2024-01-15T10:30:00",
            estimatedParticipants: 25,
            relatedTopics: ["Giáo dục toàn diện", "Phương pháp sư phạm", "Đạo đức giáo viên"],
            assignedModerators: null
        },
        {
            id: 2,
            title: "Giá trị văn hóa dân tộc trong tư tưởng Hồ Chí Minh",
            description: "Khám phá và thảo luận về những giá trị văn hóa dân tộc được Hồ Chí Minh đề cao",
            author: {
                name: "Trần Thị Bích",
                avatar: "TB",
                reputation: 72
            },
            category: "Văn hóa",
            status: "ACTIVE",
            priority: "MEDIUM",
            createdAt: "2024-01-14T09:15:00",
            activatedAt: "2024-01-14T14:20:00",
            estimatedParticipants: 30,
            relatedTopics: ["Di sản văn hóa", "Bản sắc dân tộc", "Toàn cầu hóa"],
            assignedModerators: {
                sideA: { id: 'mod1', name: 'Trần Kiểm Duyệt' },
                sideB: { id: 'mod2', name: 'Lê Giám Sát' }
            },
            stats: {
                arguments: 24,
                votes: 156,
                participants: 45,
                pendingModeration: 3
            }
        },
        {
            id: 3,
            title: "Đạo đức cách mạng theo tư tưởng Hồ Chí Minh",
            description: "Phân tích và thảo luận về tinh thần đạo đức cách mạng trong tư tưởng Hồ Chí Minh",
            author: {
                name: "Lê Minh Đức",
                avatar: "LD",
                reputation: 91
            },
            category: "Đạo đức",
            status: "PAUSED",
            priority: "LOW",
            createdAt: "2024-01-12T08:45:00",
            pausedAt: "2024-01-14T16:30:00",
            pauseReason: "Cần xem xét thêm về hướng thảo luận",
            estimatedParticipants: 20,
            relatedTopics: ["Lý tưởng cách mạng", "Đạo đức xã hội", "Giá trị nhân văn"],
            assignedModerators: {
                sideA: { id: 'mod3', name: 'Nguyễn Kiểm Tra' },
                sideB: { id: 'mod4', name: 'Phạm Duyệt Bài' }
            },
            stats: {
                arguments: 15,
                votes: 89,
                participants: 28,
                pendingModeration: 0
            }
        }
    ]

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

    const handleApproveThread = async (threadId: number) => {
        if (!selectedModerators.sideA || !selectedModerators.sideB) {
            alert('Vui lòng chọn 2 kiểm duyệt viên cho thread này')
            return
        }
        console.log(`Approve thread ${threadId} with moderators:`, selectedModerators)
        // TODO: Implement API call
        setIsModalOpen(false)
        setSelectedThread(null)
        setSelectedModerators({ sideA: '', sideB: '' })
    }

    const handleThreadAction = async (threadId: number, action: string) => {
        console.log(`${action} thread ${threadId}`)
        // TODO: Implement API call
    }

    const openApprovalModal = (thread: any) => {
        setSelectedThread(thread)
        setIsModalOpen(true)
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🛡️ Quản lý chủ đề tranh luận
                    </h1>
                    <p className="text-gray-600">
                        Duyệt, quản lý và giám sát các chủ đề tranh luận trong hệ thống
                    </p>
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
                    {filteredThreads.map((thread) => (
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
                                    <p className="text-sm text-gray-600 mb-2">
                                        Danh mục: {thread.category}
                                    </p>
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
                                    {thread.relatedTopics.map((topic, index) => (
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
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleThreadAction(thread.id, 'CLOSE')}
                                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            <XCircleIcon className="h-4 w-4 mr-1" />
                                            Đóng
                                        </motion.button>
                                    </div>
                                )}

                                <div className="flex items-center space-x-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <EyeIcon className="h-4 w-4 mr-1" />
                                        Xem chi tiết
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        <PencilIcon className="h-4 w-4 mr-1" />
                                        Chỉnh sửa
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
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3">
                                                Chọn kiểm duyệt viên cho bên A (Ủng hộ)
                                            </h4>
                                            <select
                                                value={selectedModerators.sideA}
                                                onChange={(e) => setSelectedModerators({ ...selectedModerators, sideA: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Chọn kiểm duyệt viên...</option>
                                                {availableModerators.map((mod) => (
                                                    <option key={mod.id} value={mod.id}>
                                                        {mod.name} - {mod.specialty} (Đang xử lý: {mod.workload})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3">
                                                Chọn kiểm duyệt viên cho bên B (Phản đối)
                                            </h4>
                                            <select
                                                value={selectedModerators.sideB}
                                                onChange={(e) => setSelectedModerators({ ...selectedModerators, sideB: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Chọn kiểm duyệt viên...</option>
                                                {availableModerators.filter(mod => mod.id !== selectedModerators.sideA).map((mod) => (
                                                    <option key={mod.id} value={mod.id}>
                                                        {mod.name} - {mod.specialty} (Đang xử lý: {mod.workload})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-sm text-blue-800">
                                                <strong>Lưu ý:</strong> Mỗi kiểm duyệt viên sẽ chịu trách nhiệm kiểm duyệt các luận điểm thuộc bên mình được phân công.
                                                Sau khi duyệt, chủ đề sẽ chuyển sang trạng thái ACTIVE và mở cho người dùng tham gia.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={() => handleApproveThread(selectedThread.id)}
                                        disabled={!selectedModerators.sideA || !selectedModerators.sideB}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Duyệt và Kích hoạt
                                    </button>
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
