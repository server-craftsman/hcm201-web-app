'use client'

import React, { useState, useEffect } from 'react'
import { Button, Card } from '@/shared/components/ui'
import { StudyCard } from '../StudyCard'
import { StudySession as StudySessionType, StudyCard as StudyCardType } from '@/shared/types'

interface StudySessionProps {
    session: StudySessionType
    cards: StudyCardType[]
    onAnswer: (cardId: string, answer: string | string[], confidence: number, timeSpent: number) => void
    onComplete: () => void
    onExit: () => void
    className?: string
}

export const StudySession: React.FC<StudySessionProps> = ({
    session,
    cards,
    onAnswer,
    onComplete,
    onExit,
    className,
}) => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const [startTime, setStartTime] = useState(Date.now())
    const [cardStartTime, setCardStartTime] = useState(Date.now())
    const [totalTime, setTotalTime] = useState(0)
    const [answeredCards, setAnsweredCards] = useState<Set<string>>(new Set())
    const [sessionStats, setSessionStats] = useState({
        correct: 0,
        incorrect: 0,
        skipped: 0,
    })

    const currentCard = cards[currentCardIndex]
    const progress = ((currentCardIndex + 1) / cards.length) * 100
    const isLastCard = currentCardIndex === cards.length - 1
    const canNavigateNext = currentCardIndex < cards.length - 1
    const canNavigatePrev = currentCardIndex > 0

    // Update total time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setTotalTime(Date.now() - startTime)
        }, 1000)

        return () => clearInterval(interval)
    }, [startTime])

    // Reset card start time when card changes
    useEffect(() => {
        setCardStartTime(Date.now())
    }, [currentCardIndex])

    const handleAnswer = (answer: string | string[], confidence: number) => {
        const timeSpent = Date.now() - cardStartTime

        // Mark card as answered
        setAnsweredCards((prev: Set<string>) => new Set([...prev, String(currentCard?.id || '')]))

        // Update session stats (simplified - would need actual correctness checking)
        const isCorrect = checkAnswer(currentCard, answer)
        setSessionStats(prev => ({
            ...prev,
            correct: isCorrect ? prev.correct + 1 : prev.correct,
            incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
        }))

        // Call parent handler
        onAnswer(String(currentCard?.id || ''), answer, confidence, timeSpent)

        // Auto-advance after a short delay for non-flashcards
        if (currentCard.type !== 'flashcard') {
            setTimeout(() => {
                handleNext()
            }, 1500)
        }
    }

    const checkAnswer = (card: StudyCardType, answer: string | string[]): boolean => {
        // Simplified answer checking - would be more sophisticated in real implementation
        if (card.type === 'flashcard') return true // Flashcards are always "correct"
        if (card.type === 'true_false') {
            return answer === 'true' // Simplified check
        }
        if (card.type === 'multiple_choice' && card.options) {
            const correctOption = card.options.find(opt => opt.isCorrect)
            return correctOption?.text === answer
        }
        return false // For essay and other types, would need server-side evaluation
    }

    const handleNext = () => {
        if (canNavigateNext) {
            setCurrentCardIndex(prev => prev + 1)
        } else {
            handleComplete()
        }
    }

    const handlePrevious = () => {
        if (canNavigatePrev) {
            setCurrentCardIndex(prev => prev - 1)
        }
    }

    const handleComplete = () => {
        onComplete()
    }

    const handleSkip = () => {
        setSessionStats(prev => ({ ...prev, skipped: prev.skipped + 1 }))
        handleNext()
    }

    if (!currentCard) {
        return (
            <Card className="text-center p-12">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-neutral-900">
                        Phiên học hoàn thành!
                    </h2>
                    <p className="text-neutral-600">
                        Không có thẻ học nào để hiển thị.
                    </p>
                    <Button onClick={onExit}>Quay lại</Button>
                </div>
            </Card>
        )
    }

    return (
        <div className={className}>
            {/* Header with session info */}
            <Card className="mb-6" padding="md">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-xl font-bold text-neutral-900">
                            {session.name}
                        </h1>
                        <p className="text-sm text-neutral-600">
                            Thẻ {currentCardIndex + 1} / {cards.length}
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Time */}
                        <div className="text-center">
                            <div className="text-lg font-medium text-neutral-900">
                                {formatTime(totalTime)}
                            </div>
                            <div className="text-xs text-neutral-500">Thời gian</div>
                        </div>

                        {/* Stats */}
                        <div className="text-center">
                            <div className="text-lg font-medium text-success-600">
                                {sessionStats.correct}
                            </div>
                            <div className="text-xs text-neutral-500">Đúng</div>
                        </div>

                        <div className="text-center">
                            <div className="text-lg font-medium text-error-600">
                                {sessionStats.incorrect}
                            </div>
                            <div className="text-xs text-neutral-500">Sai</div>
                        </div>

                        <div className="text-center">
                            <div className="text-lg font-medium text-warning-600">
                                {sessionStats.skipped}
                            </div>
                            <div className="text-xs text-neutral-500">Bỏ qua</div>
                        </div>

                        {/* Exit button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onExit}
                            className="text-neutral-600"
                        >
                            Thoát
                        </Button>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-neutral-600">Tiến độ</span>
                        <span className="text-sm font-medium text-neutral-900">
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </Card>

            {/* Current study card */}
            <StudyCard
                card={currentCard}
                mode="study"
                onAnswer={handleAnswer}
                onNext={handleNext}
                onPrevious={canNavigatePrev ? handlePrevious : undefined}
            />

            {/* Additional controls */}
            <div className="mt-6 flex justify-center">
                <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-neutral-600"
                >
                    Bỏ qua thẻ này
                </Button>
            </div>

            {/* Session completion modal would go here */}
        </div>
    )
}

// Utility function to format time
function formatTime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
        return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`
    } else {
        return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
    }
}