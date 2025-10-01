'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { threadApi, ThreadRequest } from '@/modules/debate/api/threadApi'

const MyThreadRequestsPage = () => {
    const [items, setItems] = useState<ThreadRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                setError(null)
                // Prefer the "mine" endpoint from swagger
                const res = await threadApi.getMyThreadRequests(1, 20)
                setItems(res.data.items)
            } catch (e) {
                setError('Không thể tải danh sách yêu cầu')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Yêu cầu chủ đề của tôi</h1>
                    <Link href="/debates/request" className="text-sm text-blue-600 hover:underline">+ Tạo yêu cầu mới</Link>
                </div>

                {loading && (
                    <div className="bg-white rounded-xl border p-6">Đang tải...</div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">{error}</div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 gap-4">
                        {items.map(item => (
                            <div key={item._id} className="bg-white rounded-xl border p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                        {item.description && (
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-2">Gửi lúc {new Date(item.createdAt).toLocaleString('vi-VN')}</p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : item.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {item.status === 'DRAFT' ? 'Chờ duyệt' : item.status === 'APPROVED' ? 'Đã duyệt' : 'Bị từ chối'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {items.length === 0 && (
                            <div className="bg-white rounded-xl border p-6 text-center text-gray-600">Chưa có yêu cầu nào.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyThreadRequestsPage


