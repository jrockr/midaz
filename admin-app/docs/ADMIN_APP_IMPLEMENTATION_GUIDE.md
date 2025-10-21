# Midaz Admin App - Implementation Guide & Best Practices

## Quick Start Setup

### 1. Project Initialization

```bash
# Create Vue 3 + TypeScript + Vite project
npm create vite@latest midaz-admin -- --template vue-ts

# Navigate to project
cd midaz-admin

# Install dependencies
npm install

# Install additional packages
npm install -D tailwindcss postcss autoprefixer
npm install -D @tailwindcss/forms @tailwindcss/typography
npm install pinia axios zod date-fns decimal.js
npm install @headlessui/vue @heroicons/vue
npm install -D vitest @vitest/ui playwright @testing-library/vue
npm install -D prettier eslint typescript-eslint

# Initialize Tailwind
npx tailwindcss init -p
```

### 2. Directory Structure Setup

```bash
# Create directory structure
mkdir -p src/{api/{services,interceptors},components/{common,layout,onboarding,transactions},pages,stores,types,utils,hooks}

# Create index files
touch src/api/services/index.ts
touch src/stores/index.ts
```

---

## Architecture Patterns

### 1. API Service Layer Pattern

**File**: `src/api/client.ts`

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
```

**File**: `src/api/services/organizations.ts`

```typescript
import client from '../client'
import { Organization, CreateOrganizationDto, UpdateOrganizationDto } from '@/types'

export const organizationsService = {
  async list(params?: { limit?: number; offset?: number; search?: string }) {
    const { data } = await client.get('/v1/organizations', { params })
    return data
  },

  async create(payload: CreateOrganizationDto) {
    const { data } = await client.post('/v1/organizations', payload)
    return data
  },

  async getById(id: string) {
    const { data } = await client.get(`/v1/organizations/${id}`)
    return data
  },

  async update(id: string, payload: UpdateOrganizationDto) {
    const { data } = await client.patch(`/v1/organizations/${id}`, payload)
    return data
  },

  async delete(id: string) {
    await client.delete(`/v1/organizations/${id}`)
  },

  async getCount() {
    const { headers } = await client.head('/v1/organizations/metrics/count')
    return parseInt(headers['x-total-count'] || '0')
  },
}
```

### 2. Pinia Store Pattern

**File**: `src/stores/organizations.ts`

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { organizationsService } from '@/api/services/organizations'
import type { Organization } from '@/types'

export const useOrganizationsStore = defineStore('organizations', () => {
  // State
  const items = ref<Organization[]>([])
  const selectedId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({ limit: 10, offset: 0, total: 0 })

  // Getters
  const selected = computed(() => items.value.find(o => o.id === selectedId.value))
  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  const fetch = async (params?: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await organizationsService.list(params)
      items.value = response.data
      pagination.value = { ...pagination.value, total: response.total }
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await organizationsService.create(payload)
      items.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const update = async (id: string, payload: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await organizationsService.update(id, payload)
      const index = items.value.findIndex(o => o.id === id)
      if (index !== -1) {
        items.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const remove = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await organizationsService.delete(id)
      items.value = items.value.filter(o => o.id !== id)
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const select = (id: string) => {
    selectedId.value = id
  }

  return {
    items,
    selectedId,
    selected,
    loading,
    error,
    pagination,
    isEmpty,
    fetch,
    create,
    update,
    remove,
    select,
  }
})
```

### 3. Vue Component Pattern

**File**: `src/components/onboarding/organizations/OrganizationsList.vue`

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useOrganizationsStore } from '@/stores/organizations'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useOrganizationsStore()
const { items, loading, error, pagination } = storeToRefs(store)

