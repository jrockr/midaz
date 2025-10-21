import { onboardingClient } from '../client'
import type { Asset, CreateAssetDto, UpdateAssetDto, ListResponse } from '../../types'

/**
 * Assets API Service
 * Handles all asset-related API calls
 */
export const assetsService = {
  /**
   * List all assets with pagination and filtering
   */
  async list(organizationId: string, ledgerId: string, params?: {
    limit?: number
    offset?: number
    search?: string
  }): Promise<ListResponse<Asset>> {
    try {
      const { data } = await onboardingClient.get(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/assets`, { params })
      return data
    } catch (error) {
      throw error
    }
  },

  /**
   * Create a new asset
   */
  async create(organizationId: string, ledgerId: string, payload: CreateAssetDto): Promise<Asset> {
    try {
      const { data } = await onboardingClient.post(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/assets`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get a single asset by ID
   */
  async getById(organizationId: string, ledgerId: string, id: string): Promise<Asset> {
    try {
      const { data } = await onboardingClient.get(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/assets/${id}`)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  /**
   * Update an existing asset
   */
  async update(organizationId: string, ledgerId: string, id: string, payload: UpdateAssetDto): Promise<Asset> {
    try {
      const { data } = await onboardingClient.patch(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/assets/${id}`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  /**
   * Delete an asset
   */
  async delete(organizationId: string, ledgerId: string, id: string): Promise<void> {
    try {
      await onboardingClient.delete(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/assets/${id}`)
    } catch (error) {
      throw error
    }
  },

  /**
   * Get total count of assets
   */
  async getCount(organizationId: string, ledgerId: string): Promise<number> {
    try {
      const { headers } = await onboardingClient.head(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/assets/metrics/count`)
      return parseInt(headers['x-total-count'] || '0')
    } catch (error) {
      throw error
    }
  },
}
