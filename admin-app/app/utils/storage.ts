// Utility for localStorage persistence and caching

const STORAGE_KEYS = {
  SELECTED_ORG: 'midaz_selected_org',
  SELECTED_LEDGER: 'midaz_selected_ledger',
  ORG_CACHE: 'midaz_org_cache',
  LEDGER_CACHE: 'midaz_ledger_cache',
} as const

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

export const storage = {
  // Get selected organization
  getSelectedOrg(): string | null {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_ORG)
  },

  // Set selected organization
  setSelectedOrg(orgId: string): void {
    localStorage.setItem(STORAGE_KEYS.SELECTED_ORG, orgId)
  },

  // Get selected ledger
  getSelectedLedger(): string | null {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_LEDGER)
  },

  // Set selected ledger
  setSelectedLedger(ledgerId: string): void {
    localStorage.setItem(STORAGE_KEYS.SELECTED_LEDGER, ledgerId)
  },

  // Clear selections
  clearSelections(): void {
    localStorage.removeItem(STORAGE_KEYS.SELECTED_ORG)
    localStorage.removeItem(STORAGE_KEYS.SELECTED_LEDGER)
  },

  // Get cached data
  getCache<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null

      const cache: CacheEntry<T> = JSON.parse(item)
      const now = Date.now()

      if (now - cache.timestamp > cache.ttl) {
        localStorage.removeItem(key)
        return null
      }

      return cache.data
    } catch {
      return null
    }
  },

  // Set cached data
  setCache<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    try {
      const cache: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      }
      localStorage.setItem(key, JSON.stringify(cache))
    } catch (error) {
      console.error('Failed to cache data:', error)
    }
  },

  // Clear cache
  clearCache(key: string): void {
    localStorage.removeItem(key)
  },

  // Clear all cache
  clearAllCache(): void {
    localStorage.removeItem(STORAGE_KEYS.ORG_CACHE)
    localStorage.removeItem(STORAGE_KEYS.LEDGER_CACHE)
  },
}
