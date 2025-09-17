'use client'

import { RegisterForm } from '@/modules/auth'

export default function RegisterPage() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 py-24">
            <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />

                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #374151 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                }} />

                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/30 via-transparent to-indigo-50/20" />
                <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-slate-50/10 to-gray-50/30" />

                <div className="absolute top-16 left-16 w-64 h-40 bg-white/40 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 rotate-3 animate-float [animation-duration:6s]" />
                <div className="absolute top-32 right-20 w-48 h-32 bg-blue-50/30 backdrop-blur-sm rounded-xl shadow-md border border-blue-100/30 -rotate-2 animate-float [animation-delay:2s] [animation-duration:8s]" />
                <div className="absolute bottom-24 left-1/4 w-56 h-36 bg-indigo-50/25 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100/25 rotate-1 animate-float [animation-delay:4s] [animation-duration:7s]" />

                <div className="absolute inset-0 opacity-[0.03]">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: `
                            linear-gradient(to right, #6b7280 1px, transparent 1px),
                            linear-gradient(to bottom, #6b7280 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl animate-pulse [animation-duration:12s]" />
                <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-indigo-100/15 rounded-full blur-3xl animate-pulse [animation-delay:6s] [animation-duration:10s]" />
            </div>

            <div className="relative w-full max-w-md z-10">
                <RegisterForm className="mx-auto w-full max-w-sm md:max-w-md" />
            </div>
        </section>
    )
}


