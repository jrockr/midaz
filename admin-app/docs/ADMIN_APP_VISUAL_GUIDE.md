# Midaz Admin App - Visual Architecture & Flow Diagrams

## 1. Overall System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       MIDAZ ADMIN CONSOLE                        │
│                    (Vue.js 3 + TypeScript)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Frontend Components (148)                │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │   │
│  │  │ Base UI (25) │ │Features (100)│ │Pages (23)    │     │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ▲                                     │
│                            │ Vue                                │
│                            ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              State Management (Pinia)                    │   │
│  │  ┌─ Organizations  ┌─ Transactions  ┌─ Asset Rates    │   │
│  │  ├─ Ledgers        ├─ Operations    └─ UI Store       │   │
│  │  ├─ Assets         ├─ Balances                        │   │
│  │  ├─ Accounts       └─ Global State                    │   │
│  │  ├─ Portfolios                                         │   │
│  │  └─ Segments                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ▲                                     │
│                            │ Pinia                             │
│                            ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         API Services & HTTP Client (Axios)               │   │
│  │  ┌─────────────────────────────────────────────────┐     │   │
│  │  │ Authentication │ Error Handling │ Interceptors│     │   │
│  │  └─────────────────────────────────────────────────┘     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ▲                                     │
│                            │ HTTP/REST                         │
│                            ▼                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│              MIDAZ API GATEWAY (MICROSERVICES)                   │
│                                                                   │
│  ┌──────────────────────────┐    ┌──────────────────────────┐  │
│  │  Onboarding Service      │    │  Transaction Service     │  │
│  │  (Port 3000)             │    │  (Port 3001)             │  │
│  │                          │    │                          │  │
│  │ • Organizations          │    │ • Transactions (JSON)    │  │
│  │ • Ledgers                │    │ • Inflow/Outflow         │  │
│  │ • Assets                 │    │ • Operations             │  │
│  │ • Accounts               │    │ • Balances               │  │
│  │ • Portfolios             │    │ • Asset Rates            │  │
│  │ • Segments               │    │ • Exchange Rates         │  │
│  │ • Operation Routes       │    │                          │  │
│  │ • Transaction Routes     │    │                          │  │
│  │                          │    │                          │  │
│  └──────────────────────────┘    └──────────────────────────┘  │
│           ▲                                      ▲               │
│           │ REST/OpenAPI                        │ REST/OpenAPI  │
│           │                                     │               │
│  ┌────────┴─────────────────────────────────────┴────────────┐  │
│  │         Midaz Ledger System (Go)                          │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • Double-Entry Accounting Engine                         │  │
│  │ • CQRS Pattern Implementation                            │  │
│  │ • Event-Driven Architecture (RabbitMQ)                   │  │
│  │ • Optimistic Concurrency Control                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│           ▲                                                      │
│           │ SQL/NoSQL                                          │
│           ▼                                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Data Layer                                    │ │
│  │  PostgreSQL          MongoDB          Redis       RabbitMQ│ │
│  │  (Primary Data)      (Metadata)       (Cache)     (Queue)  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Navigation & Module Hierarchy

