# System Flow Diagrams

## 1. Overall System Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT APPLICATIONS                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   React Web  │  │  Mobile App  │  │  Third Party │          │
│  │   Frontend   │  │   (iOS/Android) │  │   Integrations │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼──────────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │ HTTPS/WebSocket
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WUNDERGRAPH GATEWAY (Port 9999)              │
├─────────────────────────────────────────────────────────────────┤
│  1. Request Validation & Authentication                         │
│     - JWT Token Validation                                      │
│     - User Role Extraction                                      │
│     - Tenant Context Extraction                                 │
│                                                              ↓ │
│  2. Query Planning & Optimization                              │
│     - Parse GraphQL Query                                       │
│     - Analyze Query Complexity                                  │
│     - Generate Execution Plan                                   │
│                                                              ↓ │
│  3. Request Composition & Routing                              │
│     - Determine Required Subgraphs                              │
│     - Add Tenant Headers (x-tenant-id, authorization)           │
│     - Parallel Request Execution                                │
│                                                              ↓ │
│  4. Response Composition & Caching                              │
│     - Merge Subgraph Responses                                 │
│     - Apply Entity Resolution (@key directives)                │
│     - Cache Responses (if applicable)                           │
│                                                              ↓ │
│  5. Response Transformation                                    │
│     - Apply Authorization Rules                                 │
│     - Format Response                                           │
│     - Return to Client                                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ↓                  ↓                  ↓
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   USERS      │   │  CAMPAIGNS   │   │  ANALYTICS   │
│   SERVICE    │   │   SERVICE    │   │   SERVICE    │
│   Port 4001  │   │   Port 4002  │   │   Port 4003  │
└──────────────┘   └──────────────┘   └──────────────┘
```

## 2. Authentication & Authorization Flow

```
┌──────────────┐
│   CLIENT     │
└──────┬───────┘
       │ 1. Login Request (email/password)
       ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WUNDERGRAPH GATEWAY                           │
│  1. Forward to User Service                                     │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    USER SERVICE (Port 4001)                      │
│  1. Receive Login Request                                      │
│  2. Validate Credentials                                       │
│  3. Generate JWT Token                                         │
│  4. Return Token + User Info                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WUNDERGRAPH GATEWAY                           │
│  1. Receive User + Token                                        │
│  2. Cache Token (if applicable)                                  │
│  3. Return to Client                                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │ 2. Store Token
                           ↓
┌──────────────┐
│   CLIENT     │
│  (Stores JWT) │
└──────┬───────┘
       │ 3. API Request with JWT in Header
       ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WUNDERGRAPH GATEWAY                           │
│  1. Extract JWT from Authorization Header                        │
│  2. Validate JWT Signature & Expiry                             │
│  3. Extract User Claims (id, role, tenantId)                     │
│  4. Add Claims to Request Context                                │
│  5. Check Role-Based Permissions                                 │
│  6. Forward to Subgraphs with User Context                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   USERS      │   │  CAMPAIGNS   │   │  ANALYTICS   │
│   SERVICE    │   │   SERVICE    │   │   SERVICE    │
│  - Validate  │   │  - Check     │   │  - Verify    │
│    User      │   │    User      │   │    Access    │
│  - Process   │   │  - Process   │   │  - Process   │
│    Request   │   │    Request   │   │    Request   │
└──────────────┘   └──────────────┘   └──────────────┘
```

## 3. Campaign Creation Flow

```
┌──────────────┐
│   CLIENT     │
│  React App   │
└──────┬───────┘
       │ 1. Create Campaign Mutation
       │    { name, budget, channels, dates }
       ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WUNDERGRAPH GATEWAY                           │
