import { onboardingClient } from '../client'
import type { Segment, CreateSegmentDto, UpdateSegmentDto, ListResponse } from '../../types'

export const segmentsService = {
  async list(organizationId: string, ledgerId: string, params?: {
    limit?: number
    offset?: number
    search?: string
  }): Promise<ListResponse<Segment>> {
    try {
      const { data } = await onboardingClient.get(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/segments`, { params })
      return data
    } catch (error) {
      throw error
    }
  },

  async create(organizationId: string, ledgerId: string, payload: CreateSegmentDto): Promise<Segment> {
    try {
      const { data } = await onboardingClient.post(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/segments`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async getById(organizationId: string, ledgerId: string, id: string): Promise<Segment> {
    try {
      const { data } = await onboardingClient.get(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/segments/${id}`)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async update(organizationId: string, ledgerId: string, id: string, payload: UpdateSegmentDto): Promise<Segment> {
    try {
      const { data } = await onboardingClient.patch(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/segments/${id}`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async delete(organizationId: string, ledgerId: string, id: string): Promise<void> {
    try {
      await onboardingClient.delete(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/segments/${id}`)
    } catch (error) {
      throw error
    }
  },

  async getCount(organizationId: string, ledgerId: string): Promise<number> {
    try {
      const { headers } = await onboardingClient.head(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/segments/metrics/count`)
      return parseInt(headers['x-total-count'] || '0')
    } catch (error) {
      throw error
    }
  },
}
