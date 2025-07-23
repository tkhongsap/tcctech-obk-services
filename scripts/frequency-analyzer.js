/**
 * API Usage Frequency Analyzer
 * Calculates how frequently APIs are used across all services
 */
class FrequencyAnalyzer {
  constructor(options = {}) {
    this.options = {
      weightFactors: {
        directCall: 1.0,        // Direct API call
        dependency: 0.8,        // Service dependency
        reference: 0.6,         // Reference in documentation
        similar: 0.4,           // Similar endpoint pattern
        external: 0.3           // External API usage
      },
      similarityThreshold: 0.8,  // Path similarity threshold
      ...options
    };

    this.usageData = new Map();  // endpoint -> usage info
    this.callGraph = new Map();  // service -> calls made
    this.dependencyGraph = new Map();  // service -> dependencies
  }

  /**
   * Analyze API usage frequency across all services
   * @param {Map} endpoints - All extracted endpoints
   * @param {Map} services - All service data
   * @returns {Object} Frequency analysis results
   */
  analyzeFrequency(endpoints, services) {
    // Initialize usage tracking
    this.initializeUsageTracking(endpoints);

    // Analyze different types of usage
    this.analyzeDirectCalls(services);
    this.analyzeDependencies(services);
    this.analyzeReferences(services);
    this.analyzeSimilarPatterns(endpoints);
    this.analyzeExternalUsage(services);

    // Calculate final frequency scores
    this.calculateFrequencyScores();

    // Generate analysis results
    return this.generateFrequencyReport();
  }

  /**
   * Initialize usage tracking for all endpoints
   * @param {Map} endpoints - All endpoints
   */
  initializeUsageTracking(endpoints) {
    for (const [endpointId, endpoint] of endpoints) {
      this.usageData.set(endpointId, {
        endpoint,
        usageCount: 0,
        callers: new Set(),
        usageTypes: {
          directCall: 0,
          dependency: 0,
          reference: 0,
          similar: 0,
          external: 0
        },
        frequencyScore: 0,
        relatedEndpoints: new Set(),
        callPatterns: []
      });
    }
  }

  /**
   * Analyze direct API calls between services
   * @param {Map} services - All service data
   */
  analyzeDirectCalls(services) {
    for (const [serviceName, serviceInfo] of services) {
      if (!serviceInfo.analysisData?.unified) continue;

      const service = serviceInfo.analysisData.unified;
      
      // Analyze dependency map for API calls
      if (service.relationships?.apiCalls) {
        service.relationships.apiCalls.forEach(call => {
          this.recordApiCall(serviceName, call.to, call.endpoint, call.method, 'directCall');
        });
      }

      // Analyze endpoints for external calls
      service.endpoints.forEach(endpoint => {
        // Look for external API calls in endpoint descriptions
        this.extractExternalCallsFromDescription(serviceName, endpoint);
        
        // Analyze parameters that might indicate calls to other services
        this.analyzeEndpointParameters(serviceName, endpoint);
      });

      // Initialize call graph for this service
      if (!this.callGraph.has(serviceName)) {
        this.callGraph.set(serviceName, new Set());
      }
    }
  }

  /**
   * Record an API call from one service to another
   * @param {string} fromService - Calling service
   * @param {string} toService - Target service
   * @param {string} endpoint - Endpoint path
   * @param {string} method - HTTP method
   * @param {string} usageType - Type of usage
   */
  recordApiCall(fromService, toService, endpoint, method, usageType) {
    // Find matching endpoint
    const targetEndpointId = this.findEndpointByPath(toService, endpoint, method);
    
    if (targetEndpointId && this.usageData.has(targetEndpointId)) {
      const usage = this.usageData.get(targetEndpointId);
      usage.callers.add(fromService);
      usage.usageTypes[usageType]++;
      usage.callPatterns.push({
        from: fromService,
        type: usageType,
        timestamp: new Date().toISOString()
      });

      // Update call graph
      if (!this.callGraph.has(fromService)) {
        this.callGraph.set(fromService, new Set());
      }
      this.callGraph.get(fromService).add(`${toService}:${endpoint}`);
    }
  }