```
DASHBOARD
│
├─ ONBOARDING
│  │
│  ├─ Organizations
│  │  ├─ List (Search, Filter, Pagination)
│  │  ├─ Create
│  │  ├─ Edit
│  │  ├─ View Details
│  │  │  └─ Related Ledgers
│  │  └─ Delete
│  │
│  ├─ Ledgers (Per Organization)
│  │  ├─ List
│  │  ├─ Create
│  │  ├─ Edit
│  │  ├─ View Details
│  │  │  ├─ Assets Tab
│  │  │  ├─ Accounts Tab
│  │  │  ├─ Portfolios Tab
│  │  │  └─ Segments Tab
│  │  └─ Delete
│  │
│  ├─ Assets (Ledger Scoped)
│  │  ├─ List (Embedded in Ledger)
│  │  ├─ Create
│  │  ├─ Edit
│  │  ├─ View Details
│  │  └─ Delete
│  │
│  ├─ Accounts (Ledger Scoped)
│  │  ├─ List (Advanced Filters, Search, Sort)
│  │  ├─ Create (With Hierarchy)
│  │  ├─ Edit
│  │  ├─ View Details
│  │  │  ├─ Balance Summary
│  │  │  ├─ Balances Tab
│  │  │  ├─ Operations Tab
│  │  │  ├─ Transaction History
│  │  │  └─ Metadata
│  │  └─ Delete
│  │
│  ├─ Portfolios (Ledger Scoped)
│  │  ├─ List
│  │  ├─ Create
│  │  ├─ Edit
│  │  ├─ View Details
│  │  └─ Delete
│  │
│  ├─ Segments (Ledger Scoped)
│  │  ├─ List (Hierarchical)
│  │  ├─ Create (With Parent Support)
│  │  ├─ Edit
│  │  ├─ View Details
│  │  └─ Delete
│  │
│  ├─ Operation Routes (Ledger Scoped)
│  │  ├─ List
│  │  ├─ Create (Account Mapping)
│  │  ├─ Edit
│  │  ├─ View Details
│  │  └─ Delete
│  │
│  └─ Transaction Routes (Ledger Scoped)
│     ├─ List
│     ├─ Create
│     ├─ Edit
│     ├─ View Details
│     └─ Delete
│
├─ TRANSACTIONS
│  │
│  ├─ Create Transaction
│  │  ├─ JSON Format
│  │  │  ├─ Editor
│  │  │  ├─ Validation
│  │  │  ├─ Preview
│  │  │  ├─ Dry-Run
│  │  │  └─ Template Library
│  │  │
│  │  ├─ Inflow Format
│  │  │  ├─ Simple Form
│  │  │  ├─ Account Selector
│  │  │  ├─ Amount Input
│  │  │  └─ Quick Submit
│  │  │
│  │  └─ Outflow Format
│  │     ├─ Simple Form
│  │     ├─ Balance Validation
│  │     ├─ Amount Input
│  │     └─ Confirmation
│  │
│  ├─ Transaction List
│  │  ├─ Advanced Search
│  │  ├─ Date Range Filter
│  │  ├─ Amount Filter
│  │  ├─ Status Filter
│  │  ├─ Sorting
│  │  └─ Pagination
│  │
│  ├─ Transaction Details
│  │  ├─ Summary Widget
│  │  ├─ Operations Tab
│  │  ├─ Balances Tab
│  │  ├─ Metadata Tab
│  │  └─ Timeline Tab
│  │
│  ├─ Operations
│  │  ├─ Account Operations List
│  │  ├─ Operation Details
│  │  └─ Operation Metadata
│  │
│  ├─ Balances
│  │  ├─ Account Balances
│  │  ├─ Global Balances
│  │  ├─ Balance Details
│  │  ├─ Balance Chart
│  │  └─ Balance Management
│  │
│  └─ Asset Rates
│     ├─ List
│     ├─ Create
│     ├─ Edit
│     ├─ Delete
│     ├─ History View
│     ├─ Trend Chart
│     └─ Bulk Upload
│
├─ CONFIGURATION
│  ├─ Users & Roles
│  ├─ Audit Logs
│  └─ Settings
│
└─ ANALYTICS
   ├─ Dashboard
   ├─ Reports
   └─ Metrics
```

---

## 3. Data Flow - Creating an Organization

```
┌─────────────────┐
│  User Creates   │
│  Organization   │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ CreateOrganization Page              │
│ (Route: /onboarding/organizations/   │
│  create)                             │
│                                      │
│ OrganizationForm.vue                 │
│ - Input fields                       │
│ - Validation (Zod)                   │
│ - Error display                      │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ User Submits Form                    │
│ - Form validation                    │
│ - Show loading spinner               │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ OrganizationsStore (Pinia)           │
│                                      │
│ create(payload)                      │
│ - Set loading = true                 │
│ - Call API service                   │
│ - Update items array                 │
│ - Set loading = false                │
│ - Return created object              │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ organizationsService.create()        │
│                                      │
│ POST /v1/organizations               │
│ Payload: {name, code, ...}           │
│ Headers: Auth token                  │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Axios HTTP Client                    │
│                                      │
│ Request Interceptor:                 │
│ - Add Bearer token                   │
│ - Set content-type                   │
│                                      │
│ Response Interceptor:                │
│ - Check status code                  │
│ - Handle errors                      │
│ - Return response                    │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Onboarding API Service               │
│ (Port: 3000)                         │
│                                      │
│ POST /v1/organizations               │
│ - Validate input                     │
│ - Check authorization                │
│ - Create organization                │
│ - Return created object              │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Database (PostgreSQL)                │
│                                      │
│ INSERT INTO organizations            │
│ VALUES (id, name, code, ...)         │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Response (201 Created)               │
│                                      │
│ {                                    │
│   id: "uuid",                        │
│   name: "Org Name",                  │
│   code: "ORG",                       │
│   createdAt: "2025-10-21T..."        │
│ }                                    │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Store Update                         │
│                                      │
│ - items.push(response)               │
│ - Set selectedId                     │
│ - Show success toast                 │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Router Navigation                    │
│                                      │
│ Navigate to:                         │
│ /onboarding/organizations/{id}       │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ OrganizationDetail Page              │
│                                      │
│ - Show organization info             │
│ - Related ledgers                    │
│ - Action buttons                     │
└──────────────────────────────────────┘
```

