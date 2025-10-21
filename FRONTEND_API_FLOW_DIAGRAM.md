# Frontend API Flow - Visual Diagram

## API Hierarchy & Dependencies

```
┌─────────────────────────────────────────────────────────────┐
│                     MIDAZ API STRUCTURE                      │
└─────────────────────────────────────────────────────────────┘

Level 1: ORGANIZATIONS
┌──────────────────────────────────────┐
│  POST /v1/organizations              │
│  GET  /v1/organizations              │
│  GET  /v1/organizations/{id}         │
│                                      │
│  Output: organizationId              │
└──────────────────────────────────────┘
                 │
                 ▼
Level 2: LEDGERS (requires organizationId)
┌──────────────────────────────────────────────────────────┐
│  POST /v1/organizations/{orgId}/ledgers                  │
│  GET  /v1/organizations/{orgId}/ledgers                  │
│  GET  /v1/organizations/{orgId}/ledgers/{id}             │
│                                                          │
│  Output: ledgerId                                        │
└──────────────────────────────────────────────────────────┘
                 │
                 ├─────────────────┬─────────────────┐
                 ▼                 ▼                 ▼
Level 3: ASSETS          PORTFOLIOS        SEGMENTS
┌─────────────────────┐ ┌──────────────┐ ┌──────────────┐
│ POST /v1/orgs/{o}/  │ │ POST /v1/... │ │ POST /v1/... │
│   ledgers/{l}/      │ │              │ │              │
│   assets            │ │              │ │              │
│                     │ │              │ │              │
│ Output: assetId     │ │ Output: ...  │ │ Output: ...  │
└─────────────────────┘ └──────────────┘ └──────────────┘
                 │
                 ▼
Level 4: ACCOUNTS (requires orgId + ledgerId + assetCode)
┌──────────────────────────────────────────────────────────┐
│  POST /v1/organizations/{orgId}/ledgers/{ledgerId}/      │
│       accounts                                           │
│                                                          │
│  Payload: { alias, name, type, assetCode, ... }         │
│  Output: accountId                                       │
└──────────────────────────────────────────────────────────┘
                 │
                 ▼
Level 5: TRANSACTIONS (requires orgId + ledgerId)
┌──────────────────────────────────────────────────────────┐
│  POST /v1/organizations/{orgId}/ledgers/{ledgerId}/      │
│       transactions/json                                  │
│                                                          │
│  Output: transactionId, operationId, balanceId           │
└──────────────────────────────────────────────────────────┘
```

---

## User Flow - Before vs After

### BEFORE (Broken) ❌

```
User Opens Ledgers Page
         │
         ▼
   Load Ledgers
         │
         ▼
API Call: GET /v1/ledgers
         │
         ▼
    404 ERROR
         │
         ▼
   No Data Shown
         │
         ▼
  User Confused 😕
```

### AFTER (Fixed) ✅

```
User Opens Ledgers Page
         │
         ▼
┌────────────────────────┐
│ Select Organization    │
│ [Search: "Acme..."]    │
│ ▼ Acme Corp           │
│   Beta Inc            │
│   Gamma LLC           │
└────────────────────────┘
         │
         ▼
   Organization Selected
         │
         ▼
API Call: GET /v1/organizations/{orgId}/ledgers
         │
         ▼
   Ledgers Loaded ✅
         │
         ▼
  User Can Work 😊
```

---

## Cascading Dependencies - Assets Page

```
┌─────────────────────────────────────────────────────────┐
│                    ASSETS LIST PAGE                      │
└─────────────────────────────────────────────────────────┘

Step 1: Select Organization
┌──────────────────────────┐
│ Organization *           │
│ [Search: ""]             │
│ ▼ Select...             │  ← User must select first
└──────────────────────────┘
         │
         ▼ (onChange)
┌──────────────────────────┐
│ Ledger *                 │
│ [Search: ""]             │
│ ▼ Select...             │  ← Now enabled
└──────────────────────────┘
         │
         ▼ (onChange)
┌──────────────────────────────────────────────────────────┐
│                    ASSETS TABLE                          │
│  Code  │  Name              │  Type      │  Status       │
│  USD   │  US Dollar         │  CURRENCY  │  ACTIVE       │
│  EUR   │  Euro              │  CURRENCY  │  ACTIVE       │
│  BTC   │  Bitcoin           │  CRYPTO    │  ACTIVE       │
└──────────────────────────────────────────────────────────┘
```

---

## Search Functionality

