import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Button variant utilities
export const buttonVariants = {
    variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
    },
}

// Card variant utilities
export const cardVariants = {
    variant: {
        default: "rounded-lg border bg-card text-card-foreground shadow-sm",
        outline: "border-2 border-border bg-background text-foreground",
        filled: "bg-muted text-muted-foreground",
    },
    padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
    },
}

// Input variant utilities
export const inputVariants = {
    variant: {
        default: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        ghost: "border-0 bg-transparent focus-visible:ring-1",
    },
    size: {
        default: "h-10 px-3 py-2",
        sm: "h-9 px-3 py-2 text-sm",
        lg: "h-11 px-4 py-3",
    },
}

// Badge variant utilities
export const badgeVariants = {
    variant: {
        default: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
    },
}

// Alert variant utilities
export const alertVariants = {
    variant: {
        default: "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
    },
}

// Loading state utilities
export const loadingStates = {
    spinner: "animate-spin rounded-full border-2 border-current border-t-transparent",
    pulse: "animate-pulse bg-muted rounded",
    bounce: "animate-bounce",
}

// Vietnamese-specific utilities
export const vietnameseTheme = {
    primary: "text-primary-600",
    secondary: "text-secondary-600",
    gradient: "bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent",
    card: "bg-white border border-neutral-200 rounded-xl shadow-soft",
    button: {
        primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
        secondary: "bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500",
    }
}