const searchQuery = ref('')
const selectedItems = ref<string[]>([])

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value
  return items.value.filter(org =>
    org.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

onMounted(() => {
  store.fetch()
})

const handleCreate = () => {
  router.push('/onboarding/organizations/create')
}

const handleEdit = (id: string) => {
  router.push(`/onboarding/organizations/${id}/edit`)
}

const handleView = (id: string) => {
  store.select(id)
  router.push(`/onboarding/organizations/${id}`)
}

const handleDelete = async (id: string) => {
  if (confirm('Are you sure?')) {
    try {
      await store.remove(id)
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }
}

const handlePageChange = (offset: number) => {
  pagination.value.offset = offset
  store.fetch({ limit: pagination.value.limit, offset })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Organizations</h1>
      <button
        @click="handleCreate"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Create Organization
      </button>
    </div>

    <!-- Search & Filters -->
    <div class="flex gap-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search organizations..."
        class="flex-1 px-3 py-2 border rounded-lg"
      />
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="p-4 bg-red-100 text-red-800 rounded-lg">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto border rounded-lg">
      <table class="w-full text-sm">
        <thead class="bg-gray-100 border-b">
          <tr>
            <th class="px-4 py-2 text-left">
              <input type="checkbox" />
            </th>
            <th class="px-4 py-2 text-left">Name</th>
            <th class="px-4 py-2 text-left">Code</th>
            <th class="px-4 py-2 text-left">Status</th>
            <th class="px-4 py-2 text-left">Created At</th>
            <th class="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="org in filteredItems"
            :key="org.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="px-4 py-2">
              <input type="checkbox" />
            </td>
            <td class="px-4 py-2 font-medium">{{ org.name }}</td>
            <td class="px-4 py-2">{{ org.code }}</td>
            <td class="px-4 py-2">
              <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </td>
            <td class="px-4 py-2">{{ new Date(org.createdAt).toLocaleDateString() }}</td>
            <td class="px-4 py-2 text-right">
              <button
                @click="handleView(org.id)"
                class="text-blue-600 hover:underline mr-2"
              >
                View
              </button>
              <button
                @click="handleEdit(org.id)"
                class="text-blue-600 hover:underline mr-2"
              >
                Edit
              </button>
              <button
                @click="handleDelete(org.id)"
                class="text-red-600 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && items.length === 0" class="text-center py-8 text-gray-500">
      No organizations found
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-600">
        Showing {{ pagination.offset + 1 }} to {{ Math.min(pagination.offset + pagination.limit, pagination.total) }} of {{ pagination.total }}
      </span>
      <div class="flex gap-2">
        <button
          :disabled="pagination.offset === 0"
          @click="handlePageChange(Math.max(0, pagination.offset - pagination.limit))"
          class="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <button
          :disabled="pagination.offset + pagination.limit >= pagination.total"
          @click="handlePageChange(pagination.offset + pagination.limit)"
          class="px-3 py-1 border rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
```

### 4. Form Component Pattern

**File**: `src/components/onboarding/organizations/OrganizationForm.vue`

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useOrganizationsStore } from '@/stores/organizations'
import { z } from 'zod'

const router = useRouter()
const store = useOrganizationsStore()

const props = defineProps<{ organizationId?: string }>()
const emit = defineEmits<{ success: [] }>()

const submitting = ref(false)
const formData = reactive({
  name: '',
  code: '',
  description: '',
  metadata: {},
})

const errors = reactive<Record<string, string>>({})

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().optional(),
  description: z.string().optional(),
})

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key])
  try {
    schema.parse(formData)
    return true
  } catch (err: any) {
    err.errors.forEach((error: any) => {
      errors[error.path[0]] = error.message
    })
    return false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true
  try {
    if (props.organizationId) {
      await store.update(props.organizationId, formData)
    } else {
      await store.create(formData)
    }
    emit('success')
    router.back()
  } catch (err: any) {
    errors.submit = err.message || 'Failed to save organization'
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 max-w-lg">
    <!-- Name Field -->
    <div>
      <label class="block text-sm font-medium mb-1">Name *</label>
      <input
        v-model="formData.name"
        type="text"
        :class="['w-full px-3 py-2 border rounded-lg', errors.name && 'border-red-500']"
        placeholder="Organization name"
      />
      <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
    </div>

    <!-- Code Field -->
    <div>
      <label class="block text-sm font-medium mb-1">Code</label>
      <input
        v-model="formData.code"
        type="text"
        class="w-full px-3 py-2 border rounded-lg"
        placeholder="Organization code"
      />
    </div>

    <!-- Description Field -->
    <div>
      <label class="block text-sm font-medium mb-1">Description</label>
      <textarea
        v-model="formData.description"
        class="w-full px-3 py-2 border rounded-lg"
        placeholder="Organization description"
        rows="3"
      ></textarea>
    </div>

    <!-- Error Message -->
    <div v-if="errors.submit" class="p-3 bg-red-100 text-red-800 rounded-lg text-sm">
      {{ errors.submit }}
    </div>

    <!-- Actions -->
    <div class="flex gap-2 justify-end">
      <button
        type="button"
        @click="handleCancel"
        class="px-4 py-2 border rounded-lg hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="submitting"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {{ submitting ? 'Saving...' : 'Save' }}
      </button>
    </div>
  </form>
</template>
```

---

## Best Practices

### 1. **Error Handling**

```typescript
// Always wrap API calls in try-catch
try {
  await store.fetch()
} catch (error) {
  // Handle error gracefully
  console.error('Failed to fetch:', error)
  // Show user-friendly message
  // Use toast/notification component
}
```

### 2. **Loading States**

```typescript
// Show loading indicator during async operations
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    // API call
  } finally {
    loading.value = false
  }
}
```

### 3. **Data Formatting**

```typescript
// Use utilities for consistent formatting
import { formatCurrency, formatDate } from '@/utils/formatters'

// In template
{{ formatCurrency(balance) }} <!-- $1,234.56 -->
{{ formatDate(createdAt) }} <!-- Jan 01, 2024 -->
```

### 4. **Type Safety**

```typescript
// Always define types for API responses
interface Organization {
  id: string
  name: string
  code?: string
  description?: string
  createdAt: string
  updatedAt: string
}

// Use in components
const org: Organization = response.data
```

### 5. **Validation Schema**

```typescript
// Define validation schemas with Zod
import { z } from 'zod'

const organizationSchema = z.object({
  name: z.string().min(1).max(255),
  code: z.string().optional().refine(
    (val) => !val || /^[A-Z0-9_-]+$/.test(val),
    'Code must be uppercase alphanumeric'
  ),
})

// Use in forms
const validated = organizationSchema.parse(formData)
```

### 6. **Responsive Tables**

```typescript
// Handle responsive table display
const columns = [
  { key: 'name', label: 'Name', visible: true },
  { key: 'code', label: 'Code', visible: { md: false } }, // Hide on mobile
  { key: 'actions', label: 'Actions', visible: true },
]
```

### 7. **Keyboard Navigation**

```typescript
// Add keyboard shortcuts for power users
const handleKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey || event.metaKey) {
    if (event.key === 'n') {
      event.preventDefault()
      handleCreate()
    }
    if (event.key === 's') {
      event.preventDefault()
      handleSubmit()
    }
  }
}
```

### 8. **Accessibility**

```vue
<!-- Always include ARIA labels -->
<button
  aria-label="Delete organization"
  @click="handleDelete"
>
  <TrashIcon />
</button>

<!-- Use semantic HTML -->
<section aria-label="Organization list">
  <table role="grid">
    <!-- content -->
  </table>
</section>
```

---

## Environment Configuration

**File**: `.env.example`

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_ONBOARDING_API=http://localhost:3000
VITE_TRANSACTION_API=http://localhost:3001

# App Configuration
VITE_APP_NAME=Midaz Admin
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_FEATURE_BULK_UPLOAD=true
VITE_FEATURE_EXPORT_CSV=true
VITE_FEATURE_ADVANCED_FILTERS=true

# Analytics
VITE_ANALYTICS_ENABLED=true
VITE_SENTRY_DSN=
```

---

## Testing Strategy

### Unit Test Example

**File**: `src/stores/organizations.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOrganizationsStore } from '@/stores/organizations'
import * as organizationsService from '@/api/services/organizations'

vi.mock('@/api/services/organizations')

describe('Organizations Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should fetch organizations', async () => {
    const store = useOrganizationsStore()
    const mockData = [{ id: '1', name: 'Org 1' }]

    vi.spyOn(organizationsService, 'list').mockResolvedValue({
      data: mockData,
      total: 1,
    })

    await store.fetch()

    expect(store.items).toEqual(mockData)
  })

  it('should create organization', async () => {
    const store = useOrganizationsStore()
    const newOrg = { id: '2', name: 'Org 2' }

    vi.spyOn(organizationsService, 'create').mockResolvedValue({
      data: newOrg,
    })

    await store.create({ name: 'Org 2' })

    expect(store.items).toContain(newOrg)
  })
})
```

### E2E Test Example

**File**: `tests/e2e/organizations.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('Organizations', () => {
  test('should list organizations', async ({ page }) => {
    await page.goto('/onboarding/organizations')

    // Wait for table to load
    await page.waitForSelector('table')

    // Check table has rows
    const rows = await page.locator('table tbody tr')
    expect(rows).not.toHaveCount(0)
  })

  test('should create organization', async ({ page }) => {
    await page.goto('/onboarding/organizations')

    // Click create button
    await page.click('button:has-text("Create Organization")')

    // Fill form
    await page.fill('input[placeholder="Organization name"]', 'Test Org')
    await page.fill('input[placeholder="Organization code"]', 'TEST')

    // Submit
    await page.click('button:has-text("Save")')

    // Check success
    await expect(page).toHaveURL('/onboarding/organizations')
  })
})
```

---

## Performance Optimization

### 1. Code Splitting

```typescript
// Use dynamic imports for route components
const OrganizationsList = () => import('@/components/onboarding/organizations/OrganizationsList.vue')
const TransactionsList = () => import('@/components/transactions/TransactionsList.vue')

