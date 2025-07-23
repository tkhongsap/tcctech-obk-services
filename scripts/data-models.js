/**
 * Normalized Data Models for API Analysis
 * Provides consistent data structures for storing parsed service information
 */

/**
 * Normalized Service Information Structure
 */
class ServiceInfo {
  constructor(serviceName, filePath) {
    this.serviceName = serviceName;
    this.sourceFile = filePath;
    this.framework = null;
    this.endpoints = [];
    this.dependencies = [];
    this.externalAPIs = [];
    this.consumers = [];
    this.metadata = {};
    this.validation = {
      isValid: true,
      errors: [],
      warnings: []
    };
    this.lastUpdated = new Date().toISOString();
  }

  /**
   * Add an API endpoint to the service
   * @param {Object} endpoint - Endpoint information
   */
  addEndpoint(endpoint) {
    const normalizedEndpoint = new APIEndpoint(
      endpoint.method || 'GET',
      endpoint.path || '',
      endpoint.description || '',
      endpoint.type || 'internal'
    );
    this.endpoints.push(normalizedEndpoint);
  }

  /**
   * Add a service dependency
   * @param {Object} dependency - Dependency information
   */
  addDependency(dependency) {
    const normalizedDep = new ServiceDependency(
      dependency.service || dependency.serviceName || '',
      dependency.type || 'service',
      dependency.endpoints || [],
      dependency.description || ''
    );
    this.dependencies.push(normalizedDep);
  }

  /**
   * Add an external API reference
   * @param {Object} externalAPI - External API information
   */
  addExternalAPI(externalAPI) {
    const normalizedAPI = new ExternalAPI(
      externalAPI.url || externalAPI.endpoint || '',
      externalAPI.name || '',
      externalAPI.description || '',
      externalAPI.type || 'external'
    );
    this.externalAPIs.push(normalizedAPI);
  }

  /**
   * Set framework information
   * @param {string} framework - Framework name
   */
  setFramework(framework) {
    this.framework = this.normalizeFramework(framework);
  }

  /**
   * Normalize framework names to standard values
   * @param {string} framework - Raw framework string
   * @returns {string} Normalized framework name
   */
  normalizeFramework(framework) {
    if (!framework) return 'unknown';
    
    const normalized = framework.toLowerCase().trim();
    
    if (normalized.includes('express')) return 'Express.js';
    if (normalized.includes('nestjs') || normalized.includes('nest')) return 'NestJS';
    if (normalized.includes('fastify')) return 'Fastify';
    if (normalized.includes('koa')) return 'Koa.js';
    if (normalized.includes('spring')) return 'Spring Boot';
    if (normalized.includes('django')) return 'Django';
    if (normalized.includes('flask')) return 'Flask';
    if (normalized.includes('rails')) return 'Ruby on Rails';
    if (normalized.includes('laravel')) return 'Laravel';
    
    return framework; // Return original if no match
  }

  /**
   * Get summary statistics for this service
   * @returns {Object} Summary statistics
   */
  getSummary() {
    return {
      serviceName: this.serviceName,
      framework: this.framework,
      endpointCount: this.endpoints.length,
      dependencyCount: this.dependencies.length,
      externalAPICount: this.externalAPIs.length,
      consumerCount: this.consumers.length,
      hasValidation: this.validation.isValid,
      errorCount: this.validation.errors.length,
      warningCount: this.validation.warnings.length,
      lastUpdated: this.lastUpdated
    };
  }
}

/**
 * Normalized API Endpoint Structure
 */
class APIEndpoint {
  constructor(method, path, description = '', type = 'internal') {
    this.method = this.normalizeMethod(method);
    this.path = this.normalizePath(path);
    this.description = description;
    this.type = type;
    this.parameters = [];
    this.responses = [];
    this.tags = [];
  }

  /**
   * Normalize HTTP method
   * @param {string} method - Raw method string
   * @returns {string} Normalized method
   */
  normalizeMethod(method) {
    if (!method) return 'GET';
    return method.toUpperCase().trim();
  }

  /**
   * Normalize API path
   * @param {string} path - Raw path string
   * @returns {string} Normalized path
   */
  normalizePath(path) {
    if (!path) return '/';
    
    let normalized = path.trim();
    
    // Ensure path starts with /
    if (!normalized.startsWith('/')) {
      normalized = '/' + normalized;
    }
    
    // Remove trailing slash unless it's root
    if (normalized.length > 1 && normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }
    
    return normalized;
  }

  /**
   * Get endpoint identifier for comparison
   * @returns {string} Unique identifier
   */
  getIdentifier() {
    return `${this.method} ${this.path}`;
  }
}

/**
 * Normalized Service Dependency Structure
 */
