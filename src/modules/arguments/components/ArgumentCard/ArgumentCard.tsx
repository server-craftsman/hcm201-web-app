'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card } from '@/shared/components/ui'
import { formatRelativeTime, cn } from '@/shared/utils'
import { ARGUMENT_TYPES, ARGUMENT_TYPE_NAMES, type ArgumentTypeValue } from '@/modules/arguments/constants'
import {
    ChevronUpIcon,
    ChevronDownIcon,
    ChatBubbleLeftRightIcon,
    FlagIcon,
    PencilIcon,
    TrashIcon,
    SparklesIcon
} from '@heroicons/react/24/outline'

type ArgumentSource = { title: string; url?: string; description?: string }

type ArgumentItem = {
    id: string
    type: ArgumentTypeValue | string
    content: string
    createdAt: Date | string
    isEdited?: boolean
    author?: { displayName?: string }
    sources?: ArgumentSource[]
    upvotes?: number
    downvotes?: number
    score?: number
    commentCount?: number
    children?: ArgumentItem[]
}

interface ArgumentCardProps {
    argument: ArgumentItem
    isNested?: boolean
    showVoting?: boolean
    showReplies?: boolean
    showActions?: boolean
    onVote?: (type: 'upvote' | 'downvote') => void
    onReply?: () => void
    onEdit?: () => void
    onDelete?: () => void
    onReport?: () => void
    className?: string
}

