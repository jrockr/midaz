# PHASE 2: Onboarding Module - Organizations & Ledgers (Detailed Implementation)

**Objective**: Build complete CRUDL (Create, Read, Update, Delete, List) pages for Organizations and Ledgers with modern fintech UI

**Duration**: 2-3 weeks  
**Start Date**: October 21, 2025  
**End Date**: November 4, 2025 (estimated)  
**Total Components**: 16  
**Total Tasks**: 60+

---

## 📋 Component Breakdown & Task Checklist

### SECTION 1: ORGANIZATIONS MODULE (9 Components, 30 Tasks)

#### 1.1 Organizations List Page (Primary Entry Point)
**Component**: `pages/onboarding/organizations/List.vue`  
**Purpose**: Display all organizations with search, filter, and pagination

**Tasks**:
- [ ] Create page layout with header (title, description, action button)
- [ ] Integrate OrganizationsList component
- [ ] Add breadcrumb navigation (Home > Onboarding > Organizations)
- [ ] Add export/import functionality
- [ ] Connect to organizationsStore for data fetching
- [ ] Add loading skeleton while fetching
- [ ] Implement error state handling
- [ ] Add refresh button with loading indicator
- [ ] Create responsive layout for mobile
- [ ] Add meta tags for SEO

**Status**: ⏳ Not Started  
**Estimated Time**: 4 hours  

---

#### 1.2 Organizations Table Component
**Component**: `components/organizations/OrganizationsTable.vue`  
**Purpose**: Display organizations in sortable, paginated table

**Features**:
- Columns: Name, Email, Legal Name, Created Date, Status, Actions
- Sorting by all columns
- Pagination (10, 25, 50 items per page)
- Row selection (checkbox)
- Bulk actions (export, delete)
- Status badge (active, inactive)

**Tasks**:
- [ ] Create table structure with Tailwind responsive design
- [ ] Implement column header with sort indicators
- [ ] Add sorting logic with store integration
- [ ] Implement pagination controls
- [ ] Add row actions dropdown (View, Edit, Delete, Copy ID)
- [ ] Add checkbox selection with select-all functionality
- [ ] Add bulk action toolbar
- [ ] Format dates and values properly
- [ ] Add loading state (skeleton rows)
- [ ] Add empty state when no organizations

**Status**: ⏳ Not Started  
**Estimated Time**: 5 hours

---

#### 1.3 Organizations List Component
**Component**: `components/organizations/OrganizationsList.vue`  
**Purpose**: Wrapper for list with search, filter, and table

**Features**:
- Search input (debounced)
- Filter options (status, creation date range)
- Sort dropdown
- Results counter
- List/Grid view toggle (optional)

**Tasks**:
- [ ] Create search input with debounce (300ms)
- [ ] Implement filter panel (status, date range)
- [ ] Add filter chips to show active filters
- [ ] Create clear filters button
- [ ] Add save/load filter presets
- [ ] Implement list/grid toggle view (UI only)
- [ ] Add results counter (X organizations found)
- [ ] Create advanced filter modal
- [ ] Add keyboard shortcuts help
- [ ] Responsive mobile layout

**Status**: ⏳ Not Started  
**Estimated Time**: 6 hours

---

#### 1.4 Create Organization Page
**Component**: `pages/onboarding/organizations/Create.vue`  
**Purpose**: Page for creating new organization

**Tasks**:
- [ ] Create page layout with form
- [ ] Add breadcrumb (Home > Onboarding > Organizations > Create)
- [ ] Integrate OrganizationForm component
- [ ] Add form validation
- [ ] Connect to organizationsStore.createOrganization
- [ ] Add loading state during submission
- [ ] Show success toast on creation
- [ ] Navigate to detail page after creation
- [ ] Add cancel button with navigation
- [ ] Add form data persistence to localStorage

**Status**: ⏳ Not Started  
**Estimated Time**: 3 hours

---

#### 1.5 Organization Form Component
**Component**: `components/organizations/OrganizationForm.vue`  
**Purpose**: Reusable form for creating/editing organizations

