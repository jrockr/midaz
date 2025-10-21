# Midaz Admin App - Phase 2 Session 2 Implementation Plan

**Date**: October 21, 2025  
**Phase**: Phase 2 - Onboarding Module Expansion  
**Session**: Session 2 - Ledgers, Assets & Accounts Implementation  
**Developer**: Senior Frontend Developer (Vue 3)  
**Status**: 🚀 KICKOFF - IMPLEMENTATION STARTING

---

## 📊 Current Status from Session 1

```
Phase 2 Progress: 15% (8/55 components)
  ✅ Organizations: 40% (3/7 complete)
  ⏳ Ledgers: 0% (0/7 - NEXT)
  ⏳ Assets: 0% (0/6 - NEXT)
  ⏳ Accounts: 0% (0/8 - NEXT)
  ⏳ Portfolios: 0% (0/6 - deferred)
  ⏳ Segments: 0% (0/6 - deferred)
  ⏳ Op Routes: 0% (0/7 - deferred)
  ⏳ Tx Routes: 0% (0/6 - deferred)
```

**Last Session Achievement**: Organizations CRUD foundation with production-ready components

---

## 🎯 Session 2 Goals (8-10 hours)

### Primary Objectives
1. ✅ **Complete Ledgers Module** (7 components) - 3 hours
2. ✅ **Build Assets Module** (6 components) - 2 hours
3. ✅ **Implement Accounts Module** (8 components) - 3 hours
4. ✅ **Integration Testing** - 1 hour
5. ✅ **Documentation & Handoff** - 1 hour

### Secondary Objectives
- Maintain code quality and consistency
- Follow established patterns from Organizations module
- Keep TypeScript strict mode compliant
- Ensure responsive design (mobile-first)
- Document patterns for reusability

---

## 📦 Module Breakdown

### LEDGERS MODULE (7 Components - 3 hours)

**Business Logic**:
- Belongs to: Organization
- Contains: Accounts
- Properties: Name, Currency, Metadata
- Status: Active/Inactive

**Components to Build**:
1. **LedgerForm.vue** (Similar to OrganizationForm)
   - Organization selector dropdown
   - Currency selector (ISO 4217)
   - Name input
   - Description textarea
   - Metadata JSON editor
   - Validation for required fields
   - Draft auto-save to localStorage

2. **LedgersTable.vue** (Similar to OrganizationsTable)
   - Columns: Name, Organization, Currency, Status, Created
   - Sortable columns
   - Pagination (10, 25, 50 per page)
   - Row actions: View, Edit, Delete, Copy ID
   - Status badge (active/inactive)
   - Copy to clipboard for IDs

3. **List.vue Page**
   - Search (name, organization, currency)
   - Filter by status
   - Filter by organization
   - Filter by currency
   - Create modal with LedgerForm
   - Delete confirmation modal
   - Toast notifications
   - Table integration

4. **Detail.vue Page** (Enhanced Version)
   - Tabs: Overview, Accounts, Metadata, Activity
   - Overview: Display all ledger details
   - Accounts: Mini list of accounts in this ledger
   - Metadata: Formatted JSON display
   - Activity: Created date, last modified
   - Action buttons: Edit, Delete, Create Account

5. **Create.vue Page**
   - Form wrapper around LedgerForm
   - Success redirect to list
   - Error handling

6. **Edit.vue Page**
   - Pre-fill form with ledger data
   - Form wrapper around LedgerForm
   - Save changes
   - Error handling

7. **Delete Modal**
   - Confirmation with ledger name
   - Warning about cascading (accounts)
   - Soft delete or hard delete option

**API Endpoints** (from Midaz API):
- `GET /ledgers` - List ledgers
- `POST /ledgers` - Create ledger
- `GET /ledgers/{id}` - Get ledger details
- `PUT /ledgers/{id}` - Update ledger
- `DELETE /ledgers/{id}` - Delete ledger

---

### ASSETS MODULE (6 Components - 2 hours)

**Business Logic**:
- Belongs to: Organization
- Represents: Currencies/Securities
- Properties: Code, Name, Decimals, Status
- Used by: Accounts, Transactions

