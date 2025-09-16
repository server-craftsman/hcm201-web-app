export type ArgumentType = 'pro' | 'con' | 'neutral'

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
