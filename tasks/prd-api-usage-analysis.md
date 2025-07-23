# Product Requirements Document: API Usage Analysis Across All Services

## Introduction/Overview

This feature will provide comprehensive analysis of API usage patterns across all One Bangkok (OBK) services to identify performance bottlenecks, optimize dependencies, and support architectural decision-making. The system will analyze existing documentation from 33+ services to create actionable insights about API dependencies, usage frequency, and potential risks.

**Problem Statement**: With 33+ microservices in the OBK ecosystem, understanding API usage patterns, dependencies, and potential bottlenecks is crucial for system optimization, scaling decisions, and performance improvements.

**Goal**: Create an automated analysis system that processes existing service documentation to identify the most frequently used APIs, cross-service dependencies, performance risks, and provide architectural improvement recommendations.

## Goals

1. **Identify Frequently Used APIs**: Analyze API usage patterns across all services to identify the most commonly referenced endpoints
2. **Map Cross-Service Dependencies**: Identify APIs that appear in multiple services indicating shared dependencies or potential bottlenecks
3. **Highlight Performance Risks**: Flag APIs with high dependency counts that could become system bottlenecks
4. **Generate Actionable Reports**: Create clear, structured reports listing most commonly used APIs and high-risk dependencies
5. **Support Optimization Decisions**: Provide data-driven insights for infrastructure prioritization and system improvements

## User Stories

### Primary Users: Software Architects
- **As a software architect**, I want to see a comprehensive dependency map of all services so that I can identify tightly coupled components and plan decoupling strategies
- **As a software architect**, I want to identify APIs called by multiple services so that I can prioritize optimization efforts on high-impact endpoints
- **As a software architect**, I want to receive architectural improvement recommendations so that I can make informed decisions about system refactoring

### DevOps Engineers
- **As a DevOps engineer**, I want to identify performance bottleneck APIs so that I can prioritize infrastructure improvements and monitoring
- **As a DevOps engineer**, I want to understand service dependency chains so that I can plan deployment strategies and failure scenarios

### Development Teams
- **As a development team lead**, I want to see which APIs my service depends on most heavily so that I can plan optimization work and understand impact of external changes
- **As a developer**, I want to understand cross-service API usage patterns so that I can make informed decisions about new feature implementations

### Product Managers
- **As a product manager**, I want to understand resource allocation needs based on API usage patterns so that I can make informed decisions about team priorities and infrastructure investments

## Functional Requirements

### Core Analysis Engine
1. **The system must scan the `/analysis` directory** to discover all service documentation
2. **The system must parse api-inventory.md files** from each service to extract API endpoint information
3. **The system must parse dependency-map.json files** to understand service-to-service relationships
4. **The system must cross-reference API endpoints** across all services to identify usage patterns
5. **The system must track API frequency** by counting how many services reference each endpoint

### Dependency Analysis
6. **The system must identify shared APIs** by finding endpoints referenced by multiple services
7. **The system must calculate dependency counts** for each API endpoint across all services
8. **The system must flag high-dependency APIs** where 3+ services depend on the same endpoint
9. **The system must detect potential bottlenecks** by analyzing fan-in patterns for critical services
10. **The system must categorize services by framework** (Express.js, NestJS, etc.) for pattern analysis

### Risk Assessment
11. **The system must identify high-risk dependencies** where multiple services depend on a single API
12. **The system must calculate impact scores** based on number of dependent services
13. **The system must flag services with unusual patterns** (too many/too few dependencies)
14. **The system must detect circular dependencies** between services

### Reporting
15. **The system must generate a ranked list** of most frequently referenced APIs across all services
16. **The system must create a bottleneck report** highlighting APIs with highest dependency counts
17. **The system must produce a summary report** with key findings and recommendations
18. **The system must export results** in JSON and Markdown formats for further analysis
19. **The system must provide raw data exports** for custom analysis and tooling

## Non-Goals (Out of Scope)

- **Interactive dashboards**: Focus on analysis and reports first, UI can be added later
- **Real-time monitoring**: This analysis is based on static documentation only
- **Performance testing**: No actual API testing or load measurement
- **Automatic code changes**: Analysis only, no modifications to services
- **Historical tracking**: Single-point-in-time analysis based on current documentation
- **External API analysis**: Focus only on internal service-to-service APIs

## Design Considerations

### Data Sources
- **Primary**: Existing analysis files in `/analysis` directory
  - `api-inventory.md` - Service API documentation
  - `dependency-map.json` - Service dependency information  
  - `openapi.yaml` - API specifications
  - `[service]-analysis.json` - Comprehensive analysis data

### User Interface Requirements
- **Dashboard**: Interactive web interface with filtering and drill-down capabilities
- **Visualizations**: Network graphs for dependencies, bar charts for usage frequency, heat maps for risk assessment
- **Export Functions**: PDF reports, CSV data exports, JSON API responses
- **Responsive Design**: Support for desktop and tablet viewing

### Performance Considerations
- **Batch Processing**: Handle analysis of 33+ services efficiently
- **Caching**: Cache analysis results to avoid reprocessing unchanged data
- **Incremental Updates**: Support adding new services without full reanalysis

## Technical Considerations

### Technology Requirements
- **Analysis Engine**: Node.js/Python for data processing and analysis
- **Data Storage**: JSON/CSV files for results, possibly SQLite for complex queries
- **Visualization**: D3.js or similar for interactive charts and dependency graphs
- **Web Framework**: Express.js or similar for dashboard API
- **Frontend**: React/Vue.js for interactive dashboard

### Integration Points
- **File System**: Read analysis data from `/analysis` directory structure
- **Export Systems**: Generate outputs compatible with existing documentation tools
- **Version Control**: Track analysis results and changes over time

### Data Processing Pipeline
1. **Discovery**: Scan `/analysis` directory for service data
2. **Parsing**: Extract API and dependency information from each service
3. **Normalization**: Standardize data formats across different service types
4. **Analysis**: Calculate usage patterns, dependencies, and risk scores
5. **Reporting**: Generate visualizations and export results

## Success Metrics

### Quantitative Metrics
- **Coverage**: Successfully analyze 100% of services in `/analysis` directory
- **Accuracy**: Correctly identify 95%+ of cross-service API references
- **Performance**: Complete analysis of all services in under 2 minutes
- **Completeness**: Generate all required reports without missing data

### Actionable Insights
- **Top APIs**: Identify the 10 most frequently referenced APIs across services
- **Bottleneck Identification**: Flag 5+ potential bottleneck APIs for optimization
- **Risk Assessment**: Identify services with high dependency risks (10+ external API calls)
- **Framework Patterns**: Categorize services by framework and identify optimization opportunities

### Business Impact
- **Optimization Targets**: Provide clear priorities for API optimization efforts
- **Risk Mitigation**: Identify potential single points of failure in the system
- **Resource Planning**: Support infrastructure scaling decisions with dependency data

## Open Questions

1. **Service Criticality Weighting**: How should we weight different services (core vs. auxiliary) in dependency risk calculations?
2. **Update Frequency**: How often should the analysis be re-run as services evolve?
3. **Historical Comparison**: Should we track changes in API usage patterns over time?
4. **External API Integration**: Should we include analysis of external third-party API dependencies in future iterations?
5. **Performance Baseline**: What performance thresholds should trigger bottleneck alerts?
6. **Notification System**: Should the system alert teams when their services become high-dependency risks?
7. **Custom Metrics**: What service-specific metrics should be configurable by different teams?

---

**Document Version**: 1.0  
**Created**: 2025-01-23  
**Target Audience**: Junior to Senior Developers, DevOps Engineers, Software Architects 