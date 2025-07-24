#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

/**
 * API Landscape Mapper
 * Generates comprehensive API landscape maps and dependency analysis for team planning
 */
class APILandscapeMapper {
  constructor() {
    this.analysisData = null;
    this.individualServiceData = new Map();
  }

  /**
   * Main execution function
   */
  async run() {
    console.log('🗺️  Starting API Landscape Mapping...');
    
    // Load all analysis data
    await this.loadAnalysisData();
    await this.loadIndividualServiceData();
    
    // Generate all deliverables
    await this.generateAPILandscapeMaster();
    await this.generateServiceDependencyMatrix();
    await this.generateAPIGatewayRoutingMap();
    await this.generateFrameworkConsolidationAnalysis();
    await this.generateCriticalServicesAnalysis();
    await this.generateDependencyNetworkData();
    
    console.log('✅ API Landscape Mapping Complete!');
    console.log('📁 All files saved to analysis-summary/ directory');
  }

  /**
   * Load main analysis data
   */
  async loadAnalysisData() {
    console.log('📊 Loading analysis data...');
    const data = await fs.readFile('output/api-usage-analysis.json', 'utf8');
    this.analysisData = JSON.parse(data);
  }

  /**
   * Load individual service analysis files
   */
  async loadIndividualServiceData() {
    console.log('🔍 Loading individual service data...');
    
    const analysisDir = 'analysis';
    const entries = await fs.readdir(analysisDir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const serviceName = entry.name;
        const analysisFile = path.join(analysisDir, serviceName, `${serviceName}-analysis.json`);
        
        try {
          const data = await fs.readFile(analysisFile, 'utf8');
          this.individualServiceData.set(serviceName, JSON.parse(data));
        } catch (error) {
          console.warn(`⚠️  Could not load ${analysisFile}: ${error.message}`);
        }
      }
    }
    
