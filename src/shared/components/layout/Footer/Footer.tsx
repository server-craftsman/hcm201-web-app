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
    HeartIcon,
    StarIcon,
    SparklesIcon,
    FireIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline'
import logo from '@/shared/assets/images/logo.png'
import Image from 'next/image'

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
        <footer className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-900">
            {/* Animated Background Effects */}
            <div className="absolute inset-0">
                {/* Floating particles */}
                <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full opacity-60 animate-bounce delay-1000"></div>
                <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse delay-500"></div>
                <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-50 animate-bounce delay-700"></div>
                <div className="absolute bottom-10 right-1/3 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse delay-300"></div>

                {/* Gradient orbs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-red-600/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-yellow-500/20 to-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto sm:px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="flex items-start space-x-4 group">
                            <div className="relative w-16 h-16 rounded-sm flex items-start justify-start transition-all duration-500 group-hover:scale-105">
                                <Image
                                    src={logo}
                                    alt="Logo"
                                    width={50}
                                    height={50}
                                    className="object-contain rounded-sm transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white drop-shadow-lg group-hover:text-yellow-300 transition-colors duration-300">
                                    Tư tưởng Hồ Chí Minh
                                </h3>
                                <p className="text-sm text-gray-300 font-medium">
                                    Nền tảng học tập chuyên nghiệp
                                </p>
                            </div>
                        </div>

                        <p className="text-gray-300 text-base leading-relaxed">
                            Nền tảng thảo luận và học tập về tư tưởng Hồ Chí Minh,
                            nơi sinh viên khám phá những giá trị vĩnh cửu của Bác.
                        </p>

                        <div className="flex items-center space-x-2 text-yellow-400 group">
                            <HeartIcon className="h-5 w-5 animate-pulse group-hover:scale-125 transition-transform duration-300" />
                            <span className="text-sm font-medium group-hover:text-yellow-300 transition-colors duration-300">
                                Tạo nên bởi tình yêu Hồ Chí Minh
                            </span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white drop-shadow-lg">Liên kết nhanh</h3>
                        <ul className="space-y-4">
                            {quickLinks.map((link, index) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 group hover:translate-x-2"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="w-10 h-10 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center group-hover:bg-red-500/20 group-hover:scale-110 transition-all duration-300 border border-white/20 group-hover:border-red-400/30">
                                            <link.icon className="h-5 w-5 group-hover:text-yellow-300 transition-colors duration-300" />
                                        </div>
                                        <span className="text-base font-medium group-hover:font-semibold transition-all duration-300">
                                            {link.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white drop-shadow-lg">Tài nguyên</h3>
                        <ul className="space-y-4">
                            {resources.map((resource, index) => (
                                <li key={resource.name}>
                                    <Link
                                        href={resource.href}
                                        className="flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 group hover:translate-x-2"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="w-10 h-10 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center group-hover:bg-yellow-500/20 group-hover:scale-110 transition-all duration-300 border border-white/20 group-hover:border-yellow-400/30">
                                            <resource.icon className="h-5 w-5 group-hover:text-yellow-300 transition-colors duration-300" />
                                        </div>
                                        <span className="text-base font-medium group-hover:font-semibold transition-all duration-300">
                                            {resource.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white drop-shadow-lg">Liên hệ</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-gray-300 group">
                                <div className="w-12 h-12 bg-red-500/20 backdrop-blur-lg rounded-xl flex items-center justify-center group-hover:bg-red-500/30 group-hover:scale-110 transition-all duration-300 border border-red-400/20">
                                    <EnvelopeIcon className="h-6 w-6 text-red-300 group-hover:text-yellow-300 transition-colors duration-300" />
                                </div>
                                <span className="text-base font-medium group-hover:text-white transition-colors duration-300">
                                    huyit2003@gmail.com
                                </span>
                            </div>

                            <div className="flex items-center space-x-3 text-gray-300 group">
                                <div className="w-12 h-12 bg-yellow-500/20 backdrop-blur-lg rounded-xl flex items-center justify-center group-hover:bg-yellow-500/30 group-hover:scale-110 transition-all duration-300 border border-yellow-400/20">
                                    <PhoneIcon className="h-6 w-6 text-yellow-300 group-hover:text-white transition-colors duration-300" />
                                </div>
                                <span className="text-base font-medium group-hover:text-white transition-colors duration-300">
                                    (84) 869 872 830
                                </span>
                            </div>

                            <div className="flex items-start space-x-3 text-gray-300 group">
                                <div className="w-12 h-12 bg-green-500/20 backdrop-blur-lg rounded-xl flex items-center justify-center mt-1 group-hover:bg-green-500/30 group-hover:scale-110 transition-all duration-300 border border-green-400/20">
                                    <MapPinIcon className="h-6 w-6 text-green-300 group-hover:text-yellow-300 transition-colors duration-300" />
                                </div>
                                <span className="text-base font-medium leading-relaxed group-hover:text-white transition-colors duration-300">
                                    Đại học FPT, TP.HCM, Việt Nam
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/20 py-8 mt-12">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                        <div className="flex items-center space-x-3 group">
                            <span className="text-white font-bold drop-shadow-lg">©</span>
                            <p className="text-base text-gray-300 font-medium group-hover:text-white transition-colors duration-300">
                                2025 Tư tưởng Hồ Chí Minh. Tất cả quyền được bảo lưu.
                            </p>
                        </div>

                        <div className="flex items-center space-x-6">
                            <Link
                                href="/terms"
                                className="flex items-center space-x-2 text-base text-gray-300 hover:text-white transition-all duration-300 group hover:-translate-y-1"
                            >
                                <div className="w-10 h-10 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center group-hover:bg-red-500/20 group-hover:scale-110 transition-all duration-300 border border-white/20 group-hover:border-red-400/30">
                                    <DocumentTextIcon className="h-5 w-5 group-hover:text-yellow-300 transition-colors duration-300" />
                                </div>
                                <span className="font-medium group-hover:font-semibold transition-all duration-300">Điều khoản</span>
                            </Link>

                            <Link
                                href="/privacy"
                                className="flex items-center space-x-2 text-base text-gray-300 hover:text-white transition-all duration-300 group hover:-translate-y-1"
                            >
                                <div className="w-10 h-10 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center group-hover:bg-yellow-500/20 group-hover:scale-110 transition-all duration-300 border border-white/20 group-hover:border-yellow-400/30">
                                    <ShieldCheckIcon className="h-5 w-5 group-hover:text-yellow-300 transition-colors duration-300" />
                                </div>
                                <span className="font-medium group-hover:font-semibold transition-all duration-300">Bảo mật</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute top-20 left-20 opacity-20">
                <StarIcon className="h-8 w-8 text-yellow-400 animate-bounce" />
            </div>
            <div className="absolute top-40 right-20 opacity-20">
                <SparklesIcon className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div className="absolute bottom-40 left-20 opacity-20">
                <FireIcon className="h-7 w-7 text-yellow-400 animate-bounce delay-1000" />
            </div>
            <div className="absolute bottom-20 right-20 opacity-20">
                <GlobeAltIcon className="h-5 w-5 text-white animate-pulse delay-500" />
            </div>
        </footer>
    )
}