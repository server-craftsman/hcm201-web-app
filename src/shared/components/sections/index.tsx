import React from 'react'
import { Card } from '@/shared/components/ui'
import { FadeIn, SlideUp, StaggerContainer } from '@/shared'
import { HO_CHI_MINH_QUOTES } from '@/shared/constants'
import {
    ChatBubbleLeftRightIcon,
    AcademicCapIcon,
    ArrowTrendingUpIcon,
    UsersIcon,
    SparklesIcon,
    BookOpenIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline'
// import { motion } from 'framer-motion' // Will be added when framer-motion is installed

export const HoChiMinhQuotes: React.FC = () => {
    const featuredQuotes = HO_CHI_MINH_QUOTES.slice(0, 3)

    return (
        <section className="section-padding-luxury relative overflow-hidden">
            {/* Consistent background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/40 to-white/90" />
            <div className="absolute top-10 right-10 w-32 h-32 bg-primary-100/20 rounded-full blur-2xl" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-primary-200/15 rounded-full blur-2xl" />

            <div className="relative container-luxury">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <div className="w-16 h-1 hcm-gradient-luxury rounded-full" />
                        <SparklesIcon className="h-8 w-8 text-primary-500 animate-luxury-glow" />
                        <div className="w-16 h-1 hcm-gradient-luxury rounded-full" />
                    </div>
                    <SlideUp>
                        <h2 className="text-4xl md:text-5xl font-bold hcm-text-gradient-luxury mb-6 font-serif">
                            Lời dạy của Bác Hồ
                        </h2>
                    </SlideUp>
                    <FadeIn y={6}>
                        <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                            Những câu nói bất hủ của Chủ tịch Hồ Chí Minh, nguồn cảm hứng cho các thế hệ
                        </p>
                    </FadeIn>
                </div>

                <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredQuotes.map((quote, index) => (
                        <SlideUp key={quote.id} delay={index * 0.08}>
                            <Card
                                variant="luxury"
                                padding="lg"
                                className="text-center group hover:scale-105 transition-all duration-500"
                            >
                                <div className="relative">
                                    {/* Quote icon */}
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 hcm-gradient-luxury rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                        "
                                    </div>

                                    <blockquote className="space-y-6 pt-6">
                                        <p className="text-xl font-serif font-medium text-neutral-800 italic leading-relaxed">
                                            "{quote.vietnamese}"
                                        </p>
                                        <p className="text-base text-neutral-600 italic leading-relaxed">
                                            "{quote.english}"
                                        </p>
                                        <footer className="text-sm text-primary-600 font-semibold pt-4 border-t border-primary-100">
                                            {quote.context}
                                        </footer>
                                    </blockquote>
                                </div>
                            </Card>
                        </SlideUp>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    )
}

export const FeaturedDebates: React.FC = () => {
    const featuredDebates = [
        {
            id: 1,
            title: "Tính thời đại của tư tưởng Hồ Chí Minh trong bối cảnh hiện nay",
            description: "Thảo luận về sự phù hợp và ý nghĩa của tư tưởng Hồ Chí Minh trong thời đại công nghệ số",
            participants: 245,
            comments: 1200,
            category: "Tính thời đại"
        },
        {
            id: 2,
            title: "Vai trò của thanh niên trong việc kế thừa tư tưởng Hồ Chí Minh",
            description: "Cách thế hệ trẻ có thể học hỏi và áp dụng tư tưởng Bác trong cuộc sống hiện đại",
            participants: 189,
            comments: 856,
            category: "Thanh niên"
        },
        {
            id: 3,
            title: "Tư tưởng đạo đức Hồ Chí Minh và xây dựng xã hội văn minh",
            description: "Phân tích về tầm quan trọng của đạo đức trong tư tưởng Hồ Chí Minh",
            participants: 312,
            comments: 1450,
            category: "Đạo đức"
        }
    ]

    return (
        <section className="section-padding-luxury">
            <div className="container-luxury">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <ChatBubbleLeftRightIcon className="h-8 w-8 text-primary-500 animate-luxury-glow" />
                        <div className="w-16 h-1 hcm-gradient-luxury rounded-full" />
                        <ChatBubbleLeftRightIcon className="h-8 w-8 text-secondary-500 animate-luxury-glow" />
                    </div>
                    <SlideUp>
                        <h2 className="text-4xl md:text-5xl font-bold hcm-text-gradient-luxury mb-6 font-serif">
                            Chủ đề tranh luận nổi bật
                        </h2>
                    </SlideUp>
                    <FadeIn y={6}>
                        <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                            Những chủ đề được thảo luận sôi nổi nhất trong cộng đồng
                        </p>
                    </FadeIn>
                </div>

                <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredDebates.map((debate, index) => (
                        <SlideUp key={debate.id} delay={index * 0.08}>
                            <Card
                                variant="luxury"
                                hover="dramatic"
                                className="group cursor-pointer"
                            >
                                <div className="p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                                            {debate.category}
                                        </span>
                                        <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
                                    </div>

                                    <h3 className="text-xl font-bold text-neutral-800 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
                                        {debate.title}
                                    </h3>

                                    <p className="text-neutral-600 leading-relaxed">
                                        {debate.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                                        <div className="flex items-center space-x-4 text-sm text-neutral-500">
                                            <span className="flex items-center space-x-1">
                                                <UsersIcon className="h-4 w-4" />
                                                <span>{debate.participants}</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                                <span>{debate.comments}</span>
                                            </span>
                                        </div>
                                        <span className="text-primary-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                            Tham gia →
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </SlideUp>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    )
}

export const TrendingTopics: React.FC = () => {
    const trendingTopics = [
        { id: 1, title: "Chủ nghĩa yêu nước Hồ Chí Minh", views: 15420, trend: "+25%" },
        { id: 2, title: "Tư tưởng độc lập dân tộc", views: 12380, trend: "+18%" },
        { id: 3, title: "Nhân sinh quan Hồ Chí Minh", views: 11250, trend: "+22%" },
        { id: 4, title: "Dân chủ và nhân quyền", views: 9870, trend: "+15%" },
        { id: 5, title: "Giáo dục và đào tạo nhân tài", views: 8960, trend: "+12%" },
        { id: 6, title: "Văn hóa và đạo đức", views: 7850, trend: "+20%" }
    ]

    return (
        <section className="section-padding-luxury relative overflow-hidden">
            {/* Consistent background decoration with primary theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-primary-50/30" />
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary-100/20 rounded-full blur-2xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-200/15 rounded-full blur-2xl" />

            <div className="relative container-luxury">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <ArrowTrendingUpIcon className="h-8 w-8 text-primary-500 animate-luxury-glow" />
                        <div className="w-16 h-1 hcm-gradient-luxury rounded-full" />
                        <ArrowTrendingUpIcon className="h-8 w-8 text-primary-600 animate-luxury-glow" />
                    </div>
                    <SlideUp>
                        <h2 className="text-4xl md:text-5xl font-bold hcm-text-gradient-luxury mb-6 font-serif">
                            Chủ đề thịnh hành
                        </h2>
                    </SlideUp>
                    <FadeIn y={6}>
                        <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                            Những chủ đề được quan tâm nhất tuần qua
                        </p>
                    </FadeIn>
                </div>

                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trendingTopics.map((topic, index) => (
                        <SlideUp key={topic.id} delay={index * 0.06}>
                            <Card
                                variant="glass"
                                hover="subtle"
                                className="group cursor-pointer"
                            >
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
                                            <span className="text-sm font-semibold text-primary-600">
                                                #{index + 1}
                                            </span>
                                        </span>
                                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full">
                                            {topic.trend}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-neutral-800 group-hover:text-primary-600 transition-colors duration-300 leading-tight">
                                        {topic.title}
                                    </h3>

                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-sm text-neutral-500">
                                            {topic.views.toLocaleString()} lượt xem
                                        </span>
                                        <ArrowTrendingUpIcon className="h-4 w-4 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                </div>
                            </Card>
                        </SlideUp>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    )
}

export const StudyModePreview: React.FC = () => {
    const features = [
        {
            icon: BookOpenIcon,
            title: "Flashcards thông minh",
            description: "Học tập hiệu quả với hệ thống flashcard tự động điều chỉnh theo tiến độ"
        },
        {
            icon: AcademicCapIcon,
            title: "Câu hỏi trắc nghiệm",
            description: "Kho câu hỏi đa dạng với các mức độ khó khác nhau và giải thích chi tiết"
        },
        {
            icon: ChartBarIcon,
            title: "Theo dõi tiến độ",
            description: "Phân tích chi tiết kết quả học tập và đưa ra gợi ý cải thiện"
        }
    ]

    return (
        <section className="section-padding-luxury">
            <div className="container-luxury">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Content */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center space-x-4 mb-6">
                                <AcademicCapIcon className="h-8 w-8 text-primary-500 animate-luxury-glow" />
                                <div className="w-16 h-1 hcm-gradient-luxury rounded-full" />
                            </div>
                            <SlideUp>
                                <h2 className="text-4xl md:text-5xl font-bold hcm-text-gradient-luxury mb-6 font-serif">
                                    Chế độ học tập
                                </h2>
                            </SlideUp>
                            <FadeIn y={6}>
                                <p className="text-xl text-neutral-600 leading-relaxed">
                                    Học tập hiệu quả với công nghệ thông minh và phương pháp khoa học
                                </p>
                            </FadeIn>
                        </div>

                        <StaggerContainer className="space-y-6">
                            {features.map((feature, index) => (
                                <SlideUp key={index} delay={index * 0.08}>
                                    <div className="flex items-start space-x-4 group">
                                        <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center group-hover:bg-primary-200 transition-all duration-300">
                                            <feature.icon className="h-6 w-6 text-primary-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                                                {feature.title}
                                            </h3>
                                            <p className="text-neutral-600 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </SlideUp>
                            ))}
                        </StaggerContainer>

                        <div className="pt-6">
                            <FadeIn y={8}>
                                <Card variant="glass" className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-neutral-800 mb-1">
                                                Sẵn sàng bắt đầu?
                                            </h4>
                                            <p className="text-neutral-600">
                                                Tham gia vào hành trình học tập đầy thú vị
                                            </p>
                                        </div>
                                        <span className="text-primary-600 font-semibold">
                                            Bắt đầu →
                                        </span>
                                    </div>
                                </Card>
                            </FadeIn>
                        </div>
                    </div>

                    {/* Visual */}
                    <div className="relative">
                        <StaggerContainer className="grid grid-cols-2 gap-6">
                            <SlideUp>
                                <Card variant="luxury" className="p-6 transform hover:scale-105 transition-all duration-500">
                                    <div className="text-center space-y-4">
                                        <div className="w-12 h-12 hcm-gradient-luxury rounded-2xl mx-auto flex items-center justify-center">
                                            <span className="text-white font-bold text-xl">?</span>
                                        </div>
                                        <h4 className="font-bold text-neutral-800">Câu hỏi</h4>
                                        <p className="text-sm text-neutral-600">500+ câu hỏi</p>
                                    </div>
                                </Card>
                            </SlideUp>

                            <SlideUp delay={0.08}>
                                <Card variant="luxury" className="p-6 transform hover:scale-105 transition-all duration-500 mt-8">
                                    <div className="text-center space-y-4">
                                        <div className="w-12 h-12 hcm-gradient-luxury rounded-2xl mx-auto flex items-center justify-center">
                                            <ChartBarIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <h4 className="font-bold text-neutral-800">Tiến độ</h4>
                                        <p className="text-sm text-neutral-600">Theo dõi chi tiết</p>
                                    </div>
                                </Card>
                            </SlideUp>

                            <SlideUp delay={0.16}>
                                <Card variant="luxury" className="p-6 transform hover:scale-105 transition-all duration-500 -mt-4">
                                    <div className="text-center space-y-4">
                                        <div className="w-12 h-12 hcm-gradient-luxury rounded-2xl mx-auto flex items-center justify-center">
                                            <BookOpenIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <h4 className="font-bold text-neutral-800">Flashcard</h4>
                                        <p className="text-sm text-neutral-600">Học thông minh</p>
                                    </div>
                                </Card>
                            </SlideUp>

                            <SlideUp delay={0.24}>
                                <Card variant="luxury" className="p-6 transform hover:scale-105 transition-all duration-500">
                                    <div className="text-center space-y-4">
                                        <div className="w-12 h-12 hcm-gradient-luxury rounded-2xl mx-auto flex items-center justify-center">
                                            <SparklesIcon className="h-6 w-6 text-white" />
                                        </div>
                                        <h4 className="font-bold text-neutral-800">AI hỗ trợ</h4>
                                        <p className="text-sm text-neutral-600">Cá nhân hóa</p>
                                    </div>
                                </Card>
                            </SlideUp>
                        </StaggerContainer>
                    </div>
                </div>
            </div>
        </section>
    )
}

export const CommunityStats: React.FC = () => {
    return (
        <section className="section-padding-luxury bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white">
            <div className="container-luxury">
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                    <SlideUp>
                        <div>
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <div className="text-primary-100">Chủ đề tranh luận</div>
                        </div>
                    </SlideUp>
                    <SlideUp delay={0.08}>
                        <div>
                            <div className="text-4xl font-bold mb-2">2,000+</div>
                            <div className="text-primary-100">Sinh viên tham gia</div>
                        </div>
                    </SlideUp>
                    <SlideUp delay={0.16}>
                        <div>
                            <div className="text-4xl font-bold mb-2">10,000+</div>
                            <div className="text-primary-100">Lượt thảo luận</div>
                        </div>
                    </SlideUp>
                    <SlideUp delay={0.24}>
                        <div>
                            <div className="text-4xl font-bold mb-2">50,000+</div>
                            <div className="text-primary-100">Câu trả lời học tập</div>
                        </div>
                    </SlideUp>
                </StaggerContainer>
            </div>
        </section>
    )
}