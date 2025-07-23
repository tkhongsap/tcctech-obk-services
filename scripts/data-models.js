/**
 * Data Models and Schemas for API Analysis
 * Provides normalized data structures for service data from multiple sources
 */

/**
 * Base Service Model
 * Normalized structure for service information
 */
class ServiceModel {
  constructor(data = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.displayName = data.displayName || data.name || '';
    this.description = data.description || '';
    this.path = data.path || '';
    this.repository = data.repository || '';
    this.framework = data.framework || '';
    this.language = data.language || '';
    this.version = data.version || '';
    this.environment = data.environment || 'unknown';
    this.baseUrl = data.baseUrl || '';
    this.status = data.status || 'active';
    this.analyzedAt = data.analyzedAt || new Date().toISOString();
    this.sourceFiles = data.sourceFiles || {};
  }

  /**
   * Validate service model
   * @returns {Object} Validation result
   */
  validate() {
    const errors = [];
    const warnings = [];

    if (!this.name) errors.push('Service name is required');
    if (!this.framework) warnings.push('Framework not specified');
    if (!this.language) warnings.push('Language not specified');

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get service summary
   * @returns {Object} Service summary
   */
  getSummary() {
    return {
      name: this.name,
      framework: this.framework,
      language: this.language,
      status: this.status,
      lastAnalyzed: this.analyzedAt
    };
  }
}

/**
 * API Endpoint Model
 * Normalized structure for API endpoints
 */
class EndpointModel {
  constructor(data = {}) {
    this.id = data.id || this.generateId(data);
    this.method = (data.method || 'GET').toUpperCase();
    this.path = data.path || '';
    this.fullPath = data.fullPath || data.path || '';
    this.operationId = data.operationId || '';
    this.summary = data.summary || '';
    this.description = data.description || '';
    this.tags = Array.isArray(data.tags) ? data.tags : [];
    this.deprecated = Boolean(data.deprecated);
    
    // Request/Response information
    this.parameters = this.normalizeParameters(data.parameters || []);
    this.requestBody = data.requestBody || null;
    this.responses = this.normalizeResponses(data.responses || []);
    
    // Implementation details
    this.function = data.function || '';
    this.file = data.file || '';
    this.controller = data.controller || '';
    this.middleware = Array.isArray(data.middleware) ? data.middleware : [];
    
    // Security and authentication
    this.authentication = data.authentication || null;
    this.security = Array.isArray(data.security) ? data.security : [];
    
    // Metadata
    this.complexity = this.calculateComplexity();
    this.source = data.source || 'unknown';
  }

  /**
   * Generate unique ID for endpoint
   * @param {Object} data - Endpoint data
   * @returns {string} Generated ID
   */
  generateId(data) {
    const method = (data.method || 'GET').toUpperCase();
    const path = (data.path || '').replace(/[^a-zA-Z0-9]/g, '_');
    return `${method}_${path}`.toLowerCase();
  }

  /**
   * Normalize parameters from different sources
   * @param {Array} parameters - Raw parameters
   * @returns {Array} Normalized parameters
   */
  normalizeParameters(parameters) {
    return parameters.map(param => ({
      name: param.name || '',
      in: param.in || param.location || 'query',
      type: param.type || param.schema?.type || 'string',
      required: Boolean(param.required),
      description: param.description || '',
      example: param.example || null
    }));
  }

  /**
   * Normalize responses from different sources
   * @param {Array} responses - Raw responses
   * @returns {Array} Normalized responses
   */
  normalizeResponses(responses) {
    return responses.map(response => ({
      statusCode: response.statusCode || response.status || '200',
      description: response.description || '',
      contentType: response.contentType || 'application/json',
      schema: response.schema || null,
      example: response.example || null
    }));
  }

  /**
   * Calculate endpoint complexity score
   * @returns {number} Complexity score (1-10)
   */
  calculateComplexity() {
    let score = 1;
    
    // Method complexity
    const methodScores = { GET: 1, POST: 3, PUT: 3, DELETE: 2, PATCH: 4 };
    score += methodScores[this.method] || 2;
    
    // Parameter complexity
    score += Math.min(this.parameters.length * 0.5, 3);
    
    // Response complexity
    score += Math.min(this.responses.length * 0.3, 2);
    
    // Path complexity (dynamic segments)
    const dynamicSegments = (this.path.match(/{[^}]+}/g) || []).length;
    score += dynamicSegments * 0.5;
    
