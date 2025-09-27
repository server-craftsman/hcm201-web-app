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
    const [hoveredModule, setHoveredModule] = useState<number | null>(null)
    const [hoveredStat, setHoveredStat] = useState<number | null>(null)

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
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50/30 to-purple-50/50 dark:from-slate-900 dark:via-emerald-900/20 dark:to-blue-900/30">
            {/* Luxury Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-500 to-blue-500 dark:from-emerald-700 dark:via-green-600 dark:to-blue-600"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;80&quot; height=&quot;80&quot; viewBox=&quot;0 0 80 80&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.03&quot;%3E%3Cpath d=&quot;M40 40l20-20v20h-20zm20 0l20-20v20h-20zm0 20l20-20v20h-20zm-20 0l20-20v20h-20z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
                
                <div className="relative container mx-auto px-4 py-16 lg:py-24">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex-1"
                        >
                            <motion.h1 
                                className="text-4xl lg:text-6xl font-bold text-white mb-4 font-serif tracking-tight"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                Học tập
                                <motion.span 
                                    className="block text-xl lg:text-2xl font-light text-white/90 mt-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                >
                                    Tư tưởng Hồ Chí Minh
                                </motion.span>
                            </motion.h1>
                            <motion.p 
                                className="text-lg text-white/85 max-w-2xl leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                            >
                                Khám phá và học tập sâu sắc về tư tưởng Hồ Chí Minh qua các khóa học có hệ thống.
                                Nâng cao kiến thức và tu dưỡng bản thân.
                            </motion.p>
                        </motion.div>
                        
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex gap-4 flex-col sm:flex-row"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="group relative overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl font-semibold shadow-2xl hover:shadow-white/20 transition-all duration-300"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                                />
                                <span className="relative flex items-center gap-2">
                                    <QuestionMarkCircleIcon className="h-5 w-5" />
                                    Làm bài kiểm tra
                                </span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="group relative overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl font-semibold shadow-2xl hover:shadow-white/20 transition-all duration-300"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                                />
                                <span className="relative flex items-center gap-2">
                                    <ChartBarIcon className="h-5 w-5" />
                                    Xem báo cáo
                                </span>
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
                
                {/* Decorative bottom wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" className="w-full h-8 fill-emerald-50 dark:fill-slate-900">
                        <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,112C1248,117,1344,107,1392,101.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
                    </svg>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 -mt-4 relative z-10 space-y-12 pb-16">

                {/* Luxury Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 60, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.5 + index * 0.1,
                                type: "spring",
                                stiffness: 100
                            }}
                            onMouseEnter={() => setHoveredStat(index)}
                            onMouseLeave={() => setHoveredStat(null)}
                            className="group relative"
                        >
                            <motion.div
                                className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                {/* Floating background gradient */}
                                <motion.div
                                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                                    animate={hoveredStat === index ? { scale: 1.1, rotate: 1 } : { scale: 1, rotate: 0 }}
                                />

                                {/* Glowing border effect */}
                                <motion.div
                                    className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                                    animate={hoveredStat === index ? { scale: 1.05 } : { scale: 1 }}
                                />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <motion.div
                                            className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}
                                            whileHover={{ rotate: 5, scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        >
                                            <stat.icon className="h-8 w-8 text-white drop-shadow-sm" />
                                        </motion.div>
                                        <motion.span
                                            className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.7 + index * 0.1 }}
                                        >
                                            {stat.change}
                                        </motion.span>
                                    </div>

                                    <motion.div
                                        className="space-y-3"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 + index * 0.1 }}
                                    >
                                        <div className="flex items-end gap-1">
                                            <motion.p
                                                className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                {stat.value}
                                            </motion.p>
                                            <p className="text-lg text-slate-500 dark:text-slate-400 mb-1">
                                                /{stat.total}
                                            </p>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm tracking-wide mb-4">
                                            {stat.title}
                                        </p>

                                        {/* Animated Progress Bar */}
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                                            <motion.div
                                                className={`h-3 bg-gradient-to-r ${stat.color} rounded-full relative overflow-hidden`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stat.percentage}%` }}
                                                transition={{ duration: 1.5, delay: 1 + index * 0.1, ease: "easeOut" }}
                                            >
                                                {/* Shimmer effect */}
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                                    animate={{ x: ['-100%', '100%'] }}
                                                    transition={{
                                                        repeat: Infinity,
                                                        duration: 2,
                                                        delay: 1.5 + index * 0.1,
                                                        repeatDelay: 3
                                                    }}
                                                />
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Luxury Categories Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden"
                >
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-500/10 to-purple-500/10 rounded-full blur-2xl"></div>

                    <div className="relative z-10">
                        <motion.h2
                            className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            Danh mục học tập
                        </motion.h2>
                        <div className="flex flex-wrap gap-4">
                            {categories.map((category, index) => (
                                <motion.button
                                    key={category.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 200 }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`group relative overflow-hidden px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${selectedCategory === category.id
                                        ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-xl shadow-emerald-500/25'
                                        : 'bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-600/80 border border-white/40 dark:border-slate-600/40'
                                        }`}
                                >
                                    {selectedCategory === category.id && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10"
                                            animate={{ x: ['-100%', '100%'] }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 2,
                                                repeatDelay: 3
                                            }}
                                        />
                                    )}
                                    <span className="relative flex items-center gap-2">
                                        {category.name}
                                        <motion.span
                                            className={`px-2 py-1 rounded-full text-xs font-bold ${selectedCategory === category.id
                                                ? 'bg-white/25 text-white'
                                                : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400'
                                                }`}
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            {category.count}
                                        </motion.span>
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>

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
        </div>
    )
}