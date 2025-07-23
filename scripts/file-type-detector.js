const fs = require('fs').promises;
const path = require('path');

/**
 * File Type Detector for API Analysis
 * Identifies and validates different file types in service directories
 */
class FileTypeDetector {
  constructor() {
    this.supportedTypes = {
      'api-inventory.md': {
        type: 'markdown',
        extension: '.md',
        validator: this.validateMarkdownInventory.bind(this)
      },
      'dependency-map.json': {
        type: 'json',
        extension: '.json',
        validator: this.validateDependencyJson.bind(this)
      },
      'openapi.yaml': {
        type: 'yaml',
        extension: '.yaml',
        validator: this.validateOpenApiYaml.bind(this)
      }
    };
  }

  /**
   * Detect and validate file type based on filename and content
   * @param {string} filePath - Path to the file
   * @returns {Promise<Object>} File type detection result
   */
  async detectFileType(filePath) {
    const filename = path.basename(filePath);
    const extension = path.extname(filePath);
    
    const result = {
      filename,
      filePath,
      extension,
      detectedType: null,
      isValid: false,
      size: 0,
      errors: [],
      metadata: {}
    };

    try {
      const stats = await fs.stat(filePath);
      result.size = stats.size;
      result.lastModified = stats.mtime;

      // Check if it's a known file type
      if (this.supportedTypes[filename]) {
        const typeInfo = this.supportedTypes[filename];
        result.detectedType = typeInfo.type;
        result.expectedExtension = typeInfo.extension;
        
        // Validate extension matches expected
        if (extension !== typeInfo.extension) {
          result.errors.push(`Extension mismatch: expected ${typeInfo.extension}, got ${extension}`);
        }

        // Validate file content
        try {
          const content = await fs.readFile(filePath, 'utf8');
          const validation = await typeInfo.validator(content, filePath);
          result.isValid = validation.isValid;
          result.errors.push(...validation.errors);
          result.metadata = { ...result.metadata, ...validation.metadata };
        } catch (error) {
          result.errors.push(`Content validation error: ${error.message}`);
        }
      } else {
        // Try to detect by extension for additional files
        result.detectedType = this.detectByExtension(extension);
      }

    } catch (error) {
      result.errors.push(`File access error: ${error.message}`);
    }

    return result;
  }

  /**
   * Detect file type by extension for unknown files
   * @param {string} extension - File extension
   * @returns {string} Detected type
   */
  detectByExtension(extension) {
    const extensionMap = {
      '.md': 'markdown',
      '.json': 'json',
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.csv': 'csv',
      '.txt': 'text'
    };
    return extensionMap[extension.toLowerCase()] || 'unknown';
  }

