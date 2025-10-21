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
  async list(params?: {
    limit?: number
    offset?: number
    search?: string
  }): Promise<ListResponse<Asset>> {
    try {
      const { data } = await onboardingClient.get('/v1/assets', { params })
      return data
    } catch (error) {
      throw error
    }
  },

  /**
   * Create a new asset
   */
  async create(payload: CreateAssetDto): Promise<Asset> {
    try {
      const { data } = await onboardingClient.post('/v1/assets', payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get a single asset by ID
   */
  async getById(id: string): Promise<Asset> {
    try {
      const { data } = await onboardingClient.get(`/v1/assets/${id}`)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  /**
   * Update an existing asset
   */
  async update(id: string, payload: UpdateAssetDto): Promise<Asset> {
    try {
      const { data } = await onboardingClient.patch(`/v1/assets/${id}`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  /**
   * Delete an asset
   */
  async delete(id: string): Promise<void> {
    try {
      await onboardingClient.delete(`/v1/assets/${id}`)
    } catch (error) {
      throw error
    }
  },

  /**
   * Get total count of assets
   */
  async getCount(): Promise<number> {
    try {
      const { headers } = await onboardingClient.head('/v1/assets/metrics/count')
      return parseInt(headers['x-total-count'] || '0')
    } catch (error) {
      throw error
    }
  },
}
