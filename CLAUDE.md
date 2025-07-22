# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# OBK Services Documentation & Analysis Repository

This repository contains 37 microservices for the OBK (One Bangkok) platform, organized as individual service directories with comprehensive documentation and analysis tools.

## Repository Structure

- **37 Service Directories**: Each service is a self-contained application with its own technology stack
- **Documentation System**: Automated analysis with interactive dashboard (`data/`, `dashboard/`, `output/`)
- **Analysis Tools**: Scripts and templates for systematic service documentation (`scripts/`, `templates/`)
- **Archive**: Original service ZIP files in `_zipped_projects/`

## Technology Stack Landscape

### Node.js/TypeScript Services (Primary Stack - ~25 services)
**Framework**: Express.js with TSOA for OpenAPI generation
**ORM**: Prisma with PostgreSQL
**Architecture**: Controller-Service-Repository pattern

**Key Services**:
- `obk-mtel-*-trunk/` - Core microservices (IAM, BMS, Bus, Document, Notification, WebSocket)
- `obk-parking-trunk/` - Parking management service
- `obk-sso-trunk/` - Single sign-on service (NestJS)

**Common Commands**:
```bash
# Development
npm install && npm run dev     # Start development server
npm run build                  # Production build
npm test                       # Run tests with Jest
npm run lint                   # ESLint code linting
npm run format                 # Prettier formatting

# Database (Prisma)
npx prisma generate           # Generate Prisma client
npx prisma migrate dev        # Run migrations
npm run db:seed              # Seed database

# API Documentation (TSOA)
npm run openapi:build        # Generate OpenAPI specs
npm run sdk:build            # Build SDK from specs
tsoa spec-and-routes         # Generate routes and specs
```

### .NET Core/C# Services (2 major services)
**Framework**: ASP.NET Core with Clean Architecture
**Services**: `tcct-serviceabstraction-dev/`, `obk-operation-backend-dev/`
**Architecture**: Clean Architecture with CQRS pattern

**Common Commands**:
```bash
# Development
dotnet restore && dotnet run   # Restore deps and run
dotnet build                   # Build solution
dotnet watch run               # Run with hot reload
dotnet test                    # Run tests

# Database (Entity Framework)
dotnet ef migrations add <Name>  # Create migration
dotnet ef database update        # Apply migrations

# Docker builds (using Makefiles)
make release_production        # Build and push production image
make release_staging          # Build and push staging image
```

### Python Services (2 services - AI/ML focus)
**Framework**: FastAPI (`azure-ocr-trunk/`) and Flask (`obk-predict-location-main/`)
**Architecture**: Layered with async patterns

**Common Commands**:
```bash
# Environment setup
pip install -r requirements.txt
python -m venv venv && source venv/bin/activate

# Development
python main.py                # Run FastAPI application
uvicorn main:app --reload     # Run with auto-reload
python -m pytest             # Run tests
```

### Other Stacks
- **Go/Fiber**: `obk-art-culture-api-trunk/` (high-performance API)
- **Next.js/React**: `resize-service-trunk/`, `obk-campaign-web-trunk/`, etc. (web applications)
- **Flutter/Dart**: `obk-operation-app-trunk/`, `flutter-login-trunk/` (mobile apps)

## Development Workflow

### Code Quality Standards
**Node.js/TypeScript**:
- Prettier + ESLint configuration enforced
- Husky pre-commit hooks for code formatting
- Jest for unit testing

**C#/.NET**:
- EditorConfig with C# specific rules
- PascalCase types, camelCase variables
- Tabs (2 spaces), CRLF line endings

### Git Workflow
- Conventional commit format: `feat:`, `docs:`, `fix:`
- Branch naming: `*-dev`, `*-sit`, `*-uat`, `*-prod` for environments
- Current branch: `main`

### CI/CD Pipeline (GitLab)
```yaml
stages:
  - pre-build    # SAST, code quality, secret detection  
  - build        # Docker image building
  - post-build   # Container scanning
  - deploy       # Kubernetes deployment
```

### Database Patterns
- **PostgreSQL**: Primary database across most services
- **ORMs**: Prisma (Node.js), Entity Framework (.NET), GORM (Go)
- **Migrations**: ORM-managed with automated deployment
- **Setup Scripts**: `scripts/setup-db.sh` and `scripts/teardown-db.sh`

### Docker & Deployment
- **Universal Docker**: All services containerized
- **Platform**: `--platform=linux/amd64` for builds
- **Registry**: `registry.lab.tcctech.app`
- **Kubernetes**: Standard k8s.yml manifests per service
- **Environment Management**: DEV, SIT, UAT, PROD configurations

## Architecture Patterns

### Service Categories
- **Authentication & Authorization**: IAM, SSO services
- **Core Operations**: Business logic, workflow services  
- **Data & Integration**: Service abstraction, ML services
- **Mobile & Frontend**: Web applications, mobile apps
- **Infrastructure**: Utilities, monitoring, scheduling

### API Design
- **REST APIs**: Primary communication pattern
- **OpenAPI/Swagger**: Comprehensive documentation
- **SDK Generation**: Automatic client generation for inter-service calls
- **Event-Driven**: Kafka integration for async messaging

### Service Communication
- **HTTP/REST**: Primary inter-service communication
- **Event-driven**: Kafka for asynchronous messaging  
- **Service Discovery**: API Gateway patterns
- **Authentication**: Shared JWT/OAuth patterns

## Project Constraints & Focus

### Documentation-First Approach
This repository is designed for **read-only analysis and documentation** rather than active development:

- **DO**: Analyze service architectures, document APIs, map service relationships
- **DO**: Use file reading tools to understand service capabilities
- **DO NOT**: Modify service code, run services, or create new integrations
- **DO NOT**: Execute commands that change system state

### Service Analysis Framework
When analyzing services:
1. **Technology Identification**: Check package files, config files, directory structure
2. **API Discovery**: Examine controllers, route definitions, OpenAPI specs
3. **Database Analysis**: Review schema files, migrations, ORM configurations  
4. **Integration Mapping**: Document external service connections
5. **Documentation Generation**: Follow consistent templates for service docs

## Common Development Commands by Service Type

### Universal Setup Commands
```bash
# Docker operations (all services)
docker build --platform=linux/amd64 -t service:tag .
docker-compose up -d

# Database setup (services with DB scripts)
./scripts/setup-db.sh --name dbname --port 5432
./scripts/teardown-db.sh --name dbname

# Testing across stacks  
npm test        # Node.js
dotnet test     # .NET
pytest          # Python
flutter test    # Flutter
go test ./...   # Go
```

### Service-Specific Patterns
- **TSOA Services**: Run `tsoa spec-and-routes` before building
- **Prisma Services**: Always run `npx prisma generate` after schema changes
- **Entity Framework**: Use `dotnet ef` commands for database operations
- **Expo/React Native**: Use `expo start` for development

## Analysis Tools & Dashboard

The repository includes comprehensive analysis infrastructure:
- **Interactive Dashboard**: `dashboard/index.html` for service exploration
- **JSON Analysis**: Structured service metadata in `data/` directory
- **Automated Documentation**: Templates and scripts for consistent analysis
- **Progress Tracking**: 100% service coverage with validation reports

This repository represents a mature microservices documentation system with 37 services across 6 technology stacks, providing a comprehensive overview of the OBK platform architecture.