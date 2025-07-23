const { logger } = require('./logger');

/**
 * Dependency Analyzer for API Usage Analysis
 * Analyzes cross-service dependencies and identifies usage patterns
 */
class DependencyAnalyzer {
  constructor() {
    this.logger = logger.forService('DependencyAnalyzer');
  }

  /**
   * Analyze API usage patterns across all services
   * @param {Array<ServiceInfo>} services - Array of parsed service information
   * @returns {Object} Analysis results with usage patterns and frequencies
   */
  analyzeAPIUsage(services) {
    this.logger.info('Starting API usage analysis', { serviceCount: services.length });
    
    const analysis = {
      apiFrequency: new Map(), // API endpoint -> usage count
      crossServiceAPIs: new Map(), // APIs used by multiple services
      frameworkDistribution: {},
      serviceEndpointCounts: {},
      dependencyGraph: {},
      patterns: {}
    };

    try {
      // Build API frequency map
      this.buildAPIFrequencyMap(services, analysis);
      
      // Identify cross-service API usage
      this.identifyCrossServiceAPIs(services, analysis);
      
      // Analyze framework distribution
      this.analyzeFrameworkDistribution(services, analysis);
      
      // Build dependency graph
      this.buildDependencyGraph(services, analysis);
      
      // Identify usage patterns
      this.identifyUsagePatterns(services, analysis);

      this.logger.info('API usage analysis completed', {
        totalAPIs: analysis.apiFrequency.size,
        crossServiceAPIs: analysis.crossServiceAPIs.size,
        frameworks: Object.keys(analysis.frameworkDistribution).length
      });

      return analysis;
    } catch (error) {
      this.logger.error('Error during API usage analysis', {}, error);
      throw error;
    }
  }

  /**
   * Build frequency map of all API endpoints across services
   * @param {Array<ServiceInfo>} services - Services to analyze
   * @param {Object} analysis - Analysis results object to populate
   */
  buildAPIFrequencyMap(services, analysis) {
    this.logger.debug('Building API frequency map');

    services.forEach(service => {
      // Count endpoints provided by this service
      service.endpoints.forEach(endpoint => {
        const apiKey = this.normalizeAPIKey(endpoint.method, endpoint.path, service.serviceName);
        
        if (!analysis.apiFrequency.has(apiKey)) {
          analysis.apiFrequency.set(apiKey, {
            method: endpoint.method,
            path: endpoint.path,
            providedBy: service.serviceName,
            usedBy: [],
            totalUsage: 0,
            type: endpoint.type || 'internal'
          });
        }
      });

      // Count dependencies (APIs this service calls)
      service.dependencies.forEach(dependency => {
        dependency.endpoints.forEach(endpoint => {
          const apiKey = this.normalizeAPIKey(endpoint.method, endpoint.path, dependency.serviceName);
          
          if (analysis.apiFrequency.has(apiKey)) {
            const apiInfo = analysis.apiFrequency.get(apiKey);
            if (!apiInfo.usedBy.includes(service.serviceName)) {
              apiInfo.usedBy.push(service.serviceName);
              apiInfo.totalUsage++;
            }
          } else {
            // API provided by external service or not yet discovered
            analysis.apiFrequency.set(apiKey, {
              method: endpoint.method,
              path: endpoint.path,
              providedBy: dependency.serviceName,
              usedBy: [service.serviceName],
              totalUsage: 1,
              type: 'dependency'
            });
          }
        });
      });

      // Track service endpoint counts
      analysis.serviceEndpointCounts[service.serviceName] = {
        providedEndpoints: service.endpoints.length,
        consumedEndpoints: service.dependencies.reduce((sum, dep) => sum + dep.endpoints.length, 0),
        externalAPIs: service.externalAPIs.length
      };
    });

    this.logger.debug('API frequency map built', { 
      totalAPIs: analysis.apiFrequency.size 
    });
  }

  /**
   * Identify APIs that are used by multiple services
   * @param {Array<ServiceInfo>} services - Services to analyze
   * @param {Object} analysis - Analysis results object to populate
   */
  identifyCrossServiceAPIs(services, analysis) {
    this.logger.debug('Identifying cross-service APIs');

    analysis.apiFrequency.forEach((apiInfo, apiKey) => {
      if (apiInfo.usedBy.length >= 2) { // Used by 2+ services
        analysis.crossServiceAPIs.set(apiKey, {
          ...apiInfo,
          riskLevel: this.calculateRiskLevel(apiInfo.usedBy.length, apiInfo.type),
          isBottleneck: apiInfo.usedBy.length >= 3 // 3+ services = potential bottleneck
        });
      }
    });

    this.logger.debug('Cross-service APIs identified', { 
      count: analysis.crossServiceAPIs.size 
    });
  }

