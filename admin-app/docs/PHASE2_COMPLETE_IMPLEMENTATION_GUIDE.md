# Midaz Admin App - Phase 2 Complete Implementation Guide

**Phase**: Phase 2 - Onboarding Module (Organizations & Ledgers)  
**Duration**: 2-3 weeks (30-40 hours estimated)  
**Target Completion**: November 4, 2025  
**Last Updated**: October 21, 2025

---

## 🎯 Phase 2 Overview

### What We're Building
Complete CRUDL (Create, Read, Update, Delete, List) interfaces for:
- **Organizations**: Top-level entities (Companies, Groups, Institutions)
- **Ledgers**: Financial record-keeping systems under organizations
- **Assets**: Currency/crypto assets used in ledgers
- **Accounts**: Individual financial accounts within ledgers
- **Portfolios**: Groupings of accounts for portfolio-level operations
- **Segments**: Hierarchical groupings for organizational structure
- **Operation Routes**: Configuration for account operation routing
- **Transaction Routes**: Configuration for transaction routing

### Architecture Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                      Dashboard Layout                        │
├─────────────────────────────────────────────────────────────┤
│  Sidebar         │  Top Bar (Breadcrumb, Search, User)      │
│  - Dashboard     │  ┌─────────────────────────────────────┐ │
│  - Onboarding    │  │         Content Area                │ │
│    - Orgs        │  │   ┌──────────────────────────────┐  │ │
│    - Ledgers     │  │   │  List/Detail Page            │  │ │
│    - Accounts    │  │   │  - Filters & Search          │  │ │
│    - Assets      │  │   │  - Table/Cards               │  │ │
│    - Portfolios  │  │   │  - Pagination                │  │ │
│    - Segments    │  │   │  - Actions (CRUD)            │  │ │
│  - Operations    │  │   └──────────────────────────────┘  │ │
│  - Transactions  │  │                                       │ │
└─────────────────────────────────────────────────────────────┘
```

### Component Structure Per Module

For each module (Organizations, Ledgers, etc.), we follow this pattern:

```
app/components/
├── [module]/
│   ├── index.ts (barrel export)
│   ├── [Module]List.vue (list page with filters)
│   ├── [Module]Table.vue (reusable table)
│   ├── [Module]Form.vue (form for create/edit)
│   ├── [Module]Detail.vue (detail/view page)
│   └── [Module]Actions.vue (action buttons/dropdown)
│
└── shared/
    ├── SelectOrganization.vue (async select with search)
    └── SelectLedger.vue (async select for ledgers)

