import React from 'react'
import Link from 'next/link'
import {
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    HomeIcon,
    ChatBubbleLeftRightIcon,
    AcademicCapIcon,
    InformationCircleIcon,
    QuestionMarkCircleIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    HeartIcon
} from '@heroicons/react/24/outline'
// import { motion } from 'framer-motion' // Will be added when framer-motion is installed

const quickLinks = [
    { name: 'Trang chủ', href: '/', icon: HomeIcon },
    { name: 'Tranh luận', href: '/debates', icon: ChatBubbleLeftRightIcon },
    { name: 'Học tập', href: '/study', icon: AcademicCapIcon },
    { name: 'Giới thiệu', href: '/about', icon: InformationCircleIcon },
]

const resources = [
    { name: 'Hướng dẫn', href: '/help', icon: InformationCircleIcon },
    { name: 'Câu hỏi thường gặp', href: '/faq', icon: QuestionMarkCircleIcon },
    { name: 'Liên hệ', href: '/contact', icon: EnvelopeIcon },
    { name: 'Chính sách bảo mật', href: '/privacy', icon: ShieldCheckIcon },
]

export const Footer: React.FC = () => {
    return (
        <footer className="relative overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900" />

            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-secondary-500 to-primary-500 rounded-full blur-3xl" />
            </div>

            <div className="relative container-luxury text-white">
                <div className="section-padding-luxury">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Brand */}
                        <div className="space-y-6 lg:col-span-1">
                            <div className="flex items-center space-x-4">
                                <div className="relative w-14 h-14 hcm-gradient-luxury rounded-2xl flex items-center justify-center shadow-luxury animate-luxury-glow">
                                    <span className="text-white font-bold text-2xl font-serif">H</span>
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 via-transparent to-transparent" />
                                </div>
                                <div>
                                    <h2 className="hcm-text-gradient-luxury font-bold text-xl font-serif">
                                        Tranh luận Tư tưởng HCM
                                    </h2>
                                    <p className="text-sm text-neutral-300 font-medium">
                                        Nền tảng học tập chuyên nghiệp
                                    </p>
                                </div>
                            </div>
                            <p className="text-neutral-300 text-base leading-relaxed">
                                Nền tảng thảo luận và học tập về tư tưởng Hồ Chí Minh,
                                nơi sinh viên khám phá những giá trị vĩnh cửu của Bác.
                            </p>
                            <div className="flex items-center space-x-2 text-primary-300">
                                <HeartIcon className="h-5 w-5 animate-pulse" />
                                <span className="text-sm font-medium">Tạo nên bởi tình yêu Hồ Chí Minh</span>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="font-bold text-xl mb-6 text-white font-serif">Liên kết nhanh</h3>
                            <ul className="space-y-4">
                                {quickLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="flex items-center space-x-3 text-neutral-300 hover:text-white transition-all duration-300 group hover:translate-x-2"
                                        >
                                            <div className="w-8 h-8 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center group-hover:bg-primary-500/20 transition-all duration-300">
                                                <link.icon className="h-4 w-4 group-hover:text-primary-300 transition-colors" />
                                            </div>
                                            <span className="text-base font-medium">{link.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h3 className="font-bold text-xl mb-6 text-white font-serif">Tài nguyên</h3>
                            <ul className="space-y-4">
                                {resources.map((resource) => (
                                    <li key={resource.name}>
                                        <Link
                                            href={resource.href}
                                            className="flex items-center space-x-3 text-neutral-300 hover:text-white transition-all duration-300 group hover:translate-x-2"
                                        >
                                            <div className="w-8 h-8 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center group-hover:bg-secondary-500/20 transition-all duration-300">
                                                <resource.icon className="h-4 w-4 group-hover:text-secondary-300 transition-colors" />
                                            </div>
                                            <span className="text-base font-medium">{resource.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="font-bold text-xl mb-6 text-white font-serif">Liên hệ</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 text-neutral-300 group">
                                    <div className="w-10 h-10 bg-primary-500/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                                        <EnvelopeIcon className="h-5 w-5 text-primary-300" />
                                    </div>
                                    <span className="text-base font-medium">support@hcm201.edu.vn</span>
                                </div>
                                <div className="flex items-center space-x-3 text-neutral-300 group">
                                    <div className="w-10 h-10 bg-secondary-500/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                                        <PhoneIcon className="h-5 w-5 text-secondary-300" />
                                    </div>
                                    <span className="text-base font-medium">(84) 123 456 789</span>
                                </div>
                                <div className="flex items-start space-x-3 text-neutral-300 group">
                                    <div className="w-10 h-10 bg-emerald-500/20 backdrop-blur-lg rounded-xl flex items-center justify-center mt-1">
                                        <MapPinIcon className="h-5 w-5 text-emerald-300" />
                                    </div>
                                    <span className="text-base font-medium leading-relaxed">
                                        Đại học XYZ, Hà Nội, Việt Nam
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/20 py-8 mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 hcm-gradient-luxury rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-sm">©</span>
                            </div>
                            <p className="text-base text-neutral-300 font-medium">
                                2024 Tranh luận Tư tưởng Hồ Chí Minh. Tất cả quyền được bảo lưu.
                            </p>
                        </div>
                        <div className="flex items-center space-x-8">
                            <Link
                                href="/terms"
                                className="flex items-center space-x-2 text-base text-neutral-300 hover:text-white transition-all duration-300 group hover:-translate-y-1"
                            >
                                <div className="w-8 h-8 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center group-hover:bg-primary-500/20 transition-all duration-300">
                                    <DocumentTextIcon className="h-4 w-4 group-hover:text-primary-300 transition-colors" />
                                </div>
                                <span className="font-medium">Điều khoản</span>
                            </Link>
                            <Link
                                href="/privacy"
                                className="flex items-center space-x-2 text-base text-neutral-300 hover:text-white transition-all duration-300 group hover:-translate-y-1"
                            >
                                <div className="w-8 h-8 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center group-hover:bg-secondary-500/20 transition-all duration-300">
                                    <ShieldCheckIcon className="h-4 w-4 group-hover:text-secondary-300 transition-colors" />
                                </div>
                                <span className="font-medium">Bảo mật</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}