  /**
   * Analyze framework distribution across services
   * @param {Array<ServiceInfo>} services - Services to analyze
   * @param {Object} analysis - Analysis results object to populate
   */
  analyzeFrameworkDistribution(services, analysis) {
    this.logger.debug('Analyzing framework distribution');

    services.forEach(service => {
      const framework = service.framework || 'unknown';
      
      if (!analysis.frameworkDistribution[framework]) {
        analysis.frameworkDistribution[framework] = {
          count: 0,
          services: [],
          avgEndpoints: 0,
          totalEndpoints: 0
        };
      }

      analysis.frameworkDistribution[framework].count++;
      analysis.frameworkDistribution[framework].services.push(service.serviceName);
      analysis.frameworkDistribution[framework].totalEndpoints += service.endpoints.length;
    });

    // Calculate averages
    Object.values(analysis.frameworkDistribution).forEach(frameworkData => {
      frameworkData.avgEndpoints = frameworkData.count > 0 
        ? Math.round(frameworkData.totalEndpoints / frameworkData.count * 10) / 10
        : 0;
    });

    this.logger.debug('Framework distribution analyzed', { 
      frameworks: Object.keys(analysis.frameworkDistribution).length 
    });
  }

  /**
   * Build dependency graph showing service relationships
   * @param {Array<ServiceInfo>} services - Services to analyze
   * @param {Object} analysis - Analysis results object to populate
   */
  buildDependencyGraph(services, analysis) {
    this.logger.debug('Building dependency graph');

    services.forEach(service => {
      if (!analysis.dependencyGraph[service.serviceName]) {
        analysis.dependencyGraph[service.serviceName] = {
          dependsOn: [],
          usedBy: [],
          strength: 'weak'
        };
      }

      // Map dependencies (services this service depends on)
      service.dependencies.forEach(dependency => {
        const depInfo = {
          service: dependency.serviceName,
          endpointCount: dependency.endpoints.length,
          strength: dependency.strength || 'weak'
        };

        analysis.dependencyGraph[service.serviceName].dependsOn.push(depInfo);

        // Create reverse mapping (services that depend on this dependency)
        if (!analysis.dependencyGraph[dependency.serviceName]) {
          analysis.dependencyGraph[dependency.serviceName] = {
            dependsOn: [],
            usedBy: [],
            strength: 'weak'
          };
        }

        analysis.dependencyGraph[dependency.serviceName].usedBy.push({
          service: service.serviceName,
          endpointCount: dependency.endpoints.length,
          strength: dependency.strength || 'weak'
        });
      });
    });

    // Calculate overall dependency strength for each service
    Object.values(analysis.dependencyGraph).forEach(node => {
      const totalDependencies = node.dependsOn.length;
      const totalConsumers = node.usedBy.length;
      
      if (totalDependencies >= 10 || totalConsumers >= 5) {
        node.strength = 'critical';
      } else if (totalDependencies >= 5 || totalConsumers >= 3) {
        node.strength = 'strong';
      } else if (totalDependencies >= 2 || totalConsumers >= 1) {
        node.strength = 'moderate';
      } else {
        node.strength = 'weak';
      }
    });

    this.logger.debug('Dependency graph built', { 
      services: Object.keys(analysis.dependencyGraph).length 
    });
  }

