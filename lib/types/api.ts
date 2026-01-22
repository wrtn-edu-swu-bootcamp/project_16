export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  error: string
  message: string
  retryAfter?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
