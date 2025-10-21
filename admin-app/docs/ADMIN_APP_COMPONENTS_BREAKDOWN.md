# Midaz Admin App - Components Breakdown & Task List

## 📊 Components by Category

### Legend
- 🟦 **Blue**: UI Component (Base/Reusable)
- 🟩 **Green**: Feature Component (Specific Feature)
- 🟨 **Yellow**: Page Component (Full Page)

---

## Part 1: Base UI Components Library

### Common Components (Reusable across the app)

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 1 | Button | 🟦 | `components/common/Button.vue` | Reusable button with variants (primary, secondary, danger, ghost) | [ ] Create component [ ] Add size variants [ ] Add loading state [ ] Add disabled state [ ] Add icon support |
| 2 | Input | 🟦 | `components/common/Input.vue` | Text input with validation | [ ] Create component [ ] Add error state [ ] Add label [ ] Add placeholder [ ] Add icon support [ ] Add loading state |
| 3 | Select | 🟦 | `components/common/Select.vue` | Dropdown select component | [ ] Create component [ ] Add search [ ] Add multi-select option [ ] Add async loading [ ] Add error state |
| 4 | Textarea | 🟦 | `components/common/Textarea.vue` | Multi-line text input | [ ] Create component [ ] Add character counter [ ] Add resize handle [ ] Add validation |
| 5 | Checkbox | 🟦 | `components/common/Checkbox.vue` | Checkbox input | [ ] Create component [ ] Add indeterminate state [ ] Add label [ ] Add validation |
| 6 | Radio | 🟦 | `components/common/Radio.vue` | Radio button group | [ ] Create component [ ] Add label [ ] Add vertical layout [ ] Add validation |
| 7 | DatePicker | 🟦 | `components/common/DatePicker.vue` | Date/Time picker | [ ] Create component [ ] Add time picker [ ] Add range selection [ ] Add format support |
| 8 | Table | 🟦 | `components/common/Table.vue` | Data table with sorting & pagination | [ ] Create component [ ] Add sorting [ ] Add pagination [ ] Add selection [ ] Add virtualization [ ] Add column resize |
| 9 | Modal | 🟦 | `components/common/Modal.vue` | Dialog/Modal component | [ ] Create component [ ] Add footer [ ] Add backdrop click [ ] Add keyboard shortcuts [ ] Add animation |
| 10 | Drawer | 🟦 | `components/common/Drawer.vue` | Slide-out panel | [ ] Create component [ ] Add backdrop [ ] Add animation [ ] Add footer [ ] Add resize |
| 11 | Toast | 🟦 | `components/common/Toast.vue` | Notification toast | [ ] Create component [ ] Add types (info, success, warning, error) [ ] Add close button [ ] Add auto-dismiss [ ] Add action button |
| 12 | Spinner | 🟦 | `components/common/Spinner.vue` | Loading spinner | [ ] Create component [ ] Add sizes [ ] Add variants [ ] Add text overlay |
| 13 | Badge | 🟦 | `components/common/Badge.vue` | Status badge | [ ] Create component [ ] Add variants (primary, success, warning, error, info) [ ] Add icon support |
| 14 | Card | 🟦 | `components/common/Card.vue` | Card container | [ ] Create component [ ] Add header [ ] Add footer [ ] Add hover effect [ ] Add shadow |
| 15 | Tabs | 🟦 | `components/common/Tabs.vue` | Tab navigation | [ ] Create component [ ] Add tab panels [ ] Add active state [ ] Add icon support |
| 16 | Breadcrumb | 🟦 | `components/common/Breadcrumb.vue` | Navigation breadcrumb | [ ] Create component [ ] Add separator customization [ ] Add click handling [ ] Add responsive collapse |
| 17 | Pagination | 🟦 | `components/common/Pagination.vue` | Page navigation | [ ] Create component [ ] Add previous/next [ ] Add page numbers [ ] Add limit selector [ ] Add jump to page |
| 18 | SearchInput | 🟦 | `components/common/SearchInput.vue` | Search with suggestions | [ ] Create component [ ] Add debouncing [ ] Add async search [ ] Add clear button [ ] Add keyboard shortcuts |
| 19 | FilterBar | 🟦 | `components/common/FilterBar.vue` | Multi-filter UI | [ ] Create component [ ] Add filter chips [ ] Add clear all [ ] Add saved filters [ ] Add filter suggestions |
| 20 | Alert | 🟦 | `components/common/Alert.vue` | Alert message box | [ ] Create component [ ] Add types (info, success, warning, error) [ ] Add close button [ ] Add icon [ ] Add link support |
| 21 | Tooltip | 🟦 | `components/common/Tooltip.vue` | Tooltip component | [ ] Create component [ ] Add placement options [ ] Add delay [ ] Add keyboard navigation |
| 22 | Dropdown | 🟦 | `components/common/Dropdown.vue` | Dropdown menu | [ ] Create component [ ] Add submenu [ ] Add divider [ ] Add keyboard navigation [ ] Add click outside |
| 23 | MenuButton | 🟦 | `components/common/MenuButton.vue` | Action menu button | [ ] Create component [ ] Add menu items [ ] Add icons [ ] Add keyboard shortcuts [ ] Add loading state |
| 24 | EmptyState | 🟦 | `components/common/EmptyState.vue` | Empty result display | [ ] Create component [ ] Add illustration [ ] Add action button [ ] Add message support |
| 25 | ErrorBoundary | 🟦 | `components/common/ErrorBoundary.vue` | Error handling wrapper | [ ] Create component [ ] Add fallback UI [ ] Add error logging [ ] Add retry button |

