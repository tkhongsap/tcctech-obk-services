const fs = require('fs').promises;
const path = require('path');
const { logger } = require('./logger');

/**
 * Report Generator for API Usage Analysis
 * Creates comprehensive reports in multiple formats with dual-directory output
 */
class ReportGenerator {
  constructor(options = {}) {
    this.outputDirs = options.outputDirs || ['output', 'analysis-summary'];
    this.logger = logger.forService('ReportGenerator');
  }

  /**
   * Generate all reports from analysis results
   * @param {Object} analysisResults - Complete analysis results
   * @param {Object} summary - Analysis summary
   * @returns {Promise<Object>} Generated report paths
   */
  async generateAllReports(analysisResults, summary) {
    this.logger.info('Starting report generation');
    
    const reportPaths = {
      json: [],
      markdown: []
    };

    try {
      // Ensure output directories exist
      await this.ensureDirectories();

      // Generate JSON reports
      reportPaths.json.push(...await this.generateJSONReports(analysisResults, summary));
      
      // Generate Markdown reports
      reportPaths.markdown.push(...await this.generateMarkdownReports(analysisResults, summary));

      this.logger.info('All reports generated successfully', {
        jsonReports: reportPaths.json.length,
        markdownReports: reportPaths.markdown.length
      });

      return reportPaths;
    } catch (error) {
      this.logger.error('Report generation failed', {}, error);
      throw error;
    }
  }

  /**
   * Generate JSON format reports
   * @param {Object} analysisResults - Analysis results
   * @param {Object} summary - Analysis summary
   * @returns {Promise<Array>} Generated JSON file paths
   */
  async generateJSONReports(analysisResults, summary) {
    this.logger.info('Generating JSON reports');
    const paths = [];

    // Main analysis results
    const analysisReport = {
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        reportType: 'api-usage-analysis'
      },
      summary,
      analysis: this.convertMapsToObjects(analysisResults.analysis),
      services: analysisResults.services || [],
      errors: analysisResults.errors || [],
      warnings: analysisResults.warnings || []
    };

    for (const dir of this.outputDirs) {
      const filePath = path.join(dir, 'api-usage-analysis.json');
      await fs.writeFile(filePath, JSON.stringify(analysisReport, null, 2));
      paths.push(filePath);
      this.logger.debug('JSON analysis report saved', { path: filePath });
    }

    // Dependency summary
    const dependencySummary = {
      metadata: {
        generatedAt: new Date().toISOString(),
        totalServices: summary.services.total,
        totalAPIs: summary.apis.total
      },
      dependencyGraph: analysisResults.analysis?.dependencyGraph || {},
      crossServiceAPIs: this.convertMapToArray(analysisResults.analysis?.crossServiceAPIs),
      patterns: analysisResults.analysis?.patterns || {}
    };

    for (const dir of this.outputDirs) {
      const filePath = path.join(dir, 'dependency-summary.json');
      await fs.writeFile(filePath, JSON.stringify(dependencySummary, null, 2));
      paths.push(filePath);
      this.logger.debug('JSON dependency summary saved', { path: filePath });
    }

