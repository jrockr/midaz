# Phase 2: Organizations & Ledgers - Implementation Checklist

**Phase Status**: 🟡 IN PROGRESS  
**Start Date**: October 21, 2025  
**Target Completion**: 2-3 days  
**Total Tasks**: 14 tasks (5 + 5 + 4)

---

## 📋 Organizations CRUDL (5 tasks)

### Task 2.1: Organizations List Page Component
**Status**: ⏳ READY TO START
**File**: `app/pages/onboarding/Organizations.vue`
**Dependencies**: Organization store, Table component, Layout
**Time Estimate**: 2 hours

**Subtasks**:
- [ ] Create Organizations.vue page component
- [ ] Implement search/filter UI
- [ ] Add pagination controls
- [ ] Connect to organizations store (list action)
- [ ] Display loading/empty states
- [ ] Test with mock data

**API Endpoint**: `GET /v1/organizations`

**Key Features**:
- List all organizations
- Search by name/code
- Filter by status
- Pagination (limit, offset)
- Sort columns
- Action buttons (View, Edit, Delete)

---

### Task 2.2: Create/Edit Organization Modal
**Status**: ⏳ READY TO START
**File**: `app/components/onboarding/OrganizationModal.vue`
**Dependencies**: Modal component, Form validation, Organizations store
**Time Estimate**: 1.5 hours

**Subtasks**:
- [ ] Create OrganizationModal component
- [ ] Build form with required fields
- [ ] Add validation logic
- [ ] Implement create flow
- [ ] Implement edit flow
- [ ] Handle loading/error states
- [ ] Success notification

**API Endpoints**:
- `POST /v1/organizations` (Create)
- `PATCH /v1/organizations/{organizationId}` (Update)

**Form Fields**:
- Organization Name (required)
- Organization Code (required, unique)
- Description (optional)
- Status (active/inactive)
- Metadata (optional)

---

### Task 2.3: Organization Detail View
**Status**: ⏳ READY TO START
**File**: `app/pages/onboarding/OrganizationDetail.vue`
**Dependencies**: Router, Organization store, Tabs component
**Time Estimate**: 1.5 hours

**Subtasks**:
- [ ] Create OrganizationDetail page
- [ ] Fetch organization data on mount
- [ ] Create tabs structure (Details, Ledgers, Activity)
- [ ] Implement Details tab
- [ ] Add edit button with modal trigger
- [ ] Add breadcrumb navigation
- [ ] Handle 404 errors

**API Endpoint**: `GET /v1/organizations/{organizationId}`

**Tabs**:
1. Details - Show all org info
2. Ledgers - List associated ledgers
3. Activity - Show recent actions (future)

---

### Task 2.4: Complete Organizations API Service
**Status**: ⏳ READY TO START
**File**: `app/api/services/organizations.ts`
**Dependencies**: API client
**Time Estimate**: 1 hour

**Subtasks**:
- [ ] Implement complete CRUDL methods
- [ ] Add count endpoint support
- [ ] Add search parameters
- [ ] Add error handling
- [ ] Add request/response types
- [ ] Test with API

**Methods to Implement**:
- `list(params)` - GET /v1/organizations
- `create(data)` - POST /v1/organizations
- `get(id)` - GET /v1/organizations/{id}
- `update(id, data)` - PATCH /v1/organizations/{id}
- `delete(id)` - DELETE /v1/organizations/{id} (if available)
- `count()` - HEAD /v1/organizations/metrics/count

---

### Task 2.5: Router Setup for Organization Routes
**Status**: ⏳ READY TO START
**File**: `app/router/index.ts`
**Dependencies**: Vue Router
**Time Estimate**: 1 hour

**Subtasks**:
- [ ] Create router.ts if not exists
- [ ] Define organization routes
- [ ] Add lazy loading for pages
- [ ] Setup breadcrumbs
- [ ] Add route guards if needed
- [ ] Test navigation

**Routes to Create**:
```
/onboarding/organizations          # List
/onboarding/organizations/:id      # Detail
/onboarding/organizations/new      # Create redirect
```

---

## 📊 Ledgers CRUDL (5 tasks)

### Task 2.6: Ledgers List Page Component
**Status**: ⏳ BLOCKED (Waiting for Task 2.1)
**File**: `app/pages/onboarding/Ledgers.vue`
**Dependencies**: Organization detail, Ledger store, Table component
**Time Estimate**: 2 hours

**Subtasks**:
- [ ] Create Ledgers.vue page
- [ ] Get organizationId from route params
- [ ] Implement search/filter
- [ ] Add pagination controls
- [ ] Connect to ledgers store
- [ ] Display loading/empty states
- [ ] Add quick-create button

**API Endpoint**: `GET /v1/organizations/{organizationId}/ledgers`

**Key Features**:
- Context-aware (show org name)
- Search by name/code
- Filter by status
- Sort columns
- Quick view/edit/delete

