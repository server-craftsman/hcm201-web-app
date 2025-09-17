// 'use client'

// import { useState, useEffect, useCallback } from 'react'
// import { Argument, Comment } from '@/core/types'
// // import { ArgumentsApiService } from '../api/argumentsApiService'

// // Frontend-only types
// interface CreateArgumentData {
//     content: string
//     position: 'for' | 'against'
//     debateTopicId: string
// }

// interface UpdateArgumentData {
//     content?: string
//     position?: 'for' | 'against'
// }

// interface CreateCommentData {
//     content: string
//     argumentId: string
// }

// interface ArgumentsState {
//     arguments: Argument[]
//     totalCount: number
//     isLoading: boolean
//     error: string | null
// }

// interface UseArgumentsParams {
//     debateId: string
//     autoLoad?: boolean
//     limit?: number
// }

// interface UseArgumentsReturn extends ArgumentsState {
//     // Actions
//     loadArguments: () => Promise<void>
//     createArgument: (data: CreateArgumentData) => Promise<Argument>
//     updateArgument: (id: string, data: UpdateArgumentData) => Promise<Argument>
//     deleteArgument: (id: string) => Promise<void>
//     voteArgument: (id: string, voteType: 'upvote' | 'downvote') => Promise<void>

//     // Comments
//     createComment: (data: CreateCommentData) => Promise<Comment>

//     // Utils
//     getArgumentById: (id: string) => Argument | undefined
//     getArgumentTree: () => Promise<Argument[]>
//     clearError: () => void
//     refreshArguments: () => Promise<void>
// }

// export function useArguments(params: UseArgumentsParams): UseArgumentsReturn {
//     const { debateId, autoLoad = true, limit = 50 } = params

//     const [state, setState] = useState<ArgumentsState>({
//         arguments: [],
//         totalCount: 0,
//         isLoading: false,
//         error: null,
//     })

//     // Auto-load arguments on mount
//     useEffect(() => {
//         if (autoLoad && debateId) {
//             loadArguments()
//         }
//     }, [autoLoad, debateId])

//     const loadArguments = useCallback(async () => {
//         if (!debateId) return

//         try {
//             setState(prev => ({ ...prev, isLoading: true, error: null }))

//             const response = await ArgumentsApiService.getArgumentsByDebate(debateId, {
//                 limit,
//                 sortBy: 'date',
//                 sortOrder: 'desc',
//             })

//             setState(prev => ({
//                 ...prev,
//                 arguments: response.data,
//                 totalCount: response.meta?.pagination?.total || response.data.length,
//                 isLoading: false,
//             }))
//         } catch (error) {
//             setState(prev => ({
//                 ...prev,
//                 error: error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải tranh luận',
//                 isLoading: false,
//             }))
//         }
//     }, [debateId, limit])

//     const createArgument = useCallback(async (data: CreateArgumentData): Promise<Argument> => {
//         try {
//             setState(prev => ({ ...prev, isLoading: true, error: null }))

//             const newArgument = await ArgumentsApiService.createArgument(data)

//             // Add to the beginning of the list
//             setState(prev => ({
//                 ...prev,
//                 arguments: [newArgument, ...prev.arguments],
//                 totalCount: prev.totalCount + 1,
//                 isLoading: false,
//             }))

//             return newArgument
//         } catch (error) {
//             setState(prev => ({
//                 ...prev,
//                 error: error instanceof Error ? error.message : 'Tạo tranh luận thất bại',
//                 isLoading: false,
//             }))
//             throw error
//         }
//     }, [])

//     const updateArgument = useCallback(async (id: string, data: UpdateArgumentData): Promise<Argument> => {
//         try {
//             setState(prev => ({ ...prev, isLoading: true, error: null }))

//             const updatedArgument = await ArgumentsApiService.updateArgument(id, data)

//             // Update in the list
//             setState(prev => ({
//                 ...prev,
//                 arguments: prev.arguments.map(arg =>
//                     arg.id === id ? updatedArgument : arg
//                 ),
//                 isLoading: false,
//             }))

//             return updatedArgument
//         } catch (error) {
//             setState(prev => ({
//                 ...prev,
//                 error: error instanceof Error ? error.message : 'Cập nhật tranh luận thất bại',
//                 isLoading: false,
//             }))
//             throw error
//         }
//     }, [])

//     const deleteArgument = useCallback(async (id: string): Promise<void> => {
//         try {
//             setState(prev => ({ ...prev, isLoading: true, error: null }))

//             await ArgumentsApiService.deleteArgument(id)