**Components to Build**:
1. **AssetForm.vue**
   - Code input (3-4 chars, e.g., USD, EUR, BTC)
   - Name input (e.g., "United States Dollar")
   - Decimals input (1-8, default 2)
   - Type selector (Currency, Security, Commodity, Other)
   - Metadata JSON editor
   - Validation for unique code per org
   - Draft auto-save

2. **AssetsTable.vue**
   - Columns: Code, Name, Type, Decimals, Status, Created
   - Sortable, paginated
   - Row actions: View, Edit, Delete, Copy Code
   - Status badge
   - Copy to clipboard

3. **List.vue Page**
   - Search (code, name, type)
   - Filter by status
   - Filter by type
   - Create button/modal
   - Inline editing option (optional)
   - Delete confirmation

4. **Detail.vue Page**
   - Tabs: Overview, Rates, Accounts, Metadata
   - Overview: All asset details
   - Rates: Show asset rates (links to transaction rates)
   - Accounts: Mini list of accounts using this asset
   - Metadata: Formatted JSON
   - Edit/Delete buttons

5. **Create.vue Page**
   - Asset form wrapper
   - Success handling

6. **Edit.vue Page**
   - Pre-filled asset form
   - Update handling

**API Endpoints**:
- `GET /assets` - List assets
- `POST /assets` - Create asset
- `GET /assets/{id}` - Get asset details
- `PUT /assets/{id}` - Update asset
- `DELETE /assets/{id}` - Delete asset
- `GET /asset-rates` - List rates (for detail page)

---

### ACCOUNTS MODULE (8 Components - 3 hours)

**Business Logic**:
- Belongs to: Ledger, Portfolio, Segment (optional)
- Has: Asset, Balance, Transaction History
- Properties: Name, Type, Status, Code
- Complex relationships with Portfolio & Segment

