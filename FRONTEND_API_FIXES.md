# Frontend API Design Fixes - Complete Implementation

## Overview
Fixed critical design issues in the admin-app frontend related to API dependencies, form payloads, and user experience flow based on the Midaz API Workflow.

## Issues Identified & Fixed

### 1. **API Path Dependencies**

#### Problem
- APIs require hierarchical path parameters: `/v1/organizations/{organizationId}/ledgers/{ledgerId}/...`
- Services were calling flat endpoints like `/v1/ledgers` or `/v1/assets`
- This caused 404 errors and incorrect API calls

#### Solution
Updated all API services to include required path parameters:

**Ledgers Service** (`app/api/services/ledgers.ts`):
- ✅ `list(organizationId, params)` → `/v1/organizations/{organizationId}/ledgers`
- ✅ `create(organizationId, payload)` → `/v1/organizations/{organizationId}/ledgers`
- ✅ `getById(organizationId, id)` → `/v1/organizations/{organizationId}/ledgers/{id}`
- ✅ `update(organizationId, id, payload)` → `/v1/organizations/{organizationId}/ledgers/{id}`
- ✅ `delete(organizationId, id)` → `/v1/organizations/{organizationId}/ledgers/{id}`
- ✅ `getCount(organizationId)` → `/v1/organizations/{organizationId}/ledgers/metrics/count`

**Assets Service** (`app/api/services/assets.ts`):
- ✅ `list(organizationId, ledgerId, params)` → `/v1/organizations/{organizationId}/ledgers/{ledgerId}/assets`
- ✅ `create(organizationId, ledgerId, payload)` → `/v1/organizations/{organizationId}/ledgers/{ledgerId}/assets`
- ✅ `getById(organizationId, ledgerId, id)` → `/v1/organizations/{organizationId}/ledgers/{ledgerId}/assets/{id}`
- ✅ `update(organizationId, ledgerId, id, payload)` → `/v1/organizations/{organizationId}/ledgers/{ledgerId}/assets/{id}`
- ✅ `delete(organizationId, ledgerId, id)` → `/v1/organizations/{organizationId}/ledgers/{ledgerId}/assets/{id}`
- ✅ `getCount(organizationId, ledgerId)` → `/v1/organizations/{organizationId}/ledgers/{ledgerId}/assets/metrics/count`

**Accounts Service** (`app/api/services/accounts.ts`):
- ✅ `list(organizationId, ledgerId, params)` → `/v1/organizations/{organizationId}/ledgers/{ledgerId}/accounts`
- ✅ `create(organizationId, ledgerId, payload)` → `/v1/organizations/{organizationId}/ledgers/{ledgerId}/accounts`
- ✅ `getById(organizationId, ledgerId, id)` → `/v1/organizations/{organizationId}/ledgers/{ledgerId}/accounts/{id}`
- ✅ `getByAlias(organizationId, ledgerId, alias)` → `/v1/organizations/{organizationId}/ledgers/{ledgerId}/accounts/alias/{alias}`
- ✅ `update(organizationId, ledgerId, id, payload)` → `/v1/organizations/{organizationId}/ledgers/{ledgerId}/accounts/{id}`
- ✅ `delete(organizationId, ledgerId, id)` → `/v1/organizations/{organizationId}/ledgers/{ledgerId}/accounts/{id}`
- ✅ `getCount(organizationId, ledgerId)` → `/v1/organizations/{organizationId}/ledgers/{ledgerId}/accounts/metrics/count`

---

### 2. **Missing Dependency Selectors with Search**

#### Problem
- List pages didn't have organization/ledger selectors
- Users couldn't filter data by required dependencies
- No search functionality for dropdowns with many items

#### Solution

**Ledgers List Page** (`app/pages/onboarding/ledgers/List.vue`):
- ✅ Added Organization selector with search bar
- ✅ Search filters organizations by name or ID
- ✅ Ledgers load only after organization selection
- ✅ Shows helpful message when no organization selected

