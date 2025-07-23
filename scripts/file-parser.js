const fs = require('fs').promises;
const path = require('path');

/**
 * File Parser for API Analysis
 * Parses api-inventory.md and dependency-map.json files to extract service information
 */
class FileParser {
  constructor() {
    this.supportedTypes = [
      'api-inventory.md',
      'dependency-map.json',
      'openapi.yaml',
      'openapi.yml'
    ];
  }

  /**
   * Parse a file based on its type with validation
   * @param {string} filePath - Path to the file
   * @param {string} fileType - Type of file (api-inventory.md, dependency-map.json, etc.)
   * @returns {Promise<Object>} Parsed data object with validation results
   */
  async parseFile(filePath, fileType) {
    // Validate file exists and is readable
    const fileValidation = await this.validateFile(filePath);
    if (!fileValidation.isValid) {
      return {
        type: 'error',
        filePath,
        errors: fileValidation.errors,
        warnings: fileValidation.warnings
      };
    }

    try {
      const content = await fs.readFile(filePath, 'utf8');
      
      // Validate content is not empty
      if (!content.trim()) {
        return {
          type: 'error',
          filePath,
          errors: ['File is empty'],
          warnings: []
        };
      }

      let parsedData;
      switch (fileType) {
        case 'api-inventory.md':
          parsedData = this.parseApiInventory(content, filePath);
          break;
        case 'dependency-map.json':
          parsedData = this.parseDependencyMap(content, filePath);
          break;
        case 'openapi.yaml':
        case 'openapi.yml':
          parsedData = this.parseOpenAPI(content, filePath);
          break;
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }

      // Validate parsed data
      const validation = this.validate(parsedData);
      parsedData.validation = validation;

      return parsedData;
    } catch (error) {
      return {
        type: 'error',
        filePath,
        errors: [`Failed to parse ${filePath}: ${error.message}`],
        warnings: []
      };
    }
  }

  /**
   * Validate file exists and is accessible
   * @param {string} filePath - Path to the file
   * @returns {Promise<Object>} Validation result
   */
  async validateFile(filePath) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    try {
      const stats = await fs.stat(filePath);
      
      if (!stats.isFile()) {
        validation.errors.push(`${filePath} is not a file`);
        validation.isValid = false;
      }

      if (stats.size === 0) {
        validation.warnings.push(`${filePath} is empty`);
      }

      if (stats.size > 10 * 1024 * 1024) { // 10MB limit
        validation.warnings.push(`${filePath} is very large (${Math.round(stats.size / 1024 / 1024)}MB)`);
      }

    } catch (error) {
      if (error.code === 'ENOENT') {
        validation.errors.push(`File not found: ${filePath}`);
      } else if (error.code === 'EACCES') {
        validation.errors.push(`Permission denied: ${filePath}`);
      } else {
        validation.errors.push(`Cannot access file ${filePath}: ${error.message}`);
      }
      validation.isValid = false;
    }

