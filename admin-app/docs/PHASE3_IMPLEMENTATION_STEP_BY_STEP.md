# Phase 3 Implementation Guide - Step by Step

**Phase**: 3 - Advanced Transaction Processing & Analytics  
**Status**: 🟢 READY TO START  
**Estimated Duration**: 3-4 weeks (40-50 hours)  
**Target Completion**: November 18, 2025

---

## 🚀 Getting Started

### Prerequisites
- ✅ Phase 2 complete (58 components, all CRUD operations)
- ✅ All stores and services in place
- ✅ TypeScript, Vue 3, Pinia configured
- ✅ Development environment running

### Quick Start
```bash
cd admin-app
npm run dev
# Verify: http://localhost:5173 opens with no errors
```

---

## 📋 Implementation Phases

This guide breaks Phase 3 into 4 manageable weeks with daily tasks.

---

# WEEK 1: TRANSACTION PROCESSING FOUNDATION

## Overview
Build the core transaction processing functionality with 10 components and 3 pages.

### Goals for Week 1
- ✅ 10 components built and tested
- ✅ 3 pages integrated
- ✅ Transaction creation workflow working
- ✅ Zero console errors

---

## STEP 1: TransactionBuilder Component (Day 1)

**File**: `app/components/transactions/TransactionBuilder.vue`  
**Time**: 3 hours  
**Priority**: CRITICAL (unblocks 5+ other components)

### 1.1 Create Component Structure
```bash
touch app/components/transactions/TransactionBuilder.vue
```

### 1.2 Component Template
```vue
<template>
  <div class="transaction-builder">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold">Create Transaction</h2>
      <p class="text-gray-600 mt-2">Build complex financial transactions</p>
    </div>

    <!-- Tabs for different sections -->
    <div class="tabs mb-6">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="['tab', { active: activeTab === tab }]"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Transaction Type Selection -->
    <div v-if="activeTab === 'Type'" class="section">
      <TransactionTypeSelector
        :modelValue="transaction.type"
        @update:modelValue="transaction.type = $event"
      />
    </div>

    <!-- Source & Destination -->
    <div v-if="activeTab === 'Accounts'" class="section">
      <TransactionSourceDestination
        :modelValue="{ sources: transaction.sources, destinations: transaction.destinations }"
        @update:modelValue="updateAccounts"
      />
    </div>

    <!-- Amounts -->
    <div v-if="activeTab === 'Amounts'" class="section">
      <TransactionAmountInput
        v-for="(source, idx) in transaction.sources"
        :key="`source-${idx}`"
        :modelValue="source"
        @update:modelValue="updateSourceAmount(idx, $event)"
      />
    </div>

    <!-- Metadata -->
    <div v-if="activeTab === 'Details'" class="section">
      <TransactionMetadata
        :modelValue="transaction.metadata"
        @update:modelValue="transaction.metadata = $event"
      />
    </div>

    <!-- Preview -->
    <div v-if="activeTab === 'Preview'" class="section">
      <TransactionPreview :transaction="transaction" />
    </div>

    <!-- Actions -->
    <div class="actions mt-8">
      <button @click="handlePrevious" :disabled="!canGoBack" class="btn btn-secondary">
        Previous
      </button>
      <button v-if="!isLastTab" @click="handleNext" :disabled="!canGoNext" class="btn btn-primary">
        Next
      </button>
      <button v-else @click="handleSubmit" :disabled="!isValid" class="btn btn-success">
        Submit
      </button>
    </div>

    <!-- Error Display -->
    <div v-if="errors.length" class="mt-4 p-4 bg-red-100 rounded">
      <ul>
        <li v-for="(error, idx) in errors" :key="idx" class="text-red-700">
          {{ error }}
        </li>
      </ul>
    </div>
  </div>
</template>
```

