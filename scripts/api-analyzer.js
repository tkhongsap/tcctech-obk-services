#!/usr/bin/env node

const DirectoryScanner = require('./directory-scanner');
const FileParser = require('./file-parser');
const DependencyAnalyzer = require('./dependency-analyzer');
const { ServiceInfo, AnalysisResult } = require('./data-models');
const { logger } = require('./logger');

/**
 * Main API Analyzer
 * Orchestrates the complete analysis process from directory scanning to final results
 */
class APIAnalyzer {
  constructor(options = {}) {
    this.analysisPath = options.analysisPath || 'analysis';
    this.outputPath = options.outputPath || 'output';
    this.logger = logger.forService('APIAnalyzer');
    
    // Initialize components
    this.directoryScanner = new DirectoryScanner(this.analysisPath);
    this.fileParser = new FileParser();
    this.dependencyAnalyzer = new DependencyAnalyzer();
    
    this.results = new AnalysisResult();
  }

  /**
   * Run complete API usage analysis
   * @returns {Promise<AnalysisResult>} Analysis results
   */
  async analyze() {
    const timer = this.logger.startTimer('complete-analysis');
    
    try {
      this.logger.info('Starting API usage analysis', { analysisPath: this.analysisPath });

      // Phase 1: Discovery
      const services = await this.discoverServices();
      this.logger.info('Service discovery completed', { serviceCount: services.length });

      // Phase 2: Parsing
      const parsedServices = await this.parseServices(services);
      this.logger.info('Service parsing completed', { 
        parsedCount: parsedServices.length,
        errorCount: this.results.errors.length
      });

      // Phase 3: Normalization
      const normalizedServices = await this.normalizeServices(parsedServices);
      this.logger.info('Service normalization completed', { 
        normalizedCount: normalizedServices.length 
      });

      // Phase 4: Analysis
      const analysisResults = await this.performAnalysis(normalizedServices);
      this.logger.info('Dependency analysis completed', { 
        totalAPIs: analysisResults.apiFrequency.size,
        crossServiceAPIs: analysisResults.crossServiceAPIs.size
      });

      // Update final results
      this.results.analysis = analysisResults;
      this.results.updateSummary();

      const duration = timer('completed');
      this.logger.info('Complete API analysis finished', { 
        duration: `${duration}ms`,
        services: normalizedServices.length,
        totalAPIs: analysisResults.apiFrequency.size
      });

      return this.results;

    } catch (error) {
      timer('failed');
      this.logger.error('API analysis failed', {}, error);
      throw error;
    }
  }

  /**
   * Discover all services in the analysis directory
   * @returns {Promise<Array>} Array of discovered services
   */
  async discoverServices() {
    this.logger.info('Discovering services in analysis directory');
    
    try {
      const services = await this.directoryScanner.discoverServices();
      
      if (services.length === 0) {
        throw new Error(`No services found in ${this.analysisPath} directory`);
      }

      this.logger.info('Services discovered successfully', {
        count: services.length,
        services: services.map(s => s.name)
      });

      return services;
    } catch (error) {
      this.logger.error('Service discovery failed', {}, error);
      throw error;
    }
  }

  /**
   * Parse all discovered service files
   * @param {Array} services - Services to parse
   * @returns {Promise<Array>} Array of parsed service data
   */
  async parseServices(services) {
    this.logger.info('Starting service file parsing', { serviceCount: services.length });
    
    const parsedServices = [];
    let successCount = 0;
    let errorCount = 0;

    for (const service of services) {
      try {
        const serviceData = await this.parseServiceFiles(service);
        parsedServices.push(serviceData);
        successCount++;
        
        this.logger.debug('Service parsed successfully', { 
          service: service.name,
          filesProcessed: Object.keys(service.files).length
        });
      } catch (error) {
        errorCount++;
        this.results.errors.push({
          service: service.name,
          error: error.message,
          type: 'parsing-error'
        });
        
        this.logger.error('Service parsing failed', { service: service.name }, error);
      }
    }

    this.logger.info('Service parsing completed', { 
      total: services.length,
      successful: successCount,
      errors: errorCount
    });

    return parsedServices;
  }

  /**
   * Parse files for a single service
   * @param {Object} service - Service information from directory scanner
   * @returns {Promise<Object>} Parsed service data
   */
  async parseServiceFiles(service) {
    const serviceLogger = this.logger.forService(service.name);
    const parsedData = {
      serviceName: service.name,
      path: service.path,
      files: {},
      errors: [],
      warnings: []
    };

    // Parse each file type
    for (const [fileName, fileInfo] of Object.entries(service.files)) {
      try {
        serviceLogger.debug('Parsing file', { fileName, size: fileInfo.size });
        
        const parsed = await this.fileParser.parseFile(fileInfo.path, fileName);
        
        if (parsed.type === 'error') {
          parsedData.errors.push(...parsed.errors);
          parsedData.warnings.push(...parsed.warnings);
        } else {
          parsedData.files[fileName] = parsed;
          
          if (parsed.validation && !parsed.validation.isValid) {
            parsedData.errors.push(...parsed.validation.errors);
            parsedData.warnings.push(...parsed.validation.warnings);
          }
        }
      } catch (error) {
        const errorMsg = `Failed to parse ${fileName}: ${error.message}`;
        parsedData.errors.push(errorMsg);
        serviceLogger.error('File parsing failed', { fileName }, error);
      }
    }

    return parsedData;
  }

