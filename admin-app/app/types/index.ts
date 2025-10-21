/**
 * Organization Types
 */
export interface Organization {
  id: string
  name: string
  code?: string
  description?: string
  parentId?: string | null
  status: 'ACTIVE' | 'INACTIVE'
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CreateOrganizationDto {
  name: string
  code?: string
  description?: string
  parentId?: string
  metadata?: Record<string, unknown>
}

export interface UpdateOrganizationDto {
  name?: string
  code?: string
  description?: string
  parentId?: string
  status?: 'ACTIVE' | 'INACTIVE'
  metadata?: Record<string, unknown>
}

/**
 * Ledger Types
 */
export interface Ledger {
  id: string
  organizationId: string
  name: string
  code: string
  status: 'ACTIVE' | 'INACTIVE'
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CreateLedgerDto {
  name: string
  code: string
  description?: string
  status?: 'ACTIVE' | 'INACTIVE'
  metadata?: Record<string, unknown>
}

export interface UpdateLedgerDto {
  name?: string
  code?: string
  description?: string
  status?: 'ACTIVE' | 'INACTIVE'
  metadata?: Record<string, unknown>
}

/**
 * Asset Types
 */
export interface Asset {
  id: string
  ledgerId: string
  name: string
  code: string
  type: string
  decimals: number
  status: 'ACTIVE' | 'INACTIVE'
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CreateAssetDto {
  name: string
  code: string
  type: string
  decimals: number
  status?: 'ACTIVE' | 'INACTIVE'
  metadata?: Record<string, unknown>
}

export interface UpdateAssetDto {
  name?: string
  code?: string
  type?: string
  decimals?: number
  status?: 'ACTIVE' | 'INACTIVE'
  metadata?: Record<string, unknown>
}

/**
 * Account Types
 */
export interface Account {
  id: string
  ledgerId: string
  portfolioId?: string
  segmentId?: string
  alias: string
  accountName: string
  accountNumber?: string
  type: 'ASSET' | 'LIABILITY' | 'EQUITY'
  asset: Asset
  status: 'ACTIVE' | 'INACTIVE'
  externalCode?: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CreateAccountDto {
  ledgerId: string
  portfolioId?: string
  segmentId?: string
  alias: string
  accountName: string
  accountNumber?: string
  type: 'ASSET' | 'LIABILITY' | 'EQUITY'
  assetId: string
  status?: 'ACTIVE' | 'INACTIVE'
  externalCode?: string
  metadata?: Record<string, unknown>
}

export interface UpdateAccountDto {
  alias?: string
  accountName?: string
  accountNumber?: string
  type?: 'ASSET' | 'LIABILITY' | 'EQUITY'
  status?: 'ACTIVE' | 'INACTIVE'
  externalCode?: string
  metadata?: Record<string, unknown>
}

/**
 * Balance Types
 */
export interface Balance {
  id: string
  accountId: string
  assetId: string
  balance: string
  available: string
  onHold: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

export interface CreateBalanceDto {
  accountId: string
  assetId: string
  balance: string
  available: string
  onHold: string
  metadata?: Record<string, unknown>
}

export interface UpdateBalanceDto {
  balance?: string
  available?: string
  onHold?: string
  status?: 'ACTIVE' | 'INACTIVE'
  metadata?: Record<string, unknown>
}

/**
 * Transaction Types
 */
export interface Transaction {
  id: string
  ledgerId: string
  status: 'PENDING' | 'POSTED' | 'FAILED'
  description?: string
  operations: Operation[]
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionDto {
  idempotencyKey: string
  description?: string
  operations: Array<{
    operationId?: string
    accountId: string
    amount: string
    type: 'DEBIT' | 'CREDIT'
    description?: string
  }>
  metadata?: Record<string, unknown>
}

/**
 * Operation Types
 */
export interface Operation {
  id: string
  transactionId: string
  accountId: string
  amount: string
  type: 'DEBIT' | 'CREDIT'
  balanceAfter: string
  description?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

/**
 * Portfolio Types
 */
export interface Portfolio {
  id: string
  ledgerId: string
  name: string
  code: string
  description?: string
  status: 'ACTIVE' | 'INACTIVE'
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CreatePortfolioDto {
  name: string
  code: string
  description?: string
  status?: 'ACTIVE' | 'INACTIVE'
  metadata?: Record<string, unknown>
}

/**
 * Segment Types
 */
export interface Segment {
  id: string
  ledgerId: string
  name: string
  code: string
  parentId?: string
  description?: string
  status: 'ACTIVE' | 'INACTIVE'
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CreateSegmentDto {
  name: string
  code: string
  parentId?: string
  description?: string
  status?: 'ACTIVE' | 'INACTIVE'
  metadata?: Record<string, unknown>
}

/**
 * API Response Types
 */
export interface ListResponse<T> {
  status: string
  code: number
  data: T[]
  pagination?: {
    limit: number
    offset: number
    total: number
  }
}

export interface SingleResponse<T> {
  status: string
  code: number
  data: T
}

export interface ApiError {
  status: string
  code: number
  message: string
  errors?: Array<{
    field?: string
    message: string
  }>
}

/**
 * Pagination Types
 */
export interface PaginationState {
  limit: number
  offset: number
  total: number
}

/**
 * Form Types
 */
export interface FormState<T> {
  data: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
}
