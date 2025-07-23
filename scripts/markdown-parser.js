const fs = require('fs').promises;

/**
 * Markdown Parser for API Inventory Files
 * Extracts structured data from api-inventory.md files
 */
class MarkdownParser {
  constructor() {
    this.sections = {
      serviceOverview: 'Service Overview',
      technologyStack: 'Technology Stack',
      apiEndpoints: 'API Endpoints',
      dataSchemas: 'Data Schemas',
      externalDependencies: 'External Dependencies'
    };
  }

  /**
   * Parse an API inventory markdown file
   * @param {string} filePath - Path to the markdown file
   * @returns {Promise<Object>} Parsed service data
   */
  async parseApiInventory(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return this.parseMarkdownContent(content, filePath);
    } catch (error) {
      throw new Error(`Failed to parse markdown file ${filePath}: ${error.message}`);
    }
  }

  /**
   * Parse markdown content and extract structured data
   * @param {string} content - Markdown content
   * @param {string} filePath - Source file path for context
   * @returns {Object} Parsed service data
   */
  parseMarkdownContent(content, filePath = '') {
    const result = {
      sourceFile: filePath,
      serviceName: '',
      serviceOverview: {},
      technologyStack: {},
      endpoints: [],
      schemas: [],
      externalDependencies: [],
      metadata: {
        totalEndpoints: 0,
        totalSchemas: 0,
        frameworks: [],
        languages: [],
        parsedAt: new Date().toISOString()
      }
    };

    try {
      // Split content into sections
      const sections = this.splitIntoSections(content);

      // Parse each section
      if (sections[this.sections.serviceOverview]) {
        result.serviceOverview = this.parseServiceOverview(sections[this.sections.serviceOverview]);
        result.serviceName = result.serviceOverview.serviceName || '';
      }

      if (sections[this.sections.technologyStack]) {
        result.technologyStack = this.parseTechnologyStack(sections[this.sections.technologyStack]);
      }

      if (sections[this.sections.apiEndpoints]) {
        result.endpoints = this.parseApiEndpoints(sections[this.sections.apiEndpoints]);
      }

      if (sections[this.sections.dataSchemas]) {
        result.schemas = this.parseDataSchemas(sections[this.sections.dataSchemas]);
      }

      if (sections[this.sections.externalDependencies]) {
        result.externalDependencies = this.parseExternalDependencies(sections[this.sections.externalDependencies]);
      }

      // Update metadata
      result.metadata.totalEndpoints = result.endpoints.length;
      result.metadata.totalSchemas = result.schemas.length;
      result.metadata.frameworks = this.extractFrameworks(result.technologyStack);
      result.metadata.languages = this.extractLanguages(result.technologyStack);

    } catch (error) {
      throw new Error(`Markdown parsing error: ${error.message}`);
    }

    return result;
  }

  /**
   * Split markdown content into sections based on ## headers
   * @param {string} content - Markdown content
   * @returns {Object} Sections mapped by header name
   */
  splitIntoSections(content) {
    const sections = {};
    const lines = content.split('\n');
    let currentSection = null;
    let currentContent = [];

    for (const line of lines) {
      if (line.startsWith('## ')) {
        // Save previous section
        if (currentSection) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        // Start new section
        currentSection = line.substring(3).trim();
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    }

    // Save last section
    if (currentSection) {
      sections[currentSection] = currentContent.join('\n').trim();
    }

    return sections;
  }

  /**
   * Parse Service Overview section
   * @param {string} content - Section content
   * @returns {Object} Service overview data
   */
  parseServiceOverview(content) {
    const overview = {
      serviceName: '',
      framework: '',
      language: '',
      analysisDate: '',
      totalEndpoints: 0
    };

    // Extract key-value pairs (- **Key**: Value format)
    const keyValueRegex = /[-*]\s*\*\*([^*]+)\*\*[:\s]*(.+)/g;
    let match;

    while ((match = keyValueRegex.exec(content)) !== null) {
      const key = match[1].trim().toLowerCase().replace(/\s+/g, '');
      const value = match[2].trim();

      switch (key) {
        case 'servicename':
          overview.serviceName = value;
          break;
        case 'framework':
          overview.framework = value;
          break;
        case 'language':
          overview.language = value;
          break;
        case 'analysisdate':
          overview.analysisDate = value;
          break;
        case 'totalendpoints':
          overview.totalEndpoints = parseInt(value) || 0;
          break;
      }
    }

    return overview;
  }

  /**
   * Parse Technology Stack section
   * @param {string} content - Section content
   * @returns {Object} Technology stack data
   */
  parseTechnologyStack(content) {
    const stack = {
      framework: '',
      language: '',
      dependencies: 0,
      externalApis: 0,
      packages: []
    };

    // Extract framework, language, dependencies count
    const keyValueRegex = /[-*]\s*\*\*([^*]+)\*\*[:\s]*(.+)/g;
    let match;

    while ((match = keyValueRegex.exec(content)) !== null) {
      const key = match[1].trim().toLowerCase().replace(/\s+/g, '');
      const value = match[2].trim();

      switch (key) {
        case 'framework':
          stack.framework = value;
          break;
        case 'language':
          stack.language = value;
          break;
        case 'dependencies':
          stack.dependencies = parseInt(value.match(/\d+/)?.[0]) || 0;
          break;
        case 'externalapis':
          stack.externalApis = parseInt(value.match(/\d+/)?.[0]) || 0;
          break;
      }
    }

    return stack;
  }

  /**
   * Parse API Endpoints section
   * @param {string} content - Section content
   * @returns {Array} Array of endpoint objects
   */
  parseApiEndpoints(content) {
    const endpoints = [];
    const sections = content.split(/###\s+(GET|POST|PUT|DELETE|PATCH)\s+(.+)/);

    for (let i = 1; i < sections.length; i += 3) {
      const method = sections[i].trim();
      const path = sections[i + 1].trim();
      const details = sections[i + 2] ? sections[i + 2].trim() : '';

      const endpoint = {
        method: method.toUpperCase(),
        path: path,
        description: '',
        function: '',
        file: '',
        parameters: [],
        responses: []
      };

      // Parse endpoint details
      const detailLines = details.split('\n');
      for (const line of detailLines) {
        if (line.includes('**Function**')) {
          endpoint.function = line.split('**Function**')[1]?.replace(/[:\s`]/g, '').trim() || '';
        } else if (line.includes('**File**')) {
          endpoint.file = line.split('**File**')[1]?.replace(/[:\s`]/g, '').trim() || '';
        } else if (line.includes('**Description**')) {
          endpoint.description = line.split('**Description**')[1]?.replace(/[:]/g, '').trim() || '';
        }
      }

      endpoints.push(endpoint);
    }

    return endpoints;
  }

  /**
   * Parse Data Schemas section
   * @param {string} content - Section content
   * @returns {Array} Array of schema objects
   */
  parseDataSchemas(content) {
    const schemas = [];
    const schemaSections = content.split(/###\s+(\w+)/);

    for (let i = 1; i < schemaSections.length; i += 2) {
      const schemaName = schemaSections[i].trim();
      const schemaContent = schemaSections[i + 1] ? schemaSections[i + 1].trim() : '';

      const schema = {
        name: schemaName,
        file: '',
        fields: []
      };

      // Extract file path
      const fileMatch = schemaContent.match(/\*\*File\*\*[:\s]*`?([^`\n]+)`?/);
      if (fileMatch) {
        schema.file = fileMatch[1].trim();
      }

      // Extract fields
      const fieldRegex = /[-*]\s*\*\*([^*]+)\*\*\s*\(`([^)]+)`\)(?:\s*-\s*(.+))?/g;
      let fieldMatch;

      while ((fieldMatch = fieldRegex.exec(schemaContent)) !== null) {
        schema.fields.push({
          name: fieldMatch[1].trim(),
          type: fieldMatch[2].trim(),
          description: fieldMatch[3] ? fieldMatch[3].trim() : ''
        });
      }

      schemas.push(schema);
    }

    return schemas;
  }

  /**
   * Parse External Dependencies section
   * @param {string} content - Section content
   * @returns {Array} Array of dependency objects
   */
  parseExternalDependencies(content) {
    const dependencies = [];
    
    // Look for package lists (- **package** (version))
    const depRegex = /[-*]\s*\*\*([^*]+)\*\*\s*\(([^)]+)\)/g;
    let match;

    while ((match = depRegex.exec(content)) !== null) {
      dependencies.push({
        name: match[1].trim(),
        version: match[2].trim(),
        type: this.inferDependencyType(content, match[1])
      });
    }

    return dependencies;
  }

  /**
   * Infer dependency type from context
   * @param {string} content - Full section content
   * @param {string} packageName - Package name
   * @returns {string} Dependency type
   */
  inferDependencyType(content, packageName) {
    const section = content.toLowerCase();
    
    if (section.includes('python packages') || section.includes('pip')) {
      return 'python';
    } else if (section.includes('npm packages') || section.includes('node')) {
      return 'javascript';
    } else if (packageName.startsWith('@')) {
      return 'javascript';
    } else {
      return 'unknown';
    }
  }

  /**
   * Extract frameworks from technology stack
   * @param {Object} techStack - Technology stack object
   * @returns {Array} Array of frameworks
   */
  extractFrameworks(techStack) {
    const frameworks = [];
    if (techStack.framework) {
      frameworks.push(techStack.framework);
    }
    return frameworks;
  }

  /**
   * Extract languages from technology stack
   * @param {Object} techStack - Technology stack object
   * @returns {Array} Array of languages
   */
  extractLanguages(techStack) {
    const languages = [];
    if (techStack.language) {
      // Handle multiple languages (e.g., "JavaScript/TypeScript")
      const langs = techStack.language.split(/[\/,]/).map(l => l.trim());
      languages.push(...langs);
    }
    return languages;
  }

  /**
   * Parse multiple markdown files in a directory
   * @param {string} directoryPath - Directory containing markdown files
   * @returns {Promise<Array>} Array of parsed service data
   */
  async parseDirectory(directoryPath) {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      
      const files = await fs.readdir(directoryPath);
      const results = [];

      for (const file of files) {
        if (file === 'api-inventory.md') {
          const filePath = path.join(directoryPath, file);
          const parsed = await this.parseApiInventory(filePath);
          results.push(parsed);
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Directory parsing failed: ${error.message}`);
    }
  }
}

module.exports = MarkdownParser;

// CLI execution
if (require.main === module) {
  const parser = new MarkdownParser();
  const testFile = process.argv[2] || './analysis/obk-parking-trunk/api-inventory.md';
  
  console.log(`Parsing file: ${testFile}`);
  parser.parseApiInventory(testFile)
    .then(result => {
      console.log('\n=== Markdown Parse Results ===');
      console.log('Service:', result.serviceName);
      console.log('Framework:', result.technologyStack.framework);
      console.log('Language:', result.technologyStack.language);
      console.log('Endpoints:', result.metadata.totalEndpoints);
      console.log('Schemas:', result.metadata.totalSchemas);
      
      if (result.endpoints.length > 0) {
        console.log('\nSample endpoint:');
        console.log(`  ${result.endpoints[0].method} ${result.endpoints[0].path}`);
      }
      
      console.log('\nFull structure available in result object');
    })
    .catch(error => {
      console.error('Parsing failed:', error.message);
      process.exit(1);
    });
} 