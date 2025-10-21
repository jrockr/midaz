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
      {
        path: '/portfolios',
        name: 'Portfolios',
        component: () => import('../pages/onboarding/portfolios/List.vue'),
      },
      {
        path: '/portfolios/:id',
        name: 'PortfolioDetail',
        component: () => import('../pages/onboarding/portfolios/Detail.vue'),
      },
      {
        path: '/segments',
        name: 'Segments',
        component: () => import('../pages/onboarding/segments/List.vue'),
      },
      {
        path: '/segments/:id',
        name: 'SegmentDetail',
        component: () => import('../pages/onboarding/segments/Detail.vue'),
      },
      // Operations Routes
      {
        path: '/operations',
        name: 'Operations',
        component: () => import('../pages/operations/routes/List.vue'),
      },
      {
        path: '/operations/:id',
        name: 'OperationDetail',
        component: () => import('../pages/operations/routes/Detail.vue'),
      },
      // Transactions Routes
      {
        path: '/transactions',
        name: 'Transactions',
        component: () => import('../pages/transactions/List.vue'),
      },
      {
        path: '/transactions/:id',
        name: 'TransactionDetail',
        component: () => import('../pages/transactions/Detail.vue'),
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
