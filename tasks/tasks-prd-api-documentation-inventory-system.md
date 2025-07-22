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
- `output/` - Directory containing all generated documentation files organized by service

### Notes

- **CRITICAL**: Process exactly ONE folder at a time - never skip or batch process multiple folders
- Each folder analysis must be 100% complete before moving to the next folder
- **MANDATORY**: Git commit and push to remote repository after each folder is completed
- Generated documentation should follow consistent formatting across all folders
- Use structured JSON/YAML for data interchange between analysis components
- Maintain strict folder processing checklist to ensure all 37+ folders are covered
- Each folder should have its own api-inventory.md, openapi.yaml, and dependency-map.json files
- Progress tracking is essential: always know which folder is currently being processed and how many remain
- **READ-ONLY OPERATION**: No code execution, no testing, no service startup - only file reading and analysis
- All scripts are simple file readers and parsers - no complex execution required

### Processing Protocol (Per @process-api-tasks.mdc Rule)

**For Each Service Processing:**
1. **Run Analysis**: `node scripts/api-analyzer.js [service-name]`
2. **Generate Documentation**: `node scripts/output-generator.js output/[service-name]-analysis.json [service-name]`
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
- Validate generated files exist (api-inventory.md, openapi.yaml, dependency-map.json)
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

- [ ] 5.0 Folder-by-Folder Processing Execution and Quality Assurance **[PROGRESS: 1/37 COMPLETED]**

### 5.1 Service Processing Workflow (Per @process-api-tasks.mdc Rule)

**Processing Commands for Each Service:**
```bash
# For each service in the checklist below:
node scripts/api-analyzer.js [service-name]
node scripts/output-generator.js output/[service-name]-analysis.json [service-name]
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

### 5.2 Service Processing Checklist - Complete Analysis for Each Service (1/37 Completed)

#### ✅ **COMPLETED SERVICES (1/37):**
- [x] **azure-ocr-trunk** - FastAPI/Python - 7 endpoints, 2 schemas, 11 dependencies ✓

#### 🚧 **PENDING SERVICES (36/37):**

**Express.js/Node.js Services (8 services):**
- [ ] **obk-mtel-bms-trunk** - Express.js/Node.js - [NEXT TARGET]
- [ ] **obk-mtel-bms-dev** - Express.js/Node.js  
- [ ] **obk-mtel-bms-main** - Express.js/Node.js
- [ ] **obk-parking-trunk** - Express.js/Node.js
- [ ] **obk-parking-dev** - Express.js/Node.js
- [ ] **obk-parking-main** - Express.js/Node.js
- [ ] **obk-payment-trunk** - Express.js/Node.js
- [ ] **obk-payment-dev** - Express.js/Node.js

**Next.js/React Services (4 services):**
- [ ] **obk-web-trunk** - Next.js/React
- [ ] **obk-web-dev** - Next.js/React
- [ ] **obk-web-main** - Next.js/React
- [ ] **obk-admin-trunk** - Next.js/React

**Python/FastAPI Services (1 service):**
- [x] **azure-ocr-trunk** - FastAPI/Python ✓ [COMPLETED]

**Services Requiring Framework Detection (24 services):**
- [ ] **automate-trunk** - Framework: TBD
- [ ] **automate-dev** - Framework: TBD
- [ ] **obk-admin-dev** - Framework: TBD
- [ ] **obk-admin-main** - Framework: TBD
- [ ] **obk-auth-trunk** - Framework: TBD
- [ ] **obk-auth-dev** - Framework: TBD
- [ ] **obk-auth-main** - Framework: TBD
- [ ] **obk-notification-trunk** - Framework: TBD
- [ ] **obk-notification-dev** - Framework: TBD
- [ ] **obk-notification-main** - Framework: TBD
- [ ] **obk-reporting-trunk** - Framework: TBD
- [ ] **obk-reporting-dev** - Framework: TBD
- [ ] **obk-reporting-main** - Framework: TBD
- [ ] **obk-user-trunk** - Framework: TBD
- [ ] **obk-user-dev** - Framework: TBD
- [ ] **obk-user-main** - Framework: TBD
- [ ] **obk-vehicle-trunk** - Framework: TBD
- [ ] **obk-vehicle-dev** - Framework: TBD
- [ ] **obk-vehicle-main** - Framework: TBD
- [ ] **tcct-serviceabstraction-trunk** - Framework: TBD
- [ ] **tcct-serviceabstraction-dev** - Framework: TBD
- [ ] **tcct-serviceabstraction-main** - Framework: TBD
- [ ] **obk-masterdata-trunk** - Framework: TBD
- [ ] **obk-masterdata-dev** - Framework: TBD

### 5.3 Processing Infrastructure Tasks
  - [x] 5.3.1 Implement folder processing checklist with mandatory validation before moving to next folder
  - [x] 5.3.2 Create automated git commit with descriptive message after each folder completion
  - [x] 5.3.3 Implement automated git push to remote repository after each folder documentation
  - [x] 5.3.4 Build progress tracking system showing X of 37+ folders completed
  - [x] 5.3.5 Implement quality assurance validation to ensure no folders are skipped

### 5.4 Final Consolidation Tasks (Execute ONLY after all 37 services completed)
  - [ ] 5.4.1 Create final consolidation step only after ALL 37+ folders are individually processed
  - [ ] 5.4.2 Build searchable and filterable API explorer interface using all folder data
  - [ ] 5.4.3 Create service dependency visualization with interactive graphs from all folders
  - [ ] 5.4.4 Implement cross-service API discovery and search functionality across all processed folders
  - [ ] 5.4.5 Build export capabilities for filtered results and custom reports
  - [ ] 5.4.6 Create responsive design for various screen sizes and devices
  - [ ] 5.4.7 Generate final master documentation consolidating all 37+ folders
  - [ ] 5.4.8 Perform final validation that all folders have been processed and documented 