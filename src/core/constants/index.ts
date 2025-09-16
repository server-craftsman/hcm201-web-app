// Application constants
export const APP_NAME = 'Tranh luận Tư tưởng Hồ Chí Minh'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'Website tranh luận về các chủ đề, câu hỏi của môn Tư tưởng Hồ Chí Minh'

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
} as const

// User roles
export const USER_ROLES = {
    GUEST: 'guest',
    STUDENT: 'student',
    TEACHER: 'teacher',
    MODERATOR: 'moderator',
    ADMIN: 'admin',
} as const

// User permissions
export const PERMISSIONS = {
    // Debate permissions
    DEBATE_VIEW: 'debate.view',
    DEBATE_CREATE: 'debate.create',
    DEBATE_EDIT: 'debate.edit',
    DEBATE_DELETE: 'debate.delete',
    DEBATE_MODERATE: 'debate.moderate',

    // Argument permissions
    ARGUMENT_VIEW: 'argument.view',
    ARGUMENT_CREATE: 'argument.create',
    ARGUMENT_EDIT: 'argument.edit',
    ARGUMENT_EDIT_OWN: 'argument.edit.own',
    ARGUMENT_DELETE: 'argument.delete',
    ARGUMENT_MODERATE: 'argument.moderate',

    // Comment permissions
    COMMENT_VIEW: 'comment.view',
    COMMENT_CREATE: 'comment.create',
    COMMENT_EDIT: 'comment.edit',
    COMMENT_EDIT_OWN: 'comment.edit.own',
    COMMENT_DELETE: 'comment.delete',
    COMMENT_MODERATE: 'comment.moderate',

    // User permissions
    USER_VIEW: 'user.view',
    USER_EDIT: 'user.edit',
    USER_DELETE: 'user.delete',
    USER_BAN: 'user.ban',
    PROFILE_EDIT_OWN: 'profile.edit.own',

    // Study permissions
    STUDY_PARTICIPATE: 'study.participate',
    STUDY_CREATE: 'study.create',
    STUDY_EDIT: 'study.edit',

    // Content moderation
    CONTENT_MODERATE: 'content.moderate',

    // Analytics
    ANALYTICS_VIEW: 'analytics.view',
    ANALYTICS_VIEW_LIMITED: 'analytics.view.limited',

    // System
    SYSTEM_CONFIGURE: 'system.configure',
} as const

// Debate topic categories (Ho Chi Minh Thought)
export const DEBATE_CATEGORIES = {
    MARXISM_LENINISM: 'marxism_leninism',
    NATIONAL_INDEPENDENCE: 'national_independence',
    SOCIALISM: 'socialism',
    COMMUNIST_PARTY: 'communist_party',
    NATIONAL_UNITY: 'national_unity',
    HUMAN_THOUGHT: 'human_thought',
    ETHICS: 'ethics',
    CULTURE: 'culture',
    CONTEMPORARY_VALUE: 'contemporary_value',
} as const

// Vietnamese category names
export const DEBATE_CATEGORY_NAMES = {
    [DEBATE_CATEGORIES.MARXISM_LENINISM]: 'Chủ nghĩa Mác-Lênin',
    [DEBATE_CATEGORIES.NATIONAL_INDEPENDENCE]: 'Tư tưởng Hồ Chí Minh về độc lập dân tộc',
    [DEBATE_CATEGORIES.SOCIALISM]: 'Tư tưởng Hồ Chí Minh về chủ nghĩa xã hội',
    [DEBATE_CATEGORIES.COMMUNIST_PARTY]: 'Tư tưởng Hồ Chí Minh về Đảng Cộng sản',
    [DEBATE_CATEGORIES.NATIONAL_UNITY]: 'Tư tưởng Hồ Chí Minh về đại đoàn kết dân tộc',
    [DEBATE_CATEGORIES.HUMAN_THOUGHT]: 'Tư tưởng Hồ Chí Minh về con người',
    [DEBATE_CATEGORIES.ETHICS]: 'Tư tưởng Hồ Chí Minh về đạo đức',
    [DEBATE_CATEGORIES.CULTURE]: 'Tư tưởng Hồ Chí Minh về văn hóa',
    [DEBATE_CATEGORIES.CONTEMPORARY_VALUE]: 'Giá trị thời đại của tư tưởng Hồ Chí Minh',
} as const