    return Math.min(Math.round(score), 10);
  }

  /**
   * Get endpoint signature
   * @returns {string} Endpoint signature
   */
  getSignature() {
    return `${this.method} ${this.path}`;
  }
}

/**
 * Data Schema Model
 * Normalized structure for data schemas/models
 */
class SchemaModel {
  constructor(data = {}) {
    this.name = data.name || '';
    this.type = data.type || 'object';
    this.description = data.description || '';
    this.file = data.file || '';
    this.properties = this.normalizeProperties(data.properties || data.fields || []);
    this.required = Array.isArray(data.required) ? data.required : [];
    this.example = data.example || null;
    this.source = data.source || 'unknown';
  }

  /**
   * Normalize properties from different sources
   * @param {Array|Object} properties - Raw properties
   * @returns {Array} Normalized properties
   */
  normalizeProperties(properties) {
    if (Array.isArray(properties)) {
      // From parsed markdown (field objects)
      return properties.map(prop => ({
        name: prop.name || '',
        type: prop.type || 'string',
        description: prop.description || '',
        required: Boolean(prop.required),
        nullable: Boolean(prop.nullable),
        example: prop.example || null
      }));
    } else if (typeof properties === 'object') {
      // From OpenAPI schemas (object format)
      return Object.entries(properties).map(([name, prop]) => ({
        name,
        type: prop.type || 'string',
        description: prop.description || '',
        required: this.required.includes(name),
        nullable: Boolean(prop.nullable),
        example: prop.example || null
      }));
    }
    return [];
  }

  /**
   * Get schema complexity
   * @returns {number} Schema complexity score
   */
  getComplexity() {
    let score = this.properties.length;
    
    // Add complexity for nested objects
    this.properties.forEach(prop => {
      if (prop.type === 'object' || prop.type === 'array') {
        score += 2;
      }
    });
    
    return score;
  }
}

/**
 * Dependency Model
 * Normalized structure for service dependencies
 */
class DependencyModel {
  constructor(data = {}) {
    this.name = data.name || '';
    this.type = data.type || 'unknown'; // service, package, external_api
    this.version = data.version || '';
    this.source = data.source || '';
    this.target = data.target || data.name;
    this.relationship = data.relationship || 'depends_on'; // depends_on, calls, includes
    this.endpoints = Array.isArray(data.endpoints) ? data.endpoints : [];
    this.critical = Boolean(data.critical);
    this.optional = Boolean(data.optional);
    this.description = data.description || '';
  }

  /**
   * Get dependency weight for analysis
   * @returns {number} Dependency weight
   */
  getWeight() {
    let weight = 1;
    
    if (this.critical) weight += 3;
    if (this.type === 'service') weight += 2;
    if (this.endpoints.length > 0) weight += this.endpoints.length * 0.5;
    
    return weight;
  }
}

/**
 * Service Analysis Result Model
 * Complete normalized structure for service analysis
 */
class ServiceAnalysisModel {
  constructor(data = {}) {
    this.service = new ServiceModel(data.service || {});
    this.endpoints = (data.endpoints || []).map(ep => new EndpointModel(ep));
    this.schemas = (data.schemas || []).map(schema => new SchemaModel(schema));
    this.dependencies = {
      internal: (data.dependencies?.internal || []).map(dep => new DependencyModel({...dep, type: 'service'})),
      external: (data.dependencies?.external || []).map(dep => new DependencyModel({...dep, type: 'external_api'})),
      packages: (data.dependencies?.packages || []).map(dep => new DependencyModel({...dep, type: 'package'}))
    };
    
    this.metadata = {
      totalEndpoints: this.endpoints.length,
      totalSchemas: this.schemas.length,
      totalDependencies: this.getTotalDependencies(),
      complexity: this.calculateComplexity(),
      frameworks: this.extractFrameworks(),
      languages: this.extractLanguages(),
      tags: this.extractTags(),
      analyzedAt: new Date().toISOString(),
      ...data.metadata
    };

    this.sourceFiles = data.sourceFiles || {};
    this.validation = this.validate();
  }