### 1.3 Component Script
```typescript
<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import TransactionTypeSelector from './TransactionTypeSelector.vue'
import TransactionSourceDestination from './TransactionSourceDestination.vue'
import TransactionAmountInput from './TransactionAmountInput.vue'
import TransactionMetadata from './TransactionMetadata.vue'
import TransactionPreview from './TransactionPreview.vue'

interface TransactionSource {
  accountId: string
  amount: number
  asset: string
}

interface TransactionDestination {
  accountId: string
  amount: number
}

interface Transaction {
  type: 'SIMPLE' | 'COMPLEX' | 'DSL'
  sources: TransactionSource[]
  destinations: TransactionDestination[]
  metadata: Record<string, any>
}

const emit = defineEmits<{
  submit: [transaction: Transaction]
}>()

const tabs = ['Type', 'Accounts', 'Amounts', 'Details', 'Preview']
const activeTab = ref(tabs[0])

const transaction = reactive<Transaction>({
  type: 'SIMPLE',
  sources: [],
  destinations: [],
  metadata: {}
})

const errors = ref<string[]>([])

// Computed properties
const currentTabIndex = computed(() => tabs.indexOf(activeTab.value))
const isLastTab = computed(() => currentTabIndex.value === tabs.length - 1)

const canGoBack = computed(() => currentTabIndex.value > 0)
const canGoNext = computed(() => validateCurrentTab())
const isValid = computed(() => validateTransaction())

// Methods
const updateAccounts = (value: any) => {
  transaction.sources = value.sources
  transaction.destinations = value.destinations
}

const updateSourceAmount = (idx: number, value: TransactionSource) => {
  transaction.sources[idx] = value
}

const validateCurrentTab = (): boolean => {
  // Implement tab-specific validation
  return true
}

const validateTransaction = (): boolean => {
  errors.value = []

  if (!transaction.type) {
    errors.value.push('Transaction type is required')
  }

  if (transaction.sources.length === 0) {
    errors.value.push('At least one source is required')
  }

  if (transaction.destinations.length === 0) {
    errors.value.push('At least one destination is required')
  }

  // Check amounts balance
  const totalOut = transaction.sources.reduce((sum, s) => sum + s.amount, 0)
  const totalIn = transaction.destinations.reduce((sum, d) => sum + d.amount, 0)

  if (Math.abs(totalOut - totalIn) > 0.01) {
    errors.value.push('Transaction amounts do not balance')
  }

  return errors.value.length === 0
}

const handlePrevious = () => {
  activeTab.value = tabs[currentTabIndex.value - 1]
}

const handleNext = () => {
  activeTab.value = tabs[currentTabIndex.value + 1]
}

const handleSubmit = () => {
  if (validateTransaction()) {
    emit('submit', transaction)
  }
}
</script>
```

### 1.4 Component Styles
```css
<style scoped>
.transaction-builder {
  max-width: 1000px;
  margin: 0 auto;
}

.tabs {
  display: flex;
  gap: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.tab {
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  transition: all 0.3s ease;
}

.tab.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.section {
  min-height: 300px;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-secondary {
  background: #e5e7eb;
  color: #1f2937;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
}
</style>
```

### 1.5 Testing Checklist
- [ ] Component renders without errors
- [ ] Tab navigation works
- [ ] Form validation works
- [ ] Submit emits correct event
- [ ] Mobile responsive
- [ ] No console errors

---

## STEP 2: TransactionTypeSelector Component (Day 1)

**File**: `app/components/transactions/TransactionTypeSelector.vue`  
**Time**: 1.5 hours

### 2.1 Create Component
```typescript
<script setup lang="ts">
import { computed } from 'vue'

type TransactionType = 'SIMPLE' | 'COMPLEX' | 'DSL' | 'TEMPLATE'

interface TypeOption {
  value: TransactionType
  label: string
  description: string
  icon: string
}

const props = defineProps<{
  modelValue: TransactionType
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TransactionType]
}>()

const types: TypeOption[] = [
  {
    value: 'SIMPLE',
    label: 'Simple Transaction',
    description: 'Single source to single destination',
    icon: 'arrow-right'
  },
  {
    value: 'COMPLEX',
    label: 'Complex Transaction',
    description: 'Multiple sources to multiple destinations',
    icon: 'arrows'
  },
  {
    value: 'DSL',
    label: 'DSL Transaction',
    description: 'Domain-specific language for complex rules',
    icon: 'code'
  },
  {
    value: 'TEMPLATE',
    label: 'From Template',
    description: 'Use a saved template',
    icon: 'template'
  }
]

const selectedType = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <div class="transaction-type-selector">
    <h3 class="text-lg font-semibold mb-4">Select Transaction Type</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label v-for="type in types" :key="type.value" class="type-option">
        <input
          type="radio"
          :value="type.value"
          v-model="selectedType"
          class="sr-only"
        />
        <div :class="['option-card', { selected: selectedType === type.value }]">
          <div class="icon">{{ type.icon }}</div>
          <h4 class="font-semibold">{{ type.label }}</h4>
          <p class="text-sm text-gray-600">{{ type.description }}</p>
        </div>
      </label>
    </div>
  </div>
</template>

<style scoped>
.option-card {
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-card:hover {
  border-color: #2563eb;
  background: #f0f9ff;
}

.option-card.selected {
  border-color: #2563eb;
  background: #dbeafe;
}

.icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
</style>
```