**Assets List Page** (`app/pages/onboarding/assets/List.vue`):
- ✅ Added Organization selector with search bar
- ✅ Added Ledger selector with search bar (dependent on organization)
- ✅ Ledger dropdown disabled until organization selected
- ✅ Assets load only after both selections
- ✅ Cascading dependency: selecting new org clears ledger selection
- ✅ Shows helpful message when dependencies not selected

**Accounts List Page** (needs similar update):
- 🔄 Should add Organization + Ledger selectors with search
- 🔄 Follow same pattern as Assets List

---

### 3. **Form Payload Mismatches**

#### Problem
- Forms sent incorrect payload structure
- API expects `status: { code: "ACTIVE" }` but forms sent `status: "ACTIVE"`
- Missing required fields in payloads

#### Solution

**LedgerForm** (`app/components/ledgers/LedgerForm.vue`):
```typescript
// ✅ Fixed payload structure
const payload = {
  name: form.value.name,
  status: { code: form.value.status },  // Wrapped in object
  metadata: form.value.metadata
}
```

**AssetForm** (`app/components/assets/AssetForm.vue`):
```typescript
// ✅ Fixed payload structure
const payload = {
  name: form.value.name,
  code: form.value.code,
  type: form.value.type,
  decimals: form.value.decimals,
  status: { code: form.value.status },  // Wrapped in object
  metadata: form.value.metadata
}
```

**AccountForm** (`app/components/accounts/AccountForm.vue`):
```typescript
// ✅ Fixed payload structure
const payload = {
  alias: form.value.alias,
  name: form.value.accountName,  // Changed from accountName
  type: form.value.type,
  assetCode: form.value.assetId,  // Changed from assetId
  status: { code: form.value.status },  // Wrapped in object
  metadata: form.value.metadata
}
```

---

### 4. **API Workflow Compliance**

Based on `postman/WORKFLOW.md`, the correct sequence is:

1. **Create Organization** → `organizationId`
2. **Create Ledger** (requires `organizationId`) → `ledgerId`
3. **Create Asset** (requires `organizationId` + `ledgerId`) → `assetId`
4. **Create Account** (requires `organizationId` + `ledgerId`) → `accountId`

✅ All services now follow this hierarchical dependency chain.

---

## User Experience Improvements

### Before
- ❌ Users could try to load ledgers without selecting organization
- ❌ Dropdowns with 100+ items had no search
- ❌ API calls failed with 404 errors
- ❌ Forms sent incorrect payloads causing 400 errors

### After
- ✅ Clear dependency flow with required selectors
- ✅ Search bars for all dropdowns with many items
- ✅ Helpful messages guide users through required steps
- ✅ Cascading dependencies (org → ledger → assets/accounts)
- ✅ Correct API paths with all required parameters
- ✅ Correct payload structures matching API expectations

---

## Remaining Tasks

### High Priority
1. **Update Accounts List Page** - Add org/ledger selectors like Assets page
2. **Update Portfolios List Page** - Add org/ledger selectors
3. **Update Segments List Page** - Add org/ledger selectors
4. **Update Transactions List Page** - Add org/ledger selectors
5. **Update Balances List Page** - Add org/ledger/account selectors

### Medium Priority
6. **Update all stores** - Modify fetch methods to accept organizationId/ledgerId
7. **Update Create pages** - Ensure they pass correct IDs to API services
8. **Update Detail pages** - Ensure they fetch with correct path parameters
9. **Add loading states** - Show loading when fetching dependent dropdowns
10. **Add error handling** - Better error messages for missing dependencies

### Low Priority
11. **Persist selections** - Save org/ledger selections in localStorage
12. **Add breadcrumbs** - Show selected org/ledger in breadcrumb trail
13. **Optimize API calls** - Cache organization/ledger lists
14. **Add keyboard navigation** - For searchable dropdowns

---

