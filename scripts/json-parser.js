const fs = require('fs').promises;

/**
 * JSON Parser for Dependency Map Files
 * Extracts service relationships and API inventory from dependency-map.json files
 */
class JsonParser {
  constructor() {
    this.requiredFields = {
      service: ['name', 'framework', 'language'],
      api_inventory: ['endpoints'],
      // Optional fields that may be present
      optional: ['dependencies', 'schemas', 'external_apis']
    };
  }

  /**
   * Parse a dependency map JSON file
   * @param {string} filePath - Path to the JSON file
   * @returns {Promise<Object>} Parsed dependency data
   */
  async parseDependencyMap(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(content);
      return this.parseJsonContent(data, filePath);
    } catch (error) {
      throw new Error(`Failed to parse JSON file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Parse JSON content and extract structured data
   * @param {Object} data - Parsed JSON data
   * @param {string} filePath - Source file path for context
   * @returns {Object} Parsed dependency data
   */
  parseJsonContent(data, filePath = '') {
    const result = {
      sourceFile: filePath,
      service: {},
      apiInventory: {
        endpoints: [],
        schemas: []
      },
      dependencies: {
        internal: [],
        external: [],
        packages: []
      },
      relationships: {
        dependsOn: [],
        dependents: [],
        apiCalls: []
      },
      metadata: {
        totalEndpoints: 0,
        totalSchemas: 0,
        totalDependencies: 0,
        analyzedAt: '',
        parsedAt: new Date().toISOString()
      }
    };

    try {
      // Parse service information
      if (data.service) {
        result.service = this.parseServiceInfo(data.service);
      }

      // Parse API inventory
      if (data.api_inventory) {
        result.apiInventory = this.parseApiInventory(data.api_inventory);
      }

      // Parse dependencies
      if (data.dependencies) {
        result.dependencies = this.parseDependencies(data.dependencies);
      }

      // Parse external APIs
      if (data.external_apis) {
        result.dependencies.external = this.parseExternalApis(data.external_apis);
      }

      // Extract relationships
      result.relationships = this.extractRelationships(data);

      // Update metadata
      result.metadata = this.calculateMetadata(result, data);

    } catch (error) {
      throw new Error(`JSON content parsing error: ${error.message}`);
    }

    return result;
  }

  /**
   * Parse service information section
   * @param {Object} serviceData - Service data from JSON
   * @returns {Object} Parsed service information
   */
  parseServiceInfo(serviceData) {
    const service = {
      name: serviceData.name || '',
      path: serviceData.path || '',
      framework: serviceData.framework || '',
      language: serviceData.language || '',
      baseUrl: serviceData.baseUrl || serviceData.base_url || '',
      version: serviceData.version || '',
      analyzedAt: serviceData.analyzed_at || ''
    };

    // Additional service metadata
    if (serviceData.description) service.description = serviceData.description;
    if (serviceData.repository) service.repository = serviceData.repository;
    if (serviceData.environment) service.environment = serviceData.environment;

    return service;
  }

  /**
   * Parse API inventory section
   * @param {Object} apiData - API inventory data from JSON
   * @returns {Object} Parsed API inventory
   */
  parseApiInventory(apiData) {
    const inventory = {
      endpoints: [],
      schemas: []
    };

    // Parse endpoints
    if (apiData.endpoints && Array.isArray(apiData.endpoints)) {
      inventory.endpoints = apiData.endpoints.map(endpoint => ({
        method: endpoint.method || '',
        path: endpoint.path || '',
        file: endpoint.file || '',
        description: endpoint.description || '',
        function: endpoint.function || '',
        parameters: endpoint.parameters || [],
        responses: endpoint.responses || [],
        middleware: endpoint.middleware || [],
        authentication: endpoint.authentication || null,
        tags: endpoint.tags || []
      }));
    }

    // Parse schemas
    if (apiData.schemas && Array.isArray(apiData.schemas)) {
      inventory.schemas = apiData.schemas.map(schema => ({
        name: schema.name || '',
        type: schema.type || '',
        file: schema.file || '',
        fields: schema.fields || [],
        description: schema.description || ''
      }));
    }

    return inventory;
  }

  /**
   * Parse dependencies section
   * @param {Object} depData - Dependencies data from JSON
   * @returns {Object} Parsed dependencies
   */
  parseDependencies(depData) {
    const dependencies = {
      internal: [],
      external: [],
      packages: []
    };

    // Parse internal service dependencies
    if (depData.internal_services || depData.services) {
      const services = depData.internal_services || depData.services;
      if (Array.isArray(services)) {
        dependencies.internal = services.map(service => ({
          name: service.name || service,
          type: 'service',
          endpoints: service.endpoints || [],
          relationship: service.relationship || 'depends_on'
        }));
      }
    }

    // Parse package dependencies
    if (depData.packages) {
      Object.entries(depData.packages).forEach(([name, version]) => {
        dependencies.packages.push({
          name,
          version: typeof version === 'string' ? version : version.version || '',
          type: this.inferPackageType(name),
          scope: this.inferPackageScope(name)
        });
      });
    }

    return dependencies;
  }

  /**
   * Parse external APIs section
   * @param {Array|Object} externalData - External APIs data
   * @returns {Array} Parsed external API dependencies
   */
  parseExternalApis(externalData) {
    const external = [];

    if (Array.isArray(externalData)) {
      external.push(...externalData.map(api => ({
        name: api.name || '',
        url: api.url || api.baseUrl || '',
        type: api.type || 'rest',
        endpoints: api.endpoints || [],
        authentication: api.authentication || null
      })));
    } else if (typeof externalData === 'object') {
      Object.entries(externalData).forEach(([name, config]) => {
        external.push({
          name,
          url: config.url || config.baseUrl || '',
          type: config.type || 'rest',
          endpoints: config.endpoints || [],
          authentication: config.authentication || null
        });
      });
    }

    return external;
  }

  /**
   * Extract relationships between services
   * @param {Object} data - Full JSON data
   * @returns {Object} Service relationships
   */
  extractRelationships(data) {
    const relationships = {
      dependsOn: [],
      dependents: [],
      apiCalls: []
    };

    // Extract API calls from endpoints
    if (data.api_inventory && data.api_inventory.endpoints) {
      data.api_inventory.endpoints.forEach(endpoint => {
        if (endpoint.calls_external || endpoint.external_calls) {
          const calls = endpoint.calls_external || endpoint.external_calls;
          if (Array.isArray(calls)) {
            relationships.apiCalls.push(...calls.map(call => ({
              from: data.service?.name || 'unknown',
              to: call.service || call.target || '',
              endpoint: call.endpoint || call.path || '',
              method: call.method || '',
              type: 'api_call'
            })));
          }
        }
      });
    }

    // Extract service dependencies
    if (data.dependencies && data.dependencies.internal_services) {
      data.dependencies.internal_services.forEach(service => {
        relationships.dependsOn.push({
          service: service.name || service,
          type: 'service_dependency',
          relationship: service.relationship || 'depends_on'
        });
      });
    }

    return relationships;
  }

  /**
   * Calculate metadata from parsed data
   * @param {Object} result - Parsed result object
   * @param {Object} originalData - Original JSON data
   * @returns {Object} Calculated metadata
   */
  calculateMetadata(result, originalData) {
    const metadata = {
      totalEndpoints: result.apiInventory.endpoints.length,
      totalSchemas: result.apiInventory.schemas.length,
      totalDependencies: result.dependencies.internal.length + result.dependencies.external.length,
      totalPackages: result.dependencies.packages.length,
      analyzedAt: result.service.analyzedAt || originalData.analyzed_at || '',
      parsedAt: new Date().toISOString(),
      hasExternalDependencies: result.dependencies.external.length > 0,
      hasInternalDependencies: result.dependencies.internal.length > 0,
      frameworkInfo: {
        name: result.service.framework,
        language: result.service.language
      }
    };

    return metadata;
  }

  /**
   * Infer package type from package name
   * @param {string} packageName - Name of the package
   * @returns {string} Inferred package type
   */
  inferPackageType(packageName) {
    if (packageName.startsWith('@')) {
      return 'javascript';
    } else if (packageName.includes('express') || packageName.includes('nest')) {
      return 'javascript';
    } else if (packageName.includes('django') || packageName.includes('flask')) {
      return 'python';
    } else {
      return 'unknown';
    }
  }

  /**
   * Infer package scope (development, production, etc.)
   * @param {string} packageName - Name of the package
   * @returns {string} Inferred scope
   */
  inferPackageScope(packageName) {
    const devPackages = ['jest', 'mocha', 'chai', 'eslint', 'prettier', 'nodemon'];
    return devPackages.some(dev => packageName.includes(dev)) ? 'development' : 'production';
  }

  /**
   * Parse multiple JSON files in a directory
   * @param {string} directoryPath - Directory containing JSON files
   * @returns {Promise<Array>} Array of parsed dependency data
   */
  async parseDirectory(directoryPath) {
    try {
      const path = require('path');
      const files = await fs.readdir(directoryPath);
      const results = [];

      for (const file of files) {
        if (file === 'dependency-map.json') {
          const filePath = path.join(directoryPath, file);
          const parsed = await this.parseDependencyMap(filePath);
          results.push(parsed);
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Directory parsing failed: ${error.message}`);
    }
  }

  /**
   * Validate JSON structure against expected schema
   * @param {Object} data - JSON data to validate
   * @returns {Object} Validation result
   */
  validateStructure(data) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Check required service fields
    if (!data.service) {
      validation.errors.push('Missing required "service" section');
      validation.isValid = false;
    } else {
      this.requiredFields.service.forEach(field => {
        if (!data.service[field]) {
          validation.warnings.push(`Missing service field: ${field}`);
        }
      });
    }

    // Check API inventory
    if (!data.api_inventory) {
      validation.warnings.push('Missing "api_inventory" section');
    } else if (!data.api_inventory.endpoints) {
      validation.warnings.push('Missing endpoints in api_inventory');
    }

    return validation;
  }
}

module.exports = JsonParser;

// CLI execution
if (require.main === module) {
  const parser = new JsonParser();
  const testFile = process.argv[2] || './analysis/obk-parking-trunk/dependency-map.json';
  
  console.log(`Parsing file: ${testFile}`);
  parser.parseDependencyMap(testFile)
    .then(result => {
      console.log('\n=== JSON Parse Results ===');
      console.log('Service:', result.service.name);
      console.log('Framework:', result.service.framework);
      console.log('Language:', result.service.language);
      console.log('Endpoints:', result.metadata.totalEndpoints);
      console.log('Schemas:', result.metadata.totalSchemas);
      console.log('Dependencies:', result.metadata.totalDependencies);
      console.log('Packages:', result.metadata.totalPackages);
      
      if (result.apiInventory.endpoints.length > 0) {
        console.log('\nSample endpoint:');
        const endpoint = result.apiInventory.endpoints[0];
        console.log(`  ${endpoint.method} ${endpoint.path}`);
      }
      
      console.log('\nFull structure available in result object');
    })
    .catch(error => {
      console.error('Parsing failed:', error.message);
      process.exit(1);
    });
} 