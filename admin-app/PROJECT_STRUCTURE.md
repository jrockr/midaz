# Midaz Admin App - Project Structure

## Directory Layout

```
admin-app/
├── docs/                          # Documentation (planning & guides)
│   ├── ADMIN_APP_ARCHITECTURE.md
│   ├── ADMIN_APP_COMPONENTS_BREAKDOWN.md
│   ├── ADMIN_APP_IMPLEMENTATION_GUIDE.md
│   ├── ADMIN_APP_QUICKSTART.md
│   ├── ADMIN_APP_VISUAL_GUIDE.md
│   ├── README_ADMIN_APP.md
│   ├── IMPLEMENTATION_CHECKLIST.md
│   ├── IMPLEMENTATION_PROGRESS.md
│   ├── PHASE1_STATUS.md
│   ├── RESUMPTION_GUIDE.md
│   └── TRACKING_DOCS_INDEX.md
│
├── src/                           # Application source code
│   ├── api/                       # API integration layer
│   │   ├── client.ts              # Axios client setup with interceptors
│   │   ├── services/              # API service modules
│   │   │   ├── organizations.ts
│   │   │   ├── ledgers.ts
│   │   │   ├── assets.ts
│   │   │   ├── accounts.ts
│   │   │   ├── portfolios.ts
│   │   │   ├── segments.ts
│   │   │   ├── operation-routes.ts
│   │   │   ├── transaction-routes.ts
│   │   │   ├── transactions.ts
│   │   │   ├── operations.ts
│   │   │   ├── balances.ts
│   │   │   ├── asset-rates.ts
│   │   │   └── index.ts
│   │   └── interceptors/          # API interceptors
│   │       ├── auth.ts
│   │       ├── error.ts
│   │       └── logging.ts
│   │
│   ├── components/                # Vue components
│   │   ├── common/                # Reusable UI components
│   │   │   ├── Button.vue
│   │   │   ├── Input.vue
│   │   │   ├── Select.vue
│   │   │   ├── Textarea.vue
│   │   │   ├── Checkbox.vue
│   │   │   ├── Radio.vue
│   │   │   ├── DatePicker.vue
│   │   │   ├── Table.vue
│   │   │   ├── Modal.vue
│   │   │   ├── Drawer.vue
│   │   │   ├── Toast.vue
│   │   │   ├── Spinner.vue
│   │   │   ├── Badge.vue
│   │   │   ├── Card.vue
│   │   │   ├── Tabs.vue
│   │   │   ├── Breadcrumb.vue
│   │   │   ├── Pagination.vue
│   │   │   ├── SearchInput.vue
│   │   │   ├── FilterBar.vue
│   │   │   ├── Alert.vue
│   │   │   ├── Tooltip.vue
│   │   │   ├── Dropdown.vue
│   │   │   ├── MenuButton.vue
│   │   │   ├── EmptyState.vue
│   │   │   ├── ErrorBoundary.vue
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/                # Layout components
│   │   │   ├── Layout.vue         # Main layout wrapper
│   │   │   ├── Sidebar.vue        # Navigation sidebar
│   │   │   ├── TopBar.vue         # Top navigation
│   │   │   ├── SidebarMenu.vue    # Sidebar menu items
│   │   │   ├── UserMenu.vue       # User profile menu
│   │   │   └── index.ts
│   │   │
│   │   ├── onboarding/            # Onboarding module components
│   │   │   ├── organizations/
│   │   │   │   ├── OrganizationsList.vue
│   │   │   │   ├── OrganizationsTable.vue
│   │   │   │   ├── OrganizationActions.vue
│   │   │   │   ├── CreateOrganization.vue
│   │   │   │   ├── OrganizationForm.vue
│   │   │   │   ├── EditOrganization.vue
│   │   │   │   ├── OrganizationDetail.vue
│   │   │   │   ├── OrganizationInfo.vue
│   │   │   │   ├── OrganizationMetadata.vue
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── ledgers/
│   │   │   ├── assets/
│   │   │   ├── accounts/
│   │   │   ├── portfolios/
│   │   │   ├── segments/
│   │   │   ├── operation-routes/
│   │   │   └── transaction-routes/
│   │   │
│   │   └── transactions/           # Transactions module components
│   │       ├── create/
│   │       │   ├── CreateTransaction.vue
│   │       │   ├── CreateTransactionJSON.vue
│   │       │   ├── TransactionJSONEditor.vue
│   │       │   ├── TransactionPreview.vue
│   │       │   ├── CreateInflowTransaction.vue
│   │       │   ├── InflowTransactionForm.vue
│   │       │   ├── CreateOutflowTransaction.vue
│   │       │   ├── OutflowTransactionForm.vue
│   │       │   ├── TransactionTemplateLibrary.vue
│   │       │   └── index.ts
│   │       │
│   │       ├── details/
│   │       │   ├── TransactionsList.vue
│   │       │   ├── TransactionsTable.vue
│   │       │   ├── TransactionDetail.vue
│   │       │   ├── TransactionSummary.vue
│   │       │   ├── TransactionOperations.vue
│   │       │   ├── TransactionBalances.vue
│   │       │   ├── TransactionMetadata.vue
│   │       │   ├── TransactionTimeline.vue
│   │       │   ├── TransactionSearch.vue
│   │       │   └── index.ts
│   │       │
│   │       ├── operations/
│   │       │   ├── OperationsList.vue
│   │       │   ├── OperationsTable.vue
│   │       │   ├── OperationDetail.vue
│   │       │   └── index.ts
│   │       │
│   │       ├── balances/
│   │       │   ├── BalancesList.vue
│   │       │   ├── BalancesTable.vue
│   │       │   ├── GlobalBalancesList.vue
│   │       │   ├── BalanceDetail.vue
│   │       │   ├── BalanceChart.vue
│   │       │   ├── BalanceForm.vue
│   │       │   ├── UpdateBalance.vue
│   │       │   └── index.ts
│   │       │
│   │       └── asset-rates/
│   │           ├── AssetRatesList.vue
│   │           ├── AssetRatesTable.vue
│   │           ├── CreateAssetRate.vue
│   │           ├── AssetRateForm.vue
│   │           ├── EditAssetRate.vue
│   │           ├── BulkUploadRates.vue
│   │           ├── AssetRatesHistory.vue
│   │           ├── AssetRatesChart.vue
│   │           └── index.ts
│   │
│   ├── pages/                     # Page components (route views)
│   │   ├── onboarding/
│   │   │   ├── Organizations.vue
│   │   │   ├── Ledgers.vue
│   │   │   ├── Assets.vue
│   │   │   ├── Accounts.vue
│   │   │   ├── Portfolios.vue
│   │   │   ├── Segments.vue
│   │   │   ├── OperationRoutes.vue
│   │   │   └── TransactionRoutes.vue
│   │   │
│   │   ├── transactions/
│   │   │   ├── Create.vue
│   │   │   ├── List.vue
│   │   │   ├── Details.vue
│   │   │   ├── Operations.vue
│   │   │   ├── Balances.vue
│   │   │   └── AssetRates.vue
│   │   │
│   │   ├── Dashboard.vue
│   │   └── NotFound.vue
│   │
│   ├── stores/                    # Pinia state management
│   │   ├── organizations.ts
│   │   ├── ledgers.ts
│   │   ├── assets.ts
│   │   ├── accounts.ts
│   │   ├── portfolios.ts
│   │   ├── segments.ts
│   │   ├── transactions.ts
│   │   ├── operations.ts
│   │   ├── balances.ts
│   │   ├── asset-rates.ts
│   │   ├── ui.ts               # UI state (modals, sidebar, etc.)
│   │   └── index.ts
│   │
│   ├── types/                     # TypeScript type definitions
│   │   ├── api.ts               # API response/request types
│   │   ├── domain.ts            # Domain model types
│   │   ├── components.ts        # Component prop types
│   │   ├── filters.ts           # Filter & search types
│   │   └── index.ts
│   │
│   ├── utils/                     # Utility functions
│   │   ├── formatters.ts        # Formatters (currency, date, etc.)
│   │   ├── validators.ts        # Validation functions
│   │   ├── transformers.ts      # Data transformers
│   │   ├── api-errors.ts        # API error handlers
│   │   ├── constants.ts         # Application constants
│   │   ├── math.ts              # Decimal/math calculations
│   │   └── index.ts
│   │
│   ├── hooks/                     # Vue 3 Composition functions
│   │   ├── useApi.ts            # API call hook
│   │   ├── useForm.ts           # Form handling hook
│   │   ├── usePagination.ts     # Pagination hook
│   │   ├── useFilters.ts        # Filtering hook
│   │   ├── useLocalStorage.ts   # Local storage hook
│   │   └── index.ts
│   │
│   ├── router/                    # Vue Router configuration
│   │   ├── index.ts             # Router setup
│   │   ├── routes/
│   │   │   ├── onboarding.ts
│   │   │   ├── transactions.ts
│   │   │   └── auth.ts
│   │   └── guards.ts            # Route guards
│   │
│   ├── App.vue                    # Root component
│   ├── main.ts                    # Application entry point
│   └── vite-env.d.ts
│
├── tests/                         # Test files
│   ├── unit/                      # Unit tests
│   │   ├── stores/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── integration/               # Integration tests
│   │   └── api/
│   │
│   └── e2e/                       # End-to-end tests (Playwright)
│       ├── organizations.spec.ts
│       ├── transactions.spec.ts
│       └── accounts.spec.ts
│
├── public/                        # Static assets
│   ├── icons/
│   ├── images/
│   └── favicon.ico
│
├── .env.example                   # Environment variables template
├── .env.development
├── .env.production
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── eslint.config.js               # ESLint configuration
├── prettier.config.js             # Prettier configuration
├── vitest.config.ts               # Vitest configuration
├── playwright.config.ts           # Playwright configuration
├── package.json                   # Project dependencies
├── package-lock.json
├── IMPLEMENTATION_STATUS.md       # Implementation checklist & progress
├── PROJECT_STRUCTURE.md           # This file
├── README.md                      # Project README
└── GETTING_STARTED.md             # Quick start guide
```

