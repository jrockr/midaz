import { onboardingClient } from '../client'
import type { Portfolio, CreatePortfolioDto, UpdatePortfolioDto, ListResponse } from '../../types'

export const portfoliosService = {
  async list(organizationId: string, ledgerId: string, params?: {
    limit?: number
    offset?: number
    search?: string
  }): Promise<ListResponse<Portfolio>> {
    try {
      const { data } = await onboardingClient.get(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/portfolios`, { params })
      return data
    } catch (error) {
      throw error
    }
  },

  async create(organizationId: string, ledgerId: string, payload: CreatePortfolioDto): Promise<Portfolio> {
    try {
      const { data } = await onboardingClient.post(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/portfolios`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async getById(organizationId: string, ledgerId: string, id: string): Promise<Portfolio> {
    try {
      const { data } = await onboardingClient.get(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/portfolios/${id}`)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async update(organizationId: string, ledgerId: string, id: string, payload: UpdatePortfolioDto): Promise<Portfolio> {
    try {
      const { data } = await onboardingClient.patch(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/portfolios/${id}`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async delete(organizationId: string, ledgerId: string, id: string): Promise<void> {
    try {
      await onboardingClient.delete(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/portfolios/${id}`)
    } catch (error) {
      throw error
    }
  },

  async getCount(organizationId: string, ledgerId: string): Promise<number> {
    try {
      const { headers } = await onboardingClient.head(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/portfolios/metrics/count`)
      return parseInt(headers['x-total-count'] || '0')
    } catch (error) {
      throw error
    }
  },
}
