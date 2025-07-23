#!/usr/bin/env node

const DirectoryScanner = require('./directory-scanner');
const MarkdownParser = require('./markdown-parser');
const JsonParser = require('./json-parser');
const YamlParser = require('./yaml-parser');
const { DataModelFactory } = require('./data-models');
const ErrorHandler = require('./error-handler');
const Logger = require('./logger');

/**
 * API Analysis Engine
 * Main engine for extracting and analyzing API endpoints from service data
 */
class ApiAnalyzer {
  constructor(options = {}) {
    this.options = {
      analysisDirectory: options.analysisDirectory || './analysis',
      outputDirectory: options.outputDirectory || './output',
      logLevel: options.logLevel || 'info',
      includeFrameworks: options.includeFrameworks || [],
      excludeServices: options.excludeServices || [],
      ...options
    };

    this.logger = new Logger({
      logLevel: this.options.logLevel,
      logDirectory: './logs',
      sessionId: `analysis-${Date.now()}`
    });

    this.errorHandler = new ErrorHandler({
      logLevel: this.options.logLevel,
      throwOnCritical: false
    });

    // Initialize parsers
    this.parsers = {
      markdown: new MarkdownParser(),
      json: new JsonParser(),
      yaml: new YamlParser()
    };

    this.scanner = new DirectoryScanner(this.options.analysisDirectory);

    // Analysis results
    this.services = new Map();
    this.endpoints = new Map();
    this.analysisResults = {
      totalServices: 0,
      processedServices: 0,
      totalEndpoints: 0,
      uniqueEndpoints: 0,
      frameworks: new Set(),
      languages: new Set(),
      errors: [],
      warnings: []
    };
  }

  /**
   * Run complete API analysis
   * @returns {Promise<Object>} Analysis results
   */
  async analyze() {
    this.logger.info('Starting API analysis', 'analyzer');
    
    try {
      // Step 1: Discover services
      await this.discoverServices();
      
      // Step 2: Process each service
      await this.processServices();
      
      // Step 3: Extract and analyze endpoints
      await this.extractEndpoints();
      
      // Step 4: Generate analysis summary
      const summary = this.generateSummary();
      
      this.logger.info('API analysis completed successfully', 'analyzer', {
        services: this.analysisResults.processedServices,
        endpoints: this.analysisResults.totalEndpoints
      });

      return summary;

    } catch (error) {
      this.errorHandler.handleError(error, 'analyzer', 'error');
      throw error;
    } finally {
      await this.logger.endSession();
    }
  }

  /**
   * Discover all services in the analysis directory
   * @returns {Promise<void>}
   */
  async discoverServices() {
    this.logger.info('Discovering services', 'discovery');
    
    try {
      const discoveredServices = await this.scanner.discoverServices();
      this.analysisResults.totalServices = discoveredServices.length;
      this.logger.setTotalServices(discoveredServices.length);

      // Filter services based on options
      const filteredServices = discoveredServices.filter(service => {
        // Exclude services in excludeServices list
        if (this.options.excludeServices.includes(service.name)) {
          this.logger.skipService(service.name, 'Excluded by configuration');
          return false;
        }

        // Check if service has required files
        if (!service.isComplete) {
          this.logger.warn(`Service ${service.name} is incomplete`, 'discovery', {
            missingFiles: service.missingFiles
          });
        }

        return true;
      });

      this.logger.info(`Discovered ${filteredServices.length} services for analysis`, 'discovery');
      
      // Store services for processing
      filteredServices.forEach(service => {
        this.services.set(service.name, {
          ...service,
          analysisData: null,
          processed: false
        });
      });

    } catch (error) {
      this.errorHandler.handleError(error, 'discovery', 'error');
      throw error;
    }
  }

  /**
   * Process each discovered service
   * @returns {Promise<void>}
   */
  async processServices() {
    this.logger.info('Processing services', 'processing');

    for (const [serviceName, serviceInfo] of this.services) {
      await this.processService(serviceName, serviceInfo);
    }
  }

