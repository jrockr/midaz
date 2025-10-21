/* Production Build Configuration */

export const productionConfig = {
  // API Configuration
  api: {
    baseURL: process.env.VITE_API_URL || 'https://api.midaz.io/v1',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  },

  // Application Settings
  app: {
    name: 'Midaz Admin Dashboard',
    version: process.env.VITE_APP_VERSION || '1.0.0',
    environment: 'production'
  },

  // Feature Flags
  features: {
    apiIntegration: true,
    batchProcessing: true,
    realTimeUpdates: true,
    analyticsTracking: true,
    errorReporting: true
  },

  // Performance
  performance: {
    enableServiceWorker: true,
    enableCompression: true,
    enableCaching: true,
    cacheMaxAge: 3600000, // 1 hour
    bundleAnalysis: false
  },

  // Security
  security: {
    enableCSP: true,
    enableXSSProtection: true,
    enableSecureHeaders: true,
    sessionTimeout: 1800000, // 30 minutes
    tokenRefreshInterval: 900000 // 15 minutes
  },

  // Logging
  logging: {
    level: 'warn', // error, warn, info, debug
    sentryDSN: process.env.VITE_SENTRY_DSN,
    enableConsoleLogging: false,
    enableNetworkLogging: false
  },

  // Monitoring
  monitoring: {
    enablePerformanceMonitoring: true,
    enableErrorTracking: true,
    enableAnalytics: true,
    metricsInterval: 60000 // 1 minute
  }
}

export default productionConfig
