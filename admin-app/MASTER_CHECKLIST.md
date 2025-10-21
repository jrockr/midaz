# Midaz Admin App - Master Checklist & Tracking

**Purpose**: Central source of truth for implementation status  
**Format**: Markdown with checkboxes for tracking  
**Update Frequency**: Daily  
**Last Updated**: 2025-10-21  

---

## 🎯 High-Level Phases

- [ ] **Phase 1**: Foundation & Infrastructure (Week 1)
- [ ] **Phase 2**: Onboarding Module - Core (Weeks 2-3)
- [ ] **Phase 3**: Onboarding Module - Advanced (Weeks 4-5)
- [ ] **Phase 4**: Transactions - Creation (Weeks 6-7)
- [ ] **Phase 5**: Transactions - Details & Ops (Weeks 8-9)
- [ ] **Phase 6**: Balances & Asset Rates (Weeks 10-11)
- [ ] **Phase 7**: Testing & Optimization (Week 12)

---

## 📋 PHASE 1: Foundation & Infrastructure (WEEK 1)

### Project Initialization

- [ ] Create Vue 3 + Vite project
- [ ] Configure TypeScript
- [ ] Setup Tailwind CSS + PostCSS
- [ ] Configure ESLint + Prettier
- [ ] Setup Git hooks (Husky)
- [ ] Create .env files (.env.example, .env.development, .env.production)
- [ ] Initialize Git repository
- [ ] Create README.md with setup instructions

**Assigned To**: [Dev Lead]  
**Target**: Day 1-2  
**Status**: ⏳ NOT STARTED

---

### Base UI Components (25 Components)

#### Forms & Inputs
- [ ] Button component (5 variants, sizes, states, icons)
- [ ] Input component (multiple types, validation, icons)
- [ ] Select component (single/multi, async loading, search)
- [ ] Textarea component (counter, resize, validation)
- [ ] Checkbox component (single, indeterminate, groups)
- [ ] Radio component (groups, vertical/horizontal, validation)
- [ ] DatePicker component (date, datetime, ranges, keyboard nav)

**Assigned To**: [Form Components Lead]  
**Target**: Day 2  
**Status**: ⏳ NOT STARTED

#### Data Display
- [ ] Table component (sorting, pagination, selection, virtual scroll)
- [ ] Badge component (colored variants, icon support)
- [ ] Card component (header, footer, shadow, hover)

**Assigned To**: [Data Display Lead]  
**Target**: Day 2  
**Status**: ⏳ NOT STARTED

#### Feedback & Notifications
- [ ] Modal component (header/footer, animations, keyboard)
- [ ] Drawer component (from sides, animations, resizable)
- [ ] Toast component (4 types, auto-dismiss, actions)
- [ ] Alert component (4 types, close, icons, links)
- [ ] Spinner component (sizes, inline/overlay, pulsing)

**Assigned To**: [Feedback Components Lead]  
**Target**: Day 2  
**Status**: ⏳ NOT STARTED

#### Navigation & Utilities
- [ ] Tabs component (navigation, lazy loading, icons)
- [ ] Breadcrumb component (separators, responsive, clicks)
- [ ] Pagination component (prev/next, numbers, limit selector)
- [ ] SearchInput component (debounce, async, suggestions)
- [ ] FilterBar component (filter chips, saved filters, suggestions)
- [ ] Tooltip component (placement, delay, keyboard nav)
- [ ] Dropdown component (submenu, dividers, keyboard nav)
- [ ] MenuButton component (items, icons, shortcuts, loading)
- [ ] EmptyState component (illustration, action, message)
- [ ] ErrorBoundary component (fallback UI, logging, retry)

**Assigned To**: [Navigation Components Lead]  
**Target**: Day 2-3  
**Status**: ⏳ NOT STARTED

---

### Layout Components (5 Components)

- [ ] Layout.vue (main wrapper with sidebar, topbar, footer)
- [ ] Sidebar.vue (navigation, collapsible, active indicators)
- [ ] TopBar.vue (breadcrumb, search, user menu, notifications)
- [ ] SidebarMenu.vue (menu items, submenu, collapse, icons)
- [ ] UserMenu.vue (profile dropdown, settings, logout, theme)

**Assigned To**: [Layout Lead]  
**Target**: Day 3  
**Status**: ⏳ NOT STARTED

---

