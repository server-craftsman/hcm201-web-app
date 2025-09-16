// Argument module specific constants

export const ARGUMENT_TYPES = {
    support: 'support',
    oppose: 'oppose',
    neutral: 'neutral',
    question: 'question',
    clarification: 'clarification',
} as const

export type ArgumentTypeValue = (typeof ARGUMENT_TYPES)[keyof typeof ARGUMENT_TYPES]

export const ARGUMENT_TYPE_NAMES: Record<ArgumentTypeValue, string> = {
    support: 'Ủng hộ',
    oppose: 'Phản đối',
    neutral: 'Trung lập',
    question: 'Đặt câu hỏi',
    clarification: 'Làm rõ',
}


