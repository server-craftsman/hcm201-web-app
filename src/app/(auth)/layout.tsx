'use client'

import { motion } from 'framer-motion'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="min-h-screen"
        >
            {children}
        </motion.div>
    )
}
