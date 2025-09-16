const authConfig = {
    // Frontend auth settings (for future implementation with external auth service)
    frontend: {
        loginUrl: '/login',
        registerUrl: '/register',
        logoutUrl: '/logout',
        profileUrl: '/profile',
        redirectAfterLogin: '/debates',
        redirectAfterLogout: '/',
    },

    // Frontend validation rules
    validation: {
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        password: {
            minLength: 8,
            maxLength: 128,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            allowedSpecialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
        },
    },

    // UI settings
    ui: {
        showRememberMe: true,
        enablePasswordToggle: true,
        enableSocialLogin: false, // For future implementation
        formValidation: {
            validateOnBlur: true,
            validateOnChange: false,
            showErrorsImmediately: false,
        },
    },

    // User roles and permissions
    roles: {
        admin: {
            name: 'admin',
            level: 100,
            permissions: [
                'debate.create',
                'debate.edit',
                'debate.delete',
                'debate.moderate',
                'argument.create',
                'argument.edit',
                'argument.delete',
                'argument.moderate',
                'comment.create',
                'comment.edit',
                'comment.delete',
                'comment.moderate',
                'user.view',
                'user.edit',
                'user.delete',
                'user.ban',
                'content.moderate',
                'analytics.view',
                'system.configure',
            ],
        },
        moderator: {
            name: 'moderator',
            level: 50,
            permissions: [
                'debate.create',
                'debate.edit',
                'debate.moderate',
                'argument.create',
                'argument.edit',
                'argument.moderate',
                'comment.create',
                'comment.edit',
                'comment.moderate',
                'user.view',
                'content.moderate',
            ],
        },
        teacher: {
            name: 'teacher',
            level: 30,
            permissions: [
                'debate.create',
                'debate.edit',
                'argument.create',
                'argument.edit',
                'comment.create',
                'comment.edit',
                'study.create',
                'study.edit',
                'analytics.view.limited',
            ],
        },
        student: {
            name: 'student',
            level: 10,
            permissions: [
                'debate.view',
                'argument.create',
                'argument.edit.own',
                'comment.create',
                'comment.edit.own',
                'study.participate',
                'profile.edit.own',
            ],
        },
        guest: {
            name: 'guest',
            level: 0,
            permissions: [
                'debate.view',
                'argument.view',
                'comment.view',
            ],
        },
    },

    // Mock data for frontend development
    mockUsers: [
        {
            id: 1,
            email: 'admin@hcm201.edu.vn',
            name: 'Quản trị viên',
            role: 'admin',
            avatar: '/images/avatars/admin.jpg',
        },
        {
            id: 2,
            email: 'teacher@hcm201.edu.vn',
            name: 'Giảng viên',
            role: 'teacher',
            avatar: '/images/avatars/teacher.jpg',
        },
        {
            id: 3,
            email: 'student@hcm201.edu.vn',
            name: 'Sinh viên',
            role: 'student',
            avatar: '/images/avatars/student.jpg',
        },
    ],
} as const

export default authConfig

export type AuthConfig = typeof authConfig