import {
    USER_ROLES,
    ARGUMENT_TYPES,
    VOTE_TYPES,
    CONTENT_STATUS,
    DEBATE_CATEGORIES,
    DIFFICULTY_LEVELS,
    STUDY_CARD_TYPES,
    NOTIFICATION_TYPES,
    REPORT_REASONS,
    ACHIEVEMENT_TYPES,
} from '../constants'

// Utility types
export type ValueOf<T> = T[keyof T]
export type KeyOf<T> = keyof T

// Base entity interface
export interface BaseEntity {
    id: string
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date
}

// User related types
export type UserRole = ValueOf<typeof USER_ROLES>

export interface User extends BaseEntity {
    email: string
    username: string
    displayName: string
    avatar?: string
    bio?: string
    role: UserRole
    isEmailVerified: boolean
    isActive: boolean
    lastLoginAt?: Date
    profile: UserProfile
    preferences: UserPreferences
    statistics: UserStatistics
}

export interface UserProfile {
    firstName?: string
    lastName?: string
    dateOfBirth?: Date
    gender?: 'male' | 'female' | 'other'
    phone?: string
    address?: string
    school?: string
    major?: string
    year?: number
    interests: string[]
    socialLinks: {
        facebook?: string
        twitter?: string
        linkedin?: string
        website?: string
    }
}

export interface UserPreferences {
    language: 'vi' | 'en'
    theme: 'light' | 'dark' | 'system'
    notifications: {
        email: boolean
        push: boolean
        newArguments: boolean
        newComments: boolean
        votes: boolean
        mentions: boolean
        studyReminders: boolean
    }
    privacy: {
        profileVisibility: 'public' | 'friends' | 'private'
        showEmail: boolean
        showActivity: boolean
    }
}

export interface UserStatistics {
    debatesCreated: number
    argumentsSubmitted: number
    commentsPosted: number
    votesReceived: number
    studyHours: number
    achievementsUnlocked: number
    reputationScore: number
    helpfulVotes: number
}

// Authentication types
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

export interface AuthResponse {
    user: User
    accessToken: string
    refreshToken: string
    expiresIn: number
}

// Frontend-only auth types (JWT handling is done server-side in real app)
export interface FrontendAuthState {
    isAuthenticated: boolean
    user: User | null
    isLoading: boolean
}

// Debate related types
export type DebateCategory = ValueOf<typeof DEBATE_CATEGORIES>
export type ContentStatus = ValueOf<typeof CONTENT_STATUS>
export type DifficultyLevel = ValueOf<typeof DIFFICULTY_LEVELS>

export interface DebateTopic extends BaseEntity {
    title: string
    description: string
    content: string
    category: DebateCategory
    tags: string[]
    difficulty: DifficultyLevel
    status: ContentStatus
    authorId: string
    author: User
    viewCount: number
    argumentCount: number
    participantCount: number
    lastActivityAt: Date
    isPinned: boolean
    isFeatured: boolean
    arguments: Argument[]
    votes: DebateVote[]
    reports: Report[]
}

// Argument related types
export type ArgumentType = ValueOf<typeof ARGUMENT_TYPES>
export type VoteType = ValueOf<typeof VOTE_TYPES>

export interface Argument extends BaseEntity {
    content: string
    type: ArgumentType
    debateTopicId: string
    debateTopic: DebateTopic
    authorId: string
    author: User
    parentId?: string
    parent?: Argument
    children: Argument[]
    status: ContentStatus
    viewCount: number
    commentCount: number
    upvotes: number
    downvotes: number
    score: number
    isEdited: boolean
    editedAt?: Date
    votes: ArgumentVote[]
    comments: Comment[]
    reports: Report[]
    sources: ArgumentSource[]
}

export interface ArgumentSource {
    id: string
    argumentId: string
    title: string
    url?: string
    description?: string
    type: 'book' | 'article' | 'website' | 'document' | 'other'
}

