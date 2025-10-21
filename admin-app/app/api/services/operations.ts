import { transactionClient } from '../client'
import type { Operation, UpdateOperationDto, ListResponse } from '../../types'

export const operationsService = {
  async listByAccount(organizationId: string, ledgerId: string, accountId: string, params?: {
    limit?: number
    offset?: number
  }): Promise<ListResponse<Operation>> {
    try {
      const { data } = await transactionClient.get(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/accounts/${accountId}/operations`, { params })
      return data
    } catch (error) {
      throw error
    }
  },

  async getById(organizationId: string, ledgerId: string, accountId: string, operationId: string): Promise<Operation> {
    try {
      const { data } = await transactionClient.get(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/accounts/${accountId}/operations/${operationId}`)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async update(organizationId: string, ledgerId: string, transactionId: string, operationId: string, payload: UpdateOperationDto): Promise<Operation> {
    try {
      const { data } = await transactionClient.patch(`/v1/organizations/${organizationId}/ledgers/${ledgerId}/transactions/${transactionId}/operations/${operationId}`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },
}
