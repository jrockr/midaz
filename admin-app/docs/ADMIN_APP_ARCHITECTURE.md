# Midaz Admin App - Comprehensive Architecture & Implementation Plan

**Project Type**: Enterprise Fintech Admin Dashboard  
**Frontend Framework**: Vue.js 3 (TypeScript)  
**Architecture Pattern**: Modern Fintech Ops Dashboard  
**UI Library**: Headless UI/Tailwind CSS (Enterprise)  
**State Management**: Pinia  
**API Integration**: Axios/Fetch  
**Build Tool**: Vite  
**Testing**: Vitest + Playwright

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Layout](#architecture--layout)
3. [Onboarding Module](#onboarding-module)
4. [Transactions Module](#transactions-module)
5. [Implementation Roadmap](#implementation-roadmap)
6. [Technical Stack](#technical-stack)

---

## Project Overview

### Core Objectives

The Admin App is a comprehensive management system for the Midaz Ledger platform with two main categories:

#### 1. **Onboarding** - Entity Management (CRUDL Operations)
- Organizations
- Ledgers
- Assets
- Accounts
- Portfolios
- Segments
- Operation Routes

#### 2. **Transactions** - Financial Operations
- Transaction Creation (JSON, Inflow, Outflow)
- Transaction Details & Lookup
- Balance Management
- Operations Tracking
- Asset Rate Management

---

## Architecture & Layout

### Modern Fintech Ops Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  MIDAZ ADMIN CONSOLE                        [ Settings ] [User]│
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─ Sidebar (Collapsible) ─┐  ┌──── Main Content Area ───┐  │
│  │                         │  │                          │  │
│  │ • Dashboard             │  │  Active Section          │  │
│  │                         │  │                          │  │
│  │ ONBOARDING              │  │ ┌──────────────────────┐ │  │
│  │ ├─ Organizations        │  │ │ Breadcrumb           │ │  │
│  │ ├─ Ledgers              │  │ │ Action Buttons       │ │  │
│  │ ├─ Assets               │  │ │ ──────────────────   │ │  │
│  │ ├─ Accounts             │  │ │ Data Table/Grid      │ │  │
│  │ ├─ Portfolios           │  │ │ Search & Filters     │ │  │
│  │ ├─ Segments             │  │ │ Pagination           │ │  │
│  │ └─ Operation Routes     │  │ │                      │ │  │
│  │                         │  │ │ [Create] [Edit] ...  │ │  │
│  │ TRANSACTIONS            │  │ └──────────────────────┘ │  │
│  │ ├─ Create Transaction   │  │                          │  │
│  │ ├─ Transaction List     │  │  Quick Stats Panel       │  │
│  │ ├─ Operation Routes     │  │  ┌──────────────┐       │  │
│  │ ├─ Balances             │  │  │ Total: $X    │       │  │
│  │ └─ Reports              │  │  │ Count: Y     │       │  │
│  │                         │  │  └──────────────┘       │  │
│  │ CONFIGURATION           │  │                          │  │
│  │ ├─ Users & Roles        │  │                          │  │
│  │ ├─ Audit Logs           │  │                          │  │
│  │ └─ Settings             │  │                          │  │
│  │                         │  │                          │  │
│  └─────────────────────────┘  └──────────────────────────┘  │
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Onboarding Module

### 1. Organizations Management

#### 1.1 Organizations List Screen
**Route**: `/onboarding/organizations`  
**Component**: `OrganizationsList.vue`

**Features**:
- Table view with sorting & filtering
- Search by name/code
- Status indicators (Active/Inactive)
- Create/Edit/View/Delete actions
- Bulk operations
- Export to CSV

**Columns**:
| Field | Type | Format |
|-------|------|--------|
| ID | UUID | `uuid` |
| Name | String | `text` |
| Code | String | `code` |
| Status | Enum | Badge |
| Created At | DateTime | `ISO 8601` |
| Updated At | DateTime | `ISO 8601` |
| Actions | - | Buttons |

**Tasks**:
- [ ] Build responsive data table component
- [ ] Implement search & filter logic
- [ ] Add pagination (limit, offset)
- [ ] Create inline editing
- [ ] Add export functionality
- [ ] Implement loading states
- [ ] Error handling & validation

#### 1.2 Organizations Create/Edit Modal
**Component**: `OrganizationForm.vue`

**Fields**:
```json
{
  "name": "string (required)",
  "code": "string (unique, optional)",
  "description": "string",
  "metadata": "JSON object",
  "parentId": "uuid (optional)"
}
```

**Tasks**:
- [ ] Build form with validation
- [ ] Implement parent organization lookup
- [ ] Add metadata JSON editor
- [ ] Create auto-save draft
- [ ] Implement error notifications
- [ ] Add field-level validation feedback

#### 1.3 Organizations Detail View
**Route**: `/onboarding/organizations/:id`  
**Component**: `OrganizationDetail.vue`

**Sections**:
- Basic Information
- Related Ledgers (count)
- Metadata
- Audit Trail
- Action Buttons

**Tasks**:
- [ ] Fetch organization data by ID
- [ ] Display related resources count
- [ ] Show metadata in formatted view
- [ ] Implement audit log view
- [ ] Add quick action buttons

---

### 2. Ledgers Management

#### 2.1 Ledgers List Screen
**Route**: `/onboarding/organizations/:organizationId/ledgers`  
**Component**: `LedgersList.vue`

**Features**:
- Table with parent organization context
- Filter by organization
- Search by name
- Status indicators
- Quick access to related entities count

**Columns**:
| Field | Type | Format |
|-------|------|--------|
| ID | UUID | `uuid` |
| Name | String | `text` |
| Organization | String | Link |
| Currency | String | Code |
| Status | Enum | Badge |
| Assets | Number | Count |
| Accounts | Number | Count |
| Transactions | Number | Count |
| Created At | DateTime | `ISO 8601` |
| Actions | - | Buttons |

**Tasks**:
- [ ] Build hierarchical table view
- [ ] Implement context-aware filtering
- [ ] Add metrics display (counts)
- [ ] Create navigation to child resources
- [ ] Build bulk operations menu
- [ ] Add import/export ledger config

#### 2.2 Ledgers Create/Edit Form
**Component**: `LedgerForm.vue`

**Fields**:
```json
{
  "organizationId": "uuid (required)",
  "name": "string (required)",
  "code": "string (unique)",
  "description": "string",
  "status": "enum: ACTIVE|INACTIVE",
  "metadata": "JSON object"
}
```

**Tasks**:
- [ ] Build hierarchical form with org selector
- [ ] Implement form validation
- [ ] Add metadata editor
- [ ] Create draft auto-save
- [ ] Add parent organization context display

#### 2.3 Ledgers Detail View
**Route**: `/onboarding/organizations/:organizationId/ledgers/:ledgerId`  
**Component**: `LedgerDetail.vue`

**Sections**:
- Basic Information
- Quick Stats (Assets, Accounts, Portfolios, Segments)
- Assets Tab (with CRUDL)
- Accounts Tab (with CRUDL)
- Portfolios Tab (with CRUDL)
- Segments Tab (with CRUDL)

**Tasks**:
- [ ] Create tabbed interface
- [ ] Fetch ledger details
- [ ] Display real-time metrics
- [ ] Implement nested resource management
- [ ] Add quick-add buttons for each tab

---

### 3. Assets Management

#### 3.1 Assets List (In Ledger Context)
**Component**: `AssetsList.vue` (Embedded in Ledger Detail)

**Features**:
- Inline table view
- Quick add/edit/delete
- Filter by status
- Asset usage indicators

**Columns**:
| Field | Type | Format |
|-------|------|--------|
| ID | UUID | `uuid` |
| Name | String | `text` |
| Code | String | `CURRENCY_CODE` |
| Type | String | Type |
| Status | Enum | Badge |
| Decimals | Number | `int` |
| Usage | Number | Count |
| Created At | DateTime | `ISO 8601` |
| Actions | - | Buttons |

**Tasks**:
- [ ] Build embedded table component
- [ ] Implement inline create/edit
- [ ] Add asset code validation
- [ ] Create asset duplication check
- [ ] Add type selector dropdown

#### 3.2 Assets Create/Edit Form
**Component**: `AssetForm.vue`

**Fields**:
```json
{
  "ledgerId": "uuid (required)",
  "name": "string (required)",
  "code": "string (required, unique per ledger)",
  "type": "string (CURRENCY|COMMODITY|etc)",
  "decimals": "number (0-8)",
  "status": "enum: ACTIVE|INACTIVE",
  "metadata": "JSON object"
}
```

**Tasks**:
- [ ] Build asset creation form
- [ ] Implement code format validation (ISO 4217 for currencies)
- [ ] Add decimal places selector
- [ ] Create asset type dropdown
- [ ] Implement duplicate detection
- [ ] Add metadata editor

#### 3.3 Asset Detail View
**Component**: `AssetDetail.vue`

**Sections**:
- Asset Information
- Exchange Rates (if applicable)
- Account Usage
- Metadata

**Tasks**:
- [ ] Display asset details
- [ ] Show related accounts
- [ ] Display exchange rate history
- [ ] Add edit/delete actions

---

### 4. Accounts Management

#### 4.1 Accounts List Screen
**Route**: `/onboarding/organizations/:organizationId/ledgers/:ledgerId/accounts`  
**Component**: `AccountsList.vue`

**Features**:
- Advanced filtering (status, type, asset, balance)
- Search by name/alias/account number
- Sorting by balance, creation date
- Balance display
- Account type indicators

**Columns**:
| Field | Type | Format |
|-------|------|--------|
| ID | UUID | `uuid` |
| Alias | String | Unique identifier |
| Name | String | `text` |
| Type | String | Badge |
| Asset | String | Code |
| Status | Enum | Badge |
| Balance | Decimal | Currency format |
| Available | Decimal | Currency format |
| On Hold | Decimal | Currency format |
| Created At | DateTime | `ISO 8601` |
| Actions | - | Buttons |

**Tasks**:
- [ ] Build advanced table with multi-column filtering
- [ ] Implement real-time balance display
- [ ] Add account type selector filter
- [ ] Create balance trend indicator
- [ ] Implement account status badges
- [ ] Add bulk operation menu (enable/disable)

#### 4.2 Accounts Create/Edit Form
**Component**: `AccountForm.vue`

**Fields**:
```json
{
  "ledgerId": "uuid (required)",
  "portfolioId": "uuid (optional)",
  "segmentId": "uuid (optional)",
  "alias": "string (required, unique)",
  "accountName": "string (required)",
  "accountNumber": "string (optional)",
  "type": "string (enum: ASSET|LIABILITY|EQUITY)",
  "asset": "uuid (required)",
  "status": "enum: ACTIVE|INACTIVE",
  "externalCode": "string (optional)",
  "metadata": "JSON object"
}
```

**Tasks**:
- [ ] Build hierarchical account creation form
- [ ] Implement asset selector with currency
- [ ] Add portfolio/segment selector
- [ ] Implement alias uniqueness validation
- [ ] Create account type selector
- [ ] Add metadata editor
- [ ] Implement draft auto-save

#### 4.3 Account Detail View
**Route**: `/onboarding/organizations/:organizationId/ledgers/:ledgerId/accounts/:accountId`  
**Component**: `AccountDetail.vue`

**Sections**:
- Account Information Panel
- Balance Summary Widget
  - Current Balance
  - Available Balance
  - On Hold Amount
- Balances Tab (CRUDL)
- Operations Tab (View Only - Linked)
- Transaction History
- Metadata
- Audit Trail

**Tasks**:
- [ ] Create account detail layout
- [ ] Implement balance widgets
- [ ] Build balances management tab
- [ ] Create operations view tab
- [ ] Implement transaction history table
- [ ] Add balance trend chart
- [ ] Create audit log section

#### 4.4 Account-by-Alias Lookup
**Component**: `AccountAliasLookup.vue`

**Features**:
- Auto-complete search by alias
- Quick view account details
- Direct navigation to account

**Tasks**:
- [ ] Implement async search component
- [ ] Create account preview dropdown
- [ ] Add keyboard navigation
- [ ] Implement quick view modal

---

### 5. Portfolios Management

#### 5.1 Portfolios List Screen
**Route**: `/onboarding/organizations/:organizationId/ledgers/:ledgerId/portfolios`  
**Component**: `PortfoliosList.vue`

**Features**:
- Portfolio overview
- Account count per portfolio
- Status indicators
- Create/Edit/View/Delete

**Columns**:
| Field | Type | Format |
|-------|------|--------|
| ID | UUID | `uuid` |
| Name | String | `text` |
| Code | String | `code` |
| Description | String | `text` |
| Accounts | Number | Count |
| Status | Enum | Badge |
| Created At | DateTime | `ISO 8601` |
| Actions | - | Buttons |

**Tasks**:
- [ ] Build portfolio list table
- [ ] Implement account count display
- [ ] Add portfolio creation button
- [ ] Create inline editing capability
- [ ] Add bulk operations

#### 5.2 Portfolios Create/Edit Form
**Component**: `PortfolioForm.vue`

**Fields**:
```json
{
  "ledgerId": "uuid (required)",
  "name": "string (required)",
  "code": "string (unique per ledger)",
  "description": "string",
  "status": "enum: ACTIVE|INACTIVE",
  "metadata": "JSON object"
}
```

**Tasks**:
- [ ] Build form validation
- [ ] Implement metadata editor
- [ ] Add status selector
- [ ] Create form submission handler

#### 5.3 Portfolio Detail View
**Component**: `PortfolioDetail.vue`

**Sections**:
- Portfolio Information
- Linked Accounts Table
- Metadata
- Statistics

**Tasks**:
- [ ] Display portfolio details
- [ ] Show linked accounts
- [ ] Add account linking UI
- [ ] Implement metadata display

---

### 6. Segments Management

#### 6.1 Segments List Screen
**Route**: `/onboarding/organizations/:organizationId/ledgers/:ledgerId/segments`  
**Component**: `SegmentsList.vue`

**Features**:
- Segment overview
- Account count per segment
- Hierarchical segments (if parent-child supported)
- Create/Edit/View/Delete

**Columns**:
| Field | Type | Format |
|-------|------|--------|
| ID | UUID | `uuid` |
| Name | String | `text` |
| Code | String | `code` |
| Parent | String | Link (if applicable) |
| Accounts | Number | Count |
| Status | Enum | Badge |
| Created At | DateTime | `ISO 8601` |
| Actions | - | Buttons |

**Tasks**:
- [ ] Build segment list table
- [ ] Implement hierarchical display (indentation)
- [ ] Add account count display
- [ ] Create segment creation button
- [ ] Add parent segment selector

#### 6.2 Segments Create/Edit Form
**Component**: `SegmentForm.vue`

**Fields**:
```json
{
  "ledgerId": "uuid (required)",
  "name": "string (required)",
  "code": "string (unique per ledger)",
  "parentId": "uuid (optional)",
  "description": "string",
  "status": "enum: ACTIVE|INACTIVE",
  "metadata": "JSON object"
}
```

**Tasks**:
- [ ] Build form with parent selector
- [ ] Implement form validation
- [ ] Add hierarchical parent lookup
- [ ] Create metadata editor
- [ ] Implement circular dependency prevention

#### 6.3 Segment Detail View
**Component**: `SegmentDetail.vue`

**Sections**:
- Segment Information
- Child Segments (if applicable)
- Linked Accounts
- Metadata

**Tasks**:
- [ ] Display segment hierarchy
- [ ] Show child segments
- [ ] List linked accounts
- [ ] Add segment linking UI

---

### 7. Operation Routes Management

#### 7.1 Operation Routes List Screen
**Route**: `/onboarding/organizations/:organizationId/ledgers/:ledgerId/operation-routes`  
**Component**: `OperationRoutesList.vue`

**Features**:
- Route configuration overview
- Source/Destination account mapping
- Status indicators
- Create/Edit/View/Delete

**Columns**:
| Field | Type | Format |
|-------|------|--------|
| ID | UUID | `uuid` |
| Name | String | `text` |
| Source Account | String | Alias |
| Destination Account | String | Alias |
| Route Type | String | Type |
| Status | Enum | Badge |
| Created At | DateTime | `ISO 8601` |
| Actions | - | Buttons |

**Tasks**:
- [ ] Build operation routes table
- [ ] Implement account alias resolution
- [ ] Add route type display
- [ ] Create route creation flow
- [ ] Add bulk operations

#### 7.2 Operation Routes Create/Edit Form
**Component**: `OperationRouteForm.vue`

**Fields**:
```json
{
  "ledgerId": "uuid (required)",
  "name": "string (required)",
  "sourceAccountId": "uuid (required)",
  "destinationAccountId": "uuid (required)",
  "routeType": "string (enum: TRANSFER|PAYMENT|etc)",
  "description": "string",
  "status": "enum: ACTIVE|INACTIVE",
  "metadata": "JSON object"
}
```

**Tasks**:
- [ ] Build form with account selectors
- [ ] Implement account validation
- [ ] Add route type selector
- [ ] Create circular route prevention
- [ ] Add metadata editor

#### 7.3 Operation Route Detail View
**Component**: `OperationRouteDetail.vue`

**Sections**:
- Route Information
- Source/Destination Details
- Route Configuration
- Usage Statistics
- Metadata

**Tasks**:
- [ ] Display route details
- [ ] Show linked account information
- [ ] Display route usage stats
- [ ] Add edit/delete actions

---

### 8. Transaction Routes Management

#### 8.1 Transaction Routes List Screen
**Route**: `/onboarding/organizations/:organizationId/ledgers/:ledgerId/transaction-routes`  
**Component**: `TransactionRoutesList.vue`

**Features**:
- Transaction route configuration
- Account mapping display
- Status indicators
- Create/Edit/View/Delete

**Columns**:
| Field | Type | Format |
|-------|------|--------|
| ID | UUID | `uuid` |
| Name | String | `text` |
| Source Account | String | Alias |
| Destination Account | String | Alias |
| Transaction Type | String | Type |
| Status | Enum | Badge |
| Created At | DateTime | `ISO 8601` |
| Actions | - | Buttons |

**Tasks**:
- [ ] Build transaction routes table
- [ ] Implement account alias resolution
- [ ] Add transaction type display
- [ ] Create route creation flow

#### 8.2 Transaction Routes Create/Edit Form
**Component**: `TransactionRouteForm.vue`

**Fields**:
```json
{
  "ledgerId": "uuid (required)",
  "name": "string (required)",
  "sourceAccountId": "uuid (required)",
  "destinationAccountId": "uuid (required)",
  "transactionType": "string (enum: TRANSFER|INFLOW|OUTFLOW)",
  "description": "string",
  "status": "enum: ACTIVE|INACTIVE",
  "metadata": "JSON object"
}
```

**Tasks**:
- [ ] Build form with validation
- [ ] Add transaction type selector
- [ ] Implement account selectors

---

## Transactions Module

### 1. Create Transaction Screen

#### 1.1 JSON Transaction Creation
**Route**: `/transactions/create`  
**Component**: `CreateTransactionJSON.vue`

**Features**:
- JSON editor for complex transactions
- Schema validation
- Preview & confirmation
- Idempotency key generation
- Dry-run testing

**Payload Structure**:
```json
{
  "idempotencyKey": "string (unique)",
  "operations": [
    {
      "operationId": "string",
      "accountId": "uuid",
      "amount": "decimal",
      "type": "enum: DEBIT|CREDIT",
      "description": "string"
    }
  ],
  "description": "string",
  "metadata": "JSON object"
}
```

**Tasks**:
- [ ] Build JSON editor component
- [ ] Implement schema validation
- [ ] Add JSON beautifier/formatter
- [ ] Create payload preview panel
- [ ] Implement dry-run functionality
- [ ] Add error highlighting
- [ ] Create template library

#### 1.2 Inflow Transaction Creation
**Route**: `/transactions/create/inflow`  
**Component**: `CreateInflowTransaction.vue`

**Features**:
- Simplified form for inflow transactions
- Destination account selector
- Amount input with validation
- Currency auto-detect
- Quick submit

**Payload Structure**:
```json
{
  "idempotencyKey": "string",
  "destinationAccountId": "uuid",
  "amount": "decimal",
  "description": "string",
  "metadata": "JSON object"
}
```

**Tasks**:
- [ ] Build form with account selector
- [ ] Implement amount validation
- [ ] Add currency display
- [ ] Create quick submit button
- [ ] Add success notification

#### 1.3 Outflow Transaction Creation
**Route**: `/transactions/create/outflow`  
**Component**: `CreateOutflowTransaction.vue`

**Features**:
- Simplified form for outflow transactions
- Source account selector
- Amount input with balance validation
- Currency auto-detect
- Balance check before submission

**Payload Structure**:
```json
{
  "idempotencyKey": "string",
  "sourceAccountId": "uuid",
  "amount": "decimal",
  "description": "string",
  "metadata": "JSON object"
}
```

**Tasks**:
- [ ] Build form with account selector
- [ ] Implement available balance validation
- [ ] Add balance check warning
- [ ] Create amount input with validation
- [ ] Add confirmation dialog

---

### 2. Transaction Details & Lookup

#### 2.1 Transactions List Screen
**Route**: `/transactions`  
**Component**: `TransactionsList.vue`

**Features**:
- Advanced transaction search
- Filter by status, date range, amount range
- Sort by date, amount, status
- Transaction status indicators
- Quick view details

**Columns**:
| Field | Type | Format |
|-------|------|--------|
| ID | UUID | `uuid` |
| Reference/Alias | String | `text` |
| Status | Enum | Badge |
| Total Amount | Decimal | Currency format |
| Currency | String | Code |
| Operations Count | Number | Count |
| Created At | DateTime | `ISO 8601` |
| Description | String | `text` |
| Actions | - | Buttons |

**Tasks**:
- [ ] Build advanced search table
- [ ] Implement date range picker
- [ ] Add amount range filter
- [ ] Create status filter dropdown
- [ ] Implement transaction search
- [ ] Add sorting capabilities
- [ ] Create pagination

#### 2.2 Transaction Detail View
**Route**: `/transactions/:transactionId`  
**Component**: `TransactionDetail.vue`

**Sections**:
- Transaction Summary Widget
  - ID
  - Status
  - Total Amount
  - Created At
  - Description
- Operations Tab
  - Operations list table
  - Each operation detail (Account, Amount, Type)
- Balances Tab
  - Affected account balances
  - Balance changes display
- Metadata Tab
  - JSON metadata display
- Timeline Tab
  - Transaction lifecycle events
  - Status changes
  - Audit trail

**Tasks**:
- [ ] Create transaction detail layout
- [ ] Build operations table
- [ ] Implement balance display
- [ ] Create metadata viewer
- [ ] Add transaction timeline
- [ ] Implement status badge
- [ ] Add export transaction details

#### 2.3 Transaction Search & Quick View
**Component**: `TransactionSearch.vue`

**Features**:
- Global transaction search
- Search by ID, reference, account
- Quick preview on hover
- Direct navigation

**Tasks**:
- [ ] Build search input component
- [ ] Implement async search
- [ ] Add result dropdown preview
- [ ] Create keyboard shortcuts
- [ ] Add search history

---

### 3. Operations Management

#### 3.1 Operations List (Account-based)
**Route**: `/onboarding/organizations/:organizationId/ledgers/:ledgerId/accounts/:accountId/operations`  
**Component**: `OperationsList.vue`

**Features**:
- Operations for specific account
- Filter by operation type, status
- Sort by date, amount
- Operation details quick view

**Columns**:
| Field | Type | Format |
|-------|------|--------|
| ID | UUID | `uuid` |
| Transaction ID | UUID | Link |
| Type | Enum | Badge (DEBIT/CREDIT) |
| Amount | Decimal | Currency format |
| Balance After | Decimal | Currency format |
| Status | Enum | Badge |
| Created At | DateTime | `ISO 8601` |
| Description | String | `text` |
| Actions | - | Buttons |

**Tasks**:
- [ ] Build operations table
- [ ] Implement type filter (DEBIT/CREDIT)
- [ ] Add date range filter
- [ ] Create operation detail modal
- [ ] Add pagination

#### 3.2 Operation Detail Modal
**Component**: `OperationDetail.vue`

**Sections**:
- Operation Information
- Related Transaction
- Balance Impact
- Metadata

**Tasks**:
- [ ] Build operation detail modal
- [ ] Display related transaction link
- [ ] Show balance changes
- [ ] Add metadata display

#### 3.3 Operations by Transaction
**Component**: `TransactionOperations.vue` (Embedded)

**Sections**:
- Operations table
- Operation status indicators
- Quick links to accounts

**Tasks**:
- [ ] Build embedded operations table
- [ ] Implement account links
- [ ] Add operation type badges

---

### 4. Balances Management

#### 4.1 Balances List (Account-based)
**Route**: `/onboarding/organizations/:organizationId/ledgers/:ledgerId/accounts/:accountId/balances`  
**Component**: `BalancesList.vue`

**Features**:
- Multiple balances per account
- Filter by asset/currency
- Sort by amount
- Balance status indicators
- Create/Update/Delete operations

**Columns**:
| Field | Type | Format |
|-------|------|--------|
| ID | UUID | `uuid` |
| Asset | String | Code |
| Currency | String | Code |
| Balance | Decimal | Currency format |
| Available | Decimal | Currency format |
| On Hold | Decimal | Currency format |
| Status | Enum | Badge |
| Created At | DateTime | `ISO 8601` |
| Updated At | DateTime | `ISO 8601` |
| Actions | - | Buttons |

**Tasks**:
- [ ] Build balances table
- [ ] Implement asset filter
- [ ] Add amount sorting
- [ ] Create balance update modal
- [ ] Implement delete confirmation
- [ ] Add refresh button

#### 4.2 Balance Detail View
**Component**: `BalanceDetail.vue`

**Sections**:
- Balance Information
  - Current Balance
  - Available Balance
  - On Hold Amount
- Balance Transactions (Recent)
- Historical Graph
- Metadata

**Tasks**:
- [ ] Create balance detail layout
- [ ] Implement balance chart
- [ ] Build transaction history table
- [ ] Add metadata display
- [ ] Create balance export

#### 4.3 Balance Update Form
**Component**: `BalanceForm.vue`

**Fields**:
```json
{
  "balanceId": "uuid",
  "balance": "decimal",
  "available": "decimal",
  "onHold": "decimal",
  "metadata": "JSON object"
}
```

**Tasks**:
- [ ] Build form with validation
- [ ] Implement amount calculations
- [ ] Add balance validation (available + onHold <= balance)
- [ ] Create metadata editor
- [ ] Add confirmation dialog

#### 4.4 Balances Global List
**Route**: `/transactions/balances`  
**Component**: `AllBalancesList.vue`

**Features**:
- Global view of all balances
- Filter by ledger, account, asset
- Search functionality
- Balance comparison

**Columns**:
| Field | Type | Format |
|-------|------|--------|
| Account | String | Alias |
| Asset | String | Code |
| Balance | Decimal | Currency format |
| Available | Decimal | Currency format |
| On Hold | Decimal | Currency format |
| Last Updated | DateTime | `ISO 8601` |
| Actions | - | Buttons |

**Tasks**:
- [ ] Build global balances table
- [ ] Implement multi-column filter
- [ ] Add export functionality
- [ ] Create balance trend indicators
- [ ] Implement pagination

---

### 5. Asset Rates Management

#### 5.1 Asset Rates List
**Route**: `/transactions/asset-rates`  
**Component**: `AssetRatesList.vue`

**Features**:
- Exchange rate configuration
- Source/Destination asset pair
- Rate value display
- Effective date tracking
- Create/Update/Delete operations

**Columns**:
| Field | Type | Format |
|-------|------|--------|
| ID | UUID | `uuid` |
| Source Asset | String | Code |
| Destination Asset | String | Code |
| Rate | Decimal | Decimal format |
| Effective Date | DateTime | `ISO 8601` |
| Status | Enum | Badge |
| Created At | DateTime | `ISO 8601` |
| Actions | - | Buttons |

**Tasks**:
- [ ] Build asset rates table
- [ ] Implement asset pair selector
- [ ] Add effective date picker
- [ ] Create rate calculation
- [ ] Add bulk upload CSV
- [ ] Implement rate history

#### 5.2 Asset Rate Form
**Component**: `AssetRateForm.vue`

**Fields**:
```json
{
  "sourceAssetId": "uuid (required)",
  "destinationAssetId": "uuid (required)",
  "rate": "decimal (required)",
  "effectiveDate": "datetime",
  "status": "enum: ACTIVE|INACTIVE",
  "metadata": "JSON object"
}
```

**Tasks**:
- [ ] Build form with asset selectors
- [ ] Implement rate validation
- [ ] Add effective date picker
- [ ] Create metadata editor
- [ ] Add reverse rate calculation

#### 5.3 Asset Rates History
**Component**: `AssetRatesHistory.vue`

**Features**:
- Historical rate tracking
- Rate trend graph
- Export historical data

**Tasks**:
- [ ] Build rate history chart
- [ ] Implement date range filter
- [ ] Add CSV export
- [ ] Create rate trend indicators

---

## Implementation Roadmap

### Phase 1: Foundation & Core Infrastructure (Weeks 1-2)

**Tasks**:
- [ ] Setup Vue.js 3 project with TypeScript
- [ ] Configure Pinia for state management
- [ ] Setup API service layer with Axios
- [ ] Create authentication/authorization middleware
- [ ] Build base layout component
- [ ] Setup error handling & logging
- [ ] Create reusable UI component library

**Deliverables**:
- Project scaffold with folder structure
- Base API service
- Layout & navigation
- Component library (Button, Input, Table, Modal, etc.)

### Phase 2: Onboarding Module - Core CRUDL (Weeks 3-5)

**Tasks**:
- [ ] Organizations CRUDL (List, Create, Edit, View, Delete)
- [ ] Ledgers CRUDL (List, Create, Edit, View, Delete)
- [ ] Assets CRUDL (List, Create, Edit, View, Delete)
- [ ] Accounts CRUDL (List, Create, Edit, View, Delete)

**Deliverables**:
- Complete organization management
- Ledger hierarchy management
- Asset configuration
- Account creation & management

### Phase 3: Onboarding Module - Advanced (Weeks 6-7)

**Tasks**:
- [ ] Portfolios CRUDL
- [ ] Segments CRUDL
- [ ] Operation Routes CRUDL
- [ ] Transaction Routes CRUDL

**Deliverables**:
- Portfolio & Segment management
- Route configuration
- Advanced filtering & search

### Phase 4: Transactions Module (Weeks 8-10)

**Tasks**:
- [ ] Transaction creation (JSON, Inflow, Outflow)
- [ ] Transaction list & details
- [ ] Operations management
- [ ] Balances management
- [ ] Asset rates management

**Deliverables**:
- Complete transaction lifecycle management
- Balance tracking & reporting
- Exchange rate management

### Phase 5: Testing & Optimization (Weeks 11-12)

**Tasks**:
- [ ] Unit tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation

**Deliverables**:
- Test coverage >80%
- Performance optimized
- Security hardened
- Complete documentation

---

## Technical Stack

### Frontend Framework
- **Vue.js 3** with Composition API
- **TypeScript** for type safety
- **Vite** for build tooling

### UI & Styling
- **Tailwind CSS** for utility-first styling
- **Headless UI** for unstyled, accessible components
- **Heroicons** for icons
- **Chart.js** or **Recharts** for data visualization

### State Management
- **Pinia** for reactive state management
- **Auto-import** for composition functions

### API Integration
- **Axios** for HTTP requests
- **Axios interceptors** for auth & error handling
- **OpenAPI/Swagger** client generation

### Form Management
- **VeeValidate** for form validation
- **Zod** or **Yup** for schema validation

### Utilities
- **date-fns** for date formatting
- **decimal.js** for decimal calculations
- **lodash-es** for utility functions
- **axios-mock-adapter** for testing

### Testing
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **Vue Test Utils** for component testing

### Development Tools
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **Storybook** for component documentation

### Build & Deployment
- **Docker** for containerization
- **GitHub Actions** for CI/CD
- **Environment-based config** for multiple deployments

---

## File Structure

```
src/
├── api/
│   ├── client.ts                 # Axios client setup
│   ├── services/
│   │   ├── organizations.ts
│   │   ├── ledgers.ts
│   │   ├── assets.ts
│   │   ├── accounts.ts
│   │   ├── portfolios.ts
│   │   ├── segments.ts
│   │   ├── operation-routes.ts
│   │   ├── transaction-routes.ts
│   │   ├── transactions.ts
│   │   ├── operations.ts
│   │   ├── balances.ts
│   │   └── asset-rates.ts
│   └── interceptors.ts
├── components/
│   ├── common/
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   ├── Table.vue
│   │   ├── Modal.vue
│   │   └── ...
│   ├── layout/
│   │   ├── Sidebar.vue
│   │   ├── TopBar.vue
│   │   └── Layout.vue
│   ├── onboarding/
│   │   ├── organizations/
│   │   ├── ledgers/
│   │   ├── assets/
│   │   ├── accounts/
│   │   ├── portfolios/
│   │   ├── segments/
│   │   ├── operation-routes/
│   │   └── transaction-routes/
│   └── transactions/
│       ├── create/
│       ├── details/
│       ├── operations/
│       ├── balances/
│       └── asset-rates/
├── pages/
│   ├── onboarding/
│   ├── transactions/
│   └── ...
├── stores/
│   ├── organizations.ts
│   ├── ledgers.ts
│   ├── transactions.ts
│   └── ...
├── types/
│   ├── api.ts
│   ├── models.ts
│   └── ...
├── utils/
│   ├── validators.ts
│   ├── formatters.ts
│   └── ...
├── App.vue
└── main.ts
```

---

## API Mapping Summary

### Onboarding Service Endpoints

| Entity | Operations | Endpoints |
|--------|------------|-----------|
| Organizations | CRUDL | GET/POST/PATCH/DELETE /v1/organizations |
| Ledgers | CRUDL | GET/POST/PATCH/DELETE /v1/organizations/{orgId}/ledgers |
| Assets | CRUDL | GET/POST/PATCH/DELETE /v1/organizations/{orgId}/ledgers/{ledgerId}/assets |
| Accounts | CRUDL | GET/POST/PATCH/DELETE /v1/organizations/{orgId}/ledgers/{ledgerId}/accounts |
| Portfolios | CRUDL | GET/POST/PATCH/DELETE /v1/organizations/{orgId}/ledgers/{ledgerId}/portfolios |
| Segments | CRUDL | GET/POST/PATCH/DELETE /v1/organizations/{orgId}/ledgers/{ledgerId}/segments |

### Transaction Service Endpoints

| Entity | Operations | Endpoints |
|--------|------------|-----------|
| Transactions | CRUD | GET/POST/PATCH/DELETE /v1/organizations/{orgId}/ledgers/{ledgerId}/transactions |
| Operations | R | GET /v1/organizations/{orgId}/ledgers/{ledgerId}/accounts/{accId}/operations |
| Balances | CRUDL | GET/POST/PATCH/DELETE /v1/organizations/{orgId}/ledgers/{ledgerId}/balances |
| Asset Rates | CRUDL | GET/POST/PATCH/DELETE /v1/organizations/{orgId}/ledgers/{ledgerId}/asset-rates |

---

## Success Criteria

✅ **Functionality**:
- All CRUDL operations working for onboarding entities
- Transaction creation in all 3 methods (JSON, Inflow, Outflow)
- Complete balance & operation tracking
- Asset rate management

✅ **UI/UX**:
- Modern fintech dashboard design
- Responsive on desktop (tablet support optional)
- Fast page loads (<3s)
- Smooth animations & transitions
- Accessibility (WCAG AA)

✅ **Performance**:
- Table pagination with 1000+ records
- Real-time balance updates
- Optimized API calls
- Client-side caching

✅ **Quality**:
- >80% test coverage
- Zero console errors
- Lighthouse score >90
- No security vulnerabilities

---

## References

- Midaz API Documentation: `/postman/WORKFLOW.md`
- Midaz Architecture: `/STRUCTURE.md`
- OpenAPI Specs: Generated from `/components/onboarding/api/swagger.json` & `/components/transaction/api/swagger.json`