  /**
   * Normalize parsed service data into ServiceInfo objects
   * @param {Array} parsedServices - Parsed service data
   * @returns {Promise<Array<ServiceInfo>>} Array of normalized ServiceInfo objects
   */
  async normalizeServices(parsedServices) {
    this.logger.info('Normalizing service data', { serviceCount: parsedServices.length });
    
    const normalizedServices = [];

    for (const parsedService of parsedServices) {
      try {
        const serviceInfo = await this.normalizeServiceData(parsedService);
        normalizedServices.push(serviceInfo);
        this.results.addService(serviceInfo);
        
        this.logger.debug('Service normalized', {
          service: serviceInfo.serviceName,
          endpoints: serviceInfo.endpoints.length,
          dependencies: serviceInfo.dependencies.length
        });
      } catch (error) {
        this.results.errors.push({
          service: parsedService.serviceName,
          error: error.message,
          type: 'normalization-error'
        });
        
        this.logger.error('Service normalization failed', { 
          service: parsedService.serviceName 
        }, error);
      }
    }

    this.logger.info('Service normalization completed', { 
      normalizedCount: normalizedServices.length 
    });

    return normalizedServices;
  }

  /**
   * Normalize a single service's parsed data
   * @param {Object} parsedService - Parsed service data
   * @returns {Promise<ServiceInfo>} Normalized ServiceInfo object
   */
  async normalizeServiceData(parsedService) {
    const serviceInfo = new ServiceInfo(parsedService.serviceName, parsedService.path);

    // Process API inventory data
    const apiInventory = parsedService.files['api-inventory.md'];
    if (apiInventory && apiInventory.type === 'api-inventory') {
      serviceInfo.setFramework(apiInventory.framework);
      serviceInfo.metadata = { ...serviceInfo.metadata, ...apiInventory.metadata };
      
      // Add endpoints
      apiInventory.endpoints.forEach(endpoint => {
        serviceInfo.addEndpoint(endpoint);
      });

      // Add dependencies from API inventory
      apiInventory.dependencies.forEach(dependency => {
        serviceInfo.addDependency(dependency);
      });

      // Add external APIs
      apiInventory.externalAPIs.forEach(externalAPI => {
        serviceInfo.addExternalAPI(externalAPI);
      });
    }

    // Process dependency map data
    const dependencyMap = parsedService.files['dependency-map.json'];
    if (dependencyMap && dependencyMap.type === 'dependency-map') {
      // Add or update dependencies from dependency map
      dependencyMap.dependencies.forEach(dependency => {
        serviceInfo.addDependency(dependency);
      });

      // Store consumer information
      if (dependencyMap.consumers) {
        serviceInfo.consumers = dependencyMap.consumers;
      }
    }

    // Process OpenAPI data
    const openAPIFile = parsedService.files['openapi.yaml'] || parsedService.files['openapi.yml'];
    if (openAPIFile && openAPIFile.type === 'openapi') {
      // Add endpoints from OpenAPI spec
      openAPIFile.endpoints.forEach(endpoint => {
        serviceInfo.addEndpoint(endpoint);
      });

      // Update metadata
      serviceInfo.metadata = { 
        ...serviceInfo.metadata, 
        ...openAPIFile.metadata 
      };
    }

    // Set validation results
    serviceInfo.validation.errors = parsedService.errors;
    serviceInfo.validation.warnings = parsedService.warnings;
    serviceInfo.validation.isValid = parsedService.errors.length === 0;

    return serviceInfo;
  }

  /**
   * Perform dependency analysis on normalized services
   * @param {Array<ServiceInfo>} services - Normalized services
   * @returns {Promise<Object>} Analysis results
   */
  async performAnalysis(services) {
    this.logger.info('Starting dependency analysis');
    
    try {
      const analysisResults = this.dependencyAnalyzer.analyzeAPIUsage(services);
      
      this.logger.info('Dependency analysis completed successfully', {
        totalAPIs: analysisResults.apiFrequency.size,
        crossServiceAPIs: analysisResults.crossServiceAPIs.size,
        frameworks: Object.keys(analysisResults.frameworkDistribution).length
      });

      return analysisResults;
    } catch (error) {
      this.logger.error('Dependency analysis failed', {}, error);
      throw error;
    }
  }

  /**
   * Get analysis summary
   * @returns {Object} Summary of analysis results
   */
  getSummary() {
    return {
      timestamp: this.results.timestamp,
      services: {
        total: this.results.summary.totalServices,
        successful: this.results.summary.totalServices - this.results.errors.length,
        errors: this.results.errors.length,
        warnings: this.results.warnings.length
      },
      apis: {
        total: this.results.summary.totalEndpoints,
        crossService: this.results.analysis?.crossServiceAPIs?.size || 0,
        bottlenecks: this.results.analysis?.patterns?.bottleneckAPIs?.length || 0
      },
      frameworks: this.results.summary.frameworks,
      risks: {
        circularDependencies: this.results.analysis?.patterns?.circularDependencies?.length || 0,
        highDependencyServices: this.results.analysis?.patterns?.highDependencyServices?.length || 0,
        unusedServices: this.results.analysis?.patterns?.unusedServices?.length || 0
      }
    };
  }

  /**
   * Export results to JSON
   * @returns {Object} Complete analysis results
   */
  exportResults() {
    return this.results.toJSON();
  }
}

module.exports = APIAnalyzer;

// CLI execution
if (require.main === module) {
  const analyzer = new APIAnalyzer();
  
  analyzer.analyze()
    .then(results => {
      console.log('\n=== API Usage Analysis Complete ===');
      console.log(JSON.stringify(analyzer.getSummary(), null, 2));
      
      // Save results
      const fs = require('fs').promises;
      return fs.writeFile('output/api-usage-analysis.json', JSON.stringify(analyzer.exportResults(), null, 2));
    })
    .then(() => {
      console.log('\nResults saved to output/api-usage-analysis.json');
      process.exit(0);
    })
    .catch(error => {
      console.error('Analysis failed:', error.message);
      process.exit(1);
    });
} 