    return paths;
  }

  /**
   * Generate Markdown format reports
   * @param {Object} analysisResults - Analysis results
   * @param {Object} summary - Analysis summary
   * @returns {Promise<Array>} Generated Markdown file paths
   */
  async generateMarkdownReports(analysisResults, summary) {
    this.logger.info('Generating Markdown reports');
    const paths = [];

    // Main API usage report
    const mainReport = this.generateMainMarkdownReport(analysisResults, summary);
    for (const dir of this.outputDirs) {
      const filePath = path.join(dir, 'api-usage-report.md');
      await fs.writeFile(filePath, mainReport);
      paths.push(filePath);
      this.logger.debug('Markdown main report saved', { path: filePath });
    }

    // Bottleneck report
    const bottleneckReport = this.generateBottleneckReport(analysisResults, summary);
    for (const dir of this.outputDirs) {
      const filePath = path.join(dir, 'bottleneck-report.md');
      await fs.writeFile(filePath, bottleneckReport);
      paths.push(filePath);
      this.logger.debug('Markdown bottleneck report saved', { path: filePath });
    }

    return paths;
  }

  /**
   * Generate main Markdown report
   * @param {Object} analysisResults - Analysis results
   * @param {Object} summary - Analysis summary
   * @returns {string} Markdown content
   */
  generateMainMarkdownReport(analysisResults, summary) {
    const timestamp = new Date().toISOString();
    const analysis = analysisResults.analysis || {};

    let markdown = `# API Usage Analysis Report

Generated: ${timestamp}

## Executive Summary

This report provides a comprehensive analysis of API usage patterns across ${summary.services.total} services in the OBK ecosystem.

### Key Findings

- **Total Services Analyzed**: ${summary.services.total}
- **Total API Endpoints**: ${summary.apis.total}
- **Cross-Service APIs**: ${summary.apis.crossService}
- **Potential Bottlenecks**: ${summary.apis.bottlenecks}

### Service Health

- **Successful Analysis**: ${summary.services.successful}/${summary.services.total} services
- **Errors**: ${summary.services.errors} services
- **Warnings**: ${summary.services.warnings} issues identified

## Framework Distribution

`;

    // Framework distribution table
    const frameworks = summary.frameworks || {};
    if (Object.keys(frameworks).length > 0) {
      markdown += `| Framework | Service Count | Percentage |\n`;
      markdown += `|-----------|---------------|------------|\n`;
      
      const total = Object.values(frameworks).reduce((sum, count) => sum + count, 0);
      Object.entries(frameworks).forEach(([framework, count]) => {
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        markdown += `| ${framework} | ${count} | ${percentage}% |\n`;
      });
    } else {
      markdown += `No framework information available.\n`;
    }

    // Most frequently used APIs
    markdown += `\n## Most Frequently Used APIs

`;

    const apiFrequency = analysis.apiFrequency || new Map();
    const sortedAPIs = Array.from(apiFrequency.entries())
      .sort(([,a], [,b]) => b.totalUsage - a.totalUsage)
      .slice(0, 10);

    if (sortedAPIs.length > 0) {
      markdown += `| Rank | API Endpoint | Provider | Usage Count | Used By |\n`;
      markdown += `|------|--------------|----------|-------------|----------|\n`;
      
      sortedAPIs.forEach(([apiKey, apiInfo], index) => {
        const usedByList = apiInfo.usedBy.slice(0, 3).join(', ');
        const moreServices = apiInfo.usedBy.length > 3 ? ` (+${apiInfo.usedBy.length - 3} more)` : '';
        markdown += `| ${index + 1} | \`${apiKey}\` | ${apiInfo.providedBy} | ${apiInfo.totalUsage} | ${usedByList}${moreServices} |\n`;
      });
    } else {
      markdown += `No API usage data available.\n`;
    }

    // Risk Assessment
    markdown += `\n## Risk Assessment

`;

    const risks = summary.risks || {};
    markdown += `### Critical Risks Identified

- **Circular Dependencies**: ${risks.circularDependencies || 0}
- **High Dependency Services**: ${risks.highDependencyServices || 0}
- **Unused Services**: ${risks.unusedServices || 0}

`;

    // High dependency services
    const patterns = analysis.patterns || {};
    if (patterns.highDependencyServices && patterns.highDependencyServices.length > 0) {
      markdown += `### Services with High External Dependencies

| Service | Dependency Count | Risk Level |
|---------|------------------|------------|
`;
      patterns.highDependencyServices.forEach(service => {
        markdown += `| ${service.service} | ${service.dependencyCount} | ${service.riskLevel} |\n`;
      });
    }

    // Bottleneck APIs
    if (patterns.bottleneckAPIs && patterns.bottleneckAPIs.length > 0) {
      markdown += `\n### Potential Bottleneck APIs

| API | Usage Count | Risk Level | Used By |
|-----|-------------|------------|---------|
`;
      patterns.bottleneckAPIs.forEach(api => {
        const usedByList = api.usedBy.slice(0, 3).join(', ');
        const moreServices = api.usedBy.length > 3 ? ` (+${api.usedBy.length - 3} more)` : '';
        markdown += `| \`${api.api}\` | ${api.usageCount} | ${api.riskLevel} | ${usedByList}${moreServices} |\n`;
      });
    }

    // Recommendations
    markdown += `\n## Recommendations

Based on the analysis, here are key recommendations for improving the system architecture:

### 1. Optimize High-Usage APIs
`;

    if (sortedAPIs.length > 0) {
      const topAPIs = sortedAPIs.slice(0, 3);
      topAPIs.forEach((_, index) => {
        markdown += `- Consider caching and performance optimization for API #${index + 1}\n`;
      });
    }

    markdown += `
### 2. Address Bottlenecks
`;

    if (patterns.bottleneckAPIs && patterns.bottleneckAPIs.length > 0) {
      markdown += `- Review ${patterns.bottleneckAPIs.length} APIs that are used by 3+ services\n`;
      markdown += `- Consider implementing circuit breakers and retry mechanisms\n`;
      markdown += `- Monitor these APIs closely for performance issues\n`;
    } else {
      markdown += `- No immediate bottleneck concerns identified\n`;
    }

    markdown += `
### 3. Reduce Dependencies
`;

    if (patterns.highDependencyServices && patterns.highDependencyServices.length > 0) {
      markdown += `- Review ${patterns.highDependencyServices.length} services with high external dependencies\n`;
      markdown += `- Consider consolidating similar functionality\n`;
      markdown += `- Implement dependency injection patterns where appropriate\n`;
    } else {
      markdown += `- Dependency levels appear to be well-managed\n`;
    }

    markdown += `
### 4. Framework Standardization
`;

    const frameworkCount = Object.keys(frameworks).length;
    if (frameworkCount > 3) {
      markdown += `- Consider standardizing on fewer frameworks (currently using ${frameworkCount})\n`;
      markdown += `- Evaluate migration paths for legacy frameworks\n`;
    } else {
      markdown += `- Framework usage appears to be well-controlled\n`;
    }

    markdown += `
## Conclusion

This analysis provides a foundation for making informed decisions about API optimization, 
dependency management, and system architecture improvements. Regular monitoring and 
analysis should be implemented to track improvements and identify new issues.

---

*Report generated by API Usage Analysis Engine v1.0.0*
`;

    return markdown;
  }

  /**
   * Generate bottleneck-specific report
   * @param {Object} analysisResults - Analysis results
   * @param {Object} summary - Analysis summary
   * @returns {string} Markdown content
   */
  generateBottleneckReport(analysisResults, summary) {
    const timestamp = new Date().toISOString();
    const analysis = analysisResults.analysis || {};
    const patterns = analysis.patterns || {};

    let markdown = `# API Bottleneck Analysis Report

Generated: ${timestamp}

## Overview

This report focuses specifically on identifying and analyzing potential API bottlenecks 
that could impact system performance and reliability.

## Summary Statistics

- **Total APIs Analyzed**: ${summary.apis.total}
- **Cross-Service APIs**: ${summary.apis.crossService}
- **Potential Bottlenecks**: ${summary.apis.bottlenecks}
- **High-Risk APIs**: ${analysis.crossServiceAPIs ? Array.from(analysis.crossServiceAPIs.values()).filter(api => api.riskLevel === 'high' || api.riskLevel === 'critical').length : 0}

## Detailed Bottleneck Analysis

`;

    // Bottleneck APIs details
    if (patterns.bottleneckAPIs && patterns.bottleneckAPIs.length > 0) {
      markdown += `### Critical Bottleneck APIs

The following APIs are used by 3 or more services and represent potential bottlenecks:

`;

      patterns.bottleneckAPIs.forEach((api, index) => {
        markdown += `#### ${index + 1}. \`${api.api}\`

- **Usage Count**: ${api.usageCount} services
- **Risk Level**: ${api.riskLevel}
- **Provider**: ${api.providedBy}
- **Dependent Services**: 
`;
        api.usedBy.forEach(service => {
          markdown += `  - ${service}\n`;
        });

        markdown += `
**Impact**: If this API becomes unavailable, ${api.usageCount} services would be affected.

**Recommendations**:
- Implement comprehensive monitoring and alerting
- Consider implementing circuit breaker patterns
- Add retry mechanisms with exponential backoff
- Monitor response times and error rates closely

---

`;
      });
    } else {
      markdown += `### No Critical Bottlenecks Identified

No APIs were found to be used by 3 or more services simultaneously. This suggests a 
well-distributed architecture with minimal bottleneck risks.

`;
    }

    // Cross-service API analysis
    if (analysis.crossServiceAPIs && analysis.crossServiceAPIs.size > 0) {
      const crossServiceAPIs = Array.from(analysis.crossServiceAPIs.values())
        .sort((a, b) => b.usedBy.length - a.usedBy.length);

      markdown += `## Cross-Service API Usage

The following APIs are shared between multiple services:

| API | Provider | Consumers | Risk Level |
|-----|----------|-----------|------------|
`;

      crossServiceAPIs.forEach(api => {
        markdown += `| \`${api.method} ${api.path}\` | ${api.providedBy} | ${api.usedBy.length} | ${api.riskLevel} |\n`;
      });
    }

    // Risk mitigation strategies
    markdown += `
## Risk Mitigation Strategies

### 1. Monitoring and Observability
- Implement comprehensive API monitoring for all identified bottlenecks
- Set up alerts for response time degradation
- Monitor error rates and success percentages
- Track API usage patterns over time

### 2. Performance Optimization
- Implement caching strategies for frequently accessed data
- Optimize database queries and reduce response payload sizes
- Consider implementing pagination for large data sets
- Use compression for API responses

### 3. Resilience Patterns
- Implement circuit breaker patterns for critical dependencies
- Add retry mechanisms with exponential backoff
- Implement timeouts and fallback mechanisms
- Consider implementing bulkhead patterns to isolate failures

### 4. Architecture Improvements
- Evaluate opportunities to reduce cross-service dependencies
- Consider implementing event-driven architectures where appropriate
- Explore API gateway patterns for centralized management
- Implement service mesh for advanced traffic management

## Next Steps

1. **Immediate Actions** (0-30 days):
   - Implement monitoring for identified bottleneck APIs
   - Review and optimize the top 3 highest-usage APIs
   - Establish baseline performance metrics

2. **Short-term Actions** (1-3 months):
   - Implement circuit breaker patterns for critical dependencies
   - Optimize API performance based on monitoring data
   - Conduct capacity planning for high-usage APIs

3. **Long-term Actions** (3-6 months):
   - Evaluate architectural changes to reduce dependencies
   - Implement comprehensive resilience patterns
   - Regular review and analysis of API usage patterns

---

*Report generated by API Usage Analysis Engine v1.0.0*
`;

    return markdown;
  }

  /**
   * Ensure output directories exist
   * @returns {Promise<void>}
   */
  async ensureDirectories() {
    for (const dir of this.outputDirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
        this.logger.debug('Output directory ensured', { directory: dir });
      } catch (error) {
        this.logger.error('Failed to create output directory', { directory: dir }, error);
        throw error;
      }
    }
  }

  /**
   * Convert Maps to Objects for JSON serialization
   * @param {Object} analysis - Analysis object containing Maps
   * @returns {Object} Analysis object with Maps converted to Objects
   */
  convertMapsToObjects(analysis) {
    if (!analysis) return {};

    return {
      ...analysis,
      apiFrequency: this.convertMapToArray(analysis.apiFrequency),
      crossServiceAPIs: this.convertMapToArray(analysis.crossServiceAPIs)
    };
  }

  /**
   * Convert Map to Array for JSON serialization
   * @param {Map} map - Map to convert
   * @returns {Array} Array of [key, value] pairs
   */
  convertMapToArray(map) {
    if (!map || !(map instanceof Map)) return [];
    return Array.from(map.entries()).map(([key, value]) => ({ key, ...value }));
  }

  /**
   * Generate ranked list of most frequently used APIs
   * @param {Map} apiFrequency - API frequency map
   * @param {number} limit - Number of APIs to return
   * @returns {Array} Ranked list of APIs
   */
  generateAPIRanking(apiFrequency, limit = 10) {
    if (!apiFrequency || !(apiFrequency instanceof Map)) return [];

    return Array.from(apiFrequency.entries())
      .sort(([,a], [,b]) => b.totalUsage - a.totalUsage)
      .slice(0, limit)
      .map(([api, info], index) => ({
        rank: index + 1,
        api,
        provider: info.providedBy,
        usageCount: info.totalUsage,
        usedBy: info.usedBy,
        riskLevel: info.riskLevel || 'low'
      }));
  }
}

module.exports = ReportGenerator; 