---

## STEP 3: TransactionSourceDestination Component (Day 1-2)

**File**: `app/components/transactions/TransactionSourceDestination.vue`  
**Time**: 2 hours

### 3.1 Create Component
```typescript
<script setup lang="ts">
import { ref, computed } from 'vue'

interface Account {
  id: string
  name: string
  code: string
  ledgerId: string
  asset: string
}

interface SourceDestination {
  sources: Array<{ accountId: string; amount?: number }>
  destinations: Array<{ accountId: string; amount?: number }>
}

const props = defineProps<{
  modelValue: SourceDestination
  accounts?: Account[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SourceDestination]
}>()

const selectedSources = ref<string[]>([])
const selectedDestinations = ref<string[]>([])

const updateModel = (sources: string[], destinations: string[]) => {
  emit('update:modelValue', {
    sources: sources.map(id => ({ accountId: id })),
    destinations: destinations.map(id => ({ accountId: id }))
  })
}
</script>

<template>
  <div class="source-destination">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Sources -->
      <div class="sources">
        <h3 class="font-semibold mb-4">Select Sources</h3>
        <div class="account-list">
          <label v-for="account in accounts" :key="account.id" class="account-item">
            <input
              type="checkbox"
              :value="account.id"
              v-model="selectedSources"
              @change="updateModel(selectedSources, selectedDestinations)"
              class="mr-2"
            />
            <span>{{ account.name }} ({{ account.code }})</span>
          </label>
        </div>
      </div>

      <!-- Destinations -->
      <div class="destinations">
        <h3 class="font-semibold mb-4">Select Destinations</h3>
        <div class="account-list">
          <label v-for="account in accounts" :key="account.id" class="account-item">
            <input
              type="checkbox"
              :value="account.id"
              v-model="selectedDestinations"
              @change="updateModel(selectedSources, selectedDestinations)"
              class="mr-2"
            />
            <span>{{ account.name }} ({{ account.code }})</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
```

---

## STEP 4: TransactionAmountInput Component (Day 2)

**File**: `app/components/transactions/TransactionAmountInput.vue`  
**Time**: 1.5 hours

### 4.1 Create Component
```typescript
<script setup lang="ts">
import { computed } from 'vue'

interface Amount {
  accountId: string
  amount: number
  asset: string
}

const props = defineProps<{
  modelValue: Amount
  assets?: Array<{ code: string; name: string }>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Amount]
}>()

const amount = computed({
  get: () => props.modelValue.amount || 0,
  set: (value) => emit('update:modelValue', {
    ...props.modelValue,
    amount: parseFloat(value as any)
  })
})

const asset = computed({
  get: () => props.modelValue.asset,
  set: (value) => emit('update:modelValue', {
    ...props.modelValue,
    asset: value
  })
})
</script>

<template>
  <div class="amount-input">
    <label class="block mb-2">
      <span class="font-semibold">Amount</span>
      <input
        v-model="amount"
        type="number"
        placeholder="0.00"
        step="0.01"
        min="0"
        class="input mt-1"
      />
    </label>

    <label class="block">
      <span class="font-semibold">Asset</span>
      <select v-model="asset" class="input mt-1">
        <option v-for="a in assets" :key="a.code" :value="a.code">
          {{ a.name }} ({{ a.code }})
        </option>
      </select>
    </label>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
</style>
```

---

## STEP 5: TransactionMetadata Component (Day 2)

**File**: `app/components/transactions/TransactionMetadata.vue`  
**Time**: 1.5 hours