app/pages/onboarding/
├── [module]/
│   ├── List.vue (wrapper calling components)
│   └── Detail.vue (wrapper calling components)
```

---

## 📋 Implementation Checklist

### Phase 2 Component Breakdown

| Module | Components | Status | Est. Hours |
|--------|-----------|--------|-----------|
| Organizations | 7 | ⏳ Ready | 8 |
| Ledgers | 7 | ⏳ Ready | 8 |
| Assets | 6 | ⏳ Ready | 6 |
| Accounts | 8 | ⏳ Ready | 10 |
| **Phase 2 Total** | **28** | **⏳ Ready** | **32** |

---

## 🚀 Starting Phase 2 Implementation

### Prerequisites Checklist
- [ ] Phase 1 components built (Button, Input, Modal, Table, etc.)
- [ ] API services created (organizations, ledgers, assets, accounts, etc.)
- [ ] Pinia stores initialized (all 12 stores)
- [ ] Router configured (all routes)
- [ ] Base Layout, Sidebar, TopBar in place
- [ ] TypeScript types defined for all entities

**Status**: ✅ All prerequisites met - Ready to proceed with Phase 2

---

## 📝 Daily Implementation Log

### Day 1: Organizations Module (8 hours)

#### Tasks
1. **OrganizationForm.vue** (2 hours)
   - Create component with full form fields
   - Email, phone, website validation
   - Metadata JSON editor
   - Responsive grid layout (2 col desktop, 1 col mobile)
   - localStorage auto-save
   - Accessibility (ARIA labels)

2. **OrganizationsTable.vue** (1.5 hours)
   - Sortable columns
   - Pagination controls
   - Row actions (View, Edit, Delete, Copy ID)
   - Status badges with color coding
   - Responsive table design
   - Empty state handling

3. **OrganizationsList.vue** (1.5 hours)
   - Search/filter functionality
   - Create button
   - Error handling
   - Loading states
   - Integrates Table component
   - API integration with store

4. **OrganizationDetail.vue** (1.5 hours)
   - Tabbed interface (Info, Assets, Accounts, Metadata, Audit)
   - Edit button integration
   - Delete confirmation
   - Copy ID to clipboard
   - Related entities display
   - Responsive tabs for mobile

5. **Polish & Testing** (1 hour)
   - Visual consistency check
   - Mobile responsiveness test
   - No console errors
   - Link to other modules

---

### Day 2: Ledgers Module (8 hours)

#### Tasks
1. **LedgerForm.vue** (2 hours)
   - Organization selector (dropdown with search)
   - Currency/asset selector
   - Description field
   - Advanced options (metadata, settings)
   - Form validation
   - Responsive design

2. **LedgersTable.vue** (1.5 hours)
   - Organization name column
   - Asset/currency column
   - Account count display
   - Status badges
   - Row actions
   - Pagination

3. **LedgersList.vue** (1.5 hours)
   - Filter by organization
   - Filter by status
   - Search by name
   - Create button
   - API integration
   - Error handling

4. **LedgerDetail.vue** (2 hours)
   - Organization info display
   - Tabbed interface (Info, Assets, Accounts, Operations)
   - Asset rate display
   - Account list mini-table
   - Edit/Delete actions
   - Copy ID

5. **Polish & Testing** (1 hour)
   - Verify all links work
   - Test navigation between modules
   - Mobile responsiveness
   - No console errors

---

### Day 3: Assets, Portfolios, Segments (8 hours)

#### Tasks (in parallel or sequence)

**Assets (2 hours)**
- Asset code validation
- Decimals input
- Status badges
- List and detail views

**Portfolios (3 hours)**
- Ledger context display
- Account count tracking
- Create/edit forms
- List and detail pages

**Segments (3 hours)**
- Hierarchical tree display
- Parent segment selector
- Circular dependency prevention
- Expand/collapse tree
- Detail pages with child segments

---

### Day 4: Accounts Module (10 hours)

#### Tasks
1. **AccountForm.vue** (3 hours)
   - Ledger selector
   - Asset/currency selector
   - Portfolio selector
   - Segment selector
   - Name, alias, entity ID fields
   - Metadata editor
   - Complex validation

2. **AccountsTable.vue** (2 hours)
   - Current, available, on-hold balance columns
   - Account type badge
   - Status indicators
   - Sortable columns
   - Row actions

3. **AccountsList.vue** (2 hours)
   - Advanced filtering (ledger, status, asset, portfolio)
   - Filter UI with chips
   - Search by name/alias
   - Balance display
   - Pagination

4. **AccountDetail.vue** (2 hours)
   - Tabbed interface (Info, Balance Widget, Operations, Transactions)
   - Live balance display
   - Transaction history
   - Operations list
   - Edit/Delete actions

5. **BalanceSummaryWidget.vue** (1 hour)
   - Current balance display
   - Available balance
   - On-hold balance
   - Last updated timestamp
   - Sparkline trend (optional)

---

## 🔧 Implementation Details

### API Integration Pattern

All CRUDL operations follow this pattern:

```typescript
// In store (e.g., organizations.ts)
const fetch = async (params: FetchParams) => {
  loading.value = true
  try {
    const data = await organizationsService.list(params)
    items.value = data.items
    pagination.value = data.pagination
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const create = async (data: CreateOrgPayload) => {
  loading.value = true
  try {
    const result = await organizationsService.create(data)
    items.value.unshift(result)
    return result
  } catch (err) {
    error.value = err.message
    throw err
  } finally {
    loading.value = false
  }
}

// Similar for update, delete, getById
```

### Form Validation Pattern

```typescript
// In component
const validateForm = () => {
  errors.value = {}
  
  if (!formData.name?.trim()) {
    errors.value.name = 'Name is required'
  }
  
  if (!validateEmail(formData.email)) {
    errors.value.email = 'Invalid email format'
  }
  
  return Object.keys(errors.value).length === 0
}

// In template
<div v-if="errors.name" class="text-red-600 text-sm mt-1">
  {{ errors.name }}
</div>
```

### Responsive Design Pattern

```vue
<!-- Desktop: 2 columns, Mobile: 1 column -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>...</div>
  <div>...</div>
</div>

<!-- Flex for actions -->
<div class="flex flex-col sm:flex-row gap-2">
  <button>...</button>
  <button>...</button>
</div>
```

---

## ✅ Phase 2 Success Criteria

- [ ] All 28 components built
- [ ] CRUDL operations working for:
  - [ ] Organizations
  - [ ] Ledgers
  - [ ] Assets
  - [ ] Accounts
  - [ ] Portfolios
  - [ ] Segments
- [ ] All pages mobile responsive
- [ ] No console errors or warnings
- [ ] Proper error handling and user feedback
- [ ] All related entities correctly linked
- [ ] Form validation working correctly
- [ ] Pagination and filtering working
- [ ] Navigation between modules smooth
- [ ] Accessibility standards met (ARIA labels, keyboard nav)

---

## 🔄 How to Resume Work

If work is interrupted:

1. **Check git log**
   ```bash
   git log --oneline -n 20
   ```

2. **Check last modified files**
   ```bash
   ls -ltr app/components/organizations/
   ```

3. **Open implementation checklist**
   - Check MASTER_PHASE2_CHECKLIST.md

4. **Find next uncompleted task**
   - Look for first ⏳ in checklist
   - Continue from there

5. **Commit your work**
   ```bash
   git add app/components/[module]/
   git commit -m "feat: Add [ComponentName] component
   - [Brief description]
   - [Key features]"
   ```

---

## 📚 Documentation References

- [MASTER_PHASE2_CHECKLIST.md](./MASTER_PHASE2_CHECKLIST.md) - Detailed component checklist
- [PHASE2_IMPLEMENTATION_STEP_BY_STEP.md](./PHASE2_IMPLEMENTATION_STEP_BY_STEP.md) - Step-by-step guide
- [PHASE2_DETAILED_IMPLEMENTATION.md](./PHASE2_DETAILED_IMPLEMENTATION.md) - Technical specifications
- [ADMIN_APP_ARCHITECTURE.md](./ADMIN_APP_ARCHITECTURE.md) - Architecture patterns
- [ADMIN_APP_COMPONENTS_BREAKDOWN.md](./ADMIN_APP_COMPONENTS_BREAKDOWN.md) - Component breakdown

---

## 🎯 Next Phases Preview

After Phase 2 is complete:

- **Phase 3**: Transaction Routes, Operation Routes (2 weeks)
- **Phase 4**: Transaction Creation (JSON, Inflow, Outflow) (2 weeks)
- **Phase 5**: Transaction Details & Operations (2 weeks)
- **Phase 6**: Balances & Asset Rates (2 weeks)
- **Phase 7**: Testing & Optimization (1 week)

---

**Last Updated**: October 21, 2025  
**Version**: 1.0  
**Status**: 🟢 Ready to Start Phase 2
