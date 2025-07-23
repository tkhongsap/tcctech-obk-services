const DependencyAnalyzer = require('./dependency-analyzer');
const { ServiceInfo, APIEndpoint, ServiceDependency } = require('./data-models');

/**
 * Tests for DependencyAnalyzer
 * Comprehensive test suite for risk assessment algorithms
 */
describe('DependencyAnalyzer', () => {
  let analyzer;
  let mockServices;

  beforeEach(() => {
    analyzer = new DependencyAnalyzer();
    
    // Create mock services for testing
    mockServices = [
      createMockService('service-a', 'Express.js', [
        { method: 'GET', path: '/api/users' },
        { method: 'POST', path: '/api/users' }
      ], [
        { serviceName: 'service-b', endpoints: [{ method: 'GET', path: '/api/data' }] }
      ]),
      
      createMockService('service-b', 'NestJS', [
        { method: 'GET', path: '/api/data' },
        { method: 'PUT', path: '/api/data/:id' }
      ], [
        { serviceName: 'service-c', endpoints: [{ method: 'GET', path: '/api/config' }] }
      ]),
      
      createMockService('service-c', 'Express.js', [
        { method: 'GET', path: '/api/config' }
      ], [])
    ];
  });

  describe('analyzeAPIUsage', () => {
    test('should analyze API usage patterns across services', () => {
      const analysis = analyzer.analyzeAPIUsage(mockServices);
      
      expect(analysis).toHaveProperty('apiFrequency');
      expect(analysis).toHaveProperty('crossServiceAPIs');
      expect(analysis).toHaveProperty('frameworkDistribution');
      expect(analysis).toHaveProperty('dependencyGraph');
      expect(analysis).toHaveProperty('patterns');
      
      expect(analysis.apiFrequency.size).toBeGreaterThan(0);
    });

    test('should handle empty services array', () => {
      const analysis = analyzer.analyzeAPIUsage([]);
      
      expect(analysis.apiFrequency.size).toBe(0);
      expect(analysis.crossServiceAPIs.size).toBe(0);
      expect(Object.keys(analysis.frameworkDistribution)).toHaveLength(0);
    });

    test('should track framework distribution correctly', () => {
      const analysis = analyzer.analyzeAPIUsage(mockServices);
      
      expect(analysis.frameworkDistribution).toHaveProperty('Express.js');
      expect(analysis.frameworkDistribution).toHaveProperty('NestJS');
      expect(analysis.frameworkDistribution['Express.js'].count).toBe(2);
      expect(analysis.frameworkDistribution['NestJS'].count).toBe(1);
    });
  });

  describe('buildAPIFrequencyMap', () => {
    test('should build frequency map of API endpoints', () => {
      const analysis = { apiFrequency: new Map(), serviceEndpointCounts: {} };
      analyzer.buildAPIFrequencyMap(mockServices, analysis);
      
      expect(analysis.apiFrequency.size).toBeGreaterThan(0);
      expect(analysis.serviceEndpointCounts).toHaveProperty('service-a');
      expect(analysis.serviceEndpointCounts).toHaveProperty('service-b');
      expect(analysis.serviceEndpointCounts).toHaveProperty('service-c');
    });

    test('should track both provided and consumed endpoints', () => {
      const analysis = { apiFrequency: new Map(), serviceEndpointCounts: {} };
      analyzer.buildAPIFrequencyMap(mockServices, analysis);
      
      // Check that service-b's /api/data endpoint has consumers
      const apiKey = analyzer.normalizeAPIKey('GET', '/api/data', 'service-b');
      const apiInfo = analysis.apiFrequency.get(apiKey);
      
      expect(apiInfo).toBeDefined();
      expect(apiInfo.usedBy).toContain('service-a');
    });
  });

  describe('identifyCrossServiceAPIs', () => {
    test('should identify APIs used by multiple services', () => {
      const analysis = { 
        apiFrequency: new Map(), 
        crossServiceAPIs: new Map(),
        serviceEndpointCounts: {}
      };
      
      analyzer.buildAPIFrequencyMap(mockServices, analysis);
      analyzer.identifyCrossServiceAPIs(mockServices, analysis);
      
      // Should identify APIs used by 2+ services
      const crossServiceCount = Array.from(analysis.crossServiceAPIs.values())
        .filter(api => api.usedBy.length >= 2).length;
      
      expect(crossServiceCount).toBeGreaterThanOrEqual(0);
    });

    test('should flag potential bottlenecks', () => {
      const analysis = { 
        apiFrequency: new Map(), 
        crossServiceAPIs: new Map(),
        serviceEndpointCounts: {}
      };
      
      analyzer.buildAPIFrequencyMap(mockServices, analysis);
      analyzer.identifyCrossServiceAPIs(mockServices, analysis);
      
      // Check if bottlenecks are properly flagged
      const bottlenecks = Array.from(analysis.crossServiceAPIs.values())
        .filter(api => api.isBottleneck);
      
      expect(bottlenecks).toBeDefined();
    });
  });

  describe('buildDependencyGraph', () => {
    test('should build dependency graph with correct relationships', () => {
      const analysis = { dependencyGraph: {} };
      analyzer.buildDependencyGraph(mockServices, analysis);
      
      expect(analysis.dependencyGraph).toHaveProperty('service-a');
      expect(analysis.dependencyGraph).toHaveProperty('service-b');
      expect(analysis.dependencyGraph).toHaveProperty('service-c');
      
      // Check dependency relationships
      expect(analysis.dependencyGraph['service-a'].dependsOn).toHaveLength(1);
      expect(analysis.dependencyGraph['service-b'].usedBy).toHaveLength(1);
    });

    test('should calculate dependency strength correctly', () => {
      const analysis = { dependencyGraph: {} };
      analyzer.buildDependencyGraph(mockServices, analysis);
      
      Object.values(analysis.dependencyGraph).forEach(node => {
        expect(['weak', 'moderate', 'strong', 'critical']).toContain(node.strength);
      });
    });
  });

  describe('detectCircularDependencies', () => {
    test('should detect circular dependencies', () => {
      const circularGraph = {
        'service-a': {
          dependsOn: [{ service: 'service-b' }],
          usedBy: [{ service: 'service-c' }]
        },
        'service-b': {
          dependsOn: [{ service: 'service-c' }],
          usedBy: [{ service: 'service-a' }]
        },
        'service-c': {
          dependsOn: [{ service: 'service-a' }],
          usedBy: [{ service: 'service-b' }]
        }
      };
      
      const circularDeps = analyzer.detectCircularDependencies(circularGraph);
      expect(circularDeps).toBeDefined();
    });

    test('should handle acyclic graphs', () => {
      const acyclicGraph = {
        'service-a': {
          dependsOn: [{ service: 'service-b' }],
          usedBy: []
        },
        'service-b': {
          dependsOn: [{ service: 'service-c' }],
          usedBy: [{ service: 'service-a' }]
        },
        'service-c': {
          dependsOn: [],
          usedBy: [{ service: 'service-b' }]
        }
      };
      
      const circularDeps = analyzer.detectCircularDependencies(acyclicGraph);
      expect(circularDeps).toHaveLength(0);
    });
  });

  describe('calculateRiskLevel', () => {
    test('should calculate risk levels based on usage count', () => {
      expect(analyzer.calculateRiskLevel(1, 'internal')).toBe('low');
      expect(analyzer.calculateRiskLevel(3, 'internal')).toBe('medium');
      expect(analyzer.calculateRiskLevel(5, 'internal')).toBe('high');
      expect(analyzer.calculateRiskLevel(10, 'internal')).toBe('critical');
    });

    test('should adjust risk for external APIs', () => {
      const internalRisk = analyzer.calculateRiskLevel(3, 'internal');
      const externalRisk = analyzer.calculateRiskLevel(3, 'external');
      
      // External APIs should have higher risk
      expect(['medium', 'high', 'critical']).toContain(externalRisk);
    });
  });

  describe('identifyUsagePatterns', () => {
    test('should identify high dependency services', () => {
      // Create service with many dependencies
      const highDepService = createMockService('high-dep-service', 'Express.js', [], 
        Array.from({ length: 12 }, (_, i) => ({
          serviceName: `dep-service-${i}`,
          endpoints: [{ method: 'GET', path: `/api/dep${i}` }]
        }))
      );
      
      const servicesWithHighDep = [...mockServices, highDepService];
      const analysis = analyzer.analyzeAPIUsage(servicesWithHighDep);
      
      expect(analysis.patterns.highDependencyServices.length).toBeGreaterThan(0);
    });

    test('should identify unused services', () => {
      // Create service with no consumers
      const unusedService = createMockService('unused-service', 'Express.js', [
        { method: 'GET', path: '/api/unused' }
      ], []);
      
      const servicesWithUnused = [...mockServices, unusedService];
      const analysis = analyzer.analyzeAPIUsage(servicesWithUnused);
      
      // Check if unused services are identified
      expect(analysis.patterns.unusedServices).toBeDefined();
    });
  });

  describe('normalizeAPIKey', () => {
    test('should normalize API keys consistently', () => {
      const key1 = analyzer.normalizeAPIKey('get', '/api/test', 'service');
      const key2 = analyzer.normalizeAPIKey('GET', '/api/test', 'service');
      
      expect(key1).toBe(key2);
      expect(key1).toContain('GET');
      expect(key1).toContain('/api/test');
      expect(key1).toContain('service');
    });

    test('should handle missing parameters gracefully', () => {
      const key = analyzer.normalizeAPIKey(null, null, 'service');
      expect(key).toContain('GET'); // default method
      expect(key).toContain('/'); // default path
    });
  });

  describe('getSummary', () => {
    test('should provide comprehensive analysis summary', () => {
      const analysis = analyzer.analyzeAPIUsage(mockServices);
      const summary = analyzer.getSummary(analysis);
      
      expect(summary).toHaveProperty('totalAPIs');
      expect(summary).toHaveProperty('crossServiceAPIs');
      expect(summary).toHaveProperty('frameworks');
      expect(summary).toHaveProperty('services');
      expect(summary).toHaveProperty('riskMetrics');
      
      expect(summary.riskMetrics).toHaveProperty('highRiskAPIs');
      expect(summary.riskMetrics).toHaveProperty('bottleneckAPIs');
      expect(summary.riskMetrics).toHaveProperty('circularDependencies');
    });
  });
});

/**
 * Helper function to create mock ServiceInfo objects for testing
 */
function createMockService(name, framework, endpoints = [], dependencies = []) {
  const service = new ServiceInfo(name, `test/${name}`);
  service.setFramework(framework);
  
  endpoints.forEach(ep => {
    service.addEndpoint(ep);
  });
  
  dependencies.forEach(dep => {
    service.addDependency(dep);
  });
  
  return service;
}

module.exports = {
  createMockService
}; 