### API Service Layer (12 Services)

- [ ] Setup Axios client with interceptors (auth, error handling)
- [ ] Organizations service (list, create, getById, update, delete, export)
- [ ] Ledgers service (list, create, getById, update, delete)
- [ ] Assets service (list, create, getById, update, delete)
- [ ] Accounts service (list, create, getById, update, delete)
- [ ] Portfolios service (list, create, getById, update, delete)
- [ ] Segments service (list, create, getById, update, delete)
- [ ] Operation Routes service (list, create, getById, update, delete)
- [ ] Transaction Routes service (list, create, getById, update, delete)
- [ ] Transactions service (list, create, getById, search, filters)
- [ ] Operations service (list by account, list by transaction)
- [ ] Balances service (list, create, getById, update, delete)
- [ ] Asset Rates service (list, create, update, delete, history, bulk)

**Assigned To**: [API Integration Lead]  
**Target**: Day 4  
**Status**: ⏳ NOT STARTED

---

### Pinia State Management (12 Stores)

- [ ] Organizations store (state, getters, actions, pagination)
- [ ] Ledgers store (state, getters, actions, pagination)
- [ ] Assets store (state, getters, actions)
- [ ] Accounts store (state, getters, actions, filters, balance tracking)
- [ ] Portfolios store (state, getters, actions)
- [ ] Segments store (state, getters, actions, hierarchy)
- [ ] Transactions store (state, getters, actions, search, filters)
- [ ] Operations store (state, getters, actions, by account/transaction)
- [ ] Balances store (state, getters, actions, by account, global)
- [ ] Asset Rates store (state, getters, actions, history)
- [ ] UI store (modals, sidebar state, theme, notifications)
- [ ] Auth store (token, user, permissions)

**Assigned To**: [State Management Lead]  
**Target**: Day 4-5  
**Status**: ⏳ NOT STARTED

---

### Vue Router Setup

- [ ] Router initialization with lazy loading
- [ ] Route hierarchy (onboarding, transactions, settings)
- [ ] Navigation guards (auth, permission checks)
- [ ] Breadcrumb integration
- [ ] 404 page

**Assigned To**: [Routing Lead]  
**Target**: Day 5  
**Status**: ⏳ NOT STARTED

---

### Documentation & Setup

- [ ] API documentation
- [ ] Component library style guide
- [ ] Setup instructions in README
- [ ] Development workflow guide
- [ ] Deployment checklist

**Assigned To**: [Documentation Lead]  
**Target**: Day 5  
**Status**: ⏳ NOT STARTED

---

## 📋 PHASE 2: Onboarding - Core (WEEKS 2-3)

### Organizations Module (9 Components)

- [ ] OrganizationsList (list, search, filters, pagination, export)
- [ ] OrganizationsTable (table, sorting, row actions)
- [ ] OrganizationActions (view, edit, delete, copy ID)
- [ ] CreateOrganization (create page/modal)
- [ ] OrganizationForm (form with validation, metadata)
- [ ] EditOrganization (edit page/modal)
- [ ] OrganizationDetail (detail page, info, relations, metadata, audit)
- [ ] OrganizationInfo (info card)
- [ ] OrganizationMetadata (metadata viewer/editor)

**Assigned To**: [Org Module Lead]  
**Target**: Week 2  
**Status**: ⏳ NOT STARTED

---

### Ledgers Module (9 Components)

- [ ] LedgersList (list with org context, metrics, pagination)
- [ ] LedgersTable (hierarchical table, account count)
- [ ] LedgerActions (view, edit, delete)
- [ ] CreateLedger (create page/modal)
- [ ] LedgerForm (form with org selector)
- [ ] EditLedger (edit page/modal)
- [ ] LedgerDetail (detail with tabs: info, assets, accounts, portfolios, segments)
- [ ] LedgerInfo (info card)
- [ ] LedgerTabs (tabbed interface)

**Assigned To**: [Ledger Module Lead]  
**Target**: Week 2-3  
**Status**: ⏳ NOT STARTED

---

### Assets Module (6 Components)

- [ ] AssetsList (embedded table in ledger)
- [ ] AssetsTable (table display with inline actions)
- [ ] CreateAsset (create modal)
- [ ] AssetForm (form with type selector, decimals)
- [ ] EditAsset (edit modal)
- [ ] AssetDetail (detail modal)

