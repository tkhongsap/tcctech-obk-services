/**
 * Cross-Reference Analyzer
 * Identifies APIs called by multiple services to find shared dependencies
 */
class CrossReferenceAnalyzer {
  constructor(options = {}) {
    this.options = {
      minSharedCallers: options.minSharedCallers || 2,
      includeIndirectReferences: options.includeIndirectReferences !== false,
      pathNormalization: options.pathNormalization !== false,
      similarityThreshold: options.similarityThreshold || 0.9,
      ...options
    };

    this.crossReferences = new Map();  // endpoint -> callers info
    this.sharedApis = new Map();       // shared APIs with caller details
    this.dependencyMatrix = new Map(); // service -> service dependencies
    this.callChains = new Map();       // multi-hop call chains
  }

  /**
   * Analyze cross-references across all services
   * @param {Map} endpoints - All extracted endpoints
   * @param {Map} services - All service data
   * @param {Object} frequencyData - Frequency analysis results
   * @returns {Object} Cross-reference analysis results
   */
  analyzeCrossReferences(endpoints, services, frequencyData) {
    // Initialize cross-reference tracking
    this.initializeCrossReferences(endpoints);

    // Analyze direct API calls
    this.analyzeDirectCalls(services);

    // Analyze dependency relationships
    this.analyzeDependencyRelationships(services);

    // Analyze indirect references
    if (this.options.includeIndirectReferences) {
      this.analyzeIndirectReferences(services);
    }

    // Identify shared APIs
    this.identifySharedApis();

    // Build dependency matrix
    this.buildDependencyMatrix();

    // Analyze call chains
    this.analyzeCallChains();

    // Generate cross-reference report
    return this.generateCrossReferenceReport(frequencyData);
  }