```
┌─────────────────────────────────────────────────────────┐
│  Organization Selector with Search                       │
└─────────────────────────────────────────────────────────┘

Without Search (100+ items):
┌──────────────────────────┐
│ ▼ Select...             │
│   Org 001               │
│   Org 002               │
│   Org 003               │
│   ... (scroll forever)  │  ← Bad UX 😞
│   Org 098               │
│   Org 099               │
│   Org 100               │
└──────────────────────────┘

With Search:
┌──────────────────────────┐
│ [Search: "acme"]         │  ← User types
└──────────────────────────┘
         │
         ▼ (filters)
┌──────────────────────────┐
│ ▼ Select...             │
│   Acme Corp             │  ← Only matching items
│   Acme Industries       │
│   Acme Solutions        │
└──────────────────────────┘  ← Good UX 😊
```

---

## Form Payload Structure

### BEFORE (Wrong) ❌

```json
{
  "name": "Main Ledger",
  "status": "ACTIVE",           ← Wrong! String instead of object
  "metadata": {}
}
```

### AFTER (Correct) ✅

```json
{
  "name": "Main Ledger",
  "status": {                   ← Correct! Object with code
    "code": "ACTIVE"
  },
  "metadata": {}
}
```

---

## Component Communication Flow

```
┌─────────────────────────────────────────────────────────┐
│                    LIST PAGE (Parent)                    │
│                                                          │
│  ┌────────────────────────────────────────────┐         │
│  │  Organization Selector                     │         │
│  │  selectedOrgId: ref('')                    │         │
│  └────────────────────────────────────────────┘         │
│                    │                                     │
│                    ▼ watch(selectedOrgId)                │
│  ┌────────────────────────────────────────────┐         │
│  │  Load Ledgers                              │         │
│  │  ledgersStore.fetch({ organizationId })    │         │
│  └────────────────────────────────────────────┘         │
│                    │                                     │
│                    ▼                                     │
│  ┌────────────────────────────────────────────┐         │
│  │  Ledger Selector (now enabled)             │         │
│  │  selectedLedgerId: ref('')                 │         │
│  └────────────────────────────────────────────┘         │
│                    │                                     │
│                    ▼ watch(selectedLedgerId)             │
│  ┌────────────────────────────────────────────┐         │
│  │  Load Assets                               │         │
│  │  assetsStore.fetch({                       │         │
│  │    organizationId,                         │         │
│  │    ledgerId                                │         │
│  │  })                                        │         │
│  └────────────────────────────────────────────┘         │
│                    │                                     │
│                    ▼                                     │
│  ┌────────────────────────────────────────────┐         │
│  │  Assets Table (shows data)                 │         │
│  └────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────┘
```

---

## API Service Call Pattern

### BEFORE (Wrong) ❌

```typescript
// Service
async list() {
  return await client.get('/v1/assets')  // Missing path params
}

// Component
await assetsStore.fetch()  // No context provided
```

### AFTER (Correct) ✅

```typescript
// Service
async list(organizationId: string, ledgerId: string) {
  return await client.get(
    `/v1/organizations/${organizationId}/ledgers/${ledgerId}/assets`
  )
}

// Component
await assetsStore.fetch({
  organizationId: selectedOrgId.value,
  ledgerId: selectedLedgerId.value
})
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────────┐
│                    COMPONENT STATE                       │
└─────────────────────────────────────────────────────────┘

selectedOrgId: ''
selectedLedgerId: ''
items: []
loading: false

         │
         ▼ User selects org
         
selectedOrgId: 'org-123'
selectedLedgerId: ''        ← Cleared
items: []                   ← Cleared
loading: true

         │
         ▼ Ledgers loaded
         
selectedOrgId: 'org-123'
selectedLedgerId: ''
items: []
loading: false

         │
         ▼ User selects ledger
         
selectedOrgId: 'org-123'
selectedLedgerId: 'ledger-456'
items: []
loading: true

         │
         ▼ Assets loaded
         
selectedOrgId: 'org-123'
selectedLedgerId: 'ledger-456'
items: [asset1, asset2, ...]  ← Populated
loading: false
```

---

## Error Handling Flow

```
User Action
    │
    ▼
┌─────────────────────┐
│ Validation Check    │
│ - Org selected?     │
│ - Ledger selected?  │
└─────────────────────┘
    │
    ├─── NO ──→ Show Warning Toast
    │           "Please select org and ledger"
    │
    └─── YES ──→ Make API Call
                     │
                     ├─── Success ──→ Update State
                     │                Show Data
                     │
                     └─── Error ──→ Show Error Toast
                                   "Failed to load assets"
```

---

## Summary

✅ **Fixed**: API paths now include all required parameters
✅ **Fixed**: Forms send correct payload structure
✅ **Added**: Searchable dropdowns for better UX
✅ **Added**: Cascading dependencies (org → ledger → data)
✅ **Added**: Helpful messages and disabled states
✅ **Improved**: User flow is now clear and intuitive

The frontend now properly matches the Midaz API structure! 🎉