  /**
   * Find endpoint by path and method
   * @param {string} serviceName - Service name
   * @param {string} path - Endpoint path
   * @param {string} method - HTTP method
   * @returns {string|null} Endpoint ID if found
   */
  findEndpointByPath(serviceName, path, method) {
    for (const [endpointId, endpointData] of this.usageData) {
      if (endpointData.endpoint.serviceName === serviceName &&
          endpointData.endpoint.path === path &&
          endpointData.endpoint.method === method.toUpperCase()) {
        return endpointId;
      }
    }
    return null;
  }

  /**
   * Extract external API calls from endpoint descriptions
   * @param {string} serviceName - Service name
   * @param {Object} endpoint - Endpoint data
   */
  extractExternalCallsFromDescription(serviceName, endpoint) {
    const description = (endpoint.description || '').toLowerCase();
    
    // Look for patterns indicating API calls
    const callPatterns = [
      /calls?\s+(\w+)\s+api/gi,
      /sends?\s+request\s+to\s+(\w+)/gi,
      /integrates?\s+with\s+(\w+)/gi,
      /communicates?\s+with\s+(\w+)/gi
    ];

    callPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(description)) !== null) {
        const targetService = match[1];
        // Record as reference type usage
        this.recordServiceReference(serviceName, targetService, endpoint.path);
      }
    });
  }

  /**
   * Analyze endpoint parameters for service calls
   * @param {string} serviceName - Service name
   * @param {Object} endpoint - Endpoint data
   */
  analyzeEndpointParameters(serviceName, endpoint) {
    endpoint.parameters?.forEach(param => {
      // Look for parameters that suggest calls to other services
      const paramName = param.name?.toLowerCase() || '';
      const paramDesc = param.description?.toLowerCase() || '';
      
      if (paramName.includes('service') || paramName.includes('api') ||
          paramDesc.includes('service') || paramDesc.includes('api')) {
        // This might indicate a service dependency
        this.recordParameterReference(serviceName, endpoint.path, param);
      }
    });
  }

  /**
   * Record a service reference
   * @param {string} fromService - Referencing service
   * @param {string} targetService - Referenced service
   * @param {string} context - Context (endpoint path)
   */
  recordServiceReference(fromService, targetService, context) {
    // Try to find endpoints in the target service
    for (const [endpointId, endpointData] of this.usageData) {
      if (endpointData.endpoint.serviceName.toLowerCase().includes(targetService.toLowerCase())) {
        const usage = this.usageData.get(endpointId);
        usage.callers.add(fromService);
        usage.usageTypes.reference++;
        usage.callPatterns.push({
          from: fromService,
          type: 'reference',
          context,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  /**
   * Record parameter reference
   * @param {string} serviceName - Service name
   * @param {string} endpointPath - Endpoint path
   * @param {Object} parameter - Parameter data
   */
  recordParameterReference(serviceName, endpointPath, parameter) {
    // This is a lighter weight reference
    // Implementation would depend on specific parameter analysis needs
  }

  /**
   * Analyze service dependencies
   * @param {Map} services - All service data
   */
  analyzeDependencies(services) {
    for (const [serviceName, serviceInfo] of services) {
      if (!serviceInfo.analysisData?.unified) continue;

      const service = serviceInfo.analysisData.unified;
      
      // Analyze internal dependencies
      service.dependencies.internal.forEach(dep => {
        this.recordDependency(serviceName, dep.name, dep.endpoints);
      });

      // Analyze external dependencies
      service.dependencies.external.forEach(dep => {
        this.recordExternalDependency(serviceName, dep.name, dep.endpoints);
      });

      // Store dependency graph
      this.dependencyGraph.set(serviceName, {
        internal: service.dependencies.internal.map(d => d.name),
        external: service.dependencies.external.map(d => d.name),
        packages: service.dependencies.packages.map(d => d.name)
      });
    }
  }

  /**
   * Record a service dependency
   * @param {string} fromService - Dependent service
   * @param {string} toService - Dependency service
   * @param {Array} endpoints - Dependent endpoints
   */
  recordDependency(fromService, toService, endpoints = []) {
    if (endpoints.length > 0) {
      endpoints.forEach(endpointPath => {
        // Try to find the actual endpoint
        const endpointId = this.findEndpointByPath(toService, endpointPath, 'GET'); // Default to GET
        if (endpointId && this.usageData.has(endpointId)) {
          const usage = this.usageData.get(endpointId);
          usage.callers.add(fromService);
          usage.usageTypes.dependency++;
          usage.callPatterns.push({
            from: fromService,
            type: 'dependency',
            timestamp: new Date().toISOString()
          });
        }
      });
    } else {
      // General service dependency - apply to all endpoints of target service
      for (const [endpointId, endpointData] of this.usageData) {
        if (endpointData.endpoint.serviceName === toService) {
          const usage = this.usageData.get(endpointId);
          usage.callers.add(fromService);
          usage.usageTypes.dependency += 0.5; // Half weight for general dependency
        }
      }
    }
  }

  /**
   * Record external dependency
   * @param {string} serviceName - Service name
   * @param {string} externalService - External service name
   * @param {Array} endpoints - Used endpoints
   */
  recordExternalDependency(serviceName, externalService, endpoints) {
    // External dependencies don't affect internal API frequency directly
    // but we track them for completeness
  }

  /**
   * Analyze references in documentation and comments
   * @param {Map} services - All service data
   */
  analyzeReferences(services) {
    for (const [serviceName, serviceInfo] of services) {
      if (!serviceInfo.analysisData?.unified) continue;

      const service = serviceInfo.analysisData.unified;
      
      // Analyze endpoint descriptions for references to other APIs
      service.endpoints.forEach(endpoint => {
        this.analyzeEndpointReferences(serviceName, endpoint);
      });

      // Analyze schema descriptions for references
      service.schemas.forEach(schema => {
        this.analyzeSchemaReferences(serviceName, schema);
      });
    }
  }

  /**
   * Analyze endpoint descriptions for API references
   * @param {string} serviceName - Service name
   * @param {Object} endpoint - Endpoint data
   */
  analyzeEndpointReferences(serviceName, endpoint) {
    const text = `${endpoint.description || ''} ${endpoint.summary || ''}`.toLowerCase();
    
    // Look for HTTP method + path patterns
    const apiPatterns = [
      /(get|post|put|delete|patch)\s+\/[\w\/\-{}]+/gi,
      /api\/[\w\/\-{}]+/gi,
      /endpoint\s+[\w\/\-{}]+/gi
    ];

    apiPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const apiRef = match[0];
        this.recordApiReference(serviceName, apiRef, 'endpoint-description');
      }
    });
  }

  /**
   * Analyze schema descriptions for API references
   * @param {string} serviceName - Service name
   * @param {Object} schema - Schema data
   */
  analyzeSchemaReferences(serviceName, schema) {
    const text = `${schema.description || ''}`.toLowerCase();
    
    // Look for references to other services or APIs
    if (text.includes('api') || text.includes('service') || text.includes('endpoint')) {
      // Light reference weight
      this.recordSchemaReference(serviceName, schema.name, text);
    }
  }

  /**
   * Record API reference found in text
   * @param {string} serviceName - Service name
   * @param {string} apiRef - API reference string
   * @param {string} context - Context where found
   */
  recordApiReference(serviceName, apiRef, context) {
    // Try to match against known endpoints
    for (const [endpointId, endpointData] of this.usageData) {
      const endpoint = endpointData.endpoint;
      
      // Check if the reference matches this endpoint
      if (this.isApiReferenceMatch(apiRef, endpoint)) {
        const usage = this.usageData.get(endpointId);
        usage.callers.add(serviceName);
        usage.usageTypes.reference++;
        usage.callPatterns.push({
          from: serviceName,
          type: 'reference',
          context,
          reference: apiRef,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  /**
   * Check if API reference matches an endpoint
   * @param {string} apiRef - API reference
   * @param {Object} endpoint - Endpoint data
   * @returns {boolean} True if matches
   */
  isApiReferenceMatch(apiRef, endpoint) {
    const refLower = apiRef.toLowerCase();
    const pathLower = endpoint.path.toLowerCase();
    const methodLower = endpoint.method.toLowerCase();
    
    // Direct path match
    if (refLower.includes(pathLower)) return true;
    
    // Method + path match
    if (refLower.includes(methodLower) && refLower.includes(pathLower.split('/').pop())) return true;
    
    // Partial path match (last segment)
    const pathSegments = pathLower.split('/').filter(s => s.length > 0);
    if (pathSegments.some(segment => refLower.includes(segment))) return true;
    
    return false;
  }

  /**
   * Record schema reference
   * @param {string} serviceName - Service name
   * @param {string} schemaName - Schema name
   * @param {string} text - Reference text
   */
  recordSchemaReference(serviceName, schemaName, text) {
    // This is a very light reference weight
    // Could be used for future analysis
  }

  /**
   * Analyze similar endpoint patterns
   * @param {Map} endpoints - All endpoints
   */
  analyzeSimilarPatterns(endpoints) {
    const endpointList = Array.from(endpoints.values());
    
    for (let i = 0; i < endpointList.length; i++) {
      for (let j = i + 1; j < endpointList.length; j++) {
        const endpoint1 = endpointList[i];
        const endpoint2 = endpointList[j];
        
        // Skip same service comparisons for different purpose
        if (endpoint1.endpoint.serviceName === endpoint2.endpoint.serviceName) continue;
        
        const similarity = this.calculatePathSimilarity(
          endpoint1.endpoint.path,
          endpoint2.endpoint.path
        );
        
        if (similarity >= this.options.similarityThreshold) {
          // Record similar pattern usage
          this.recordSimilarPattern(endpoint1.endpoint, endpoint2.endpoint, similarity);
        }
      }
    }
  }

  /**
   * Calculate path similarity between two endpoints
   * @param {string} path1 - First path
   * @param {string} path2 - Second path
   * @returns {number} Similarity score (0-1)
   */
  calculatePathSimilarity(path1, path2) {
    // Normalize paths
    const norm1 = this.normalizePath(path1);
    const norm2 = this.normalizePath(path2);
    
    // Simple Jaccard similarity on path segments
    const segments1 = new Set(norm1.split('/').filter(s => s.length > 0));
    const segments2 = new Set(norm2.split('/').filter(s => s.length > 0));
    
    const intersection = new Set([...segments1].filter(x => segments2.has(x)));
    const union = new Set([...segments1, ...segments2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Normalize path for comparison
   * @param {string} path - Original path
   * @returns {string} Normalized path
   */
  normalizePath(path) {
    return path
      .toLowerCase()
      .replace(/\{[^}]+\}/g, '{id}')  // Normalize path parameters
      .replace(/\/+/g, '/')           // Remove duplicate slashes
      .replace(/\/$/, '');            // Remove trailing slash
  }

  /**
   * Record similar pattern between endpoints
   * @param {Object} endpoint1 - First endpoint
   * @param {Object} endpoint2 - Second endpoint
   * @param {number} similarity - Similarity score
   */
  recordSimilarPattern(endpoint1, endpoint2, similarity) {
    const usage1 = this.usageData.get(`${endpoint1.serviceName}_${endpoint1.id}`);
    const usage2 = this.usageData.get(`${endpoint2.serviceName}_${endpoint2.id}`);
    
    if (usage1 && usage2) {
      // Add similarity weight based on the other endpoint's usage
      usage1.usageTypes.similar += similarity * 0.5;
      usage2.usageTypes.similar += similarity * 0.5;
      
      // Track related endpoints
      usage1.relatedEndpoints.add(`${endpoint2.serviceName}_${endpoint2.id}`);
      usage2.relatedEndpoints.add(`${endpoint1.serviceName}_${endpoint1.id}`);
    }
  }

  /**
   * Analyze external API usage patterns
   * @param {Map} services - All service data
   */
  analyzeExternalUsage(services) {
    for (const [serviceName, serviceInfo] of services) {
      if (!serviceInfo.analysisData?.unified) continue;

      const service = serviceInfo.analysisData.unified;
      
      // Analyze external dependencies for patterns
      service.dependencies.external.forEach(extDep => {
        this.analyzeExternalApiPattern(serviceName, extDep);
      });
    }
  }

  /**
   * Analyze external API patterns
   * @param {string} serviceName - Service name
   * @param {Object} externalDep - External dependency
   */
  analyzeExternalApiPattern(serviceName, externalDep) {
    // If external API patterns are similar to internal APIs,
    // it might indicate common usage patterns
    const externalEndpoints = externalDep.endpoints || [];
    
    externalEndpoints.forEach(extEndpoint => {
      // Find similar internal endpoints
      for (const [endpointId, endpointData] of this.usageData) {
        const similarity = this.calculatePathSimilarity(extEndpoint, endpointData.endpoint.path);
        
        if (similarity >= this.options.similarityThreshold * 0.7) {
          // Lower threshold for external similarity
          const usage = this.usageData.get(endpointId);
          usage.usageTypes.external += similarity * 0.3;
          usage.callPatterns.push({
            from: serviceName,
            type: 'external-pattern',
            external: externalDep.name,
            similarity,
            timestamp: new Date().toISOString()
          });
        }
      }
    });
  }

  /**
   * Calculate final frequency scores for all endpoints
   */
  calculateFrequencyScores() {
    for (const [endpointId, usage] of this.usageData) {
      let score = 0;
      
      // Apply weights to different usage types
      Object.entries(usage.usageTypes).forEach(([type, count]) => {
        const weight = this.options.weightFactors[type] || 0;
        score += count * weight;
      });
      
      // Bonus for multiple callers
      const callerBonus = Math.log(usage.callers.size + 1) * 0.2;
      score += callerBonus;
      
      // Bonus for related endpoints (network effect)
      const networkBonus = Math.log(usage.relatedEndpoints.size + 1) * 0.1;
      score += networkBonus;
      
      usage.frequencyScore = Math.round(score * 100) / 100;
      usage.usageCount = usage.callers.size;
    }
  }

  /**
   * Generate frequency analysis report
   * @returns {Object} Frequency analysis results
   */
  generateFrequencyReport() {
    const endpointsList = Array.from(this.usageData.values());
    
    // Sort by frequency score
    endpointsList.sort((a, b) => b.frequencyScore - a.frequencyScore);
    
    const report = {
      metadata: {
        analyzedAt: new Date().toISOString(),
        totalEndpoints: endpointsList.length,
        algorithmVersion: '1.0.0',
        weightFactors: this.options.weightFactors
      },
      topEndpoints: endpointsList.slice(0, 20).map(usage => ({
        endpointId: usage.endpoint.id,
        serviceName: usage.endpoint.serviceName,
        method: usage.endpoint.method,
        path: usage.endpoint.path,
        frequencyScore: usage.frequencyScore,
        usageCount: usage.usageCount,
        callers: Array.from(usage.callers),
        usageTypes: usage.usageTypes
      })),
      frequencyDistribution: this.calculateFrequencyDistribution(endpointsList),
      serviceFrequency: this.calculateServiceFrequency(endpointsList),
      methodFrequency: this.calculateMethodFrequency(endpointsList),
      callGraph: this.convertCallGraphToObject(),
      dependencyGraph: this.convertDependencyGraphToObject(),
      statistics: {
        averageFrequency: this.calculateAverageFrequency(endpointsList),
        medianFrequency: this.calculateMedianFrequency(endpointsList),
        maxFrequency: Math.max(...endpointsList.map(u => u.frequencyScore)),
        minFrequency: Math.min(...endpointsList.map(u => u.frequencyScore))
      }
    };
    
    return report;
  }

  /**
   * Calculate frequency distribution
   * @param {Array} endpointsList - List of endpoint usage data
   * @returns {Object} Frequency distribution
   */
  calculateFrequencyDistribution(endpointsList) {
    const distribution = {
      high: 0,    // score > 5
      medium: 0,  // score 2-5
      low: 0,     // score 0.5-2
      unused: 0   // score < 0.5
    };
    
    endpointsList.forEach(usage => {
      const score = usage.frequencyScore;
      if (score >= 5) distribution.high++;
      else if (score >= 2) distribution.medium++;
      else if (score >= 0.5) distribution.low++;
      else distribution.unused++;
    });
    
    return distribution;
  }

  /**
   * Calculate service-level frequency
   * @param {Array} endpointsList - List of endpoint usage data
   * @returns {Object} Service frequency stats
   */
  calculateServiceFrequency(endpointsList) {
    const serviceStats = {};
    
    endpointsList.forEach(usage => {
      const serviceName = usage.endpoint.serviceName;
      if (!serviceStats[serviceName]) {
        serviceStats[serviceName] = {
          totalEndpoints: 0,
          totalScore: 0,
          averageScore: 0,
          maxScore: 0
        };
      }
      
      const stats = serviceStats[serviceName];
      stats.totalEndpoints++;
      stats.totalScore += usage.frequencyScore;
      stats.maxScore = Math.max(stats.maxScore, usage.frequencyScore);
    });
    
    // Calculate averages
    Object.values(serviceStats).forEach(stats => {
      stats.averageScore = Math.round((stats.totalScore / stats.totalEndpoints) * 100) / 100;
    });
    
    return serviceStats;
  }

  /**
   * Calculate method-level frequency
   * @param {Array} endpointsList - List of endpoint usage data
   * @returns {Object} Method frequency stats
   */
  calculateMethodFrequency(endpointsList) {
    const methodStats = {};
    
    endpointsList.forEach(usage => {
      const method = usage.endpoint.method;
      if (!methodStats[method]) {
        methodStats[method] = {
          count: 0,
          totalScore: 0,
          averageScore: 0
        };
      }
      
      methodStats[method].count++;
      methodStats[method].totalScore += usage.frequencyScore;
    });
    
    // Calculate averages
    Object.values(methodStats).forEach(stats => {
      stats.averageScore = Math.round((stats.totalScore / stats.count) * 100) / 100;
    });
    
    return methodStats;
  }

  /**
   * Convert call graph to serializable object
   * @returns {Object} Call graph object
   */
  convertCallGraphToObject() {
    const graph = {};
    for (const [service, calls] of this.callGraph) {
      graph[service] = Array.from(calls);
    }
    return graph;
  }

  /**
   * Convert dependency graph to serializable object
   * @returns {Object} Dependency graph object
   */
  convertDependencyGraphToObject() {
    const graph = {};
    for (const [service, deps] of this.dependencyGraph) {
      graph[service] = deps;
    }
    return graph;
  }

  /**
   * Calculate average frequency
   * @param {Array} endpointsList - List of endpoint usage data
   * @returns {number} Average frequency score
   */
  calculateAverageFrequency(endpointsList) {
    const total = endpointsList.reduce((sum, usage) => sum + usage.frequencyScore, 0);
    return Math.round((total / endpointsList.length) * 100) / 100;
  }

  /**
   * Calculate median frequency
   * @param {Array} endpointsList - List of endpoint usage data
   * @returns {number} Median frequency score
   */
  calculateMedianFrequency(endpointsList) {
    const scores = endpointsList.map(usage => usage.frequencyScore).sort((a, b) => a - b);
    const mid = Math.floor(scores.length / 2);
    return scores.length % 2 === 0 
      ? (scores[mid - 1] + scores[mid]) / 2 
      : scores[mid];
  }
}

module.exports = FrequencyAnalyzer; 