// Routes with lazy loading
const routes = [
  {
    path: '/onboarding/organizations',
    component: OrganizationsList,
  },
]
```

### 2. Virtual Scrolling for Large Lists

```typescript
// For tables with 1000+ rows, use virtual scrolling
import { VirtualScroller } from '@headlessui/vue'

// Large dataset pagination example
const itemsPerPage = 100
const currentPage = ref(1)
const visibleItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return items.value.slice(start, start + itemsPerPage)
})
```

### 3. Debounced Search

```typescript
import { debounce } from 'lodash-es'

const searchQuery = ref('')
const debouncedSearch = debounce(async (query: string) => {
  await store.fetch({ search: query })
}, 300)

const handleSearch = (query: string) => {
  searchQuery.value = query
  debouncedSearch(query)
}
```

### 4. Memoization

```typescript
import { computed } from 'vue'

// Computed properties are automatically memoized
const filteredAndSorted = computed(() => {
  return items.value
    .filter(item => item.name.includes(searchQuery.value))
    .sort((a, b) => a.name.localeCompare(b.name))
})
```

---

## Security Considerations

### 1. CORS & Headers

```typescript
// Configure CORS headers in API requests
const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})
```

### 2. XSS Prevention

```typescript
// Vue 3 automatically escapes content
// But for HTML, use v-html carefully and sanitize
import DOMPurify from 'dompurify'

