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
  async list(organizationId: string, ledgerId: string, params?: {
    limit?: number
    offset?: number
    search?: string
  }): Promise<ListResponse<Account>> {
    try {
      const { data } = await onboardingClient.get(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/accounts`, { params })
      return data
    } catch (error) {
      throw error
    }
  },

  /**
   * Create a new account
   */
  async create(organizationId: string, ledgerId: string, payload: CreateAccountDto): Promise<Account> {
    try {
      const { data } = await onboardingClient.post(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/accounts`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get a single account by ID
   */
  async getById(organizationId: string, ledgerId: string, id: string): Promise<Account> {
    try {
      const { data } = await onboardingClient.get(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/accounts/${id}`)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get account by alias
   */
  async getByAlias(organizationId: string, ledgerId: string, alias: string): Promise<Account> {
    try {
      const { data } = await onboardingClient.get(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/accounts/alias/${alias}`)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  /**
   * Update an existing account
   */
  async update(organizationId: string, ledgerId: string, id: string, payload: UpdateAccountDto): Promise<Account> {
    try {
      const { data } = await onboardingClient.patch(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/accounts/${id}`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  /**
   * Delete an account
   */
  async delete(organizationId: string, ledgerId: string, id: string): Promise<void> {
    try {
      await onboardingClient.delete(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/accounts/${id}`)
    } catch (error) {
      throw error
    }
  },

  /**
   * Get total count of accounts
   */
  async getCount(organizationId: string, ledgerId: string): Promise<number> {
    try {
      const { headers } = await onboardingClient.head(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/accounts/metrics/count`)
      return parseInt(headers['x-total-count'] || '0')
    } catch (error) {
      throw error
    }
  },
}
