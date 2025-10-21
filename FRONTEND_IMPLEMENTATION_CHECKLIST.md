# Frontend Implementation Checklist

## ✅ Completed Tasks

### API Services
- [x] **Ledgers Service** - Updated to use `/v1/organizations/{orgId}/ledgers`
- [x] **Assets Service** - Updated to use `/v1/organizations/{orgId}/ledgers/{ledgerId}/assets`
- [x] **Accounts Service** - Updated to use `/v1/organizations/{orgId}/ledgers/{ledgerId}/accounts`

### List Pages with Dependency Selectors
- [x] **Ledgers List** - Added Organization selector with search
- [x] **Assets List** - Added Organization + Ledger selectors with search
- [x] **Accounts List** - Added Organization + Ledger selectors with search

### Form Payload Fixes
- [x] **LedgerForm** - Fixed status structure `{ code: "ACTIVE" }`
- [x] **AssetForm** - Fixed status structure `{ code: "ACTIVE" }`
- [x] **AccountForm** - Fixed status structure and field names

### Documentation
- [x] **FRONTEND_API_FIXES.md** - Detailed implementation guide
- [x] **FRONTEND_FIXES_SUMMARY.md** - Quick reference summary
- [x] **FRONTEND_API_FLOW_DIAGRAM.md** - Visual diagrams and flows

---

## 🔄 In Progress / Next Steps

### High Priority - API Services

- [ ] **Portfolios Service** (`app/api/services/portfolios.ts`)
  - [ ] Update `list()` to accept `organizationId, ledgerId`
  - [ ] Update `create()` to accept `organizationId, ledgerId`
  - [ ] Update `getById()` to accept `organizationId, ledgerId, id`
  - [ ] Update `update()` to accept `organizationId, ledgerId, id`
  - [ ] Update `delete()` to accept `organizationId, ledgerId, id`
  - [ ] Add `getCount()` method

- [ ] **Segments Service** (`app/api/services/segments.ts`)
  - [ ] Update `list()` to accept `organizationId, ledgerId`
  - [ ] Update `create()` to accept `organizationId, ledgerId`
  - [ ] Update `getById()` to accept `organizationId, ledgerId, id`
  - [ ] Update `update()` to accept `organizationId, ledgerId, id`
  - [ ] Update `delete()` to accept `organizationId, ledgerId, id`
  - [ ] Add `getCount()` method

- [ ] **Transactions Service** (`app/api/services/transactions.ts`)
  - [ ] Update `list()` to accept `organizationId, ledgerId`
  - [ ] Update `create()` to accept `organizationId, ledgerId`
  - [ ] Update `getById()` to accept `organizationId, ledgerId, id`
  - [ ] Update `update()` to accept `organizationId, ledgerId, id`
  - [ ] Add transaction type methods (inflow, outflow)

- [ ] **Operations Service** (`app/api/services/operations.ts`)
  - [ ] Update `list()` to accept `organizationId, ledgerId, accountId`
  - [ ] Update `getById()` to accept `organizationId, ledgerId, accountId, operationId`
  - [ ] Update `update()` to accept path parameters

- [ ] **Balances Service** (`app/api/services/balances.ts`)
  - [ ] Update `list()` to accept `organizationId, ledgerId`
  - [ ] Update `getById()` to accept `organizationId, ledgerId, balanceId`
  - [ ] Update `listByAccount()` to accept `organizationId, ledgerId, accountId`
  - [ ] Update `listByAlias()` to accept `organizationId, ledgerId, alias`
  - [ ] Update `update()` and `delete()` methods

### High Priority - List Pages

- [ ] **Portfolios List** (`app/pages/onboarding/portfolios/List.vue`)
  - [ ] Add Organization selector with search
  - [ ] Add Ledger selector with search
  - [ ] Add watchers for cascading dependencies
  - [ ] Update `loadPortfolios()` to pass required IDs
  - [ ] Add conditional rendering based on selections

- [ ] **Segments List** (`app/pages/onboarding/segments/List.vue`)
  - [ ] Add Organization selector with search
  - [ ] Add Ledger selector with search
  - [ ] Add watchers for cascading dependencies
  - [ ] Update `loadSegments()` to pass required IDs
  - [ ] Add conditional rendering based on selections

- [ ] **Transactions List** (`app/pages/transactions/List.vue`)
  - [ ] Add Organization selector with search
  - [ ] Add Ledger selector with search
  - [ ] Add watchers for cascading dependencies
  - [ ] Update `loadTransactions()` to pass required IDs
  - [ ] Add conditional rendering based on selections

- [ ] **Operations List** (`app/pages/operations/routes/List.vue`)
  - [ ] Add Organization selector with search
  - [ ] Add Ledger selector with search
  - [ ] Add Account selector with search
  - [ ] Add watchers for cascading dependencies
  - [ ] Update `loadOperations()` to pass required IDs