---

## Part 2: Layout Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 26 | Layout | 🟨 | `components/layout/Layout.vue` | Main app layout wrapper | [ ] Create layout [ ] Add sidebar [ ] Add topbar [ ] Add footer [ ] Add responsive breakpoints |
| 27 | Sidebar | 🟩 | `components/layout/Sidebar.vue` | Navigation sidebar | [ ] Create sidebar [ ] Add menu items [ ] Add collapsible state [ ] Add active indicator [ ] Add collapse animation |
| 28 | TopBar | 🟩 | `components/layout/TopBar.vue` | Top navigation bar | [ ] Create topbar [ ] Add breadcrumb [ ] Add search [ ] Add user menu [ ] Add notifications |
| 29 | SidebarMenu | 🟩 | `components/layout/SidebarMenu.vue` | Sidebar menu items | [ ] Create menu [ ] Add submenu [ ] Add collapse toggle [ ] Add active state [ ] Add icon support |
| 30 | UserMenu | 🟩 | `components/layout/UserMenu.vue` | User profile dropdown | [ ] Create menu [ ] Add profile link [ ] Add logout [ ] Add settings [ ] Add theme toggle |

---

## Part 3: Organizations Module

### List Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 31 | OrganizationsList | 🟨 | `components/onboarding/organizations/OrganizationsList.vue` | Organizations list view | [ ] Create table [ ] Add search [ ] Add filter [ ] Add create button [ ] Add pagination [ ] Add export [ ] Add bulk actions |
| 32 | OrganizationsTable | 🟩 | `components/onboarding/organizations/OrganizationsTable.vue` | Organizations table | [ ] Create table [ ] Add columns [ ] Add sorting [ ] Add row actions [ ] Add hover effects |
| 33 | OrganizationActions | 🟩 | `components/onboarding/organizations/OrganizationActions.vue` | Row action buttons | [ ] Create menu [ ] Add view [ ] Add edit [ ] Add delete [ ] Add copy ID |

### Create/Edit Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 34 | CreateOrganization | 🟨 | `components/onboarding/organizations/CreateOrganization.vue` | Create modal/page | [ ] Create form page [ ] Add form validation [ ] Add metadata editor [ ] Add parent selector [ ] Add submit logic |
| 35 | OrganizationForm | 🟩 | `components/onboarding/organizations/OrganizationForm.vue` | Organization form | [ ] Create form [ ] Add fields (name, code, description) [ ] Add validation [ ] Add metadata JSON editor [ ] Add parent lookup |
| 36 | EditOrganization | 🟨 | `components/onboarding/organizations/EditOrganization.vue` | Edit modal/page | [ ] Create form page [ ] Add form prefill [ ] Add change tracking [ ] Add save logic [ ] Add cancel confirmation |

