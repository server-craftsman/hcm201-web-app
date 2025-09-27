'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card } from '@/shared/components/ui'
import {
    ArrowLeftIcon,
    HeartIcon,
    ChatBubbleLeftRightIcon,
    ShareIcon,
    BookmarkIcon,
    EyeIcon,
    UserIcon,
    CalendarIcon,
    TagIcon,
    FlagIcon,
    PlusIcon
} from '@heroicons/react/24/outline'
import {
    HeartIcon as HeartSolidIcon,
    BookmarkIcon as BookmarkSolidIcon
} from '@heroicons/react/24/solid'

export default function DebateDetailPage() {
    const params = useParams()
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [showArgumentForm, setShowArgumentForm] = useState(false)

    // Mock data for debate detail
    const debate = {
        id: params.id,
        title: 'Vai trò của tư tưởng Hồ Chí Minh trong xây dựng đất nước hiện đại',
        description: 'Thảo luận về những ứng dụng cụ thể của tư tưởng Hồ Chí Minh trong việc xây dựng và phát triển đất nước Việt Nam trong thời kỳ hiện đại.',
        author: {
            name: 'Nguyễn Văn An',
            avatar: '👨‍🎓',
            role: 'Giảng viên'
        },
        createdAt: '2024-01-15',
        category: 'Chính trị',
        difficulty: 'Trung bình',
        stats: {
            views: 1234,
            likes: 89,
            arguments: 23,
            bookmarks: 45
        },
        content: `
Tư tưởng Hồ Chí Minh không chỉ là di sản tinh thần quý báu mà còn là kim chỉ nam soi sáng con đường xây dựng và phát triển đất nước Việt Nam trong thời kỳ hiện đại.

**1. Tư tưởng về độc lập dân tộc gắn liền với chủ nghĩa xã hội:**
- Hồ Chí Minh khẳng định rằng độc lập dân tộc phải gắn liền với giải phóng xã hội
- Việt Nam cần xây dựng một nền độc lập thật sự, không phụ thuộc vào nước ngoài
- Chủ nghĩa xã hội là con đường tất yếu để đưa dân tộc đến thịnh vượng

**2. Tư tưởng về dân chủ và pháp quyền:**
- "Dân là gốc của nước", quyền lực thuộc về nhân dân
- Xây dựng nhà nước pháp quyền xã hội chủ nghĩa của dân, do dân, vì dân
- Phát huy quyền làm chủ của nhân dân trong mọi lĩnh vực

**3. Ứng dụng trong thực tiễn hiện nay:**
- Đổi mới kinh tế theo định hướng xã hội chủ nghĩa
- Xây dựng nền kinh tế thị trường định hướng xã hội chủ nghĩa
- Phát triển văn hóa, giáo dục, khoa học công nghệ

Làm thế nào chúng ta có thể ứng dụng hiệu quả những tư tưởng này vào việc xây dựng đất nước trong bối cảnh toàn cầu hóa hiện nay?
        `
    }

    const mockArguments = [
        {
            id: 1,
            author: { name: 'Trần Thị Bình', avatar: '👩‍💼' },
            content: 'Tôi cho rằng tư tưởng Hồ Chí Minh về độc lập tự chủ rất phù hợp với bối cảnh hiện nay. Việt Nam cần duy trì độc lập trong chính sách đối ngoại...',
            createdAt: '2024-01-16',
            likes: 12,
            replies: 3,
            position: 'support'
        },
        {
            id: 2,
            author: { name: 'Lê Minh Đức', avatar: '👨‍🔬' },
            content: 'Tuy nhiên, trong bối cảnh toàn cầu hóa, chúng ta cần cân bằng giữa độc lập tự chủ và hội nhập quốc tế. Một số quan điểm cần được điều chỉnh...',
            createdAt: '2024-01-17',
            likes: 8,
            replies: 5,
            position: 'against'
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/30">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <Card className="p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-white/20 shadow-2xl">
                        {/* Meta info */}
                        <div className="flex items-center space-x-6 text-sm text-slate-600 dark:text-slate-400 mb-6">
                            <div className="flex items-center space-x-2">
                                <TagIcon className="h-4 w-4" />
                                <span>{debate.category}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{debate.createdAt}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <EyeIcon className="h-4 w-4" />
                                <span>{debate.stats.views} lượt xem</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                            {debate.title}
                        </h1>

                        {/* Author */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                                    {debate.author.avatar}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">
                                        {debate.author.name}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {debate.author.role}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsLiked(!isLiked)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${isLiked
                                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-red-100 hover:text-red-600'
                                        }`}
                                >
                                    {isLiked ? (
                                        <HeartSolidIcon className="h-5 w-5" />
                                    ) : (
                                        <HeartIcon className="h-5 w-5" />
                                    )}
                                    <span>{debate.stats.likes + (isLiked ? 1 : 0)}</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsBookmarked(!isBookmarked)}
                                    className={`p-2 rounded-full transition-colors ${isBookmarked
                                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-blue-100 hover:text-blue-600'
                                        }`}
                                >
                                    {isBookmarked ? (
                                        <BookmarkSolidIcon className="h-5 w-5" />
                                    ) : (
                                        <BookmarkIcon className="h-5 w-5" />
                                    )}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-green-100 hover:text-green-600 transition-colors"
                                >
                                    <ShareIcon className="h-5 w-5" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-yellow-100 hover:text-yellow-600 transition-colors"
                                >
                                    <FlagIcon className="h-5 w-5" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="prose prose-lg max-w-none dark:prose-invert">
                            <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
                                {debate.content}
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Arguments Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Luận điểm ({debate.stats.arguments})
                        </h2>
                        <Button
                            onClick={() => setShowArgumentForm(true)}
                            className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Thêm luận điểm
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {mockArguments.map((argument, index) => (
                            <motion.div
                                key={argument.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 * index }}
                            >
                                <Card className={`p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-l-4 ${argument.position === 'support'
                                    ? 'border-l-green-500'
                                    : 'border-l-red-500'
                                    }`}>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg">
                                            {argument.author.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    {argument.author.name}
                                                </p>
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    {argument.createdAt}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${argument.position === 'support'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                    {argument.position === 'support' ? 'Ủng hộ' : 'Phản bác'}
                                                </span>
                                            </div>
                                            <p className="text-slate-700 dark:text-slate-300 mb-4">
                                                {argument.content}
                                            </p>
                                            <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                                                <button className="flex items-center space-x-1 hover:text-red-600 transition-colors">
                                                    <HeartIcon className="h-4 w-4" />
                                                    <span>{argument.likes}</span>
                                                </button>
                                                <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                                                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                                    <span>{argument.replies} trả lời</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Argument Form Modal */}
                <AnimatePresence>
                    {showArgumentForm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setShowArgumentForm(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                    Thêm luận điểm mới
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Quan điểm
                                        </label>
                                        <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
                                            <option value="support">Ủng hộ</option>
                                            <option value="against">Phản bác</option>
                                            <option value="neutral">Trung lập</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                            Nội dung luận điểm
                                        </label>
                                        <textarea
                                            rows={4}
                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                                            placeholder="Chia sẻ quan điểm của bạn..."
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setShowArgumentForm(false)}
                                        >
                                            Hủy
                                        </Button>
                                        <Button className="bg-gradient-to-r from-red-500 to-amber-500 text-white">
                                            Đăng luận điểm
                                        </Button>
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