Similar pattern to previous components. Add fields for:
- Transaction reference/ID
- Description
- Tags
- Custom metadata

---

## STEP 6: TransactionPreview Component (Day 2)

**File**: `app/components/transactions/TransactionPreview.vue`  
**Time**: 2 hours

Display transaction summary with:
- Type, sources, destinations
- Amount breakdown
- Total validation
- Metadata summary

---

## STEP 7: Create Transaction List Page (Day 3)

**File**: `app/pages/transactions/List.vue` (update existing)  
**Time**: 2 hours

### 7.1 Page Template
```vue
<template>
  <div class="transactions-page">
    <div class="header">
      <h1>Transactions</h1>
      <router-link to="/transactions/create" class="btn btn-primary">
        Create Transaction
      </router-link>
    </div>

    <!-- Search & Filters -->
    <TransactionSearch v-model="searchQuery" />
    <TransactionFilter v-model="filters" />

    <!-- Transactions Table -->
    <div class="table-container">
      <table v-if="transactions.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tx in transactions" :key="tx.id">
            <td>{{ tx.id }}</td>
            <td>{{ tx.type }}</td>
            <td>{{ formatCurrency(tx.amount) }}</td>
            <td><span :class="['status', tx.status]">{{ tx.status }}</span></td>
            <td>{{ formatDate(tx.createdAt) }}</td>
            <td>
              <router-link :to="`/transactions/${tx.id}`" class="link">
                View
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        No transactions found
      </div>
    </div>

    <!-- Pagination -->
    <Pagination
      v-model:page="currentPage"
      :total="total"
      :per-page="perPage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTransactionStore } from '@/stores/transactionStore'
import TransactionSearch from '@/components/transactions/TransactionSearch.vue'
import TransactionFilter from '@/components/transactions/TransactionFilter.vue'

const store = useTransactionStore()
const searchQuery = ref('')
const filters = ref({})
const currentPage = ref(1)
const perPage = 20

onMounted(async () => {
  await store.fetchTransactions()
})

const transactions = computed(() => {
  return store.transactions
    .filter(tx => {
      if (searchQuery.value) {
        return tx.id.includes(searchQuery.value)
      }
      return true
    })
    .slice((currentPage.value - 1) * perPage, currentPage.value * perPage)
})

const total = computed(() => store.transactions.length)

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}
</script>
```

---

## STEP 8: Create Transaction Detail Page (Day 3)

**File**: `app/pages/transactions/Detail.vue` (update existing)  
**Time**: 2 hours

---

## STEP 9: TransactionSearch Component (Day 4)

**File**: `app/components/transactions/TransactionSearch.vue`  
**Time**: 2 hours

---

## STEP 10: TransactionFilter Component (Day 4)

**File**: `app/components/transactions/TransactionFilter.vue`  
**Time**: 2 hours

---

## STEP 11: Integration & Testing (Day 5)

### 11.1 Verify All Components
- [ ] All 10 components render
- [ ] No console errors
- [ ] Forms validate
- [ ] Mobile responsive

### 11.2 Test Transaction Flow
- [ ] Create transaction
- [ ] View transactions
- [ ] Search/filter works
- [ ] Submit successful

### 11.3 Commit Changes
```bash
git add .
git commit -m "feat(transactions): add core transaction processing (10 components)"
git push
```

---

# WEEK 2: ADVANCED TRANSACTION FEATURES

## Overview
Add advanced features: batch processing, templates, approval workflow, and lifecycle tracking.

### Goals for Week 2
- ✅ 10+ advanced components
- ✅ Batch processing working
- ✅ Approval workflow implemented
- ✅ Audit trail visible

---

## STEP 12: TransactionBatch Component

**File**: `app/components/transactions/TransactionBatch.vue`  
**Time**: 2 hours

Build component for batch transaction processing:
- CSV upload
- Progress tracking
- Error handling
- Result summary

---

## STEP 13: TransactionTemplate Component

Similar pattern, focus on:
- Save/load templates
- Template management
- Quick creation from template

---

(Continue with similar structure for remaining components)

---

# WEEK 3: ANALYTICS & BALANCE MANAGEMENT

## Overview
Build financial analytics, reporting, and balance management systems.