### Detail Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 37 | OrganizationDetail | 🟨 | `components/onboarding/organizations/OrganizationDetail.vue` | Organization detail page | [ ] Create layout [ ] Add information section [ ] Add metrics [ ] Add related ledgers [ ] Add metadata [ ] Add audit trail |
| 38 | OrganizationInfo | 🟩 | `components/onboarding/organizations/OrganizationInfo.vue` | Info card | [ ] Create card [ ] Add fields display [ ] Add edit button [ ] Add copy functionality |
| 39 | OrganizationMetadata | 🟩 | `components/onboarding/organizations/OrganizationMetadata.vue` | Metadata display | [ ] Create section [ ] Add JSON viewer [ ] Add edit button [ ] Add copy button |

---

## Part 4: Ledgers Module

### List Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 40 | LedgersList | 🟨 | `components/onboarding/ledgers/LedgersList.vue` | Ledgers list view | [ ] Create table [ ] Add search [ ] Add org filter [ ] Add metrics [ ] Add create button [ ] Add pagination |
| 41 | LedgersTable | 🟩 | `components/onboarding/ledgers/LedgersTable.vue` | Ledgers table | [ ] Create table [ ] Add metrics columns [ ] Add sorting [ ] Add row actions [ ] Add org context |
| 42 | LedgerActions | 🟩 | `components/onboarding/ledgers/LedgerActions.vue` | Row action buttons | [ ] Create menu [ ] Add view [ ] Add edit [ ] Add delete [ ] Add copy ID |

### Create/Edit Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 43 | CreateLedger | 🟨 | `components/onboarding/ledgers/CreateLedger.vue` | Create modal/page | [ ] Create form [ ] Add org selector [ ] Add form validation [ ] Add submit logic |
| 44 | LedgerForm | 🟩 | `components/onboarding/ledgers/LedgerForm.vue` | Ledger form | [ ] Create form [ ] Add fields [ ] Add org selector [ ] Add validation [ ] Add metadata editor |
| 45 | EditLedger | 🟨 | `components/onboarding/ledgers/EditLedger.vue` | Edit modal/page | [ ] Create form [ ] Add prefill logic [ ] Add save [ ] Add cancel |

### Detail Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 46 | LedgerDetail | 🟨 | `components/onboarding/ledgers/LedgerDetail.vue` | Ledger detail page | [ ] Create tabbed layout [ ] Add info section [ ] Add assets tab [ ] Add accounts tab [ ] Add portfolios tab [ ] Add segments tab [ ] Add metrics |
| 47 | LedgerInfo | 🟩 | `components/onboarding/ledgers/LedgerInfo.vue` | Info card | [ ] Create card [ ] Add fields display [ ] Add metrics [ ] Add edit button |
| 48 | LedgerTabs | 🟩 | `components/onboarding/ledgers/LedgerTabs.vue` | Tab navigation | [ ] Create tabs [ ] Add assets [ ] Add accounts [ ] Add portfolios [ ] Add segments |

---

## Part 5: Assets Module

### List Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 49 | AssetsList | 🟨 | `components/onboarding/assets/AssetsList.vue` | Assets list in ledger | [ ] Create embedded table [ ] Add search [ ] Add filter [ ] Add create button [ ] Add inline edit/delete |
| 50 | AssetsTable | 🟩 | `components/onboarding/assets/AssetsTable.vue` | Assets table | [ ] Create table [ ] Add columns [ ] Add inline actions [ ] Add row styling |

### Create/Edit Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 51 | CreateAsset | 🟩 | `components/onboarding/assets/CreateAsset.vue` | Create modal | [ ] Create modal [ ] Add form [ ] Add validation [ ] Add code format check |
| 52 | AssetForm | 🟩 | `components/onboarding/assets/AssetForm.vue` | Asset form | [ ] Create form [ ] Add fields (name, code, type, decimals) [ ] Add validation [ ] Add type selector |
| 53 | EditAsset | 🟩 | `components/onboarding/assets/EditAsset.vue` | Edit modal | [ ] Create modal [ ] Add form [ ] Add prefill [ ] Add save logic |

### Detail Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 54 | AssetDetail | 🟩 | `components/onboarding/assets/AssetDetail.vue` | Asset detail modal | [ ] Create modal [ ] Add info [ ] Add usage count [ ] Add metadata [ ] Add edit/delete |

---

## Part 6: Accounts Module

