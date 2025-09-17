import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Re-export shadcn utilities
export * from './shadcn'

/**
 * Utility function to merge Tailwind CSS classes
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Format Vietnamese currency
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount)
}

/**
 * Format Vietnamese date
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
    date: Date | string,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }
): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('vi-VN', options).format(dateObj)
}

/**
 * Format relative time in Vietnamese
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string | null | undefined): string {
    // Handle null, undefined, or empty values
    if (!date) {
        return 'Không xác định'
    }

    const dateObj = typeof date === 'string' ? new Date(date) : date

    // Check if the date is valid
    if (!dateObj || isNaN(dateObj.getTime())) {
        return 'Không xác định'
    }

    const now = new Date()
    const diffInMs = now.getTime() - dateObj.getTime()

    // Handle negative differences (future dates)
    if (diffInMs < 0) {
        return 'Vừa xong'
    }

    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))

    if (diffInDays > 0) {
        return `${diffInDays} ngày trước`
    } else if (diffInHours > 0) {
        return `${diffInHours} giờ trước`
    } else if (diffInMinutes > 0) {
        return `${diffInMinutes} phút trước`
    } else {
        return 'Vừa xong'
    }
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}

/**
 * Generate random ID
 * @param length - Length of ID
 * @returns Random ID string
 */
export function generateId(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

/**
 * Slugify Vietnamese text
 * @param text - Text to slugify
 * @returns Slugified text
 */
export function slugify(text: string): string {
    const vietnameseMap: Record<string, string> = {
        'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
        'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
        'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
        'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
        'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
        'đ': 'd',
        'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A', 'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
        'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
        'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
        'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
        'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
        'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
        'Đ': 'D',
    }

    let result = text.toLowerCase()

    // Replace Vietnamese characters
    for (const [vietnamese, latin] of Object.entries(vietnameseMap)) {
        result = result.replace(new RegExp(vietnamese, 'g'), latin.toLowerCase())
    }

    // Remove special characters and spaces
    result = result
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .replace(/^-|-$/g, '')

    return result
}

/**
 * Validate email address
 * @param email - Email to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validate Vietnamese phone number
 * @param phone - Phone number to validate
 * @returns Boolean indicating if phone is valid
 */
export function isValidVietnamesePhone(phone: string): boolean {
    const phoneRegex = /^(0|\+84)[1-9][0-9]{8,9}$/
    return phoneRegex.test(phone)
}

/**
 * Get Vietnamese grade from score
 * @param score - Score (0-100)
 * @returns Grade description
 */
export function getVietnameseGrade(score: number): string {
    if (score >= 90) return 'Xuất sắc'
    if (score >= 80) return 'Giỏi'
    if (score >= 70) return 'Khá'
    if (score >= 60) return 'Trung bình'
    if (score >= 50) return 'Yếu'
    return 'Kém'
}

/**
 * Format file size in Vietnamese
 * @param bytes - File size in bytes
 * @returns Formatted file size
 */
export function formatFileSize(bytes: number): string {
    const units = ['byte', 'KB', 'MB', 'GB', 'TB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024
        unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
}

/**
 * Check if user has permission
 * @param userPermissions - User's permissions array
 * @param requiredPermission - Required permission
 * @returns Boolean indicating if user has permission
 */
export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
    return userPermissions.includes(requiredPermission)
}

/**
 * Debounce function
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout
    return ((...args: any[]) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }) as T
}

/**
 * Deep clone object
 * @param obj - Object to clone
 * @returns Cloned object
 */
export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
    if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
    if (typeof obj === 'object') {
        const cloned = {} as { [key: string]: any }
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key])
            }
        }
        return cloned as T
    }
    return obj
}