    console.log(`📦 Loaded ${this.individualServiceData.size} individual service analyses`);
  }

  /**
   * Generate comprehensive API landscape master CSV
   */
  async generateAPILandscapeMaster() {
    console.log('🏗️  Generating API Landscape Master CSV...');
    
    const csvHeaders = [
      'Service_Name',
      'Framework',
      'Language',
      'Method',
      'Path',
      'Controller',
      'Action_Name',
      'File_Location',
      'Parameters_Count',
      'Dependencies_Count',
      'Risk_Level',
      'Domain_Category',
      'Endpoint_Complexity'
    ];
    
    const rows = [csvHeaders.join(',')];
    
    // Process each service
    for (const service of this.analysisData.services) {
      const serviceName = service.serviceName;
      const individualData = this.individualServiceData.get(serviceName);
      
      if (service.endpoints && service.endpoints.length > 0) {
        for (const endpoint of service.endpoints) {
          const domainCategory = this.categorizeEndpoint(endpoint.path);
          const riskLevel = this.calculateRiskLevel(service, endpoint);
          const complexity = this.calculateEndpointComplexity(endpoint);
          
          const row = [
            serviceName,
            service.framework,
            service.metadata?.language || 'unknown',
            endpoint.method || 'GET',
            endpoint.path || '',
            this.extractController(endpoint),
            endpoint.actionName || endpoint.description || '',
            endpoint.file || '',
            (endpoint.parameters && endpoint.parameters.length) || 0,
            service.dependencies.length,
            riskLevel,
            domainCategory,
            complexity
          ].map(field => `"${String(field).replace(/"/g, '""')}"`);
          
          rows.push(row.join(','));
        }
      } else {
        // Services with no endpoints
        const row = [
          serviceName,
          service.framework,
          service.metadata?.language || 'unknown',
          'N/A',
          'No endpoints detected',
          'N/A',
          'Service with no API endpoints',
          'N/A',
          0,
          service.dependencies.length,
          service.dependencies.length > 50 ? 'HIGH' : 'LOW',
          'Infrastructure/Support',
          'N/A'
        ].map(field => `"${String(field).replace(/"/g, '""')}"`);
        
        rows.push(row.join(','));
      }
    }
    
    await fs.writeFile('analysis-summary/api-landscape-master.csv', rows.join('\\n'));
    console.log(`📊 Generated API Landscape Master CSV with ${rows.length - 1} entries`);
  }

  /**
   * Generate service dependency matrix CSV
   */
  async generateServiceDependencyMatrix() {
    console.log('🕸️  Generating Service Dependency Matrix...');
    
    const services = this.analysisData.services.map(s => s.serviceName);
    const dependencyMap = new Map();
    
    // Build dependency relationships
    for (const service of this.analysisData.services) {
      const serviceName = service.serviceName;
      dependencyMap.set(serviceName, {
        internal_services: [],
        external_apis: service.externalAPIs.length,
        packages: service.dependencies.filter(d => d.type === 'package').length,
        total_dependencies: service.dependencies.length,
        endpoints_count: service.endpoints.length,
        fan_out: service.dependencies.length,
        fan_in: 0 // Will be calculated
      });
      
      // Extract internal service dependencies
      for (const dep of service.dependencies) {
        if (dep.type === 'service-dependency' && services.includes(dep.service)) {
          dependencyMap.get(serviceName).internal_services.push(dep.service);
        }
      }
    }
    
    // Calculate fan-in (how many services depend on this one)
    for (const [serviceName, data] of dependencyMap) {
      for (const [otherService, otherData] of dependencyMap) {
        if (otherData.internal_services.includes(serviceName)) {
          data.fan_in++;
        }
      }
    }
    
    // Generate CSV
    const headers = [
      'Service_Name',
      'Framework',
      'Endpoints_Count',
      'Total_Dependencies',
      'Internal_Service_Dependencies',
      'External_APIs',
      'Package_Dependencies',
      'Fan_Out_Score',
      'Fan_In_Score',
      'Bottleneck_Risk',
      'Dependency_Ratio'
    ];
    
    const rows = [headers.join(',')];
    
    for (const service of this.analysisData.services) {
      const serviceName = service.serviceName;
      const depData = dependencyMap.get(serviceName);
      const bottleneckRisk = this.calculateBottleneckRisk(depData);
      const dependencyRatio = service.endpoints.length > 0 ? 
        (depData.total_dependencies / service.endpoints.length).toFixed(2) : 
        'N/A';
      
      const row = [
        serviceName,
        service.framework,
        service.endpoints.length,
        depData.total_dependencies,
        depData.internal_services.length,
        depData.external_apis,
        depData.packages,
        depData.fan_out,
        depData.fan_in,
        bottleneckRisk,
        dependencyRatio
      ].map(field => `"${String(field).replace(/"/g, '""')}"`);
      
      rows.push(row.join(','));
    }
    
    await fs.writeFile('analysis-summary/service-dependency-matrix.csv', rows.join('\\n'));
    console.log(`🕸️  Generated Service Dependency Matrix with ${rows.length - 1} services`);
  }

  /**
   * Generate API Gateway routing map CSV
   */
  async generateAPIGatewayRoutingMap() {
    console.log('🚪 Generating API Gateway Routing Map...');
    
    const routingMap = new Map();
    
    // Group endpoints by domain
    for (const service of this.analysisData.services) {
      for (const endpoint of service.endpoints) {
        const domain = this.categorizeEndpoint(endpoint.path);
        const gatewayPriority = this.calculateGatewayPriority(service, endpoint);
        
        if (!routingMap.has(domain)) {
          routingMap.set(domain, []);
        }
        
        routingMap.get(domain).push({
          domain,
          service: service.serviceName,
          framework: service.framework,
          method: endpoint.method,
          path: endpoint.path,
          controller: this.extractController(endpoint),
          gatewayPriority,
          expectedTraffic: this.estimateTraffic(service, endpoint)
        });
      }
    }
    
    // Generate CSV
    const headers = [
      'Domain',
      'Service_Name',
      'Framework',
      'Method',
      'Path',
      'Controller',
      'Gateway_Priority',
      'Expected_Traffic',
      'Load_Balancing_Group',
      'Caching_Strategy'
    ];
    
    const rows = [headers.join(',')];
    
    for (const [domain, endpoints] of routingMap) {
      for (const endpoint of endpoints) {
        const loadBalancingGroup = this.getLoadBalancingGroup(endpoint);
        const cachingStrategy = this.getCachingStrategy(endpoint);
        
        const row = [
          domain,
          endpoint.service,
          endpoint.framework,
          endpoint.method,
          endpoint.path,
          endpoint.controller,
          endpoint.gatewayPriority,
          endpoint.expectedTraffic,
          loadBalancingGroup,
          cachingStrategy
        ].map(field => `"${String(field).replace(/"/g, '""')}"`);
        
        rows.push(row.join(','));
      }
    }
    
    await fs.writeFile('analysis-summary/api-gateway-routing-map.csv', rows.join('\\n'));
    console.log(`🚪 Generated API Gateway Routing Map with ${rows.length - 1} endpoints`);
  }

  /**
   * Generate framework consolidation analysis
   */
  async generateFrameworkConsolidationAnalysis() {
    console.log('🏗️  Generating Framework Consolidation Analysis...');
    
    const frameworks = this.analysisData.summary.frameworks;
    const analysis = {
      timestamp: new Date().toISOString(),
      overview: {
        total_frameworks: Object.keys(frameworks).length,
        total_services: this.analysisData.summary.totalServices,
        total_endpoints: this.analysisData.summary.totalEndpoints
      },
      framework_analysis: {},
      consolidation_recommendations: [],
      migration_complexity: {}
    };
    
    // Analyze each framework
    for (const [framework, count] of Object.entries(frameworks)) {
      const frameworkServices = this.analysisData.services.filter(s => s.framework === framework);
      const totalEndpoints = frameworkServices.reduce((sum, s) => sum + s.endpoints.length, 0);
      const avgEndpoints = totalEndpoints / count;
      
      analysis.framework_analysis[framework] = {
        service_count: count,
        percentage: ((count / this.analysisData.summary.totalServices) * 100).toFixed(1),
        total_endpoints: totalEndpoints,
        endpoint_percentage: ((totalEndpoints / this.analysisData.summary.totalEndpoints) * 100).toFixed(1),
        avg_endpoints_per_service: avgEndpoints.toFixed(1),
        complexity_score: this.calculateFrameworkComplexity(framework, frameworkServices),
        services: frameworkServices.map(s => s.serviceName)
      };
    }
    
    // Generate recommendations
    analysis.consolidation_recommendations = this.generateConsolidationRecommendations(analysis.framework_analysis);
    analysis.migration_complexity = this.calculateMigrationComplexity(analysis.framework_analysis);
    
    await fs.writeFile('analysis-summary/framework-consolidation-analysis.json', JSON.stringify(analysis, null, 2));
    console.log('🏗️  Generated Framework Consolidation Analysis');
  }

  /**
   * Generate critical services analysis
   */
  async generateCriticalServicesAnalysis() {
    console.log('⚠️  Generating Critical Services Analysis...');
    
    const analysis = {
      timestamp: new Date().toISOString(),
      methodology: "Services ranked by endpoint count, dependency impact, and framework criticality",
      critical_services: [],
      bottleneck_services: [],
      single_points_of_failure: [],
      optimization_priorities: []
    };
    
    // Calculate criticality scores
    const servicesWithScores = this.analysisData.services.map(service => {
      const criticalityScore = this.calculateCriticalityScore(service);
      return {
        ...service,
        criticality_score: criticalityScore,
        risk_factors: this.identifyRiskFactors(service)
      };
    }).sort((a, b) => b.criticality_score - a.criticality_score);
    
    // Identify different categories
    analysis.critical_services = servicesWithScores.slice(0, 5).map(s => ({
      service_name: s.serviceName,
      framework: s.framework,
      endpoints_count: s.endpoints.length,
      dependencies_count: s.dependencies.length,
      criticality_score: s.criticality_score,
      risk_factors: s.risk_factors,
      impact_if_down: this.calculateDowntimeImpact(s)
    }));
    
    analysis.bottleneck_services = servicesWithScores
      .filter(s => s.endpoints.length > 50 || s.dependencies.length > 80)
      .map(s => ({
        service_name: s.serviceName,
        bottleneck_type: s.endpoints.length > 50 ? 'High API Traffic' : 'High Dependencies',
        metric_value: s.endpoints.length > 50 ? s.endpoints.length : s.dependencies.length,
        recommendation: this.getBottleneckRecommendation(s)
      }));
    
    analysis.optimization_priorities = this.generateOptimizationPriorities(servicesWithScores);
    
    await fs.writeFile('analysis-summary/critical-services-analysis.json', JSON.stringify(analysis, null, 2));
    console.log('⚠️  Generated Critical Services Analysis');
  }

  /**
   * Generate dependency network data for visualization
   */
  async generateDependencyNetworkData() {
    console.log('🕸️  Generating Dependency Network Data...');
    
    const networkData = {
      nodes: [],
      edges: [],
      metadata: {
        timestamp: new Date().toISOString(),
        total_nodes: this.analysisData.services.length,
        total_edges: 0,
        layout_suggestions: {
          algorithm: "force-directed",
          clustering: "by_framework",
          sizing: "by_endpoint_count"
        }
      }
    };
    
    // Create nodes
    for (const service of this.analysisData.services) {
      networkData.nodes.push({
        id: service.serviceName,
        label: service.serviceName,
        framework: service.framework,
        endpoints_count: service.endpoints.length,
        dependencies_count: service.dependencies.length,
        size: Math.max(10, service.endpoints.length / 10),
        color: this.getFrameworkColor(service.framework),
        group: service.framework,
        metadata: {
          language: service.metadata?.language,
          analyzed_at: service.metadata?.analyzedAt,
          risk_level: this.calculateRiskLevel(service)
        }
      });
    }
    
    // Create edges (dependencies)
    for (const service of this.analysisData.services) {
      for (const dependency of service.dependencies) {
        if (dependency.type === 'service-dependency') {
          const targetExists = this.analysisData.services.find(s => s.serviceName === dependency.service);
          if (targetExists) {
            networkData.edges.push({
              source: service.serviceName,
              target: dependency.service,
              type: 'internal_dependency',
              weight: 1
            });
            networkData.metadata.total_edges++;
          }
        }
      }
    }
    
    await fs.writeFile('analysis-summary/dependency-network-data.json', JSON.stringify(networkData, null, 2));
    console.log(`🕸️  Generated Dependency Network Data (${networkData.nodes.length} nodes, ${networkData.edges.length} edges)`);
  }

  // Helper methods
  categorizeEndpoint(path) {
    if (!path) return 'Unknown';
    const p = path.toLowerCase();
    
    if (p.includes('auth') || p.includes('login') || p.includes('token')) return 'Authentication';
    if (p.includes('user') || p.includes('member') || p.includes('profile')) return 'User Management';
    if (p.includes('park') || p.includes('vehicle')) return 'Parking';
    if (p.includes('payment') || p.includes('billing')) return 'Payment';
    if (p.includes('notification') || p.includes('message')) return 'Communication';
    if (p.includes('content') || p.includes('cms')) return 'Content Management';
    if (p.includes('config') || p.includes('setting')) return 'Configuration';
    if (p.includes('report') || p.includes('analytic')) return 'Analytics';
    if (p.includes('health') || p.includes('status')) return 'Monitoring';
    if (p.includes('operation')) return 'Operations';
    
    return 'Business Logic';
  }

  calculateRiskLevel(service, endpoint = null) {
    let score = 0;
    
    // High endpoint count increases risk
    if (service.endpoints.length > 100) score += 3;
    else if (service.endpoints.length > 50) score += 2;
    else if (service.endpoints.length > 10) score += 1;
    
    // High dependency count increases risk
    if (service.dependencies.length > 80) score += 3;
    else if (service.dependencies.length > 40) score += 2;
    else if (service.dependencies.length > 20) score += 1;
    
    // Framework criticality
    if (service.framework === '.NET') score += 2; // Critical services
    else if (service.framework === 'unknown') score += 1; // Uncertainty risk
    
    if (score >= 6) return 'CRITICAL';
    if (score >= 4) return 'HIGH';
    if (score >= 2) return 'MEDIUM';
    return 'LOW';
  }

  calculateEndpointComplexity(endpoint) {
    let complexity = 0;
    if (endpoint.parameters && endpoint.parameters.length > 5) complexity += 2;
    if (endpoint.path && endpoint.path.includes('{')) complexity += 1;
    if (endpoint.method && ['POST', 'PUT', 'PATCH'].includes(endpoint.method)) complexity += 1;
    
    if (complexity >= 3) return 'HIGH';
    if (complexity >= 2) return 'MEDIUM';
    return 'LOW';
  }

  extractController(endpoint) {
    if (endpoint.controllerName) return endpoint.controllerName;
    if (endpoint.file) {
      const match = endpoint.file.match(/([^/\\\\]+)Controller/);
      if (match) return match[1];
    }
    return 'Unknown';
  }

  calculateBottleneckRisk(depData) {
    if (depData.fan_in > 5 && depData.endpoints_count > 50) return 'CRITICAL';
    if (depData.fan_in > 3 || depData.endpoints_count > 100) return 'HIGH';
    if (depData.fan_out > 50) return 'MEDIUM';
    return 'LOW';
  }

  calculateGatewayPriority(service, endpoint) {
    let priority = 0;
    if (service.endpoints.length > 100) priority += 3;
    if (endpoint.method === 'GET') priority += 1;
    if (this.categorizeEndpoint(endpoint.path) === 'Authentication') priority += 2;
    
    if (priority >= 4) return 'CRITICAL';
    if (priority >= 2) return 'HIGH';
    return 'MEDIUM';
  }

  estimateTraffic(service, endpoint) {
    const category = this.categorizeEndpoint(endpoint.path);
    const baseTraffic = service.endpoints.length > 100 ? 'HIGH' : 'MEDIUM';
    
    if (['Authentication', 'Health'].includes(category)) return 'VERY_HIGH';
    if (endpoint.method === 'GET') return baseTraffic;
    return 'LOW';
  }

  getLoadBalancingGroup(endpoint) {
    if (endpoint.framework === '.NET') return 'dotnet-services';
    if (endpoint.framework.includes('Express') || endpoint.framework.includes('Node')) return 'nodejs-services';
    return 'other-services';
  }

  getCachingStrategy(endpoint) {
    if (endpoint.method === 'GET' && !endpoint.path.includes('status')) return 'CACHE_ENABLED';
    if (this.categorizeEndpoint(endpoint.path) === 'Configuration') return 'LONG_CACHE';
    return 'NO_CACHE';
  }

  calculateFrameworkComplexity(framework, services) {
    const avgEndpoints = services.reduce((sum, s) => sum + s.endpoints.length, 0) / services.length;
    const avgDeps = services.reduce((sum, s) => sum + s.dependencies.length, 0) / services.length;
    
    return Math.round((avgEndpoints + avgDeps) / 10);
  }

  generateConsolidationRecommendations(frameworkAnalysis) {
    const recommendations = [];
    
    // Find frameworks with low usage
    for (const [framework, data] of Object.entries(frameworkAnalysis)) {
      if (data.service_count <= 2 && framework !== '.NET') {
        recommendations.push({
          action: 'MIGRATE',
          framework,
          reason: `Only ${data.service_count} services using ${framework}`,
          target_framework: '.NET',
          effort: 'MEDIUM'
        });
      }
    }
    
    return recommendations;
  }

  calculateMigrationComplexity(frameworkAnalysis) {
    const complexity = {};
    
    for (const [framework, data] of Object.entries(frameworkAnalysis)) {
      let score = data.service_count * 2;
      score += data.total_endpoints / 10;
      
      complexity[framework] = {
        complexity_score: Math.round(score),
        effort_level: score > 50 ? 'HIGH' : score > 20 ? 'MEDIUM' : 'LOW'
      };
    }
    
    return complexity;
  }

  calculateCriticalityScore(service) {
    let score = 0;
    score += service.endpoints.length * 2; // Endpoint weight
    score += service.dependencies.length; // Dependency weight
    if (service.framework === '.NET') score += 50; // Framework criticality
    return score;
  }

  identifyRiskFactors(service) {
    const factors = [];
    if (service.endpoints.length > 200) factors.push('Very high endpoint count');
    if (service.dependencies.length > 80) factors.push('High dependency count');
    if (service.framework === '.NET') factors.push('Critical framework');
    if (service.endpoints.length === 0 && service.dependencies.length > 0) factors.push('Dependency-only service');
    return factors;
  }

  calculateDowntimeImpact(service) {
    if (service.endpoints.length > 200) return 'System-wide outage';
    if (service.endpoints.length > 50) return 'Major service disruption';
    if (service.dependencies.length > 80) return 'Integration failures';
    return 'Limited impact';
  }

  getBottleneckRecommendation(service) {
    if (service.endpoints.length > 200) return 'Implement API gateway and rate limiting';
    if (service.endpoints.length > 50) return 'Add load balancing and monitoring';
    if (service.dependencies.length > 80) return 'Review and optimize dependencies';
    return 'Monitor performance metrics';
  }

  generateOptimizationPriorities(services) {
    return services.slice(0, 10).map((service, index) => ({
      priority: index + 1,
      service_name: service.serviceName,
      focus_area: service.endpoints.length > service.dependencies.length ? 'API Performance' : 'Dependency Management',
      effort_estimate: service.criticality_score > 300 ? 'HIGH' : 'MEDIUM'
    }));
  }

  getFrameworkColor(framework) {
    const colors = {
      '.NET': '#512BD4',
      'Express.js': '#68A063',
      'Node.js': '#68A063',
      'FastAPI': '#009688',
      'Next.js': '#000000',
      'Flutter': '#02569B',
      'NestJS': '#E0234E',
      'Python': '#3776AB',
      'Fiber': '#00ADD8',
      'unknown': '#6C757D'
    };
    return colors[framework] || '#6C757D';
  }
}

// Run the mapper
if (require.main === module) {
  const mapper = new APILandscapeMapper();
  mapper.run().catch(error => {
    console.error('❌ Error running API Landscape Mapper:', error);
    process.exit(1);
  });
}