### List Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 55 | AccountsList | 🟨 | `components/onboarding/accounts/AccountsList.vue` | Accounts list view | [ ] Create table [ ] Add advanced filtering [ ] Add search [ ] Add sort by balance [ ] Add create button [ ] Add pagination [ ] Add export |
| 56 | AccountsTable | 🟩 | `components/onboarding/accounts/AccountsTable.vue` | Accounts table | [ ] Create table [ ] Add balance display [ ] Add status badges [ ] Add sorting [ ] Add row actions |
| 57 | AccountActions | 🟩 | `components/onboarding/accounts/AccountActions.vue` | Row action buttons | [ ] Create menu [ ] Add view [ ] Add edit [ ] Add delete [ ] Add disable/enable |

### Create/Edit Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 58 | CreateAccount | 🟨 | `components/onboarding/accounts/CreateAccount.vue` | Create modal/page | [ ] Create form [ ] Add hierarchical selectors [ ] Add validation [ ] Add metadata editor |
| 59 | AccountForm | 🟩 | `components/onboarding/accounts/AccountForm.vue` | Account form | [ ] Create form [ ] Add all fields [ ] Add asset selector [ ] Add portfolio selector [ ] Add segment selector [ ] Add type selector [ ] Add validation |
| 60 | EditAccount | 🟨 | `components/onboarding/accounts/EditAccount.vue` | Edit modal/page | [ ] Create form [ ] Add prefill [ ] Add change tracking [ ] Add save logic |

### Detail Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 61 | AccountDetail | 🟨 | `components/onboarding/accounts/AccountDetail.vue` | Account detail page | [ ] Create layout with tabs [ ] Add info panel [ ] Add balance widget [ ] Add balances tab [ ] Add operations tab [ ] Add transaction history [ ] Add metadata |
| 62 | AccountInfo | 🟩 | `components/onboarding/accounts/AccountInfo.vue` | Info card | [ ] Create card [ ] Add fields [ ] Add status badge [ ] Add links [ ] Add edit button |
| 63 | BalanceSummaryWidget | 🟩 | `components/onboarding/accounts/BalanceSummaryWidget.vue` | Balance summary | [ ] Create widget [ ] Display current balance [ ] Display available [ ] Display on hold [ ] Add trend indicator [ ] Add refresh button |
| 64 | AccountAliasLookup | 🟩 | `components/onboarding/accounts/AccountAliasLookup.vue` | Alias search component | [ ] Create search [ ] Add autocomplete [ ] Add preview [ ] Add keyboard navigation |

---

## Part 7: Portfolios Module

### List Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 65 | PortfoliosList | 🟨 | `components/onboarding/portfolios/PortfoliosList.vue` | Portfolios list view | [ ] Create table [ ] Add search [ ] Add create button [ ] Add account count display [ ] Add pagination |
| 66 | PortfoliosTable | 🟩 | `components/onboarding/portfolios/PortfoliosTable.vue` | Portfolios table | [ ] Create table [ ] Add columns [ ] Add account count [ ] Add row actions |

### Create/Edit Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 67 | CreatePortfolio | 🟩 | `components/onboarding/portfolios/CreatePortfolio.vue` | Create modal | [ ] Create modal [ ] Add form [ ] Add validation |
| 68 | PortfolioForm | 🟩 | `components/onboarding/portfolios/PortfolioForm.vue` | Portfolio form | [ ] Create form [ ] Add fields [ ] Add validation [ ] Add metadata editor |
| 69 | EditPortfolio | 🟩 | `components/onboarding/portfolios/EditPortfolio.vue` | Edit modal | [ ] Create modal [ ] Add form [ ] Add prefill [ ] Add save |

### Detail Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 70 | PortfolioDetail | 🟨 | `components/onboarding/portfolios/PortfolioDetail.vue` | Portfolio detail page | [ ] Create layout [ ] Add info section [ ] Add linked accounts tab [ ] Add metadata |
| 71 | PortfolioInfo | 🟩 | `components/onboarding/portfolios/PortfolioInfo.vue` | Info card | [ ] Create card [ ] Add fields display |

---

## Part 8: Segments Module

### List Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 72 | SegmentsList | 🟨 | `components/onboarding/segments/SegmentsList.vue` | Segments list view | [ ] Create tree/table view [ ] Add hierarchical display [ ] Add search [ ] Add create button [ ] Add account count |
| 73 | SegmentsTable | 🟩 | `components/onboarding/segments/SegmentsTable.vue` | Segments table | [ ] Create hierarchical table [ ] Add indentation [ ] Add expand/collapse [ ] Add row actions |