  /**
   * Identify usage patterns and potential bottlenecks
   * @param {Array<ServiceInfo>} services - Services to analyze
   * @param {Object} analysis - Analysis results object to populate
   */
  identifyUsagePatterns(services, analysis) {
    this.logger.debug('Identifying usage patterns');

    analysis.patterns = {
      highDependencyServices: [],
      bottleneckAPIs: [],
      unusedServices: [],
      heavyConsumers: [],
      circularDependencies: this.detectCircularDependencies(analysis.dependencyGraph)
    };

    // Identify high dependency services (services with many dependencies)
    services.forEach(service => {
      const totalDeps = service.dependencies.reduce((sum, dep) => sum + dep.endpoints.length, 0);
      
      if (totalDeps >= 10) {
        analysis.patterns.highDependencyServices.push({
          service: service.serviceName,
          dependencyCount: totalDeps,
          riskLevel: 'high'
        });
      }
    });

    // Identify bottleneck APIs (used by 3+ services)
    analysis.crossServiceAPIs.forEach((apiInfo, apiKey) => {
      if (apiInfo.isBottleneck) {
        analysis.patterns.bottleneckAPIs.push({
          api: apiKey,
          usageCount: apiInfo.usedBy.length,
          usedBy: apiInfo.usedBy,
          providedBy: apiInfo.providedBy,
          riskLevel: apiInfo.riskLevel
        });
      }
    });

    // Identify unused services (no consumers)
    services.forEach(service => {
      const node = analysis.dependencyGraph[service.serviceName];
      if (node && node.usedBy.length === 0 && service.endpoints.length > 0) {
        analysis.patterns.unusedServices.push({
          service: service.serviceName,
          endpointCount: service.endpoints.length
        });
      }
    });

    // Identify heavy consumers (services that call many external APIs)
    services.forEach(service => {
      const externalCallCount = service.dependencies.length + service.externalAPIs.length;
      if (externalCallCount >= 5) {
        analysis.patterns.heavyConsumers.push({
          service: service.serviceName,
          externalCalls: externalCallCount,
          dependencies: service.dependencies.length,
          externalAPIs: service.externalAPIs.length
        });
      }
    });

    this.logger.debug('Usage patterns identified', {
      highDependencyServices: analysis.patterns.highDependencyServices.length,
      bottleneckAPIs: analysis.patterns.bottleneckAPIs.length,
      unusedServices: analysis.patterns.unusedServices.length,
      heavyConsumers: analysis.patterns.heavyConsumers.length,
      circularDependencies: analysis.patterns.circularDependencies.length
    });
  }

  /**
   * Detect circular dependencies in the dependency graph
   * @param {Object} dependencyGraph - Dependency graph
   * @returns {Array} Array of circular dependency chains
   */
  detectCircularDependencies(dependencyGraph) {
    const visited = new Set();
    const recursionStack = new Set();
    const circularDeps = [];

    const detectCycles = (node, path = []) => {
      if (recursionStack.has(node)) {
        // Found a cycle
        const cycleStart = path.indexOf(node);
        if (cycleStart !== -1) {
          circularDeps.push([...path.slice(cycleStart), node]);
        }
        return;
      }

      if (visited.has(node)) {
        return;
      }

      visited.add(node);
      recursionStack.add(node);
      path.push(node);

      const nodeData = dependencyGraph[node];
      if (nodeData) {
        nodeData.dependsOn.forEach(dep => {
          detectCycles(dep.service, [...path]);
        });
      }

      recursionStack.delete(node);
    };

    Object.keys(dependencyGraph).forEach(service => {
      if (!visited.has(service)) {
        detectCycles(service);
      }
    });

    return circularDeps;
  }

  /**
   * Calculate risk level based on usage count and API type
   * @param {number} usageCount - Number of services using this API
   * @param {string} type - API type (internal, external, etc.)
   * @returns {string} Risk level (low, medium, high, critical)
   */
  calculateRiskLevel(usageCount, type) {
    let baseRisk = 0;
    
    if (usageCount >= 10) baseRisk = 4; // critical
    else if (usageCount >= 5) baseRisk = 3; // high
    else if (usageCount >= 3) baseRisk = 2; // medium
    else baseRisk = 1; // low

    // Adjust based on API type
    if (type === 'external') baseRisk += 1;
    if (type === 'internal' && usageCount >= 5) baseRisk += 1;

    const riskLevels = ['low', 'low', 'medium', 'high', 'critical'];
    return riskLevels[Math.min(baseRisk, 4)];
  }

  /**
   * Normalize API key for consistent identification
   * @param {string} method - HTTP method
   * @param {string} path - API path
   * @param {string} service - Service name
   * @returns {string} Normalized API key
   */
  normalizeAPIKey(method, path, service) {
    const normalizedMethod = (method || 'GET').toUpperCase();
    const normalizedPath = (path || '/').toLowerCase();
    return `${normalizedMethod} ${service}${normalizedPath}`;
  }

  /**
   * Get summary statistics of the analysis
   * @param {Object} analysis - Analysis results
   * @returns {Object} Summary statistics
   */
  getSummary(analysis) {
    return {
      totalAPIs: analysis.apiFrequency.size,
      crossServiceAPIs: analysis.crossServiceAPIs.size,
      frameworks: Object.keys(analysis.frameworkDistribution),
      services: Object.keys(analysis.dependencyGraph).length,
      riskMetrics: {
        highRiskAPIs: Array.from(analysis.crossServiceAPIs.values())
          .filter(api => api.riskLevel === 'high' || api.riskLevel === 'critical').length,
        bottleneckAPIs: analysis.patterns.bottleneckAPIs.length,
        circularDependencies: analysis.patterns.circularDependencies.length,
        highDependencyServices: analysis.patterns.highDependencyServices.length
      }
    };
  }
}

module.exports = DependencyAnalyzer; 