**Components to Build**:
1. **AccountForm.vue**
   - Ledger selector (required, auto-filter by org)
   - Asset selector (from ledger's org assets)
   - Name input
   - Code input (optional, auto-generate if empty)
   - Type selector (Checking, Savings, Liability, Asset, etc.)
   - Portfolio selector (optional, multi-select or single)
   - Segment selector (optional, multi-select or single)
   - Opening balance input
   - Currency display (read-only from ledger)
   - Status selector
   - Metadata JSON editor
   - Comprehensive validation

2. **AccountsTable.vue**
   - Columns: Code, Name, Ledger, Asset, Type, Balance, Status
   - Sortable, paginated
   - Row actions: View, Edit, Delete, Copy Code
   - Balance display with formatting
   - Status badge
   - Account type badge (different colors)

3. **List.vue Page**
   - Search (code, name, type)
   - Filter by ledger
   - Filter by asset
   - Filter by type
   - Filter by status
   - Filter by portfolio (optional)
   - Filter by segment (optional)
   - Create button/modal
   - Delete confirmation
   - Bulk actions (optional for later)

4. **Detail.vue Page** (Most Complex)
   - Tabs: Overview, Transactions, Balance, Metadata, Hierarchy
   - Overview: All account details
   - Transactions: Recent transactions list (link to tx detail page)
   - Balance: Current balance, available balance, on-hold amount
   - Metadata: Formatted JSON
   - Hierarchy: Organization → Ledger → Portfolio → Account
   - Action buttons: Edit, Delete, Create Transaction

5. **Create.vue Page**
   - Account form wrapper
   - Pre-fill from URL params if needed

6. **Edit.vue Page**
   - Pre-filled account form
   - Disable ledger/asset selectors (immutable)
   - Update handling

7. **Delete Modal**
   - Warning about active transactions
   - Soft/hard delete option
   - Confirmation with account details

8. **AccountBalance Component** (Reusable)
   - Display: Available, On-Hold, Total
   - Formatted with currency
   - Color coding for negative balances
   - Refresh button to fetch latest

**API Endpoints**:
- `GET /accounts` - List accounts
- `POST /accounts` - Create account
- `GET /accounts/{id}` - Get account details
- `PUT /accounts/{id}` - Update account
- `DELETE /accounts/{id}` - Delete account
- `GET /accounts/{id}/balance` - Get account balance
- `GET /accounts/{id}/transactions` - Get transactions for account

---

## 🏗️ Implementation Order

**Session 2 Timeline** (Recommended 8-10 hour session):

### Hour 1-1.5: Ledgers Foundation
- [ ] Create `app/components/ledgers/` directory
- [ ] Implement `LedgerForm.vue`
- [ ] Implement `LedgersTable.vue`
- [ ] Create barrel export `index.ts`

### Hour 1.5-2.5: Ledgers Pages
- [ ] Refactor `app/pages/onboarding/ledgers/List.vue`
- [ ] Implement `Detail.vue` (tabs layout)
- [ ] Create `Create.vue` page wrapper
- [ ] Create `Edit.vue` page wrapper

### Hour 2.5-3: Ledgers Testing
- [ ] Test CRUD operations end-to-end
- [ ] Fix any issues
- [ ] Verify API integration

### Hour 3-4: Assets Foundation
- [ ] Create `app/components/assets/` directory
- [ ] Implement `AssetForm.vue`
- [ ] Implement `AssetsTable.vue`
- [ ] Create barrel export

### Hour 4-4.5: Assets Pages
- [ ] Refactor `app/pages/onboarding/assets/List.vue`
- [ ] Implement `Detail.vue`
- [ ] Create `Create.vue` and `Edit.vue` pages

### Hour 4.5-5: Assets Testing
- [ ] Verify CRUD
- [ ] Test integrations

### Hour 5-6: Accounts Foundation
- [ ] Create `app/components/accounts/` directory
- [ ] Implement `AccountForm.vue` (complex with multi-selectors)
- [ ] Implement `AccountsTable.vue`
- [ ] Create `AccountBalance.vue` component
- [ ] Create barrel export

### Hour 6-7.5: Accounts Pages
- [ ] Refactor `app/pages/onboarding/accounts/List.vue`
- [ ] Implement `Detail.vue` (multi-tab layout)
- [ ] Create `Create.vue` and `Edit.vue` pages

### Hour 7.5-8.5: Integration Testing
- [ ] Test cross-module navigation
- [ ] Test data relationships
- [ ] Verify filtering and sorting
- [ ] Test error handling

### Hour 8.5-9: Documentation
- [ ] Update PHASE2_IMPLEMENTATION_STATUS.md
- [ ] Create PHASE2_SESSION2_SUMMARY.md
- [ ] Update progress tracker

### Hour 9-10: Code Cleanup & Commit
- [ ] Code review and cleanup
- [ ] Commit changes with proper messages
- [ ] Push to repository

---

## 📋 Code Patterns to Follow

### 1. Form Component Pattern (from OrganizationForm)
```typescript
// Props
organization?: Organization | null
isLoading?: boolean
isEditing?: boolean

// Emits
- submit(payload: CreateDto | UpdateDto)
- cancel()

// Features
- Real-time validation
- localStorage draft save
- Metadata JSON editor
- Error display inline
- Responsive grid layout
- Accessibility labels
```

### 2. Table Component Pattern (from OrganizationsTable)
```typescript
// Props
items: T[]
loading: boolean
sortBy: string
sortDir: 'asc' | 'desc'
page: number
pageSize: number
total: number

// Emits
- sort(column, direction)
- paginate(page)
- view(item)
- edit(item)
- delete(item)
- pageSize(size)

// Features
- Sortable columns
- Pagination controls
- Row action dropdowns
- Copy to clipboard
- Loading skeleton states
```

### 3. Page Component Pattern (from List.vue)
```typescript
// Structure
- Search input
- Filter bar/controls
- Create button
- Table with pagination
- Create/Edit/Delete modals
- Toast notifications
- Loading states
- Error handling

// Typical flow:
1. onMounted: Load data
2. Search/filter: Update table
3. Actions: Show modals
4. Form submit: API call
5. Success: Toast + reload data
6. Error: Show error toast/modal
```

---

## 🔧 Technical Setup

### Store Pattern
- Use existing Pinia stores in `app/stores/`
- Follow naming: `{module}.ts` (e.g., `ledgers.ts`, `assets.ts`)
- Each store handles: list, detail, create, update, delete

### API Pattern
- Use existing API services in `app/services/`
- Each module gets its own service file
- Services handle: GET (list/detail), POST, PUT, DELETE
- Error handling with typed responses

### Component Import Pattern
```typescript
// Use barrel exports
import { OrganizationForm, OrganizationsTable } from '@/components/organizations'
// Not: import OrganizationForm from '@/components/organizations/OrganizationForm.vue'
```

### Routing Pattern
- Nested routes already configured
- Add new routes following existing pattern:
  ```typescript
  {
    path: 'ledgers',
    component: () => import('@/pages/onboarding/ledgers/List.vue'),
    children: [
      { path: ':id', component: () => import('@/pages/onboarding/ledgers/Detail.vue') }
    ]
  }
  ```

---

## ✅ Quality Checklist

### Before Committing Each Component
- [ ] No TypeScript errors (strict mode)
- [ ] Responsive design tested (mobile/tablet/desktop)
- [ ] Accessibility labels present (ARIA)
- [ ] Error states handled
- [ ] Loading states visible
- [ ] Toast notifications working
- [ ] Form validation functional
- [ ] Delete confirmation working
- [ ] API calls verified in network tab
- [ ] Comments added for complex logic

### Before Session End
- [ ] All code committed
- [ ] All docs updated
- [ ] No console errors
- [ ] No console warnings
- [ ] Build passes: `npm run build`
- [ ] No TypeScript errors
- [ ] README updated with new features
- [ ] Handoff notes prepared

---

## 📚 Reference Files

### To Review
- `app/components/organizations/OrganizationForm.vue` - Form pattern
- `app/components/organizations/OrganizationsTable.vue` - Table pattern
- `app/pages/onboarding/organizations/List.vue` - Page pattern
- `app/stores/organizations.ts` - State management
- `app/services/organizations.ts` - API integration

### To Use as Base
- `app/components/common/Modal.vue` - Modal component
- `app/components/common/Input.vue` - Input component
- `app/components/common/Select.vue` - Select component (if exists)
- `app/components/layout/Layout.vue` - Layout wrapper

---

## 🎯 Success Criteria

Session 2 is complete when:
1. ✅ 21 components implemented (7 Ledgers + 6 Assets + 8 Accounts)
2. ✅ All CRUD operations working end-to-end
3. ✅ 40% overall progress (22/55 components)
4. ✅ Code committed with clear messages
5. ✅ Documentation updated
6. ✅ No TypeScript errors
7. ✅ Build passes without warnings
8. ✅ All tests pass (if any exist)

---

## 🚨 Risk Mitigation

**Potential Issues & Solutions**:
1. **Multi-select complexity** → Start with single select, add multi later
2. **Cascading filters** → Pre-filter options client-side for performance
3. **API delays** → Use loading states and skeleton screens
4. **Validation complexity** → Use composables to share validation logic
5. **State sync issues** → Clear cache after mutations

---

## 📝 Documentation Requirements

**Generate/Update**:
1. `PHASE2_SESSION2_SUMMARY.md` - Session achievements
2. `PHASE2_IMPLEMENTATION_STATUS.md` - Update progress to 40%
3. `PHASE2_PROGRESS_TRACKER.md` - Check off completed items
4. `MASTER_CHECKLIST.md` - Update all completed tasks

**Keep for Reference**:
- This kickoff document (PHASE2_SESSION2_KICKOFF.md)
- Component breakdown from Session 1
- API integration patterns

---

## 🚀 Ready to Start!

Everything is prepared. Let's implement Phase 2 Session 2!

**Next Steps**:
1. Review this document
2. Start with Ledgers module
3. Follow the hourly timeline
4. Commit after each major component
5. Update progress tracker regularly
6. Use established patterns consistently

---

**Session 2 Goal**: Move from 15% → 40% completion (8 → 29 components)

**Let's build! 🎉**