---

## File Naming Conventions

### Components
- **PascalCase** for component files and names
- **Examples**: `OrganizationsList.vue`, `CreateTransaction.vue`, `Button.vue`

### Stores
- **camelCase** with suffix `Store` or just `camelCase`
- **Examples**: `organizationsStore.ts`, `transactions.ts`

### Services/API
- **camelCase** with descriptive names
- **Examples**: `organizations.ts`, `asset-rates.ts`

### Types
- **Interface names**: PascalCase with `I` prefix or no prefix
- **Type names**: PascalCase
- **Examples**: `interface Organization`, `type CreateOrgDto`

### Utils/Hooks
- **camelCase**
- **Hooks prefix with `use`**
- **Examples**: `formatters.ts`, `useForm.ts`

---

## Development Workflow

### 1. Creating a New Component

```
1. Create component file in appropriate folder
2. Define TypeScript types in types/
3. Add component export to index.ts of folder
4. Create story for Storybook (optional)
5. Add unit tests in tests/unit/
```

### 2. Creating an API Service

```
1. Create service file in api/services/
2. Define types in types/api.ts
3. Implement CRUD methods
4. Add to services index.ts
5. Create corresponding Pinia store
```

### 3. Creating a Pinia Store

```
1. Define types in types/
2. Create store file in stores/
3. Implement state, getters, actions
4. Add to stores index.ts
5. Create unit tests
```