// Inputs for creating/updating arguments (frontend forms)
export interface ArgumentSourceInput {
    title: string
    url?: string
    description?: string
    type: 'book' | 'article' | 'website' | 'document' | 'other'
}

export interface CreateArgumentData {
    content: string
    type: ArgumentType
    debateTopicId: string
    parentId?: string
    sources?: ArgumentSourceInput[]
}

export interface UpdateArgumentData extends CreateArgumentData {
    id: string
}

// Comment related types
export interface Comment extends BaseEntity {
    content: string
    argumentId: string
    argument: Argument
    authorId: string
    author: User
    parentId?: string
    parent?: Comment
    children: Comment[]
    status: ContentStatus
    upvotes: number
    downvotes: number
    isEdited: boolean
    editedAt?: Date
    votes: CommentVote[]
    reports: Report[]
}

// Vote related types
export interface BaseVote extends BaseEntity {
    type: VoteType
    userId: string
    user: User
}

export interface DebateVote extends BaseVote {
    debateTopicId: string
    debateTopic: DebateTopic
}

export interface ArgumentVote extends BaseVote {
    argumentId: string
    argument: Argument
}

export interface CommentVote extends BaseVote {
    commentId: string
    comment: Comment
}

// Study mode types
export type StudyCardType = ValueOf<typeof STUDY_CARD_TYPES>

export interface StudyCard extends BaseEntity {
    question: string
    answer: string
    explanation?: string
    type: StudyCardType
    category: DebateCategory
    difficulty: DifficultyLevel
    tags: string[]
    options?: StudyCardOption[]
    authorId: string
    author: User
    isPublic: boolean
    usageCount: number
    successRate: number
}

export interface StudyCardOption {
    id: string
    text: string
    isCorrect: boolean
    explanation?: string
}

export interface StudySession extends BaseEntity {
    userId: string
    user: User
    name: string
    description?: string
    cardIds: string[]
    cards: StudyCard[]
    startedAt: Date
    completedAt?: Date
    duration?: number
    totalCards: number
    correctAnswers: number
    incorrectAnswers: number
    skippedAnswers: number
    score: number
    progress: StudyProgress[]
}

export interface StudyProgress {
    id: string
    sessionId: string
    cardId: string
    card: StudyCard
    isCorrect: boolean
    timeSpent: number
    difficulty: number
    confidence: number
    answeredAt: Date
}

export interface UserStudyStatistics {
    totalSessions: number
    totalTimeSpent: number
    averageScore: number
    streakDays: number
    longestStreak: number
    categoriesStudied: DebateCategory[]
    weakAreas: DebateCategory[]
    strongAreas: DebateCategory[]
    nextReviewDate: Date
}

// Notification types
export type NotificationType = ValueOf<typeof NOTIFICATION_TYPES>

export interface Notification extends BaseEntity {
    type: NotificationType
    title: string
    message: string
    userId: string
    user: User
    isRead: boolean
    readAt?: Date
    data?: Record<string, any>
    actionUrl?: string
    expiresAt?: Date
}

// Report and moderation types
export type ReportReason = ValueOf<typeof REPORT_REASONS>

export interface Report extends BaseEntity {
    reason: ReportReason
    description?: string
    reporterId: string
    reporter: User
    targetType: 'debate' | 'argument' | 'comment' | 'user'
    targetId: string
    status: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
    resolvedAt?: Date
    resolvedBy?: string
    resolver?: User
    resolution?: string
}

export interface ModerationAction extends BaseEntity {
    type: 'hide' | 'delete' | 'warn' | 'ban' | 'unban' | 'feature' | 'pin'
    reason: string
    targetType: 'debate' | 'argument' | 'comment' | 'user'
    targetId: string
    moderatorId: string
    moderator: User
    duration?: number // in minutes for temporary actions
    expiresAt?: Date
    isActive: boolean
}