---

# WEEK 4: MONITORING, SEARCH & POLISH

## Overview
Complete monitoring systems, advanced search, and final integration.

---

## 🎯 Daily Workflow Template

### Morning
```markdown
## Date: [TODAY]

**Today's Tasks**:
- [ ] Task 1: Component/Feature
- [ ] Task 2: Testing
- [ ] Task 3: Documentation

**Estimated Hours**: X hours
**Sprint Goal**: Build [feature]
```

### Evening
```markdown
## Completion Summary

**Completed**:
- ✅ [Component/Feature]
- ✅ [Tests]
- ✅ [Commit]

**Blockers**:
- None / [Issue description]

**Tomorrow**:
- [Next task]

**Time Spent**: X hours
```

---

## 🧪 Testing Each Component

After building each component, test:

```typescript
// 1. Renders without errors
expect(wrapper.vm).toBeDefined()

// 2. Props work
wrapper.setProps({ ... })
expect(wrapper.vm.prop).toBe(value)

// 3. Emits work
wrapper.vm.emitEvent()
expect(wrapper.emitted('event')).toBeTruthy()

// 4. Mobile responsive
// Resize window and verify layout

// 5. No console errors
// Check browser console

// 6. TypeScript types
// Run: npm run typecheck
```

---

## 📚 Code Patterns to Follow

### Component Pattern
```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  modelValue?: any
  items?: any[]
}

interface Emits {
  'update:modelValue': [value: any]
  submit: [data: any]
}

withDefaults(defineProps<Props>(), {})
defineEmits<Emits>()

// Component logic here
</script>

<template>
  <!-- Component template -->
</template>

<style scoped>
/* Component styles */
</style>
```

### Store Pattern
```typescript
import { defineStore } from 'pinia'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTransactions = async () => {
    try {
      loading.value = true
      const data = await transactionService.list()
      transactions.value = data
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { transactions, loading, error, fetchTransactions }
})
```

### API Service Pattern
```typescript
import http from '@/utils/http'

export const transactionService = {
  list: () => http.get('/transactions'),
  get: (id: string) => http.get(`/transactions/${id}`),
  create: (data: any) => http.post('/transactions', data),
  update: (id: string, data: any) => http.put(`/transactions/${id}`, data),
  delete: (id: string) => http.delete(`/transactions/${id}`)
}
```

---

## 🐛 Troubleshooting

### Issue: Component not rendering
**Solution**: Check TypeScript errors, verify imports, check console

### Issue: Props not updating
**Solution**: Ensure proper two-way binding, check v-model syntax

### Issue: API calls failing
**Solution**: Check mock data, verify service, check network tab

### Issue: Mobile layout broken
**Solution**: Test in DevTools, verify Tailwind classes, check viewport

### Issue: Memory leaks
**Solution**: Clean up watchers, remove event listeners, unsubscribe from observables

---

## ✅ Completion Checklist

### Per Component
- [ ] File created in correct location
- [ ] Component renders without errors
- [ ] All props typed correctly
- [ ] All emits working
- [ ] Form validation working
- [ ] Loading states visible
- [ ] Error states display
- [ ] Mobile responsive verified
- [ ] No console errors
- [ ] TypeScript: 0 errors
- [ ] Unit tests passing
- [ ] Code reviewed
- [ ] Committed to git

### Per Page
- [ ] File created
- [ ] Components integrated
- [ ] All features working
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Navigation working
- [ ] Tested in browser
- [ ] Committed to git

### Per Module
- [ ] All components complete
- [ ] All pages complete
- [ ] Integration tested
- [ ] No console errors
- [ ] Mobile verified
- [ ] Documentation complete
- [ ] Ready for code review

---

## 🚀 Ready to Start?

1. Read this guide thoroughly
2. Start with STEP 1: TransactionBuilder
3. Follow the daily workflow
4. Track progress in MASTER_PHASE3_CHECKLIST.md
5. Commit frequently with clear messages
6. Update checklist daily

---

**Status**: 🟢 Ready to Start  
**First Component**: TransactionBuilder (3 hours)  
**Timeline**: 4 weeks to completion  
**Target**: November 18, 2025

Let's build! 🎉

---

*Next: Begin STEP 1 now!*
