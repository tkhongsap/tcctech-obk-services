const fs = require('fs').promises;

/**
 * YAML Parser for OpenAPI Specifications
 * Extracts API paths, operations, and schemas from openapi.yaml files
 */
class YamlParser {
  constructor() {
    this.supportedVersions = ['2.0', '3.0.0', '3.0.1', '3.0.2', '3.0.3', '3.1.0'];
    this.httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'trace'];
  }

  /**
   * Parse an OpenAPI YAML file
   * @param {string} filePath - Path to the YAML file
   * @returns {Promise<Object>} Parsed OpenAPI data
   */
  async parseOpenApiYaml(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return this.parseYamlContent(content, filePath);
    } catch (error) {
      throw new Error(`Failed to parse YAML file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Parse YAML content and extract OpenAPI data
   * @param {string} content - YAML content
   * @param {string} filePath - Source file path for context
   * @returns {Object} Parsed OpenAPI data
   */
  parseYamlContent(content, filePath = '') {
    const result = {
      sourceFile: filePath,
      openapi: {
        version: '',
        title: '',
        description: '',
        version_info: ''
      },
      paths: [],
      schemas: [],
      servers: [],
      security: [],
      metadata: {
        totalPaths: 0,
        totalOperations: 0,
        totalSchemas: 0,
        httpMethods: {},
        tags: [],
        parsedAt: new Date().toISOString()
      },
      raw: {}
    };

    try {
      // Parse YAML using simple text parsing (avoiding external dependencies)
      const yamlData = this.simpleYamlParse(content);
      result.raw = yamlData;

      // Extract OpenAPI/Swagger version and info
      result.openapi = this.parseOpenApiInfo(yamlData);

      // Extract paths and operations
      if (yamlData.paths) {
        result.paths = this.parsePaths(yamlData.paths);
      }

      // Extract schemas/definitions
      if (yamlData.components && yamlData.components.schemas) {
        result.schemas = this.parseSchemas(yamlData.components.schemas);
      } else if (yamlData.definitions) {
        // Swagger 2.0 format
        result.schemas = this.parseSchemas(yamlData.definitions);
      }

      // Extract servers
      if (yamlData.servers) {
        result.servers = this.parseServers(yamlData.servers);
      } else if (yamlData.host) {
        // Swagger 2.0 format
        result.servers = [{
          url: `${yamlData.schemes?.[0] || 'http'}://${yamlData.host}${yamlData.basePath || ''}`,
          description: 'Main server'
        }];
      }

      // Extract security
      if (yamlData.security) {
        result.security = yamlData.security;
      }

      // Calculate metadata
      result.metadata = this.calculateMetadata(result);

    } catch (error) {
      throw new Error(`YAML parsing error: ${error.message}`);
    }

    return result;
  }

  /**
   * Simple YAML parser (basic implementation)
   * @param {string} content - YAML content
   * @returns {Object} Parsed YAML object
   */
  simpleYamlParse(content) {
    // This is a simplified YAML parser for basic OpenAPI structures
    // In production, you'd want to use a proper YAML library like 'js-yaml'
    const result = {};
    const lines = content.split('\n');
    let currentPath = [];
    let currentObject = result;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) continue;

      // Calculate indentation level
      const indent = line.length - line.trimLeft().length;
      const level = Math.floor(indent / 2);

      // Adjust current path based on indentation
      currentPath = currentPath.slice(0, level);
      currentObject = result;
      for (const pathPart of currentPath) {
        currentObject = currentObject[pathPart];
      }

      // Parse key-value pairs
      if (trimmed.includes(':')) {
        const [key, ...valueParts] = trimmed.split(':');
        const value = valueParts.join(':').trim();
        
        if (value === '' || value === '{}' || value === '[]') {
          // Object or array start
          currentObject[key.trim()] = value === '[]' ? [] : {};
          currentPath.push(key.trim());
        } else {
          // Simple value
          currentObject[key.trim()] = this.parseValue(value);
        }
      } else if (trimmed.startsWith('-')) {
        // Array item
        const value = trimmed.substring(1).trim();
        if (!Array.isArray(currentObject)) {
          // Convert to array if not already
          currentObject = [];
        }
        currentObject.push(this.parseValue(value));
      }
    }

    return result;
  }

  /**
   * Parse a YAML value to appropriate type
   * @param {string} value - Raw value string
   * @returns {any} Parsed value
   */
  parseValue(value) {
    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }
    
    // Boolean
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    // Number
    if (/^\d+$/.test(value)) return parseInt(value);
    if (/^\d*\.\d+$/.test(value)) return parseFloat(value);
    
    // Null
    if (value === 'null' || value === '~') return null;
    
    return value;
  }

  /**
   * Parse OpenAPI info section
   * @param {Object} yamlData - Parsed YAML data
   * @returns {Object} OpenAPI info
   */
  parseOpenApiInfo(yamlData) {
    const info = {
      version: '',
      title: '',
      description: '',
      version_info: ''
    };

    // OpenAPI 3.x
    if (yamlData.openapi) {
      info.version = yamlData.openapi;
    }
    // Swagger 2.0
    else if (yamlData.swagger) {
      info.version = yamlData.swagger;
    }

    // Info section
    if (yamlData.info) {
      info.title = yamlData.info.title || '';
      info.description = yamlData.info.description || '';
      info.version_info = yamlData.info.version || '';
    }

    return info;
  }

  /**
   * Parse paths section
   * @param {Object} pathsData - Paths data from YAML
   * @returns {Array} Array of path objects
   */
  parsePaths(pathsData) {
    const paths = [];

    Object.entries(pathsData).forEach(([pathName, pathInfo]) => {
      const pathObj = {
        path: pathName,
        operations: [],
        parameters: pathInfo.parameters || []
      };

      // Parse operations (HTTP methods)
      this.httpMethods.forEach(method => {
        if (pathInfo[method]) {
          const operation = this.parseOperation(method, pathInfo[method]);
          pathObj.operations.push(operation);
        }
      });

      paths.push(pathObj);
    });

    return paths;
  }

  /**
   * Parse a single operation
   * @param {string} method - HTTP method
   * @param {Object} operationData - Operation data
   * @returns {Object} Parsed operation
   */
  parseOperation(method, operationData) {
    return {
      method: method.toUpperCase(),
      operationId: operationData.operationId || '',
      summary: operationData.summary || '',
      description: operationData.description || '',
      tags: operationData.tags || [],
      parameters: operationData.parameters || [],
      responses: this.parseResponses(operationData.responses || {}),
      security: operationData.security || [],
      deprecated: operationData.deprecated || false
    };
  }

  /**
   * Parse responses section
   * @param {Object} responsesData - Responses data
   * @returns {Array} Array of response objects
   */
  parseResponses(responsesData) {
    const responses = [];

    Object.entries(responsesData).forEach(([statusCode, responseInfo]) => {
      responses.push({
        statusCode,
        description: responseInfo.description || '',
        schema: responseInfo.schema || responseInfo.content || null,
        headers: responseInfo.headers || {}
      });
    });

    return responses;
  }

  /**
   * Parse schemas/definitions section
   * @param {Object} schemasData - Schemas data
   * @returns {Array} Array of schema objects
   */
  parseSchemas(schemasData) {
    const schemas = [];

    Object.entries(schemasData).forEach(([schemaName, schemaInfo]) => {
      schemas.push({
        name: schemaName,
        type: schemaInfo.type || 'object',
        properties: schemaInfo.properties || {},
        required: schemaInfo.required || [],
        description: schemaInfo.description || '',
        example: schemaInfo.example || null
      });
    });

    return schemas;
  }

  /**
   * Parse servers section
   * @param {Array} serversData - Servers data
   * @returns {Array} Array of server objects
   */
  parseServers(serversData) {
    if (!Array.isArray(serversData)) return [];

    return serversData.map(server => ({
      url: server.url || '',
      description: server.description || '',
      variables: server.variables || {}
    }));
  }

  /**
   * Calculate metadata from parsed data
   * @param {Object} result - Parsed result object
   * @returns {Object} Calculated metadata
   */
  calculateMetadata(result) {
    const metadata = {
      totalPaths: result.paths.length,
      totalOperations: 0,
      totalSchemas: result.schemas.length,
      httpMethods: {},
      tags: [],
      servers: result.servers.length,
      hasAuthentication: result.security.length > 0,
      parsedAt: new Date().toISOString()
    };

    // Count operations and methods
    result.paths.forEach(path => {
      metadata.totalOperations += path.operations.length;
      
      path.operations.forEach(operation => {
        const method = operation.method;
        metadata.httpMethods[method] = (metadata.httpMethods[method] || 0) + 1;
        
        // Collect unique tags
        operation.tags.forEach(tag => {
          if (!metadata.tags.includes(tag)) {
            metadata.tags.push(tag);
          }
        });
      });
    });

    return metadata;
  }

  /**
   * Parse multiple YAML files in a directory
   * @param {string} directoryPath - Directory containing YAML files
   * @returns {Promise<Array>} Array of parsed OpenAPI data
   */
  async parseDirectory(directoryPath) {
    try {
      const path = require('path');
      const files = await fs.readdir(directoryPath);
      const results = [];

      for (const file of files) {
        if (file === 'openapi.yaml' || file === 'swagger.yaml') {
          const filePath = path.join(directoryPath, file);
          const parsed = await this.parseOpenApiYaml(filePath);
          results.push(parsed);
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Directory parsing failed: ${error.message}`);
    }
  }

  /**
   * Validate OpenAPI specification
   * @param {Object} data - Parsed OpenAPI data
   * @returns {Object} Validation result
   */
  validateOpenApi(data) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Check OpenAPI version
    if (!data.openapi.version) {
      validation.errors.push('Missing OpenAPI/Swagger version');
      validation.isValid = false;
    } else if (!this.supportedVersions.includes(data.openapi.version)) {
      validation.warnings.push(`Unsupported OpenAPI version: ${data.openapi.version}`);
    }

    // Check required info
    if (!data.openapi.title) {
      validation.warnings.push('Missing API title');
    }

    // Check paths
    if (data.paths.length === 0) {
      validation.warnings.push('No API paths defined');
    }

    return validation;
  }
}

module.exports = YamlParser;

// CLI execution
if (require.main === module) {
  const parser = new YamlParser();
  const testFile = process.argv[2] || './analysis/obk-parking-trunk/openapi.yaml';
  
  console.log(`Parsing file: ${testFile}`);
  parser.parseOpenApiYaml(testFile)
    .then(result => {
      console.log('\n=== YAML Parse Results ===');
      console.log('OpenAPI Version:', result.openapi.version);
      console.log('Title:', result.openapi.title);
      console.log('Paths:', result.metadata.totalPaths);
      console.log('Operations:', result.metadata.totalOperations);
      console.log('Schemas:', result.metadata.totalSchemas);
      console.log('HTTP Methods:', result.metadata.httpMethods);
      console.log('Tags:', result.metadata.tags);
      
      if (result.paths.length > 0) {
        console.log('\nSample path:');
        const path = result.paths[0];
        console.log(`  ${path.path} (${path.operations.length} operations)`);
      }
      
      console.log('\nFull structure available in result object');
    })
    .catch(error => {
      console.error('Parsing failed:', error.message);
      process.exit(1);
    });
} 