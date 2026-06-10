import type { WunderGraphConfig } from '@wundergraph/sdk';
import { federation } from '@wundergraph/sdk/datasources';

/**
 * WunderGraph Configuration
 * Composes multiple GraphQL Federation subgraphs into a unified API gateway
 * 
 * Why WunderGraph over traditional Federation:
 * 1. Performance: WunderGraph is optimized for high-throughput GraphQL operations
 * 2. Type Safety: Auto-generates type-safe client SDKs
 * 3. API Composition: Combines GraphQL, REST, and other APIs seamlessly
 * 4. Developer Experience: Better tooling and debugging capabilities
 * 5. Production Ready: Built-in caching, authentication, and monitoring
 */

const federatedApi = federation({
  namespace: 'marketing',
  upstreams: [
    {
      url: 'http://localhost:4001/graphql',
      // User Service - Authentication and User Management
      headers: (builder) => {
        return builder
          .addClientRequestHeader('x-tenant-id', 'x-tenant-id')
          .addClientRequestHeader('authorization', 'authorization');
      },
    },
    {
      url: 'http://localhost:4002/graphql',
      // Campaign Service - Campaign Management
      headers: (builder) => {
        return builder
          .addClientRequestHeader('x-tenant-id', 'x-tenant-id')
          .addClientRequestHeader('authorization', 'authorization');
      },
    },
    {
      url: 'http://localhost:4003/graphql',
      // Analytics Service - KPIs and Performance Metrics
      headers: (builder) => {
        return builder
          .addClientRequestHeader('x-tenant-id', 'x-tenant-id')
          .addClientRequestHeader('authorization', 'authorization');
      },
    },
  ],
});

export default {
  datasources: [federatedApi],
  authentication: {
    providers: {
      jwt: {
        // JWT authentication configuration
        issuer: process.env.JWT_ISSUER || 'https://auth.marketing-platform.com',
        jwks_endpoint: process.env.JWKS_ENDPOINT || 'https://auth.marketing-platform.com/.well-known/jwks.json',
      },
    },
  },
  authorization: {
    roles: {
      // Role-based access control
      admin: {
        match: {
          roles: ['ADMIN'],
        },
      },
      campaign_manager: {
        match: {
          roles: ['CAMPAIGN_MANAGER'],
        },
      },
      analyst: {
        match: {
          roles: ['ANALYST'],
        },
      },
      viewer: {
        match: {
          roles: ['VIEWER'],
        },
      },
    },
  },
} satisfies WunderGraphConfig;
