## Relevant Files

- `scripts/api-analyzer.js` - Main analysis engine for processing service data from /analysis directory
- `scripts/api-analyzer.test.js` - Unit tests for the API analyzer
- `scripts/dependency-parser.js` - Parser for dependency-map.json files across services
- `scripts/dependency-parser.test.js` - Unit tests for dependency parser
- `scripts/data-normalizer.js` - Normalizes API data from different service formats (Express.js, NestJS, etc.)
- `scripts/data-normalizer.test.js` - Unit tests for data normalizer
- `scripts/risk-calculator.js` - Calculates dependency impact scores and identifies bottlenecks
- `scripts/risk-calculator.test.js` - Unit tests for risk calculator
- `scripts/report-generator.js` - Generates comprehensive reports in multiple formats
- `scripts/report-generator.test.js` - Unit tests for report generator
- `scripts/output-generator.js` - Handles export functionality (JSON, CSV, Markdown)
- `scripts/output-generator.test.js` - Unit tests for output generator
- `src/dashboard/app.js` - Express.js server for interactive dashboard
- `src/dashboard/routes/api.js` - API routes for dashboard data access
- `src/dashboard/public/index.html` - Main dashboard HTML interface
- `src/dashboard/public/js/visualization.js` - D3.js visualization components for dependency graphs
- `src/dashboard/public/css/dashboard.css` - Dashboard styling
- `templates/report-template.md` - Markdown template for static reports
- `templates/api-usage-template.html` - HTML template for API usage reports
- `output/api-usage-analysis.json` - Generated analysis results in JSON format
- `output/dependency-map.json` - Generated dependency visualization data
- `output/reports/` - Directory for generated static reports
- `config/analysis-config.js` - Configuration for analysis parameters and thresholds

### Notes

- Analysis scripts should be placed in the `scripts/` directory for organization
- Dashboard components go in `src/dashboard/` with typical web app structure
- Generated outputs should be stored in `output/` directory with appropriate subdirectories
- Use `node scripts/api-analyzer.js` to run the main analysis
- Use `npm test` to run all tests, or `npx jest scripts/[specific-test-file]` for individual test files

## Tasks

- [ ] 1.0 Data Discovery and Parsing Infrastructure
  - [ ] 1.1 Create directory scanner to discover all services in `/analysis` directory
  - [ ] 1.2 Implement file type detection for api-inventory.md, dependency-map.json, openapi.yaml files
  - [ ] 1.3 Build markdown parser for api-inventory.md files to extract endpoints and service info
  - [ ] 1.4 Create JSON parser for dependency-map.json files to extract service relationships
  - [ ] 1.5 Implement YAML parser for openapi.yaml specifications
  - [ ] 1.6 Design data models/schemas for normalized service data structure
  - [ ] 1.7 Add error handling and validation for malformed or missing files
  - [ ] 1.8 Create logging system for tracking parsing progress and errors
  - [ ] 1.9 Write comprehensive tests for all parsing functionality

- [ ] 2.0 API Analysis Engine Development
  - [ ] 2.1 Implement API endpoint extraction from parsed service data
  - [ ] 2.2 Create algorithm to calculate API usage frequency across all services
  - [ ] 2.3 Build cross-reference system to identify APIs called by multiple services
  - [ ] 2.4 Implement service categorization by framework (Express.js, NestJS, etc.)
  - [ ] 2.5 Create data normalization logic to standardize endpoint formats
  - [ ] 2.6 Build endpoint complexity analysis based on parameters and responses
  - [ ] 2.7 Implement pattern matching to identify similar endpoints across services
  - [ ] 2.8 Create caching mechanism for processed analysis results
  - [ ] 2.9 Add configuration system for analysis parameters and thresholds

- [ ] 3.0 Dependency Analysis and Risk Assessment
  - [ ] 3.1 Build dependency graph construction from service relationship data
  - [ ] 3.2 Implement circular dependency detection algorithm
  - [ ] 3.3 Create dependency depth analysis to identify complex chains
  - [ ] 3.4 Build risk scoring algorithm based on fan-in/fan-out metrics
  - [ ] 3.5 Implement bottleneck identification for high-dependency APIs
  - [ ] 3.6 Create service criticality assessment logic
  - [ ] 3.7 Build impact score calculation considering dependent service criticality
  - [ ] 3.8 Implement flagging system for services with minimal API exposure
  - [ ] 3.9 Create architectural recommendation engine based on risk patterns

- [ ] 4.0 Report Generation and Visualization System
  - [ ] 4.1 Design and create Markdown report template for API usage analysis
  - [ ] 4.2 Build comprehensive API usage report generator with statistics
  - [ ] 4.3 Create dependency visualization using D3.js network graphs
  - [ ] 4.4 Implement bottleneck identification reports with risk highlights
  - [ ] 4.5 Build architectural improvement recommendations generator
  - [ ] 4.6 Create heat map visualization for service dependency intensity
  - [ ] 4.7 Implement bar chart generation for API usage frequency
  - [ ] 4.8 Build static HTML report generation with embedded visualizations
  - [ ] 4.9 Create PDF export functionality for presentation-ready reports

- [ ] 5.0 Dashboard and Export Functionality
  - [ ] 5.1 Set up Express.js server structure for interactive dashboard
  - [ ] 5.2 Create API routes for serving analysis data to dashboard frontend
  - [ ] 5.3 Build responsive HTML dashboard interface with navigation
  - [ ] 5.4 Implement interactive dependency graph with zoom and filter capabilities
  - [ ] 5.5 Create search and filtering functionality for services and APIs
  - [ ] 5.6 Build drill-down views for detailed service dependency analysis
  - [ ] 5.7 Implement real-time data refresh and caching for dashboard
  - [ ] 5.8 Create JSON, CSV, and Markdown export endpoints
  - [ ] 5.9 Add comprehensive error handling and user feedback systems
  - [ ] 5.10 Perform end-to-end testing and performance optimization 