### 4. Adding a Route

```
1. Create page component in pages/
2. Add route to router/routes/
3. Add navigation link in Sidebar/TopBar
4. Create breadcrumb entries
5. Add E2E test
```

---

## Dependencies Overview

### Core Framework
- **Vue 3**: UI framework
- **Vite**: Build tool
- **TypeScript**: Type safety

### State Management
- **Pinia**: State management

### HTTP Client
- **Axios**: HTTP requests with interceptors

### UI & Styling
- **Tailwind CSS**: Utility-first CSS
- **Headless UI**: Unstyled, accessible components
- **Heroicons**: Icon library

### Validation
- **Zod**: Schema validation
- **VeeValidate**: Form validation (optional)

### Date & Time
- **date-fns**: Date formatting and manipulation

### Math & Decimals
- **decimal.js**: Precise decimal calculations

### Utilities
- **lodash-es**: Utility functions
- **clsx**: Class merging

### Testing
- **Vitest**: Unit testing
- **Playwright**: E2E testing
- **Vue Test Utils**: Component testing
- **@testing-library/vue**: Testing utilities

### Development
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **TypeScript ESLint**: TypeScript linting

---

## Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_ONBOARDING_API=http://localhost:3000
VITE_TRANSACTION_API=http://localhost:3001

# App Configuration
VITE_APP_NAME=Midaz Admin
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_FEATURE_BULK_UPLOAD=true
VITE_FEATURE_EXPORT_CSV=true
VITE_FEATURE_ADVANCED_FILTERS=true