---

### Task 2.7: Create/Edit Ledger Modal
**Status**: ⏳ BLOCKED (Waiting for Task 2.2)
**File**: `app/components/onboarding/LedgerModal.vue`
**Dependencies**: Modal component, Ledger store, Organization context
**Time Estimate**: 1.5 hours

**Subtasks**:
- [ ] Create LedgerModal component
- [ ] Build form with fields
- [ ] Add validation
- [ ] Implement create flow
- [ ] Implement edit flow
- [ ] Handle org context
- [ ] Success notification

**API Endpoints**:
- `POST /v1/organizations/{organizationId}/ledgers` (Create)
- `PATCH /v1/organizations/{organizationId}/ledgers/{ledgerId}` (Update)

**Form Fields**:
- Ledger Name (required)
- Ledger Code (required)
- Currency (optional)
- Description (optional)
- Metadata (optional)

---

### Task 2.8: Ledger Detail with Tabs
**Status**: ⏳ BLOCKED (Waiting for Task 2.3)
**File**: `app/pages/onboarding/LedgerDetail.vue`
**Dependencies**: Router, Ledger store, Tabs
**Time Estimate**: 2 hours

**Subtasks**:
- [ ] Create LedgerDetail page
- [ ] Fetch ledger data with org context
- [ ] Create tabs: Details, Accounts, Assets, Portfolios, Segments
- [ ] Implement Details tab
- [ ] Add nested sub-pages for each tab
- [ ] Add edit button
- [ ] Breadcrumb navigation

**API Endpoint**: `GET /v1/organizations/{organizationId}/ledgers/{ledgerId}`

**Tabs**:
1. Details - Ledger info
2. Accounts - Linked accounts list
3. Assets - Available assets
4. Portfolios - Associated portfolios
5. Segments - Defined segments

---

### Task 2.9: Complete Ledgers API Service
**Status**: ⏳ BLOCKED (Waiting for Task 2.4)
**File**: `app/api/services/ledgers.ts`
**Dependencies**: API client
**Time Estimate**: 1 hour

**Subtasks**:
- [ ] Implement CRUDL methods
- [ ] Add count endpoint
- [ ] Add search parameters
- [ ] Add error handling
- [ ] Add request/response types

**Methods to Implement**:
- `list(orgId, params)` - GET /v1/organizations/{orgId}/ledgers
- `create(orgId, data)` - POST /v1/organizations/{orgId}/ledgers
- `get(orgId, id)` - GET /v1/organizations/{orgId}/ledgers/{id}
- `update(orgId, id, data)` - PATCH /v1/organizations/{orgId}/ledgers/{id}
- `delete(orgId, id)` - DELETE /v1/organizations/{orgId}/ledgers/{id}
- `count(orgId)` - HEAD /v1/organizations/{orgId}/ledgers/metrics/count

---

### Task 2.10: Router Setup for Ledger Routes
**Status**: ⏳ BLOCKED (Waiting for Task 2.5)
**File**: `app/router/index.ts`
**Dependencies**: Vue Router, Organization routes
**Time Estimate**: 1 hour

**Subtasks**:
- [ ] Add ledger routes under organization detail
- [ ] Add lazy loading
- [ ] Setup nested routing
- [ ] Add breadcrumbs
- [ ] Test navigation

**Routes to Create**:
```
/onboarding/organizations/:orgId/ledgers          # List
/onboarding/organizations/:orgId/ledgers/:id      # Detail
/onboarding/organizations/:orgId/ledgers/new      # Create
```

---

## 🔗 Integration (4 tasks)

### Task 2.11: Navigation Menu Integration
**Status**: ⏳ BLOCKED (Waiting for Tasks 2.1, 2.6)
**File**: `app/components/layout/Sidebar.vue`
**Dependencies**: Router, UI store
**Time Estimate**: 1 hour

**Subtasks**:
- [ ] Update Sidebar with onboarding menu
- [ ] Add Organizations menu item
- [ ] Add Ledgers menu item (show when org selected)
- [ ] Add active state styling
- [ ] Add icons
- [ ] Test menu navigation

**Menu Structure**:
```
Onboarding
├── Organizations
├── Ledgers
├── Accounts
├── Assets
├── Portfolios
└── Segments
```

---

### Task 2.12: Breadcrumb Navigation
**Status**: ⏳ BLOCKED (Waiting for Tasks 2.1, 2.3)
**File**: `app/components/common/Breadcrumb.vue` (New)
**Dependencies**: Router
**Time Estimate**: 45 min

**Subtasks**:
- [ ] Create Breadcrumb component
- [ ] Auto-generate from route
- [ ] Style with Tailwind
- [ ] Add click navigation
- [ ] Test with different routes
- [ ] Export from components/index