  /**
   * Get total dependencies count
   * @returns {number} Total dependencies
   */
  getTotalDependencies() {
    return this.dependencies.internal.length + 
           this.dependencies.external.length + 
           this.dependencies.packages.length;
  }

  /**
   * Calculate overall service complexity
   * @returns {number} Service complexity score
   */
  calculateComplexity() {
    const endpointComplexity = this.endpoints.reduce((sum, ep) => sum + ep.complexity, 0);
    const schemaComplexity = this.schemas.reduce((sum, schema) => sum + schema.getComplexity(), 0);
    const dependencyComplexity = this.getTotalDependencies() * 0.5;
    
    return Math.round(endpointComplexity + schemaComplexity + dependencyComplexity);
  }

  /**
   * Extract frameworks used
   * @returns {Array} Array of frameworks
   */
  extractFrameworks() {
    const frameworks = [];
    if (this.service.framework) {
      frameworks.push(this.service.framework);
    }
    return [...new Set(frameworks)];
  }

  /**
   * Extract languages used
   * @returns {Array} Array of languages
   */
  extractLanguages() {
    const languages = [];
    if (this.service.language) {
      // Handle multiple languages (e.g., "JavaScript/TypeScript")
      const langs = this.service.language.split(/[\/,]/).map(l => l.trim());
      languages.push(...langs);
    }
    return [...new Set(languages)];
  }

  /**
   * Extract all tags from endpoints
   * @returns {Array} Array of unique tags
   */
  extractTags() {
    const tags = [];
    this.endpoints.forEach(endpoint => {
      tags.push(...endpoint.tags);
    });
    return [...new Set(tags)];
  }

  /**
   * Validate the complete analysis model
   * @returns {Object} Validation result
   */
  validate() {
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Validate service
    const serviceValidation = this.service.validate();
    validation.errors.push(...serviceValidation.errors);
    validation.warnings.push(...serviceValidation.warnings);

    // Check for endpoints
    if (this.endpoints.length === 0) {
      validation.warnings.push('No API endpoints found');
    }

    // Check for duplicate endpoint IDs
    const endpointIds = this.endpoints.map(ep => ep.id);
    const duplicates = endpointIds.filter((id, index) => endpointIds.indexOf(id) !== index);
    if (duplicates.length > 0) {
      validation.errors.push(`Duplicate endpoint IDs: ${duplicates.join(', ')}`);
    }

    validation.isValid = validation.errors.length === 0;
    return validation;
  }

  /**
   * Get service summary for reports
   * @returns {Object} Service summary
   */
  getSummary() {
    return {
      service: this.service.getSummary(),
      metrics: {
        endpoints: this.metadata.totalEndpoints,
        schemas: this.metadata.totalSchemas,
        dependencies: this.metadata.totalDependencies,
        complexity: this.metadata.complexity
      },
      technology: {
        frameworks: this.metadata.frameworks,
        languages: this.metadata.languages
      },
      validation: {
        isValid: this.validation.isValid,
        hasWarnings: this.validation.warnings.length > 0
      }
    };
  }

  /**
   * Export to JSON for storage/transmission
   * @returns {Object} JSON representation
   */
  toJSON() {
    return {
      service: this.service,
      endpoints: this.endpoints,
      schemas: this.schemas,
      dependencies: this.dependencies,
      metadata: this.metadata,
      sourceFiles: this.sourceFiles,
      validation: this.validation
    };
  }
}

/**
 * Data Model Factory
 * Creates appropriate models from different data sources
 */