// Search types
export interface SearchFilters {
    category?: DebateCategory
    difficulty?: DifficultyLevel
    status?: ContentStatus
    dateRange?: {
        from: Date
        to: Date
    }
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

export interface SearchResult<T> {
    items: T[]
    total: number
    limit: number
    offset: number
    hasMore: boolean
    facets: SearchFacets
}

export interface SearchFacets {
    categories: FacetCount[]
    difficulties: FacetCount[]
    authors: FacetCount[]
    tags: FacetCount[]
}

export interface FacetCount {
    value: string
    count: number
}

// Achievement types
export type AchievementType = ValueOf<typeof ACHIEVEMENT_TYPES>

export interface Achievement extends BaseEntity {
    type: AchievementType
    name: string
    description: string
    icon: string
    criteria: AchievementCriteria
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
    points: number
    unlockedBy: UserAchievement[]
}

export interface AchievementCriteria {
    type: 'count' | 'streak' | 'score' | 'time' | 'custom'
    target: number
    metric: string
    period?: 'day' | 'week' | 'month' | 'year' | 'all'
}

export interface UserAchievement extends BaseEntity {
    userId: string
    user: User
    achievementId: string
    achievement: Achievement
    unlockedAt: Date
    progress: number
    isNotified: boolean
}

// API response types
export interface ApiResponse<T = any> {
    success: boolean
    data: T
    message?: string
    errors?: ApiError[]
    meta?: ResponseMeta
}

export interface ApiError {
    code: string
    message: string
    field?: string
    details?: any
}

export interface ResponseMeta {
    timestamp: string
    requestId: string
    version: string
    pagination?: PaginationMeta
}

export interface PaginationMeta {
    total: number
    limit: number
    offset: number
    hasMore: boolean
    totalPages: number
    currentPage: number
}

// Form validation types
export interface ValidationError {
    field: string
    message: string
    code: string
}

export interface FormState<T> {
    data: T
    errors: Record<keyof T, string>
    isSubmitting: boolean
    isDirty: boolean
    isValid: boolean
}

// Analytics types
export interface AnalyticsEvent {
    event: string
    properties: Record<string, any>
    userId?: string
    timestamp: Date
}

export interface UserEngagementMetrics {
    dailyActiveUsers: number
    weeklyActiveUsers: number
    monthlyActiveUsers: number
    averageSessionDuration: number
    bounceRate: number
    retentionRate: number
}

export interface ContentMetrics {
    totalDebates: number
    totalArguments: number
    totalComments: number
    averageDebateEngagement: number
    topCategories: CategoryMetric[]
    contentGrowthRate: number
}

export interface CategoryMetric {
    category: DebateCategory
    count: number
    engagement: number
    growth: number
}

// Frontend configuration types
export interface FrontendConfig {
    apiBaseUrl?: string
    isDevelopment: boolean
    enableMockData: boolean
    features: {
        enableDebate: boolean
        enableStudyMode: boolean
        enableUserProfiles: boolean
    }
}

// Cache types
export interface CacheOptions {
    ttl?: number
    key?: string
    tags?: string[]
}

export interface CacheEntry<T> {
    value: T
    expiresAt: Date
    tags: string[]
}

// WebSocket types
export interface WebSocketMessage {
    type: string
    data: any
    timestamp: Date
    userId?: string
}

export interface RealTimeUpdate {
    type: 'debate_update' | 'argument_added' | 'comment_added' | 'vote_cast'
    entityId: string
    entityType: 'debate' | 'argument' | 'comment'
    data: any
    userId: string
}

// File upload types
export interface FileUploadOptions {
    maxSize: number
    allowedTypes: string[]
    destination: string
    generateThumbnail?: boolean
}

export interface UploadedFile {
    filename: string
    originalName: string
    mimetype: string
    size: number
    url: string
    thumbnailUrl?: string
}

// Frontend environment configuration
export interface AppEnvironment {
    NODE_ENV: 'development' | 'production' | 'test'
    NEXT_PUBLIC_BASE_URL?: string
    NEXT_PUBLIC_GA_ID?: string
    NEXT_PUBLIC_ANALYTICS_ENABLED?: string
}