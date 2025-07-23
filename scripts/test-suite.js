const fs = require('fs').promises;
const path = require('path');

// Import modules to test
const DirectoryScanner = require('./directory-scanner');
const FileTypeDetector = require('./file-type-detector');
const MarkdownParser = require('./markdown-parser');
const JsonParser = require('./json-parser');
const YamlParser = require('./yaml-parser');
const { ServiceModel, EndpointModel, SchemaModel, DependencyModel, ServiceAnalysisModel, DataModelFactory } = require('./data-models');
const ErrorHandler = require('./error-handler');
const Logger = require('./logger');

/**
 * Comprehensive Test Suite for API Analysis System
 * Tests all parsing functionality and error handling
 */
class TestSuite {
  constructor() {
    this.tests = [];
    this.results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      errors: []
    };
    this.testData = this.createTestData();
  }

  /**
   * Create test data for various scenarios
   */
  createTestData() {
    return {
      // Test markdown content
      validMarkdown: `# API Inventory: test-service

## Service Overview

- **Service Name**: test-service
- **Framework**: Express.js ^4.1.5
- **Language**: JavaScript/TypeScript
- **Analysis Date**: 7/23/2025
- **Total Endpoints**: 2

## Technology Stack

- **Framework**: Express.js ^4.1.5
- **Language**: JavaScript/TypeScript
- **Dependencies**: 10 packages
- **External APIs**: 1

## API Endpoints

### GET /api/users

- **Method**: GET
- **Path**: /api/users
- **Function**: getUsers
- **File**: src/controllers/users.ts
- **Description**: Get all users

### POST /api/users

- **Method**: POST
- **Path**: /api/users
- **Function**: createUser
- **File**: src/controllers/users.ts
- **Description**: Create new user

## Data Schemas

### User

**File**: src/models/user.ts

#### Fields
- **id** (\`string\`) - User ID
- **name** (\`string\`) - User name
- **email** (\`string\`) - User email

## External Dependencies

### Python Packages
- **express** (^4.1.5)
- **typescript** (^4.0.0)`,

      // Test JSON content
      validJson: {
        service: {
          name: 'test-service',
          framework: 'Express.js',
          language: 'JavaScript/TypeScript',
          analyzed_at: '2025-01-23T10:00:00Z'
        },
        api_inventory: {
          endpoints: [
            {
              method: 'GET',
              path: '/api/users',
              file: 'src/controllers/users.ts',
              description: 'Get all users'
            },
            {
              method: 'POST',
              path: '/api/users',
              file: 'src/controllers/users.ts',
              description: 'Create user'
            }
          ],
          schemas: [
            {
              name: 'User',
              type: 'typescript_interface',
              file: 'src/models/user.ts',
              fields: [
                { name: 'id', type: 'string' },
                { name: 'name', type: 'string' },
                { name: 'email', type: 'string' }
              ]
            }
          ]
        },
        dependencies: {
          packages: {
            express: '^4.1.5',
            typescript: '^4.0.0'
          }
        }
      },

      // Test YAML content
      validYaml: `openapi: 3.0.0
info:
  title: Test API
  description: Test API for validation
  version: 1.0.0
paths:
  /api/users:
    get:
      summary: Get users
      description: Retrieve all users
      responses:
        '200':
          description: Success
    post:
      summary: Create user
      description: Create a new user
      responses:
        '201':
          description: Created
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        email:
          type: string`,

      // Invalid content for error testing
      invalidJson: '{ "invalid": json content }',
      invalidYaml: 'invalid:\n  - yaml\n    content\n  - with: bad indentation',
      emptyMarkdown: '# Empty\n\nNo content here.',

      // Service test data
      serviceData: {
        name: 'test-service',
        framework: 'Express.js',
        language: 'JavaScript',
        version: '1.0.0'
      },

      // Endpoint test data
      endpointData: {
        method: 'GET',
        path: '/api/test',
        description: 'Test endpoint',
        parameters: [
          { name: 'id', type: 'string', required: true }
        ],
        responses: [
          { statusCode: '200', description: 'Success' }
        ]
      }
    };
  }

  /**
   * Add a test to the suite
   * @param {string} name - Test name
   * @param {Function} testFunction - Test function
   * @param {string} category - Test category
   */
  addTest(name, testFunction, category = 'general') {
    this.tests.push({
      name,
      function: testFunction,
      category,
      status: 'pending'
    });
  }

  /**
   * Run all tests
   */
  async runAll() {
    console.log('🧪 Starting comprehensive test suite...\n');
    
    // Setup test categories
    this.setupDirectoryScannerTests();
    this.setupFileTypeDetectorTests();
    this.setupMarkdownParserTests();
    this.setupJsonParserTests();
    this.setupYamlParserTests();
    this.setupDataModelTests();
    this.setupErrorHandlerTests();
    this.setupLoggerTests();
    this.setupIntegrationTests();

    // Create temporary test directory
    await this.setupTestEnvironment();

    try {
      // Run tests by category
      const categories = [...new Set(this.tests.map(t => t.category))];
      
      for (const category of categories) {
        console.log(`\n📂 Running ${category} tests:`);
        const categoryTests = this.tests.filter(t => t.category === category);
        
        for (const test of categoryTests) {
          await this.runTest(test);
        }
      }
    } finally {
      // Cleanup test environment
      await this.cleanupTestEnvironment();
    }

    this.printResults();
  }

  /**
   * Run a single test
   * @param {Object} test - Test object
   */
  async runTest(test) {
    try {
      test.status = 'running';
      const startTime = Date.now();
      
      await test.function();
      
      const duration = Date.now() - startTime;
      test.status = 'passed';
      test.duration = duration;
      this.results.passed++;
      
      console.log(`  ✅ ${test.name} (${duration}ms)`);
    } catch (error) {
      test.status = 'failed';
      test.error = error;
      this.results.failed++;
      this.results.errors.push({ test: test.name, error: error.message });
      
      console.log(`  ❌ ${test.name}: ${error.message}`);
    }
  }

  /**
   * Setup test environment
   */
  async setupTestEnvironment() {
    try {
      await fs.mkdir('./test-data', { recursive: true });
      await fs.mkdir('./test-data/test-service', { recursive: true });
      
      // Create test files
      await fs.writeFile('./test-data/test-service/api-inventory.md', this.testData.validMarkdown);
      await fs.writeFile('./test-data/test-service/dependency-map.json', JSON.stringify(this.testData.validJson, null, 2));
      await fs.writeFile('./test-data/test-service/openapi.yaml', this.testData.validYaml);
      
      // Create invalid files for error testing
      await fs.writeFile('./test-data/test-service/invalid.json', this.testData.invalidJson);
      await fs.writeFile('./test-data/test-service/invalid.yaml', this.testData.invalidYaml);
      
    } catch (error) {
      console.error('Failed to setup test environment:', error.message);
    }
  }

  /**
   * Cleanup test environment
   */
  async cleanupTestEnvironment() {
    try {
      await fs.rmdir('./test-data', { recursive: true });
      await fs.rmdir('./test-logs', { recursive: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  /**
   * Setup Directory Scanner tests
   */
  setupDirectoryScannerTests() {
    this.addTest('Directory Scanner - Discover Services', async () => {
      const scanner = new DirectoryScanner('./test-data');
      const services = await scanner.discoverServices();
      
      this.assert(services.length > 0, 'Should discover at least one service');
      this.assert(services[0].name === 'test-service', 'Should find test-service');
      this.assert(services[0].isComplete === true, 'Service should be complete');
    }, 'DirectoryScanner');

    this.addTest('Directory Scanner - Generate Report', async () => {
      const scanner = new DirectoryScanner('./test-data');
      const report = await scanner.generateReport();
      
      this.assert(report.summary.total > 0, 'Report should show services');
      this.assert(report.summary.complete > 0, 'Report should show complete services');
      this.assert(Array.isArray(report.services), 'Report should contain services array');
    }, 'DirectoryScanner');
  }

  /**
   * Setup File Type Detector tests
   */
  setupFileTypeDetectorTests() {
    this.addTest('File Type Detector - Detect Markdown', async () => {
      const detector = new FileTypeDetector();
      const result = await detector.detectFileType('./test-data/test-service/api-inventory.md');
      
      this.assert(result.detectedType === 'markdown', 'Should detect markdown type');
      this.assert(result.isValid === true, 'Should validate as valid markdown');
      this.assert(result.metadata.hasEndpoints === true, 'Should detect endpoints');
    }, 'FileTypeDetector');

    this.addTest('File Type Detector - Detect JSON', async () => {
      const detector = new FileTypeDetector();
      const result = await detector.detectFileType('./test-data/test-service/dependency-map.json');
      
      this.assert(result.detectedType === 'json', 'Should detect JSON type');
      this.assert(result.isValid === true, 'Should validate as valid JSON');
      this.assert(result.metadata.hasService === true, 'Should detect service info');
    }, 'FileTypeDetector');

    this.addTest('File Type Detector - Invalid File', async () => {
      const detector = new FileTypeDetector();
      const result = await detector.detectFileType('./test-data/test-service/invalid.json');
      
      this.assert(result.detectedType === 'json', 'Should detect JSON type');
      this.assert(result.isValid === false, 'Should mark as invalid');
      this.assert(result.errors.length > 0, 'Should have errors');
    }, 'FileTypeDetector');
  }

  /**
   * Setup Markdown Parser tests
   */
  setupMarkdownParserTests() {
    this.addTest('Markdown Parser - Parse Valid Content', async () => {
      const parser = new MarkdownParser();
      const result = parser.parseMarkdownContent(this.testData.validMarkdown, 'test-file.md');
      
      this.assert(result.serviceName === 'test-service', 'Should extract service name');
      this.assert(result.endpoints.length === 2, 'Should find 2 endpoints');
      this.assert(result.schemas.length === 1, 'Should find 1 schema');
      this.assert(result.metadata.totalEndpoints === 2, 'Metadata should match endpoints');
    }, 'MarkdownParser');

    this.addTest('Markdown Parser - Extract Endpoints', async () => {
      const parser = new MarkdownParser();
      const result = parser.parseMarkdownContent(this.testData.validMarkdown, 'test-file.md');
      
      const getEndpoint = result.endpoints.find(ep => ep.method === 'GET');
      this.assert(getEndpoint !== undefined, 'Should find GET endpoint');
      this.assert(getEndpoint.path === '/api/users', 'Should extract correct path');
      this.assert(getEndpoint.function === 'getUsers', 'Should extract function name');
    }, 'MarkdownParser');

    this.addTest('Markdown Parser - Extract Schemas', async () => {
      const parser = new MarkdownParser();
      const result = parser.parseMarkdownContent(this.testData.validMarkdown, 'test-file.md');
      
      const userSchema = result.schemas.find(s => s.name === 'User');
      this.assert(userSchema !== undefined, 'Should find User schema');
      this.assert(userSchema.fields.length === 3, 'Should find 3 fields');
      this.assert(userSchema.file.includes('user.ts'), 'Should extract file path');
    }, 'MarkdownParser');
  }

  /**
   * Setup JSON Parser tests
   */
  setupJsonParserTests() {
    this.addTest('JSON Parser - Parse Valid Content', async () => {
      const parser = new JsonParser();
      const result = parser.parseJsonContent(this.testData.validJson, 'test-file.json');
      
      this.assert(result.service.name === 'test-service', 'Should extract service name');
      this.assert(result.apiInventory.endpoints.length === 2, 'Should find 2 endpoints');
      this.assert(result.metadata.totalEndpoints === 2, 'Metadata should match');
    }, 'JsonParser');

    this.addTest('JSON Parser - Extract Dependencies', async () => {
      const parser = new JsonParser();
      const result = parser.parseJsonContent(this.testData.validJson, 'test-file.json');
      
      this.assert(result.dependencies.packages.length === 2, 'Should find 2 packages');
      const express = result.dependencies.packages.find(p => p.name === 'express');
      this.assert(express !== undefined, 'Should find express package');
      this.assert(express.version === '^4.1.5', 'Should extract version');
    }, 'JsonParser');

    this.addTest('JSON Parser - Validate Structure', async () => {
      const parser = new JsonParser();
      const validation = parser.validateStructure(this.testData.validJson);
      
      this.assert(validation.isValid === true, 'Valid JSON should pass validation');
      this.assert(validation.errors.length === 0, 'Should have no errors');
    }, 'JsonParser');
  }

  /**
   * Setup YAML Parser tests
   */
  setupYamlParserTests() {
    this.addTest('YAML Parser - Parse Valid Content', async () => {
      const parser = new YamlParser();
      const result = parser.parseYamlContent(this.testData.validYaml, 'test-file.yaml');
      
      this.assert(result.openapi.version === '3.0.0', 'Should extract OpenAPI version');
      this.assert(result.openapi.title === 'Test API', 'Should extract API title');
      this.assert(result.paths.length > 0, 'Should find paths');
    }, 'YamlParser');

    this.addTest('YAML Parser - Extract Operations', async () => {
      const parser = new YamlParser();
      const result = parser.parseYamlContent(this.testData.validYaml, 'test-file.yaml');
      
      const usersPath = result.paths.find(p => p.path === '/api/users');
      this.assert(usersPath !== undefined, 'Should find /api/users path');
      this.assert(usersPath.operations.length === 2, 'Should find 2 operations');
      
      const getOp = usersPath.operations.find(op => op.method === 'GET');
      this.assert(getOp !== undefined, 'Should find GET operation');
      this.assert(getOp.summary === 'Get users', 'Should extract summary');
    }, 'YamlParser');

    this.addTest('YAML Parser - Validate OpenAPI', async () => {
      const parser = new YamlParser();
      const result = parser.parseYamlContent(this.testData.validYaml, 'test-file.yaml');
      const validation = parser.validateOpenApi(result);
      
      this.assert(validation.isValid === true, 'Valid OpenAPI should pass validation');
      this.assert(validation.errors.length === 0, 'Should have no errors');
    }, 'YamlParser');
  }

  /**
   * Setup Data Model tests
   */
  setupDataModelTests() {
    this.addTest('Service Model - Create and Validate', async () => {
      const service = new ServiceModel(this.testData.serviceData);
      const validation = service.validate();
      
      this.assert(service.name === 'test-service', 'Should set service name');
      this.assert(service.framework === 'Express.js', 'Should set framework');
      this.assert(validation.isValid === true, 'Should be valid');
    }, 'DataModels');

    this.addTest('Endpoint Model - Create and Calculate Complexity', async () => {
      const endpoint = new EndpointModel(this.testData.endpointData);
      
      this.assert(endpoint.method === 'GET', 'Should set method');
      this.assert(endpoint.path === '/api/test', 'Should set path');
      this.assert(endpoint.complexity > 0, 'Should calculate complexity');
      this.assert(endpoint.getSignature() === 'GET /api/test', 'Should generate signature');
    }, 'DataModels');

    this.addTest('Data Model Factory - Create from Markdown', async () => {
      const mockMarkdownData = {
        serviceName: 'test-service',
        technologyStack: { framework: 'Express.js', language: 'JavaScript' },
        endpoints: [this.testData.endpointData],
        schemas: []
      };
      
      const model = DataModelFactory.createServiceAnalysis(mockMarkdownData, 'markdown');
      
      this.assert(model.service.name === 'test-service', 'Should create service');
      this.assert(model.endpoints.length === 1, 'Should create endpoints');
      this.assert(model.validation.isValid === true, 'Should be valid');
    }, 'DataModels');
  }

  /**
   * Setup Error Handler tests
   */
  setupErrorHandlerTests() {
    this.addTest('Error Handler - File Validation', async () => {
      const handler = new ErrorHandler();
      
      // Test existing file
      const validResult = await handler.validateFileAccess('./test-data/test-service/api-inventory.md');
      this.assert(validResult.exists === true, 'Should detect existing file');
      this.assert(validResult.readable === true, 'Should be readable');
      
      // Test non-existing file
      const invalidResult = await handler.validateFileAccess('./non-existent-file.txt');
      this.assert(invalidResult.exists === false, 'Should detect non-existing file');
      this.assert(invalidResult.errors.length > 0, 'Should have errors');
    }, 'ErrorHandler');

    this.addTest('Error Handler - Content Validation', async () => {
      const handler = new ErrorHandler();
      
      const result = await handler.validateFileContent('./test-data/test-service/api-inventory.md', 'markdown');
      this.assert(result.isValid === true, 'Valid markdown should pass');
      this.assert(result.type === 'markdown', 'Should detect type');
    }, 'ErrorHandler');

    this.addTest('Error Handler - Error Tracking', async () => {
      const handler = new ErrorHandler({ throwOnCritical: false });
      
      handler.handleError('Test error', 'test-context', 'error');
      handler.handleError('Test warning', 'test-context', 'warning');
      
      const summary = handler.getSummary();
      this.assert(summary.errors === 1, 'Should track errors');
      this.assert(summary.warnings === 1, 'Should track warnings');
    }, 'ErrorHandler');
  }

  /**
   * Setup Logger tests
   */
  setupLoggerTests() {
    this.addTest('Logger - Basic Logging', async () => {
      const logger = new Logger({ 
        logToFile: false, 
        logToConsole: false,
        logLevel: 'debug' 
      });
      
      logger.info('Test message', 'test');
      logger.warn('Test warning', 'test');
      logger.error('Test error', 'test');
      
      const progress = logger.getProgress();
      this.assert(progress.session.errors === 1, 'Should track errors');
      this.assert(progress.session.warnings === 1, 'Should track warnings');
    }, 'Logger');

    this.addTest('Logger - Service Tracking', async () => {
      const logger = new Logger({ logToFile: false, logToConsole: false });
      
      logger.setTotalServices(2);
      logger.startService('test-service-1');
      logger.serviceStep('test-service-1', 'parsing', { success: true });
      logger.completeService('test-service-1', { success: true });
      
      const progress = logger.getProgress();
      this.assert(progress.session.totalServices === 2, 'Should set total services');
      this.assert(progress.session.processedServices === 1, 'Should track processed services');
      this.assert(progress.services.length === 1, 'Should track service details');
    }, 'Logger');
  }

  /**
   * Setup Integration tests
   */
  setupIntegrationTests() {
    this.addTest('Integration - Full Service Analysis', async () => {
      // Test complete workflow: scan -> parse -> model
      const scanner = new DirectoryScanner('./test-data');
      const services = await scanner.discoverServices();
      
      this.assert(services.length > 0, 'Should find services');
      
      const service = services[0];
      this.assert(service.isComplete === true, 'Service should have all files');
      
      // Parse each file type
      const mdParser = new MarkdownParser();
      const jsonParser = new JsonParser();
      const yamlParser = new YamlParser();
      
      const mdResult = await mdParser.parseApiInventory(service.files['api-inventory.md'].path);
      const jsonResult = await jsonParser.parseDependencyMap(service.files['dependency-map.json'].path);
      const yamlResult = await yamlParser.parseOpenApiYaml(service.files['openapi.yaml'].path);
      
      this.assert(mdResult.serviceName === 'test-service', 'Markdown parsing should work');
      this.assert(jsonResult.service.name === 'test-service', 'JSON parsing should work');
      this.assert(yamlResult.openapi.title === 'Test API', 'YAML parsing should work');
      
      // Create unified model
      const mdModel = DataModelFactory.createServiceAnalysis(mdResult, 'markdown');
      const jsonModel = DataModelFactory.createServiceAnalysis(jsonResult, 'json');
      const yamlModel = DataModelFactory.createServiceAnalysis(yamlResult, 'yaml');
      
      const mergedModel = DataModelFactory.mergeServiceAnalyses([mdModel, jsonModel, yamlModel]);
      
      this.assert(mergedModel.service.name === 'test-service', 'Should merge service info');
      this.assert(mergedModel.endpoints.length >= 2, 'Should merge endpoints');
      this.assert(mergedModel.validation.isValid === true, 'Merged model should be valid');
    }, 'Integration');

    this.addTest('Integration - Error Handling with Logger', async () => {
      const logger = new Logger({ logToFile: false, logToConsole: false });
      const handler = new ErrorHandler({ throwOnCritical: false });
      
      logger.startService('error-test-service');
      
      try {
        // Simulate parsing error
        throw new Error('Simulated parsing error');
      } catch (error) {
        handler.handleError(error, 'parsing', 'error');
        logger.serviceStep('error-test-service', 'parsing', { error: error.message });
        logger.completeService('error-test-service', { success: false });
      }
      
      const progress = logger.getProgress();
      const summary = handler.getSummary();
      
      this.assert(progress.session.errors > 0, 'Logger should track errors');
      this.assert(summary.errors > 0, 'Handler should track errors');
      this.assert(progress.services[0].status === 'failed', 'Service should be marked as failed');
    }, 'Integration');
  }

  /**
   * Assert helper function
   * @param {boolean} condition - Condition to check
   * @param {string} message - Error message if assertion fails
   */
  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  /**
   * Print test results
   */
  printResults() {
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⏭️ Skipped: ${this.results.skipped}`);
    console.log(`📈 Total: ${this.results.passed + this.results.failed + this.results.skipped}`);
    
    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.errors.forEach(error => {
        console.log(`  - ${error.test}: ${error.error}`);
      });
    }
    
    const successRate = ((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1);
    console.log(`\n🎯 Success Rate: ${successRate}%`);
    
    if (this.results.failed === 0) {
      console.log('\n🎉 All tests passed! System is ready for API analysis.');
    } else {
      console.log('\n⚠️ Some tests failed. Please review and fix issues before proceeding.');
    }
  }
}

// Export for use in other modules
module.exports = TestSuite;

// CLI execution
if (require.main === module) {
  const testSuite = new TestSuite();
  testSuite.runAll()
    .then(() => {
      process.exit(testSuite.results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Test suite execution failed:', error.message);
      process.exit(1);
    });
} 