  /**
   * Validate API inventory Markdown file
   * @param {string} content - File content
   * @param {string} filePath - File path for context
   * @returns {Object} Validation result
   */
  async validateMarkdownInventory(content, filePath) {
    const result = {
      isValid: true,
      errors: [],
      metadata: {
        hasServiceOverview: false,
        hasEndpoints: false,
        hasSchemas: false,
        endpointCount: 0,
        schemaCount: 0
      }
    };

    try {
      // Check for required sections
      const requiredSections = [
        'Service Overview',
        'Technology Stack',
        'API Endpoints'
      ];

      requiredSections.forEach(section => {
        if (!content.includes(`## ${section}`)) {
          result.errors.push(`Missing required section: ${section}`);
          result.isValid = false;
        }
      });

      // Count endpoints (lines starting with ### followed by HTTP method)
      const endpointMatches = content.match(/###\s+(GET|POST|PUT|DELETE|PATCH)\s+/g);
      result.metadata.endpointCount = endpointMatches ? endpointMatches.length : 0;
      result.metadata.hasEndpoints = result.metadata.endpointCount > 0;

      // Check for service overview
      result.metadata.hasServiceOverview = content.includes('Service Name') && content.includes('Framework');

      // Count data schemas
      const schemaMatches = content.match(/###\s+\w+\s*$/gm);
      result.metadata.schemaCount = schemaMatches ? schemaMatches.length : 0;
      result.metadata.hasSchemas = result.metadata.schemaCount > 0;

      // Check file size (should not be empty)
      if (content.trim().length < 100) {
        result.errors.push('File appears to be too small or empty');
        result.isValid = false;
      }

    } catch (error) {
      result.errors.push(`Markdown validation error: ${error.message}`);
      result.isValid = false;
    }

    return result;
  }

  /**
   * Validate dependency map JSON file
   * @param {string} content - File content
   * @param {string} filePath - File path for context
   * @returns {Object} Validation result
   */
  async validateDependencyJson(content, filePath) {
    const result = {
      isValid: true,
      errors: [],
      metadata: {
        hasService: false,
        hasApiInventory: false,
        endpointCount: 0,
        dependencyCount: 0
      }
    };

    try {
      const data = JSON.parse(content);

      // Check for required top-level properties
      const requiredProps = ['service', 'api_inventory'];
      requiredProps.forEach(prop => {
        if (!data[prop]) {
          result.errors.push(`Missing required property: ${prop}`);
          result.isValid = false;
        }
      });

      // Validate service object
      if (data.service) {
        result.metadata.hasService = true;
        const serviceProps = ['name', 'framework', 'language'];
        serviceProps.forEach(prop => {
          if (!data.service[prop]) {
            result.errors.push(`Missing service property: ${prop}`);
          }
        });
      }

      // Validate API inventory
      if (data.api_inventory && data.api_inventory.endpoints) {
        result.metadata.hasApiInventory = true;
        result.metadata.endpointCount = data.api_inventory.endpoints.length;
      }

      // Count dependencies
      if (data.dependencies) {
        result.metadata.dependencyCount = Object.keys(data.dependencies).length;
      }

    } catch (error) {
      result.errors.push(`JSON parsing error: ${error.message}`);
      result.isValid = false;
    }

    return result;
  }

  /**
   * Validate OpenAPI YAML file
   * @param {string} content - File content
   * @param {string} filePath - File path for context
   * @returns {Object} Validation result
   */
  async validateOpenApiYaml(content, filePath) {
    const result = {
      isValid: true,
      errors: [],
      metadata: {
        hasOpenApiVersion: false,
        hasInfo: false,
        hasPaths: false,
        pathCount: 0
      }
    };

    try {
      // Basic YAML structure checks
      if (!content.includes('openapi:') && !content.includes('swagger:')) {
        result.errors.push('Does not appear to be an OpenAPI/Swagger specification');
        result.isValid = false;
      }

      // Check for basic OpenAPI sections
      const requiredSections = ['info:', 'paths:'];
      requiredSections.forEach(section => {
        if (content.includes(section)) {
          if (section === 'info:') result.metadata.hasInfo = true;
          if (section === 'paths:') result.metadata.hasPaths = true;
        } else {
          result.errors.push(`Missing OpenAPI section: ${section}`);
        }
      });

      // Count paths (rough estimate)
      const pathMatches = content.match(/^\s+\/[^:]*:/gm);
      result.metadata.pathCount = pathMatches ? pathMatches.length : 0;

      // Check if it's just a minimal/empty spec
      if (content.trim().length < 50) {
        result.errors.push('OpenAPI specification appears to be minimal or empty');
        result.isValid = false;
      }

    } catch (error) {
      result.errors.push(`YAML validation error: ${error.message}`);
      result.isValid = false;
    }

    return result;
  }

  /**
   * Analyze all files in a directory
   * @param {string} directoryPath - Path to analyze
   * @returns {Promise<Array>} Array of file analysis results
   */
  async analyzeDirectory(directoryPath) {
    try {
      const files = await fs.readdir(directoryPath);
      const results = [];

      for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isFile()) {
          const analysis = await this.detectFileType(filePath);
          results.push(analysis);
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Directory analysis failed: ${error.message}`);
    }
  }
}

module.exports = FileTypeDetector;

// CLI execution
if (require.main === module) {
  const detector = new FileTypeDetector();
  const testDir = process.argv[2] || './analysis/obk-sso-trunk';
  
  console.log(`Analyzing directory: ${testDir}`);
  detector.analyzeDirectory(testDir)
    .then(results => {
      console.log('\n=== File Type Analysis Results ===');
      results.forEach(result => {
        console.log(`\n${result.filename}:`);
        console.log(`  Type: ${result.detectedType}`);
        console.log(`  Valid: ${result.isValid}`);
        console.log(`  Size: ${result.size} bytes`);
        if (result.errors.length > 0) {
          console.log(`  Errors: ${result.errors.join(', ')}`);
        }
        if (Object.keys(result.metadata).length > 0) {
          console.log(`  Metadata:`, result.metadata);
        }
      });
    })
    .catch(error => {
      console.error('Analysis failed:', error.message);
      process.exit(1);
    });
} 