### Create/Edit Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 74 | CreateSegment | 🟩 | `components/onboarding/segments/CreateSegment.vue` | Create modal | [ ] Create modal [ ] Add form [ ] Add parent selector [ ] Add validation |
| 75 | SegmentForm | 🟩 | `components/onboarding/segments/SegmentForm.vue` | Segment form | [ ] Create form [ ] Add all fields [ ] Add parent selector [ ] Add circular dependency check |
| 76 | EditSegment | 🟩 | `components/onboarding/segments/EditSegment.vue` | Edit modal | [ ] Create modal [ ] Add form [ ] Add prefill [ ] Add save |

### Detail Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 77 | SegmentDetail | 🟨 | `components/onboarding/segments/SegmentDetail.vue` | Segment detail page | [ ] Create layout [ ] Add info [ ] Add child segments [ ] Add linked accounts |
| 78 | SegmentInfo | 🟩 | `components/onboarding/segments/SegmentInfo.vue` | Info card | [ ] Create card [ ] Add fields display |

---

## Part 9: Operation Routes Module

### List Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 79 | OperationRoutesList | 🟨 | `components/onboarding/operation-routes/OperationRoutesList.vue` | Routes list view | [ ] Create table [ ] Add search [ ] Add filter by type [ ] Add create button [ ] Add pagination |
| 80 | OperationRoutesTable | 🟩 | `components/onboarding/operation-routes/OperationRoutesTable.vue` | Routes table | [ ] Create table [ ] Add account alias display [ ] Add row actions |

### Create/Edit Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 81 | CreateOperationRoute | 🟩 | `components/onboarding/operation-routes/CreateOperationRoute.vue` | Create modal | [ ] Create modal [ ] Add form [ ] Add account selectors |
| 82 | OperationRouteForm | 🟩 | `components/onboarding/operation-routes/OperationRouteForm.vue` | Route form | [ ] Create form [ ] Add account selectors [ ] Add type selector [ ] Add validation |
| 83 | EditOperationRoute | 🟩 | `components/onboarding/operation-routes/EditOperationRoute.vue` | Edit modal | [ ] Create modal [ ] Add form [ ] Add save |

### Detail Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 84 | OperationRouteDetail | 🟨 | `components/onboarding/operation-routes/OperationRouteDetail.vue` | Route detail page | [ ] Create layout [ ] Add info [ ] Add account details [ ] Add usage stats |

---

## Part 10: Transaction Routes Module

### List Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 85 | TransactionRoutesList | 🟨 | `components/onboarding/transaction-routes/TransactionRoutesList.vue` | Routes list view | [ ] Create table [ ] Add search [ ] Add filter [ ] Add create button |
| 86 | TransactionRoutesTable | 🟩 | `components/onboarding/transaction-routes/TransactionRoutesTable.vue` | Routes table | [ ] Create table [ ] Add columns [ ] Add row actions |

### Create/Edit Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 87 | CreateTransactionRoute | 🟩 | `components/onboarding/transaction-routes/CreateTransactionRoute.vue` | Create modal | [ ] Create modal [ ] Add form [ ] Add account selectors |
| 88 | TransactionRouteForm | 🟩 | `components/onboarding/transaction-routes/TransactionRouteForm.vue` | Route form | [ ] Create form [ ] Add fields [ ] Add validation |
| 89 | EditTransactionRoute | 🟩 | `components/onboarding/transaction-routes/EditTransactionRoute.vue` | Edit modal | [ ] Create modal [ ] Add form [ ] Add save |

---

## Part 11: Transactions Module - Creation

