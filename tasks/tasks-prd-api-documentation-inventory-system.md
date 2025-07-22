## Relevant Files

- `scripts/service-discovery.js` - Read-only script to scan directories and identify all services from automate-trunk to tcct-serviceabstraction-dev
- `scripts/api-analyzer.js` - Static code analysis engine for reading source files and extracting endpoint information
- `scripts/schema-extractor.js` - File parser to extract schemas from type definitions and validation code
- `scripts/dependency-mapper.js` - Static analysis tool to detect external API calls by reading import statements and HTTP client usage
- `scripts/output-generator.js` - Documentation generator that creates Markdown, OpenAPI, and JSON/YAML from analyzed data
- `templates/api-inventory-template.md` - Standard template for service API documentation
- `templates/openapi-template.yaml` - OpenAPI specification template for services
- `config/analysis-config.json` - Configuration file for analysis rules and output formats
- `data/service-inventory.json` - Master inventory of all discovered services and their metadata
- `data/dependency-map.json` - Complete service dependency mapping data
- `dashboard/index.html` - Interactive API explorer dashboard interface
- `dashboard/assets/dependency-graph.js` - Dependency visualization component
- `.analysis/` - **Primary analysis directory organized by service**
  - `.analysis/azure-ocr-trunk/` - Complete analysis results for azure-ocr-trunk service
  - `.analysis/obk-mtel-bms-trunk/` - Complete analysis results for obk-mtel-bms-trunk service
  - `.analysis/[service-name]/` - Analysis results for each corresponding service
- `output/` - **Legacy/backup directory** containing generated documentation files

### Notes

- **CRITICAL**: Process exactly ONE folder at a time - never skip or batch process multiple folders
- Each folder analysis must be 100% complete before moving to the next folder
- **MANDATORY**: Git commit and push to remote repository after each folder is completed
- Generated documentation should follow consistent formatting across all folders
- Use structured JSON/YAML for data interchange between analysis components
- Maintain strict folder processing checklist to ensure all 37+ folders are covered
- Each folder should have its own api-inventory.md, openapi.yaml, and dependency-map.json files
- **Analysis Organization**: All analysis results stored in `.analysis/[service-name]/` directory structure for easy future reference
- Progress tracking is essential: always know which folder is currently being processed and how many remain
- **READ-ONLY OPERATION**: No code execution, no testing, no service startup - only file reading and analysis
- All scripts are simple file readers and parsers - no complex execution required

### Processing Protocol (Per @process-api-tasks.mdc Rule)

**For Each Service Processing:**
1. **Run Analysis**: `node scripts/api-analyzer.js [service-name]` (saves to `.analysis/[service-name]/`)
2. **Generate Documentation**: `node scripts/output-generator.js .analysis/[service-name]/[service-name]-analysis.json [service-name]`
3. **Immediate Commit**: `git add . && git commit -m "docs: API analysis for [service-name]" && git push`
4. **Update Task List**: Mark service as `[x]` with metrics
5. **Update Progress Counter**: Increment completion count (e.g., 2/37 COMPLETED)
6. **Continue Automatically**: Move to next service without user approval

**Error Handling Protocol:**
- **Stop processing** if any service analysis fails
- **Report specific errors** and suggested fixes
- **Resume processing** from the failed service after fixes
- **Never skip services** - all 37 must be completed

**Quality Validation Per Service:**
- Verify all endpoints discovered and documented
- Confirm schemas and dependencies extracted
- Validate generated files exist in `.analysis/[service-name]/` directory:
  - `[service-name]-analysis.json` (raw analysis data)
  - `api-inventory.md` (human-readable documentation)
  - `openapi.yaml` (API specification)
  - `dependency-map.json` (dependency tracking)
- Ensure git commit successful before proceeding

## Tasks

- [x] 1.0 Complete Service Discovery and Folder Inventory (Read-Only)
  - [x] 1.1 Create directory listing script to read folder structure and identify ALL folders from automate-trunk to tcct-serviceabstraction-dev
  - [x] 1.2 Generate complete list of all 37+ OBK service folders by reading directory contents
  - [x] 1.3 Implement folder validation by checking for common project files (package.json, pom.xml, etc.)
  - [x] 1.4 Create service identification logic by reading configuration files to detect project types and frameworks
  - [x] 1.5 Build master folder inventory JSON file listing all discovered services
  - [x] 1.6 Set up configuration file for file patterns to analyze per framework type
  - [x] 1.7 Create progress tracking file to monitor which folders have been analyzed
  - [x] 1.8 Implement validation by comparing discovered folders against expected service count

- [x] 2.0 Static Code Analysis Engine Development (Read-Only)
  - [x] 2.1 Build file pattern detection to identify framework type by reading package.json, pom.xml, requirements.txt, etc.
  - [x] 2.2 Implement route file parsing to extract API endpoints from Express routes, Spring controllers, FastAPI decorators
  - [x] 2.3 Create regex patterns to extract query parameters and path variables from route definitions
  - [x] 2.4 Build header detection by parsing middleware files and authentication decorators
  - [x] 2.5 Implement type definition parsing to extract request/response schemas from TypeScript, Java classes, Python types
  - [x] 2.6 Create example payload inference from validation rules and type definitions found in code
  - [x] 2.7 Build error response detection by parsing error handling code and exception definitions
  - [x] 2.8 Implement file-by-file reading with memory management for large codebases