---

## 4. Component Hierarchy - Account Module

```
AccountsList.vue (Page)
│
├─ AccountsTable.vue (Feature)
│  │
│  ├─ Table.vue (Base UI)
│  │  ├─ TableHeader
│  │  ├─ TableBody
│  │  │  ├─ TableRow
│  │  │  │  ├─ Checkbox.vue (Base UI)
│  │  │  │  ├─ Badge.vue (Base UI) - Status
│  │  │  │  ├─ Link - Navigate
│  │  │  │  └─ AccountActions.vue (Feature)
│  │  │  │     └─ Dropdown.vue (Base UI)
│  │  │  │        ├─ Edit
│  │  │  │        ├─ Delete
│  │  │  │        └─ Copy ID
│  │  │  └─ ...more rows
│  │  └─ TableFooter
│  │
│  └─ Pagination.vue (Base UI)
│     ├─ Button (Previous)
│     ├─ Button (Next)
│     └─ LimitSelector
│
├─ SearchInput.vue (Base UI)
│  ├─ Input.vue (Base UI)
│  └─ Spinner.vue (Base UI) - Loading
│
├─ FilterBar.vue (Base UI)
│  ├─ Select (Status)
│  ├─ Select (Type)
│  ├─ Select (Asset)
│  └─ Button (Clear Filters)
│
├─ Button.vue (Create Account)
│  └─ Modal.vue (Base UI)
│     └─ CreateAccount.vue (Feature)
│        └─ AccountForm.vue (Feature)
│
├─ BalanceSummaryWidget.vue (Feature) - Optional
│  ├─ Card.vue (Base UI)
│  ├─ Stat (Total)
│  ├─ Stat (Active Accounts)
│  └─ Stat (Total Balance)
│
└─ EmptyState.vue (Base UI)
   └─ Button (Create First Account)

AccountDetail.vue (Page)
│
├─ AccountInfo.vue (Feature)
│  └─ Card.vue (Base UI)
│     ├─ Field Display
│     ├─ Status Badge
│     └─ Edit Button
│
├─ BalanceSummaryWidget.vue (Feature)
│  ├─ Card.vue
│  ├─ CurrentBalance
│  ├─ Available
│  ├─ OnHold
│  └─ Refresh Button
│
├─ Tabs.vue (Base UI)
│  │
│  ├─ Tab: Balances
│  │  └─ BalancesList.vue (Feature)
│  │     ├─ BalancesTable.vue
│  │     ├─ Pagination
│  │     └─ Actions
│  │
│  ├─ Tab: Operations
│  │  └─ OperationsList.vue (Feature)
│  │     ├─ OperationsTable.vue
│  │     ├─ Filters
│  │     └─ Detail Modal
│  │
│  ├─ Tab: Transactions
│  │  └─ TransactionHistory.vue (Feature)
│  │     └─ TransactionsTable.vue
│  │
│  ├─ Tab: Metadata
│  │  └─ MetadataViewer.vue (Feature)
│  │     └─ JSONViewer (Base UI)
│  │
│  └─ Tab: Audit
│     └─ AuditTrail.vue (Feature)
│        └─ Timeline.vue (Base UI)
│
└─ EditAccount.vue (Modal)
   └─ AccountForm.vue (Feature)
      ├─ Input.vue (Base UI)
      ├─ Select.vue (Base UI)
      ├─ TextArea.vue (Base UI)
      └─ Button.vue (Base UI)
```

---

## 5. State Management Flow (Pinia)