**Form Fields**:
- Organization Name (required, text)
- Email (required, email)
- Legal Name (optional, text)
- Parent Organization (optional, dropdown/search)
- Phone (optional, phone)
- Website (optional, URL)
- Industry (optional, select)
- Registration Number (optional, text)
- Metadata (optional, JSON editor)

**Tasks**:
- [ ] Create form layout with Tailwind (2-column grid)
- [ ] Add Input component for text fields
- [ ] Add email validation
- [ ] Add AsyncSelect for parent organization
- [ ] Add phone number input with formatting
- [ ] Add URL validation
- [ ] Add industry select dropdown
- [ ] Create metadata editor component (mini JSON editor)
- [ ] Implement form validation with error display
- [ ] Add form auto-save to localStorage
- [ ] Show field validation errors inline
- [ ] Add required field indicator (*)
- [ ] Create form submission loading state
- [ ] Add reset/clear form button

**Status**: ⏳ Not Started  
**Estimated Time**: 6 hours

---

#### 1.6 Edit Organization Page
**Component**: `pages/onboarding/organizations/Edit.vue`  
**Purpose**: Page for editing existing organization

**Tasks**:
- [ ] Create page layout matching Create page structure
- [ ] Fetch organization data from route params (ID)
- [ ] Pre-fill OrganizationForm with existing data
- [ ] Add breadcrumb (Home > Onboarding > Organizations > {Name} > Edit)
- [ ] Connect to organizationsStore.updateOrganization
- [ ] Show loading state during data fetch
- [ ] Show loading state during submission
- [ ] Add change detection (warn if unsaved changes)
- [ ] Show success toast on update
- [ ] Navigate back to detail page after update
- [ ] Add delete button (with confirmation modal)

**Status**: ⏳ Not Started  
**Estimated Time**: 4 hours

---

#### 1.7 Organization Detail Page
**Component**: `pages/onboarding/organizations/Detail.vue`  
**Purpose**: View organization details with tabbed interface

**Tabs**:
1. Overview (Basic info, metadata, statistics)
2. Metadata (Full metadata in viewer)
3. Ledgers (Associated ledgers list)
4. Activity (Recent changes/audit log)

**Tasks**:
- [ ] Create page layout with tabs
- [ ] Fetch organization data from route params
- [ ] Add breadcrumb navigation
- [ ] Create Overview tab with info cards
- [ ] Show metadata in Metadata tab (read-only JSON viewer)
- [ ] Show associated ledgers in Ledgers tab
- [ ] Show activity/timeline in Activity tab
- [ ] Add action buttons (Edit, Delete, Export)
- [ ] Add loading state for each tab
- [ ] Add error state
- [ ] Copy-to-clipboard for IDs
- [ ] Add refresh button

**Status**: ⏳ Not Started  
**Estimated Time**: 5 hours

---

#### 1.8 Organization Info Card Component
**Component**: `components/organizations/OrganizationInfo.vue`  
**Purpose**: Display key organization information (for reuse in detail/overview)

**Fields Displayed**:
- Organization ID (copiable)
- Name
- Email
- Legal Name
- Created Date
- Updated Date
- Status
- Parent Organization (if exists)

**Tasks**:
- [ ] Create card layout with Tailwind
- [ ] Display organization data passed as prop
- [ ] Add copy-to-clipboard buttons for IDs
- [ ] Format dates using utility formatter
- [ ] Add loading skeleton state
- [ ] Responsive layout for mobile
- [ ] Add edit button link
- [ ] Style status badge
- [ ] Handle null/undefined values gracefully

**Status**: ⏳ Not Started  
**Estimated Time**: 2 hours

---

#### 1.9 Organization Metadata Viewer/Editor
**Component**: `components/organizations/OrganizationMetadata.vue`  
**Purpose**: Display and edit organization metadata (JSON)

**Features**:
- JSON syntax highlighting (read-only in detail, editable in edit page)
- Expandable/collapsible JSON tree
- Copy JSON button
- Download JSON button
- Validate JSON format