class DataModelFactory {
  /**
   * Create ServiceAnalysisModel from various data sources
   * @param {Object} data - Raw data from parsers
   * @param {string} source - Data source type (markdown, json, yaml)
   * @returns {ServiceAnalysisModel} Normalized service analysis
   */
  static createServiceAnalysis(data, source = 'unknown') {
    const normalizedData = {
      service: {},
      endpoints: [],
      schemas: [],
      dependencies: { internal: [], external: [], packages: [] },
      sourceFiles: {},
      metadata: { source }
    };

    // Normalize based on source type
    switch (source) {
      case 'markdown':
        normalizedData.service = {
          name: data.serviceName || data.serviceOverview?.serviceName || '',
          framework: data.technologyStack?.framework || data.serviceOverview?.framework || '',
          language: data.technologyStack?.language || data.serviceOverview?.language || '',
          analyzedAt: data.serviceOverview?.analysisDate || ''
        };
        normalizedData.endpoints = data.endpoints || [];
        normalizedData.schemas = data.schemas || [];
        normalizedData.dependencies.packages = data.externalDependencies || [];
        break;

      case 'json':
        normalizedData.service = data.service || {};
        normalizedData.endpoints = data.apiInventory?.endpoints || [];
        normalizedData.schemas = data.apiInventory?.schemas || [];
        normalizedData.dependencies = data.dependencies || { internal: [], external: [], packages: [] };
        break;

      case 'yaml':
        normalizedData.service = {
          name: data.openapi?.title || '',
          description: data.openapi?.description || '',
          version: data.openapi?.version_info || ''
        };
        // Convert OpenAPI paths to endpoints
        normalizedData.endpoints = [];
        data.paths?.forEach(path => {
          path.operations?.forEach(operation => {
            normalizedData.endpoints.push({
              method: operation.method,
              path: path.path,
              summary: operation.summary,
              description: operation.description,
              tags: operation.tags,
              parameters: operation.parameters,
              responses: operation.responses
            });
          });
        });
        normalizedData.schemas = data.schemas || [];
        break;
    }

    // Add source information
    normalizedData.sourceFiles[source] = data.sourceFile || '';
    normalizedData.metadata.source = source;

    return new ServiceAnalysisModel(normalizedData);
  }

  /**
   * Merge multiple ServiceAnalysisModels from different sources
   * @param {Array<ServiceAnalysisModel>} models - Models to merge
   * @returns {ServiceAnalysisModel} Merged model
   */
  static mergeServiceAnalyses(models) {
    if (models.length === 0) return new ServiceAnalysisModel();
    if (models.length === 1) return models[0];

    const merged = {
      service: {},
      endpoints: [],
      schemas: [],
      dependencies: { internal: [], external: [], packages: [] },
      sourceFiles: {},
      metadata: {}
    };

    // Merge service information (prioritize non-empty values)
    models.forEach(model => {
      Object.keys(model.service).forEach(key => {
        if (model.service[key] && !merged.service[key]) {
          merged.service[key] = model.service[key];
        }
      });
    });

    // Merge endpoints (remove duplicates based on method + path)
    const endpointSignatures = new Set();
    models.forEach(model => {
      model.endpoints.forEach(endpoint => {
        const signature = endpoint.getSignature();
        if (!endpointSignatures.has(signature)) {
          endpointSignatures.add(signature);
          merged.endpoints.push(endpoint);
        }
      });
    });

    // Merge schemas (remove duplicates by name)
    const schemaNames = new Set();
    models.forEach(model => {
      model.schemas.forEach(schema => {
        if (!schemaNames.has(schema.name)) {
          schemaNames.add(schema.name);
          merged.schemas.push(schema);
        }
      });
    });

    // Merge dependencies
    ['internal', 'external', 'packages'].forEach(type => {
      const depNames = new Set();
      models.forEach(model => {
        model.dependencies[type].forEach(dep => {
          if (!depNames.has(dep.name)) {
            depNames.add(dep.name);
            merged.dependencies[type].push(dep);
          }
        });
      });
    });

    // Merge source files
    models.forEach(model => {
      Object.assign(merged.sourceFiles, model.sourceFiles);
    });

    // Merge metadata
    merged.metadata.sources = models.map(m => m.metadata.source || 'unknown');
    merged.metadata.mergedAt = new Date().toISOString();

    return new ServiceAnalysisModel(merged);
  }
}

module.exports = {
  ServiceModel,
  EndpointModel,
  SchemaModel,
  DependencyModel,
  ServiceAnalysisModel,
  DataModelFactory
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