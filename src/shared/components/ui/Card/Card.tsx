'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/shadcn'
// import { motion } from 'framer-motion' // Will be added when framer-motion is installed

const cardVariants = cva(
    "rounded-3xl border bg-card text-card-foreground shadow-elegant relative overflow-hidden group",
    {
        variants: {
            variant: {
                default: "bg-white/90 border-white/20 backdrop-blur-lg",
                luxury: "card-luxury",
                glass: "card-glass",
                outline: "border-2 border-primary-200 bg-white/95 backdrop-blur-lg",
                filled: "bg-gradient-to-br from-primary-50/80 to-secondary-50/80 backdrop-blur-lg border-primary-100",
                elevated: "shadow-premium bg-white/95 backdrop-blur-xl",
                vietnamese: "hcm-gradient-luxury text-white border-none shadow-luxury",
                premium: "bg-gradient-to-br from-luxury-gold-50 via-white to-luxury-platinum-50 border-luxury-gold-200 shadow-luxury-gold",
            },
            padding: {
                none: "",
                sm: "p-4",
                md: "p-8",
                lg: "p-12",
                xl: "p-16",
            },
            hover: {
                none: "",
                subtle: "transition-all duration-500 hover:shadow-premium hover:-translate-y-1",
                dramatic: "transition-all duration-500 hover:shadow-premium hover:-translate-y-2 hover:scale-105",
            }
        },
        defaultVariants: {
            variant: "default",
            padding: "md",
            hover: "subtle",
        },
    }
)

interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
    header?: React.ReactNode
    footer?: React.ReactNode
    shimmer?: boolean
    glow?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, padding, hover, header, footer, shimmer, glow, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                cardVariants({ variant, padding, hover }),
                shimmer && "animate-shimmer-luxury",
                glow && "animate-luxury-glow",
                "before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
                className
            )}
            {...props}
        >
            {/* Glass reflection effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content wrapper with proper z-index */}
            <div className="relative z-10">
                {header && (
                    <div className="border-b border-white/20 pb-6 mb-6">
                        {header}
                    </div>
                )}

                <div className={header || footer ? 'flex-1' : ''}>
                    {children}
                </div>

                {footer && (
                    <div className="border-t border-white/20 pt-6 mt-6">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
)

Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-2 p-8", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-2xl font-bold leading-none tracking-tight font-serif",
            "bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent",
            className
        )}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-base text-neutral-600 leading-relaxed", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-8 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-8 pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }