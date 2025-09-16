export interface ArgumentSource {
    id: string
    argumentId: string
    title: string
    url?: string
    description?: string
    type: 'book' | 'article' | 'website' | 'document' | 'other'
}

