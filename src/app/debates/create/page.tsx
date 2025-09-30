'use client'

import React from 'react'
import { ThreadRequestForm } from '@/modules/debate/components/ThreadRequestForm'
import Link from 'next/link'
import { CreateThreadRequestData, threadApi } from '@/modules/debate/api/threadApi'
const CreateDebateThreadPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Tạo chủ đề tranh luận</h1>
                    <Link href="/debates" className="text-sm text-blue-600 hover:underline">← Quay lại danh sách</Link>
                </div>

                <ThreadRequestForm onSubmit={async (data: CreateThreadRequestData) => {
                    await threadApi.createThreadRequest(data)
                }} />
            </div>
        </div>
    )
}

export default CreateDebateThreadPage


