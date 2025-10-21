import { onboardingClient } from '../client'
import type { Account, CreateAccountDto, UpdateAccountDto, ListResponse } from '../../types'

/**
 * Accounts API Service
 * Handles all account-related API calls
 */
export const accountsService = {
  /**
   * List all accounts with pagination and filtering
   */
  async list(params?: {
    limit?: number
    offset?: number
    search?: string
    ledgerId?: string
  }): Promise<ListResponse<Account>> {
    try {
      const { data } = await onboardingClient.get('/v1/accounts', { params })
      return data
    } catch (error) {
      throw error
    }
  },

  /**
   * Create a new account
   */
  async create(payload: CreateAccountDto): Promise<Account> {
    try {
      const { data } = await onboardingClient.post('/v1/accounts', payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get a single account by ID
   */
  async getById(id: string): Promise<Account> {
    try {
      const { data } = await onboardingClient.get(`/v1/accounts/${id}`)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  /**
   * Update an existing account
   */
  async update(id: string, payload: UpdateAccountDto): Promise<Account> {
    try {
      const { data } = await onboardingClient.patch(`/v1/accounts/${id}`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  /**
   * Delete an account
   */
  async delete(id: string): Promise<void> {
    try {
      await onboardingClient.delete(`/v1/accounts/${id}`)
    } catch (error) {
      throw error
    }
  },

  /**
   * Get account balance
   */
  async getBalance(id: string): Promise<any> {
    try {
      const { data } = await onboardingClient.get(`/v1/accounts/${id}/balance`)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get total count of accounts
   */
  async getCount(): Promise<number> {
    try {
      const { headers } = await onboardingClient.head('/v1/accounts/metrics/count')
      return parseInt(headers['x-total-count'] || '0')
    } catch (error) {
      throw error
    }
  },
}
