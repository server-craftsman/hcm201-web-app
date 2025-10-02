'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type QuizQuestion = {
    id: number
    question: string
    options: string[]
    correct: number
    explanation: string
    category: string
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: 1,
        question: "Tư tưởng Hồ Chí Minh về độc lập dân tộc được thể hiện rõ nhất qua câu nói nào?",
        options: [
            "Không có gì quý hơn độc lập, tự do",
            "Độc lập dân tộc gắn liền với chủ nghĩa xã hội",
            "Dân tộc Việt Nam có quyền được sống trong độc lập và tự do",
            "Tất cả các câu trên"
        ],
        correct: 3,
        explanation: "Tư tưởng Hồ Chí Minh về độc lập dân tộc là một hệ thống quan điểm toàn diện, được thể hiện qua nhiều câu nói và hành động cụ thể.",
        category: "Độc lập dân tộc"
    },
    {
        id: 2,
        question: "Nguyên tắc 'Dĩ bất biến, ứng vạn biến' của Hồ Chí Minh có nghĩa là gì?",
        options: [
            "Luôn thay đổi theo hoàn cảnh",
            "Giữ vững mục tiêu cơ bản, linh hoạt trong phương pháp",
            "Không bao giờ thay đổi",
            "Ứng phó với mọi tình huống"
        ],
        correct: 1,
        explanation: "Nguyên tắc này thể hiện sự kiên định về mục tiêu cách mạng nhưng linh hoạt trong cách thức thực hiện, phù hợp với từng giai đoạn lịch sử.",
        category: "Phương pháp cách mạng"
    },
    {
        id: 3,
        question: "Tư tưởng Hồ Chí Minh về đạo đức cách mạng bao gồm những phẩm chất nào?",
        options: [
            "Trung với nước, hiếu với dân",
            "Cần, kiệm, liêm, chính, chí công vô tư",
            "Yêu thương con người",
            "Tất cả các phẩm chất trên"
        ],
        correct: 3,
        explanation: "Đạo đức cách mạng Hồ Chí Minh là một hệ thống phẩm chất toàn diện, bao gồm lòng trung thành, đức tính cá nhân và tình yêu thương con người.",
        category: "Đạo đức cách mạng"
    },
    {
        id: 4,
        question: "Hồ Chí Minh coi học tập là gì?",
        options: [
            "Một việc phải làm suốt đời",
            "Chỉ cần học khi còn trẻ",
            "Học để có bằng cấp",
            "Học theo thời gian rảnh"
        ],
        correct: 0,
        explanation: "Hồ Chí Minh luôn nhấn mạnh tầm quan trọng của việc học tập liên tục, coi đây là yêu cầu cơ bản của người cách mạng.",
        category: "Học tập"
    },
    {
        id: 5,
        question: "Tư tưởng Hồ Chí Minh về đoàn kết dân tộc có đặc điểm gì?",
        options: [
            "Đoàn kết trên cơ sở giai cấp",
            "Đoàn kết toàn dân tộc",
            "Đoàn kết trong Đảng",
            "Đoàn kết quốc tế"
        ],
        correct: 1,
        explanation: "Hồ Chí Minh chủ trương đoàn kết toàn dân tộc, vượt qua mọi khác biệt để tập hợp sức mạnh chung vì độc lập dân tộc.",
        category: "Đoàn kết dân tộc"
    }
]

const CATEGORIES = [
    { name: "Tất cả", color: "bg-gradient-to-r from-slate-500 to-slate-600" },
    { name: "Độc lập dân tộc", color: "bg-gradient-to-r from-red-500 to-red-600" },
    { name: "Phương pháp cách mạng", color: "bg-gradient-to-r from-blue-500 to-blue-600" },
    { name: "Đạo đức cách mạng", color: "bg-gradient-to-r from-green-500 to-green-600" },
    { name: "Học tập", color: "bg-gradient-to-r from-purple-500 to-purple-600" },
    { name: "Đoàn kết dân tộc", color: "bg-gradient-to-r from-orange-500 to-orange-600" }
]