- [ ] **Balances List** (`app/pages/balances/List.vue`)
  - [ ] Add Organization selector with search
  - [ ] Add Ledger selector with search
  - [ ] Add optional Account selector
  - [ ] Add watchers for cascading dependencies
  - [ ] Update `loadBalances()` to pass required IDs

### High Priority - Create Pages

- [ ] **Ledgers Create** (`app/pages/onboarding/ledgers/Create.vue`)
  - [ ] Add Organization selector
  - [ ] Pass `organizationId` to create service
  - [ ] Update form submission handler

- [ ] **Assets Create** (`app/pages/onboarding/assets/Create.vue`)
  - [ ] Add Organization selector
  - [ ] Add Ledger selector (dependent on org)
  - [ ] Pass both IDs to create service
  - [ ] Update form submission handler

- [ ] **Accounts Create** (`app/pages/onboarding/accounts/Create.vue`)
  - [ ] Add Organization selector
  - [ ] Add Ledger selector (dependent on org)
  - [ ] Pass both IDs to create service
  - [ ] Update form submission handler

- [ ] **Portfolios Create** (`app/pages/onboarding/portfolios/Create.vue`)
  - [ ] Add Organization selector
  - [ ] Add Ledger selector
  - [ ] Pass both IDs to create service

- [ ] **Segments Create** (`app/pages/onboarding/segments/Create.vue`)
  - [ ] Add Organization selector
  - [ ] Add Ledger selector
  - [ ] Pass both IDs to create service

- [ ] **Transactions Create** (`app/pages/transactions/Create.vue`)
  - [ ] Add Organization selector
  - [ ] Add Ledger selector
  - [ ] Pass both IDs to create service
  - [ ] Fix payload structure

### High Priority - Detail Pages

- [ ] **Ledgers Detail** (`app/pages/onboarding/ledgers/Detail.vue`)
  - [ ] Extract `organizationId` from route or context
  - [ ] Pass to `getById()` service call

- [ ] **Assets Detail** (`app/pages/onboarding/assets/Detail.vue`)
  - [ ] Extract `organizationId` and `ledgerId`
  - [ ] Pass to `getById()` service call

- [ ] **Accounts Detail** (`app/pages/onboarding/accounts/Detail.vue`)
  - [ ] Extract `organizationId` and `ledgerId`
  - [ ] Pass to `getById()` service call

- [ ] **Portfolios Detail** (`app/pages/onboarding/portfolios/Detail.vue`)
  - [ ] Extract required IDs
  - [ ] Pass to `getById()` service call

- [ ] **Segments Detail** (`app/pages/onboarding/segments/Detail.vue`)
  - [ ] Extract required IDs
  - [ ] Pass to `getById()` service call

- [ ] **Transactions Detail** (`app/pages/transactions/Detail.vue`)
  - [ ] Extract required IDs
  - [ ] Pass to `getById()` service call

### High Priority - Forms

- [ ] **PortfolioForm** (`app/components/portfolios/PortfolioForm.vue`)
  - [ ] Fix status structure `{ code: "ACTIVE" }`
  - [ ] Verify all required fields match API

- [ ] **SegmentForm** (`app/components/segments/SegmentForm.vue`)
  - [ ] Fix status structure `{ code: "ACTIVE" }`
  - [ ] Verify all required fields match API

- [ ] **TransactionForm** (`app/components/transactions/TransactionForm.vue`)
  - [ ] Verify payload structure matches API
  - [ ] Add Organization and Ledger context

---

## 🔧 Medium Priority - Stores

- [ ] **Ledgers Store** (`app/stores/ledgers.ts`)
  - [ ] Update `fetch()` action to accept `{ organizationId, ...params }`
  - [ ] Update `create()` action to accept `organizationId`
  - [ ] Update `update()` action to accept `organizationId`
  - [ ] Update `delete()` action to accept `organizationId`

- [ ] **Assets Store** (`app/stores/assets.ts`)
  - [ ] Update `fetch()` action to accept `{ organizationId, ledgerId, ...params }`
  - [ ] Update `create()` action to accept `organizationId, ledgerId`
  - [ ] Update `update()` action to accept `organizationId, ledgerId`
  - [ ] Update `delete()` action to accept `organizationId, ledgerId`

- [ ] **Accounts Store** (`app/stores/accounts.ts`)
  - [ ] Update `fetch()` action to accept `{ organizationId, ledgerId, ...params }`
  - [ ] Update `create()` action to accept `organizationId, ledgerId`
  - [ ] Update `update()` action to accept `organizationId, ledgerId`
  - [ ] Update `delete()` action to accept `organizationId, ledgerId`

- [ ] **Portfolios Store** (`app/stores/portfolios.ts`)
  - [ ] Update all actions to accept required path parameters

- [ ] **Segments Store** (`app/stores/segments.ts`)
  - [ ] Update all actions to accept required path parameters

