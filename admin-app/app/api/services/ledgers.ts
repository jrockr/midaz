import { onboardingClient } from '../client'
import type { Ledger, CreateLedgerDto, UpdateLedgerDto, ListResponse } from '../../types'

export const ledgersService = {
  async list(organizationId: string, params?: {
    limit?: number
    offset?: number
    search?: string
  }): Promise<ListResponse<Ledger>> {
    try {
      const { data } = await onboardingClient.get(`/v1/organizations/${organizationId}/ledgers`, { params })
      return data
    } catch (error) {
      throw error
    }
  },

  async create(organizationId: string, payload: CreateLedgerDto): Promise<Ledger> {
    try {
      const { data } = await onboardingClient.post(`/v1/organizations/${organizationId}/ledgers`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async getById(organizationId: string, id: string): Promise<Ledger> {
    try {
      const { data } = await onboardingClient.get(`/v1/organizations/${organizationId}/ledgers/${id}`)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async update(organizationId: string, id: string, payload: UpdateLedgerDto): Promise<Ledger> {
    try {
      const { data } = await onboardingClient.patch(`/v1/organizations/${organizationId}/ledgers/${id}`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async delete(organizationId: string, id: string): Promise<void> {
    try {
      await onboardingClient.delete(`/v1/organizations/${organizationId}/ledgers/${id}`)
    } catch (error) {
      throw error
    }
  },

  async getCount(organizationId: string): Promise<number> {
    try {
      const { headers } = await onboardingClient.head(`/v1/organizations/${organizationId}/ledgers/metrics/count`)
      return parseInt(headers['x-total-count'] || '0')
    } catch (error) {
      throw error
    }
  },
}
