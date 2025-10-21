import { transactionClient } from '../client'
import type { Transaction, CreateTransactionDto, UpdateTransactionDto, ListResponse } from '../../types'

export const transactionsService = {
  async list(organizationId: string, ledgerId: string, params?: {
    limit?: number
    offset?: number
    search?: string
  }): Promise<ListResponse<Transaction>> {
    try {
      const { data } = await transactionClient.get(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/transactions`, { params })
      return data
    } catch (error) {
      throw error
    }
  },

  async create(organizationId: string, ledgerId: string, payload: CreateTransactionDto): Promise<Transaction> {
    try {
      const { data } = await transactionClient.post(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/transactions/json`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async createInflow(organizationId: string, ledgerId: string, payload: any): Promise<Transaction> {
    try {
      const { data } = await transactionClient.post(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/transactions/inflow`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async createOutflow(organizationId: string, ledgerId: string, payload: any): Promise<Transaction> {
    try {
      const { data } = await transactionClient.post(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/transactions/outflow`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async getById(organizationId: string, ledgerId: string, id: string): Promise<Transaction> {
    try {
      const { data } = await transactionClient.get(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/transactions/${id}`)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async update(organizationId: string, ledgerId: string, id: string, payload: UpdateTransactionDto): Promise<Transaction> {
    try {
      const { data } = await transactionClient.patch(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/transactions/${id}`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },
}
