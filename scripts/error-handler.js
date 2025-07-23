const fs = require('fs').promises;
const path = require('path');

/**
 * Error Handler and Validator for API Analysis
 * Provides comprehensive error handling and validation for files and data
 */
class ErrorHandler {
  constructor(options = {}) {
    this.options = {
      throwOnCritical: options.throwOnCritical !== false,
      logLevel: options.logLevel || 'info', // debug, info, warn, error
      maxRetries: options.maxRetries || 3,
      retryDelay: options.retryDelay || 1000,
      ...options
    };
    
    this.errors = [];
    this.warnings = [];
    this.stats = {
      filesProcessed: 0,
      filesSkipped: 0,
      errorsTotal: 0,
      warningsTotal: 0
    };
  }

  /**
   * Validate file existence and accessibility
   * @param {string} filePath - Path to file
   * @returns {Promise<Object>} Validation result
   */
  async validateFileAccess(filePath) {
    const result = {
      exists: false,
      readable: false,
      size: 0,
      lastModified: null,
      errors: [],
      warnings: []
    };

    try {
      // Check if file exists
      const stats = await fs.stat(filePath);
      result.exists = true;
      result.size = stats.size;
      result.lastModified = stats.mtime;

      // Check if file is readable
      await fs.access(filePath, fs.constants.R_OK);
      result.readable = true;

      // Validate file size
      if (stats.size === 0) {
        result.warnings.push('File is empty');
      } else if (stats.size > 10 * 1024 * 1024) { // 10MB
        result.warnings.push('File is unusually large (>10MB)');
      }

      // Check file age
      const ageInDays = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
      if (ageInDays > 30) {
        result.warnings.push(`File is ${Math.round(ageInDays)} days old`);
      }

    } catch (error) {
      if (error.code === 'ENOENT') {
        result.errors.push('File does not exist');
      } else if (error.code === 'EACCES') {
        result.errors.push('File is not readable (permission denied)');
      } else {
        result.errors.push(`File access error: ${error.message}`);
      }
    }

    return result;
  }

  /**
   * Validate directory structure
   * @param {string} directoryPath - Path to directory
   * @param {Array} requiredFiles - List of required file names
   * @returns {Promise<Object>} Validation result
   */
  async validateDirectory(directoryPath, requiredFiles = []) {
    const result = {
      exists: false,
      readable: false,
      files: {},
      missingFiles: [],
      extraFiles: [],
      errors: [],
      warnings: []
    };

    try {
      // Check directory existence
      const stats = await fs.stat(directoryPath);
      if (!stats.isDirectory()) {
        result.errors.push('Path is not a directory');
        return result;
      }
      result.exists = true;

      // Check directory access
      await fs.access(directoryPath, fs.constants.R_OK);
      result.readable = true;

      // List directory contents
      const files = await fs.readdir(directoryPath);
      
      // Validate required files
      for (const requiredFile of requiredFiles) {
        if (files.includes(requiredFile)) {
          const filePath = path.join(directoryPath, requiredFile);
          result.files[requiredFile] = await this.validateFileAccess(filePath);
        } else {
          result.missingFiles.push(requiredFile);
          result.files[requiredFile] = { exists: false, errors: ['File missing'] };
        }
      }

      // Identify extra files
      result.extraFiles = files.filter(file => !requiredFiles.includes(file));

      // Add warnings for missing files
      if (result.missingFiles.length > 0) {
        result.warnings.push(`Missing ${result.missingFiles.length} required files`);
      }

    } catch (error) {
      if (error.code === 'ENOENT') {
        result.errors.push('Directory does not exist');
      } else if (error.code === 'EACCES') {
        result.errors.push('Directory is not readable (permission denied)');
      } else {
        result.errors.push(`Directory access error: ${error.message}`);
      }
    }

    return result;
  }

  /**
   * Validate file content format
   * @param {string} filePath - Path to file
   * @param {string} expectedType - Expected file type (json, yaml, markdown)
   * @returns {Promise<Object>} Validation result
   */
  async validateFileContent(filePath, expectedType) {
    const result = {
      isValid: false,
      type: expectedType,
      encoding: 'utf8',
      errors: [],
      warnings: [],
      metadata: {}
    };

    try {
      const content = await fs.readFile(filePath, 'utf8');
      
      // Check for BOM and encoding issues
      if (content.charCodeAt(0) === 0xFEFF) {
        result.warnings.push('File contains BOM (Byte Order Mark)');
      }

      // Validate based on expected type
      switch (expectedType.toLowerCase()) {
        case 'json':
          result.metadata = await this.validateJsonContent(content);
          break;
        case 'yaml':
        case 'yml':
          result.metadata = await this.validateYamlContent(content);
          break;
        case 'markdown':
        case 'md':
          result.metadata = await this.validateMarkdownContent(content);
          break;
        default:
          result.warnings.push(`Unknown file type: ${expectedType}`);
      }

      result.isValid = result.metadata.isValid !== false;
      result.errors.push(...(result.metadata.errors || []));
      result.warnings.push(...(result.metadata.warnings || []));

    } catch (error) {
      result.errors.push(`Content validation error: ${error.message}`);
    }

    return result;
  }

