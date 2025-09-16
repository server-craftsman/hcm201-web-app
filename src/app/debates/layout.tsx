import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Tranh luận',
    description: 'Khám phá các chủ đề tranh luận về tư tưởng Hồ Chí Minh',
}

export default function DebatesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="container-custom section-padding">
            {children}
        </div>
    )
}