**Tasks**:
- [ ] Create read-only JSON viewer with syntax highlighting
- [ ] Add copy JSON to clipboard
- [ ] Add download JSON as file
- [ ] Add expand/collapse all buttons
- [ ] Create editable version for edit pages
- [ ] Add JSON validation
- [ ] Show validation errors
- [ ] Add format/beautify button
- [ ] Handle large JSON gracefully

**Status**: ⏳ Not Started  
**Estimated Time**: 3 hours

---

### SECTION 2: LEDGERS MODULE (7 Components, 28 Tasks)

#### 2.1 Ledgers List Page
**Component**: `pages/onboarding/ledgers/List.vue`  
**Purpose**: Display all ledgers with organization context

**Tasks**:
- [ ] Create page layout with header
- [ ] Add organization filter/context indicator
- [ ] Integrate LedgersList component
- [ ] Add breadcrumb (Home > Onboarding > Ledgers)
- [ ] Connect to ledgersStore for data fetching
- [ ] Add loading and error states
- [ ] Implement data refresh functionality
- [ ] Add responsive layout
- [ ] Add meta tags for SEO

**Status**: ⏳ Not Started  
**Estimated Time**: 3 hours

---

#### 2.2 Ledgers Table Component
**Component**: `components/ledgers/LedgersTable.vue`  
**Purpose**: Display ledgers in table with organization info

**Columns**: Organization, Ledger Name, Code, Accounts Count, Assets, Status, Created Date, Actions

**Tasks**:
- [ ] Create table structure
- [ ] Implement sorting for all columns
- [ ] Add pagination
- [ ] Add row actions (View, Edit, Delete, Copy ID)
- [ ] Display account count badge
- [ ] Show status badge
- [ ] Format dates properly
- [ ] Add loading state
- [ ] Add empty state
- [ ] Show organization name with link

**Status**: ⏳ Not Started  
**Estimated Time**: 4 hours

---

#### 2.3 Ledgers List Component
**Component**: `components/ledgers/LedgersList.vue`  
**Purpose**: Wrapper with search, filter, and controls

**Features**:
- Organization filter
- Status filter
- Search by name/code
- Results counter
- Sort options

**Tasks**:
- [ ] Create search input
- [ ] Add organization selector (dropdown/async-select)
- [ ] Add status filter
- [ ] Implement date range filter
- [ ] Add filter chips display
- [ ] Create clear filters button
- [ ] Add results counter
- [ ] Responsive mobile layout

**Status**: ⏳ Not Started  
**Estimated Time**: 5 hours

---

#### 2.4 Create Ledger Page
**Component**: `pages/onboarding/ledgers/Create.vue`  
**Purpose**: Page for creating new ledger

**Tasks**:
- [ ] Create page layout with form
- [ ] Add breadcrumb navigation
- [ ] Integrate LedgerForm component
- [ ] Connect to ledgersStore.createLedger
- [ ] Show loading state during submission
- [ ] Show success toast
- [ ] Navigate to detail page after creation
- [ ] Add cancel button
- [ ] Add form data persistence

**Status**: ⏳ Not Started  
**Estimated Time**: 3 hours

---

#### 2.5 Ledger Form Component
**Component**: `components/ledgers/LedgerForm.vue`  
**Purpose**: Reusable form for creating/editing ledgers

**Form Fields**:
- Organization (required, dropdown/search)
- Ledger Name (required, text)
- Ledger Code (required, text - auto-generated or manual)
- Description (optional, textarea)
- Metadata (optional, JSON editor)

**Tasks**:
- [ ] Create form layout
- [ ] Add organization AsyncSelect
- [ ] Add name input field
- [ ] Add code input with auto-generation
- [ ] Add description textarea
- [ ] Add metadata JSON editor
- [ ] Implement form validation
- [ ] Show validation errors
- [ ] Add form auto-save
- [ ] Create submission loading state
- [ ] Add reset button

**Status**: ⏳ Not Started  
**Estimated Time**: 5 hours

---

#### 2.6 Edit Ledger Page
**Component**: `pages/onboarding/ledgers/Edit.vue`  
**Purpose**: Page for editing existing ledger