**Features**:
- Dynamic breadcrumb generation
- Click navigation
- Home link
- Current page highlight

---

### Task 2.13: Error Handling & Notifications
**Status**: ⏳ BLOCKED (Waiting for Tasks 2.2, 2.7)
**File**: `app/utils/error-handler.ts` (enhancement)
**Dependencies**: Toast component
**Time Estimate**: 1 hour

**Subtasks**:
- [ ] Enhance error handling in API calls
- [ ] Map API errors to user messages
- [ ] Integrate Toast component
- [ ] Add error notifications to CRUD operations
- [ ] Add retry logic for failed requests
- [ ] Test error scenarios

**Error Types to Handle**:
- 400 - Bad Request (validation)
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 409 - Conflict (duplicate)
- 500 - Server Error

---

### Task 2.14: Loading States & Skeleton Loaders
**Status**: ⏳ BLOCKED (Waiting for Tasks 2.1, 2.6)
**File**: `app/components/common/Skeleton.vue` (New)
**Dependencies**: Tailwind CSS
**Time Estimate**: 1 hour

**Subtasks**:
- [ ] Create Skeleton loader component
- [ ] Add different variants (line, box, table-row)
- [ ] Integrate into list pages
- [ ] Add loading state to Tables
- [ ] Add loading state to Detail pages
- [ ] Test loading animations

**Skeleton Variants**:
- Line - Single line of text
- Box - Box/card shape
- TableRow - Table row skeleton
- Avatar - Circle skeleton

---

## 📊 Progress Tracking

### By Task Group
| Group | Progress | Tasks |
|-------|----------|-------|
| Organizations | 0% | 0/5 |
| Ledgers | 0% | 0/5 |
| Integration | 0% | 0/4 |
| **TOTAL** | **0%** | **0/14** |

### By Status
| Status | Count |
|--------|-------|
| ✅ Complete | 0 |
| 🟡 In Progress | 0 |
| ⏳ Ready | 5 |
| 🚫 Blocked | 9 |

---

## 🎯 Daily Targets

### Day 1 (Today)
- [ ] Complete Tasks 2.1 (Org List) & 2.4 (API Service)
- [ ] Test org list with mock data
- [ ] Commit: "Phase 2: Organizations list & API service"

### Day 2
- [ ] Complete Task 2.2 (Create/Edit Modal)
- [ ] Complete Task 2.3 (Organization Detail)
- [ ] Complete Task 2.5 (Router Setup)
- [ ] Commit: "Phase 2: Organization CRUDL complete"

### Day 3
- [ ] Complete Tasks 2.6-2.10 (Ledgers CRUDL)
- [ ] Complete Tasks 2.11-2.14 (Integration)
- [ ] Test end-to-end flow
- [ ] Commit: "Phase 2: Complete"

---

## 🔄 Blocking Dependencies

```
2.1 (Org List) ← blocked by nothing ✓
2.2 (Create/Edit) ← blocked by nothing ✓
2.3 (Detail) ← blocked by nothing ✓
2.4 (API Service) ← blocked by nothing ✓
2.5 (Router) ← blocked by nothing ✓
    ↓
2.6 (Ledger List) ← blocked by 2.1
2.7 (Ledger Modal) ← blocked by 2.2
2.8 (Ledger Detail) ← blocked by 2.3
2.9 (Ledger API) ← blocked by 2.4
2.10 (Router) ← blocked by 2.5
    ↓
2.11 (Menu) ← blocked by 2.1 & 2.6
2.12 (Breadcrumb) ← blocked by 2.1 & 2.3
2.13 (Error Handling) ← blocked by 2.2 & 2.7
2.14 (Skeleton) ← blocked by 2.1 & 2.6
```

---

## 📝 Implementation Notes

### Code Style
- Use Composition API (setup) for Vue components
- Props: Define with type annotations
- Emit: Define custom events clearly
- State: Use Pinia stores for shared state

### Component Structure
```vue
<template>
  <!-- Template code -->
</template>

<script setup lang="ts">
// Script code
</script>

<style scoped>
/* Scoped styles */
</style>
```

### API Integration
- Always handle loading/error states
- Use try-catch in async functions
- Display meaningful error messages
- Show success notifications

### Testing Approach
- Test components with mock store data
- Mock API calls with Axios interceptors
- Test user interactions
- Verify form validation

---

## 🚀 Success Criteria for Phase 2

- [x] All 14 tasks completed
- [x] Full CRUDL for Organizations
- [x] Full CRUDL for Ledgers
- [x] Router fully configured
- [x] All pages render without errors
- [x] API integration working
- [x] Form validation working
- [x] Error handling in place
- [x] Loading states visible
- [x] Notifications working
- [x] End-to-end flow testable
- [x] Code committed to git

---

**Last Updated**: October 21, 2025  
**Phase Start**: Today  
**Target Completion**: 2-3 days
