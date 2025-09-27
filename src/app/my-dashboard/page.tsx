'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    PlusCircleIcon,
    DocumentTextIcon,
    HeartIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ChatBubbleLeftRightIcon,
    AcademicCapIcon,
    TrophyIcon,
    FireIcon
} from '@heroicons/react/24/outline'

const UserDashboard = () => {
    const [selectedTab, setSelectedTab] = useState('overview')

    // Mock data dựa trên DEBATE_SYSTEM_FLOW.md
    const userStats = {
        totalArguments: 24,
        approvedArguments: 18,
        pendingArguments: 3,
        rejectedArguments: 3,
        totalVotes: 45,
        threadsParticipated: 12,
        pointsEarned: 340,
        rank: 'Học viên Tích cực'
    }

    const myArguments = [
        {
            id: 1,
            title: "Giáo dục toàn diện theo tư tưởng Hồ Chí Minh",
            content: "Giáo dục không chỉ truyền đạt kiến thức mà còn rèn luyện đạo đức...",
            threadTitle: "Tư tưởng giáo dục Hồ Chí Minh",
            argumentType: "SUPPORT",
            status: "APPROVED",
            createdAt: "2 ngày trước",
            votes: { support: 8, oppose: 2 },
            comments: 5
        },
        {
            id: 2,
            title: "Vai trò văn hóa dân tộc",
            content: "Văn hóa dân tộc là nền tảng tinh thần của mỗi quốc gia...",
            threadTitle: "Giá trị văn hóa dân tộc",
            argumentType: "NEUTRAL",
            status: "PENDING",
            createdAt: "1 ngày trước",
            votes: { support: 0, oppose: 0 },
            comments: 0
        },
        {
            id: 3,
            title: "Đạo đức trong thời đại mới",
            content: "Cần có cách tiếp cận mới cho đạo đức trong thời đại hiện đại...",
            threadTitle: "Đạo đức cách mạng",
            argumentType: "OPPOSE",
            status: "REJECTED",
            createdAt: "3 ngày trước",
            votes: { support: 1, oppose: 4 },
            comments: 2,
            rejectReason: "Thiếu căn cứ lý luận rõ ràng"
        }
    ]

    const myVotes = [
        {
            id: 1,
            threadTitle: "Tư tưởng Hồ Chí Minh về độc lập dân tộc",
            voteType: "SUPPORT",
            votedAt: "1 giờ trước"
        },
        {
            id: 2,
            threadTitle: "Giá trị văn hóa truyền thống",
            voteType: "OPPOSE",
            votedAt: "2 giờ trước"
        },
        {
            id: 3,
            threadTitle: "Đạo đức cách mạng trong giáo dục",
            voteType: "SUPPORT",
            votedAt: "1 ngày trước"
        }
    ]

    const activeThreads = [
        {
            id: 1,
            title: "Tư tưởng Hồ Chí Minh trong thời đại 4.0",
            status: "ACTIVE",
            totalArguments: 28,
            totalVotes: 156,
            myParticipation: "Đã tham gia",
            lastActivity: "30 phút trước"
        },
        {
            id: 2,
            title: "Giáo dục đạo đức trong trường học",
            status: "ACTIVE",
            totalArguments: 15,
            totalVotes: 89,
            myParticipation: "Chưa tham gia",
            lastActivity: "2 giờ trước"
        }
    ]

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-green-100 text-green-800'
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800'
            case 'REJECTED':
                return 'bg-red-100 text-red-800'
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

    const getVoteTypeStyle = (type: string) => {
        switch (type) {
            case 'SUPPORT':
                return 'text-green-600'
            case 'OPPOSE':
                return 'text-red-600'
            default:
                return 'text-gray-600'
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
                        👨‍🎓 Bảng điều khiển cá nhân
                    </h1>
                    <p className="text-gray-600">
                        Theo dõi hoạt động và thành tích của bạn trong hệ thống tranh luận
                    </p>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Luận điểm của tôi</p>
                                <p className="text-3xl font-bold text-blue-600">{userStats.totalArguments}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">{userStats.approvedArguments} đã duyệt</span>
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
                                <p className="text-sm font-medium text-gray-600">Bình chọn</p>
                                <p className="text-3xl font-bold text-purple-600">{userStats.totalVotes}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <HeartIcon className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">{userStats.threadsParticipated} chủ đề</span>
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
                                <p className="text-sm font-medium text-gray-600">Điểm tích lũy</p>
                                <p className="text-3xl font-bold text-green-600">{userStats.pointsEarned}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <TrophyIcon className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">Tăng +15 tuần này</span>
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
                                <p className="text-sm font-medium text-gray-600">Xếp hạng</p>
                                <p className="text-lg font-bold text-orange-600">{userStats.rank}</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-full">
                                <FireIcon className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">Top 20%</span>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setSelectedTab('overview')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${selectedTab === 'overview'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Tổng quan
                            </button>
                            <button
                                onClick={() => setSelectedTab('arguments')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${selectedTab === 'arguments'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Luận điểm của tôi
                            </button>
                            <button
                                onClick={() => setSelectedTab('votes')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${selectedTab === 'votes'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Bình chọn của tôi
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content based on selected tab */}
                {selectedTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Chủ đề đang hoạt động */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200"
                        >
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-blue-600" />
                                    Chủ đề đang hoạt động
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {activeThreads.map((thread) => (
                                        <div key={thread.id} className="p-4 bg-gray-50 rounded-lg">
                                            <h4 className="font-medium text-gray-900 mb-2">
                                                {thread.title}
                                            </h4>
                                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                                <span>📝 {thread.totalArguments} luận điểm</span>
                                                <span>👥 {thread.totalVotes} bình chọn</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className={`text-sm font-medium ${thread.myParticipation === 'Đã tham gia'
                                                        ? 'text-green-600'
                                                        : 'text-orange-600'
                                                    }`}>
                                                    {thread.myParticipation}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {thread.lastActivity}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Khám phá thêm chủ đề
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Hành động nhanh */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200"
                        >
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Hành động nhanh</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                                    >
                                        <PlusCircleIcon className="h-5 w-5 mr-2" />
                                        Yêu cầu chủ đề mới
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                                        Tham gia tranh luận
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                                    >
                                        <AcademicCapIcon className="h-5 w-5 mr-2" />
                                        Học tập
                                    </motion.button>
                                </div>

                                {/* Progress */}
                                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">Tiến độ học tập</h4>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>68% hoàn thành</span>
                                        <span>340/500 điểm</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {selectedTab === 'arguments' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Luận điểm của tôi</h3>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <PlusCircleIcon className="h-4 w-4 inline mr-1" />
                                    Tạo luận điểm mới
                                </motion.button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {myArguments.map((argument) => (
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
                                                        {argument.status === 'APPROVED' ? 'Đã duyệt' :
                                                            argument.status === 'PENDING' ? 'Chờ duyệt' : 'Bị từ chối'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Chủ đề: {argument.threadTitle}
                                                </p>
                                                <p className="text-gray-700 mb-3">
                                                    {argument.content}
                                                </p>
                                                {argument.status === 'REJECTED' && argument.rejectReason && (
                                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                                                        <p className="text-red-800 text-sm">
                                                            <strong>Lý do từ chối:</strong> {argument.rejectReason}
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <span>⏰ {argument.createdAt}</span>
                                                    <span>👍 {argument.votes.support}</span>
                                                    <span>👎 {argument.votes.oppose}</span>
                                                    <span>💬 {argument.comments}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {selectedTab === 'votes' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-200"
                    >
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Bình chọn của tôi</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {myVotes.map((vote) => (
                                    <div key={vote.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 mb-1">
                                                {vote.threadTitle}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {vote.votedAt}
                                            </p>
                                        </div>
                                        <div className={`font-medium ${getVoteTypeStyle(vote.voteType)}`}>
                                            {vote.voteType === 'SUPPORT' ? '👍 Ủng hộ' : '👎 Phản đối'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default UserDashboard
