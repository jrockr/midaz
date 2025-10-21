import { onboardingClient } from '../client'
import type { Ledger, CreateLedgerDto, UpdateLedgerDto, ListResponse } from '../../types'

export const ledgersService = {
  async list(params?: {
    limit?: number
    offset?: number
    search?: string
  }): Promise<ListResponse<Ledger>> {
    try {
      const { data } = await onboardingClient.get('/v1/ledgers', { params })
      return data
    } catch (error) {
      throw error
    }
  },

  async create(payload: CreateLedgerDto): Promise<Ledger> {
    try {
      const { data } = await onboardingClient.post('/v1/ledgers', payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async getById(id: string): Promise<Ledger> {
    try {
      const { data } = await onboardingClient.get(`/v1/ledgers/${id}`)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async update(id: string, payload: UpdateLedgerDto): Promise<Ledger> {
    try {
      const { data } = await onboardingClient.patch(`/v1/ledgers/${id}`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await onboardingClient.delete(`/v1/ledgers/${id}`)
    } catch (error) {
      throw error
    }
  },
}