  /**
   * Process a single service
   * @param {string} serviceName - Name of the service
   * @param {Object} serviceInfo - Service information
   * @returns {Promise<void>}
   */
  async processService(serviceName, serviceInfo) {
    this.logger.startService(serviceName, { 
      path: serviceInfo.path,
      hasFiles: Object.keys(serviceInfo.files).length
    });

    try {
      const parsedData = {
        markdown: null,
        json: null,
        yaml: null
      };

      // Parse markdown file (api-inventory.md)
      if (serviceInfo.files['api-inventory.md']?.exists) {
        try {
          const startTime = Date.now();
          parsedData.markdown = await this.parsers.markdown.parseApiInventory(
            serviceInfo.files['api-inventory.md'].path
          );
          this.logger.performance('markdown-parsing', Date.now() - startTime, { service: serviceName });
          this.logger.serviceStep(serviceName, 'parse-markdown', { 
            endpoints: parsedData.markdown.endpoints?.length || 0,
            schemas: parsedData.markdown.schemas?.length || 0
          });
        } catch (error) {
          this.errorHandler.handleError(error, `${serviceName}-markdown`, 'error');
          this.logger.serviceStep(serviceName, 'parse-markdown', { error: error.message });
        }
      }

      // Parse JSON file (dependency-map.json)
      if (serviceInfo.files['dependency-map.json']?.exists) {
        try {
          const startTime = Date.now();
          parsedData.json = await this.parsers.json.parseDependencyMap(
            serviceInfo.files['dependency-map.json'].path
          );
          this.logger.performance('json-parsing', Date.now() - startTime, { service: serviceName });
          this.logger.serviceStep(serviceName, 'parse-json', {
            endpoints: parsedData.json.apiInventory?.endpoints?.length || 0,
            dependencies: parsedData.json.metadata?.totalDependencies || 0
          });
        } catch (error) {
          this.errorHandler.handleError(error, `${serviceName}-json`, 'error');
          this.logger.serviceStep(serviceName, 'parse-json', { error: error.message });
        }
      }

      // Parse YAML file (openapi.yaml)
      if (serviceInfo.files['openapi.yaml']?.exists) {
        try {
          const startTime = Date.now();
          parsedData.yaml = await this.parsers.yaml.parseOpenApiYaml(
            serviceInfo.files['openapi.yaml'].path
          );
          this.logger.performance('yaml-parsing', Date.now() - startTime, { service: serviceName });
          this.logger.serviceStep(serviceName, 'parse-yaml', {
            paths: parsedData.yaml.metadata?.totalPaths || 0,
            operations: parsedData.yaml.metadata?.totalOperations || 0
          });
        } catch (error) {
          this.errorHandler.handleError(error, `${serviceName}-yaml`, 'error');
          this.logger.serviceStep(serviceName, 'parse-yaml', { error: error.message });
        }
      }

      // Create unified service analysis model
      const models = [];
      if (parsedData.markdown) models.push(DataModelFactory.createServiceAnalysis(parsedData.markdown, 'markdown'));
      if (parsedData.json) models.push(DataModelFactory.createServiceAnalysis(parsedData.json, 'json'));
      if (parsedData.yaml) models.push(DataModelFactory.createServiceAnalysis(parsedData.yaml, 'yaml'));

      let unifiedModel = null;
      if (models.length > 0) {
        unifiedModel = models.length === 1 ? models[0] : DataModelFactory.mergeServiceAnalyses(models);
        this.logger.serviceStep(serviceName, 'create-model', {
          sources: models.length,
          endpoints: unifiedModel.endpoints.length,
          isValid: unifiedModel.validation.isValid
        });
      }

      // Store analysis data
      serviceInfo.analysisData = {
        raw: parsedData,
        unified: unifiedModel,
        processedAt: new Date().toISOString()
      };
      serviceInfo.processed = true;

      // Update global tracking
      if (unifiedModel) {
        this.analysisResults.frameworks.add(unifiedModel.service.framework);
        this.analysisResults.languages.add(unifiedModel.service.language);
      }

      this.analysisResults.processedServices++;
      this.logger.completeService(serviceName, { success: true });

    } catch (error) {
      this.errorHandler.handleError(error, serviceName, 'error');
      this.logger.completeService(serviceName, { success: false, error: error.message });
      this.analysisResults.errors.push({
        service: serviceName,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Extract endpoints from all processed services
   * @returns {Promise<void>}
   */
  async extractEndpoints() {
    this.logger.info('Extracting endpoints from processed services', 'extraction');

    const startTime = Date.now();
    let totalEndpoints = 0;
    const endpointSignatures = new Set();

    for (const [serviceName, serviceInfo] of this.services) {
      if (!serviceInfo.processed || !serviceInfo.analysisData?.unified) {
        continue;
      }

      const service = serviceInfo.analysisData.unified;
      
      // Extract endpoints with service context
      service.endpoints.forEach(endpoint => {
        const endpointData = {
          id: `${serviceName}_${endpoint.id}`,
          serviceName,
          serviceFramework: service.service.framework,
          serviceLanguage: service.service.language,
          ...endpoint,
          extractedAt: new Date().toISOString()
        };

        // Store endpoint
        this.endpoints.set(endpointData.id, endpointData);
        
        // Track unique signatures
        const signature = endpoint.getSignature();
        endpointSignatures.add(signature);
        
        totalEndpoints++;
      });

      this.logger.debug(`Extracted ${service.endpoints.length} endpoints from ${serviceName}`, 'extraction');
    }

    this.analysisResults.totalEndpoints = totalEndpoints;
    this.analysisResults.uniqueEndpoints = endpointSignatures.size;

    this.logger.performance('endpoint-extraction', Date.now() - startTime);
    this.logger.info(`Extracted ${totalEndpoints} endpoints (${endpointSignatures.size} unique signatures)`, 'extraction');
  }

  /**
   * Get endpoint by ID
   * @param {string} endpointId - Endpoint ID
   * @returns {Object|null} Endpoint data
   */
  getEndpoint(endpointId) {
    return this.endpoints.get(endpointId) || null;
  }

  /**
   * Get all endpoints for a service
   * @param {string} serviceName - Service name
   * @returns {Array} Array of endpoints
   */
  getServiceEndpoints(serviceName) {
    const endpoints = [];
    for (const [endpointId, endpoint] of this.endpoints) {
      if (endpoint.serviceName === serviceName) {
        endpoints.push(endpoint);
      }
    }
    return endpoints;
  }

  /**
   * Get endpoints by HTTP method
   * @param {string} method - HTTP method (GET, POST, etc.)
   * @returns {Array} Array of endpoints
   */
  getEndpointsByMethod(method) {
    const endpoints = [];
    for (const [endpointId, endpoint] of this.endpoints) {
      if (endpoint.method === method.toUpperCase()) {
        endpoints.push(endpoint);
      }
    }
    return endpoints;
  }

  /**
   * Search endpoints by path pattern
   * @param {string|RegExp} pattern - Path pattern to search
   * @returns {Array} Array of matching endpoints
   */
  searchEndpoints(pattern) {
    const endpoints = [];
    const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i');
    
    for (const [endpointId, endpoint] of this.endpoints) {
      if (regex.test(endpoint.path) || regex.test(endpoint.description)) {
        endpoints.push(endpoint);
      }
    }
    return endpoints;
  }

  /**
   * Get framework statistics
   * @returns {Object} Framework usage statistics
   */
  getFrameworkStats() {
    const stats = {};
    for (const [serviceName, serviceInfo] of this.services) {
      if (serviceInfo.analysisData?.unified) {
        const framework = serviceInfo.analysisData.unified.service.framework;
        if (framework) {
          stats[framework] = (stats[framework] || 0) + 1;
        }
      }
    }
    return stats;
  }

  /**
   * Get endpoint complexity analysis
   * @returns {Object} Complexity statistics
   */
  getComplexityAnalysis() {
    const complexityStats = {
      low: 0,      // 1-3
      medium: 0,   // 4-6
      high: 0,     // 7-10
      total: 0,
      average: 0
    };

    let totalComplexity = 0;
    
    for (const [endpointId, endpoint] of this.endpoints) {
      const complexity = endpoint.complexity || 1;
      totalComplexity += complexity;
      
      if (complexity <= 3) complexityStats.low++;
      else if (complexity <= 6) complexityStats.medium++;
      else complexityStats.high++;
      
      complexityStats.total++;
    }

    complexityStats.average = complexityStats.total > 0 
      ? Math.round((totalComplexity / complexityStats.total) * 100) / 100 
      : 0;

    return complexityStats;
  }

  /**
   * Generate analysis summary
   * @returns {Object} Complete analysis summary
   */
  generateSummary() {
    const summary = {
      metadata: {
        analyzedAt: new Date().toISOString(),
        analysisDirectory: this.options.analysisDirectory,
        sessionId: this.logger.session.id
      },
      services: {
        total: this.analysisResults.totalServices,
        processed: this.analysisResults.processedServices,
        failed: this.analysisResults.errors.length,
        frameworks: Array.from(this.analysisResults.frameworks),
        languages: Array.from(this.analysisResults.languages)
      },
      endpoints: {
        total: this.analysisResults.totalEndpoints,
        unique: this.analysisResults.uniqueEndpoints,
        byMethod: this.getMethodDistribution(),
        complexity: this.getComplexityAnalysis()
      },
      frameworks: this.getFrameworkStats(),
      errors: this.analysisResults.errors,
      warnings: this.analysisResults.warnings,
      performance: this.logger.getProgress().performance
    };

    return summary;
  }

  /**
   * Get HTTP method distribution
   * @returns {Object} Method distribution statistics
   */
  getMethodDistribution() {
    const distribution = {};
    for (const [endpointId, endpoint] of this.endpoints) {
      const method = endpoint.method;
      distribution[method] = (distribution[method] || 0) + 1;
    }
    return distribution;
  }

  /**
   * Export endpoints to JSON
   * @param {string} outputPath - Output file path
   * @returns {Promise<void>}
   */
  async exportEndpoints(outputPath) {
    const fs = require('fs').promises;
    const path = require('path');
    
    const endpointsArray = Array.from(this.endpoints.values());
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        totalEndpoints: endpointsArray.length,
        version: '1.0.0'
      },
      endpoints: endpointsArray
    };

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(exportData, null, 2));
    
    this.logger.info(`Exported ${endpointsArray.length} endpoints to ${outputPath}`, 'export');
  }

  /**
   * Export analysis summary
   * @param {string} outputPath - Output file path
   * @returns {Promise<void>}
   */
  async exportSummary(outputPath) {
    const fs = require('fs').promises;
    const path = require('path');
    
    const summary = this.generateSummary();
    
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(summary, null, 2));
    
    this.logger.info(`Exported analysis summary to ${outputPath}`, 'export');
  }
}

module.exports = ApiAnalyzer;

// CLI execution
if (require.main === module) {
  const analyzer = new ApiAnalyzer({
    analysisDirectory: process.argv[2] || './analysis',
    logLevel: 'info'
  });
  
  analyzer.analyze()
    .then(summary => {
      console.log('\n=== API Analysis Complete ===');
      console.log(`Services: ${summary.services.processed}/${summary.services.total}`);
      console.log(`Endpoints: ${summary.endpoints.total} (${summary.endpoints.unique} unique)`);
      console.log(`Frameworks: ${summary.services.frameworks.join(', ')}`);
      console.log(`Languages: ${summary.services.languages.join(', ')}`);
      
      if (summary.errors.length > 0) {
        console.log(`\nErrors: ${summary.errors.length}`);
        summary.errors.forEach(error => {
          console.log(`  - ${error.service}: ${error.error}`);
        });
      }
      
      // Export results
      return Promise.all([
        analyzer.exportEndpoints('./output/endpoints.json'),
        analyzer.exportSummary('./output/analysis-summary.json')
      ]);
    })
    .then(() => {
      console.log('\nResults exported to ./output/');
      process.exit(0);
    })
    .catch(error => {
      console.error('Analysis failed:', error.message);
      process.exit(1);
    });
} 