**Tasks**:
- [ ] Create page layout matching Create page
- [ ] Fetch ledger data from route params
- [ ] Pre-fill LedgerForm with existing data
- [ ] Add breadcrumb navigation
- [ ] Connect to ledgersStore.updateLedger
- [ ] Add loading state for data fetch
- [ ] Show loading state during submission
- [ ] Add unsaved changes warning
- [ ] Show success toast
- [ ] Navigate back to detail page
- [ ] Add delete button with confirmation

**Status**: ⏳ Not Started  
**Estimated Time**: 4 hours

---

#### 2.7 Ledger Detail Page
**Component**: `pages/onboarding/ledgers/Detail.vue`  
**Purpose**: View ledger details with tabbed interface

**Tabs**:
1. Overview (Basic info, metrics)
2. Metadata (Full metadata)
3. Assets (Associated assets table)
4. Accounts (Accounts summary)
5. Portfolios (Portfolios summary)
6. Segments (Segments summary)
7. Activity (Audit log)

**Tasks**:
- [ ] Create page layout with tabs
- [ ] Fetch ledger data from route params
- [ ] Add breadcrumb navigation
- [ ] Create Overview tab with key metrics
- [ ] Show metadata in Metadata tab
- [ ] Create Assets tab with embedded table
- [ ] Show Accounts summary in Accounts tab
- [ ] Show Portfolios summary in Portfolios tab
- [ ] Show Segments summary in Segments tab
- [ ] Show activity timeline in Activity tab
- [ ] Add action buttons (Edit, Delete, Export)
- [ ] Add loading states for each tab
- [ ] Add error handling
- [ ] Copy-to-clipboard for IDs

**Status**: ⏳ Not Started  
**Estimated Time**: 6 hours

---

### SECTION 3: SHARED COMPONENTS & UTILITIES (6 Components, 2 Tasks)

#### 3.1 Organization & Ledger Selector Components
**Component**: `components/common/OrganizationSelect.vue` & `components/common/LedgerSelect.vue`  
**Purpose**: Reusable dropdown selectors used across the app

**Tasks**:
- [ ] Create AsyncSelect wrapper for organizations
- [ ] Create AsyncSelect wrapper for ledgers
- [ ] Add search functionality
- [ ] Add loading state
- [ ] Add error handling
- [ ] Add empty state message

**Status**: ⏳ Not Started  
**Estimated Time**: 2 hours

---

## 🎯 Implementation Sequence (Recommended Order)

### Week 1: Foundation Components (Days 1-3)
1. ✅ OrganizationForm component (with metadata editor)
2. ✅ LedgerForm component
3. ✅ OrganizationsTable component
4. ✅ LedgersTable component

### Week 1-2: List & Filter Components (Days 4-7)
5. ✅ OrganizationsList component
6. ✅ LedgersList component
7. ✅ List pages (Organizations, Ledgers)

### Week 2: Detail Pages & Advanced Features (Days 8-14)
8. ✅ OrganizationDetail page
9. ✅ LedgerDetail page
10. ✅ OrganizationInfo & Metadata components
11. ✅ Create/Edit pages
12. ✅ Selectors (OrganizationSelect, LedgerSelect)

---

## 🔗 Dependencies Between Tasks

```
OrganizationForm
    ├─→ Metadata Editor Component
    └─→ Input/Select Components (Phase 1)

LedgerForm
    ├─→ OrganizationSelect
    └─→ Input Components (Phase 1)

OrganizationsList
    ├─→ OrganizationsTable
    ├─→ Search/Filter Input (Phase 1)
    └─→ Organizations Store

LedgersList
    ├─→ LedgersTable
    ├─→ OrganizationSelect
    └─→ Ledgers Store

List Pages
    └─→ Respective List Components

Detail Pages
    ├─→ Info/Metadata Components
    ├─→ Create Form Components
    └─→ Store Data Fetching

Create/Edit Pages
    └─→ Form Components
```

---

## 📱 Responsive Design Requirements

### Mobile (< 768px)
- Single column forms
- Stacked table columns or card view
- Bottom sheet modals instead of center modals
- Touch-friendly button sizes (min 48px)
- Simplified navigation breadcrumbs

### Tablet (768px - 1024px)
- Two column forms
- Visible table with horizontal scroll
- Standard modals
- Side drawer navigation

