import { onboardingClient } from '../client'
import type { Organization, CreateOrganizationDto, UpdateOrganizationDto, ListResponse } from '../../types'

/**
 * Organizations API Service
 * Handles all organization-related API calls
 */
export const organizationsService = {
  /**
   * List all organizations with pagination and filtering
   */
  async list(params?: {
    limit?: number
    offset?: number
    search?: string
  }): Promise<ListResponse<Organization>> {
    try {
      const { data } = await onboardingClient.get('/v1/organizations', { params })
      return data
    } catch (error) {
      throw error
    }
  },

  /**
   * Create a new organization
   */
  async create(payload: CreateOrganizationDto): Promise<Organization> {
    try {
      const { data } = await onboardingClient.post('/v1/organizations', payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get a single organization by ID
   */
  async getById(id: string): Promise<Organization> {
    try {
      const { data } = await onboardingClient.get(`/v1/organizations/${id}`)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  /**
   * Update an existing organization
   */
  async update(id: string, payload: UpdateOrganizationDto): Promise<Organization> {
    try {
      const { data } = await onboardingClient.patch(`/v1/organizations/${id}`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  /**
   * Delete an organization
   */
  async delete(id: string): Promise<void> {
    try {
      await onboardingClient.delete(`/v1/organizations/${id}`)
    } catch (error) {
      throw error
    }
  },

  /**
   * Get total count of organizations
   */
  async getCount(): Promise<number> {
    try {
      const { headers } = await onboardingClient.head('/v1/organizations/metrics/count')
      return parseInt(headers['x-total-count'] || '0')
    } catch (error) {
      throw error
    }
  },
}