export const ArgumentCard: React.FC<ArgumentCardProps> = ({
    argument,
    isNested = false,
    showVoting = true,
    showReplies = true,
    showActions = false,
    onVote,
    onReply,
    onEdit,
    onDelete,
    onReport,
    className,
}) => {
    const [isExpanded, setIsExpanded] = useState(true)
    const [showComments, setShowComments] = useState(false)

    const getArgumentTypeColor = (type: string) => {
        switch (type) {
            case 'support': return 'border-l-success-500 bg-gradient-to-r from-success-50/80 via-success-25/60 to-white/90 shadow-success-100/50'
            case 'oppose': return 'border-l-error-500 bg-gradient-to-r from-error-50/80 via-error-25/60 to-white/90 shadow-error-100/50'
            case 'neutral': return 'border-l-warning-500 bg-gradient-to-r from-warning-50/80 via-warning-25/60 to-white/90 shadow-warning-100/50'
            case 'question': return 'border-l-primary-500 bg-gradient-to-r from-primary-50/80 via-primary-25/60 to-white/90 shadow-primary-100/50'
            case 'clarification': return 'border-l-secondary-500 bg-gradient-to-r from-secondary-50/80 via-secondary-25/60 to-white/90 shadow-secondary-100/50'
            default: return 'border-l-neutral-300 bg-gradient-to-r from-neutral-50/80 via-neutral-25/60 to-white/90'
        }
    }

    const getArgumentTypeIcon = (type: string) => {
        switch (type) {
            case 'support': return '👍'
            case 'oppose': return '👎'
            case 'neutral': return '🤔'
            case 'question': return '❓'
            case 'clarification': return '💡'
            default: return '💬'
        }
    }

    const cardVariants = {
        hidden: {
            opacity: 0,
            x: isNested ? 30 : 0,
            y: isNested ? 0 : 20,
            scale: 0.98
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    }

    const typeKey = argument.type as ArgumentTypeValue
    const argumentTypeName = (ARGUMENT_TYPE_NAMES[typeKey] ?? argument.type)

    return (
        <motion.div
            className={cn('space-y-4', isNested && 'ml-8', className)}
            variants={cardVariants as any}
            initial="hidden"
            animate="visible"
        >
            <Card className={cn(
                'argument-card overflow-hidden border-l-4 backdrop-blur-sm',
                'shadow-luxury hover:shadow-luxury-lg transition-all duration-500',
                getArgumentTypeColor(argument.type),
                !isExpanded && 'opacity-75'
            )}>
                {/* Header */}
                <motion.div
                    className="flex items-start justify-between mb-4 p-6 pb-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex items-center gap-3">
                        {/* Author avatar */}
                        <motion.div
                            className="w-10 h-10 hcm-gradient-luxury rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/20"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            {argument.author?.displayName?.charAt(0).toUpperCase() || 'U'}
                        </motion.div>

                        {/* Author info and type */}
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-neutral-800">
                                    {argument.author?.displayName || 'Người dùng ẩn danh'}
                                </span>
                                <motion.span
                                    className="px-3 py-1 text-xs rounded-full bg-white/60 backdrop-blur-sm text-neutral-700 border border-neutral-200 font-semibold shadow-sm"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {getArgumentTypeIcon(argument.type)} {argumentTypeName}
                                </motion.span>
                            </div>
                            <div className="text-sm text-neutral-500 flex items-center gap-2">
                                <span>{formatRelativeTime(argument.createdAt as any)}</span>
                                {argument.isEdited && (
                                    <motion.span
                                        className="text-neutral-400 italic"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        (đã chỉnh sửa)
                                    </motion.span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Collapse button */}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                            variant="glass"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-neutral-500 hover:text-neutral-700 w-8 h-8 p-0"
                        >
                            <motion.div
                                animate={{ rotate: isExpanded ? 0 : 180 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronUpIcon className="h-4 w-4" />
                            </motion.div>
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            className="space-y-6 px-6 pb-6"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Argument content */}
                            <motion.div
                                className="prose prose-sm max-w-none"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                            >
                                <p className="text-neutral-800 leading-relaxed whitespace-pre-wrap font-medium">
                                    {argument.content}
                                </p>
                            </motion.div>

                            {/* Sources */}
                            {argument.sources && argument.sources.length > 0 && (
                                <motion.div
                                    className="border-t border-neutral-200/50 pt-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                >
                                    <h4 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                                        <SparklesIcon className="h-4 w-4 text-primary-500" />
                                        Nguồn tham khảo:
                                    </h4>
                                    <div className="space-y-3">
                                        {argument.sources.map((source: any, index: number) => (
                                            <motion.div
                                                key={index}
                                                className="text-sm p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-neutral-200/50"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                                                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                                            >
                                                <span className="font-semibold text-neutral-800">{source.title}</span>
                                                {source.url && (
                                                    <motion.a
                                                        href={source.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-2 text-primary-600 hover:text-primary-700 font-medium"
                                                        whileHover={{ scale: 1.05 }}
                                                    >
                                                        🔗 Link
                                                    </motion.a>
                                                )}
                                                {source.description && (
                                                    <p className="text-neutral-600 mt-1 italic">{source.description}</p>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Actions bar */}
                            <motion.div
                                className="flex items-center justify-between pt-4 border-t border-neutral-200/50"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.4 }}
                            >
                                {/* Voting */}
                                {showVoting && (
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-3">
                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                <Button
                                                    variant="glass"
                                                    size="sm"
                                                    onClick={() => onVote?.('upvote')}
                                                    className="text-neutral-600 hover:text-success-600 px-3 py-1.5 font-semibold"
                                                >
                                                    👍 {argument.upvotes || 0}
                                                </Button>
                                            </motion.div>
                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                <Button
                                                    variant="glass"
                                                    size="sm"
                                                    onClick={() => onVote?.('downvote')}
                                                    className="text-neutral-600 hover:text-error-600 px-3 py-1.5 font-semibold"
                                                >
                                                    👎 {argument.downvotes || 0}
                                                </Button>
                                            </motion.div>
                                        </div>

                                        {/* Score */}
                                        <motion.div
                                            className="px-3 py-1 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-full border border-primary-200/50"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <span className="text-sm text-primary-700 font-bold">
                                                Điểm: {argument.score || 0}
                                            </span>
                                        </motion.div>
                                    </div>
                                )}

                                {/* Action buttons */}
                                <div className="flex items-center gap-2">
                                    {showReplies && (
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                variant="glass"
                                                size="sm"
                                                onClick={onReply}
                                                className="text-neutral-600 hover:text-primary-600 px-3 py-1.5 font-medium"
                                            >
                                                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1.5" />
                                                Trả lời
                                            </Button>
                                        </motion.div>
                                    )}

                                    {showActions && (
                                        <>
                                            {onEdit && (
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={onEdit}
                                                        className="text-neutral-500 hover:text-primary-600 p-1.5"
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Button>
                                                </motion.div>
                                            )}
                                            {onDelete && (
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={onDelete}
                                                        className="text-neutral-500 hover:text-error-600 p-1.5"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </Button>
                                                </motion.div>
                                            )}
                                            {onReport && (
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={onReport}
                                                        className="text-neutral-500 hover:text-warning-600 p-1.5"
                                                    >
                                                        <FlagIcon className="h-4 w-4" />
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>

            {/* Nested comments */}
            <AnimatePresence>
                {argument.children && argument.children.length > 0 && showComments && (
                    <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, staggerChildren: 0.1 }}
                    >
                        {argument.children.map((child, index) => (
                            <motion.div
                                key={child.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <ArgumentCard
                                    argument={child}
                                    isNested={true}
                                    showVoting={showVoting}
                                    showReplies={showReplies}
                                    showActions={showActions}
                                    onVote={onVote}
                                    onReply={onReply}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onReport={onReport}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}