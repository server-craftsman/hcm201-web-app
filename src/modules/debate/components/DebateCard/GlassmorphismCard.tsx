'use client'

import React, { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
    ChatBubbleLeftRightIcon,
    EyeIcon,
    UserIcon,
    ClockIcon,
    StarIcon,
    TagIcon,
    SparklesIcon,
    FireIcon,
    BoltIcon,
    HeartIcon,
    ShareIcon,
    BookmarkIcon,
    GlobeAltIcon,
    TrophyIcon,
    BoltIcon as LightningBoltIcon
} from '@heroicons/react/24/outline'
import {
    StarIcon as StarSolidIcon,
    HeartIcon as HeartSolidIcon,
    BookmarkIcon as BookmarkSolidIcon
} from '@heroicons/react/24/solid'
import { Card, CardContent, CardHeader } from '@/shared/components/ui'
import { DebateTopic } from '@/shared/types'
import { formatRelativeTime, cn } from '@/shared/utils'
import { DEBATE_CATEGORY_NAMES, DIFFICULTY_LEVEL_NAMES } from '@/shared/constants'

interface GlassmorphismCardProps {
    debate: DebateTopic
    showActions?: boolean
    showAuthor?: boolean
    showStats?: boolean
    variant?: 'aurora' | 'cosmic' | 'crystal' | 'neon' | 'holographic'
    className?: string
}

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
    debate,
    showActions = false,
    showAuthor = true,
    showStats = true,
    variant = 'holographic',
    className,
}) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const cardRef = useRef<HTMLDivElement>(null)

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return

        const rect = cardRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        setMousePosition({ x, y })
    }, [])

    const categoryName = DEBATE_CATEGORY_NAMES[debate.category as keyof typeof DEBATE_CATEGORY_NAMES] || debate.category
    const difficultyName = DIFFICULTY_LEVEL_NAMES[debate.difficulty as keyof typeof DIFFICULTY_LEVEL_NAMES] || debate.difficulty

    const getVariantConfig = (variant: string) => {
        switch (variant) {
            case 'aurora':
                return {
                    background: 'bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10',
                    border: 'border border-white/20',
                    glow: 'shadow-[0_8px_32px_0_rgba(168,85,247,0.4)]',
                    accent: 'bg-gradient-to-r from-purple-500 to-pink-500',
                    particles: 'from-purple-400 to-pink-400'
                }
            case 'cosmic':
                return {
                    background: 'bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10',
                    border: 'border border-white/20',
                    glow: 'shadow-[0_8px_32px_0_rgba(99,102,241,0.4)]',
                    accent: 'bg-gradient-to-r from-indigo-500 to-cyan-500',
                    particles: 'from-indigo-400 to-cyan-400'
                }
            case 'crystal':
                return {
                    background: 'bg-gradient-to-br from-blue-500/10 via-teal-500/10 to-green-500/10',
                    border: 'border border-white/20',
                    glow: 'shadow-[0_8px_32px_0_rgba(59,130,246,0.4)]',
                    accent: 'bg-gradient-to-r from-blue-500 to-teal-500',
                    particles: 'from-blue-400 to-teal-400'
                }
            case 'neon':
                return {
                    background: 'bg-gradient-to-br from-green-500/10 via-yellow-500/10 to-orange-500/10',
                    border: 'border border-white/20',
                    glow: 'shadow-[0_8px_32px_0_rgba(34,197,94,0.4)]',
                    accent: 'bg-gradient-to-r from-green-500 to-yellow-500',
                    particles: 'from-green-400 to-yellow-400'
                }
            default: // holographic
                return {
                    background: 'bg-gradient-to-br from-rose-500/10 via-violet-500/10 to-cyan-500/10',
                    border: 'border border-white/30',
                    glow: 'shadow-[0_8px_32px_0_rgba(236,72,153,0.4)]',
                    accent: 'bg-gradient-to-r from-rose-500 to-violet-500',
                    particles: 'from-rose-400 to-violet-400'
                }
        }
    }

    const config = getVariantConfig(variant)

    const HolographicOverlay = () => (
        <motion.div
            className="absolute inset-0 opacity-0 pointer-events-none"
            animate={{
                opacity: isHovered ? 0.3 : 0,
                background: [
                    'radial-gradient(circle at 20% 30%, rgba(255,0,150,0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 70%, rgba(0,150,255,0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 40% 80%, rgba(150,255,0,0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 60% 20%, rgba(255,150,0,0.3) 0%, transparent 50%)',
                ]
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
            }}
        />
    )

    const FloatingOrbs = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${config.particles} opacity-60 blur-sm`}
                    initial={{
                        x: Math.random() * 100 + '%',
                        y: Math.random() * 100 + '%',
                    }}
                    animate={{
                        x: [null, Math.random() * 100 + '%', Math.random() * 100 + '%'],
                        y: [null, Math.random() * 100 + '%', Math.random() * 100 + '%'],
                        scale: [0.5, 1, 0.5],
                        opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{
                        duration: 8 + Math.random() * 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 3
                    }}
                />
            ))}
        </div>
    )

    return (
        <motion.div
            ref={cardRef}
            className={cn('relative group cursor-pointer', className)}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            {/* Dynamic Background Gradient */}
            <motion.div
                className="absolute inset-0 rounded-3xl opacity-60 blur-xl"
                animate={{
                    background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.2) 0%, transparent 70%)`
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Glass Card */}
            <Card className={`
                relative overflow-hidden rounded-3xl border-0
                ${config.background}
                ${config.border}
                backdrop-blur-2xl
                ${isHovered ? config.glow : 'shadow-xl'}
                transition-all duration-500
                before:absolute before:inset-0 
                before:bg-gradient-to-br before:from-white/10 before:to-white/5
                before:backdrop-blur-sm before:pointer-events-none
            `}>

                {/* Holographic Overlay */}
                <HolographicOverlay />

                {/* Floating Orbs */}
                <AnimatePresence>
                    {isHovered && <FloatingOrbs />}
                </AnimatePresence>

                {/* Animated Border */}
                <motion.div
                    className="absolute inset-0 rounded-3xl"
                    initial={{ background: 'conic-gradient(from 0deg, transparent, transparent)' }}
                    animate={{
                        background: isHovered
                            ? [
                                'conic-gradient(from 0deg, #ff006e, #3a86ff, #06ffa5, #ffbe0b, #ff006e)',
                                'conic-gradient(from 180deg, #ff006e, #3a86ff, #06ffa5, #ffbe0b, #ff006e)',
                                'conic-gradient(from 360deg, #ff006e, #3a86ff, #06ffa5, #ffbe0b, #ff006e)'
                            ]
                            : 'conic-gradient(from 0deg, transparent, transparent)'
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'subtract',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'subtract',
                        padding: '2px'
                    }}
                />

                {/* Status Badges */}
                <div className="absolute top-6 right-6 z-20 flex flex-col gap-3">
                    <AnimatePresence>
                        {debate.isFeatured && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0, rotate: 180 }}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400/90 to-yellow-500/90 text-white rounded-2xl text-sm font-bold shadow-lg backdrop-blur-md border border-white/20"
                            >
                                <StarSolidIcon className="h-4 w-4" />
                                <span>FEATURED</span>
                                <motion.div
                                    className="absolute inset-0 rounded-2xl bg-white/20"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [0.5, 0, 0.5]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity
                                    }}
                                />
                            </motion.div>
                        )}

                        {/* Difficulty Badge */}
                        <motion.div
                            className={`px-4 py-2 rounded-2xl text-sm font-bold backdrop-blur-md border border-white/20 ${debate.difficulty === 'basic' ? 'bg-gradient-to-r from-green-400/90 to-emerald-500/90 text-white' :
                                    debate.difficulty === 'intermediate' ? 'bg-gradient-to-r from-amber-400/90 to-orange-500/90 text-white' :
                                        'bg-gradient-to-r from-red-400/90 to-rose-500/90 text-white'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {difficultyName.toUpperCase()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Interactive Action Buttons */}
                <div className="absolute top-6 left-6 z-20 flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            e.preventDefault()
                            setIsLiked(!isLiked)
                        }}
                        className={`p-3 rounded-2xl backdrop-blur-md border border-white/20 transition-all duration-300 ${isLiked
                                ? 'bg-red-500/80 text-white shadow-lg'
                                : 'bg-white/10 text-white/80 hover:bg-white/20'
                            }`}
                    >
                        {isLiked ? (
                            <HeartSolidIcon className="h-5 w-5" />
                        ) : (
                            <HeartIcon className="h-5 w-5" />
                        )}
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            e.preventDefault()
                            setIsBookmarked(!isBookmarked)
                        }}
                        className={`p-3 rounded-2xl backdrop-blur-md border border-white/20 transition-all duration-300 ${isBookmarked
                                ? 'bg-blue-500/80 text-white shadow-lg'
                                : 'bg-white/10 text-white/80 hover:bg-white/20'
                            }`}
                    >
                        {isBookmarked ? (
                            <BookmarkSolidIcon className="h-5 w-5" />
                        ) : (
                            <BookmarkIcon className="h-5 w-5" />
                        )}
                    </motion.button>
                </div>

                <Link href={`/debates/${debate.id}`} className="block relative z-10">
                    <CardHeader className="p-8 pb-6">
                        {/* Category Tag */}
                        <motion.div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold mb-6 ${config.accent} text-white shadow-lg backdrop-blur-md border border-white/20`}
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <TagIcon className="h-4 w-4" />
                            <span>{categoryName}</span>
                        </motion.div>

                        {/* Title with Gradient Text Effect */}
                        <motion.h3
                            className="text-3xl font-bold text-white leading-tight mb-4 line-clamp-2"
                            style={{
                                background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #ffffff 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundSize: '200% 200%',
                            }}
                            animate={{
                                backgroundPosition: isHovered ? '100% 100%' : '0% 0%'
                            }}
                            transition={{ duration: 0.5 }}
                        >
                            {debate.title}
                        </motion.h3>

                        {/* Description */}
                        <motion.p
                            className="text-white/80 text-lg leading-relaxed line-clamp-3"
                            initial={{ opacity: 0.7 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {debate.description}
                        </motion.p>
                    </CardHeader>

                    <CardContent className="px-8 pb-8">
                        {/* Author Section */}
                        {showAuthor && debate.author && (
                            <motion.div
                                className="flex items-center gap-4 mb-8 p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20"
                                whileHover={{
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                    scale: 1.02
                                }}
                                transition={{ duration: 0.3 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                layoutId={`author-${debate.id}`}
                            >
                                <div className="relative">
                                    {debate.author.avatar && debate.author.avatar !== '👤' && !debate.author.avatar.startsWith('http') ? (
                                        <div className={`w-16 h-16 rounded-3xl ${config.accent} flex items-center justify-center text-white text-xl font-bold shadow-xl border-2 border-white/30`}>
                                            {debate.author.avatar}
                                        </div>
                                    ) : debate.author.avatar && debate.author.avatar.startsWith('http') ? (
                                        <img
                                            src={debate.author.avatar}
                                            alt={debate.author.name}
                                            className="w-16 h-16 rounded-3xl object-cover shadow-xl border-2 border-white/30"
                                        />
                                    ) : (
                                        <div className={`w-16 h-16 rounded-3xl ${config.accent} flex items-center justify-center text-white text-xl font-bold shadow-xl border-2 border-white/30`}>
                                            {debate.author.name?.charAt(0)?.toUpperCase() || '👤'}
                                        </div>
                                    )}

                                    {/* Status Indicator */}
                                    <motion.div
                                        className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>

                                <div className="flex-1">
                                    <div className="font-bold text-white text-xl mb-1">
                                        {debate.author.name}
                                    </div>
                                    <div className="text-white/60 text-base flex items-center gap-2">
                                        <ClockIcon className="h-5 w-5" />
                                        {formatRelativeTime(debate.createdAt)}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Enhanced Stats Grid */}
                        {showStats && (
                            <motion.div
                                className="grid grid-cols-3 gap-4"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                {[
                                    {
                                        icon: ChatBubbleLeftRightIcon,
                                        value: debate.argumentCount || 0,
                                        label: 'Luận điểm',
                                        gradient: 'from-blue-400 to-cyan-500',
                                        iconColor: 'text-blue-300'
                                    },
                                    {
                                        icon: EyeIcon,
                                        value: debate.viewCount || 0,
                                        label: 'Lượt xem',
                                        gradient: 'from-green-400 to-emerald-500',
                                        iconColor: 'text-green-300'
                                    },
                                    {
                                        icon: TrophyIcon,
                                        value: (debate as any).totalApprovedArguments || 0,
                                        label: 'Đã duyệt',
                                        gradient: 'from-amber-400 to-orange-500',
                                        iconColor: 'text-amber-300'
                                    }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        className="relative group"
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.1 }}
                                    >
                                        <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                                                    <stat.icon className="h-6 w-6 text-white" />
                                                </div>

                                                <motion.div
                                                    className="text-2xl font-bold text-white"
                                                    animate={{
                                                        scale: isHovered ? 1.1 : 1,
                                                        textShadow: isHovered ? '0 0 20px rgba(255,255,255,0.5)' : '0 0 0px rgba(255,255,255,0)'
                                                    }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {stat.value}
                                                </motion.div>

                                                <div className="text-sm font-medium text-white/70">
                                                    {stat.label}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Glow Effect */}
                                        <motion.div
                                            className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.gradient} opacity-0 blur-xl`}
                                            whileHover={{ opacity: 0.3 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </CardContent>
                </Link>

                {/* Premium Shine Effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{
                        x: isHovered ? '200%' : '-100%',
                        opacity: isHovered ? 1 : 0
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                />
            </Card>
        </motion.div>
    )
}