'use client'

import React, { useEffect, useState } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { createFadeInVariants, createSlideUpVariants, createStaggerContainerVariants } from './variants'

// SSR-safe wrapper to prevent hydration mismatches
const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    if (!hasMounted) {
        return <>{children}</>
    }

    return <>{children}</>
}

export type FadeInProps = HTMLMotionProps<'div'> & {
    y?: number
    initialOpacity?: number
    delay?: number
}

export const FadeIn: React.FC<FadeInProps> = ({ y = 0, initialOpacity = 0, delay = 0, children, ...rest }) => {
    return (
        <ClientOnly>
            <motion.div
                variants={createFadeInVariants(initialOpacity, y, delay)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                {...rest}
            >
                {children}
            </motion.div>
        </ClientOnly>
    )
}

export type SlideUpProps = HTMLMotionProps<'div'> & {
    distance?: number
    delay?: number
}

export const SlideUp: React.FC<SlideUpProps> = ({ distance = 16, delay = 0, children, ...rest }) => {
    return (
        <ClientOnly>
            <motion.div
                variants={createSlideUpVariants(distance, delay)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                {...rest}
            >
                {children}
            </motion.div>
        </ClientOnly>
    )
}

export type StaggerContainerProps = HTMLMotionProps<'div'> & {
    stagger?: number
    delayChildren?: number
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({ stagger = 0.08, delayChildren = 0, children, ...rest }) => {
    return (
        <ClientOnly>
            <motion.div
                variants={createStaggerContainerVariants(stagger, delayChildren)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                {...rest}
            >
                {children}
            </motion.div>
        </ClientOnly>
    )
}