//             // Remove from the list
//             setState(prev => ({
//                 ...prev,
//                 arguments: prev.arguments.filter(arg => arg.id !== id),
//                 totalCount: prev.totalCount - 1,
//                 isLoading: false,
//             }))
//         } catch (error) {
//             setState(prev => ({
//                 ...prev,
//                 error: error instanceof Error ? error.message : 'Xóa tranh luận thất bại',
//                 isLoading: false,
//             }))
//             throw error
//         }
//     }, [])

//     const voteArgument = useCallback(async (id: string, voteType: 'upvote' | 'downvote'): Promise<void> => {
//         try {
//             await ArgumentsApiService.voteArgument(id, voteType)

//             // Update vote counts locally (optimistic update)
//             setState(prev => ({
//                 ...prev,
//                 arguments: prev.arguments.map(arg => {
//                     if (arg.id === id) {
//                         const upvotes = voteType === 'upvote' ? (arg.upvotes || 0) + 1 : arg.upvotes || 0
//                         const downvotes = voteType === 'downvote' ? (arg.downvotes || 0) + 1 : arg.downvotes || 0
//                         return {
//                             ...arg,
//                             upvotes,
//                             downvotes,
//                             score: upvotes - downvotes,
//                         }
//                     }
//                     return arg
//                 }),
//             }))
//         } catch (error) {
//             setState(prev => ({
//                 ...prev,
//                 error: error instanceof Error ? error.message : 'Bình chọn thất bại',
//             }))
//             throw error
//         }
//     }, [])

//     const createComment = useCallback(async (data: CreateCommentData): Promise<Comment> => {
//         try {
//             const newComment = await ArgumentsApiService.createComment(data)

//             // Update comment count for the argument
//             setState(prev => ({
//                 ...prev,
//                 arguments: prev.arguments.map(arg => {
//                     if (arg.id === data.argumentId) {
//                         return {
//                             ...arg,
//                             commentCount: (arg.commentCount || 0) + 1,
//                         }
//                     }
//                     return arg
//                 }),
//             }))

//             return newComment
//         } catch (error) {
//             setState(prev => ({
//                 ...prev,
//                 error: error instanceof Error ? error.message : 'Tạo bình luận thất bại',
//             }))
//             throw error
//         }
//     }, [])

//     const getArgumentById = useCallback((id: string): Argument | undefined => {
//         return state.arguments.find(arg => arg.id === id)
//     }, [state.arguments])

//     const getArgumentTree = useCallback(async (): Promise<Argument[]> => {
//         try {
//             setState(prev => ({ ...prev, isLoading: true, error: null }))

//             const treeData = await ArgumentsApiService.getArgumentTree(debateId)

//             setState(prev => ({
//                 ...prev,
//                 arguments: treeData,
//                 isLoading: false,
//             }))

//             return treeData
//         } catch (error) {
//             setState(prev => ({
//                 ...prev,
//                 error: error instanceof Error ? error.message : 'Lấy cây tranh luận thất bại',
//                 isLoading: false,
//             }))
//             throw error
//         }
//     }, [debateId])

//     const clearError = useCallback(() => {
//         setState(prev => ({ ...prev, error: null }))
//     }, [])

//     const refreshArguments = useCallback(async (): Promise<void> => {
//         await loadArguments()
//     }, [loadArguments])

//     return {
//         ...state,
//         loadArguments,
//         createArgument,
//         updateArgument,
//         deleteArgument,
//         voteArgument,
//         createComment,
//         getArgumentById,
//         getArgumentTree,
//         clearError,
//         refreshArguments,
//     }
// }

// // Hook for single argument
// export function useArgument(id: string) {
//     const [argument, setArgument] = useState<Argument | null>(null)
//     const [isLoading, setIsLoading] = useState(false)
//     const [error, setError] = useState<string | null>(null)

//     const loadArgument = useCallback(async () => {
//         if (!id) return

//         try {
//             setIsLoading(true)
//             setError(null)

//             const argumentData = await ArgumentsApiService.getArgumentById(id)
//             setArgument(argumentData)
//         } catch (error) {
//             setError(error instanceof Error ? error.message : 'Lấy thông tin tranh luận thất bại')
//         } finally {
//             setIsLoading(false)
//         }
//     }, [id])

//     useEffect(() => {
//         loadArgument()
//     }, [loadArgument])

//     const refreshArgument = useCallback(() => {
//         return loadArgument()
//     }, [loadArgument])

//     return {
//         argument,
//         isLoading,
//         error,
//         refreshArgument,
//         clearError: () => setError(null),
//     }
// }