export default function QuizPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [score, setScore] = useState(0)
    const [quizCompleted, setQuizCompleted] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState("Tất cả")

    const filteredQuestions = selectedCategory === "Tất cả"
        ? QUIZ_QUESTIONS
        : QUIZ_QUESTIONS.filter(q => q.category === selectedCategory)

    const handleAnswerSelect = (answerIndex: number) => {
        if (showResult) return
        setSelectedAnswer(answerIndex)
    }

    const handleSubmitAnswer = () => {
        if (selectedAnswer === null) return

        setShowResult(true)
        if (selectedAnswer === filteredQuestions[currentQuestion].correct) {
            setScore(score + 1)
        }
    }

    const handleNextQuestion = () => {
        if (currentQuestion < filteredQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            setSelectedAnswer(null)
            setShowResult(false)
        } else {
            setQuizCompleted(true)
        }
    }

    const handleRestart = () => {
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setShowResult(false)
        setScore(0)
        setQuizCompleted(false)
    }

    const isCorrect = selectedAnswer === filteredQuestions[currentQuestion]?.correct
    const progress = ((currentQuestion + 1) / filteredQuestions.length) * 100

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/40 to-amber-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative overflow-hidden"
            >
                <div className="absolute inset-0">
                    <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full bg-rose-500/10 blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 w-[36rem] h-[36rem] rounded-full bg-amber-400/10 blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                    <div className="text-center">
                        <motion.h1
                            whileHover={{ scale: 1.01 }}
                            className="text-4xl md:text-6xl font-extrabold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                        >
                            Quiz Tư tưởng Hồ Chí Minh
                        </motion.h1>
                        <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                            Kiểm tra hiểu biết của bạn về tư tưởng, đạo đức và phong cách của Chủ tịch Hồ Chí Minh qua những câu hỏi thú vị và bổ ích.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* Category Filter */}
            <section className="relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {CATEGORIES.map((category) => (
                            <motion.button
                                key={category.name}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedCategory(category.name)}
                                className={`px-6 py-3 rounded-full text-white font-semibold shadow-lg transition-all ${selectedCategory === category.name
                                    ? `${category.color} shadow-xl scale-105`
                                    : 'bg-slate-400 hover:bg-slate-500'
                                    }`}
                            >
                                {category.name}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quiz Container */}
            <section className="relative">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {!quizCompleted ? (
                        <motion.div
                            key={currentQuestion}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-white/40 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden"
                        >
                            {/* Progress Bar */}
                            <div className="h-2 bg-slate-200 dark:bg-slate-700">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>

                            <div className="p-8">
                                {/* Question Header */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                                            Câu {currentQuestion + 1} / {filteredQuestions.length}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                                            {filteredQuestions[currentQuestion]?.category}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
                                        {filteredQuestions[currentQuestion]?.question}
                                    </h2>
                                </div>

                                {/* Answer Options */}
                                <div className="space-y-4 mb-8">
                                    {filteredQuestions[currentQuestion]?.options.map((option, index) => (
                                        <motion.button
                                            key={index}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAnswerSelect(index)}
                                            disabled={showResult}
                                            className={`w-full p-4 rounded-2xl text-left transition-all duration-300 ${selectedAnswer === index
                                                ? showResult
                                                    ? isCorrect
                                                        ? 'bg-green-100 border-2 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-400 dark:text-green-200'
                                                        : 'bg-red-100 border-2 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-400 dark:text-red-200'
                                                    : 'bg-rose-100 border-2 border-rose-500 text-rose-800 dark:bg-rose-900/30 dark:border-rose-400 dark:text-rose-200'
                                                : showResult && index === filteredQuestions[currentQuestion]?.correct
                                                    ? 'bg-green-100 border-2 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-400 dark:text-green-200'
                                                    : 'bg-slate-50 border-2 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600'
                                                }`}
                                        >
                                            <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {option}
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    {!showResult ? (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleSubmitAnswer}
                                            disabled={selectedAnswer === null}
                                            className={`flex-1 py-4 px-6 rounded-2xl font-semibold text-white transition-all ${selectedAnswer === null
                                                ? 'bg-slate-400 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-lg'
                                                }`}
                                        >
                                            Kiểm tra đáp án
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleNextQuestion}
                                            className="flex-1 py-4 px-6 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
                                        >
                                            {currentQuestion < filteredQuestions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
                                        </motion.button>
                                    )}
                                </div>

                                {/* Explanation */}
                                {showResult && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        transition={{ duration: 0.5 }}
                                        className={`mt-6 p-6 rounded-2xl ${isCorrect
                                            ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800'
                                            : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
                                            }`}
                                    >
                                        <h4 className={`font-semibold mb-2 ${isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                                            }`}>
                                            {isCorrect ? '✅ Chính xác!' : '❌ Chưa đúng'}
                                        </h4>
                                        <p className={`text-sm ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                                            }`}>
                                            {filteredQuestions[currentQuestion]?.explanation}
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        /* Quiz Completed */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-white/40 dark:border-slate-700 rounded-3xl shadow-2xl p-12 text-center"
                        >
                            <div className="mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center"
                                >
                                    <span className="text-4xl">🎉</span>
                                </motion.div>
                                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                                    Chúc mừng!
                                </h2>
                                <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
                                    Bạn đã hoàn thành quiz với điểm số:
                                </p>
                                <div className="text-6xl font-extrabold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent mb-6">
                                    {score}/{filteredQuestions.length}
                                </div>
                                <p className="text-lg text-slate-600 dark:text-slate-300">
                                    {score === filteredQuestions.length
                                        ? "Xuất sắc! Bạn đã nắm vững tư tưởng Hồ Chí Minh!"
                                        : score >= filteredQuestions.length * 0.8
                                            ? "Rất tốt! Bạn có hiểu biết sâu sắc về tư tưởng Hồ Chí Minh!"
                                            : "Tốt! Hãy tiếp tục học tập để hiểu rõ hơn về tư tưởng Hồ Chí Minh!"
                                    }
                                </p>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleRestart}
                                    className="px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-lg"
                                >
                                    Làm lại
                                </motion.button>
                                <Link href="/ho-chi-minh/works">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
                                    >
                                        Xem tác phẩm
                                    </motion.button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Footer CTA */}
            <section className="relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="rounded-3xl bg-gradient-to-r from-rose-500 to-amber-500 text-white p-10 shadow-2xl"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl text-white md:text-3xl font-extrabold">Tiếp tục học tập</h3>
                                <p className="text-white/90 mt-2 max-w-2xl">
                                    Khám phá thêm về tư tưởng, đạo đức và phong cách Hồ Chí Minh qua các tác phẩm và tranh luận thú vị.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <Link href="/ho-chi-minh/works" className="inline-flex items-center px-5 py-3 rounded-xl bg-white text-rose-600 font-semibold shadow hover:bg-rose-50 transition">
                                    Tác phẩm
                                </Link>
                                <Link href="/debates" className="inline-flex items-center px-5 py-3 rounded-xl bg-white/20 text-white font-semibold border border-white/30 hover:bg-white/30 transition">
                                    Tranh luận
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
