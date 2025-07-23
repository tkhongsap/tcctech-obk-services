/**
 * Complexity Analyzer
 * Analyzes and calculates complexity scores for API endpoints based on multiple factors
 */
class ComplexityAnalyzer {
  constructor(options = {}) {
    this.options = {
      weights: {
        parameters: options.weights?.parameters || 0.3,
        responses: options.weights?.responses || 0.25,
        authentication: options.weights?.authentication || 0.15,
        pathComplexity: options.weights?.pathComplexity || 0.1,
        methods: options.weights?.methods || 0.05,
        schemas: options.weights?.schemas || 0.15
      },
      thresholds: {
        low: options.thresholds?.low || 3,
        medium: options.thresholds?.medium || 6,
        high: options.thresholds?.high || 9
      },
      ...options
    };

    this.complexityMetrics = new Map();
    this.globalStats = {
      totalEndpoints: 0,
      averageComplexity: 0,
      complexityDistribution: { low: 0, medium: 0, high: 0, critical: 0 }
    };
  }

  /**
   * Analyze complexity for all endpoints
   * @param {Map} endpoints - All endpoints
   * @param {Map} services - Service data for context
   * @returns {Object} Complexity analysis results
   */
  analyzeComplexity(endpoints, services) {
    this.globalStats.totalEndpoints = endpoints.size;

    // Analyze each endpoint
    for (const [endpointId, endpoint] of endpoints) {
      const complexity = this.calculateEndpointComplexity(endpoint, services);
      this.complexityMetrics.set(endpointId, complexity);
    }

    // Calculate global statistics
    this.calculateGlobalStats();

    // Generate complexity insights
    const insights = this.generateComplexityInsights();

    return this.generateComplexityReport(insights);
  }

  /**
   * Calculate complexity for a single endpoint
   * @param {Object} endpoint - Endpoint data
   * @param {Map} services - Service data for context
   * @returns {Object} Complexity metrics
   */
  calculateEndpointComplexity(endpoint, services) {
    const metrics = {
      endpointId: endpoint.id || 'unknown',
      serviceName: endpoint.serviceName,
      method: endpoint.method,
      path: endpoint.path,
      parameterComplexity: this.calculateParameterComplexity(endpoint.parameters || []),
      responseComplexity: this.calculateResponseComplexity(endpoint.responses || []),
      authenticationComplexity: this.calculateAuthenticationComplexity(endpoint.security || []),
      pathComplexity: this.calculatePathComplexity(endpoint.path),
      methodComplexity: this.calculateMethodComplexity(endpoint.method),
      schemaComplexity: this.calculateSchemaComplexity(endpoint),
      overallComplexity: 0,
      complexityLevel: 'low',
      factors: [],
      recommendations: []
    };

    // Calculate weighted overall complexity
    metrics.overallComplexity = this.calculateWeightedComplexity(metrics);
    
    // Determine complexity level
    metrics.complexityLevel = this.determineComplexityLevel(metrics.overallComplexity);
    
    // Identify complexity factors
    metrics.factors = this.identifyComplexityFactors(metrics);
    
    // Generate recommendations
    metrics.recommendations = this.generateComplexityRecommendations(metrics);

    return metrics;
  }

  /**
   * Calculate parameter complexity
   * @param {Array} parameters - Endpoint parameters
   * @returns {Object} Parameter complexity metrics
   */
  calculateParameterComplexity(parameters) {
    const metrics = {
      count: parameters.length,
      requiredCount: 0,
      optionalCount: 0,
      typeComplexity: 0,
      validationComplexity: 0,
      nestingLevel: 0,
      score: 0
    };

    parameters.forEach(param => {
      // Count required vs optional
      if (param.required) {
        metrics.requiredCount++;
      } else {
        metrics.optionalCount++;
      }

      // Type complexity
      metrics.typeComplexity += this.getTypeComplexity(param.type);

      // Validation complexity
      metrics.validationComplexity += this.getValidationComplexity(param);

      // Nesting level for objects
      if (param.type === 'object' && param.properties) {
        metrics.nestingLevel = Math.max(metrics.nestingLevel, this.calculateNestingLevel(param.properties));
      }
    });

    // Calculate base score
    metrics.score = Math.min(10, 
      (metrics.count * 0.5) + 
      (metrics.requiredCount * 0.3) + 
      (metrics.typeComplexity * 0.2) + 
      (metrics.validationComplexity * 0.15) + 
      (metrics.nestingLevel * 0.5)
    );

    return metrics;
  }

