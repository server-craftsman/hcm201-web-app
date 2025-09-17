'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/shared/components/ui'
import { FadeIn, SlideUp, StaggerContainer } from '@/shared'
import { HO_CHI_MINH_QUOTES } from '@/shared/constants'
import { SparklesIcon, AcademicCapIcon, ChatBubbleLeftRightIcon, UsersIcon } from '@heroicons/react/24/outline'
// import { motion } from 'framer-motion' // Will be added when framer-motion is installed

export const Hero: React.FC = () => {
    // Avoid hydration mismatch: render deterministically on server, randomize after mount
    const [quoteIndex, setQuoteIndex] = useState(0)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        // Use a more deterministic approach to avoid hydration issues
        const randomIndex = Math.floor(Math.random() * HO_CHI_MINH_QUOTES.length)
        setQuoteIndex(randomIndex)
        setIsLoaded(true)
    }, [])

    const randomQuote = HO_CHI_MINH_QUOTES[quoteIndex]

    return (
        <section className="relative min-h-screen hero-section flex items-center">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-luxury-float" />
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-luxury-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-400/10 rounded-full blur-2xl animate-luxury-float" style={{ animationDelay: '4s' }} />
            </div>

            {/* Vietnamese flag pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-20 w-8 h-8 bg-primary-500 transform rotate-45 animate-luxury-float" />
                <div className="absolute top-40 right-32 w-6 h-6 bg-secondary-500 transform rotate-45 animate-luxury-float" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-32 left-40 w-10 h-10 bg-primary-400 transform rotate-45 animate-luxury-float" style={{ animationDelay: '3s' }} />
                <div className="absolute bottom-20 right-20 w-4 h-4 bg-secondary-400 transform rotate-45 animate-luxury-float" style={{ animationDelay: '2s' }} />
            </div>

            {/* Hero content */}
            <div className="relative container-luxury z-10">
                <div className="section-padding-luxury">
                    <div className="max-w-6xl mx-auto text-center space-y-12">

                        {/* Main heading */}
                        <StaggerContainer className={`space-y-8 ${isLoaded ? '' : 'opacity-0'}`}>
                            <div className="flex items-center justify-center space-x-4 mb-6">
                                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                                <SparklesIcon className="h-8 w-8 text-primary-500 animate-luxury-glow" />
                                <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                            </div>

                            <SlideUp>
                                <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold leading-tight font-serif">
                                    <span className="block hcm-text-gradient-luxury mb-4">
                                        Tranh luận về
                                    </span>
                                    <span className="block hcm-text-gradient-luxury text-4xl md:text-5xl lg:text-6xl">
                                        Tư tưởng Hồ Chí Minh
                                    </span>
                                </h1>
                            </SlideUp>

                            <FadeIn y={8}>
                                <p className="text-2xl md:text-3xl text-neutral-700 max-w-4xl mx-auto leading-relaxed font-medium">
                                    Nền tảng thảo luận và học tập chuyên nghiệp về tư tưởng Hồ Chí Minh,
                                    <span className="block mt-2 text-primary-600">
                                        nơi sinh viên khám phá và tranh luận về những giá trị vĩnh cửu của Bác
                                    </span>
                                </p>
                            </FadeIn>
                        </StaggerContainer>

                        {/* Featured quote */}
                        <FadeIn y={12} className={`card-luxury p-12 max-w-4xl mx-auto ${isLoaded ? '' : 'opacity-0'}`}>
                            <blockquote className="space-y-6">
                                <div className="flex items-center justify-center mb-6">
                                    <div className="w-16 h-1 hcm-gradient-luxury rounded-full" />
                                    <div className="mx-4 w-8 h-8 hcm-gradient-luxury rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">"</span>
                                    </div>
                                    <div className="w-16 h-1 hcm-gradient-luxury rounded-full" />
                                </div>

                                <p className="text-2xl md:text-3xl font-serif font-medium text-neutral-800 leading-relaxed">
                                    "{randomQuote.vietnamese}"
                                </p>
                                <p className="text-lg md:text-xl text-neutral-600 italic leading-relaxed">
                                    "{randomQuote.english}"
                                </p>
                                <footer className="text-base text-primary-600 font-semibold pt-4">
                                    — Hồ Chí Minh, {randomQuote.context}
                                </footer>
                            </blockquote>
                        </FadeIn>

                        {/* CTA buttons */}
                        <StaggerContainer className={`flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 ${isLoaded ? '' : 'opacity-0'}`}>
                            <Link href="/debates">
                                <SlideUp>
                                    <Button
                                        variant="luxury"
                                        size="xl"
                                        shimmer
                                        leftIcon={<ChatBubbleLeftRightIcon className="h-6 w-6" />}
                                    >
                                        Tham gia tranh luận
                                    </Button>
                                </SlideUp>
                            </Link>

                            <Link href="/study">
                                <SlideUp delay={0.1}>
                                    <Button
                                        variant="glass"
                                        size="xl"
                                        leftIcon={<AcademicCapIcon className="h-6 w-6" />}
                                    >
                                        Bắt đầu học tập
                                    </Button>
                                </SlideUp>
                            </Link>

                            <Link href="/register">
                                <SlideUp delay={0.2}>
                                    <Button
                                        variant="outline"
                                        size="xl"
                                        leftIcon={<UsersIcon className="h-6 w-6" />}
                                    >
                                        Đăng ký ngay →
                                    </Button>
                                </SlideUp>
                            </Link>
                        </StaggerContainer>

                        {/* Stats */}
                        <StaggerContainer className={`grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 ${isLoaded ? '' : 'opacity-0'}`}>
                            <SlideUp>
                                <div className="card-glass p-8 text-center hover:scale-105 transition-all duration-500">
                                    <div className="text-5xl font-bold hcm-text-gradient-luxury font-serif mb-2">500+</div>
                                    <div className="text-lg text-neutral-600 font-medium">Chủ đề tranh luận</div>
                                    <div className="mt-4 w-16 h-1 hcm-gradient-luxury rounded-full mx-auto" />
                                </div>
                            </SlideUp>
                            <SlideUp delay={0.1}>
                                <div className="card-glass p-8 text-center hover:scale-105 transition-all duration-500">
                                    <div className="text-5xl font-bold hcm-text-gradient-luxury font-serif mb-2">2,000+</div>
                                    <div className="text-lg text-neutral-600 font-medium">Sinh viên tham gia</div>
                                    <div className="mt-4 w-16 h-1 hcm-gradient-luxury rounded-full mx-auto" />
                                </div>
                            </SlideUp>
                            <SlideUp delay={0.2}>
                                <div className="card-glass p-8 text-center hover:scale-105 transition-all duration-500">
                                    <div className="text-5xl font-bold hcm-text-gradient-luxury font-serif mb-2">10,000+</div>
                                    <div className="text-lg text-neutral-600 font-medium">Lượt thảo luận</div>
                                    <div className="mt-4 w-16 h-1 hcm-gradient-luxury rounded-full mx-auto" />
                                </div>
                            </SlideUp>
                        </StaggerContainer>
                    </div>
                </div>
            </div>

            {/* Decorative wave at bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-0">
                <svg
                    className="w-full h-24 text-white/80"
                    preserveAspectRatio="none"
                    viewBox="0 0 1200 120"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="currentColor" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,149.3L1200,139L1200,200L1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z"
                        fill="url(#waveGradient)"
                        className="animate-luxury-float"
                    />
                </svg>
            </div>
        </section>
    )
}