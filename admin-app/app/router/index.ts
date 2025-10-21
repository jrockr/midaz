import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Layout
import DashboardLayout from '../components/layout/Layout.vue'

// Views - Will be created in Phase 2
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../pages/dashboard/Dashboard.vue'),
      },
      // Onboarding Routes
      {
        path: '/organizations',
        name: 'Organizations',
        component: () => import('../pages/onboarding/organizations/List.vue'),
      },
      {
        path: '/organizations/:id',
        name: 'OrganizationDetail',
        component: () => import('../pages/onboarding/organizations/Detail.vue'),
      },
      {
        path: '/ledgers',
        name: 'Ledgers',
        component: () => import('../pages/onboarding/ledgers/List.vue'),
      },
      {
        path: '/ledgers/:id',
        name: 'LedgerDetail',
        component: () => import('../pages/onboarding/ledgers/Detail.vue'),
      },
      {
        path: '/accounts',
        name: 'Accounts',
        component: () => import('../pages/onboarding/accounts/List.vue'),
      },
      {
        path: '/accounts/:id',
        name: 'AccountDetail',
        component: () => import('../pages/onboarding/accounts/Detail.vue'),
      },
      {
        path: '/assets',
        name: 'Assets',
        component: () => import('../pages/onboarding/assets/List.vue'),
      },
      {
        path: '/assets/:id',
        name: 'AssetDetail',
        component: () => import('../pages/onboarding/assets/Detail.vue'),
      },
      // Onboarding Root
      {
        path: '/onboarding',
        redirect: '/onboarding/organizations',
      },
      {
        path: '/onboarding/portfolios',
        name: 'Portfolios',
        component: () => import('../pages/onboarding/portfolios/List.vue'),
      },
      {
        path: '/onboarding/portfolios/create',
        name: 'CreatePortfolio',
        component: () => import('../pages/onboarding/portfolios/Create.vue'),
      },
      {
        path: '/onboarding/portfolios/:id',
        name: 'PortfolioDetail',
        component: () => import('../pages/onboarding/portfolios/Detail.vue'),
      },
      {
        path: '/onboarding/portfolios/:id/edit',
        name: 'EditPortfolio',
        component: () => import('../pages/onboarding/portfolios/Edit.vue'),
      },
      // Segments
      {
        path: '/onboarding/segments',
        name: 'Segments',
        component: () => import('../pages/onboarding/segments/List.vue'),
      },
      {
        path: '/onboarding/segments/create',
        name: 'CreateSegment',
        component: () => import('../pages/onboarding/segments/Create.vue'),
      },
      {
        path: '/onboarding/segments/:id',
        name: 'SegmentDetail',
        component: () => import('../pages/onboarding/segments/Detail.vue'),
      },
      {
        path: '/onboarding/segments/:id/edit',
        name: 'EditSegment',
        component: () => import('../pages/onboarding/segments/Edit.vue'),
      },
      // Operation Routes
      {
        path: '/operations/routes',
        name: 'OperationRoutes',
        component: () => import('../pages/operations/routes/List.vue'),
      },
      {
        path: '/operations/routes/create',
        name: 'CreateOperationRoute',
        component: () => import('../pages/operations/routes/Create.vue'),
      },
      {
        path: '/operations/routes/:id',
        name: 'OperationRouteDetail',
        component: () => import('../pages/operations/routes/Detail.vue'),
      },
      {
        path: '/operations/routes/:id/edit',
        name: 'EditOperationRoute',
        component: () => import('../pages/operations/routes/Edit.vue'),
      },
      // Transaction Routes
      {
        path: '/transactions/routes',
        name: 'TransactionRoutes',
        component: () => import('../pages/transactions/routes/List.vue'),
      },
      {
        path: '/transactions/routes/create',
        name: 'CreateTransactionRoute',
        component: () => import('../pages/transactions/routes/Create.vue'),
      },
      {
        path: '/transactions/routes/:id/edit',
        name: 'EditTransactionRoute',
        component: () => import('../pages/transactions/routes/Edit.vue'),
      },
      // Legacy transaction routes
      {
        path: '/transactions',
        name: 'Transactions',
        component: () => import('../pages/transactions/List.vue'),
      },
      {
        path: '/transactions/create',
        name: 'CreateTransaction',
        component: () => import('../pages/transactions/Create.vue'),
      },
      {
        path: '/transactions/:id',
        name: 'TransactionDetail',
        component: () => import('../pages/transactions/Detail.vue'),
      },
      {
        path: '/transactions/approval',
        name: 'TransactionApprovals',
        component: () => import('../pages/transactions/Approval.vue'),
      },
      {
        path: '/transactions/batch',
        name: 'TransactionBatch',
        component: () => import('../pages/transactions/Batch.vue'),
      },
      {
        path: '/search',
        name: 'AdvancedSearch',
        component: () => import('../pages/search/Advanced.vue'),
      },
      {
        path: '/balances',
        name: 'Balances',
        component: () => import('../pages/transactions/balances/List.vue'),
      },
      {
        path: '/asset-rates',
        name: 'AssetRates',
        component: () => import('../pages/transactions/asset-rates/List.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