- [x] 3.0 Per-Folder Documentation Generation and Git Management
  - [x] 3.1 Create standardized Markdown template for api-inventory.md files per folder
  - [x] 3.2 Build OpenAPI/Swagger specification generator for individual folder analysis
  - [x] 3.3 Implement JSON/YAML structured data export for each folder's APIs
  - [x] 3.4 Create folder-specific documentation generation that stores files in each service repository
  - [x] 3.5 Build consistent formatting system for individual folder documentation
  - [x] 3.6 Implement validation to ensure 100% documentation completeness for each folder's endpoints
  - [x] 3.7 Create git commit system to commit documentation after each folder is completed
  - [x] 3.8 Implement git push automation to remote repository after each folder analysis
  - [x] 3.9 Create folder completion checklist and status tracking system

- [x] 4.0 Per-Folder Dependency Mapping and Tracking
  - [x] 4.1 Build external dependency detection system for third-party API calls per folder
  - [x] 4.2 Implement internal service-to-service dependency mapping for each individual folder
  - [x] 4.3 Create external API endpoint URL and method tracking with authentication details per folder
  - [x] 4.4 Build indirect dependency detection through shared resources and databases per folder
  - [x] 4.5 Implement data flow pattern analysis and communication protocol documentation per folder
  - [x] 4.6 Create service dependency hierarchy and criticality level assessment for each folder
  - [x] 4.7 Generate folder-specific dependency map JSON file after each folder analysis
  - [x] 4.8 Update master dependency map after each folder completion
  - [x] 4.9 Commit and push dependency documentation after each folder is processed

- [ ] 5.0 Folder-by-Folder Processing Execution and Quality Assurance **[PROGRESS: 0/37 COMPLETED - 0%]**

### 5.1 Service Processing Workflow (Per @process-api-tasks.mdc Rule)

**Processing Commands for Each Service:**
```bash
# For each service in the checklist below:
node scripts/api-analyzer.js [service-name]
node scripts/output-generator.js .analysis/[service-name]/[service-name]-analysis.json [service-name]
git add . && git commit -m "docs: API analysis for [service-name]" && git push
# Update task list: Mark service as [x] with endpoint/schema/dependency counts
# Update progress counter (e.g., 2/37 COMPLETED)
# Continue automatically to next service
```

**Automation Rules:**
- ✅ **No user approval required** between services once processing starts
- ✅ **Automatic progression** through the service list in order listed
- ⚠️ **Stop only on errors** - report issues and wait for fixes
- ✅ **Quality validation** after each service completion

### 5.2 Service Processing Checklist - Complete Analysis for Each Service (0/37 Completed - 0%)

#### 🔄 **ENHANCED REPROCESSING REQUIRED (0/37 - 0%):**

**⚠️ CRITICAL UPDATE: Previous analysis missed 300+ .NET/C# endpoints. Enhanced api-analyzer.js now supports:**
- **✅ .NET/C# ASP.NET Core** - Full controller pattern detection
- **✅ Express.js/Node.js** - Enhanced route extraction  
- **✅ FastAPI/Python** - Comprehensive decorator patterns
- **✅ Next.js API Routes** - Advanced route detection
- **✅ Spring Boot/Java** - Controller annotation patterns
- **✅ Go Frameworks** - Gin/Fiber endpoint detection
- **✅ NestJS** - Decorator-based routing
- **✅ Multiple Schemas** - Enhanced type extraction across all frameworks

**API Services with Endpoints:**
- [ ] **azure-ocr-trunk** - FastAPI/Python - Pending enhanced analysis
- [ ] **obk-mtel-bms-trunk** - Express.js - Pending enhanced analysis
- [ ] **obk-mtel-bus-trunk** - Express.js - Pending enhanced analysis
- [ ] **obk-parking-trunk** - Express.js - Pending enhanced analysis
- [ ] **obk-mtel-document-trunk** - Express.js - Pending enhanced analysis
- [ ] **obk-mtel-iam-trunk** - Express.js - Pending enhanced analysis
- [ ] **obk-mtel-notification-trunk** - Express.js - Pending enhanced analysis
- [ ] **obk-mtel-websocket-trunk** - Express.js - Pending enhanced analysis
- [ ] **obk-wiremock-trunk** - Express.js - Pending enhanced analysis

**Infrastructure/Automation Services:**
- [ ] **crontab-trunk** - Cron/Scheduling - Pending enhanced analysis

**Next.js/React Web Applications:**
- [ ] **obk-app-universal-link-trunk** - Next.js - Pending enhanced API route analysis
- [ ] **obk-campaign-web-trunk** - Next.js - Pending enhanced API route analysis
- [ ] **obk-parking-payment-dev** - Next.js - Pending enhanced API route analysis
- [ ] **obk-wifi-auth-web-trunk** - Next.js - Pending enhanced API route analysis
- [ ] **resize-service-trunk** - Next.js - Pending enhanced API route analysis

