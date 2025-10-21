// Centralized error handling utility

export interface ApiError {
  status: number
  message: string
  code?: string
  details?: any
}

export const errorHandler = {
  // Parse API error
  parseError(error: any): ApiError {
    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      return {
        status,
        message: this.getErrorMessage(status, data),
        code: data?.code,
        details: data?.errors || data?.details,
      }
    }

    if (error.request) {
      return {
        status: 0,
        message: 'Network error - please check your connection',
      }
    }

    return {
      status: 500,
      message: error.message || 'An unexpected error occurred',
    }
  },

  // Get user-friendly error message
  getErrorMessage(status: number, data?: any): string {
    const customMessage = data?.message

    switch (status) {
      case 400:
        return customMessage || 'Invalid request - please check your input'
      case 401:
        return 'Unauthorized - please login again'
      case 403:
        return 'Forbidden - you don\'t have permission to perform this action'
      case 404:
        return customMessage || 'Resource not found - please check if organization and ledger are selected'
      case 409:
        return customMessage || 'Conflict - resource already exists'
      case 422:
        return customMessage || 'Validation failed - please check your input'
      case 429:
        return 'Too many requests - please try again later'
      case 500:
        return 'Server error - please try again later'
      case 503:
        return 'Service unavailable - please try again later'
      default:
        return customMessage || `Error ${status} - something went wrong`
    }
  },

  // Handle error with toast
  handleWithToast(error: any, uiStore: any): void {
    const apiError = this.parseError(error)
    uiStore.showToast(apiError.message, 'error')
    console.error('API Error:', apiError)
  },

  // Validate required parameters
  validateParams(params: Record<string, any>, required: string[]): string | null {
    for (const key of required) {
      if (!params[key]) {
        return `${key} is required`
      }
    }
    return null
  },
}