// Argument types
export const ARGUMENT_TYPES = {
    SUPPORT: 'support',
    OPPOSE: 'oppose',
    NEUTRAL: 'neutral',
    QUESTION: 'question',
    CLARIFICATION: 'clarification',
} as const

// Vietnamese argument type names
export const ARGUMENT_TYPE_NAMES = {
    [ARGUMENT_TYPES.SUPPORT]: 'Ủng hộ',
    [ARGUMENT_TYPES.OPPOSE]: 'Phản đối',
    [ARGUMENT_TYPES.NEUTRAL]: 'Trung lập',
    [ARGUMENT_TYPES.QUESTION]: 'Đặt câu hỏi',
    [ARGUMENT_TYPES.CLARIFICATION]: 'Làm rõ',
} as const

// Vote types
export const VOTE_TYPES = {
    UPVOTE: 'upvote',
    DOWNVOTE: 'downvote',
} as const

// Content status
export const CONTENT_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    UNDER_REVIEW: 'under_review',
    FLAGGED: 'flagged',
    HIDDEN: 'hidden',
    DELETED: 'deleted',
} as const

// Vietnamese status names
export const CONTENT_STATUS_NAMES = {
    [CONTENT_STATUS.DRAFT]: 'Bản nháp',
    [CONTENT_STATUS.PUBLISHED]: 'Đã xuất bản',
    [CONTENT_STATUS.UNDER_REVIEW]: 'Đang xem xét',
    [CONTENT_STATUS.FLAGGED]: 'Bị báo cáo',
    [CONTENT_STATUS.HIDDEN]: 'Bị ẩn',
    [CONTENT_STATUS.DELETED]: 'Đã xóa',
} as const

// Difficulty levels for study mode
export const DIFFICULTY_LEVELS = {
    BASIC: 'basic',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced',
} as const

export const DIFFICULTY_LEVEL_NAMES = {
    [DIFFICULTY_LEVELS.BASIC]: 'Cơ bản',
    [DIFFICULTY_LEVELS.INTERMEDIATE]: 'Trung bình',
    [DIFFICULTY_LEVELS.ADVANCED]: 'Nâng cao',
} as const

// Study card types
export const STUDY_CARD_TYPES = {
    FLASHCARD: 'flashcard',
    MULTIPLE_CHOICE: 'multiple_choice',
    TRUE_FALSE: 'true_false',
    ESSAY: 'essay',
    MATCHING: 'matching',
} as const

export const STUDY_CARD_TYPE_NAMES = {
    [STUDY_CARD_TYPES.FLASHCARD]: 'Thẻ ghi nhớ',
    [STUDY_CARD_TYPES.MULTIPLE_CHOICE]: 'Trắc nghiệm',
    [STUDY_CARD_TYPES.TRUE_FALSE]: 'Đúng/Sai',
    [STUDY_CARD_TYPES.ESSAY]: 'Tự luận',
    [STUDY_CARD_TYPES.MATCHING]: 'Ghép đôi',
} as const

// Notification types
export const NOTIFICATION_TYPES = {
    NEW_ARGUMENT: 'new_argument',
    NEW_COMMENT: 'new_comment',
    VOTE_RECEIVED: 'vote_received',
    DEBATE_FEATURED: 'debate_featured',
    CONTENT_MODERATED: 'content_moderated',
    STUDY_REMINDER: 'study_reminder',
    ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
    SYSTEM_UPDATE: 'system_update',
} as const

