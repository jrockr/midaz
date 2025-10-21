import { transactionClient } from '../client'
import type { Balance, UpdateBalanceDto, ListResponse } from '../../types'

export const balancesService = {
  async list(organizationId: string, ledgerId: string, params?: {
    limit?: number
    offset?: number
  }): Promise<ListResponse<Balance>> {
    try {
      const { data } = await transactionClient.get(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/balances`, { params })
      return data
    } catch (error) {
      throw error
    }
  },

  async listByAccount(organizationId: string, ledgerId: string, accountId: string, params?: any): Promise<ListResponse<Balance>> {
    try {
      const { data } = await transactionClient.get(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/accounts/${accountId}/balances`, { params })
      return data
    } catch (error) {
      throw error
    }
  },

  async listByAlias(organizationId: string, ledgerId: string, alias: string, params?: any): Promise<ListResponse<Balance>> {
    try {
      const { data } = await transactionClient.get(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/accounts/alias/${alias}/balances`, { params })
      return data
    } catch (error) {
      throw error
    }
  },

  async getById(organizationId: string, ledgerId: string, id: string): Promise<Balance> {
    try {
      const { data } = await transactionClient.get(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/balances/${id}`)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async update(organizationId: string, ledgerId: string, id: string, payload: UpdateBalanceDto): Promise<Balance> {
    try {
      const { data } = await transactionClient.patch(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/balances/${id}`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async delete(organizationId: string, ledgerId: string, id: string): Promise<void> {
    try {
      await transactionClient.delete(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/balances/${id}`)
    } catch (error) {
      throw error
    }
  },
}