### Transaction Creation Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 90 | CreateTransaction | 🟨 | `components/transactions/create/CreateTransaction.vue` | Transaction creation hub | [ ] Create page [ ] Add tabs for creation types [ ] Add navigation between types |
| 91 | CreateTransactionJSON | 🟨 | `components/transactions/create/CreateTransactionJSON.vue` | JSON transaction creator | [ ] Create form page [ ] Add JSON editor [ ] Add schema validation [ ] Add preview [ ] Add dry-run [ ] Add template library |
| 92 | TransactionJSONEditor | 🟩 | `components/transactions/create/TransactionJSONEditor.vue` | JSON editor component | [ ] Create editor [ ] Add syntax highlighting [ ] Add validation [ ] Add format button [ ] Add error display |
| 93 | TransactionPreview | 🟩 | `components/transactions/create/TransactionPreview.vue` | Transaction preview | [ ] Create preview panel [ ] Add operations display [ ] Add amount calculation [ ] Add account names [ ] Add validation summary |
| 94 | CreateInflowTransaction | 🟨 | `components/transactions/create/CreateInflowTransaction.vue` | Inflow transaction creator | [ ] Create form [ ] Add account selector [ ] Add amount input [ ] Add quick submit [ ] Add validation |
| 95 | InflowTransactionForm | 🟩 | `components/transactions/create/InflowTransactionForm.vue` | Inflow form | [ ] Create form [ ] Add account selector [ ] Add amount input [ ] Add validation |
| 96 | CreateOutflowTransaction | 🟨 | `components/transactions/create/CreateOutflowTransaction.vue` | Outflow transaction creator | [ ] Create form [ ] Add account selector [ ] Add balance check [ ] Add amount input [ ] Add validation |
| 97 | OutflowTransactionForm | 🟩 | `components/transactions/create/OutflowTransactionForm.vue` | Outflow form | [ ] Create form [ ] Add account selector [ ] Add balance validation [ ] Add amount input |
| 98 | TransactionTemplateLibrary | 🟩 | `components/transactions/create/TransactionTemplateLibrary.vue` | Template selector | [ ] Create modal [ ] Add template list [ ] Add template preview [ ] Add load template |

---

## Part 12: Transactions Module - Details & Lookup

### List Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 99 | TransactionsList | 🟨 | `components/transactions/details/TransactionsList.vue` | Transactions list view | [ ] Create table [ ] Add advanced search [ ] Add date range filter [ ] Add amount filter [ ] Add status filter [ ] Add pagination [ ] Add export |
| 100 | TransactionsTable | 🟩 | `components/transactions/details/TransactionsTable.vue` | Transactions table | [ ] Create table [ ] Add status badges [ ] Add amount formatting [ ] Add date formatting [ ] Add row actions |
| 101 | TransactionSearch | 🟩 | `components/transactions/details/TransactionSearch.vue` | Global search component | [ ] Create search [ ] Add async search [ ] Add result preview [ ] Add keyboard shortcuts |

### Detail Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 102 | TransactionDetail | 🟨 | `components/transactions/details/TransactionDetail.vue` | Transaction detail page | [ ] Create tabbed layout [ ] Add summary widget [ ] Add operations tab [ ] Add balances tab [ ] Add metadata tab [ ] Add timeline tab |
| 103 | TransactionSummary | 🟩 | `components/transactions/details/TransactionSummary.vue` | Summary widget | [ ] Create widget [ ] Display transaction info [ ] Add status badge [ ] Add amount display [ ] Add date/time |
| 104 | TransactionOperations | 🟩 | `components/transactions/details/TransactionOperations.vue` | Operations tab | [ ] Create tab content [ ] Add operations table [ ] Add operation detail modal |
| 105 | TransactionBalances | 🟩 | `components/transactions/details/TransactionBalances.vue` | Balances tab | [ ] Create tab content [ ] Add affected balances display [ ] Add before/after comparison |
| 106 | TransactionMetadata | 🟩 | `components/transactions/details/TransactionMetadata.vue` | Metadata tab | [ ] Create tab [ ] Add JSON viewer [ ] Add edit button |
| 107 | TransactionTimeline | 🟩 | `components/transactions/details/TransactionTimeline.vue` | Timeline tab | [ ] Create timeline [ ] Add lifecycle events [ ] Add timestamps [ ] Add status changes |

---

## Part 13: Operations Module

### List Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 108 | OperationsList | 🟨 | `components/transactions/operations/OperationsList.vue` | Operations list view | [ ] Create table [ ] Add filter by type [ ] Add search [ ] Add date filter [ ] Add pagination |
| 109 | OperationsTable | 🟩 | `components/transactions/operations/OperationsTable.vue` | Operations table | [ ] Create table [ ] Add type badges [ ] Add amount formatting [ ] Add balance after [ ] Add row actions |

### Detail Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 110 | OperationDetail | 🟩 | `components/transactions/operations/OperationDetail.vue` | Operation detail modal | [ ] Create modal [ ] Add operation info [ ] Add transaction link [ ] Add balance impact [ ] Add metadata |

---

## Part 14: Balances Module

