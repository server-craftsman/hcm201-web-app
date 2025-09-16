'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    UsersIcon,
    ChatBubbleLeftRightIcon,
    HeartIcon,
    ShareIcon,
    UserPlusIcon,
    TrophyIcon,
    FireIcon,
    ClockIcon,
    EyeIcon,
    HandThumbUpIcon,
    StarIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline'

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState('discussions')

    const stats = [
        {
            title: 'Thành viên',
            value: '2,456',
            change: '+89 tuần này',
            icon: UsersIcon,
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Thảo luận',
            value: '1,234',
            change: '+56 tuần này',
            icon: ChatBubbleLeftRightIcon,
            color: 'from-green-500 to-green-600'
        },
        {
            title: 'Bài viết hot',
            value: '89',
            change: '+12 hôm nay',
            icon: FireIcon,
            color: 'from-red-500 to-amber-500'
        },
        {
            title: 'Hoạt động',
            value: '456',
            change: '+34 hôm nay',
            icon: TrophyIcon,
            color: 'from-purple-500 to-purple-600'
        }
    ]

    const topMembers = [
        {
            id: 1,
            name: 'Nguyễn Văn An',
            role: 'Moderator',
            points: 2450,
            posts: 89,
            avatar: '👨‍🎓',
            badge: '🏆',
            speciality: 'Triết học HCM'
        },
        {
            id: 2,
            name: 'Trần Thị Bình',
            role: 'Thành viên tích cực',
            points: 1890,
            posts: 67,
            avatar: '👩‍💼',
            badge: '⭐',
            speciality: 'Đạo đức cách mạng'
        },
        {
            id: 3,
            name: 'Lê Văn Cường',
            role: 'Người đóng góp',
            points: 1456,
            posts: 45,
            avatar: '👨‍💻',
            badge: '💎',
            speciality: 'Lịch sử cách mạng'
        }
    ]

    const discussions = [
        {
            id: 1,
            title: 'Ứng dụng tư tưởng đạo đức HCM trong công việc hàng ngày',
            author: 'Nguyễn Văn An',
            avatar: '👨‍🎓',
            replies: 23,
            likes: 45,
            views: 234,
            timeAgo: '2 giờ trước',
            category: 'Thảo luận',
            isHot: true,
            excerpt: 'Làm thế nào để áp dụng những giá trị đạo đức mà Bác Hồ đã dạy vào cuộc sống và công việc hàng ngày?'
        },
        {
            id: 2,
            title: 'Tư tưởng yêu nước trong thời đại số hóa',
            author: 'Trần Thị Bình',
            avatar: '👩‍💼',
            replies: 18,
            likes: 32,
            views: 189,
            timeAgo: '4 giờ trước',
            category: 'Chia sẻ',
            isHot: false,
            excerpt: 'Tình yêu đất nước được thể hiện như thế nào trong thời đại công nghệ 4.0?'
        },
        {
            id: 3,
            title: 'Kinh nghiệm học tập tư tưởng Hồ Chí Minh hiệu quả',
            author: 'Lê Văn Cường',
            avatar: '👨‍💻',
            replies: 31,
            likes: 67,
            views: 456,
            timeAgo: '1 ngày trước',
            category: 'Hướng dẫn',
            isHot: true,
            excerpt: 'Chia sẻ những phương pháp học tập và ghi nhớ hiệu quả về tư tưởng HCM.'
        },
        {
            id: 4,
            title: 'Thảo luận về bài kiểm tra chương 3: Tư tưởng giáo dục',
            author: 'Phạm Thị Dung',
            avatar: '👩‍🎓',
            replies: 12,
            likes: 28,
            views: 123,
            timeAgo: '1 ngày trước',
            category: 'Hỏi đáp',
            isHot: false,
            excerpt: 'Cùng thảo luận và giải đáp thắc mắc về bài kiểm tra chương 3.'
        },
        {
            id: 5,
            title: 'Tư tưởng HCM với phát triển bền vững hiện đại',
            author: 'Hoàng Văn Em',
            avatar: '👨‍🔬',
            replies: 15,
            likes: 38,
            views: 167,
            timeAgo: '2 ngày trước',
            category: 'Nghiên cứu',
            isHot: false,
            excerpt: 'Mối liên hệ giữa tư tưởng Hồ Chí Minh và các mục tiêu phát triển bền vững.'
        }
    ]

    const tabs = [
        { id: 'discussions', name: 'Thảo luận', count: discussions.length, icon: ChatBubbleLeftRightIcon },
        { id: 'members', name: 'Thành viên', count: topMembers.length, icon: UsersIcon },
        { id: 'events', name: 'Sự kiện', count: 3, icon: CalendarDaysIcon }
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2 font-geist">
                        Cộng đồng HCM201
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Kết nối và chia sẻ kiến thức cùng cộng đồng học tập tư tưởng Hồ Chí Minh
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 inline" />
                        Tạo thảo luận
                    </button>
                    <button className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                        <UserPlusIcon className="h-5 w-5 mr-2 inline" />
                        Mời bạn bè
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                {stat.change}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-2xl font-bold text-neutral-900 dark:text-white font-geist">
                                {stat.value}
                            </p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {stat.title}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                <div className="flex border-b border-neutral-200 dark:border-neutral-700">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-6 py-4 font-medium transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === tab.id
                                    ? 'text-red-600 dark:text-red-400 border-b-2 border-red-500'
                                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                        >
                            <tab.icon className="h-5 w-5" />
                            {tab.name}
                            <span className={`px-2 py-1 rounded-full text-xs ${activeTab === tab.id
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400'
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* Discussions Tab */}
                    {activeTab === 'discussions' && (
                        <div className="space-y-4">
                            {discussions.map((discussion, index) => (
                                <motion.div
                                    key={discussion.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="p-6 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-all duration-300 group cursor-pointer"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="text-3xl">{discussion.avatar}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-neutral-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors text-lg">
                                                    {discussion.title}
                                                </h3>
                                                {discussion.isHot && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                                        <FireIcon className="h-3 w-3 mr-1" />
                                                        Hot
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3 line-clamp-2">
                                                {discussion.excerpt}
                                            </p>

                                            <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                                                <span className="font-medium">{discussion.author}</span>
                                                <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 rounded-full text-xs">
                                                    {discussion.category}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <ClockIcon className="h-4 w-4" />
                                                    {discussion.timeAgo}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
                                                <span className="flex items-center gap-1 hover:text-red-600 transition-colors">
                                                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                                    {discussion.replies} trả lời
                                                </span>
                                                <span className="flex items-center gap-1 hover:text-red-600 transition-colors">
                                                    <HandThumbUpIcon className="h-4 w-4" />
                                                    {discussion.likes} thích
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <EyeIcon className="h-4 w-4" />
                                                    {discussion.views} lượt xem
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Members Tab */}
                    {activeTab === 'members' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topMembers.map((member, index) => (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="p-6 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:shadow-lg transition-all duration-300 text-center group"
                                >
                                    <div className="relative inline-block mb-4">
                                        <div className="text-4xl">{member.avatar}</div>
                                        <div className="absolute -top-1 -right-1 text-lg">{member.badge}</div>
                                    </div>

                                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                        {member.name}
                                    </h3>

                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                                        {member.role}
                                    </p>

                                    <p className="text-xs text-red-600 dark:text-red-400 mb-4 font-medium">
                                        Chuyên môn: {member.speciality}
                                    </p>

                                    <div className="flex justify-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                                        <div className="text-center">
                                            <p className="font-semibold text-neutral-900 dark:text-white">{member.points}</p>
                                            <p>Điểm</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-semibold text-neutral-900 dark:text-white">{member.posts}</p>
                                            <p>Bài viết</p>
                                        </div>
                                    </div>

                                    <button className="w-full bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white py-2 rounded-lg font-medium transition-all duration-300">
                                        Kết bạn
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Events Tab */}
                    {activeTab === 'events' && (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">📅</div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                                Sự kiện sắp tới
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                                Hiện tại chưa có sự kiện nào được lên lịch. Hãy quay lại sau hoặc đề xuất sự kiện mới!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300">
                                    Đề xuất sự kiện
                                </button>
                                <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300">
                                    Tham gia hội thảo
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-red-200 dark:border-red-700">
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <HeartIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-neutral-900 dark:text-white mb-2">
                            Quy tắc cộng đồng HCM201
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                            Để xây dựng một cộng đồng học tập tích cực và thân thiện về tư tưởng Hồ Chí Minh, hãy tuân thủ các quy tắc cơ bản của chúng ta. Mọi thành viên đều có trách nhiệm duy trì môi trường học tập tích cực.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs">
                                Tôn trọng lẫn nhau
                            </span>
                            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs">
                                Chia sẻ kiến thức
                            </span>
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
                                Thảo luận văn minh
                            </span>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                                Học tập tích cực
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}