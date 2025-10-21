import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Segment } from '@/types'

interface SegmentWithRelations extends Segment {
  parentSegmentId?: string
  childSegmentIds?: string[]
  accountsCount?: number
  linkedAccounts?: string[]
  depth?: number
}

export const useSegmentsStore = defineStore('segments', () => {
  const items = ref<SegmentWithRelations[]>([])
  const currentSegment = ref<SegmentWithRelations | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const linkedAccounts = ref<Map<string, string[]>>(new Map())
  const parentRelations = ref<Map<string, string>>(new Map())
  const childRelations = ref<Map<string, string[]>>(new Map())

  // Computed
  const total = computed(() => items.value.length)

  // Getters
  const getItemById = (id: string) => {
    return items.value.find(item => item.id === id)
  }

  const getLinkedAccounts = (segmentId: string) => {
    return linkedAccounts.value.get(segmentId) || []
  }

  const getChildSegments = (segmentId: string) => {
    const childIds = childRelations.value.get(segmentId) || []
    return items.value.filter(item => childIds.includes(item.id))
  }

  const getParentSegment = (segmentId: string) => {
    const parentId = parentRelations.value.get(segmentId)
    return parentId ? items.value.find(item => item.id === parentId) : null
  }

  const getHierarchyBreadcrumbs = (segmentId: string): SegmentWithRelations[] => {
    const breadcrumbs: SegmentWithRelations[] = []
    let currentId: string | undefined = segmentId

    while (currentId) {
      const segment = getItemById(currentId)
      if (segment) {
        breadcrumbs.unshift(segment)
        currentId = parentRelations.value.get(currentId)
      } else {
        break
      }
    }

    return breadcrumbs
  }

  const checkCircularDependency = (segmentId: string, parentId: string): boolean => {
    if (segmentId === parentId) return true

    let currentParentId: string | undefined = parentId
    while (currentParentId) {
      if (currentParentId === segmentId) return true
      currentParentId = parentRelations.value.get(currentParentId)
    }

    return false
  }

  // Actions - Fetch
  const fetchAll = async (params?: { limit?: number; page?: number }) => {
    loading.value = true
    error.value = null
    try {
      // Mock API call - replace with actual API
      items.value = [
        {
          id: 'seg-001',
          name: 'Root Segment',
          code: 'ROOT-01',
          description: 'Root segment for organization',
          status: 'ACTIVE',
          organizationId: 'org-001',
          accountsCount: 3,
          linkedAccounts: [],
          childSegmentIds: ['seg-002'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'seg-002',
          name: 'Child Segment',
          code: 'CHILD-01',
          description: 'Child segment',
          status: 'ACTIVE',
          organizationId: 'org-001',
          parentSegmentId: 'seg-001',
          accountsCount: 2,
          linkedAccounts: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      // Build relationships
      items.value.forEach(segment => {
        if (segment.parentSegmentId) {
          parentRelations.value.set(segment.id, segment.parentSegmentId)
        }
        if (segment.childSegmentIds) {
          childRelations.value.set(segment.id, segment.childSegmentIds)
        }
      })

      return items.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch segments'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetch = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const segment = items.value.find(item => item.id === id)
      if (!segment) {
        // Mock API call - replace with actual API
        currentSegment.value = {
          id,
          name: 'Sample Segment',
          code: 'SPL-01',
          description: 'A sample segment',
          status: 'ACTIVE',
          organizationId: 'org-001',
          accountsCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      } else {
        currentSegment.value = segment
      }
      return currentSegment.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch segment'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Create
  const create = async (data: Partial<SegmentWithRelations>) => {
    loading.value = true
    error.value = null
    try {
      // Validate circular dependency
      if (data.parentSegmentId && checkCircularDependency(data.parentSegmentId, data.parentSegmentId)) {
        throw new Error('Circular dependency detected')
      }

      const newSegment: SegmentWithRelations = {
        id: `seg-${Date.now()}`,
        name: data.name || '',
        code: data.code || '',
        description: data.description,
        status: data.status || 'ACTIVE',
        organizationId: data.organizationId || '',
        parentSegmentId: data.parentSegmentId,
        accountsCount: 0,
        linkedAccounts: [],
        childSegmentIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: data.metadata,
      }

      if (data.parentSegmentId) {
        parentRelations.value.set(newSegment.id, data.parentSegmentId)
        const childIds = childRelations.value.get(data.parentSegmentId) || []
        childIds.push(newSegment.id)
        childRelations.value.set(data.parentSegmentId, childIds)
      }

      items.value.push(newSegment)
      return newSegment
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create segment'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Update
  const update = async (id: string, data: Partial<SegmentWithRelations>) => {
    loading.value = true
    error.value = null
    try {
      const segment = items.value.find(item => item.id === id)
      if (!segment) throw new Error('Segment not found')

      // Validate circular dependency on parent change
      if (data.parentSegmentId && data.parentSegmentId !== segment.parentSegmentId) {
        if (checkCircularDependency(id, data.parentSegmentId)) {
          throw new Error('Circular dependency detected')
        }
      }

      Object.assign(segment, data, { updatedAt: new Date().toISOString() })
      return segment
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update segment'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Delete
  const remove = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        const segment = items.value[index]
        items.value.splice(index, 1)
        linkedAccounts.value.delete(id)
        parentRelations.value.delete(id)
        childRelations.value.delete(id)

        // Remove from parent's children
        if (segment.parentSegmentId) {
          const childIds = childRelations.value.get(segment.parentSegmentId) || []
          const childIndex = childIds.indexOf(id)
          if (childIndex !== -1) {
            childIds.splice(childIndex, 1)
          }
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete segment'
      throw err
    } finally {
      loading.value = false
    }
  }

  const delete_: typeof remove = remove

  // Actions - Account Linking
  const linkAccount = async (segmentId: string, accountId: string) => {
    loading.value = true
    error.value = null
    try {
      const segment = items.value.find(item => item.id === segmentId)
      if (!segment) throw new Error('Segment not found')

      const linked = linkedAccounts.value.get(segmentId) || []
      if (!linked.includes(accountId)) {
        linked.push(accountId)
        linkedAccounts.value.set(segmentId, linked)
        segment.accountsCount = (segment.accountsCount || 0) + 1
        segment.linkedAccounts = linked
      }
      return linked
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to link account'
      throw err
    } finally {
      loading.value = false
    }
  }

  const unlinkAccount = async (segmentId: string, accountId: string) => {
    loading.value = true
    error.value = null
    try {
      const segment = items.value.find(item => item.id === segmentId)
      if (!segment) throw new Error('Segment not found')

      const linked = linkedAccounts.value.get(segmentId) || []
      const index = linked.indexOf(accountId)
      if (index !== -1) {
        linked.splice(index, 1)
        linkedAccounts.value.set(segmentId, linked)
        segment.accountsCount = Math.max(0, (segment.accountsCount || 1) - 1)
        segment.linkedAccounts = linked
      }
      return linked
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to unlink account'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getLinkedAccountsList = async (segmentId: string) => {
    try {
      return getLinkedAccounts(segmentId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch linked accounts'
      throw err
    }
  }

  return {
    // State
    items,
    currentSegment,
    loading,
    error,
    linkedAccounts,
    // Computed
    total,
    // Getters
    getItemById,
    getLinkedAccounts,
    getChildSegments,
    getParentSegment,
    getHierarchyBreadcrumbs,
    checkCircularDependency,
    // Actions
    fetchAll,
    fetch,
    create,
    update,
    remove,
    delete: delete_,
    linkAccount,
    unlinkAccount,
    getLinkedAccountsList,
  }
})
