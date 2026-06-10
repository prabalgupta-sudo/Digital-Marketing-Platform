# Digital Marketing Planning Platform

An enterprise-grade full-stack application for managing marketing campaigns, budgets, and performance analytics, designed for marketing agencies and enterprises.

## 🏗️ Architecture

**Microservices Architecture with GraphQL Federation:**
- **User Service** (Port 4001): User management, authentication, teams
- **Campaign Service** (Port 4002): Campaign management, budgets, channels
- **Analytics Service** (Port 4003): KPIs, metrics, recommendations
- **WunderGraph Gateway** (Port 9999): Unified API composition

**Technology Stack:**
- **Backend**: NestJS, TypeScript, GraphQL Federation
- **Frontend**: React, TypeScript, React Query, Redux Toolkit
- **Database**: MongoDB with optimized indexes and aggregations
- **API Gateway**: WunderGraph for type-safe API composition
- **DevOps**: Docker, Docker Compose, AWS deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6.0+
- Docker and Docker Compose (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/marketing-platform.git
cd marketing-platform

# Install dependencies for each service
cd apps/user-service && npm install
cd ../campaign-service && npm install
cd ../analytics-service && npm install
cd ../../wundergraph && npm install
```

### Running with Docker

```bash
# Start all services
docker-compose up -d

# Check service health
docker-compose ps

# View logs
docker-compose logs -f
```

### Running Locally

```bash
# Start MongoDB (or use Docker)
docker-compose -f docker-compose.dev.yml up -d

# Start User Service
cd apps/user-service
npm run start:dev

# Start Campaign Service (new terminal)
cd apps/campaign-service
npm run start:dev

# Start Analytics Service (new terminal)
cd apps/analytics-service
npm run start:dev

# Start WunderGraph (new terminal)
cd wundergraph
npm run start
```

### Access Points

- **WunderGraph Gateway**: http://localhost:9999
- **User Service**: http://localhost:4001/graphql
- **Campaign Service**: http://localhost:4002/graphql
- **Analytics Service**: http://localhost:4003/graphql
- **MongoDB**: mongodb://localhost:27017

## 📚 Documentation

### Architecture Documentation
- [System Architecture](ARCHITECTURE.md) - High-level system design
- [Database Design](DATABASE_DESIGN.md) - MongoDB schema and optimization
- [Project Structure](PROJECT_STRUCTURE.md) - Monorepo organization
- [WunderGraph Architecture](WUNDERGRAPH_ARCHITECTURE.md) - API gateway design

### Development Guides
- [SOLID Principles](SOLID_PRINCIPLES.md) - Design patterns implementation
- [Dependency Injection](DEPENDENCY_INJECTION.md) - NestJS DI patterns
- [AI-Assisted Development](AI_ASSISTED_DEVELOPMENT.md) - AI tools usage
- [Interview Preparation](INTERVIEW_PREPARATION.md) - Technical discussion guide

## 🔧 Development

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Run tests with coverage
npm run test:cov
```

### Building

```bash
# Build all services
npm run build

# Build specific service
cd apps/user-service && npm run build
```

## 🏛️ Design Patterns

### SOLID Principles
- **Single Responsibility**: Clear separation of concerns across layers
- **Open/Closed**: Extensible through interfaces and implementations
- **Liskov Substitution**: Interface-based dependency injection
- **Interface Segregation**: Focused, specific interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

### Architectural Patterns
- **Repository Pattern**: Data access abstraction
- **Service Layer Pattern**: Business logic encapsulation
- **Factory Pattern**: Dynamic service creation
- **Strategy Pattern**: Pluggable algorithms
- **Dependency Injection**: Loose coupling and testability

## 🎯 Features

### User Management
- User authentication and authorization
- Role-based access control (RBAC)
- Team management
- Multi-tenancy support

### Campaign Management
- Campaign lifecycle management
- Budget allocation and tracking
- Channel management (Google, Meta, TikTok, TV, Print)
- Campaign scheduling and automation

### Analytics & Insights
- Real-time KPI tracking
- Performance metrics calculation
- AI-powered recommendations
- Custom report generation

### API Gateway
- Unified GraphQL API via WunderGraph
- Type-safe client generation
- Authentication and authorization
- Request caching and optimization

## 🔐 Security

- **Authentication**: JWT-based with refresh tokens
- **Authorization**: Role-based and attribute-based access control
- **Data Protection**: Encryption at rest and in transit
- **Multi-Tenancy**: Tenant isolation with header-based context
- **API Security**: Rate limiting, input validation, SQL injection prevention

## 📊 Performance

### Database Optimization
- Compound indexes for common query patterns
- Aggregation pipelines for complex analytics
- Query optimization with execution plan analysis
- Connection pooling and query batching

### Caching Strategy
- Multi-layer caching (Redis, application, CDN)
- Cache invalidation strategies
- TTL optimization based on data volatility
- Cache warming for critical paths

### GraphQL Optimization
- DataLoader for N+1 query prevention
- Query complexity analysis
- Response caching at multiple levels
- Field-level resolution for expensive operations

## 🧪 Testing

### Test Coverage
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for critical user flows
- Contract tests for GraphQL schema compliance

### Test Tools
- Jest for unit and integration tests
- Supertest for API testing
- GraphQL Code Generator for type safety
- Docker Compose for test environment

## 🚀 Deployment

### Docker Deployment
```bash
# Build and start all services
docker-compose up -d

# Scale services
docker-compose up -d --scale user-service=3

# View logs
docker-compose logs -f user-service
```

### AWS Deployment
- **ECS**: Container orchestration
- **EKS**: Kubernetes-based deployment
- **DocumentDB**: Managed MongoDB
- **ElastiCache**: Managed Redis
- **ALB**: Load balancing
- **CloudWatch**: Monitoring and logging

## 🤖 AI Features

### Recommendation Engine
- Budget optimization suggestions
- Channel performance analysis
- ROI prediction and forecasting
- Anomaly detection and alerts

### AI-Assisted Development
- GitHub Copilot for code suggestions
- Cursor IDE for refactoring
- Claude for architecture decisions
- ChatGPT for test generation and documentation

## 📈 Monitoring

### Health Checks
- Service health endpoints
- Database connection monitoring
- Dependency health tracking
- Automated recovery procedures

### Logging
- Structured JSON logging
- Request/response correlation
- Error tracking and alerting
- Performance metrics

### Observability
- Distributed tracing with OpenTelemetry
- Application performance monitoring
- Business metrics tracking
- Custom dashboards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## 📝 License

MIT License - Free for commercial and personal use

## 👥 Team

- **Principal Architect**: [Your Name]
- **Backend Team**: NestJS, GraphQL, MongoDB specialists
- **Frontend Team**: React, TypeScript, UI/UX experts
- **DevOps Team**: Docker, AWS, CI/CD engineers
- **Data Team**: Analytics, AI/ML specialists

## 📞 Support

For support and questions:
- GitHub Issues: [Report a bug or request a feature](https://github.com/your-org/marketing-platform/issues)
- Documentation: [Project Wiki](https://github.com/your-org/marketing-platform/wiki)
- Discussions: [GitHub Discussions](https://github.com/your-org/marketing-platform/discussions)

---

**Built with ❤️ by Prabal Gupta**

*This project demonstrates enterprise-grade full-stack development with modern architecture patterns, best practices, and production-ready code quality.*