  /**
   * Initialize cross-reference tracking for all endpoints
   * @param {Map} endpoints - All endpoints
   */
  initializeCrossReferences(endpoints) {
    for (const [endpointId, endpoint] of endpoints) {
      this.crossReferences.set(endpointId, {
        endpoint,
        directCallers: new Set(),
        indirectCallers: new Set(),
        dependentServices: new Set(),
        referenceTypes: new Map(), // caller -> reference type
        callFrequency: new Map(),  // caller -> frequency
        lastSeen: new Map(),       // caller -> timestamp
        sharedScore: 0,
        riskLevel: 'low'
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
      
      // Analyze explicit API calls from relationships
      if (service.relationships?.apiCalls) {
        service.relationships.apiCalls.forEach(call => {
          this.recordDirectCall(serviceName, call.to, call.endpoint, call.method, {
            type: 'direct_call',
            source: 'relationship_map'
          });
        });
      }

      // Analyze dependency endpoints
      service.dependencies.internal.forEach(dep => {
        if (dep.endpoints && dep.endpoints.length > 0) {
          dep.endpoints.forEach(endpointPath => {
            this.recordDirectCall(serviceName, dep.name, endpointPath, 'GET', {
              type: 'dependency_call',
              source: 'dependency_map'
            });
          });
        }
      });

      // Analyze endpoint implementations for external calls
      service.endpoints.forEach(endpoint => {
        this.analyzeEndpointForCalls(serviceName, endpoint);
      });
    }
  }

  /**
   * Record a direct API call
   * @param {string} callerService - Service making the call
   * @param {string} targetService - Service being called
   * @param {string} endpointPath - Endpoint path
   * @param {string} method - HTTP method
   * @param {Object} metadata - Additional metadata
   */
  recordDirectCall(callerService, targetService, endpointPath, method, metadata = {}) {
    // Find the target endpoint
    const targetEndpointId = this.findEndpointId(targetService, endpointPath, method);
    
    if (targetEndpointId && this.crossReferences.has(targetEndpointId)) {
      const crossRef = this.crossReferences.get(targetEndpointId);
      
      // Record direct caller
      crossRef.directCallers.add(callerService);
      crossRef.referenceTypes.set(callerService, metadata.type || 'unknown');
      crossRef.lastSeen.set(callerService, new Date().toISOString());
      
      // Update call frequency
      const currentFreq = crossRef.callFrequency.get(callerService) || 0;
      crossRef.callFrequency.set(callerService, currentFreq + 1);
      
      // Update dependency matrix
      this.updateDependencyMatrix(callerService, targetService, endpointPath);
    }
  }

  /**
   * Find endpoint ID by service, path, and method
   * @param {string} serviceName - Service name
   * @param {string} path - Endpoint path
   * @param {string} method - HTTP method
   * @returns {string|null} Endpoint ID if found
   */
  findEndpointId(serviceName, path, method) {
    for (const [endpointId, crossRef] of this.crossReferences) {
      const endpoint = crossRef.endpoint;
      
      if (endpoint.serviceName === serviceName) {
        // Exact match
        if (endpoint.path === path && endpoint.method === method.toUpperCase()) {
          return endpointId;
        }
        
        // Normalized path match (if enabled)
        if (this.options.pathNormalization) {
          const normalizedPath = this.normalizePath(path);
          const normalizedEndpointPath = this.normalizePath(endpoint.path);
          
          if (normalizedPath === normalizedEndpointPath && endpoint.method === method.toUpperCase()) {
            return endpointId;
          }
        }
        
        // Similarity match (for flexible matching)
        if (this.calculatePathSimilarity(path, endpoint.path) >= this.options.similarityThreshold &&
            endpoint.method === method.toUpperCase()) {
          return endpointId;
        }
      }
    }
    return null;
  }

  /**
   * Normalize path for comparison
   * @param {string} path - Original path
   * @returns {string} Normalized path
   */
  normalizePath(path) {
    return path
      .toLowerCase()
      .replace(/\{[^}]+\}/g, '{id}')     // Normalize path parameters
      .replace(/\/+/g, '/')              // Remove duplicate slashes
      .replace(/\/$/, '')                // Remove trailing slash
      .replace(/^\//, '');               // Remove leading slash
  }

  /**
   * Calculate path similarity
   * @param {string} path1 - First path
   * @param {string} path2 - Second path
   * @returns {number} Similarity score (0-1)
   */
  calculatePathSimilarity(path1, path2) {
    const norm1 = this.normalizePath(path1);
    const norm2 = this.normalizePath(path2);
    
    if (norm1 === norm2) return 1.0;
    
    // Levenshtein distance based similarity
    const maxLength = Math.max(norm1.length, norm2.length);
    if (maxLength === 0) return 1.0;
    
    const distance = this.levenshteinDistance(norm1, norm2);
    return 1 - (distance / maxLength);
  }

  /**
   * Calculate Levenshtein distance
   * @param {string} str1 - First string
   * @param {string} str2 - Second string
   * @returns {number} Edit distance
   */
  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Analyze endpoint implementation for external calls
   * @param {string} serviceName - Service name
   * @param {Object} endpoint - Endpoint data
   */
  analyzeEndpointForCalls(serviceName, endpoint) {
    const description = (endpoint.description || '').toLowerCase();
    const file = endpoint.file || '';
    
    // Look for patterns indicating calls to other services
    const callPatterns = [
      /calls?\s+(\w+)\.(\w+)\(/gi,           // service.method() calls
      /http\.(get|post|put|delete)\s*\(\s*['"](\/[^'"]+)/gi,  // HTTP calls
      /fetch\s*\(\s*['"](\/[^'"]+)/gi,       // Fetch calls
      /axios\.(get|post|put|delete)\s*\(\s*['"](\/[^'"]+)/gi, // Axios calls
      /request\s*\(\s*['"](\/[^'"]+)/gi,     // Request calls
    ];

    callPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(description)) !== null) {
        if (match[2]) { // Has endpoint path
          const method = match[1] ? match[1].toUpperCase() : 'GET';
          const path = match[2];
          this.recordInferredCall(serviceName, path, method, {
            source: 'description_analysis',
            pattern: match[0]
          });
        }
      }
    });

    // Analyze parameters for service references
    endpoint.parameters?.forEach(param => {
      this.analyzeParameterForReferences(serviceName, param);
    });
  }

  /**
   * Record an inferred API call
   * @param {string} callerService - Service making the call
   * @param {string} path - Endpoint path
   * @param {string} method - HTTP method
   * @param {Object} metadata - Additional metadata
   */
  recordInferredCall(callerService, path, method, metadata = {}) {
    // Try to find matching endpoints across all services
    for (const [endpointId, crossRef] of this.crossReferences) {
      const endpoint = crossRef.endpoint;
      
      if (endpoint.serviceName !== callerService) { // Don't match same service
        const similarity = this.calculatePathSimilarity(path, endpoint.path);
        
        if (similarity >= this.options.similarityThreshold &&
            endpoint.method === method) {
          
          crossRef.indirectCallers.add(callerService);
          crossRef.referenceTypes.set(`${callerService}_indirect`, metadata.source || 'inferred');
          crossRef.lastSeen.set(callerService, new Date().toISOString());
        }
      }
    }
  }

  /**
   * Analyze parameter for service references
   * @param {string} serviceName - Service name
   * @param {Object} parameter - Parameter data
   */
  analyzeParameterForReferences(serviceName, parameter) {
    const paramName = (parameter.name || '').toLowerCase();
    const paramDesc = (parameter.description || '').toLowerCase();
    
    // Look for service-related parameters
    if (paramName.includes('service') || paramName.includes('endpoint') ||
        paramDesc.includes('calls') || paramDesc.includes('api')) {
      
      // This indicates potential service interaction
      // Record as a light reference
      for (const [endpointId, crossRef] of this.crossReferences) {
        if (crossRef.endpoint.serviceName !== serviceName) {
          crossRef.indirectCallers.add(serviceName);
          crossRef.referenceTypes.set(`${serviceName}_param`, 'parameter_reference');
        }
      }
    }
  }

  /**
   * Analyze dependency relationships
   * @param {Map} services - All service data
   */
  analyzeDependencyRelationships(services) {
    for (const [serviceName, serviceInfo] of services) {
      if (!serviceInfo.analysisData?.unified) continue;

      const service = serviceInfo.analysisData.unified;
      
      // Analyze internal service dependencies
      service.dependencies.internal.forEach(dep => {
        this.recordServiceDependency(serviceName, dep.name, dep);
      });

      // Analyze external dependencies (for completeness)
      service.dependencies.external.forEach(dep => {
        this.recordExternalDependency(serviceName, dep.name, dep);
      });
    }
  }

  /**
   * Record service dependency
   * @param {string} fromService - Dependent service
   * @param {string} toService - Dependency service
   * @param {Object} dependency - Dependency data
   */
  recordServiceDependency(fromService, toService, dependency) {
    // Mark all endpoints of target service as potentially called
    for (const [endpointId, crossRef] of this.crossReferences) {
      if (crossRef.endpoint.serviceName === toService) {
        crossRef.dependentServices.add(fromService);
        crossRef.referenceTypes.set(`${fromService}_dep`, 'service_dependency');
        
        // If specific endpoints are mentioned, give them higher weight
        if (dependency.endpoints && dependency.endpoints.length > 0) {
          const isSpecific = dependency.endpoints.some(ep => 
            this.calculatePathSimilarity(ep, crossRef.endpoint.path) >= this.options.similarityThreshold
          );
          
          if (isSpecific) {
            crossRef.directCallers.add(fromService);
          }
        }
      }
    }

    // Update dependency matrix
    this.updateDependencyMatrix(fromService, toService, 'service_dependency');
  }

  /**
   * Record external dependency
   * @param {string} serviceName - Service name
   * @param {string} externalService - External service name
   * @param {Object} dependency - Dependency data
   */
  recordExternalDependency(serviceName, externalService, dependency) {
    // External dependencies don't directly affect internal cross-references
    // but we track them for analysis completeness
  }

  /**
   * Update dependency matrix
   * @param {string} fromService - Source service
   * @param {string} toService - Target service
   * @param {string} context - Context (endpoint or type)
   */
  updateDependencyMatrix(fromService, toService, context) {
    if (!this.dependencyMatrix.has(fromService)) {
      this.dependencyMatrix.set(fromService, new Map());
    }
    
    const dependencies = this.dependencyMatrix.get(fromService);
    
    if (!dependencies.has(toService)) {
      dependencies.set(toService, {
        count: 0,
        contexts: new Set(),
        lastUpdated: new Date().toISOString()
      });
    }
    
    const depInfo = dependencies.get(toService);
    depInfo.count++;
    depInfo.contexts.add(context);
    depInfo.lastUpdated = new Date().toISOString();
  }

  /**
   * Analyze indirect references
   * @param {Map} services - All service data
   */
  analyzeIndirectReferences(services) {
    // Look for chains of dependencies (A calls B, B calls C)
    this.buildCallChains();
    
    // Analyze documentation cross-references
    this.analyzeDocumentationReferences(services);
  }

  /**
   * Build call chains for indirect dependency analysis
   */
  buildCallChains() {
    // For each service dependency, look for transitive dependencies
    for (const [fromService, dependencies] of this.dependencyMatrix) {
      for (const [toService, depInfo] of dependencies) {
        // Check if toService also has dependencies
        if (this.dependencyMatrix.has(toService)) {
          const transitiveServices = this.dependencyMatrix.get(toService);
          
          for (const [transitiveService, transDepInfo] of transitiveServices) {
            // Record transitive call chain
            this.recordCallChain(fromService, toService, transitiveService, {
              direct: depInfo,
              transitive: transDepInfo
            });
          }
        }
      }
    }
  }

  /**
   * Record a call chain
   * @param {string} origin - Origin service
   * @param {string} intermediate - Intermediate service
   * @param {string} target - Target service
   * @param {Object} metadata - Chain metadata
   */
  recordCallChain(origin, intermediate, target, metadata) {
    const chainId = `${origin}->${intermediate}->${target}`;
    
    if (!this.callChains.has(chainId)) {
      this.callChains.set(chainId, {
        origin,
        intermediate,
        target,
        strength: 0,
        paths: [],
        metadata
      });
    }
    
    const chain = this.callChains.get(chainId);
    chain.strength++;
    
    // Mark target service endpoints as indirectly called by origin
    for (const [endpointId, crossRef] of this.crossReferences) {
      if (crossRef.endpoint.serviceName === target) {
        crossRef.indirectCallers.add(origin);
        crossRef.referenceTypes.set(`${origin}_chain`, 'call_chain');
      }
    }
  }

  /**
   * Analyze documentation for cross-references
   * @param {Map} services - All service data
   */
  analyzeDocumentationReferences(services) {
    for (const [serviceName, serviceInfo] of services) {
      if (!serviceInfo.analysisData?.unified) continue;

      const service = serviceInfo.analysisData.unified;
      
      // Analyze all text content for API references
      const textSources = [
        ...service.endpoints.map(ep => ep.description || ''),
        ...service.schemas.map(schema => schema.description || ''),
        service.service.description || ''
      ].join(' ').toLowerCase();

      this.extractApiReferencesFromText(serviceName, textSources);
    }
  }

  /**
   * Extract API references from text content
   * @param {string} serviceName - Source service name
   * @param {string} text - Text to analyze
   */
  extractApiReferencesFromText(serviceName, text) {
    // Look for various API reference patterns
    const patterns = [
      /(get|post|put|delete|patch)\s+(\/[\w\/-]+)/gi,
      /api\/([\w\/-]+)/gi,
      /endpoint\s+(\/[\w\/-]+)/gi,
      /(\/api\/[\w\/-]+)/gi
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const method = match[1] ? match[1].toUpperCase() : 'GET';
        const path = match[2] || match[1];
        
        if (path && path.startsWith('/')) {
          this.recordDocumentationReference(serviceName, path, method);
        }
      }
    });
  }

  /**
   * Record documentation reference
   * @param {string} serviceName - Source service
   * @param {string} path - Referenced path
   * @param {string} method - HTTP method
   */
  recordDocumentationReference(serviceName, path, method) {
    // Find matching endpoints
    for (const [endpointId, crossRef] of this.crossReferences) {
      const endpoint = crossRef.endpoint;
      
      if (endpoint.serviceName !== serviceName) { // Don't self-reference
        const similarity = this.calculatePathSimilarity(path, endpoint.path);
        
        if (similarity >= this.options.similarityThreshold * 0.8 && // Lower threshold for docs
            endpoint.method === method) {
          
          crossRef.indirectCallers.add(serviceName);
          crossRef.referenceTypes.set(`${serviceName}_doc`, 'documentation_reference');
        }
      }
    }
  }

  /**
   * Identify shared APIs (called by multiple services)
   */
  identifySharedApis() {
    for (const [endpointId, crossRef] of this.crossReferences) {
      const totalCallers = new Set([
        ...crossRef.directCallers,
        ...crossRef.indirectCallers,
        ...crossRef.dependentServices
      ]);

      if (totalCallers.size >= this.options.minSharedCallers) {
        // Calculate shared score
        crossRef.sharedScore = this.calculateSharedScore(crossRef);
        
        // Determine risk level
        crossRef.riskLevel = this.calculateRiskLevel(crossRef);
        
        // Store as shared API
        this.sharedApis.set(endpointId, {
          endpoint: crossRef.endpoint,
          callers: Array.from(totalCallers),
          directCallers: Array.from(crossRef.directCallers),
          indirectCallers: Array.from(crossRef.indirectCallers),
          dependentServices: Array.from(crossRef.dependentServices),
          sharedScore: crossRef.sharedScore,
          riskLevel: crossRef.riskLevel,
          callFrequency: Object.fromEntries(crossRef.callFrequency),
          referenceTypes: Object.fromEntries(crossRef.referenceTypes)
        });
      }
    }
  }

  /**
   * Calculate shared score for an endpoint
   * @param {Object} crossRef - Cross-reference data
   * @returns {number} Shared score
   */
  calculateSharedScore(crossRef) {
    const directWeight = 3;
    const indirectWeight = 1;
    const dependencyWeight = 2;
    
    const directScore = crossRef.directCallers.size * directWeight;
    const indirectScore = crossRef.indirectCallers.size * indirectWeight;
    const dependencyScore = crossRef.dependentServices.size * dependencyWeight;
    
    // Frequency bonus
    const totalFrequency = Array.from(crossRef.callFrequency.values())
      .reduce((sum, freq) => sum + freq, 0);
    const frequencyBonus = Math.log(totalFrequency + 1);
    
    return Math.round((directScore + indirectScore + dependencyScore + frequencyBonus) * 100) / 100;
  }

  /**
   * Calculate risk level for a shared API
   * @param {Object} crossRef - Cross-reference data
   * @returns {string} Risk level (low, medium, high, critical)
   */
  calculateRiskLevel(crossRef) {
    const totalCallers = crossRef.directCallers.size + 
                        crossRef.indirectCallers.size + 
                        crossRef.dependentServices.size;
    
    const directCallers = crossRef.directCallers.size;
    const sharedScore = crossRef.sharedScore || 0;
    
    if (directCallers >= 5 || sharedScore >= 20) {
      return 'critical';
    } else if (directCallers >= 3 || sharedScore >= 10) {
      return 'high';
    } else if (totalCallers >= 3 || sharedScore >= 5) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Generate cross-reference analysis report
   * @param {Object} frequencyData - Frequency analysis data
   * @returns {Object} Cross-reference report
   */
  generateCrossReferenceReport(frequencyData = {}) {
    const sharedApisList = Array.from(this.sharedApis.values());
    
    // Sort by shared score
    sharedApisList.sort((a, b) => b.sharedScore - a.sharedScore);

    const report = {
      metadata: {
        analyzedAt: new Date().toISOString(),
        totalEndpoints: this.crossReferences.size,
        sharedApis: sharedApisList.length,
        analysisOptions: this.options
      },
      sharedApis: sharedApisList.map(api => ({
        endpointId: api.endpoint.id,
        serviceName: api.endpoint.serviceName,
        method: api.endpoint.method,
        path: api.endpoint.path,
        callers: api.callers,
        sharedScore: api.sharedScore,
        riskLevel: api.riskLevel,
        callDetails: {
          direct: api.directCallers.length,
          indirect: api.indirectCallers.length,
          dependencies: api.dependentServices.length
        }
      })),
      riskAnalysis: this.generateRiskAnalysis(sharedApisList),
      dependencyMatrix: this.convertDependencyMatrixToObject(),
      callChains: this.convertCallChainsToObject(),
      serviceConnectivity: this.analyzeServiceConnectivity(),
      bottleneckCandidates: this.identifyBottleneckCandidates(sharedApisList),
      recommendations: this.generateRecommendations(sharedApisList)
    };

    return report;
  }

  /**
   * Generate risk analysis
   * @param {Array} sharedApisList - List of shared APIs
   * @returns {Object} Risk analysis
   */
  generateRiskAnalysis(sharedApisList) {
    const riskDistribution = {
      critical: sharedApisList.filter(api => api.riskLevel === 'critical').length,
      high: sharedApisList.filter(api => api.riskLevel === 'high').length,
      medium: sharedApisList.filter(api => api.riskLevel === 'medium').length,
      low: sharedApisList.filter(api => api.riskLevel === 'low').length
    };

    const topRisks = sharedApisList
      .filter(api => api.riskLevel === 'critical' || api.riskLevel === 'high')
      .slice(0, 10);

    return {
      distribution: riskDistribution,
      topRisks: topRisks.map(api => ({
        endpoint: `${api.method} ${api.path}`,
        service: api.serviceName,
        callers: api.callers.length,
        riskLevel: api.riskLevel,
        sharedScore: api.sharedScore
      })),
      totalRiskScore: sharedApisList.reduce((sum, api) => {
        const riskValues = { low: 1, medium: 3, high: 7, critical: 15 };
        return sum + (riskValues[api.riskLevel] || 0);
      }, 0)
    };
  }

  /**
   * Convert dependency matrix to serializable object
   * @returns {Object} Dependency matrix
   */
  convertDependencyMatrixToObject() {
    const matrix = {};
    for (const [fromService, dependencies] of this.dependencyMatrix) {
      matrix[fromService] = {};
      for (const [toService, depInfo] of dependencies) {
        matrix[fromService][toService] = {
          count: depInfo.count,
          contexts: Array.from(depInfo.contexts),
          lastUpdated: depInfo.lastUpdated
        };
      }
    }
    return matrix;
  }

  /**
   * Convert call chains to serializable object
   * @returns {Array} Call chains
   */
  convertCallChainsToObject() {
    return Array.from(this.callChains.values()).map(chain => ({
      id: `${chain.origin}->${chain.intermediate}->${chain.target}`,
      origin: chain.origin,
      intermediate: chain.intermediate,
      target: chain.target,
      strength: chain.strength
    }));
  }

  /**
   * Analyze service connectivity
   * @returns {Object} Connectivity analysis
   */
  analyzeServiceConnectivity() {
    const services = new Set();
    const connections = new Map();

    // Collect all services and their connections
    for (const [fromService, dependencies] of this.dependencyMatrix) {
      services.add(fromService);
      connections.set(fromService, dependencies.size);
      
      for (const toService of dependencies.keys()) {
        services.add(toService);
      }
    }

    const serviceCount = services.size;
    const totalConnections = Array.from(connections.values()).reduce((sum, count) => sum + count, 0);
    const avgConnections = serviceCount > 0 ? totalConnections / serviceCount : 0;

    // Find most connected services
    const connectivityRanking = Array.from(connections.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      totalServices: serviceCount,
      totalConnections,
      averageConnections: Math.round(avgConnections * 100) / 100,
      connectivityRanking: connectivityRanking.map(([service, count]) => ({
        service,
        connections: count
      }))
    };
  }

  /**
   * Identify bottleneck candidates
   * @param {Array} sharedApisList - List of shared APIs
   * @returns {Array} Bottleneck candidates
   */
  identifyBottleneckCandidates(sharedApisList) {
    return sharedApisList
      .filter(api => api.callers.length >= 3) // Called by 3+ services
      .filter(api => api.riskLevel === 'high' || api.riskLevel === 'critical')
      .slice(0, 15)
      .map(api => ({
        endpoint: `${api.method} ${api.path}`,
        service: api.serviceName,
        callers: api.callers,
        riskLevel: api.riskLevel,
        sharedScore: api.sharedScore,
        reason: this.getBottleneckReason(api)
      }));
  }

  /**
   * Get bottleneck reason
   * @param {Object} api - API data
   * @returns {string} Reason for being a bottleneck
   */
  getBottleneckReason(api) {
    const reasons = [];
    
    if (api.callers.length >= 5) {
      reasons.push(`Called by ${api.callers.length} services`);
    }
    
    if (api.callDetails.direct >= 3) {
      reasons.push(`${api.callDetails.direct} direct callers`);
    }
    
    if (api.sharedScore >= 15) {
      reasons.push(`High shared score (${api.sharedScore})`);
    }
    
    return reasons.join(', ') || 'Multiple dependencies';
  }

  /**
   * Generate recommendations
   * @param {Array} sharedApisList - List of shared APIs
   * @returns {Array} Recommendations
   */
  generateRecommendations(sharedApisList) {
    const recommendations = [];

    // Critical risk APIs
    const criticalApis = sharedApisList.filter(api => api.riskLevel === 'critical');
    if (criticalApis.length > 0) {
      recommendations.push({
        type: 'critical_risk',
        priority: 'high',
        title: 'Critical Shared APIs Require Immediate Attention',
        description: `${criticalApis.length} APIs have critical risk levels due to high dependency`,
        apis: criticalApis.slice(0, 5).map(api => `${api.method} ${api.path} (${api.serviceName})`),
        actions: [
          'Implement circuit breakers and fallback mechanisms',
          'Add comprehensive monitoring and alerting',
          'Consider API versioning strategies',
          'Review SLA requirements for these endpoints'
        ]
      });
    }

    // High connectivity services
    const connectivity = this.analyzeServiceConnectivity();
    if (connectivity.connectivityRanking.length > 0) {
      const topConnected = connectivity.connectivityRanking[0];
      if (topConnected.connections >= 5) {
        recommendations.push({
          type: 'high_connectivity',
          priority: 'medium',
          title: 'Services with High Connectivity',
          description: `${topConnected.service} has ${topConnected.connections} dependencies`,
          actions: [
            'Review service boundaries and responsibilities',
            'Consider service decomposition if appropriate',
            'Implement dependency injection patterns',
            'Add service mesh for traffic management'
          ]
        });
      }
    }

    // Call chain complexity
    if (this.callChains.size >= 5) {
      recommendations.push({
        type: 'call_chains',
        priority: 'medium',
        title: 'Complex Call Chains Detected',
        description: `${this.callChains.size} transitive call chains found`,
        actions: [
          'Review and simplify service interaction patterns',
          'Consider event-driven architectures for loose coupling',
          'Implement async communication where appropriate',
          'Add distributed tracing for visibility'
        ]
      });
    }

    return recommendations;
  }
}

module.exports = CrossReferenceAnalyzer; 