class ServiceDependency {
  constructor(serviceName, type = 'service', endpoints = [], description = '') {
    this.serviceName = serviceName;
    this.type = type;
    this.endpoints = endpoints.map(ep => {
      if (typeof ep === 'string') {
        // If endpoint is just a string, try to parse it
        const parts = ep.split(' ');
        return new APIEndpoint(
          parts.length > 1 ? parts[0] : 'GET',
          parts.length > 1 ? parts[1] : parts[0]
        );
      }
      return new APIEndpoint(ep.method, ep.path, ep.description, ep.type);
    });
    this.description = description;
    this.strength = this.calculateStrength();
  }

  /**
   * Calculate dependency strength based on number of endpoint calls
   * @returns {string} Strength level
   */
  calculateStrength() {
    const count = this.endpoints.length;
    if (count === 0) return 'none';
    if (count === 1) return 'weak';
    if (count <= 3) return 'moderate';
    if (count <= 10) return 'strong';
    return 'critical';
  }
}

/**
 * Normalized External API Structure
 */
class ExternalAPI {
  constructor(url, name = '', description = '', type = 'external') {
    this.url = url;
    this.name = name || this.extractNameFromURL(url);
    this.description = description;
    this.type = type;
    this.domain = this.extractDomain(url);
  }

  /**
   * Extract service name from URL
   * @param {string} url - API URL
   * @returns {string} Extracted name
   */
  extractNameFromURL(url) {
    try {
      const parsedURL = new URL(url);
      return parsedURL.hostname.replace('www.', '');
    } catch {
      return url.split('/')[0] || 'unknown';
    }
  }

  /**
   * Extract domain from URL
   * @param {string} url - API URL
   * @returns {string} Domain name
   */
  extractDomain(url) {
    try {
      const parsedURL = new URL(url);
      return parsedURL.hostname;
    } catch {
      return 'unknown';
    }
  }
}

/**
 * Analysis Result Container
 */
class AnalysisResult {
  constructor() {
    this.services = new Map(); // serviceName -> ServiceInfo
    this.summary = {
      totalServices: 0,
      frameworks: {},
      totalEndpoints: 0,
      totalDependencies: 0,
      mostUsedAPIs: [],
      riskAssessment: {}
    };
    this.errors = [];
    this.warnings = [];
    this.timestamp = new Date().toISOString();
  }

  /**
   * Add a service to the analysis result
   * @param {ServiceInfo} serviceInfo - Service information
   */
  addService(serviceInfo) {
    this.services.set(serviceInfo.serviceName, serviceInfo);
    this.updateSummary();
  }

  /**
   * Get service by name
   * @param {string} serviceName - Service name
   * @returns {ServiceInfo|null} Service information
   */
  getService(serviceName) {
    return this.services.get(serviceName) || null;
  }

  /**
   * Get all services as array
   * @returns {Array<ServiceInfo>} Array of services
   */
  getAllServices() {
    return Array.from(this.services.values());
  }

  /**
   * Update summary statistics
   */
  updateSummary() {
    const services = this.getAllServices();
    
    this.summary.totalServices = services.length;
    this.summary.totalEndpoints = services.reduce((sum, s) => sum + s.endpoints.length, 0);
    this.summary.totalDependencies = services.reduce((sum, s) => sum + s.dependencies.length, 0);
    
    // Framework distribution
    this.summary.frameworks = {};
    services.forEach(service => {
      const framework = service.framework || 'unknown';
      this.summary.frameworks[framework] = (this.summary.frameworks[framework] || 0) + 1;
    });
  }

  /**
   * Export to JSON
   * @returns {Object} JSON representation
   */
  toJSON() {
    return {
      timestamp: this.timestamp,
      summary: this.summary,
      services: this.getAllServices().map(s => ({
        serviceName: s.serviceName,
        framework: s.framework,
        endpoints: s.endpoints,
        dependencies: s.dependencies,
        externalAPIs: s.externalAPIs,
        metadata: s.metadata,
        validation: s.validation
      })),
      errors: this.errors,
      warnings: this.warnings
    };
  }
}

module.exports = {
  ServiceInfo,
  APIEndpoint,
  ServiceDependency,
  ExternalAPI,
  AnalysisResult
};

// Export for validation and testing
if (require.main === module) {
  // Example usage
  const factory = DataModelFactory;
  
  console.log('Data Models loaded successfully');
  console.log('Available models:');
  console.log('- ServiceModel');
  console.log('- EndpointModel');
  console.log('- SchemaModel');
  console.log('- DependencyModel');
  console.log('- ServiceAnalysisModel');
  console.log('- DataModelFactory');
  
  // Test basic model creation
  const testService = new ServiceModel({
    name: 'test-service',
    framework: 'Express.js',
    language: 'JavaScript'
  });
  
  console.log('\nTest service validation:', testService.validate());
} 