    return validation;
  }

  /**
   * Parse API inventory markdown file to extract endpoints
   * @param {string} content - File content
   * @param {string} filePath - File path for error reporting
   * @returns {Object} Parsed API inventory data
   */
  parseApiInventory(content, filePath) {
    const result = {
      type: 'api-inventory',
      filePath,
      serviceName: this.extractServiceName(filePath),
      framework: null,
      endpoints: [],
      externalAPIs: [],
      dependencies: [],
      metadata: {}
    };

    try {
      // Extract service name from path or content
      const serviceNameMatch = content.match(/# Service: (.+)/i) || 
                              content.match(/# (.+) API Inventory/i);
      if (serviceNameMatch) {
        result.serviceName = serviceNameMatch[1].trim();
      }

      // Extract framework information
      const frameworkMatch = content.match(/Framework: (.+)/i) || 
                            content.match(/Built with: (.+)/i);
      if (frameworkMatch) {
        result.framework = frameworkMatch[1].trim();
      }

      // Extract API endpoints from markdown tables or lists
      result.endpoints = this.extractEndpoints(content);
      
      // Extract external API dependencies
      result.externalAPIs = this.extractExternalAPIs(content);
      
      // Extract service dependencies
      result.dependencies = this.extractDependencies(content);

      // Extract metadata
      result.metadata = this.extractMetadata(content);

    } catch (error) {
      console.warn(`Warning: Error parsing API inventory ${filePath}: ${error.message}`);
    }

    return result;
  }

  /**
   * Extract API endpoints from markdown content
   * @param {string} content - Markdown content
   * @returns {Array} Array of endpoint objects
   */
  extractEndpoints(content) {
    const endpoints = [];
    
    // Look for endpoint sections
    const sections = content.split(/#{1,3}\s*(?:API\s*)?Endpoints?/i);
    if (sections.length < 2) return endpoints;

    const endpointSection = sections[1];
    
    // Parse markdown table format
    const tableMatches = endpointSection.match(/\|([^|]+)\|([^|]+)\|([^|]*)\|/g);
    if (tableMatches) {
      tableMatches.forEach((match, index) => {
        if (index === 0) return; // Skip header row
        
        const parts = match.split('|').map(p => p.trim()).filter(p => p);
        if (parts.length >= 2) {
          endpoints.push({
            method: parts[0] || 'GET',
            path: parts[1] || '',
            description: parts[2] || '',
            type: 'internal'
          });
        }
      });
    }

    // Parse list format
    const listMatches = endpointSection.match(/[-*]\s*`?(GET|POST|PUT|DELETE|PATCH)\s+([^\s`]+)`?/gi);
    if (listMatches) {
      listMatches.forEach(match => {
        const parts = match.match(/(GET|POST|PUT|DELETE|PATCH)\s+([^\s`]+)/i);
        if (parts) {
          endpoints.push({
            method: parts[1].toUpperCase(),
            path: parts[2],
            description: '',
            type: 'internal'
          });
        }
      });
    }

    return endpoints;
  }

  /**
   * Extract external API calls from markdown content
   * @param {string} content - Markdown content
   * @returns {Array} Array of external API objects
   */
  extractExternalAPIs(content) {
    const externalAPIs = [];
    
    // Look for external API sections
    const sections = content.split(/#{1,3}\s*External\s*APIs?/i);
    if (sections.length < 2) return externalAPIs;

    const externalSection = sections[1];
    
    // Parse various formats
    const urlMatches = externalSection.match(/https?:\/\/[^\s)]+/g);
    if (urlMatches) {
      urlMatches.forEach(url => {
        externalAPIs.push({
          url: url,
          type: 'external',
          description: ''
        });
      });
    }

    return externalAPIs;
  }

  /**
   * Extract service dependencies from markdown content
   * @param {string} content - Markdown content
   * @returns {Array} Array of dependency objects
   */
  extractDependencies(content) {
    const dependencies = [];
    
    // Look for dependency sections
    const sections = content.split(/#{1,3}\s*Dependencies/i);
    if (sections.length < 2) return dependencies;

    const depSection = sections[1];
    
    // Parse service references
    const serviceMatches = depSection.match(/[-*]\s*([a-zA-Z-]+(?:-service)?)/g);
    if (serviceMatches) {
      serviceMatches.forEach(match => {
        const serviceName = match.replace(/[-*]\s*/, '').trim();
        dependencies.push({
          service: serviceName,
          type: 'service-dependency'
        });
      });
    }

    return dependencies;
  }

  /**
   * Extract metadata from markdown content
   * @param {string} content - Markdown content
   * @returns {Object} Metadata object
   */
  extractMetadata(content) {
    const metadata = {};
    
    // Extract port information
    const portMatch = content.match(/Port:\s*(\d+)/i);
    if (portMatch) {
      metadata.port = parseInt(portMatch[1]);
    }

    // Extract description
    const descMatch = content.match(/Description:\s*(.+)/i);
    if (descMatch) {
      metadata.description = descMatch[1].trim();
    }

    // Extract version
    const versionMatch = content.match(/Version:\s*(.+)/i);
    if (versionMatch) {
      metadata.version = versionMatch[1].trim();
    }

    return metadata;
  }

  /**
   * Parse dependency map JSON file
   * @param {string} content - JSON content
   * @param {string} filePath - File path for error reporting
   * @returns {Object} Parsed dependency map data
   */
  parseDependencyMap(content, filePath) {
    try {
      const data = JSON.parse(content);
      
      return {
        type: 'dependency-map',
        filePath,
        serviceName: this.extractServiceName(filePath),
        dependencies: data.dependencies || [],
        consumers: data.consumers || [],
        metadata: {
          ...data.metadata,
          lastUpdated: data.lastUpdated || new Date().toISOString()
        }
      };
    } catch (error) {
      throw new Error(`Invalid JSON in dependency map: ${error.message}`);
    }
  }

  /**
   * Parse OpenAPI specification file
   * @param {string} content - YAML content
   * @param {string} filePath - File path for error reporting
   * @returns {Object} Parsed OpenAPI data
   */
  parseOpenAPI(content, filePath) {
    // Basic YAML parsing - in a real implementation, you might use a YAML parser
    const result = {
      type: 'openapi',
      filePath,
      serviceName: this.extractServiceName(filePath),
      endpoints: [],
      schemas: [],
      metadata: {}
    };

    try {
      // Extract paths (simplified parsing)
      const pathMatches = content.match(/^\s*\/[^:]+:/gm);
      if (pathMatches) {
        pathMatches.forEach(match => {
          const path = match.replace(':', '').trim();
          result.endpoints.push({
            path: path,
            methods: [], // Would need more complex parsing for methods
            type: 'openapi'
          });
        });
      }

      // Extract service info
      const titleMatch = content.match(/title:\s*(.+)/i);
      if (titleMatch) {
        result.metadata.title = titleMatch[1].trim();
      }

      const versionMatch = content.match(/version:\s*(.+)/i);
      if (versionMatch) {
        result.metadata.version = versionMatch[1].trim();
      }

    } catch (error) {
      console.warn(`Warning: Error parsing OpenAPI ${filePath}: ${error.message}`);
    }

    return result;
  }

  /**
   * Extract service name from file path
   * @param {string} filePath - File path
   * @returns {string} Service name
   */
  extractServiceName(filePath) {
    const parts = filePath.split(path.sep);
    // Get the service directory name (second to last part before filename)
    return parts[parts.length - 2] || 'unknown-service';
  }

  /**
   * Validate parsed data
   * @param {Object} parsedData - Parsed data object
   * @returns {Object} Validation result
   */
  validate(parsedData) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    if (!parsedData.serviceName) {
      validation.errors.push('Service name is missing');
      validation.isValid = false;
    }

    if (parsedData.type === 'api-inventory' && (!parsedData.endpoints || parsedData.endpoints.length === 0)) {
      validation.warnings.push('No API endpoints found');
    }

    if (parsedData.type === 'dependency-map' && (!parsedData.dependencies || parsedData.dependencies.length === 0)) {
      validation.warnings.push('No dependencies found');
    }

    return validation;
  }
}

module.exports = FileParser; 