// Minimal shared domain types for frontend modules
export interface User {
    id: string
    email: string
    username: string
    displayName: string
    avatar?: string
    role?: string
    isEmailVerified?: boolean
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
}

export interface LoginCredentials {
    email: string
    password: string
    remember?: boolean
}

export interface RegisterData {
    email: string
    username: string
    password: string
    confirmPassword: string
    displayName: string
    agreeToTerms: boolean
}

export interface StudyCardOption {
    id?: string
    text: string
    isCorrect: boolean
    explanation?: string
}

export interface StudyCard {
    id?: string
    question: string
    answer: string
    explanation?: string
    type: 'flashcard' | 'multiple_choice' | 'true_false' | 'essay' | 'matching' | string
    category?: string
    difficulty: 'basic' | 'intermediate' | 'advanced' | string
    tags: string[]
    options?: StudyCardOption[]
}

export interface StudyProgress {
    id: string
    sessionId: string
    cardId: string
    isCorrect: boolean
    timeSpent: number
    difficulty: number
    confidence: number
    answeredAt: Date | string
}

export interface StudySession {
    id?: string
    userId?: string
    name: string
    description?: string
    cardIds?: string[]
    cards: StudyCard[]
    startedAt?: Date | string
    completedAt?: Date | string
    duration?: number
    totalCards?: number
    correctAnswers?: number
    incorrectAnswers?: number
    skippedAnswers?: number
    score?: number
    progress?: StudyProgress[]
}

export interface DebateTopic {
    id: string
    title: string
    description: string
    content?: string
    category?: string
    tags?: string[]
    difficulty?: string
    status?: string
    authorId?: string
    viewCount?: number
    argumentCount?: number
    participantCount?: number
    lastActivityAt?: Date | string
    isFeatured?: boolean
    isPinned?: boolean
}

export interface SearchFilters {
    category?: string
    difficulty?: string
    status?: string
    dateRange?: { from: Date | string; to: Date | string }
    author?: string
    tags?: string[]
}

export interface SearchParams {
    query: string
    filters?: SearchFilters
    sortBy?: 'relevance' | 'date' | 'popularity' | 'votes'
    sortOrder?: 'asc' | 'desc'
    limit?: number
    offset?: number
}

export interface ArgumentSource {
    title: string
    url?: string
    description?: string
}

export interface Argument {
    id: string
    content: string
    type: string
    debateTopicId?: string
    author?: User
    parentId?: string
    children?: Argument[]
    status?: string
    viewCount?: number
    commentCount?: number
    upvotes?: number
    downvotes?: number
    score?: number
    isEdited?: boolean
    editedAt?: Date | string
    votes?: any[]
    comments?: Comment[]
    reports?: any[]
    sources?: ArgumentSource[]
    createdAt?: Date | string
}

export interface Comment {
    id: string
    content: string
    argumentId?: string
    author?: User
    parentId?: string
    children?: Comment[]
    status?: string
    upvotes?: number
    downvotes?: number
    isEdited?: boolean
    editedAt?: Date | string
    createdAt?: Date | string
}

// Shared component prop types
export interface ComponentProps {
    className?: string
    children?: React.ReactNode
}

// Common form types
export interface FormFieldProps {
    name: string
    label?: string
    error?: string
    required?: boolean
    disabled?: boolean
}

// Vietnamese text processing types
export interface VietnameseTextOptions {
    removeAccents?: boolean
    convertToSlug?: boolean
    preserveCase?: boolean
}

// Search and filter types
export interface FilterOption {
    label: string
    value: string
    count?: number
}

export interface SortOption {
    label: string
    value: string
    direction: 'asc' | 'desc'
}

// Modal and dialog types
export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    closeOnOverlayClick?: boolean
    closeOnEscape?: boolean
}

// Toast notification types
export interface ToastProps {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title?: string
    message: string
    duration?: number
    action?: {
        label: string
        onClick: () => void
    }
}

// Loading state types
export interface LoadingState {
    isLoading: boolean
    loadingText?: string
    progress?: number
}

// Error state types
export interface ErrorState {
    hasError: boolean
    error?: Error | string
    errorCode?: string
    canRetry?: boolean
    onRetry?: () => void
}

// Pagination types
export interface PaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
    showInfo?: boolean
}

// Vietnamese debate specific types
export interface DebateCardProps {
    debate: any // Will be replaced with proper type from core
    showActions?: boolean
    onEdit?: () => void
    onDelete?: () => void
    onView?: () => void
}

export interface ArgumentCardProps {
    argument: any // Will be replaced with proper type from core
    showVoting?: boolean
    showReplies?: boolean
    onVote?: (type: 'upvote' | 'downvote') => void
    onReply?: () => void
    onEdit?: () => void
    onDelete?: () => void
}

// Study mode types
export interface StudyCardProps {
    card: any // Will be replaced with proper type from core
    isFlipped?: boolean
    onFlip?: () => void
    onNext?: () => void
    onPrevious?: () => void
    showControls?: boolean
}