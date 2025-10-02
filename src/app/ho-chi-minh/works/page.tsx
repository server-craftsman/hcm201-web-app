'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type Work = {
    title: string
    year?: string
    summary: string
    cover: string
    tags?: string[]
}

const WORKS: (Work & { id: string })[] = [
    {
        id: 'duong-kach-menh',
        title: 'Đường Kách Mệnh',
        year: '1927',
        summary: 'Tập hợp các bài giảng về con đường cách mạng giải phóng dân tộc; đặt nền móng tư tưởng cho phong trào cách mạng Việt Nam thời kỳ mới.',
        cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_Cbs0tqaY19-_PE8SsvifSTPCfbjXyV0ibw&s',
        tags: ['Cách mạng', 'Tư tưởng', 'Giáo dục']
    },
    {
        id: 'ban-an-che-do-thuc-dan-phap',
        title: 'Bản án chế độ thực dân Pháp',
        year: '1925',
        summary: 'Tác phẩm chính luận sắc bén vạch trần bản chất áp bức, bóc lột của chủ nghĩa thực dân; khơi dậy tinh thần đấu tranh của các dân tộc thuộc địa.',
        cover: 'https://www.nxbctqg.org.vn/img_data/images/741482510710_ban-an.jpg',
        tags: ['Chính luận', 'Phê phán', 'Giải phóng dân tộc']
    },
    {
        id: 'nhat-ky-trong-tu',
        title: 'Nhật ký trong tù',
        year: '1942 – 1943',
        summary: 'Tập thơ chữ Hán được sáng tác trong thời gian bị giam giữ, thể hiện ý chí bất khuất và tinh thần lạc quan của người chiến sĩ cách mạng.',
        cover: 'https://product.hstatic.net/1000363117/product/nhat-ky-trong-tu_c1b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8.jpg',
        tags: ['Thơ', 'Nhân văn', 'Nghị lực']
    },
    {
        id: 'tuyen-ngon-doc-lap',
        title: 'Tuyên ngôn Độc lập',
        year: '1945',
        summary: 'Bản Tuyên ngôn độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa, được đọc tại Quảng trường Ba Đình ngày 2/9/1945.',
        cover: 'https://vnn-imgs-f.vgcloud.vn/2021/09/01/22/tuyen-ngon-1.jpeg?width=0&s=dJ_sMpzdAPkAamKH3kwrpg',
        tags: ['Độc lập', 'Lịch sử', 'Chính trị']
    }
]

const QUOTES = [
    'Không có gì quý hơn độc lập, tự do.',
    'Dĩ bất biến, ứng vạn biến.',
    'Học hỏi là một việc phải tiếp tục suốt đời.'
]

export default function WorksPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/40 to-amber-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Hero */}
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
                            Tác phẩm của Chủ tịch Hồ Chí Minh
                        </motion.h1>
                        <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                            Tuyển chọn các tác phẩm tiêu biểu, phản chiếu tư tưởng, đạo đức và phong cách của Người – nguồn cảm hứng bất tận cho tinh thần độc lập, tự do.
                        </p>

                        <div className="mt-8 flex items-center justify-center gap-4">
                            <Link href="/debates" className="inline-flex items-center px-5 py-3 rounded-xl bg-rose-500 text-white shadow-lg hover:bg-rose-600 transition">
                                Khám phá tranh luận
                            </Link>
                            <a href="#works" className="inline-flex items-center px-5 py-3 rounded-xl bg-white/60 backdrop-blur border border-white shadow-lg hover:bg-white transition dark:bg-slate-800/60 dark:border-slate-700 dark:text-white">
                                Xem tác phẩm
                            </a>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Quotes */}
            <section className="relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid md:grid-cols-3 gap-6">
                        {QUOTES.map((q, i) => (
                            <motion.blockquote
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="p-6 rounded-2xl bg-white/80 backdrop-blur border border-white shadow-md dark:bg-slate-800/70 dark:border-slate-700"
                            >
                                <p className="text-lg md:text-xl font-medium text-slate-800 dark:text-slate-100">“{q}”</p>
                            </motion.blockquote>
                        ))}
                    </div>
                </div>
            </section>

            {/* Works Grid */}
            <section id="works" className="relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {WORKS.map((work, idx) => (
                            <motion.article
                                key={work.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                className="group overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 shadow-xl hover:shadow-2xl transition-shadow backdrop-blur flex flex-col h-full"
                            >
                                <Link href={`/ho-chi-minh/works/${work.id}`}>
                                    <div className="relative h-48 overflow-hidden cursor-pointer">
                                        <img
                                            src={work.cover}
                                            alt={work.title}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        {work.year && (
                                            <span className="absolute bottom-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-white/80 backdrop-blur-sm text-slate-800 shadow">
                                                {work.year}
                                            </span>
                                        )}
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="bg-white/90 backdrop-blur rounded-full p-2">
                                                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <div className="p-6 flex flex-col flex-1">
                                    <Link href={`/ho-chi-minh/works/${work.id}`}>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer line-clamp-2">
                                            {work.title}
                                        </h3>
                                    </Link>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                                        {work.summary}
                                    </p>
                                    {work.tags && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {work.tags.slice(0, 3).map((t) => (
                                                <span key={t} className="px-2.5 py-1 rounded-full text-xs bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-200 dark:border-rose-500/20">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between mt-auto">
                                        <Link
                                            href={`/ho-chi-minh/works/${work.id}`}
                                            className="inline-flex items-center px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg transition-colors"
                                        >
                                            Đọc ngay
                                        </Link>
                                        <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                1.2k
                                            </span>
                                            <span className="flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                                89
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Dòng chảy tác phẩm
                    </h2>
                    <div className="relative">
                        <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-gradient-to-b from-rose-300 via-amber-300 to-rose-300 rounded-full" />
                        <div className="space-y-12">
                            {WORKS.map((w, i) => (
                                <motion.div
                                    key={w.title}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    className={`relative grid md:grid-cols-2 gap-6 items-center ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                                >
                                    <div className={`md:col-start-${i % 2 === 0 ? '1' : '2'} bg-white/80 dark:bg-slate-800/80 border border-white/40 dark:border-slate-700 rounded-2xl p-5 shadow-lg backdrop-blur`}>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{w.title} {w.year ? `(${w.year})` : ''}</h3>
                                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{w.summary}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
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
                                <h3 className="text-2xl text-white md:text-3xl font-extrabold">Tiếp nối giá trị tinh thần</h3>
                                <p className="text-white/90 mt-2 max-w-2xl">
                                    Khơi nguồn cảm hứng học tập và sáng tạo từ những tác phẩm bất hủ – vì một Việt Nam độc lập, hùng cường, hạnh phúc.
                                </p>
                            </div>
                            <Link href="/debates" className="inline-flex items-center px-5 py-3 rounded-xl bg-white text-rose-600 font-semibold shadow hover:bg-rose-50 transition">
                                Khám phá tranh luận
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}


