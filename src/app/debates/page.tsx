'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button, Card, Input, Select } from '@/shared/components/ui'
import { useMediaQuery } from '@/shared/hooks'
import { DebateCard } from '@/modules/debate/components'
import { useDebates } from '@/modules/debate/hooks'
import { DEBATE_CATEGORIES, DIFFICULTY_LEVELS, DEBATE_CATEGORY_NAMES, DIFFICULTY_LEVEL_NAMES } from '@/shared/constants'
import {
    MagnifyingGlassIcon,
    PlusIcon,
    FunnelIcon,
    ChevronUpDownIcon,
    XMarkIcon,
    SparklesIcon,
    ChatBubbleLeftRightIcon,
    FireIcon,
    TrophyIcon,
    ChartBarIcon,
    UsersIcon,
    EyeIcon
} from '@heroicons/react/24/outline'

export default function DebatesPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedDifficulty, setSelectedDifficulty] = useState('')
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [showFilters, setShowFilters] = useState(false)

    const isDesktop = useMediaQuery('(min-width: 1024px)')

    const {
        debates,
        isLoading,
        error,
        totalCount,
        currentPage,
        totalPages,
        loadDebates,
        setFilters,
        resetFilters,
        clearError
    } = useDebates({
        filters: {
            search: searchTerm,
            category: selectedCategory,
            difficulty: selectedDifficulty,
            sortBy,
            sortOrder,
        }
    })

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        setFilters({ search: value })
    }

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category)
        setFilters({ category: category || undefined })
    }

    const handleDifficultyChange = (difficulty: string) => {
        setSelectedDifficulty(difficulty)
        setFilters({ difficulty: difficulty || undefined })
    }

    const handleSortChange = (newSortBy: string) => {
        setSortBy(newSortBy)
        setFilters({ sortBy: newSortBy })
    }

    const handleSortOrderChange = () => {
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
        setSortOrder(newOrder)
        setFilters({ sortOrder: newOrder })
    }

    const handleResetFilters = () => {
        setSearchTerm('')
        setSelectedCategory('')
        setSelectedDifficulty('')
        setSortBy('date')
        setSortOrder('desc')
        resetFilters()
    }

    // Mock stats for debate overview
    const stats = [
        {
            title: 'Tổng chủ đề',
            value: '245',
            change: '+12 tuần này',
            icon: ChatBubbleLeftRightIcon,
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Đang hoạt động',
            value: '89',
            change: '+5 hôm nay',
            icon: FireIcon,
            color: 'from-red-500 to-red-600'
        },
        {
            title: 'Lượt tham gia',
            value: '1,234',
            change: '+89 tuần này',
            icon: UsersIcon,
            color: 'from-green-500 to-green-600'
        },
        {
            title: 'Lượt xem',
            value: '5,678',
            change: '+234 tuần này',
            icon: EyeIcon,
            color: 'from-purple-500 to-purple-600'
        }
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2 font-geist">
                        Chủ đề tranh luận
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Khám phá và tham gia thảo luận về các chủ đề tư tưởng Hồ Chí Minh
                    </p>
                </div>
                <Link href="/debates/create">
                    <Button
                        className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        size="lg"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Tạo chủ đề mới
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
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
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                {/* Filter toggle for mobile */}
                <div className="flex items-center justify-between mb-6 lg:hidden">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white font-geist">
                        Bộ lọc tìm kiếm
                    </h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FunnelIcon className="h-4 w-4 mr-2" />
                        {showFilters ? 'Ẩn' : 'Hiện'} bộ lọc
                    </Button>
                </div>

                <AnimatePresence>
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                            height: showFilters || isDesktop ? 'auto' : 0,
                            opacity: showFilters || isDesktop ? 1 : 0
                        }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Search */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Tìm kiếm
                                </label>
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm chủ đề..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Category filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Danh mục
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                >
                                    <option value="">Tất cả danh mục</option>
                                    {Object.entries(DEBATE_CATEGORY_NAMES).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Difficulty filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Mức độ
                                </label>
                                <select
                                    value={selectedDifficulty}
                                    onChange={(e) => handleDifficultyChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                >
                                    <option value="">Tất cả mức độ</option>
                                    {Object.entries(DIFFICULTY_LEVEL_NAMES).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                    Sắp xếp theo
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="date">Ngày tạo</option>
                                        <option value="popularity">Phổ biến</option>
                                        <option value="arguments">Số lượng tranh luận</option>
                                        <option value="views">Lượt xem</option>
                                    </select>
                                    <button
                                        onClick={handleSortOrderChange}
                                        className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors"
                                    >
                                        <ChevronUpDownIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Filter summary and actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Hiển thị <span className="font-semibold text-neutral-900 dark:text-white">{debates.length}</span> trong tổng số <span className="font-semibold text-neutral-900 dark:text-white">{totalCount}</span> chủ đề
                            </p>
                            {(searchTerm || selectedCategory || selectedDifficulty) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleResetFilters}
                                >
                                    <XMarkIcon className="h-4 w-4 mr-2" />
                                    Xóa bộ lọc
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Error message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card variant="luxury" className="border-red-200 bg-red-50/80">
                            <div className="p-6 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
                                        <XMarkIcon className="h-5 w-5 text-red-600" />
                                    </div>
                                    <p className="text-red-800 font-medium">{error}</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={clearError}>
                                    <XMarkIcon className="h-5 w-5" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading state */}
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {Array.from({ length: 6 }).map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="card-luxury p-8"
                        >
                            <div className="space-y-4">
                                <div className="skeleton-luxury h-6 w-3/4 rounded-xl" />
                                <div className="skeleton-luxury h-4 w-full rounded-lg" />
                                <div className="skeleton-luxury h-4 w-2/3 rounded-lg" />
                                <div className="flex space-x-3 mt-6">
                                    <div className="skeleton-luxury h-8 w-16 rounded-full" />
                                    <div className="skeleton-luxury h-8 w-20 rounded-full" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Debates grid */}
            {!isLoading && debates.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {debates.map((debate, index) => (
                        <motion.div
                            key={debate.id}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                ease: "easeOut"
                            }}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <DebateCard
                                debate={debate}
                                showActions={false}
                                showAuthor={true}
                                showStats={true}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Empty state */}
            {!isLoading && debates.length === 0 && !error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card variant="luxury" className="text-center py-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="space-y-8"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                className="text-8xl"
                            >
                                🤔
                            </motion.div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-neutral-800 font-serif">
                                    Không tìm thấy chủ đề tranh luận
                                </h3>
                                <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                                    {searchTerm || selectedCategory || selectedDifficulty
                                        ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem nhiều kết quả hơn.'
                                        : 'Chưa có chủ đề tranh luận nào. Hãy tạo chủ đề đầu tiên!'
                                    }
                                </p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex flex-col sm:flex-row justify-center gap-4"
                            >
                                {(searchTerm || selectedCategory || selectedDifficulty) && (
                                    <Button
                                        variant="glass"
                                        size="lg"
                                        onClick={handleResetFilters}
                                        leftIcon={<XMarkIcon className="h-5 w-5" />}
                                    >
                                        Xóa bộ lọc
                                    </Button>
                                )}
                                <Link href="/debates/create">
                                    <Button
                                        variant="luxury"
                                        size="lg"
                                        leftIcon={<PlusIcon className="h-5 w-5" />}
                                    >
                                        Tạo chủ đề mới
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </Card>
                </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center"
                >
                    <Card variant="glass" className="p-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="glass"
                                disabled={currentPage === 1}
                                onClick={() => loadDebates(currentPage - 1)}
                                className="disabled:opacity-50"
                            >
                                Trước
                            </Button>

                            <div className="flex items-center space-x-2">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const page = i + 1
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => loadDebates(page)}
                                            className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${currentPage === page
                                                ? 'hcm-gradient-luxury text-white shadow-luxury'
                                                : 'bg-white/60 text-neutral-600 hover:bg-white/80'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                })}
                            </div>

                            <Button
                                variant="glass"
                                disabled={currentPage === totalPages}
                                onClick={() => loadDebates(currentPage + 1)}
                                className="disabled:opacity-50"
                            >
                                Sau
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            )}
        </div>
    )
}