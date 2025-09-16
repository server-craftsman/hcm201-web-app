import { Variants, Transition } from 'framer-motion'

export const defaultTransition: Transition = {
    duration: 0.4,
    ease: 'easeOut',
}

export function createFadeInVariants(
    initialOpacity: number = 0,
    y: number = 0,
    delay: number = 0
): Variants {
    return {
        hidden: { opacity: initialOpacity, y },
        show: {
            opacity: 1,
            y: 0,
            transition: { ...defaultTransition, delay },
        },
    }
}

export function createSlideUpVariants(
    distance: number = 16,
    delay: number = 0
): Variants {
    return {
        hidden: { opacity: 0, y: distance },
        show: {
            opacity: 1,
            y: 0,
            transition: { ...defaultTransition, delay },
        },
    }
}

export function createStaggerContainerVariants(
    stagger: number = 0.08,
    delayChildren: number = 0
): Variants {
    return {
        hidden: {},
        show: {
            transition: {
                staggerChildren: stagger,
                delayChildren,
            },
        },
    }
}