- [ ] **Transactions Store** (`app/stores/transactions.ts`)
  - [ ] Update all actions to accept required path parameters

- [ ] **Operations Store** (`app/stores/operations.ts`)
  - [ ] Update all actions to accept required path parameters

- [ ] **Balances Store** (`app/stores/balances.ts`)
  - [ ] Update all actions to accept required path parameters

---

## 📊 Medium Priority - UX Improvements

- [ ] **Loading States**
  - [ ] Show spinner when loading organizations
  - [ ] Show spinner when loading ledgers (after org selection)
  - [ ] Show spinner when loading main data
  - [ ] Disable buttons during loading

- [ ] **Error Handling**
  - [ ] Better error messages for 404 (resource not found)
  - [ ] Better error messages for 400 (validation errors)
  - [ ] Better error messages for 403 (permission denied)
  - [ ] Retry mechanism for failed requests

- [ ] **Validation**
  - [ ] Validate organization selected before allowing ledger selection
  - [ ] Validate both selected before allowing data operations
  - [ ] Show inline validation errors
  - [ ] Prevent form submission with missing dependencies

- [ ] **User Feedback**
  - [ ] Success toasts for all operations
  - [ ] Error toasts with actionable messages
  - [ ] Confirmation dialogs for destructive actions
  - [ ] Progress indicators for long operations

---

## 🎨 Low Priority - Polish

- [ ] **Persistence**
  - [ ] Save selected organization to localStorage
  - [ ] Save selected ledger to localStorage
  - [ ] Restore selections on page reload
  - [ ] Clear selections on logout

- [ ] **Breadcrumbs**
  - [ ] Show selected organization in breadcrumb
  - [ ] Show selected ledger in breadcrumb
  - [ ] Make breadcrumb items clickable
  - [ ] Update breadcrumb on selection change

- [ ] **Performance**
  - [ ] Cache organization list
  - [ ] Cache ledger lists per organization
  - [ ] Implement virtual scrolling for large lists
  - [ ] Debounce search inputs

- [ ] **Accessibility**
  - [ ] Add ARIA labels to selectors
  - [ ] Keyboard navigation for dropdowns
  - [ ] Screen reader announcements
  - [ ] Focus management

- [ ] **Mobile Responsiveness**
  - [ ] Stack selectors vertically on mobile
  - [ ] Optimize search input for mobile
  - [ ] Touch-friendly dropdown sizes
  - [ ] Responsive table layouts

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] Test API services with correct path parameters
- [ ] Test form payload generation
- [ ] Test search filtering logic
- [ ] Test cascading dependency watchers

### Integration Tests
- [ ] Test organization selection → ledger loading
- [ ] Test ledger selection → data loading
- [ ] Test create flow with dependencies
- [ ] Test update flow with dependencies
- [ ] Test delete flow with dependencies

### E2E Tests
- [ ] Test complete user flow: org → ledger → list → create
- [ ] Test search functionality
- [ ] Test error scenarios
- [ ] Test navigation between pages

### Manual Testing
- [ ] Test all list pages with real data
- [ ] Test all create pages with real data
- [ ] Test all detail pages with real data
- [ ] Test all edit flows
- [ ] Test all delete flows

---

## 📝 Documentation Tasks

- [ ] Update API documentation with path parameters
- [ ] Update component documentation
- [ ] Create migration guide for other developers
- [ ] Add JSDoc comments to services
- [ ] Add inline code comments for complex logic

---

## 🚀 Deployment Checklist

- [ ] Run all tests
- [ ] Fix any linting errors
- [ ] Update environment variables if needed
- [ ] Test in staging environment
- [ ] Verify API endpoints are correct
- [ ] Check error logging
- [ ] Monitor for errors after deployment

---

## Progress Tracking

**Completed**: 9 tasks
**In Progress**: 0 tasks
**Remaining**: ~80 tasks

**Estimated Time**: 
- High Priority: 2-3 days
- Medium Priority: 2-3 days
- Low Priority: 1-2 days
- Testing: 1-2 days

**Total**: ~1-2 weeks for complete implementation

---

## Notes

- Focus on High Priority tasks first
- Test each component after updating
- Follow the pattern established in Ledgers/Assets/Accounts
- Keep documentation updated as you go
- Ask for help if stuck on any task

---

## Quick Reference

**Pattern for List Pages**:
1. Add org/ledger selectors with search
2. Add watchers for cascading dependencies
3. Update load function to check dependencies
4. Pass IDs to store fetch method
5. Add conditional rendering

**Pattern for Create Pages**:
1. Add org/ledger selectors
2. Pass IDs to form submission
3. Update service call with IDs

**Pattern for Services**:
1. Add path parameters to function signature
2. Update URL to include parameters
3. Return correct response structure

**Pattern for Forms**:
1. Wrap status in object: `{ code: "ACTIVE" }`
2. Verify field names match API
3. Include all required fields