│  1. Validate JWT Token                                          │
│  2. Extract User Context (userId, tenantId, role)               │
│  3. Validate User Permissions (campaign:create)                 │
│  4. Add x-tenant-id and authorization headers                   │
│  5. Route to Campaign Service                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                  CAMPAIGN SERVICE (Port 4002)                     │
│  1. Receive CreateCampaign Request                              │
│  2. Extract Tenant Context from Headers                          │
│                                                              ↓ │
│  3. CAMPAIGNS RESOLVER                                          │
│     - Extract Arguments                                         │
│     - Call CampaignsService.create()                            │
│                                                              ↓ │
│  4. CAMPAIGNS SERVICE                                           │
│     - Validate Input Data                                       │
│     - Validate Campaign Dates (startDate < endDate)            │
│     - Validate Channel Budgets (sum ≤ total budget)           │
│     - Call CampaignRepository.create()                          │
│                                                              ↓ │
│  5. CAMPAIGN REPOSITORY                                         │
│     - Create MongoDB Document                                   │
│     - Apply Indexes Automatically                               │
│     - Return Created Campaign                                   │
│                                                              ↑ │
│  6. CAMPAIGNS SERVICE                                           │
│     - Return Campaign to Resolver                                │
│                                                              ↑ │
│  7. CAMPAIGNS RESOLVER                                          │
│     - Return GraphQL Response                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WUNDERGRAPH GATEWAY                           │
│  1. Receive Campaign Response                                   │
│  2. Apply Response Caching (if applicable)                       │
│  3. Return to Client                                           │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌──────────────┐
│   CLIENT     │
│  Displays    │
│  Created     │
│  Campaign    │
└──────────────┘
```

## 4. Multi-Service Query Flow (GraphQL Federation)

```
┌──────────────┐
│   CLIENT     │
│  Query:      │
│  {           │
│    campaign(id: "1") {│
│      name     │
│      budget   │
│      owner {  │
│        name   │
│        email  │
│      }       │
│      analytics {│
│        roi    │
│        ctr     │
│      }       │
│    }         │
│  }           │
└──────┬───────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WUNDERGRAPH GATEWAY                           │
│  1. Parse GraphQL Query                                          │
│  2. Identify Required Fields:                                    │
│     - campaign.name, campaign.budget (Campaign Service)          │
│     - campaign.owner.name, campaign.owner.email (User Service)   │
│     - campaign.analytics.roi, campaign.analytics.ctr (Analytics) │
│  3. Generate Query Plans for Each Subgraph                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   USERS      │   │  CAMPAIGNS   │   │  ANALYTICS   │
│   SERVICE    │   │   SERVICE    │   │   SERVICE    │
│  Query:      │   │  Query:      │   │  Query:      │
│  {           │   │  {           │   │  {           │
│    user(id:  │   │    campaign( │   │    analytics(│
│    "owner-id")│   │     id: "1") │   │     campaignId:│
│    {         │   │    {         │   │     "1") {   │
│      name    │   │      name    │   │      roi     │
│      email   │   │      budget   │   │      ctr     │
│    }         │   │      owner {  │   │    }         │
│  }           │   │        __typename │  }           │
│              │   │        id      │   │              │
│              │   │      }         │   │              │
│              │   │    }         │   │              │
│              │   │  }           │   │              │
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WUNDERGRAPH GATEWAY                           │
│  1. Receive Responses from All Subgraphs                        │
│  2. Apply Entity Resolution (@key directives)                   │
│     - Match campaign.owner.id → user.id                         │
│     - Match analytics.campaignId → campaign.id                   │
│  3. Merge Responses into Unified Result                          │
│  4. Return Composed Response to Client                           │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌──────────────┐
│   CLIENT     │
│  Receives    │
│  Unified     │
│  Response    │
└──────────────┘
```

## 5. AI Recommendation Generation Flow

```
┌──────────────┐
│   CLIENT     │
│  Requests    │
│  Campaign    │
│  Recommendations
└──────┬───────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WUNDERGRAPH GATEWAY                           │
│  1. Route to Analytics Service                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                  ANALYTICS SERVICE (Port 4003)                   │
│  1. Fetch Campaign Analytics Data                                │
│     - Channel Performance Metrics                                 │
│     - Temporal Performance Patterns                              │
│     - Historical Data Trends                                    │
│                                                              ↓ │
│  2. Call AI Recommendation Service                                │
│     - Pass Analytics Data                                        │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                AI RECOMMENDATION ENGINE                            │
│  1. ANALYZE CHANNEL PERFORMANCE                                 │
│     - Calculate ROI per channel                                   │
│     - Identify underperforming channels                          │
│     - Identify overperforming channels                           │
│                                                              ↓ │
│  2. GENERATE BUDGET RECOMMENDATIONS                              │
│     - Suggest budget reallocation                                │
│     - Calculate estimated ROI improvement                         │
│     - Determine confidence score                                  │
│                                                              ↓ │
│  3. GENERATE CHANNEL RECOMMENDATIONS                             │
│     - Analyze CTR (Click-Through Rate)                           │
│     - Suggest creative improvements                              │
│     - Recommend A/B testing strategies                           │
│                                                              ↓ │
│  4. GENERATE TIMING RECOMMENDATIONS                              │
│     - Analyze temporal patterns                                  │
│     - Identify optimal time slots                               │
│     - Suggest scheduling adjustments                              │
│                                                              ↓ │
│  5. PRIORITIZE RECOMMENDATIONS                                   │
│     - Sort by impact and confidence                              │
│     - Assign priority levels (Critical, High, Medium, Low)       │
│                                                              ↓ │
│  6. STORE RECOMMENDATIONS                                        │
│     - Save to MongoDB with metadata                              │
│     - Mark as PENDING_REVIEW                                     │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                  ANALYTICS SERVICE                               │
│  1. Return Generated Recommendations                             │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WUNDERGRAPH GATEWAY                           │
│  1. Return Recommendations to Client                             │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌──────────────┐
│   CLIENT     │
│  Displays    │
│  AI-Powered  │
│  Recommendations
└──────────────┘
```

## 6. Database Query Flow with Optimization

```
┌──────────────┐
│   SERVICE    │
│  Repository  │
└──────┬───────┘
       │ 1. Execute Query
       │  db.campaigns.find({ tenantId, status })
       ↓
┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB QUERY PLANNER                          │
│  1. Analyze Query Structure                                      │
│  2. Check Available Indexes                                       │
│     - Found Index: { tenantId: 1, status: 1, startDate: -1 }     │
│  3. Determine Optimal Execution Plan                             │
│     - Use Compound Index (Covering Query)                        │
│     - Index Scan instead of Collection Scan                       │
│  4. Generate Execution Plan                                      │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB EXECUTION                             │
│  1. Execute Index Scan                                          │
│     - Navigate B-Tree Index Structure                            │
│     - Find Matching Documents Efficiently                         │
│  2. Fetch Document Data                                          │
│     - If covering index, fetch from index only                  │
│     - Otherwise, fetch from collection                           │
│  3. Apply Additional Filters                                     │
│  4. Sort Results (if required)                                   │
│  5. Apply Pagination (if required)                               │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    RESULT PROCESSING                              │
│  1. Transform Documents to Domain Objects                       │
│  2. Apply Business Logic Transformations                         │
│  3. Return Results to Service Layer                              │
└──────────────────────────┬──────────────────────────────────────┘
                           ↑
┌──────────────┐
│   SERVICE    │
│  Receives    │
│  Optimized   │
│  Results     │
└──────────────┘
```

## 7. Error Handling Flow

```
┌──────────────┐
│   CLIENT     │
│  Makes Request
└──────┬───────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WUNDERGRAPH GATEWAY                           │
│  1. Validate Request                                            │
│     - If Invalid: Return 400 Bad Request                         │
│  2. Authenticate                                                │
│     - If Failed: Return 401 Unauthorized                        │
│  3. Authorize                                                    │
│     - If Denied: Return 403 Forbidden                           │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SUBGRAPH SERVICE                              │
│  1. Validate Input                                               │
│     - If Invalid: Throw ValidationException                      │
│  2. Business Logic Validation                                    │
│     - If Failed: Throw ConflictException or BadRequestException  │
│  3. Database Operation                                          │
│     - If Error: Throw DatabaseException                         │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓ (Exception)
┌─────────────────────────────────────────────────────────────────┐
│                    NESTJS EXCEPTION FILTER                        │
│  1. Catch Exception                                             │
│  2. Determine Exception Type                                     │
│  3. Map to Appropriate HTTP Status Code                          │
│  4. Format Error Response                                        │
│     {                                                           │
│       statusCode: 400,                                          │
│       message: "Error description",                              │
│       error: "VALIDATION_ERROR",                                │
│       timestamp: "2024-01-15T10:30:00Z"                         │
│     }                                                           │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WUNDERGRAPH GATEWAY                           │
│  1. Receive Error Response                                      │
│  2. Log Error (with correlation ID)                             │
│  3. Return Error to Client                                      │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌──────────────┐
│   CLIENT     │
│  Displays    │
│  Error Message
└──────────────┘
```

## 8. Caching Flow

```
┌──────────────┐
│   CLIENT     │
│  Makes Request
└──────┬───────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WUNDERGRAPH GATEWAY                           │
│  1. Check Cache (Redis)                                          │
│     - Key: hash(operationName + variables + userId)              │
│     - If Cache Hit: Return Cached Response                       │
│     - If Cache Miss: Continue to Subgraphs                      │
│                                                              ↓ │
│  2. Forward to Subgraphs (if cache miss)                         │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌──────────────┐
│  SUBGRAPHS   │
│  Execute     │
│  Queries     │
└──────┬───────┘
       │
       ↓
┌─────────────────────────────────────────────────────────────────┐
│                    WUNDERGRAPH GATEWAY                           │
│  1. Receive Response from Subgraphs                             │
│  2. Compose Unified Response                                     │
│  3. Store in Cache (if cacheable)                                │
│     - Set TTL based on data volatility                           │
│     - Use stale-while-revalidate for better UX                   │
│  4. Return Response to Client                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌──────────────┐
│   CLIENT     │
│  Receives    │
│  Response    │
└──────────────┘
```

These flow diagrams demonstrate the complete request lifecycle, authentication flow, multi-service query composition, AI recommendation generation, database optimization, error handling, and caching strategies in the Digital Marketing Planning Platform.