### List Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 111 | BalancesList | 🟨 | `components/transactions/balances/BalancesList.vue` | Account balances list | [ ] Create table [ ] Add asset filter [ ] Add search [ ] Add amount sort [ ] Add create/update/delete [ ] Add pagination |
| 112 | BalancesTable | 🟩 | `components/transactions/balances/BalancesTable.vue` | Balances table | [ ] Create table [ ] Add all balance columns [ ] Add status badges [ ] Add formatting [ ] Add row actions |
| 113 | GlobalBalancesList | 🟨 | `components/transactions/balances/GlobalBalancesList.vue` | All balances view | [ ] Create table [ ] Add multi-column filter [ ] Add export [ ] Add trend indicators |

### Detail Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 114 | BalanceDetail | 🟨 | `components/transactions/balances/BalanceDetail.vue` | Balance detail page | [ ] Create layout [ ] Add balance info [ ] Add transaction history [ ] Add chart [ ] Add metadata |
| 115 | BalanceChart | 🟩 | `components/transactions/balances/BalanceChart.vue` | Balance trend chart | [ ] Create chart [ ] Add time range [ ] Add trend line [ ] Add data points |

### Create/Edit Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 116 | BalanceForm | 🟩 | `components/transactions/balances/BalanceForm.vue` | Balance form | [ ] Create form [ ] Add balance input [ ] Add available input [ ] Add on-hold input [ ] Add validation [ ] Add metadata editor |
| 117 | UpdateBalance | 🟩 | `components/transactions/balances/UpdateBalance.vue` | Update modal | [ ] Create modal [ ] Add form [ ] Add prefill [ ] Add save |

---

## Part 15: Asset Rates Module

### List Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 118 | AssetRatesList | 🟨 | `components/transactions/asset-rates/AssetRatesList.vue` | Asset rates list | [ ] Create table [ ] Add search [ ] Add effective date filter [ ] Add create button [ ] Add bulk upload [ ] Add pagination |
| 119 | AssetRatesTable | 🟩 | `components/transactions/asset-rates/AssetRatesTable.vue` | Asset rates table | [ ] Create table [ ] Add asset pair display [ ] Add rate formatting [ ] Add date [ ] Add row actions |

### Create/Edit Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 120 | CreateAssetRate | 🟩 | `components/transactions/asset-rates/CreateAssetRate.vue` | Create modal | [ ] Create modal [ ] Add form [ ] Add asset selectors [ ] Add reverse rate calculation |
| 121 | AssetRateForm | 🟩 | `components/transactions/asset-rates/AssetRateForm.vue` | Asset rate form | [ ] Create form [ ] Add source selector [ ] Add destination selector [ ] Add rate input [ ] Add effective date [ ] Add validation |
| 122 | EditAssetRate | 🟩 | `components/transactions/asset-rates/EditAssetRate.vue` | Edit modal | [ ] Create modal [ ] Add form [ ] Add prefill [ ] Add save |
| 123 | BulkUploadRates | 🟩 | `components/transactions/asset-rates/BulkUploadRates.vue` | CSV bulk upload | [ ] Create modal [ ] Add file selector [ ] Add preview [ ] Add mapping [ ] Add upload |

### History Components

| # | Component | Type | File | Purpose | Tasks |
|---|-----------|------|------|---------|-------|
| 124 | AssetRatesHistory | 🟨 | `components/transactions/asset-rates/AssetRatesHistory.vue` | Rate history view | [ ] Create page [ ] Add history table [ ] Add chart [ ] Add export [ ] Add date filter |
| 125 | AssetRatesChart | 🟩 | `components/transactions/asset-rates/AssetRatesChart.vue` | Rate trend chart | [ ] Create chart [ ] Add time range [ ] Add rate comparison [ ] Add data points |

---

## Part 16: Data & State Management

### API Services

