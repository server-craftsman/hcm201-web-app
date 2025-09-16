const appConfig = {
    name: 'Tranh luận Tư tưởng Hồ Chí Minh',
    description: 'Website tranh luận về các chủ đề, câu hỏi của môn Tư tưởng Hồ Chí Minh',
    version: '1.0.0',
    author: 'HCM201 Team',

    // Environment
    env: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',

    // URLs and domains
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    // Note: Frontend-only application - no API server needed

    // Features
    features: {
        enableDebate: true,
        enableStudyMode: true,
        enableUserProfiles: true,
        enableNotifications: true,
        enableSearch: true,
        enableAnalytics: process.env.NODE_ENV === 'production',
    },

    // Pagination
    pagination: {
        defaultLimit: 20,
        maxLimit: 100,
        debatePostsPerPage: 10,
        commentsPerPage: 15,
        studyCardsPerSession: 20,
    },

    // File upload
    upload: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedImageTypes: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        allowedDocumentTypes: ['pdf', 'doc', 'docx', 'txt'],
    },

    // Vietnamese language settings
    language: {
        default: 'vi',
        supported: ['vi', 'en'],
        fallback: 'vi',
    },

    // Ho Chi Minh Thought topics
    topics: {
        categories: [
            'Chủ nghĩa Mác-Lênin',
            'Tư tưởng Hồ Chí Minh về độc lập dân tộc',
            'Tư tưởng Hồ Chí Minh về chủ nghĩa xã hội',
            'Tư tưởng Hồ Chí Minh về Đảng Cộng sản',
            'Tư tưởng Hồ Chí Minh về đại đoàn kết dân tộc',
            'Tư tưởng Hồ Chí Minh về con người',
            'Tư tưởng Hồ Chí Minh về đạo đức',
            'Tư tưởng Hồ Chí Minh về văn hóa',
            'Giá trị thời đại của tư tưởng Hồ Chí Minh',
        ],
        difficultyLevels: ['Cơ bản', 'Trung bình', 'Nâng cao'],
    },

    // Debate settings
    debate: {
        maxArgumentLength: 2000,
        maxTitleLength: 200,
        cooldownPeriod: 5 * 60 * 1000, // 5 minutes between posts
        votingCooldown: 1000, // 1 second between votes
        moderationEnabled: true,
    },

    // Study mode settings
    study: {
        sessionDuration: 30 * 60 * 1000, // 30 minutes
        breakDuration: 5 * 60 * 1000, // 5 minutes
        spracedRepetitionIntervals: [1, 3, 7, 14, 30], // days
        difficultyAdjustment: true,
    },

    // Cache settings
    cache: {
        defaultTtl: 5 * 60 * 1000, // 5 minutes
        userProfileTtl: 15 * 60 * 1000, // 15 minutes
        topicsTtl: 30 * 60 * 1000, // 30 minutes
        staticContentTtl: 60 * 60 * 1000, // 1 hour
    },

    // Rate limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100,
        debatePostLimit: 10, // per hour
        commentLimit: 50, // per hour
    },

    // SEO
    seo: {
        defaultTitle: 'Tranh luận Tư tưởng Hồ Chí Minh',
        defaultDescription: 'Nền tảng thảo luận và học tập về Tư tưởng Hồ Chí Minh',
        defaultKeywords: 'Hồ Chí Minh, tư tưởng, tranh luận, học tập, triết học, chính trị',
        twitterHandle: '@hcm201debate',
        ogImage: '/images/og-image.jpg',
    },

    // Theme and UI
    ui: {
        defaultTheme: 'light',
        supportedThemes: ['light', 'dark'],
        animations: {
            enabled: true,
            duration: 200,
        },
        notifications: {
            duration: 5000,
            position: 'top-right',
        },
    },

    // Analytics
    analytics: {
        googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
        trackingEnabled: process.env.NODE_ENV === 'production',
        events: {
            trackDebateViews: true,
            trackArgumentSubmissions: true,
            trackStudyProgress: true,
            trackUserEngagement: true,
        },
    },
} as const

export default appConfig

export type AppConfig = typeof appConfig