**Assigned To**: [Assets Module Lead]  
**Target**: Week 3  
**Status**: ⏳ NOT STARTED

---

### Accounts Module (10 Components)

- [ ] AccountsList (advanced filtering, balance display, pagination)
- [ ] AccountsTable (balance columns, status badges, sorting)
- [ ] AccountActions (view, edit, delete, disable/enable)
- [ ] CreateAccount (hierarchical form)
- [ ] AccountForm (all fields, asset/portfolio/segment selectors)
- [ ] EditAccount (edit form)
- [ ] AccountDetail (tabbed: info, balance widget, balances, operations, transactions)
- [ ] AccountInfo (info card)
- [ ] BalanceSummaryWidget (balance display: current, available, on-hold)
- [ ] AccountAliasLookup (autocomplete search)

**Assigned To**: [Accounts Module Lead]  
**Target**: Week 3  
**Status**: ⏳ NOT STARTED

---

## 📋 PHASE 3: Onboarding - Advanced (WEEKS 4-5)

### Portfolios Module (6 Components)

- [ ] PortfoliosList (list, account count, pagination)
- [ ] PortfoliosTable (table with metrics)
- [ ] CreatePortfolio (create modal)
- [ ] PortfolioForm (form with validation)
- [ ] EditPortfolio (edit modal)
- [ ] PortfolioDetail (detail with linked accounts)

**Assigned To**: [Portfolios Lead]  
**Target**: Week 4  
**Status**: ⏳ NOT STARTED

---

### Segments Module (6 Components)

- [ ] SegmentsList (hierarchical display, tree view)
- [ ] SegmentsTable (tree/table view with expand/collapse)
- [ ] CreateSegment (create modal)
- [ ] SegmentForm (form with parent selector, circular dep check)
- [ ] EditSegment (edit modal)
- [ ] SegmentDetail (detail with child segments, linked accounts)

**Assigned To**: [Segments Lead]  
**Target**: Week 4-5  
**Status**: ⏳ NOT STARTED

---

### Operation Routes Module (7 Components)

- [ ] OperationRoutesList (list, route type filter, pagination)
- [ ] OperationRoutesTable (account alias display, row actions)
- [ ] CreateOperationRoute (create modal)
- [ ] OperationRouteForm (form with account selectors)
- [ ] EditOperationRoute (edit modal)
- [ ] OperationRouteDetail (detail with account info, usage stats)
- [ ] Route validation logic (circular route prevention)

**Assigned To**: [Operation Routes Lead]  
**Target**: Week 5  
**Status**: ⏳ NOT STARTED

---

### Transaction Routes Module (6 Components)

- [ ] TransactionRoutesList (list, filter, pagination)
- [ ] TransactionRoutesTable (table display)
- [ ] CreateTransactionRoute (create modal)
- [ ] TransactionRouteForm (form with validation)
- [ ] EditTransactionRoute (edit modal)
- [ ] TransactionRouteDetail (detail page)

**Assigned To**: [Transaction Routes Lead]  
**Target**: Week 5  
**Status**: ⏳ NOT STARTED

---

## 📋 PHASE 4: Transactions - Creation (WEEKS 6-7)

### JSON Transaction Creation (8 Components)

- [ ] CreateTransactionJSON (main page with JSON editor)
- [ ] TransactionJSONEditor (syntax highlight, validation, format)
- [ ] TransactionPreview (operations display, amount calc, validation)
- [ ] Template library (save/load transaction templates)
- [ ] Dry-run functionality (test transactions)
- [ ] Schema validation against JSON schema
- [ ] Error highlighting and reporting
- [ ] Idempotency key generation

**Assigned To**: [JSON Transaction Lead]  
**Target**: Week 6  
**Status**: ⏳ NOT STARTED

---

### Inflow Transaction Creation (3 Components)

- [ ] CreateInflowTransaction (simple form page)
- [ ] InflowTransactionForm (account selector, amount, validation)
- [ ] Quick submit with success notification

**Assigned To**: [Inflow Transaction Lead]  
**Target**: Week 6  
**Status**: ⏳ NOT STARTED

---

### Outflow Transaction Creation (3 Components)

- [ ] CreateOutflowTransaction (simple form page)
- [ ] OutflowTransactionForm (balance validation, warnings)
- [ ] Balance check before submission