  /**
   * Get type complexity score
   * @param {string} type - Parameter type
   * @returns {number} Type complexity score
   */
  getTypeComplexity(type) {
    const typeScores = {
      'string': 1,
      'number': 1,
      'integer': 1,
      'boolean': 1,
      'array': 2,
      'object': 3,
      'file': 2,
      'unknown': 0.5
    };

    return typeScores[type] || 1;
  }

  /**
   * Get validation complexity score
   * @param {Object} param - Parameter object
   * @returns {number} Validation complexity score
   */
  getValidationComplexity(param) {
    let score = 0;

    // Pattern/format validation
    if (param.pattern || param.format) score += 1;
    
    // Range validation
    if (param.minimum !== undefined || param.maximum !== undefined) score += 0.5;
    if (param.minLength !== undefined || param.maxLength !== undefined) score += 0.5;
    
    // Enum validation
    if (param.enum && param.enum.length > 0) score += param.enum.length * 0.1;
    
    // Custom validation
    if (param.validation || param.validators) score += 1;

    return Math.min(score, 3); // Cap at 3
  }

  /**
   * Calculate nesting level for object properties
   * @param {Object} properties - Object properties
   * @param {number} currentLevel - Current nesting level
   * @returns {number} Maximum nesting level
   */
  calculateNestingLevel(properties, currentLevel = 1) {
    if (!properties || typeof properties !== 'object') {
      return currentLevel;
    }

    let maxLevel = currentLevel;

    Object.values(properties).forEach(prop => {
      if (prop.type === 'object' && prop.properties) {
        const nestedLevel = this.calculateNestingLevel(prop.properties, currentLevel + 1);
        maxLevel = Math.max(maxLevel, nestedLevel);
      } else if (prop.type === 'array' && prop.items?.type === 'object' && prop.items.properties) {
        const nestedLevel = this.calculateNestingLevel(prop.items.properties, currentLevel + 1);
        maxLevel = Math.max(maxLevel, nestedLevel);
      }
    });

    return maxLevel;
  }

  /**
   * Calculate response complexity
   * @param {Array} responses - Endpoint responses
   * @returns {Object} Response complexity metrics
   */
  calculateResponseComplexity(responses) {
    const metrics = {
      count: responses.length,
      statusCodes: new Set(),
      mediaTypes: new Set(),
      schemaComplexity: 0,
      errorHandling: 0,
      score: 0
    };

    responses.forEach(response => {
      // Track status codes
      metrics.statusCodes.add(response.statusCode);

      // Track media types
      if (response.mediaType) {
        metrics.mediaTypes.add(response.mediaType);
      }

      // Schema complexity
      if (response.schema) {
        metrics.schemaComplexity += this.calculateSchemaDepth(response.schema);
      }

      // Error handling complexity
      if (this.isErrorResponse(response.statusCode)) {
        metrics.errorHandling += 1;
      }
    });

    // Calculate score
    metrics.score = Math.min(10,
      (metrics.count * 0.5) +
      (metrics.statusCodes.size * 0.3) +
      (metrics.mediaTypes.size * 0.2) +
      (metrics.schemaComplexity * 0.4) +
      (metrics.errorHandling * 0.3)
    );

    return metrics;
  }

  /**
   * Calculate schema depth/complexity
   * @param {Object} schema - Response schema
   * @returns {number} Schema complexity score
   */
  calculateSchemaDepth(schema) {
    if (!schema || typeof schema !== 'object') {
      return 0;
    }

    let complexity = 1; // Base complexity

    if (schema.type === 'object' && schema.properties) {
      const propertyCount = Object.keys(schema.properties).length;
      complexity += propertyCount * 0.2;

      // Recursive complexity for nested objects
      Object.values(schema.properties).forEach(prop => {
        if (prop.type === 'object' || (prop.type === 'array' && prop.items?.type === 'object')) {
          complexity += this.calculateSchemaDepth(prop.type === 'array' ? prop.items : prop) * 0.5;
        }
      });
    } else if (schema.type === 'array' && schema.items) {
      complexity += this.calculateSchemaDepth(schema.items) * 0.7;
    }

    return Math.min(complexity, 5); // Cap complexity
  }

