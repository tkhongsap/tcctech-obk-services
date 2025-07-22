# API Services Documentation Project

## Project Overview
This repository contains multiple service directories (target: ~30 services), each representing an unzipped repo that provides specific API services for the overall application ecosystem. The primary goal is to **document and understand** the API services from each directory, not to build features or integrate services.

## Current Services
- `obk-mtel-iam-trunk/` - Identity and Access Management service (Node.js/TypeScript)
- `obk-operation-backend-dev/` - Operations backend service (C#/.NET)
- `tcct-serviceabstraction-dev/` - Service abstraction layer (C#/.NET)
- *(More services will be added gradually)*

## Documentation Approach

### Service Analysis Framework
When analyzing each service directory, follow this systematic approach:

#### 1. Technology Stack Identification
- **Node.js/TypeScript**: Look for `package.json`, `tsconfig.json`, `src/` structure
- **C#/.NET**: Look for `*.csproj`, `Program.cs`, `Controllers/` directory
- **Python**: Look for `requirements.txt`, `main.py`, `app.py`
- **Java**: Look for `pom.xml`, `build.gradle`, `src/main/java/`
- **Other**: Identify based on configuration files and directory structure

#### 2. API Endpoint Discovery
- **Express.js/TSOA**: Check `src/controllers/`, `tsoa.json`, route definitions
- **.NET**: Examine `Controllers/` directory, `Program.cs`, Swagger configuration
- **FastAPI/Flask**: Look for route decorators, API blueprints
- **Spring Boot**: Check `@RestController` classes, `@RequestMapping` annotations

#### 3. Service Purpose & Capabilities
- Read `README.md`, `package.json` description, or project documentation
- Analyze controller names and method signatures
- Examine database migrations and schema files
- Review configuration files for external integrations

#### 4. Database Schema Analysis
- **Prisma**: Check `schema.prisma`, `migrations/` directory
- **Entity Framework**: Look for `DbContext` classes, migration files
- **Sequelize**: Examine model definitions and migration files
- **Other ORMs**: Identify based on configuration and model files

#### 5. External Integrations
- Review configuration files for third-party services
- Check service classes for external API calls
- Identify authentication providers, payment gateways, notification services
- Document inter-service communication patterns

### Documentation Standards

#### Service Documentation Template
```
## [Service Name]
**Purpose**: Brief description of service functionality
**Technology**: Main framework and language
**Database**: Database type and ORM used

### API Endpoints
- `GET /api/endpoint` - Description
- `POST /api/endpoint` - Description
- etc.

### Key Features
- Feature 1
- Feature 2
- etc.

### External Integrations
- Integration 1: Purpose
- Integration 2: Purpose
- etc.

### Database Models
- Model 1: Purpose and key fields
- Model 2: Purpose and key fields
- etc.
```

#### Service Categorization
Organize services by primary function:
- **Authentication & Authorization** (IAM, Auth services)
- **Core Operations** (Business logic, workflows)
- **Data & Integration** (Service abstraction, data processing)
- **Mobile & Frontend** (API gateways, mobile backends)
- **Infrastructure & Utilities** (Logging, monitoring, tools)

### Analysis Guidelines

#### Read-Only Exploration
- Use file reading tools to understand service structure
- Analyze configuration files, schemas, and API definitions
- Document findings without modifying any files
- Focus on understanding service capabilities and relationships

#### Systematic Documentation
1. Start with service overview and technology identification
2. Map out main API endpoints and their purposes
3. Document key business logic and workflows
4. Identify external dependencies and integrations
5. Create service relationship diagrams where helpful

#### Consistency Standards
- Use consistent naming conventions for service documentation
- Maintain uniform API endpoint documentation format
- Standardize external integration descriptions
- Keep database schema documentation consistent

## Constraints & Scope

### Documentation Focus Only
- **DO**: Read, analyze, and document existing services
- **DO**: Understand API capabilities and service relationships
- **DO**: Create comprehensive service architecture documentation
- **DO NOT**: Generate, modify, or run any code
- **DO NOT**: Execute commands that change system state
- **DO NOT**: Create new features or integrate services

### Scalability Considerations
- Documentation framework designed to handle ~30 services
- Consistent approach for analyzing different technology stacks
- Standardized templates for rapid service documentation
- Organized structure for easy navigation as services grow

## Next Steps
1. Systematically analyze each existing service directory
2. Create comprehensive API documentation for each service
3. Document inter-service relationships and dependencies
4. Maintain consistent documentation as new services are added