**Assigned To**: [Outflow Transaction Lead]  
**Target**: Week 6-7  
**Status**: ⏳ NOT STARTED

---

## 📋 PHASE 5: Transactions - Details & Operations (WEEKS 8-9)

### Transaction Details (8 Components)

- [ ] TransactionsList (advanced search, date/amount filters, pagination)
- [ ] TransactionsTable (status badges, amount formatting, actions)
- [ ] TransactionDetail (main detail page with tabs)
- [ ] TransactionSummary (summary widget with ID, status, amount, date)
- [ ] TransactionOperations (operations tab table)
- [ ] TransactionBalances (balance impact display, before/after)
- [ ] TransactionMetadata (metadata JSON viewer)
- [ ] TransactionTimeline (lifecycle timeline, status changes, events)

**Assigned To**: [Transaction Details Lead]  
**Target**: Week 8-9  
**Status**: ⏳ NOT STARTED

---

### Operations Management (3 Components)

- [ ] OperationsList (account-based operations, type filter, pagination)
- [ ] OperationsTable (type badges, amount, balance after, actions)
- [ ] OperationDetail (operation detail modal)

**Assigned To**: [Operations Lead]  
**Target**: Week 9  
**Status**: ⏳ NOT STARTED

---

## 📋 PHASE 6: Balances & Asset Rates (WEEKS 10-11)

### Balances Management (7 Components)

- [ ] BalancesList (account balances, asset filter, amount sort, CRUD)
- [ ] BalancesTable (all balance columns, status badges, formatting)
- [ ] GlobalBalancesList (all balances view, multi-filter, export, trends)
- [ ] BalanceDetail (detail page with chart, transaction history)
- [ ] BalanceChart (trend chart with time range)
- [ ] BalanceForm (create/update form with validation)
- [ ] UpdateBalance (update modal)

**Assigned To**: [Balances Lead]  
**Target**: Week 10  
**Status**: ⏳ NOT STARTED

---

### Asset Rates Management (8 Components)

- [ ] AssetRatesList (rates list, effective date filter, pagination)
- [ ] AssetRatesTable (asset pair display, rate, date, actions)
- [ ] CreateAssetRate (create modal)
- [ ] AssetRateForm (asset selectors, reverse rate calc)
- [ ] EditAssetRate (edit modal)
- [ ] BulkUploadRates (CSV upload with preview, mapping, validation)
- [ ] AssetRatesHistory (historical rates view, date filter, chart)
- [ ] AssetRatesChart (rate trend chart)

**Assigned To**: [Asset Rates Lead]  
**Target**: Week 11  
**Status**: ⏳ NOT STARTED

---

## 📋 PHASE 7: Testing & Optimization (WEEK 12)

### Unit Testing

- [ ] Setup Vitest configuration
- [ ] Test Organizations store (>90% coverage)
- [ ] Test Ledgers store (>90% coverage)
- [ ] Test Assets store (>90% coverage)
- [ ] Test Accounts store (>90% coverage)
- [ ] Test Portfolios store (>90% coverage)
- [ ] Test Segments store (>90% coverage)
- [ ] Test Transactions store (>90% coverage)
- [ ] Test Operations store (>90% coverage)
- [ ] Test Balances store (>90% coverage)
- [ ] Test Asset Rates store (>90% coverage)
- [ ] Test API services (>85% coverage)
- [ ] Test utility functions (>90% coverage)
- [ ] Achieve overall >80% coverage

**Assigned To**: [QA Lead]  
**Target**: Week 12 (Days 1-2)  
**Status**: ⏳ NOT STARTED

---

### Component Testing

- [ ] Test List components (pagination, filters, search)
- [ ] Test Form components (validation, submission)
- [ ] Test Detail components (data display)
- [ ] Test Modal/Drawer components (open, close, submit)
- [ ] Test Layout components (navigation, responsive)
- [ ] Test Table components (sorting, selection)

**Assigned To**: [QA Lead]  
**Target**: Week 12 (Days 2-3)  
**Status**: ⏳ NOT STARTED

---

### E2E Testing (Playwright)

- [ ] Setup Playwright configuration
- [ ] Test Organization CRUD flow
- [ ] Test Account creation with balance
- [ ] Test Transaction creation (JSON method)
- [ ] Test Transaction creation (Inflow method)
- [ ] Test Transaction creation (Outflow method)
- [ ] Test Balance update workflow
- [ ] Test Filter and search workflows
- [ ] Test error handling flows
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Responsive design testing (mobile, tablet, desktop)

