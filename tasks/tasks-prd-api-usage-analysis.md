## Relevant Files

- `scripts/api-analyzer.js` - Main analysis engine for processing service data from /analysis directory
- `scripts/api-analyzer.test.js` - Unit tests for the API analyzer
- `scripts/directory-scanner.js` - Scans /analysis directory to discover all services and their documentation files
- `scripts/file-parser.js` - Parses api-inventory.md and dependency-map.json files
- `scripts/dependency-analyzer.js` - Analyzes cross-service dependencies and identifies patterns
- `scripts/report-generator.js` - Generates analysis reports in Markdown and JSON formats
- `output/api-usage-analysis.json` - Generated analysis results in JSON format
- `output/api-usage-report.md` - Human-readable analysis report in Markdown
- `output/dependency-summary.json` - Service dependency mapping and statistics
- `output/bottleneck-report.md` - Report highlighting potential API bottlenecks
- `analysis-summary/api-usage-analysis.json` - Finalized analysis results in JSON format
- `analysis-summary/api-usage-report.md` - Finalized analysis report in Markdown
- `analysis-summary/dependency-summary.json` - Finalized dependency mapping and statistics
- `analysis-summary/bottleneck-report.md` - Finalized bottleneck report
- `config/analysis-config.js` - Configuration for analysis parameters and thresholds

### Notes

- Run analysis with: `node scripts/api-analyzer.js`
- Generated reports will be saved in both `output/` and `analysis-summary/` directories
- Use `npm test` to run tests, or `npx jest scripts/[test-file]` for specific tests
- Analysis focuses on static documentation in `/analysis` directory, not live APIs

## Tasks

- [x] 1.0 Directory Discovery and File Parsing
  - [x] 1.1 Create directory scanner to discover all services in `/analysis` directory
  - [x] 1.2 Implement parser for api-inventory.md files to extract API endpoints
  - [x] 1.3 Implement parser for dependency-map.json files to extract service relationships  
  - [x] 1.4 Create data validation to handle missing or malformed files
  - [x] 1.5 Build normalized data structure for storing parsed service information
  - [x] 1.6 Add error handling and logging for parsing issues
  - [x] 1.7 Write tests for directory scanning and file parsing functionality

- [ ] 2.0 API Usage Analysis Engine
  - [ ] 2.1 Implement API endpoint extraction and normalization across services
  - [ ] 2.2 Create frequency counting algorithm to track API usage across services
  - [ ] 2.3 Build cross-reference system to identify shared APIs between services
  - [ ] 2.4 Implement framework categorization (Express.js, NestJS, etc.)
  - [ ] 2.5 Create algorithm to detect potential API bottlenecks (high fan-in)
  - [ ] 2.6 Add dependency pattern analysis to identify unusual service behaviors
  - [ ] 2.7 Write comprehensive tests for analysis algorithms

- [ ] 3.0 Dependency Risk Assessment
  - [ ] 3.1 Build dependency graph from service relationship data
  - [ ] 3.2 Implement risk scoring based on dependency counts and patterns
  - [ ] 3.3 Create circular dependency detection algorithm
  - [ ] 3.4 Flag services with high dependency risks (10+ external calls)
  - [ ] 3.5 Identify APIs used by 3+ services as potential bottlenecks
  - [ ] 3.6 Generate impact scores for critical service dependencies
  - [ ] 3.7 Write tests for risk assessment algorithms

- [ ] 4.0 Report Generation and Output
  - [ ] 4.1 Create JSON output generator for raw analysis data
  - [ ] 4.2 Build Markdown report generator with formatted results
  - [ ] 4.3 Generate ranked list of most frequently used APIs
  - [ ] 4.4 Create bottleneck identification report with risk levels
  - [ ] 4.5 Build summary report with key findings and recommendations
  - [ ] 4.6 Implement dual-directory output (both `output/` and `analysis-summary/`)
  - [ ] 4.7 Add report templates and formatting for readability
  - [ ] 4.8 Write tests for report generation functionality

- [ ] 5.0 Configuration and Integration
  - [ ] 5.1 Create configuration system for analysis parameters and thresholds
  - [ ] 5.2 Implement command-line interface for running analysis
  - [ ] 5.3 Add progress reporting and logging during analysis
  - [ ] 5.4 Create data caching to avoid re-parsing unchanged files
  - [ ] 5.5 Build validation to ensure analysis completeness and accuracy
  - [ ] 5.6 Add error handling and recovery for large-scale analysis
  - [ ] 5.7 Perform end-to-end testing with full service dataset
  - [ ] 5.8 Document usage and output formats for team consumption 