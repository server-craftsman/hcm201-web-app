'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card } from '@/shared/components/ui'
import { StudyCard as StudyCardType } from '@/shared/types'
import { cn } from '@/shared/utils'
import { STUDY_CARD_TYPE_NAMES, DIFFICULTY_LEVEL_NAMES } from '@/shared/constants'
import {
    SparklesIcon,
    AcademicCapIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon,
    LightBulbIcon
} from '@heroicons/react/24/outline'

interface StudyCardProps {
    card: StudyCardType
    mode?: 'study' | 'review' | 'preview'
    showAnswer?: boolean
    onAnswer?: (answer: string | string[], confidence: number) => void
    onNext?: () => void
    onPrevious?: () => void
    onFlip?: () => void
    className?: string
}

export const StudyCard: React.FC<StudyCardProps> = ({
    card,
    mode = 'study',
    showAnswer = false,
    onAnswer,
    onNext,
    onPrevious,
    onFlip,
    className,
}) => {
    const [isFlipped, setIsFlipped] = useState(showAnswer)
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
    const [textAnswer, setTextAnswer] = useState('')
    const [confidence, setConfidence] = useState(3)
    const [hasAnswered, setHasAnswered] = useState(false)

    const cardTypeName = STUDY_CARD_TYPE_NAMES[card.type as keyof typeof STUDY_CARD_TYPE_NAMES] || card.type
    const difficultyName = DIFFICULTY_LEVEL_NAMES[card.difficulty as keyof typeof DIFFICULTY_LEVEL_NAMES] || card.difficulty

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
        onFlip?.()
    }

    const handleMultipleChoiceSelect = (optionText: string) => {
        if (hasAnswered) return

        if (card.type === 'multiple_choice') {
            setSelectedAnswers([optionText])
        } else if (card.type === 'matching') {
            // For matching, allow multiple selections
            setSelectedAnswers(prev =>
                prev.includes(optionText)
                    ? prev.filter(a => a !== optionText)
                    : [...prev, optionText]
            )
        }
    }

    const handleSubmitAnswer = () => {
        if (hasAnswered) return

        let answer: string | string[]

        switch (card.type) {
            case 'flashcard':
                answer = 'viewed'
                break
            case 'multiple_choice':
            case 'true_false':
                answer = selectedAnswers[0] || ''
                break
            case 'essay':
                answer = textAnswer
                break
            case 'matching':
                answer = selectedAnswers
                break
            default:
                answer = textAnswer
        }

        setHasAnswered(true)
        onAnswer?.(answer, confidence)
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'basic': return 'text-success-700 bg-gradient-to-r from-success-100/80 to-success-50 border border-success-200 shadow-success-100/50'
            case 'intermediate': return 'text-warning-700 bg-gradient-to-r from-warning-100/80 to-warning-50 border border-warning-200 shadow-warning-100/50'
            case 'advanced': return 'text-error-700 bg-gradient-to-r from-error-100/80 to-error-50 border border-error-200 shadow-error-100/50'
            default: return 'text-neutral-700 bg-gradient-to-r from-neutral-100/80 to-neutral-50 border border-neutral-200'
        }
    }

    const cardVariants = {
        hidden: {
            opacity: 0,
            scale: 0.95,
            y: 20
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        },
        flip: {
            rotateY: 180,
            transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
        },
        flipBack: {
            rotateY: 0,
            transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
        }
    }

    const renderCardContent = () => {
        if (card.type === 'flashcard') {
            return (
                <motion.div
                    className="text-center space-y-8"
                    style={{ perspective: '1000px' }}
                >
                    <motion.div
                        className={cn(
                            'min-h-[250px] flex items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-500',
                            isFlipped ? 'border-success-300 bg-gradient-to-br from-success-50 to-success-25' : 'border-primary-300 bg-gradient-to-br from-primary-50 to-primary-25'
                        )}
                        variants={cardVariants}
                        animate={isFlipped ? 'flip' : 'flipBack'}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <AnimatePresence mode="wait">
                            {!isFlipped ? (
                                <motion.div
                                    key="question"
                                    className="space-y-6 p-8"
                                    initial={{ opacity: 0, rotateY: -90 }}
                                    animate={{ opacity: 1, rotateY: 0 }}
                                    exit={{ opacity: 0, rotateY: 90 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.div
                                        className="w-16 h-16 mx-auto hcm-gradient-luxury rounded-full flex items-center justify-center shadow-lg"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    >
                                        <AcademicCapIcon className="h-8 w-8 text-white" />
                                    </motion.div>
                                    <h3 className="text-xl font-semibold text-neutral-800 leading-relaxed">
                                        {card.question}
                                    </h3>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            onClick={handleFlip}
                                            variant="luxury"
                                            size="lg"
                                            shimmer
                                        >
                                            <SparklesIcon className="h-5 w-5 mr-2" />
                                            Xem đáp án
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="answer"
                                    className="space-y-6 p-8"
                                    initial={{ opacity: 0, rotateY: 90 }}
                                    animate={{ opacity: 1, rotateY: 0 }}
                                    exit={{ opacity: 0, rotateY: -90 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <motion.div
                                        className="w-16 h-16 mx-auto bg-gradient-to-r from-success-500 to-success-600 rounded-full flex items-center justify-center shadow-lg"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                                    >
                                        <CheckCircleIcon className="h-8 w-8 text-white" />
                                    </motion.div>
                                    <div className="text-lg text-neutral-800 font-medium leading-relaxed">
                                        {card.answer}
                                    </div>
                                    {card.explanation && (
                                        <motion.div
                                            className="text-sm text-neutral-600 italic border-t border-success-200 pt-6 bg-success-50/50 rounded-lg p-4"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <div className="flex items-start gap-2">
                                                <LightBulbIcon className="h-5 w-5 text-success-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <strong className="text-success-700">Giải thích:</strong> {card.explanation}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            onClick={handleFlip}
                                            variant="glass"
                                            size="lg"
                                        >
                                            <ArrowPathIcon className="h-5 w-5 mr-2" />
                                            Xem lại câu hỏi
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )
        }

        return (
            <motion.div
                className="space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Question */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h3 className="text-xl font-semibold text-neutral-800 mb-6 leading-relaxed font-serif">
                        {card.question}
                    </h3>
                </motion.div>

                {/* Answer options based on card type */}
                {card.type === 'multiple_choice' && card.options && (
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {card.options.map((option, index) => (
                            <motion.button
                                key={index}
                                onClick={() => handleMultipleChoiceSelect(option.text)}
                                disabled={hasAnswered}
                                className={cn(
                                    'w-full p-5 text-left border-2 rounded-xl transition-all duration-300 font-medium',
                                    'hover:shadow-lg active:scale-[0.98]',
                                    selectedAnswers.includes(option.text)
                                        ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-primary-25 shadow-primary-100/50'
                                        : 'border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50',
                                    hasAnswered && option.isCorrect && 'border-success-500 bg-gradient-to-r from-success-50 to-success-25 shadow-success-100/50',
                                    hasAnswered && selectedAnswers.includes(option.text) && !option.isCorrect && 'border-error-500 bg-gradient-to-r from-error-50 to-error-25 shadow-error-100/50',
                                    hasAnswered && 'cursor-not-allowed'
                                )}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                                whileHover={!hasAnswered ? { scale: 1.02, x: 8 } : {}}
                                whileTap={!hasAnswered ? { scale: 0.98 } : {}}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-800">{option.text}</span>
                                    <AnimatePresence>
                                        {hasAnswered && option.isCorrect && (
                                            <motion.span
                                                className="text-success-600 flex items-center gap-1"
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ duration: 0.3, type: "spring" }}
                                            >
                                                <CheckCircleIcon className="h-5 w-5" />
                                            </motion.span>
                                        )}
                                        {hasAnswered && selectedAnswers.includes(option.text) && !option.isCorrect && (
                                            <motion.span
                                                className="text-error-600 flex items-center gap-1"
                                                initial={{ scale: 0, rotate: 180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ duration: 0.3, type: "spring" }}
                                            >
                                                <XCircleIcon className="h-5 w-5" />
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <AnimatePresence>
                                    {hasAnswered && option.explanation && (
                                        <motion.div
                                            className="text-sm text-neutral-600 mt-3 pt-3 border-t border-current/20 italic"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {option.explanation}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                {card.type === 'true_false' && (
                    <div className="flex gap-4">
                        <button
                            onClick={() => handleMultipleChoiceSelect('true')}
                            disabled={hasAnswered}
                            className={cn(
                                'flex-1 p-4 border-2 rounded-lg transition-all',
                                selectedAnswers.includes('true')
                                    ? 'border-success-500 bg-success-50'
                                    : 'border-neutral-200 hover:border-neutral-300',
                                hasAnswered && 'cursor-not-allowed'
                            )}
                        >
                            ✓ Đúng
                        </button>
                        <button
                            onClick={() => handleMultipleChoiceSelect('false')}
                            disabled={hasAnswered}
                            className={cn(
                                'flex-1 p-4 border-2 rounded-lg transition-all',
                                selectedAnswers.includes('false')
                                    ? 'border-error-500 bg-error-50'
                                    : 'border-neutral-200 hover:border-neutral-300',
                                hasAnswered && 'cursor-not-allowed'
                            )}
                        >
                            ✗ Sai
                        </button>
                    </div>
                )}

                {card.type === 'essay' && (
                    <div className="space-y-4">
                        <textarea
                            value={textAnswer}
                            onChange={(e) => setTextAnswer(e.target.value)}
                            disabled={hasAnswered}
                            placeholder="Viết câu trả lời của bạn..."
                            className="w-full p-4 border border-neutral-300 rounded-lg min-h-[120px] resize-vertical"
                        />
                    </div>
                )}

                {/* Show correct answer after answering */}
                {hasAnswered && !isFlipped && (
                    <div className="border-t border-neutral-200 pt-4 space-y-3">
                        <div className="bg-neutral-50 p-4 rounded-lg">
                            <div className="font-medium text-neutral-900 mb-2">Đáp án đúng:</div>
                            <div className="text-neutral-800">{card.answer}</div>
                        </div>
                        {card.explanation && (
                            <div className="text-sm text-neutral-600 italic">
                                <strong>Giải thích:</strong> {card.explanation}
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        )
    }

    return (
        <motion.div
            className={cn('w-full max-w-4xl mx-auto', className)}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
        >
            <Card variant="luxury" className="overflow-hidden relative">
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-200/20 rounded-full blur-2xl" />
                    <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-secondary-200/20 rounded-full blur-2xl" />
                </div>

                {/* Header */}
                <motion.div
                    className="p-6 border-b border-neutral-100/50 bg-gradient-to-r from-white via-primary-50/30 to-white relative z-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <motion.div
                                className="w-12 h-12 hcm-gradient-luxury rounded-xl flex items-center justify-center shadow-lg"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                <AcademicCapIcon className="h-6 w-6 text-white" />
                            </motion.div>
                            <div>
                                <h2 className="text-lg font-bold text-neutral-800 font-serif">
                                    {cardTypeName}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <motion.span
                                        className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
                                            getDifficultyColor(card.difficulty)
                                        )}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <SparklesIcon className="h-3 w-3" />
                                        {difficultyName}
                                    </motion.span>
                                    {card.tags.length > 0 && (
                                        <div className="flex gap-1 ml-2">
                                            {card.tags.slice(0, 2).map((tag, index) => (
                                                <motion.span
                                                    key={index}
                                                    className="px-2 py-1 bg-white/60 backdrop-blur-sm text-neutral-600 text-xs rounded-full border border-neutral-200 font-medium"
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    #{tag}
                                                </motion.span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content */}
                <motion.div
                    className="p-8 relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {renderCardContent()}
                </motion.div>

                {/* Confidence slider and actions */}
                {mode === 'study' && (
                    <motion.div
                        className="p-6 border-t border-neutral-100/50 bg-gradient-to-r from-white via-secondary-50/30 to-white relative z-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                    >
                        {/* Confidence slider for non-flashcard types */}
                        {card.type !== 'flashcard' && !hasAnswered && (
                            <motion.div
                                className="mb-6 pb-6 border-b border-neutral-100/50"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.6 }}
                            >
                                <label className="block text-sm font-semibold text-neutral-700 mb-3">
                                    Mức độ tự tin (1 = Rất khó, 5 = Rất dễ):
                                </label>
                                <div className="space-y-3">
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={confidence}
                                        onChange={(e) => setConfidence(Number(e.target.value))}
                                        className="w-full h-2 bg-gradient-to-r from-error-200 via-warning-200 to-success-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <div className="flex justify-between text-xs text-neutral-500">
                                        <span>Rất khó</span>
                                        <span>Khó</span>
                                        <span>Bình thường</span>
                                        <span>Dễ</span>
                                        <span>Rất dễ</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-between items-center">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="ghost"
                                    onClick={onPrevious}
                                    disabled={!onPrevious}
                                >
                                    ← Trước
                                </Button>
                            </motion.div>

                            <div className="flex items-center gap-3">
                                {card.type !== 'flashcard' && !hasAnswered && (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="luxury"
                                            onClick={handleSubmitAnswer}
                                            shimmer
                                            disabled={
                                                (card.type === 'multiple_choice' && selectedAnswers.length === 0) ||
                                                (card.type === 'true_false' && selectedAnswers.length === 0) ||
                                                (card.type === 'essay' && !textAnswer.trim())
                                            }
                                        >
                                            <CheckCircleIcon className="h-5 w-5 mr-2" />
                                            Trả lời
                                        </Button>
                                    </motion.div>
                                )}

                                {(card.type === 'flashcard' || hasAnswered) && (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button variant="glass" onClick={onNext}>
                                            Tiếp theo →
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </Card>
        </motion.div>
    )
}