```
┌─────────────────────────────────┐
│    Vue Component (Script)        │
│                                 │
│ const store = useOrganizations()│
│ const { items, loading } =      │
│   storeToRefs(store)            │
│                                 │
│ const handleCreate = () =>      │
│   store.create(data)            │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│         Pinia Store                         │
│    (stores/organizations.ts)                │
│                                             │
│ State:                                      │
│ - items: Organization[] = []                │
│ - selectedId: string | null = null          │
│ - loading: boolean = false                  │
│ - error: string | null = null               │
│ - pagination: {limit, offset, total}        │
│                                             │
│ Getters:                                    │
│ - selected: Organization | undefined        │
│ - isEmpty: boolean                          │
│ - filteredByStatus: Organization[]          │
│                                             │
│ Actions:                                    │
│ - fetch(params)                             │
│ - create(payload)                           │
│ - update(id, payload)                       │
│ - remove(id)                                │
│ - select(id)                                │
│ - setError(error)                           │
│ - clearError()                              │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│      API Service Call                       │
│   (api/services/organizations.ts)           │
│                                             │
│ organizationsService.create(payload)        │
│ - Uses Axios client                         │
│ - Handles HTTP request                      │
│ - Returns Promise<Organization>             │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│        Axios HTTP Client                    │
│    (api/client.ts)                          │
│                                             │
│ Request:                                    │
│ - Add auth headers                          │
│ - Set content-type                          │
│ - Serialize payload                         │
│                                             │
│ Response:                                   │
│ - Check status                              │
│ - Extract data                              │
│ - Handle errors                             │
│                                             │
│ Interceptors:                               │
│ - Auth token injection                      │
│ - Error handling & redirect                 │
│ - Response transformation                   │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│      Backend API Service                    │
│    (Midaz Onboarding Service)               │
│                                             │
│ POST /v1/organizations                      │
│ - Validate input                            │
│ - Check authorization                       │
│ - Create organization                       │
│ - Persist to database                       │
│ - Return 201 + Organization                 │
└────────┬────────────────────────────────────┘
         │
         ▼
         Response flows back through layers
         │
         ▼
┌─────────────────────────────────────────────┐
│       Store State Update                    │
│                                             │
│ items.push(response.data)                   │
│ selectedId = response.data.id                │
│ loading = false                             │
│ error = null                                │
│                                             │
│ Emits: StoreUpdate Event                    │
└────────┬────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│   Vue Component Re-renders                  │
│                                             │
│ Template reactively updates:                │
│ - items array in table                      │
│ - loading spinner hidden                    │
│ - Show success notification                 │
│ - Navigate to detail page                   │
└─────────────────────────────────────────────┘
```

---

## 6. Transaction Creation Flow (JSON Format)

```
User Opens Create Transaction Page
│
├─ Select Format: JSON
│
▼
┌──────────────────────────────────┐
│  CreateTransactionJSON.vue       │
│                                  │
│  - JSON Editor Panel             │
│  - Schema Validator              │
│  - Preview Panel                 │
│  - Action Buttons                │
└──────────┬───────────────────────┘
           │
           ▼
User Enters JSON Payload (or loads template)
│
├─ Example Payload:
│  {
│    "idempotencyKey": "unique-key",
│    "operations": [
│      {
│        "accountId": "acc-1",
│        "amount": "100.00",
│        "type": "DEBIT",
│        "description": "Payment"
│      },
│      {
│        "accountId": "acc-2",
│        "amount": "100.00",
│        "type": "CREDIT",
│        "description": "Receipt"
│      }
│    ]
│  }
│
▼
┌──────────────────────────────────┐
│  Click "Validate" Button         │
│                                  │
│  - Parse JSON                    │
│  - Validate schema               │
│  - Check totals balance (D=C)    │
│  - Verify account IDs exist      │
└──────────┬───────────────────────┘
           │
           ▼ (If errors)
        Show Errors
           │
           ▼ (If valid)
┌──────────────────────────────────┐
│  Click "Preview" Button          │
│                                  │
│  Show Transaction Preview:       │
│  - From Account → To Account     │
│  - Amount with currency          │
│  - Total operations              │
│  - Balance impact                │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Click "Dry Run" Button (Opt.)   │
│                                  │
│  POST to /dry-run endpoint       │
│  - Same payload                  │
│  - Returns validation result     │
│  - No data persisted             │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Click "Submit" Button           │
│                                  │
│  transactionsService.create()    │
│  POST /v1/.../transactions/json  │
│  - Send payload                  │
│  - Show loading spinner          │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Backend Processing              │
│                                  │
│  - Double-entry verification     │
│  - Balance validation            │
│  - Pessimistic locking           │
│  - Create transaction record     │
│  - Create operation records      │
│  - Update balances               │
│  - Emit transaction.created      │
│  - Return 201 + Transaction      │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Response Handler                │
│                                  │
│  - Extract transactionId         │
│  - Update store                  │
│  - Show success toast            │
│  - Navigate to details page      │
│  - Display transaction summary   │
└──────────────────────────────────┘
```

