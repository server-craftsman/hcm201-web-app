'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    BookOpenIcon,
    AcademicCapIcon,
    TrophyIcon,
    ClockIcon,
    StarIcon,
    PlayIcon,
    CheckCircleIcon,
    LightBulbIcon,
    DocumentTextIcon,
    QuestionMarkCircleIcon,
    ChartBarIcon,
    FireIcon
} from '@heroicons/react/24/outline'

export default function StudyPage() {
    const [selectedCategory, setSelectedCategory] = useState('all')

    // Mock data for learning modules based on Ho Chi Minh Thought
    const categories = [
        { id: 'all', name: 'Tất cả', count: 24 },
        { id: 'philosophy', name: 'Triết học', count: 8 },
        { id: 'politics', name: 'Chính trị', count: 6 },
        { id: 'ethics', name: 'Đạo đức', count: 5 },
        { id: 'history', name: 'Lịch sử', count: 5 }
    ]

    const stats = [
        {
            title: 'Bài học hoàn thành',
            value: '18',
            total: '24',
            change: '+3 tuần này',
            icon: BookOpenIcon,
            color: 'from-green-500 to-green-600',
            percentage: 75
        },
        {
            title: 'Điểm trung bình',
            value: '8.5',
            total: '10',
            change: '+0.5 từ tuần trước',
            icon: StarIcon,
            color: 'from-yellow-500 to-yellow-600',
            percentage: 85
        },
        {
            title: 'Thời gian học',
            value: '24h',
            total: '30h',
            change: '+6h tuần này',
            icon: ClockIcon,
            color: 'from-blue-500 to-blue-600',
            percentage: 80
        },
        {
            title: 'Chứng chỉ đạt được',
            value: '3',
            total: '5',
            change: '+1 tuần này',
            icon: TrophyIcon,
            color: 'from-red-500 to-amber-500',
            percentage: 60
        }
    ]

    const learningModules = [
        {
            id: 1,
            title: 'Tư tưởng triết học của Hồ Chí Minh',
            description: 'Tìm hiểu về nền tảng triết học trong tư tưởng của Chủ tịch Hồ Chí Minh và ảnh hưởng của nó đến cách mạng Việt Nam.',
            category: 'philosophy',
            difficulty: 'Trung bình',
            duration: '45 phút',
            progress: 100,
            completed: true,
            lessons: 5,
            score: 9.2,
            image: '🎓'
        },
        {
            id: 2,
            title: 'Chủ nghĩa yêu nước theo Hồ Chí Minh',
            description: 'Khám phá tinh thần yêu nước và tình yêu dân tộc trong tư tưởng HCM, cách thể hiện trong thời đại mới.',
            category: 'politics',
            difficulty: 'Dễ',
            duration: '30 phút',
            progress: 80,
            completed: false,
            lessons: 4,
            score: 8.5,
            image: '🇻🇳'
        },
        {
            id: 3,
            title: 'Đạo đức cách mạng Hồ Chí Minh',
            description: 'Học tập về phẩm chất đạo đức của người cách mạng theo tấm gương Bác Hồ và ứng dụng trong cuộc sống.',
            category: 'ethics',
            difficulty: 'Khó',
            duration: '60 phút',
            progress: 60,
            completed: false,
            lessons: 6,
            score: 0,
            image: '💎'
        },
        {
            id: 4,
            title: 'Lịch sử cách mạng Việt Nam',
            description: 'Tìm hiểu về quá trình lãnh đạo cách mạng của Chủ tịch Hồ Chí Minh từ 1945 đến 1969.',
            category: 'history',
            difficulty: 'Trung bình',
            duration: '50 phút',
            progress: 100,
            completed: true,
            lessons: 7,
            score: 8.8,
            image: '📚'
        },
        {
            id: 5,
            title: 'Tư tưởng xây dựng nhà nước của HCM',
            description: 'Nghiên cứu quan điểm về xây dựng và phát triển nhà nước trong tư tưởng Hồ Chí Minh.',
            category: 'politics',
            difficulty: 'Khó',
            duration: '55 phút',
            progress: 40,
            completed: false,
            lessons: 5,
            score: 0,
            image: '🏛️'
        },
        {
            id: 6,
            title: 'Văn hóa và giáo dục trong tư tưởng HCM',
            description: 'Tìm hiểu quan điểm về văn hóa, giáo dục trong tư tưởng Hồ Chí Minh và ý nghĩa hiện đại.',
            category: 'philosophy',
            difficulty: 'Dễ',
            duration: '35 phút',
            progress: 20,
            completed: false,
            lessons: 4,
            score: 0,
            image: '📖'
        }
    ]

    const filteredModules = selectedCategory === 'all'
        ? learningModules
        : learningModules.filter(module => module.category === selectedCategory)

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Dễ': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
            case 'Trung bình': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20'
            case 'Khó': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
            default: return 'text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-900/20'
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2 font-geist">
                        Học tập Tư tưởng Hồ Chí Minh
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Khám phá và học tập sâu sắc về tư tưởng Hồ Chí Minh qua các khóa học có hệ thống
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                        <QuestionMarkCircleIcon className="h-5 w-5 mr-2 inline" />
                        Làm bài kiểm tra
                    </button>
                    <button className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                        <ChartBarIcon className="h-5 w-5 mr-2 inline" />
                        Xem báo cáo
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
                        <div className="space-y-3">
                            <div className="flex items-end gap-1">
                                <p className="text-2xl font-bold text-neutral-900 dark:text-white font-geist">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                                    /{stat.total}
                                </p>
                            </div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                {stat.title}
                            </p>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                                <div
                                    className={`h-2 bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500`}
                                    style={{ width: `${stat.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Categories Filter */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 font-geist">
                    Danh mục học tập
                </h2>
                <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${selectedCategory === category.id
                                    ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-lg'
                                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                                }`}
                        >
                            {category.name}
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${selectedCategory === category.id
                                    ? 'bg-white/20 text-white'
                                    : 'bg-neutral-200 dark:bg-neutral-600 text-neutral-600 dark:text-neutral-400'
                                }`}>
                                {category.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Learning Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModules.map((module, index) => (
                    <motion.div
                        key={module.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                    >
                        {/* Module Header */}
                        <div className="p-6 pb-4">
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-4xl">{module.image}</div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                                        {module.difficulty}
                                    </span>
                                    {module.completed && (
                                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                    )}
                                </div>
                            </div>

                            <h3 className="font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                {module.title}
                            </h3>

                            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 line-clamp-3">
                                {module.description}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                                <span className="flex items-center gap-1">
                                    <ClockIcon className="h-4 w-4" />
                                    {module.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                    <BookOpenIcon className="h-4 w-4" />
                                    {module.lessons} bài
                                </span>
                                {module.completed && (
                                    <span className="flex items-center gap-1">
                                        <StarIcon className="h-4 w-4" />
                                        {module.score}/10
                                    </span>
                                )}
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-neutral-600 dark:text-neutral-400">Tiến độ</span>
                                    <span className="font-medium text-neutral-900 dark:text-white">{module.progress}%</span>
                                </div>
                                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                                    <div
                                        className="h-2 bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all duration-500"
                                        style={{ width: `${module.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Module Actions */}
                        <div className="px-6 pb-6">
                            <div className="flex gap-3">
                                {module.completed ? (
                                    <>
                                        <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2">
                                            <CheckCircleIcon className="h-4 w-4" />
                                            Đã hoàn thành
                                        </button>
                                        <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                                            <DocumentTextIcon className="h-4 w-4" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="flex-1 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2">
                                            <PlayIcon className="h-4 w-4" />
                                            {module.progress > 0 ? 'Tiếp tục' : 'Bắt đầu'}
                                        </button>
                                        <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                                            <LightBulbIcon className="h-4 w-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Study Tips */}
            <div className="bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-red-200 dark:border-red-700">
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <LightBulbIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-neutral-900 dark:text-white mb-2">
                            Mẹo học tập hiệu quả về Tư tưởng Hồ Chí Minh
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                            Để học tập hiệu quả về tư tưởng Hồ Chí Minh, hãy kết hợp giữa lý thuyết và thực tiễn, thường xuyên thảo luận và chia sẻ với bạn bè. Tìm hiểu bối cảnh lịch sử và ứng dụng vào cuộc sống hiện đại.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs">
                                Ghi chú quan trọng
                            </span>
                            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs">
                                Thảo luận nhóm
                            </span>
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
                                Ứng dụng thực tế
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}