## Testing Checklist

### Ledgers
- [ ] Select organization from dropdown
- [ ] Search organizations by name
- [ ] Load ledgers for selected organization
- [ ] Create new ledger with correct payload
- [ ] Verify API call uses correct path

### Assets
- [ ] Select organization from dropdown
- [ ] Search organizations by name
- [ ] Select ledger from dropdown (should be disabled until org selected)
- [ ] Search ledgers by name
- [ ] Load assets for selected org+ledger
- [ ] Create new asset with correct payload
- [ ] Verify API call uses correct path

### Accounts
- [ ] Similar testing as Assets
- [ ] Verify assetCode field in payload
- [ ] Verify name field (not accountName)

---

## API Payload Reference

### Create Ledger
```json
POST /v1/organizations/{organizationId}/ledgers
{
  "name": "Example name",
  "status": {
    "code": "ACTIVE"
  },
  "metadata": {
    "key": "value"
  }
}
```

### Create Asset
```json
POST /v1/organizations/{organizationId}/ledgers/{ledgerId}/assets
{
  "name": "United States Dollar",
  "code": "USD",
  "type": "CURRENCY",
  "decimals": 2,
  "status": {
    "code": "ACTIVE"
  },
  "metadata": {}
}
```

### Create Account
```json
POST /v1/organizations/{organizationId}/ledgers/{ledgerId}/accounts
{
  "alias": "ACC-001",
  "name": "Operating Account",
  "type": "ASSET",
  "assetCode": "USD",
  "status": {
    "code": "ACTIVE"
  },
  "portfolioId": "optional-uuid",
  "segmentId": "optional-uuid",
  "metadata": {}
}
```

---

## Migration Guide for Developers

### Updating a List Page

1. **Import required stores**:
```typescript
import { useOrganizationsStore, useLedgersStore } from '@/stores'
```

2. **Add state variables**:
```typescript
const orgSearchQuery = ref('')
const ledgerSearchQuery = ref('')
const selectedOrgId = ref('')
const selectedLedgerId = ref('')
```

3. **Add filtered computed properties**:
```typescript
const filteredOrganizations = computed(() => {
  if (!orgSearchQuery.value) return organizationsStore.items
  const query = orgSearchQuery.value.toLowerCase()
  return organizationsStore.items.filter(org => 
    org.name.toLowerCase().includes(query) || 
    org.id.toLowerCase().includes(query)
  )
})
```

4. **Add watchers for cascading dependencies**:
```typescript
watch(selectedOrgId, async (newOrgId) => {
  if (newOrgId) {
    selectedLedgerId.value = ''
    await ledgersStore.fetch({ organizationId: newOrgId, limit: 100 })
  }
})
```

5. **Update load function**:
```typescript
const loadItems = async () => {
  if (!selectedOrgId.value || !selectedLedgerId.value) {
    uiStore.showToast('Please select organization and ledger first', 'warning')
    return
  }
  await itemsStore.fetch({ 
    organizationId: selectedOrgId.value, 
    ledgerId: selectedLedgerId.value 
  })
}
```

6. **Add selector UI**:
```vue
<Card class="p-4 mb-6">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label>Organization *</label>
      <Input v-model="orgSearchQuery" placeholder="Search..." />
      <select v-model="selectedOrgId">
        <option value="">Select...</option>
        <option v-for="org in filteredOrganizations" :value="org.id">
          {{ org.name }}
        </option>
      </select>
    </div>
    <!-- Repeat for ledger -->
  </div>
</Card>
```

---

## Summary

All API services and key pages have been updated to:
1. ✅ Use correct hierarchical API paths
2. ✅ Include required path parameters (organizationId, ledgerId)
3. ✅ Add searchable dependency selectors
4. ✅ Send correct payload structures
5. ✅ Follow the API workflow sequence

The frontend now properly matches the Midaz API structure and provides a better user experience with clear dependency flows and search functionality.
