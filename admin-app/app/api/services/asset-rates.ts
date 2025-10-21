import { onboardingClient } from '../client'

export const Uasset_ratesService = {
  async list(params?: any) {
    try {
      const { data } = await onboardingClient.get('/v1/asset-rates', { params })
      return data
    } catch (error) {
      throw error
    }
  },

  async create(payload: any) {
    try {
      const { data } = await onboardingClient.post('/v1/asset-rates', payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async getById(id: string) {
    try {
      const { data } = await onboardingClient.get(`/v1/asset-rates/${id}`)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async update(id: string, payload: any) {
    try {
      const { data } = await onboardingClient.patch(`/v1/asset-rates/${id}`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async delete(id: string) {
    try {
      await onboardingClient.delete(`/v1/asset-rates/${id}`)
    } catch (error) {
      throw error
    }
  },
}