**Assigned To**: [QA Lead]  
**Target**: Week 12 (Days 3-4)  
**Status**: ⏳ NOT STARTED

---

### Performance Optimization

- [ ] Code splitting for lazy loading
- [ ] Virtual scrolling for large tables (1000+ rows)
- [ ] Debounced search/filtering (300ms)
- [ ] Image optimization
- [ ] Bundle analysis and optimization
- [ ] Lighthouse audit (target >90)
- [ ] First Contentful Paint (FCP) <2s
- [ ] Largest Contentful Paint (LCP) <2.5s
- [ ] Cumulative Layout Shift (CLS) <0.1

**Assigned To**: [Performance Lead]  
**Target**: Week 12 (Days 4-5)  
**Status**: ⏳ NOT STARTED

---

### Documentation

- [ ] API documentation (endpoints, request/response)
- [ ] Component library guide (Storybook)
- [ ] Deployment guide (build, configuration, hosting)
- [ ] Architecture documentation (patterns, decisions)
- [ ] Developer onboarding guide
- [ ] Troubleshooting guide (common issues)
- [ ] Setup instructions (dependencies, configuration)

**Assigned To**: [Documentation Lead]  
**Target**: Week 12 (Days 4-5)  
**Status**: ⏳ NOT STARTED

---

## 📊 Summary Statistics

### Component Status
| Type | Total | Completed | In Progress | Not Started |
|------|-------|-----------|-------------|-------------|
| Base UI | 25 | 0 | 0 | 25 |
| Layout | 5 | 0 | 0 | 5 |
| Onboarding | 60+ | 0 | 0 | 60+ |
| Transactions | 60+ | 0 | 0 | 60+ |
| **TOTAL** | **150+** | **0** | **0** | **150+** |

### Task Status
- ✅ **Completed**: 0 tasks (0%)
- 🔄 **In Progress**: 0 tasks (0%)
- ⏳ **Not Started**: 150+ tasks (100%)

### Timeline Progress
- **Week 1**: 0% → 10% (Foundation)
- **Week 2-3**: 10% → 30% (Org & Ledgers)
- **Week 4-5**: 30% → 50% (Assets & Accounts)
- **Week 6-7**: 50% → 65% (Transaction Creation)
- **Week 8-9**: 65% → 80% (Transaction Details)
- **Week 10-11**: 80% → 95% (Balances & Rates)
- **Week 12**: 95% → 100% (Testing & Optimization)

---

## 🔄 How to Use This Checklist

### Daily Updates
```markdown
# At end of each day:
1. Check off completed tasks
2. Update status if tasks started
3. Note blockers or issues
4. Update estimated completion dates
```

### Weekly Review
```markdown
# Every Friday:
1. Count completed vs total tasks
2. Calculate percentage completion
3. Adjust timeline if needed
4. Plan next week's priorities
```

### Handoff/Resumption
```markdown
# When pausing work:
1. Mark current task status
2. Document what's done, what's next
3. List any blockers or issues
4. Update README with latest progress
```

---

## 📝 Notes for Tracking

### Week 1 Notes
- Start: [Date]
- Progress: [0%]
- Blockers: [None yet]
- Next: [Project setup]

### Week 2 Notes
- Start: [Date]
- Progress: [0%]
- Blockers: [TBD]
- Next: [TBD]

---

## 🎯 Success Criteria

### By End of Week 1
- [ ] All base components complete and tested
- [ ] All layout components complete
- [ ] API services all implemented
- [ ] All stores initialized
- [ ] Router working with all routes
- [ ] Development environment ready

### By End of Week 7 (MVP)
- [ ] Organizations to Segments CRUD complete
- [ ] Transaction creation (all 3 methods) working
- [ ] Transaction list and details working
- [ ] Basic testing complete
- [ ] Ready for internal testing

### By End of Week 12 (Production)
- [ ] All features complete
- [ ] >80% test coverage
- [ ] Performance optimized
- [ ] Security audited
- [ ] Documentation complete
- [ ] Ready for production release

---

**Last Updated**: 2025-10-21  
**Version**: 1.0  
**Owner**: [Dev Lead Name]  
**Next Review**: Daily (End of Day)