---

## 7. UI Layout Patterns

### Pattern 1: List with Search & Filters

```
┌────────────────────────────────────────┐
│ PAGE TITLE            [+ Create Button]│
├────────────────────────────────────────┤
│ [Search Input] [Filter Dropdown] [↻]  │
├────────────────────────────────────────┤
│ ┌──────────────────────────────────┐  │
│ │ ┌─ ┐ Column1  Column2  Column3  │ │
│ │ ├─ ┤ Value1   Value2   Value3  │ │
│ │ │ │ ...                        │ │
│ │ └─ ┘                            │ │
│ └──────────────────────────────────┘  │
├────────────────────────────────────────┤
│ Showing 1-10 of 100  [← Page →] Limit ▼│
└────────────────────────────────────────┘
```

### Pattern 2: Detail Page with Tabs

```
┌──────────────────────────────────────────┐
│ [← Back] Title                  [Edit][…]│
├──────────────────────────────────────────┤
│                                          │
│ ┌─ Info Panel ────────────────────────┐ │
│ │ Name: Value                         │ │
│ │ Code: Value                         │ │
│ │ Status: Badge                       │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ┌─ Tab Navigation ──────────────────────┐│
│ │ [Info] [Details] [History] [Metadata]││
│ ├────────────────────────────────────────┤
│ │ Tab Content Here...                    │
│ │                                        │
│ │ [Details Table/Form/List]              │
│ │                                        │
│ └────────────────────────────────────────┘
│                                          │
└──────────────────────────────────────────┘
```

### Pattern 3: Form Modal

```
┌──────────────────────────────────────┐
│ Create Organization             [✕]  │
├──────────────────────────────────────┤
│                                      │
│ [Name Field]                         │
│ Label                                │
│ <input placeholder="..."/>           │
│ [Error message if any]               │
│                                      │
│ [Code Field]                         │
│ Label                                │
│ <input placeholder="..."/>           │
│                                      │
│ [Description Field]                  │
│ Label                                │
│ <textarea>...</textarea>              │
│                                      │
│ [JSON Editor] (Optional)             │
│ {metadata object}                    │
│                                      │
├──────────────────────────────────────┤
│ [Cancel Button] [Submit Button]      │
└──────────────────────────────────────┘
```

---

## 8. Color & Status Scheme

### Status Badges

```
ACTIVE      → Green (#10B981)    ✓
INACTIVE    → Gray (#6B7280)     ○
PENDING     → Yellow (#F59E0B)   ⧖
FAILED      → Red (#EF4444)      ✗
SUCCESS     → Green (#10B981)    ✓
WARNING     → Orange (#F97316)   ⚠
INFO        → Blue (#3B82F6)     ℹ
ERROR       → Red (#DC2626)      ✘
```

### Action Buttons

```
Primary     → Blue (#3B82F6)     Create, Save, Submit
Secondary   → Gray (#D1D5DB)     Cancel, Reset
Danger      → Red (#EF4444)      Delete, Remove
Success     → Green (#10B981)    Confirm, Save
```

---

## 9. API Response Structure

### Success Response (200/201)

```json
{
  "status": "success",
  "code": 200,
  "data": {
    "id": "uuid",
    "name": "Organization Name",
    "createdAt": "2025-10-21T09:13:30Z",
    ...
  },
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 100
  }
}
```

### List Response (200)

```json
{
  "status": "success",
  "code": 200,
  "data": [
    { "id": "1", "name": "Item 1" },
    { "id": "2", "name": "Item 2" }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 2
  }
}
```

### Error Response (4xx/5xx)

```json
{
  "status": "error",
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

---

## 10. Responsive Breakpoints

```
Mobile     < 640px    (sm)   - Single column, stack
Tablet     640-1024px (md)   - 2 columns, responsive
Desktop    > 1024px   (lg+)  - Full layout, all features

Key Responsive Decisions:
├─ Tables: Hide non-essential columns on mobile
├─ Sidebar: Collapse to icon on tablet
├─ Modals: Full screen on mobile
├─ Forms: Single column on mobile, multi-column on desktop
└─ Navigation: Hamburger menu on mobile
```

---

**End of Visual Guide**