  /**
   * Validate JSON content
   * @param {string} content - JSON content
   * @returns {Promise<Object>} Validation result
   */
  async validateJsonContent(content) {
    const result = {
      isValid: false,
      errors: [],
      warnings: [],
      structure: null
    };

    try {
      const parsed = JSON.parse(content);
      result.isValid = true;
      result.structure = this.analyzeJsonStructure(parsed);
      
      // Validate JSON structure
      if (typeof parsed !== 'object' || parsed === null) {
        result.warnings.push('JSON root is not an object');
      }

    } catch (error) {
      result.errors.push(`JSON parsing error: ${error.message}`);
      
      // Try to provide helpful hints
      const lines = content.split('\n');
      const errorMatch = error.message.match(/position (\d+)/);
      if (errorMatch) {
        const position = parseInt(errorMatch[1]);
        let currentPos = 0;
        for (let i = 0; i < lines.length; i++) {
          if (currentPos + lines[i].length >= position) {
            result.errors.push(`Error likely on line ${i + 1}`);
            break;
          }
          currentPos += lines[i].length + 1; // +1 for newline
        }
      }
    }

    return result;
  }

  /**
   * Validate YAML content
   * @param {string} content - YAML content
   * @returns {Promise<Object>} Validation result
   */
  async validateYamlContent(content) {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
      structure: null
    };

    try {
      // Basic YAML validation (without external dependencies)
      const lines = content.split('\n');
      let indentLevel = 0;
      let hasContent = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // Skip empty lines and comments
        if (!trimmed || trimmed.startsWith('#')) continue;
        
        hasContent = true;
        
        // Check indentation consistency
        const currentIndent = line.length - line.trimLeft().length;
        if (currentIndent % 2 !== 0) {
          result.warnings.push(`Inconsistent indentation on line ${i + 1}`);
        }
        
        // Check for basic YAML syntax
        if (trimmed.includes(':') && !trimmed.startsWith('-')) {
          // Key-value pair
          const colonIndex = trimmed.indexOf(':');
          const key = trimmed.substring(0, colonIndex).trim();
          if (!key) {
            result.errors.push(`Empty key on line ${i + 1}`);
          }
        }
      }

      if (!hasContent) {
        result.warnings.push('YAML file appears to be empty');
      }