// Report reasons
export const REPORT_REASONS = {
    SPAM: 'spam',
    INAPPROPRIATE_CONTENT: 'inappropriate_content',
    HARASSMENT: 'harassment',
    FALSE_INFORMATION: 'false_information',
    COPYRIGHT_VIOLATION: 'copyright_violation',
    OFF_TOPIC: 'off_topic',
    OTHER: 'other',
} as const

export const REPORT_REASON_NAMES = {
    [REPORT_REASONS.SPAM]: 'Spam',
    [REPORT_REASONS.INAPPROPRIATE_CONTENT]: 'Nội dung không phù hợp',
    [REPORT_REASONS.HARASSMENT]: 'Quấy rối',
    [REPORT_REASONS.FALSE_INFORMATION]: 'Thông tin sai lệch',
    [REPORT_REASONS.COPYRIGHT_VIOLATION]: 'Vi phạm bản quyền',
    [REPORT_REASONS.OFF_TOPIC]: 'Lạc đề',
    [REPORT_REASONS.OTHER]: 'Khác',
} as const

// File types
export const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp'] as const
export const ALLOWED_DOCUMENT_TYPES = ['pdf', 'doc', 'docx', 'txt'] as const

// Pagination defaults
export const PAGINATION_DEFAULTS = {
    LIMIT: 20,
    MAX_LIMIT: 100,
    OFFSET: 0,
} as const

// Date formats
export const DATE_FORMATS = {
    FULL: 'DD/MM/YYYY HH:mm:ss',
    DATE_ONLY: 'DD/MM/YYYY',
    TIME_ONLY: 'HH:mm',
    ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
} as const

// Regular expressions
export const REGEX_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    VIETNAMESE_PHONE: /^(0|\+84)[1-9][0-9]{8,9}$/,
    STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
    SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const

// Cache keys
export const CACHE_KEYS = {
    USER_PROFILE: (userId: string) => `user:profile:${userId}`,
    DEBATE_DETAIL: (debateId: string) => `debate:detail:${debateId}`,
    DEBATE_ARGUMENTS: (debateId: string) => `debate:arguments:${debateId}`,
    DEBATE_CATEGORIES: 'debate:categories',
    TRENDING_DEBATES: 'debates:trending',
    USER_PERMISSIONS: (userId: string) => `user:permissions:${userId}`,
    STUDY_PROGRESS: (userId: string) => `study:progress:${userId}`,
} as const

// Event names for analytics
export const ANALYTICS_EVENTS = {
    DEBATE_VIEWED: 'debate_viewed',
    ARGUMENT_SUBMITTED: 'argument_submitted',
    COMMENT_ADDED: 'comment_added',
    VOTE_CAST: 'vote_cast',
    STUDY_SESSION_STARTED: 'study_session_started',
    STUDY_SESSION_COMPLETED: 'study_session_completed',
    USER_REGISTERED: 'user_registered',
    USER_LOGIN: 'user_login',
    SEARCH_PERFORMED: 'search_performed',
} as const

// Default avatars
export const DEFAULT_AVATARS = [
    '/images/avatars/default-1.svg',
    '/images/avatars/default-2.svg',
    '/images/avatars/default-3.svg',
    '/images/avatars/default-4.svg',
    '/images/avatars/default-5.svg',
] as const

// Achievement types
export const ACHIEVEMENT_TYPES = {
    FIRST_DEBATE: 'first_debate',
    FIRST_ARGUMENT: 'first_argument',
    ACTIVE_DEBATER: 'active_debater',
    THOUGHTFUL_CONTRIBUTOR: 'thoughtful_contributor',
    STUDY_STREAK: 'study_streak',
    KNOWLEDGE_MASTER: 'knowledge_master',
    HELPFUL_VOTER: 'helpful_voter',
    COMMUNITY_BUILDER: 'community_builder',
} as const