// In template
<div v-html="DOMPurify.sanitize(htmlContent)"></div>
```

### 3. CSRF Token

```typescript
// Include CSRF token in requests
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content

client.interceptors.request.use((config) => {
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken
  }
  return config
})
```

### 4. Input Validation

```typescript
// Always validate user input on client AND server
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// In form
<input
  type="email"
  @blur="validateEmail"
  required
/>
```

---

## Deployment Checklist

- [ ] Remove console.log statements
- [ ] Enable production build
- [ ] Configure environment variables
- [ ] Run security audit (npm audit)
- [ ] Test all CRUD operations
- [ ] Verify error handling
- [ ] Check responsive design
- [ ] Validate accessibility (WCAG AA)
- [ ] Test cross-browser compatibility
- [ ] Performance test (Lighthouse)
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy
- [ ] Plan rollback procedure

---

## Useful Resources

- [Vue 3 Docs](https://vuejs.org)
- [Pinia Documentation](https://pinia.vuejs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Headless UI](https://headlessui.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Zod Validation](https://zod.dev)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Testing](https://playwright.dev)

---

## Common Issues & Solutions

### Issue: Components not updating after API call

**Solution**: Use `ref()` instead of plain objects, ensure reactivity

```typescript
// ❌ Wrong
const items = { data: [] }

// ✅ Correct
const items = ref([])
```

### Issue: Memory leak in components

**Solution**: Clean up subscriptions in unmount

```typescript
onUnmounted(() => {
  subscription.unsubscribe()
  window.removeEventListener('resize', handleResize)
})
```

### Issue: Slow table rendering

**Solution**: Use pagination or virtual scrolling

```typescript
// Limit items shown at once
const itemsPerPage = 50
const currentPage = ref(1)
const displayedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return items.value.slice(start, start + itemsPerPage)
})
```

### Issue: CORS errors in development

**Solution**: Configure proxy in vite.config.ts

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

---

## Next Steps

1. **Week 1**: Setup project structure & create base components
2. **Week 2-3**: Implement Organizations & Ledgers modules
3. **Week 4-5**: Add Assets, Accounts, Portfolios, Segments
4. **Week 6-7**: Build Transaction routes and routes management
5. **Week 8-9**: Implement Transaction creation & details
6. **Week 10-11**: Add Operations, Balances, Asset rates
7. **Week 12**: Testing, optimization, deployment