      result.structure = { lines: lines.length, hasContent };

    } catch (error) {
      result.errors.push(`YAML validation error: ${error.message}`);
      result.isValid = false;
    }

    return result;
  }

  /**
   * Validate Markdown content
   * @param {string} content - Markdown content
   * @returns {Promise<Object>} Validation result
   */
  async validateMarkdownContent(content) {
    const result = {
      isValid: true,
      errors: [],
      warnings: [],
      structure: null
    };

    try {
      const lines = content.split('\n');
      const structure = {
        headers: [],
        sections: 0,
        listItems: 0,
        codeBlocks: 0,
        links: 0,
        length: content.length
      };

      // Analyze markdown structure
      let inCodeBlock = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Track code blocks
        if (line.startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          structure.codeBlocks++;
          continue;
        }
        
        // Skip content inside code blocks
        if (inCodeBlock) continue;
        
        // Count headers
        if (line.startsWith('#')) {
          const level = (line.match(/^#+/) || [''])[0].length;
          const title = line.substring(level).trim();
          structure.headers.push({ level, title, line: i + 1 });
          structure.sections++;
        }
        
        // Count list items
        if (line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line)) {
          structure.listItems++;
        }
        
        // Count links
        const linkMatches = line.match(/\[([^\]]+)\]\([^)]+\)/g);
        if (linkMatches) {
          structure.links += linkMatches.length;
        }
      }

      // Validate structure requirements for API inventory
      if (structure.headers.length === 0) {
        result.warnings.push('No headers found in markdown file');
      }

      if (structure.length < 100) {
        result.warnings.push('Markdown content is very short');
      }

      result.structure = structure;

    } catch (error) {
      result.errors.push(`Markdown validation error: ${error.message}`);
      result.isValid = false;
    }

    return result;
  }

  /**
   * Analyze JSON structure
   * @param {Object} obj - Parsed JSON object
   * @returns {Object} Structure analysis
   */
  analyzeJsonStructure(obj) {
    const structure = {
      type: Array.isArray(obj) ? 'array' : typeof obj,
      keys: [],
      depth: 0,
      size: 0
    };

    if (typeof obj === 'object' && obj !== null) {
      structure.keys = Object.keys(obj);
      structure.size = structure.keys.length;
      structure.depth = this.calculateObjectDepth(obj);
    }

    return structure;
  }

  /**
   * Calculate object depth recursively
   * @param {Object} obj - Object to analyze
   * @returns {number} Maximum depth
   */
  calculateObjectDepth(obj) {
    if (typeof obj !== 'object' || obj === null) return 0;
    
    let maxDepth = 1;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const depth = 1 + this.calculateObjectDepth(obj[key]);
        maxDepth = Math.max(maxDepth, depth);
      }
    }
    return maxDepth;
  }

  /**
   * Handle and log errors
   * @param {Error|string} error - Error to handle
   * @param {string} context - Context where error occurred
   * @param {string} severity - Error severity (error, warning, info)
   */
  handleError(error, context = 'unknown', severity = 'error') {
    const errorObj = {
      message: error instanceof Error ? error.message : error,
      context,
      severity,
      timestamp: new Date().toISOString(),
      stack: error instanceof Error ? error.stack : null
    };

    if (severity === 'error') {
      this.errors.push(errorObj);
      this.stats.errorsTotal++;
    } else if (severity === 'warning') {
      this.warnings.push(errorObj);
      this.stats.warningsTotal++;
    }

    // Log based on level
    this.log(errorObj.message, severity, context);

    // Throw critical errors if configured
    if (severity === 'error' && this.options.throwOnCritical) {
      throw error instanceof Error ? error : new Error(error);
    }
  }

  /**
   * Log messages based on log level
   * @param {string} message - Message to log
   * @param {string} level - Log level
   * @param {string} context - Context
   */
  log(message, level = 'info', context = '') {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    const currentLevel = levels[this.options.logLevel] || 1;
    const messageLevel = levels[level] || 1;

    if (messageLevel >= currentLevel) {
      const timestamp = new Date().toISOString();
      const prefix = context ? `[${context}]` : '';
      console.log(`${timestamp} [${level.toUpperCase()}] ${prefix} ${message}`);
    }
  }

  /**
   * Retry operation with exponential backoff
   * @param {Function} operation - Operation to retry
   * @param {number} maxRetries - Maximum number of retries
   * @returns {Promise<any>} Operation result
   */
  async retry(operation, maxRetries = this.options.maxRetries) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          const delay = this.options.retryDelay * Math.pow(2, attempt);
          this.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`, 'warn');
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Get summary of all errors and warnings
   * @returns {Object} Error summary
   */
  getSummary() {
    return {
      stats: { ...this.stats },
      errors: this.errors.length,
      warnings: this.warnings.length,
      lastErrors: this.errors.slice(-5),
      lastWarnings: this.warnings.slice(-5)
    };
  }

  /**
   * Reset error tracking
   */
  reset() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      filesProcessed: 0,
      filesSkipped: 0,
      errorsTotal: 0,
      warningsTotal: 0
    };
  }

  /**
   * Generate error report
   * @returns {string} Formatted error report
   */
  generateReport() {
    const summary = this.getSummary();
    let report = `\n=== Error Handler Summary ===\n`;
    report += `Files Processed: ${summary.stats.filesProcessed}\n`;
    report += `Files Skipped: ${summary.stats.filesSkipped}\n`;
    report += `Total Errors: ${summary.errors}\n`;
    report += `Total Warnings: ${summary.warnings}\n`;

    if (summary.errors > 0) {
      report += `\nRecent Errors:\n`;
      summary.lastErrors.forEach(error => {
        report += `  - [${error.context}] ${error.message}\n`;
      });
    }

    if (summary.warnings > 0) {
      report += `\nRecent Warnings:\n`;
      summary.lastWarnings.forEach(warning => {
        report += `  - [${warning.context}] ${warning.message}\n`;
      });
    }

    return report;
  }
}

module.exports = ErrorHandler;

// CLI execution for testing
if (require.main === module) {
  const handler = new ErrorHandler({ logLevel: 'debug' });
  
  // Test file validation
  const testFile = process.argv[2] || './analysis/obk-sso-trunk/api-inventory.md';
  
  console.log(`Testing error handler with file: ${testFile}`);
  
  handler.validateFileAccess(testFile)
    .then(result => {
      console.log('\n=== File Access Validation ===');
      console.log('Exists:', result.exists);
      console.log('Readable:', result.readable);
      console.log('Size:', result.size);
      console.log('Errors:', result.errors);
      console.log('Warnings:', result.warnings);
      
      if (result.readable) {
        return handler.validateFileContent(testFile, 'markdown');
      }
    })
    .then(contentResult => {
      if (contentResult) {
        console.log('\n=== Content Validation ===');
        console.log('Valid:', contentResult.isValid);
        console.log('Type:', contentResult.type);
        console.log('Errors:', contentResult.errors);
        console.log('Warnings:', contentResult.warnings);
      }
      
      console.log('\n=== Handler Summary ===');
      console.log(handler.generateReport());
    })
    .catch(error => {
      console.error('Test failed:', error.message);
    });
} 