**Services with Dependencies (No Direct APIs):**
- [ ] **obk-cms-trunk** - Pending enhanced dependency analysis
- [ ] **obk-indoor-navigation-trunk** - Pending enhanced dependency analysis
- [ ] **obk-predict-location-main** - Flask/Python - Pending enhanced analysis

**Configuration/Support Services:**
- [ ] **MapGeoJsonTool-trunk** - Pending enhanced analysis
- [ ] **automate-trunk** - Pending enhanced analysis
- [ ] **flutter-login-trunk** - Flutter/Dart - Pending enhanced analysis
- [ ] **keycloak-trunk** - Pending enhanced analysis
- [ ] **obk-app-temp-trunk** - Pending enhanced analysis
- [ ] **obk-art-culture-api-trunk** - Go/Fiber - Pending enhanced analysis
- [ ] **obk-booking-trunk** - Pending enhanced analysis
- [ ] **obk-infra-trunk** - Pending enhanced analysis
- [ ] **obk-marcom-trunk** - Pending enhanced analysis
- [ ] **obk-operation-app-trunk** - Flutter/Dart - Pending enhanced analysis
- [ ] **obk-operation-backend-dev** - .NET Core/C# - **CRITICAL: Expected 350+ endpoints**
- [ ] **obk-pms-trunk** - Pending enhanced analysis
- [ ] **obk-residential-ipad-trunk** - Pending enhanced analysis
- [ ] **obk-sso-trunk** - NestJS - Pending enhanced analysis
- [ ] **obk-sustainable-trunk** - Pending enhanced analysis
- [ ] **one-bangkok-app-trunk** - Pending enhanced analysis
- [ ] **onebangkok-trunk** - Pending enhanced analysis
- [ ] **redirect-onebangkok-trunk** - Pending enhanced analysis
- [ ] **tcct-serviceabstraction-dev** - .NET Core/C# - **CRITICAL: Expected 350+ endpoints**

## **🔄 ENHANCED REPROCESSING REQUIRED:**

**⚠️ CRITICAL ISSUE IDENTIFIED:**
- **Previous Analysis**: Found only 23 total endpoints across all services
- **Actual Evidence**: Found 354+ HTTP endpoint attributes in tcct-serviceabstraction-dev alone
- **Root Cause**: api-analyzer.js only supported JavaScript/TypeScript patterns, completely missing .NET/C#, Java, Go, and other frameworks

**✅ ENHANCED CAPABILITIES:**
- **🆕 .NET/C# ASP.NET Core**: Full `[HttpGet]`, `[HttpPost]`, `[Route]` controller pattern detection
- **🔥 Express.js/Node.js**: Enhanced route extraction with middleware patterns
- **🎆 FastAPI/Python**: Comprehensive decorator and async patterns
- **⚙️ Next.js API Routes**: Advanced `pages/api/` and `app/api/route.ts` detection
- **☕ Spring Boot/Java**: `@RestController`, `@RequestMapping` annotation patterns
- **🚀 Go Frameworks**: Gin/Fiber endpoint detection with struct binding
- **🐱 NestJS**: Decorator-based routing with dependency injection
- **📈 Schema Extraction**: Enhanced type detection across all frameworks

**🏁 EXPECTED RESULTS:**
- **Estimated Total Endpoints**: 500-1000+ (vs previous 23)
- **Major Services**: tcct-serviceabstraction-dev (~350 endpoints), obk-operation-backend-dev (~200+ endpoints)
- **Complete Coverage**: All 37 services with accurate endpoint counts
- **Framework Detection**: Proper identification of all technology stacks

### 5.3 Processing Infrastructure Tasks
  - [ ] 5.3.1 Implement folder processing checklist with mandatory validation before moving to next folder
  - [ ] 5.3.2 Create automated git commit with descriptive message after each folder completion
  - [ ] 5.3.3 Implement automated git push to remote repository after each folder documentation
  - [ ] 5.3.4 Build progress tracking system showing X of 37+ folders completed
  - [ ] 5.3.5 Implement quality assurance validation to ensure no folders are skipped

### 5.4 Final Consolidation Tasks (Execute ONLY after all 37 services completed) ⏳ PENDING
  - [ ] 5.4.1 Create final consolidation step only after ALL 37+ folders are individually processed
  - [ ] 5.4.2 Build searchable and filterable API explorer interface using all folder data
  - [ ] 5.4.3 Create service dependency visualization with interactive graphs from all folders
  - [ ] 5.4.4 Implement cross-service API discovery and search functionality across all processed folders
  - [ ] 5.4.5 Build export capabilities for filtered results and custom reports
  - [ ] 5.4.6 Create responsive design for various screen sizes and devices
  - [ ] 5.4.7 Generate final master documentation consolidating all 37+ folders
  - [ ] 5.4.8 Perform final validation that all folders have been processed and documented 