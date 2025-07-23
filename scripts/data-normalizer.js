/**
 * Data Normalizer
 * Standardizes endpoint formats from different sources into consistent structures
 */
class DataNormalizer {
  constructor(options = {}) {
    this.options = {
      strictValidation: options.strictValidation !== false,
      preserveOriginal: options.preserveOriginal !== false,
      defaultMethod: options.defaultMethod || 'GET',
      defaultStatusCode: options.defaultStatusCode || '200',
      pathNormalization: options.pathNormalization !== false,
      parameterNormalization: options.parameterNormalization !== false,
      ...options
    };

    this.normalizationRules = this.getNormalizationRules();
    this.validationRules = this.getValidationRules();
    this.statistics = {
      processed: 0,
      normalized: 0,
      errors: 0,
      warnings: []
    };
  }

  /**
   * Get normalization rules for different data sources
   * @returns {Object} Normalization rules
   */
  getNormalizationRules() {
    return {
      endpoint: {
        requiredFields: ['method', 'path'],
        optionalFields: ['description', 'summary', 'parameters', 'responses', 'tags'],
        fieldMappings: {
          // Common alternative field names
          'url': 'path',
          'route': 'path',
          'endpoint': 'path',
          'verb': 'method',
          'httpMethod': 'method',
          'desc': 'description',
          'params': 'parameters',
          'args': 'parameters',
          'returns': 'responses',
          'response': 'responses'
        },
        defaults: {
          method: 'GET',
          parameters: [],
          responses: [],
          tags: [],
          deprecated: false,
          authentication: null
        }
      },
      parameter: {
        requiredFields: ['name'],
        optionalFields: ['type', 'description', 'required', 'default', 'example'],
        fieldMappings: {
          'param': 'name',
          'paramName': 'name',
          'dataType': 'type',
          'paramType': 'type',
          'desc': 'description',
          'mandatory': 'required',
          'optional': 'required', // Will invert this
          'defaultValue': 'default'
        },
        defaults: {
          type: 'string',
          required: false,
          description: '',
          in: 'query'
        }
      },
      response: {
        requiredFields: ['statusCode'],
        optionalFields: ['description', 'schema', 'headers', 'example'],
        fieldMappings: {
          'status': 'statusCode',
          'code': 'statusCode',
          'httpStatus': 'statusCode',
          'desc': 'description',
          'contentType': 'mediaType',
          'content': 'schema'
        },
        defaults: {
          statusCode: '200',
          description: 'Success',
          mediaType: 'application/json'
        }
      },
      schema: {
        requiredFields: ['name'],
        optionalFields: ['type', 'properties', 'description', 'example', 'required'],
        fieldMappings: {
          'model': 'name',
          'className': 'name',
          'fields': 'properties',
          'attributes': 'properties',
          'desc': 'description'
        },
        defaults: {
          type: 'object',
          properties: {},
          required: []
        }
      }
    };
  }

