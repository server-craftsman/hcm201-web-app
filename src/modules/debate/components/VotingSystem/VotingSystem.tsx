import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    ChartBarIcon,
    FireIcon,
    UsersIcon,
    TrophyIcon
} from '@heroicons/react/24/outline'
import {
    HandThumbUpIcon as HandThumbUpSolid,
    HandThumbDownIcon as HandThumbDownSolid
} from '@heroicons/react/24/solid'
import { cn } from '@/shared/utils/shadcn'
import { VoteStats, CreateVoteData } from '@/modules/debate/api/voteApi'

interface VotingSystemProps {
    threadId: string
    stats: VoteStats
    userVote?: 'SUPPORT' | 'OPPOSE' | null
    onVote: (data: CreateVoteData) => Promise<void>
    isLoading?: boolean
    disabled?: boolean
    showDetailedStats?: boolean
    className?: string
}

export const VotingSystem: React.FC<VotingSystemProps> = ({
    threadId,
    stats,
    userVote,
    onVote,
    isLoading = false,
    disabled = false,
    showDetailedStats = true,
    className
}) => {
    const [isVoting, setIsVoting] = useState(false)
    const [animationKey, setAnimationKey] = useState(0)
    const [showCelebration, setShowCelebration] = useState(false)

    const handleVote = async (voteType: 'SUPPORT' | 'OPPOSE') => {
        if (isVoting || disabled || userVote === voteType) return

        setIsVoting(true)
        try {
            await onVote({ threadId, voteType })
            setAnimationKey(prev => prev + 1)
            setShowCelebration(true)
            setTimeout(() => setShowCelebration(false), 2000)
        } catch (error) {
            console.error('Error voting:', error)
        } finally {
            setIsVoting(false)
        }
    }

    const getBattleAnimation = () => {
        const supportWinning = stats.supportPercentage > stats.opposePercentage
        const isClose = Math.abs(stats.supportPercentage - stats.opposePercentage) < 10

        if (isClose) {
            return "animate-pulse"
        }

        return supportWinning ? "animate-bounce" : ""
    }

    const getVoteButtonConfig = (type: 'SUPPORT' | 'OPPOSE') => {
        const isSelected = userVote === type
        const isSupport = type === 'SUPPORT'

        return {
            icon: isSupport ? HandThumbUpIcon : HandThumbDownIcon,
            iconSolid: isSupport ? HandThumbUpSolid : HandThumbDownSolid,
            label: isSupport ? 'Ủng hộ' : 'Phản đối',
            count: isSupport ? stats.support : stats.oppose,
            percentage: isSupport ? stats.supportPercentage : stats.opposePercentage,
            baseColor: isSupport ? 'emerald' : 'rose',
            selectedColor: isSupport ? 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-200' : 'bg-rose-500 border-rose-600 text-white shadow-rose-200',
            hoverColor: isSupport ? 'hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700' : 'hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700',
            defaultColor: 'bg-white border-gray-300 text-gray-700'
        }
    }

    const supportConfig = getVoteButtonConfig('SUPPORT')
    const opposeConfig = getVoteButtonConfig('OPPOSE')

    return (
        <div className={cn("space-y-6", className)}>
            {/* Voting Buttons */}
            <div className="grid grid-cols-2 gap-4">
                {/* Support Button */}
                <motion.button
                    onClick={() => handleVote('SUPPORT')}
                    disabled={isVoting || disabled}
                    className={cn(
                        "relative p-6 rounded-xl border-2 transition-all duration-300 transform",
                        userVote === 'SUPPORT' ? supportConfig.selectedColor : supportConfig.defaultColor,
                        !disabled && !isVoting && supportConfig.hoverColor,
                        (isVoting || disabled) && "opacity-50 cursor-not-allowed",
                        getBattleAnimation()
                    )}
                    whileHover={!disabled && !isVoting ? { scale: 1.05, y: -5 } : {}}
                    whileTap={!disabled && !isVoting ? { scale: 0.95 } : {}}
                    key={`support-${animationKey}`}
                >
                    <div className="flex flex-col items-center space-y-3">
                        <motion.div
                            className="relative"
                            animate={userVote === 'SUPPORT' ? { rotate: [0, 10, -10, 0] } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            {userVote === 'SUPPORT' ? (
                                <HandThumbUpSolid className="h-12 w-12" />
                            ) : (
                                <HandThumbUpIcon className="h-12 w-12" />
                            )}

                            {/* Particle effect */}
                            {showCelebration && userVote === 'SUPPORT' && (
                                <div className="absolute -inset-4">
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                                            initial={{ scale: 0, x: 0, y: 0 }}
                                            animate={{
                                                scale: [0, 1, 0],
                                                x: Math.cos(i * 60 * Math.PI / 180) * 30,
                                                y: Math.sin(i * 60 * Math.PI / 180) * 30,
                                            }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        <div className="text-center">
                            <h3 className="font-bold text-lg">{supportConfig.label}</h3>
                            <motion.p
                                className="text-2xl font-bold"
                                key={`support-count-${stats.support}`}
                                initial={{ scale: 1.2, color: '#10b981' }}
                                animate={{ scale: 1, color: 'inherit' }}
                                transition={{ duration: 0.3 }}
                            >
                                {stats.support}
                            </motion.p>
                            <p className="text-sm opacity-75">{stats.supportPercentage}%</p>
                        </div>
                    </div>

                    {userVote === 'SUPPORT' && (
                        <motion.div
                            className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{ type: "spring", damping: 15 }}
                        >
                            <TrophyIcon className="h-4 w-4" />
                        </motion.div>
                    )}
                </motion.button>

                {/* Oppose Button */}
                <motion.button
                    onClick={() => handleVote('OPPOSE')}
                    disabled={isVoting || disabled}
                    className={cn(
                        "relative p-6 rounded-xl border-2 transition-all duration-300 transform",
                        userVote === 'OPPOSE' ? opposeConfig.selectedColor : opposeConfig.defaultColor,
                        !disabled && !isVoting && opposeConfig.hoverColor,
                        (isVoting || disabled) && "opacity-50 cursor-not-allowed"
                    )}
                    whileHover={!disabled && !isVoting ? { scale: 1.05, y: -5 } : {}}
                    whileTap={!disabled && !isVoting ? { scale: 0.95 } : {}}
                    key={`oppose-${animationKey}`}
                >
                    <div className="flex flex-col items-center space-y-3">
                        <motion.div
                            className="relative"
                            animate={userVote === 'OPPOSE' ? { rotate: [0, -10, 10, 0] } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            {userVote === 'OPPOSE' ? (
                                <HandThumbDownSolid className="h-12 w-12" />
                            ) : (
                                <HandThumbDownIcon className="h-12 w-12" />
                            )}

                            {/* Particle effect */}
                            {showCelebration && userVote === 'OPPOSE' && (
                                <div className="absolute -inset-4">
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-2 h-2 bg-rose-400 rounded-full"
                                            initial={{ scale: 0, x: 0, y: 0 }}
                                            animate={{
                                                scale: [0, 1, 0],
                                                x: Math.cos(i * 60 * Math.PI / 180) * 30,
                                                y: Math.sin(i * 60 * Math.PI / 180) * 30,
                                            }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        <div className="text-center">
                            <h3 className="font-bold text-lg">{opposeConfig.label}</h3>
                            <motion.p
                                className="text-2xl font-bold"
                                key={`oppose-count-${stats.oppose}`}
                                initial={{ scale: 1.2, color: '#f43f5e' }}
                                animate={{ scale: 1, color: 'inherit' }}
                                transition={{ duration: 0.3 }}
                            >
                                {stats.oppose}
                            </motion.p>
                            <p className="text-sm opacity-75">{stats.opposePercentage}%</p>
                        </div>
                    </div>

                    {userVote === 'OPPOSE' && (
                        <motion.div
                            className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{ type: "spring", damping: 15 }}
                        >
                            <TrophyIcon className="h-4 w-4" />
                        </motion.div>
                    )}
                </motion.button>
            </div>

            {/* Battle Progress Bar */}
            <div className="bg-gray-100 rounded-full h-4 relative overflow-hidden">
                <motion.div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                    initial={{ width: '50%' }}
                    animate={{ width: `${stats.supportPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
                <motion.div
                    className="absolute right-0 top-0 h-full bg-gradient-to-l from-rose-400 to-rose-500"
                    initial={{ width: '50%' }}
                    animate={{ width: `${stats.opposePercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />

                {/* Battle line */}
                <div
                    className="absolute top-0 h-full w-1 bg-white shadow-lg transition-all duration-1000"
                    style={{ left: `${stats.supportPercentage}%` }}
                />
            </div>

            {/* Detailed Stats */}
            {showDetailedStats && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-3 gap-4"
                >
                    {/* Total Votes */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-500 rounded-lg">
                                <UsersIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-blue-600">Tổng bình chọn</p>
                                <motion.p
                                    className="text-xl font-bold text-blue-900"
                                    key={`total-${stats.totalVotes}`}
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {stats.totalVotes}
                                </motion.p>
                            </div>
                        </div>
                    </div>

                    {/* Leading Side */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-amber-500 rounded-lg">
                                <TrophyIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-amber-600">Đang dẫn đầu</p>
                                <p className="text-lg font-bold text-amber-900">
                                    {stats.supportPercentage > stats.opposePercentage ? 'Ủng hộ' :
                                        stats.opposePercentage > stats.supportPercentage ? 'Phản đối' : 'Hòa'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Battle Intensity */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-500 rounded-lg">
                                <FireIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-purple-600">Độ kịch tính</p>
                                <p className="text-lg font-bold text-purple-900">
                                    {Math.abs(stats.supportPercentage - stats.opposePercentage) < 10 ? 'Rất cao' :
                                        Math.abs(stats.supportPercentage - stats.opposePercentage) < 30 ? 'Cao' :
                                            'Trung bình'}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Loading Overlay */}
            <AnimatePresence>
                {(isLoading || isVoting) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-blue-600 font-medium">
                                {isVoting ? 'Đang gửi bình chọn...' : 'Đang tải...'}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Celebration Overlay */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <motion.div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-xl"
                            animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="font-bold text-lg">🎉 Cảm ơn bạn đã bình chọn!</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