| # | Service | File | Purpose | Tasks |
|---|---------|------|---------|-------|
| 126 | API Client | `services/api/client.ts` | Axios client setup | [ ] Create client [ ] Add interceptors [ ] Add error handling [ ] Add auth header |
| 127 | Organizations | `services/api/organizations.ts` | Organizations API | [ ] Create CRUD methods [ ] Add list with pagination [ ] Add search [ ] Add export |
| 128 | Ledgers | `services/api/ledgers.ts` | Ledgers API | [ ] Create CRUD methods [ ] Add by org [ ] Add metrics |
| 129 | Assets | `services/api/assets.ts` | Assets API | [ ] Create CRUD methods [ ] Add by ledger [ ] Add validation |
| 130 | Accounts | `services/api/accounts.ts` | Accounts API | [ ] Create CRUD methods [ ] Add filters [ ] Add balance methods |
| 131 | Portfolios | `services/api/portfolios.ts` | Portfolios API | [ ] Create CRUD methods [ ] Add linked accounts |
| 132 | Segments | `services/api/segments.ts` | Segments API | [ ] Create CRUD methods [ ] Add hierarchy |
| 133 | Routes | `services/api/routes.ts` | Routes API | [ ] Create CRUD for operation & transaction routes |
| 134 | Transactions | `services/api/transactions.ts` | Transactions API | [ ] Create methods [ ] Add create types [ ] Add search [ ] Add list |
| 135 | Operations | `services/api/operations.ts` | Operations API | [ ] Create read methods [ ] Add list [ ] Add by account |
| 136 | Balances | `services/api/balances.ts` | Balances API | [ ] Create CRUD methods [ ] Add by account [ ] Add global |
| 137 | Asset Rates | `services/api/asset-rates.ts` | Asset rates API | [ ] Create CRUD methods [ ] Add history [ ] Add bulk upload |

### Pinia Stores

| # | Store | File | Purpose | Tasks |
|---|-------|------|---------|-------|
| 138 | Organizations | `stores/organizations.ts` | Organizations state | [ ] Create store [ ] Add CRUD actions [ ] Add getters [ ] Add filters |
| 139 | Ledgers | `stores/ledgers.ts` | Ledgers state | [ ] Create store [ ] Add CRUD actions [ ] Add pagination |
| 140 | Assets | `stores/assets.ts` | Assets state | [ ] Create store [ ] Add CRUD actions |
| 141 | Accounts | `stores/accounts.ts` | Accounts state | [ ] Create store [ ] Add CRUD actions [ ] Add balance tracking |
| 142 | Portfolios | `stores/portfolios.ts` | Portfolios state | [ ] Create store [ ] Add CRUD actions |
| 143 | Segments | `stores/segments.ts` | Segments state | [ ] Create store [ ] Add CRUD actions [ ] Add hierarchy |
| 144 | Transactions | `stores/transactions.ts` | Transactions state | [ ] Create store [ ] Add search [ ] Add filters [ ] Add pagination |
| 145 | Operations | `stores/operations.ts` | Operations state | [ ] Create store [ ] Add by account [ ] Add by transaction |
| 146 | Balances | `stores/balances.ts` | Balances state | [ ] Create store [ ] Add CRUD [ ] Add by account [ ] Add global |
| 147 | AssetRates | `stores/asset-rates.ts` | Asset rates state | [ ] Create store [ ] Add CRUD [ ] Add history |
| 148 | UI | `stores/ui.ts` | UI state | [ ] Create store [ ] Add modals [ ] Add sidebar state [ ] Add theme |

---

## Component Summary

**Total Components**: 148
- 🟦 **Base UI Components**: 25
- 🟩 **Feature Components**: 100
- 🟨 **Page Components**: 23

**Total Tasks**: 1,000+

---

## Implementation Order (Recommended)

1. **Phase 1** (Week 1): Base UI Components + API Services
2. **Phase 2** (Weeks 2-3): Organizations & Ledgers modules
3. **Phase 3** (Weeks 4-5): Assets, Accounts, Portfolios, Segments
4. **Phase 4** (Weeks 6-7): Operation & Transaction Routes
5. **Phase 5** (Weeks 8-9): Transaction Creation & Details
6. **Phase 6** (Weeks 10-11): Operations, Balances, Asset Rates
7. **Phase 7** (Week 12): Testing, Optimization, Documentation

---

## Critical Path (MVP - 8 Weeks)

1. Base components + API
2. Organizations & Ledgers CRUD
3. Accounts with balances
4. Transaction creation (JSON)
5. Transaction list & details
6. Basic balances view

---

## Notes

- Each task should be estimated at 2-4 hours
- Components follow Vue 3 Composition API + TypeScript
- All components use Tailwind CSS + Headless UI
- Every component should have error handling
- All async operations should show loading states
- All forms should have validation
- All tables should have pagination & sorting