### Desktop (> 1024px)
- Full multi-column forms
- Full table display
- All features visible
- Full navigation breadcrumbs

---

## 🧪 Testing Checklist (Per Component)

- [ ] Component renders without errors
- [ ] All props accepted and used correctly
- [ ] Form validation works (show/hide errors)
- [ ] Loading states display correctly
- [ ] Error states handled gracefully
- [ ] Responsive layout on mobile/tablet/desktop
- [ ] API calls made with correct parameters
- [ ] Store state updates correctly
- [ ] Navigation works (links, buttons)
- [ ] Keyboard navigation works
- [ ] Accessibility (ARIA labels, screen reader support)

---

## 📊 Fintech UI Best Practices Implemented

✅ **Modern Card-based Layout**: Information organized in clear, distinct cards  
✅ **Status Badges**: Color-coded status indicators (active=green, inactive=gray)  
✅ **Action Menus**: Dropdown menus for row/card actions  
✅ **Progressive Disclosure**: Advanced filters/options hidden until needed  
✅ **Clear Typography Hierarchy**: H1 for page titles, H2 for sections  
✅ **Consistent Spacing**: 4px unit system throughout  
✅ **Responsive Tables**: Stack columns on mobile, horizontal scroll on tablet  
✅ **Loading States**: Skeleton screens for data, spinners for actions  
✅ **Empty States**: Clear messaging when no data exists  
✅ **Error Handling**: User-friendly error messages with recovery options  
✅ **Breadcrumb Navigation**: Clear location in hierarchy  
✅ **Keyboard Shortcuts**: Accessible navigation and actions  
✅ **Copy-to-Clipboard**: Easy ID/reference copying  
✅ **Audit Trail**: Timestamp and change tracking  

---

## 📝 Code Standards & Conventions

### Naming Conventions
- **Components**: PascalCase (OrganizationForm.vue)
- **Pages**: PascalCase (OrganizationDetail.vue)
- **Stores**: camelCase (organizationsStore.ts)
- **Routes**: kebab-case (/organizations/create)
- **Classes**: camelCase (.organizations-list-header)

### File Organization
```
components/organizations/
├── OrganizationForm.vue
├── OrganizationsTable.vue
├── OrganizationsList.vue
├── OrganizationInfo.vue
└── OrganizationMetadata.vue

pages/onboarding/organizations/
├── List.vue
├── Create.vue
├── Edit.vue
└── Detail.vue

stores/
└── organizationsStore.ts
```

### TypeScript Conventions
- Strict mode enabled
- Full type annotations
- No 'any' types
- Extract types to types/ directory
- Use Zod for API response validation

### Component Structure
```vue
<template>
  <!-- Template first -->
</template>

<script setup lang="ts">
// Imports
// Props
// Emits
// Reactive state
// Computed properties
// Lifecycle hooks
// Methods
</script>

<style scoped>
/* Component styles */
</style>
```

---

## 🚀 Success Criteria for Phase 2

- [ ] All 16 components built and tested
- [ ] All CRUDL operations working end-to-end
- [ ] Mobile responsive design implemented
- [ ] API integration complete
- [ ] Store state management working
- [ ] Error handling implemented
- [ ] Loading states working
- [ ] Documentation updated
- [ ] Code follows standards
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Performance acceptable (< 2s page load)

---

## 📖 Related Documentation

- [ADMIN_APP_COMPONENTS_BREAKDOWN.md](./ADMIN_APP_COMPONENTS_BREAKDOWN.md) - Component specifications
- [ADMIN_APP_IMPLEMENTATION_GUIDE.md](./ADMIN_APP_IMPLEMENTATION_GUIDE.md) - General implementation guidelines
- [ADMIN_APP_ARCHITECTURE.md](./ADMIN_APP_ARCHITECTURE.md) - Architecture overview
- [PHASE2_SUMMARY.md](./PHASE2_SUMMARY.md) - Phase 2 progress tracker

---

**Last Updated**: October 21, 2025  
**Next Update**: After Phase 2 Day 7  
**Status**: Ready for implementation