  /**
   * Get validation rules
   * @returns {Object} Validation rules
   */
  getValidationRules() {
    return {
      httpMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'TRACE'],
      statusCodes: ['200', '201', '202', '204', '300', '301', '302', '400', '401', '403', '404', '409', '422', '500', '502', '503'],
      parameterTypes: ['string', 'number', 'integer', 'boolean', 'array', 'object', 'file'],
      parameterLocations: ['query', 'path', 'header', 'cookie', 'body', 'form'],
      pathPatterns: {
        valid: /^\/[a-zA-Z0-9\-_\/{}]*$/,
        parameter: /\{([^}]+)\}/g,
        invalidChars: /[<>:"\\|?*]/
      }
    };
  }

  /**
   * Normalize endpoint data from different sources
   * @param {Object} rawData - Raw endpoint data
   * @param {string} source - Data source (markdown, json, yaml)
   * @param {Object} context - Additional context
   * @returns {Object} Normalized endpoint data
   */
  normalizeEndpoint(rawData, source = 'unknown', context = {}) {
    this.statistics.processed++;

    try {
      // Create base normalized structure
      const normalized = {
        id: this.generateEndpointId(rawData, context),
        method: this.normalizeMethod(rawData.method, source),
        path: this.normalizePath(rawData.path, source),
        summary: this.normalizeSummary(rawData, source),
        description: this.normalizeDescription(rawData, source),
        parameters: this.normalizeParameters(rawData.parameters || [], source),
        responses: this.normalizeResponses(rawData.responses || [], source),
        tags: this.normalizeTags(rawData.tags || [], source),
        operationId: this.normalizeOperationId(rawData, source),
        deprecated: this.normalizeDeprecated(rawData.deprecated, source),
        security: this.normalizeSecurity(rawData.security || [], source),
        metadata: {
          source,
          originalData: this.options.preserveOriginal ? rawData : null,
          normalizedAt: new Date().toISOString(),
          context
        }
      };

      // Add source-specific fields
      this.addSourceSpecificFields(normalized, rawData, source);

      // Validate normalized data
      const validation = this.validateNormalizedEndpoint(normalized);
      normalized.validation = validation;

      if (validation.isValid) {
        this.statistics.normalized++;
      } else {
        this.statistics.errors++;
        this.statistics.warnings.push({
          endpoint: normalized.id,
          source,
          errors: validation.errors
        });
      }

      return normalized;

    } catch (error) {
      this.statistics.errors++;
      this.statistics.warnings.push({
        endpoint: 'unknown',
        source,
        error: error.message
      });
      
      return this.createErrorEndpoint(rawData, source, error);
    }
  }

  /**
   * Generate unique endpoint ID
   * @param {Object} rawData - Raw endpoint data
   * @param {Object} context - Context information
   * @returns {string} Unique ID
   */
  generateEndpointId(rawData, context) {
    const method = (rawData.method || this.options.defaultMethod).toUpperCase();
    const path = (rawData.path || '').replace(/[^a-zA-Z0-9]/g, '_');
    const service = context.serviceName || 'unknown';
    const timestamp = Date.now().toString(36);
    
    return `${service}_${method}_${path}_${timestamp}`.toLowerCase();
  }

  /**
   * Normalize HTTP method
   * @param {string} method - Raw method
   * @param {string} source - Data source
   * @returns {string} Normalized method
   */
  normalizeMethod(method, source) {
    if (!method) {
      return this.options.defaultMethod;
    }

    const normalized = method.toString().toUpperCase().trim();
    
    // Handle source-specific method formats
    switch (source) {
      case 'yaml':
        // OpenAPI uses lowercase methods as keys
        return normalized;
      case 'markdown':
        // Markdown might have "Method: GET" format
        const methodMatch = normalized.match(/(?:METHOD:?\s*)?([A-Z]+)/);
        return methodMatch ? methodMatch[1] : normalized;
      default:
        return normalized;
    }
  }

  /**
   * Normalize API path
   * @param {string} path - Raw path
   * @param {string} source - Data source
   * @returns {string} Normalized path
   */
  normalizePath(path, source) {
    if (!path || typeof path !== 'string') {
      return '/';
    }

    let normalized = path.trim();

    // Ensure path starts with /
    if (!normalized.startsWith('/')) {
      normalized = '/' + normalized;
    }

    // Handle source-specific path formats
    switch (source) {
      case 'yaml':
        // OpenAPI paths are already normalized
        break;
      case 'markdown':
        // Markdown might have extra formatting
        normalized = normalized.replace(/^Path:?\s*/i, '');
        break;
      case 'json':
        // JSON might have full URLs
        try {
          const url = new URL(normalized);
          normalized = url.pathname;
        } catch {
          // Not a full URL, keep as is
        }
        break;
    }

    if (this.options.pathNormalization) {
      // Normalize path parameters
      normalized = this.normalizePathParameters(normalized);
      
      // Remove duplicate slashes
      normalized = normalized.replace(/\/+/g, '/');
      
      // Remove trailing slash (except root)
      if (normalized.length > 1 && normalized.endsWith('/')) {
        normalized = normalized.slice(0, -1);
      }
    }

    return normalized;
  }

  /**
   * Normalize path parameters
   * @param {string} path - Path with parameters
   * @returns {string} Normalized path
   */
  normalizePathParameters(path) {
    // Convert different parameter formats to standard {param} format
    return path
      .replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, '{$1}')    // :param -> {param}
      .replace(/\$\{([^}]+)\}/g, '{$1}')                 // ${param} -> {param}
      .replace(/<([^>]+)>/g, '{$1}')                     // <param> -> {param}
      .replace(/\[([^\]]+)\]/g, '{$1}');                 // [param] -> {param}
  }

  /**
   * Normalize summary
   * @param {Object} rawData - Raw data
   * @param {string} source - Data source
   * @returns {string} Normalized summary
   */
  normalizeSummary(rawData, source) {
    // Try different summary fields
    const summaryFields = ['summary', 'title', 'name', 'operationSummary'];
    
    for (const field of summaryFields) {
      if (rawData[field] && typeof rawData[field] === 'string') {
        return rawData[field].trim();
      }
    }

    // Generate summary from method and path if not provided
    const method = rawData.method || 'GET';
    const path = rawData.path || '';
    const pathParts = path.split('/').filter(p => p && !p.startsWith('{'));
    const resource = pathParts[pathParts.length - 1] || 'resource';
    
    return `${method} ${resource}`;
  }

  /**
   * Normalize description
   * @param {Object} rawData - Raw data
   * @param {string} source - Data source
   * @returns {string} Normalized description
   */
  normalizeDescription(rawData, source) {
    const descFields = ['description', 'desc', 'details', 'info'];
    
    for (const field of descFields) {
      if (rawData[field] && typeof rawData[field] === 'string') {
        return this.cleanDescription(rawData[field]);
      }
    }

    return '';
  }

  /**
   * Clean description text
   * @param {string} description - Raw description
   * @returns {string} Clean description
   */
  cleanDescription(description) {
    return description
      .trim()
      .replace(/\s+/g, ' ')                    // Normalize whitespace
      .replace(/^[-*]\s*/, '')                 // Remove leading list markers
      .replace(/\n/g, ' ')                     // Convert newlines to spaces
      .substring(0, 500);                      // Limit length
  }

  /**
   * Normalize parameters
   * @param {Array} parameters - Raw parameters
   * @param {string} source - Data source
   * @returns {Array} Normalized parameters
   */
  normalizeParameters(parameters, source) {
    if (!Array.isArray(parameters)) {
      return [];
    }

    return parameters
      .map(param => this.normalizeParameter(param, source))
      .filter(param => param !== null);
  }

  /**
   * Normalize single parameter
   * @param {Object} param - Raw parameter
   * @param {string} source - Data source
   * @returns {Object|null} Normalized parameter
   */
  normalizeParameter(param, source) {
    if (!param || typeof param !== 'object') {
      return null;
    }

    const rules = this.normalizationRules.parameter;
    const normalized = { ...rules.defaults };

    // Apply field mappings
    Object.entries(rules.fieldMappings).forEach(([oldField, newField]) => {
      if (param[oldField] !== undefined) {
        normalized[newField] = param[oldField];
      }
    });

    // Direct field mapping
    Object.keys(param).forEach(key => {
      if (rules.requiredFields.includes(key) || rules.optionalFields.includes(key)) {
        normalized[key] = param[key];
      }
    });

    // Normalize specific fields
    normalized.name = this.normalizeParameterName(normalized.name);
    normalized.type = this.normalizeParameterType(normalized.type);
    normalized.required = this.normalizeParameterRequired(normalized.required, param);
    normalized.in = this.normalizeParameterLocation(normalized.in, param, source);

    // Validate required fields
    if (!normalized.name) {
      return null;
    }

    return normalized;
  }

  /**
   * Normalize parameter name
   * @param {string} name - Parameter name
   * @returns {string} Normalized name
   */
  normalizeParameterName(name) {
    if (!name || typeof name !== 'string') {
      return '';
    }

    return name.trim().replace(/[^a-zA-Z0-9_-]/g, '');
  }

  /**
   * Normalize parameter type
   * @param {string} type - Parameter type
   * @returns {string} Normalized type
   */
  normalizeParameterType(type) {
    if (!type) return 'string';

    const normalized = type.toString().toLowerCase();
    const typeMapping = {
      'str': 'string',
      'int': 'integer',
      'num': 'number',
      'bool': 'boolean',
      'arr': 'array',
      'obj': 'object',
      'float': 'number',
      'double': 'number'
    };

    return typeMapping[normalized] || normalized;
  }

  /**
   * Normalize parameter required field
   * @param {any} required - Required value
   * @param {Object} param - Original parameter
   * @returns {boolean} Normalized required
   */
  normalizeParameterRequired(required, param) {
    if (typeof required === 'boolean') {
      return required;
    }

    if (typeof required === 'string') {
      const lower = required.toLowerCase();
      if (lower === 'true' || lower === 'required' || lower === 'mandatory') {
        return true;
      }
      if (lower === 'false' || lower === 'optional') {
        return false;
      }
    }

    // Check for optional field (inverse of required)
    if (param.optional !== undefined) {
      return !param.optional;
    }

    return false; // Default to optional
  }

  /**
   * Normalize parameter location
   * @param {string} location - Parameter location
   * @param {Object} param - Original parameter
   * @param {string} source - Data source
   * @returns {string} Normalized location
   */
  normalizeParameterLocation(location, param, source) {
    if (location && this.validationRules.parameterLocations.includes(location)) {
      return location;
    }

    // Infer location from source-specific patterns
    const locationMapping = {
      'querystring': 'query',
      'pathparam': 'path',
      'bodyparam': 'body',
      'headerparam': 'header'
    };

    if (param.location && locationMapping[param.location.toLowerCase()]) {
      return locationMapping[param.location.toLowerCase()];
    }

    // Default inference
    if (param.name && param.name.includes('id') && param.name.length < 10) {
      return 'path';
    }

    return 'query'; // Default
  }

  /**
   * Normalize responses
   * @param {Array} responses - Raw responses
   * @param {string} source - Data source
   * @returns {Array} Normalized responses
   */
  normalizeResponses(responses, source) {
    if (!Array.isArray(responses) && typeof responses === 'object') {
      // Convert object format to array
      responses = Object.entries(responses).map(([status, response]) => ({
        statusCode: status,
        ...response
      }));
    }

    if (!Array.isArray(responses)) {
      // Create default success response
      return [{
        statusCode: this.options.defaultStatusCode,
        description: 'Success',
        mediaType: 'application/json'
      }];
    }

    return responses
      .map(response => this.normalizeResponse(response, source))
      .filter(response => response !== null);
  }

  /**
   * Normalize single response
   * @param {Object} response - Raw response
   * @param {string} source - Data source
   * @returns {Object|null} Normalized response
   */
  normalizeResponse(response, source) {
    if (!response || typeof response !== 'object') {
      return null;
    }

    const rules = this.normalizationRules.response;
    const normalized = { ...rules.defaults };

    // Apply field mappings
    Object.entries(rules.fieldMappings).forEach(([oldField, newField]) => {
      if (response[oldField] !== undefined) {
        normalized[newField] = response[oldField];
      }
    });

    // Direct field mapping
    Object.keys(response).forEach(key => {
      if (rules.requiredFields.includes(key) || rules.optionalFields.includes(key)) {
        normalized[key] = response[key];
      }
    });

    // Normalize status code
    normalized.statusCode = this.normalizeStatusCode(normalized.statusCode);

    return normalized;
  }

  /**
   * Normalize status code
   * @param {any} statusCode - Raw status code
   * @returns {string} Normalized status code
   */
  normalizeStatusCode(statusCode) {
    if (!statusCode) return this.options.defaultStatusCode;

    const normalized = statusCode.toString();
    
    // Validate against known status codes
    if (this.validationRules.statusCodes.includes(normalized)) {
      return normalized;
    }

    // Try to extract numeric part
    const match = normalized.match(/(\d{3})/);
    return match ? match[1] : this.options.defaultStatusCode;
  }

  /**
   * Normalize tags
   * @param {Array|string} tags - Raw tags
   * @param {string} source - Data source
   * @returns {Array} Normalized tags
   */
  normalizeTags(tags, source) {
    if (!tags) return [];

    if (typeof tags === 'string') {
      return tags.split(/[,;]/).map(tag => tag.trim()).filter(tag => tag.length > 0);
    }

    if (Array.isArray(tags)) {
      return tags
        .filter(tag => tag && typeof tag === 'string')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    }

    return [];
  }

  /**
   * Normalize operation ID
   * @param {Object} rawData - Raw data
   * @param {string} source - Data source
   * @returns {string} Normalized operation ID
   */
  normalizeOperationId(rawData, source) {
    if (rawData.operationId && typeof rawData.operationId === 'string') {
      return rawData.operationId.trim();
    }

    // Generate operation ID from method and path
    const method = (rawData.method || 'get').toLowerCase();
    const path = rawData.path || '';
    const pathParts = path.split('/').filter(p => p && !p.startsWith('{'));
    const resource = pathParts[pathParts.length - 1] || 'resource';
    
    return `${method}${resource.charAt(0).toUpperCase()}${resource.slice(1)}`;
  }

  /**
   * Normalize deprecated flag
   * @param {any} deprecated - Raw deprecated value
   * @param {string} source - Data source
   * @returns {boolean} Normalized deprecated flag
   */
  normalizeDeprecated(deprecated, source) {
    if (typeof deprecated === 'boolean') {
      return deprecated;
    }

    if (typeof deprecated === 'string') {
      const lower = deprecated.toLowerCase();
      return lower === 'true' || lower === 'deprecated' || lower === 'yes';
    }

    return false;
  }

  /**
   * Normalize security requirements
   * @param {Array} security - Raw security
   * @param {string} source - Data source
   * @returns {Array} Normalized security
   */
  normalizeSecurity(security, source) {
    if (!Array.isArray(security)) {
      return [];
    }

    return security.filter(sec => sec && typeof sec === 'object');
  }

  /**
   * Add source-specific fields
   * @param {Object} normalized - Normalized endpoint
   * @param {Object} rawData - Raw data
   * @param {string} source - Data source
   */
  addSourceSpecificFields(normalized, rawData, source) {
    switch (source) {
      case 'markdown':
        normalized.file = rawData.file || '';
        normalized.function = rawData.function || '';
        break;
      case 'yaml':
        normalized.servers = rawData.servers || [];
        normalized.externalDocs = rawData.externalDocs || null;
        break;
      case 'json':
        normalized.middleware = rawData.middleware || [];
        normalized.authentication = rawData.authentication || null;
        break;
    }
  }

  /**
   * Validate normalized endpoint
   * @param {Object} normalized - Normalized endpoint
   * @returns {Object} Validation result
   */
  validateNormalizedEndpoint(normalized) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Validate required fields
    if (!normalized.method) {
      validation.errors.push('Missing HTTP method');
      validation.isValid = false;
    } else if (!this.validationRules.httpMethods.includes(normalized.method)) {
      validation.errors.push(`Invalid HTTP method: ${normalized.method}`);
      validation.isValid = false;
    }

    if (!normalized.path) {
      validation.errors.push('Missing path');
      validation.isValid = false;
    } else if (!this.validationRules.pathPatterns.valid.test(normalized.path)) {
      validation.errors.push(`Invalid path format: ${normalized.path}`);
      validation.isValid = false;
    }

    // Validate parameters
    normalized.parameters.forEach((param, index) => {
      if (!param.name) {
        validation.warnings.push(`Parameter ${index} missing name`);
      }
      if (!this.validationRules.parameterTypes.includes(param.type)) {
        validation.warnings.push(`Invalid parameter type: ${param.type}`);
      }
    });

    // Validate responses
    if (normalized.responses.length === 0) {
      validation.warnings.push('No response definitions');
    }

    return validation;
  }

  /**
   * Create error endpoint for failed normalization
   * @param {Object} rawData - Raw data that failed
   * @param {string} source - Data source
   * @param {Error} error - Error that occurred
   * @returns {Object} Error endpoint
   */
  createErrorEndpoint(rawData, source, error) {
    return {
      id: `error_${Date.now()}`,
      method: 'UNKNOWN',
      path: '/error',
      summary: 'Failed to normalize endpoint',
      description: `Normalization failed: ${error.message}`,
      parameters: [],
      responses: [],
      tags: ['error'],
      validation: {
        isValid: false,
        errors: [error.message],
        warnings: []
      },
      metadata: {
        source,
        originalData: rawData,
        normalizedAt: new Date().toISOString(),
        error: error.message
      }
    };
  }

  /**
   * Normalize batch of endpoints
   * @param {Array} endpoints - Array of raw endpoints
   * @param {string} source - Data source
   * @param {Object} context - Shared context
   * @returns {Array} Array of normalized endpoints
   */
  normalizeBatch(endpoints, source, context = {}) {
    if (!Array.isArray(endpoints)) {
      return [];
    }

    return endpoints.map(endpoint => 
      this.normalizeEndpoint(endpoint, source, context)
    );
  }

  /**
   * Get normalization statistics
   * @returns {Object} Statistics
   */
  getStatistics() {
    return {
      ...this.statistics,
      successRate: this.statistics.processed > 0 
        ? Math.round((this.statistics.normalized / this.statistics.processed) * 100) 
        : 0
    };
  }

  /**
   * Reset statistics
   */
  resetStatistics() {
    this.statistics = {
      processed: 0,
      normalized: 0,
      errors: 0,
      warnings: []
    };
  }

  /**
   * Generate normalization report
   * @returns {Object} Normalization report
   */
  generateReport() {
    const stats = this.getStatistics();
    
    return {
      metadata: {
        generatedAt: new Date().toISOString(),
        normalizationVersion: '1.0.0',
        options: this.options
      },
      statistics: stats,
      errorSummary: this.generateErrorSummary(),
      recommendations: this.generateRecommendations()
    };
  }

  /**
   * Generate error summary
   * @returns {Object} Error summary
   */
  generateErrorSummary() {
    const errorTypes = {};
    const sourceErrors = {};

    this.statistics.warnings.forEach(warning => {
      // Count by error type
      if (warning.errors) {
        warning.errors.forEach(error => {
          errorTypes[error] = (errorTypes[error] || 0) + 1;
        });
      }

      // Count by source
      sourceErrors[warning.source] = (sourceErrors[warning.source] || 0) + 1;
    });

    return {
      totalErrors: this.statistics.errors,
      totalWarnings: this.statistics.warnings.length,
      errorsByType: errorTypes,
      errorsBySource: sourceErrors,
      mostCommonErrors: Object.entries(errorTypes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    };
  }

  /**
   * Generate recommendations for improving data quality
   * @returns {Array} Recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    const stats = this.getStatistics();

    if (stats.successRate < 80) {
      recommendations.push({
        type: 'data_quality',
        priority: 'high',
        message: `Low normalization success rate (${stats.successRate}%)`,
        suggestion: 'Review data formats and ensure required fields are present'
      });
    }

    const errorSummary = this.generateErrorSummary();
    
    if (errorSummary.mostCommonErrors.length > 0) {
      const topError = errorSummary.mostCommonErrors[0];
      recommendations.push({
        type: 'common_error',
        priority: 'medium',
        message: `Most common error: ${topError[0]} (${topError[1]} occurrences)`,
        suggestion: 'Focus on fixing this error type across data sources'
      });
    }

    if (Object.keys(errorSummary.errorsBySource).length > 1) {
      const problematicSource = Object.entries(errorSummary.errorsBySource)
        .sort((a, b) => b[1] - a[1])[0];
      
      recommendations.push({
        type: 'source_quality',
        priority: 'medium',
        message: `Source '${problematicSource[0]}' has the most errors (${problematicSource[1]})`,
        suggestion: 'Review and standardize data format for this source'
      });
    }

    return recommendations;
  }
}

module.exports = DataNormalizer; 