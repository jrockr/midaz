import { onboardingClient } from '../client'

export const UportfoliosService = {
  async list(params?: any) {
    try {
      const { data } = await onboardingClient.get('/v1/portfolios', { params })
      return data
    } catch (error) {
      throw error
    }
  },

  async create(payload: any) {
    try {
      const { data } = await onboardingClient.post('/v1/portfolios', payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async getById(id: string) {
    try {
      const { data } = await onboardingClient.get(`/v1/portfolios/${id}`)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async update(id: string, payload: any) {
    try {
      const { data } = await onboardingClient.patch(`/v1/portfolios/${id}`, payload)
      return data.data || data
    } catch (error) {
      throw error
    }
  },

  async delete(id: string) {
    try {
      await onboardingClient.delete(`/v1/portfolios/${id}`)
    } catch (error) {
      throw error
    }
  },
}