  /**
   * Check if status code represents an error
   * @param {string} statusCode - HTTP status code
   * @returns {boolean} True if error status
   */
  isErrorResponse(statusCode) {
    const code = parseInt(statusCode);
    return code >= 400;
  }

  /**
   * Calculate authentication complexity
   * @param {Array} security - Security requirements
   * @returns {Object} Authentication complexity metrics
   */
  calculateAuthenticationComplexity(security) {
    const metrics = {
      schemes: security.length,
      types: new Set(),
      scopesCount: 0,
      score: 0
    };

    security.forEach(sec => {
      if (sec.type) {
        metrics.types.add(sec.type);
      }

      if (sec.scopes && Array.isArray(sec.scopes)) {
        metrics.scopesCount += sec.scopes.length;
      }
    });

    // Calculate score based on authentication complexity
    const typeComplexity = {
      'none': 0,
      'basic': 1,
      'bearer': 1,
      'apiKey': 1,
      'oauth2': 3,
      'openIdConnect': 3
    };

    let typeScore = 0;
    metrics.types.forEach(type => {
      typeScore += typeComplexity[type] || 1;
    });

    metrics.score = Math.min(5,
      typeScore +
      (metrics.scopesCount * 0.1) +
      (metrics.schemes > 1 ? 1 : 0) // Multiple auth schemes
    );

    return metrics;
  }

  /**
   * Calculate path complexity
   * @param {string} path - Endpoint path
   * @returns {Object} Path complexity metrics
   */
  calculatePathComplexity(path) {
    const metrics = {
      segments: 0,
      parameters: 0,
      depth: 0,
      patterns: [],
      score: 0
    };

    if (!path || typeof path !== 'string') {
      return metrics;
    }

    const segments = path.split('/').filter(s => s.length > 0);
    metrics.segments = segments.length;
    metrics.depth = segments.length;

    // Count path parameters
    const paramMatches = path.match(/\{[^}]+\}/g);
    metrics.parameters = paramMatches ? paramMatches.length : 0;