# Analytics
VITE_ANALYTICS_ENABLED=false
VITE_SENTRY_DSN=
```

---

## Key Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI Framework** | Vue 3 + TypeScript | Reactive UI components |
| **Build Tool** | Vite | Fast bundling & development |
| **State** | Pinia | Global state management |
| **HTTP** | Axios | API requests |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Components** | Headless UI | Accessible, unstyled components |
| **Icons** | Heroicons | SVG icons |
| **Validation** | Zod | Schema validation |
| **Math** | decimal.js | Precise calculations |
| **Testing** | Vitest + Playwright | Unit & E2E tests |
| **Linting** | ESLint | Code quality |

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run typecheck
```

---

## Integration Points

### APIs to Integrate

1. **Onboarding Service** (`http://localhost:3000`)
   - Organizations, Ledgers, Assets, Accounts, Portfolios, Segments, Routes

2. **Transaction Service** (`http://localhost:3001`)
   - Transactions, Operations, Balances, Asset Rates

3. **Authentication Service**
   - Login, Logout, Token Refresh

---

## Performance Guidelines

- Lazy load pages using dynamic imports
- Virtual scroll for tables with 1000+ rows
- Debounce search input (300ms)
- Memoize computed properties
- Use pagination for large datasets
- Compress images
- Monitor bundle size
- Target Lighthouse score >90

---

## Security Guidelines

- Validate all user input
- Use CSRF tokens in requests
- Sanitize HTML content
- Implement rate limiting
- Use HTTPS in production
- Secure localStorage usage
- Regular security audits
- Update dependencies regularly

---

## Testing Strategy

### Coverage Targets
- **Stores**: >90%
- **Services**: >85%
- **Components**: >75%
- **Utils**: >90%
- **Overall**: >80%

### Test Types
- **Unit Tests**: Stores, Services, Utils (Vitest)
- **Component Tests**: Interactive components (Vue Test Utils)
- **Integration Tests**: API + Store interactions
- **E2E Tests**: Critical user flows (Playwright)

---

## Deployment

### Build Process
```bash
npm run build
# Creates dist/ folder ready for deployment
```

### Deployment Targets
- **Development**: Vercel/Netlify preview
- **Staging**: Vercel/Netlify staging
- **Production**: Vercel/Netlify production

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] No console errors
- [ ] Lighthouse score >90
- [ ] Bundle size optimized
- [ ] Environment variables configured
- [ ] Security audit passed

---

## Documentation References

- [Architecture Guide](./docs/ADMIN_APP_ARCHITECTURE.md)
- [Implementation Guide](./docs/ADMIN_APP_IMPLEMENTATION_GUIDE.md)
- [Components Breakdown](./docs/ADMIN_APP_COMPONENTS_BREAKDOWN.md)
- [Quick Start](./docs/ADMIN_APP_QUICKSTART.md)
- [Visual Guide](./docs/ADMIN_APP_VISUAL_GUIDE.md)

---

**Last Updated**: 2025-10-21
