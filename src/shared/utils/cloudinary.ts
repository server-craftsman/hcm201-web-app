// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dsqbxgh88'
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'swd392'
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '446115756717624'

export interface CloudinaryUploadResult {
    public_id: string
    secure_url: string
    width: number
    height: number
    format: string
    resource_type: string
    created_at: string
    bytes: number
}

export interface CloudinaryUploadOptions {
    folder?: string
    tags?: string[]
    public_id?: string
}

/**
 * Upload file to Cloudinary
 */
export const uploadToCloudinary = async (
    file: File,
    options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> => {
    try {
        // Create form data
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
        formData.append('cloud_name', CLOUDINARY_CLOUD_NAME)
        formData.append('api_key', CLOUDINARY_API_KEY)

        // Add optional parameters
        if (options.folder) {
            formData.append('folder', options.folder)
        }
        if (options.tags) {
            formData.append('tags', options.tags.join(','))
        }
        if (options.public_id) {
            formData.append('public_id', options.public_id)
        }

        // Upload to Cloudinary
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`Cloudinary upload failed: ${errorData.error?.message || 'Unknown error'}`)
        }

        const result = await response.json()
        return result
    } catch (error) {
        console.error('Cloudinary upload error:', error)
        throw error
    }
}

/**
 * Upload avatar (without transformation for unsigned upload)
 */
export const uploadAvatar = async (file: File, userId?: string): Promise<string> => {
    try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new Error('Chỉ được upload file hình ảnh')
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Kích thước file không được vượt quá 5MB')
        }

        // Upload without transformation (unsigned upload doesn't allow transformation parameter)
        const result = await uploadToCloudinary(file, {
            folder: 'avatars',
            tags: ['avatar', 'profile'],
            public_id: userId ? `avatar_${userId}` : undefined
        })

        // Return optimized URL with transformations applied via URL
        return getOptimizedImageUrl(result.public_id, 'w_300,h_300,c_fill,g_face,r_max,q_auto,f_auto')
    } catch (error) {
        console.error('Avatar upload error:', error)
        throw error
    }
}

/**
 * Delete image from Cloudinary
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000)
        const signature = await generateSignature(publicId, timestamp)

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    public_id: publicId,
                    timestamp,
                    signature,
                    api_key: CLOUDINARY_API_KEY,
                }),
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`Cloudinary delete failed: ${errorData.error?.message || 'Unknown error'}`)
        }

        return true
    } catch (error) {
        console.error('Cloudinary delete error:', error)
        throw error
    }
}

/**
 * Generate signature for Cloudinary API calls
 * Note: In production, this should be done on the server side for security
 */
const generateSignature = async (publicId: string, timestamp: number): Promise<string> => {
    // This is a simplified version - in production, use server-side signing
    const params = `public_id=${publicId}&timestamp=${timestamp}`
    return btoa(params) // Simplified - use proper HMAC in production
}

/**
 * Get optimized image URL with transformations
 */
export const getOptimizedImageUrl = (
    publicId: string,
    transformations: string = 'w_auto,h_auto,q_auto,f_auto'
): string => {
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`
}

/**
 * Extract public ID from Cloudinary URL
 */
export const extractPublicId = (url: string): string | null => {
    try {
        const match = url.match(/\/upload\/.*\/([^\/]+)$/)
        return match ? match[1] : null
    } catch (error) {
        console.error('Error extracting public ID:', error)
        return null
    }
}