    // Identify complex patterns
    if (path.includes('*')) metrics.patterns.push('wildcard');
    if (path.includes('?')) metrics.patterns.push('query');
    if (path.match(/\{[^}]+\}/)) metrics.patterns.push('parameters');
    if (segments.length > 5) metrics.patterns.push('deep_nesting');

    // Calculate score
    metrics.score = Math.min(5,
      (metrics.depth * 0.3) +
      (metrics.parameters * 0.5) +
      (metrics.patterns.length * 0.4)
    );

    return metrics;
  }

  /**
   * Calculate method complexity
   * @param {string} method - HTTP method
   * @returns {Object} Method complexity metrics
   */
  calculateMethodComplexity(method) {
    const methodComplexity = {
      'GET': 1,
      'HEAD': 1,
      'OPTIONS': 1,
      'POST': 2,
      'PUT': 2,
      'PATCH': 3,
      'DELETE': 2
    };

    const score = methodComplexity[method] || 1;

    return {
      method,
      score,
      category: score <= 1 ? 'read' : score <= 2 ? 'write' : 'complex'
    };
  }

  /**
   * Calculate schema complexity for the endpoint
   * @param {Object} endpoint - Endpoint data
   * @returns {Object} Schema complexity metrics
   */
  calculateSchemaComplexity(endpoint) {
    const metrics = {
      requestSchema: 0,
      responseSchemas: 0,
      totalSchemas: 0,
      score: 0
    };

    // Request body schema complexity
    if (endpoint.requestBody?.schema) {
      metrics.requestSchema = this.calculateSchemaDepth(endpoint.requestBody.schema);
    }

    // Response schemas complexity
    if (endpoint.responses) {
      endpoint.responses.forEach(response => {
        if (response.schema) {
          metrics.responseSchemas += this.calculateSchemaDepth(response.schema);
        }
      });
    }

    metrics.totalSchemas = metrics.requestSchema + metrics.responseSchemas;
    metrics.score = Math.min(5, metrics.totalSchemas);

    return metrics;
  }

  /**
   * Calculate weighted overall complexity
   * @param {Object} metrics - Complexity metrics
   * @returns {number} Weighted complexity score
   */
  calculateWeightedComplexity(metrics) {
    const weights = this.options.weights;
    
    const score = 
      (metrics.parameterComplexity.score * weights.parameters) +
      (metrics.responseComplexity.score * weights.responses) +
      (metrics.authenticationComplexity.score * weights.authentication) +
      (metrics.pathComplexity.score * weights.pathComplexity) +
      (metrics.methodComplexity.score * weights.methods) +
      (metrics.schemaComplexity.score * weights.schemas);

    return Math.round(score * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Determine complexity level based on score
   * @param {number} score - Complexity score
   * @returns {string} Complexity level
   */
  determineComplexityLevel(score) {
    const thresholds = this.options.thresholds;
    
    if (score <= thresholds.low) return 'low';
    if (score <= thresholds.medium) return 'medium';
    if (score <= thresholds.high) return 'high';
    return 'critical';
  }

  /**
   * Identify main complexity factors
   * @param {Object} metrics - Complexity metrics
   * @returns {Array} Complexity factors
   */
  identifyComplexityFactors(metrics) {
    const factors = [];

    if (metrics.parameterComplexity.score >= 3) {
      factors.push({
        type: 'parameters',
        score: metrics.parameterComplexity.score,
        description: `${metrics.parameterComplexity.count} parameters (${metrics.parameterComplexity.requiredCount} required)`
      });
    }

    if (metrics.responseComplexity.score >= 3) {
      factors.push({
        type: 'responses',
        score: metrics.responseComplexity.score,
        description: `${metrics.responseComplexity.count} responses with ${metrics.responseComplexity.statusCodes.size} status codes`
      });
    }

    if (metrics.authenticationComplexity.score >= 2) {
      factors.push({
        type: 'authentication',
        score: metrics.authenticationComplexity.score,
        description: `${metrics.authenticationComplexity.schemes} auth schemes with ${metrics.authenticationComplexity.types.size} types`
      });
    }

    if (metrics.pathComplexity.score >= 2) {
      factors.push({
        type: 'path',
        score: metrics.pathComplexity.score,
        description: `Path depth: ${metrics.pathComplexity.depth}, Parameters: ${metrics.pathComplexity.parameters}`
      });
    }

    if (metrics.schemaComplexity.score >= 2) {
      factors.push({
        type: 'schema',
        score: metrics.schemaComplexity.score,
        description: `Complex request/response schemas`
      });
    }

    return factors.sort((a, b) => b.score - a.score);
  }

  /**
   * Generate complexity recommendations
   * @param {Object} metrics - Complexity metrics
   * @returns {Array} Recommendations
   */
  generateComplexityRecommendations(metrics) {
    const recommendations = [];

    if (metrics.overallComplexity >= this.options.thresholds.high) {
      recommendations.push({
        type: 'high_complexity',
        priority: 'high',
        message: 'Endpoint has high complexity - consider splitting into smaller endpoints',
        details: `Overall complexity: ${metrics.overallComplexity}`
      });
    }

    if (metrics.parameterComplexity.count > 10) {
      recommendations.push({
        type: 'too_many_parameters',
        priority: 'medium',
        message: 'Too many parameters - consider using request body or grouping parameters',
        details: `${metrics.parameterComplexity.count} parameters`
      });
    }

    if (metrics.parameterComplexity.requiredCount > 5) {
      recommendations.push({
        type: 'too_many_required',
        priority: 'medium',
        message: 'Too many required parameters - review if all are necessary',
        details: `${metrics.parameterComplexity.requiredCount} required parameters`
      });
    }

    if (metrics.responseComplexity.statusCodes.size > 6) {
      recommendations.push({
        type: 'too_many_responses',
        priority: 'low',
        message: 'Many response status codes - ensure proper error handling documentation',
        details: `${metrics.responseComplexity.statusCodes.size} status codes`
      });
    }

    if (metrics.pathComplexity.depth > 6) {
      recommendations.push({
        type: 'deep_path',
        priority: 'low',
        message: 'Deep URL path - consider flattening resource hierarchy',
        details: `Path depth: ${metrics.pathComplexity.depth}`
      });
    }

    if (metrics.authenticationComplexity.schemes > 2) {
      recommendations.push({
        type: 'multiple_auth',
        priority: 'medium',
        message: 'Multiple authentication schemes - consider standardizing',
        details: `${metrics.authenticationComplexity.schemes} auth schemes`
      });
    }

    return recommendations;
  }

  /**
   * Calculate global statistics
   */
  calculateGlobalStats() {
    const complexities = Array.from(this.complexityMetrics.values());
    
    if (complexities.length === 0) {
      return;
    }

    // Calculate average
    const totalComplexity = complexities.reduce((sum, metric) => sum + metric.overallComplexity, 0);
    this.globalStats.averageComplexity = Math.round((totalComplexity / complexities.length) * 100) / 100;

    // Calculate distribution
    const distribution = { low: 0, medium: 0, high: 0, critical: 0 };
    complexities.forEach(metric => {
      distribution[metric.complexityLevel]++;
    });
    this.globalStats.complexityDistribution = distribution;
  }

  /**
   * Generate complexity insights
   * @returns {Object} Complexity insights
   */
  generateComplexityInsights() {
    const complexities = Array.from(this.complexityMetrics.values());
    
    return {
      topComplexEndpoints: this.getTopComplexEndpoints(complexities, 10),
      complexityByService: this.getComplexityByService(complexities),
      complexityByMethod: this.getComplexityByMethod(complexities),
      commonComplexityFactors: this.getCommonComplexityFactors(complexities),
      simplificationOpportunities: this.getSimplificationOpportunities(complexities)
    };
  }

  /**
   * Get top complex endpoints
   * @param {Array} complexities - All complexity metrics
   * @param {number} limit - Number of results
   * @returns {Array} Top complex endpoints
   */
  getTopComplexEndpoints(complexities, limit = 10) {
    return complexities
      .sort((a, b) => b.overallComplexity - a.overallComplexity)
      .slice(0, limit)
      .map(metric => ({
        endpoint: `${metric.method} ${metric.path}`,
        service: metric.serviceName,
        complexity: metric.overallComplexity,
        level: metric.complexityLevel,
        mainFactors: metric.factors.slice(0, 3).map(f => f.type)
      }));
  }

  /**
   * Get complexity breakdown by service
   * @param {Array} complexities - All complexity metrics
   * @returns {Object} Complexity by service
   */
  getComplexityByService(complexities) {
    const serviceStats = {};

    complexities.forEach(metric => {
      const service = metric.serviceName || 'unknown';
      
      if (!serviceStats[service]) {
        serviceStats[service] = {
          endpointCount: 0,
          totalComplexity: 0,
          averageComplexity: 0,
          distribution: { low: 0, medium: 0, high: 0, critical: 0 }
        };
      }

      const stats = serviceStats[service];
      stats.endpointCount++;
      stats.totalComplexity += metric.overallComplexity;
      stats.distribution[metric.complexityLevel]++;
    });

    // Calculate averages
    Object.values(serviceStats).forEach(stats => {
      stats.averageComplexity = Math.round((stats.totalComplexity / stats.endpointCount) * 100) / 100;
    });

    return serviceStats;
  }

  /**
   * Get complexity breakdown by HTTP method
   * @param {Array} complexities - All complexity metrics
   * @returns {Object} Complexity by method
   */
  getComplexityByMethod(complexities) {
    const methodStats = {};

    complexities.forEach(metric => {
      const method = metric.method || 'UNKNOWN';
      
      if (!methodStats[method]) {
        methodStats[method] = {
          count: 0,
          totalComplexity: 0,
          averageComplexity: 0
        };
      }

      methodStats[method].count++;
      methodStats[method].totalComplexity += metric.overallComplexity;
    });

    // Calculate averages
    Object.values(methodStats).forEach(stats => {
      stats.averageComplexity = Math.round((stats.totalComplexity / stats.count) * 100) / 100;
    });

    return methodStats;
  }

  /**
   * Get common complexity factors
   * @param {Array} complexities - All complexity metrics
   * @returns {Object} Common factors
   */
  getCommonComplexityFactors(complexities) {
    const factorCounts = {};

    complexities.forEach(metric => {
      metric.factors.forEach(factor => {
        factorCounts[factor.type] = (factorCounts[factor.type] || 0) + 1;
      });
    });

    const sortedFactors = Object.entries(factorCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / complexities.length) * 100)
      }));

    return sortedFactors;
  }

  /**
   * Get simplification opportunities
   * @param {Array} complexities - All complexity metrics
   * @returns {Array} Simplification opportunities
   */
  getSimplificationOpportunities(complexities) {
    const opportunities = [];

    // Find endpoints with many parameters
    const highParamEndpoints = complexities.filter(
      metric => metric.parameterComplexity.count > 8
    );
    
    if (highParamEndpoints.length > 0) {
      opportunities.push({
        type: 'parameter_reduction',
        count: highParamEndpoints.length,
        message: `${highParamEndpoints.length} endpoints with 8+ parameters`,
        suggestion: 'Consider using request bodies or parameter grouping'
      });
    }

    // Find endpoints with complex auth
    const complexAuthEndpoints = complexities.filter(
      metric => metric.authenticationComplexity.schemes > 1
    );
    
    if (complexAuthEndpoints.length > 0) {
      opportunities.push({
        type: 'auth_standardization',
        count: complexAuthEndpoints.length,
        message: `${complexAuthEndpoints.length} endpoints with multiple auth schemes`,
        suggestion: 'Standardize authentication across endpoints'
      });
    }

    // Find deep paths
    const deepPathEndpoints = complexities.filter(
      metric => metric.pathComplexity.depth > 5
    );
    
    if (deepPathEndpoints.length > 0) {
      opportunities.push({
        type: 'path_flattening',
        count: deepPathEndpoints.length,
        message: `${deepPathEndpoints.length} endpoints with deep URL paths`,
        suggestion: 'Consider flattening resource hierarchy'
      });
    }

    return opportunities;
  }

  /**
   * Generate comprehensive complexity report
   * @param {Object} insights - Complexity insights
   * @returns {Object} Complete complexity report
   */
  generateComplexityReport(insights) {
    return {
      metadata: {
        analyzedAt: new Date().toISOString(),
        totalEndpoints: this.globalStats.totalEndpoints,
        analysisOptions: this.options,
        version: '1.0.0'
      },
      globalStatistics: this.globalStats,
      insights,
      detailedMetrics: this.convertMetricsToArray(),
      summary: {
        averageComplexity: this.globalStats.averageComplexity,
        complexityDistribution: this.globalStats.complexityDistribution,
        mostComplexService: this.getMostComplexService(insights.complexityByService),
        topRecommendations: this.getTopRecommendations(insights)
      }
    };
  }

  /**
   * Convert metrics map to array for serialization
   * @returns {Array} Metrics array
   */
  convertMetricsToArray() {
    return Array.from(this.complexityMetrics.values());
  }

  /**
   * Get most complex service
   * @param {Object} complexityByService - Service complexity data
   * @returns {Object} Most complex service
   */
  getMostComplexService(complexityByService) {
    let maxComplexity = 0;
    let mostComplex = null;

    Object.entries(complexityByService).forEach(([service, stats]) => {
      if (stats.averageComplexity > maxComplexity) {
        maxComplexity = stats.averageComplexity;
        mostComplex = {
          service,
          averageComplexity: stats.averageComplexity,
          endpointCount: stats.endpointCount
        };
      }
    });

    return mostComplex;
  }

  /**
   * Get top recommendations from all endpoints
   * @param {Object} insights - Complexity insights
   * @returns {Array} Top recommendations
   */
  getTopRecommendations(insights) {
    const allRecommendations = [];

    // Add simplification opportunities
    insights.simplificationOpportunities.forEach(opp => {
      allRecommendations.push({
        type: 'optimization',
        priority: 'medium',
        message: opp.message,
        suggestion: opp.suggestion
      });
    });

    // Add high complexity warnings
    const criticalCount = this.globalStats.complexityDistribution.critical;
    if (criticalCount > 0) {
      allRecommendations.push({
        type: 'critical_complexity',
        priority: 'high',
        message: `${criticalCount} endpoints have critical complexity levels`,
        suggestion: 'Review and simplify these endpoints immediately'
      });
    }

    // Sort by priority and return top 5
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    return allRecommendations
      .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
      .slice(0, 5);
  }
}

module.exports = ComplexityAnalyzer; 