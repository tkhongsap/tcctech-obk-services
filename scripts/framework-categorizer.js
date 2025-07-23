/**
 * Framework Categorizer
 * Categorizes services by framework and provides framework-specific analysis
 */
class FrameworkCategorizer {
  constructor(options = {}) {
    this.options = {
      enableFrameworkDetection: options.enableFrameworkDetection !== false,
      includeVersionAnalysis: options.includeVersionAnalysis !== false,
      frameworkPatterns: options.frameworkPatterns || this.getDefaultFrameworkPatterns(),
      ...options
    };

    this.categories = new Map();
    this.frameworkStats = new Map();
    this.versionStats = new Map();
    this.frameworkFeatures = this.getFrameworkFeatures();
    this.frameworkRules = this.getFrameworkRules();
  }

  /**
   * Categorize services by framework
   * @param {Map} services - All service data
   * @param {Map} endpoints - All endpoint data
   * @returns {Object} Categorization results
   */
  categorizeByFramework(services, endpoints) {
    // Initialize categorization
    this.initializeCategories();

    // Categorize each service
    for (const [serviceName, serviceInfo] of services) {
      this.categorizeService(serviceName, serviceInfo, endpoints);
    }

    // Analyze framework patterns
    this.analyzeFrameworkPatterns();

    // Generate framework insights
    const insights = this.generateFrameworkInsights();

    // Generate categorization report
    return this.generateCategorizationReport(insights);
  }

  /**
   * Get default framework detection patterns
   * @returns {Object} Framework patterns
   */
  getDefaultFrameworkPatterns() {
    return {
      'Express.js': {
        keywords: ['express', 'express.js', 'expressjs'],
        filePatterns: ['app.js', 'server.js', 'index.js'],
        dependencyPatterns: ['express'],
        versionPatterns: [/express\s*[:\^~]?\s*(\d+\.\d+\.\d+)/i],
        endpointPatterns: ['app.get', 'app.post', 'router.get', 'router.post'],
        characteristics: ['middleware', 'routes', 'req', 'res', 'next']
      },
      'NestJS': {
        keywords: ['nest', 'nestjs', 'nest.js'],
        filePatterns: ['main.ts', 'app.module.ts', 'app.controller.ts'],
        dependencyPatterns: ['@nestjs/core', '@nestjs/common'],
        versionPatterns: [/@nestjs\/core\s*[:\^~]?\s*(\d+\.\d+\.\d+)/i],
        endpointPatterns: ['@Get', '@Post', '@Put', '@Delete', '@Controller'],
        characteristics: ['decorators', 'modules', 'controllers', 'services', 'providers']
      },
      'FastAPI': {
        keywords: ['fastapi', 'fast-api'],
        filePatterns: ['main.py', 'app.py'],
        dependencyPatterns: ['fastapi', 'uvicorn'],
        versionPatterns: [/fastapi\s*[:\^~=]?\s*(\d+\.\d+\.\d+)/i],
        endpointPatterns: ['@app.get', '@app.post', 'APIRouter'],
        characteristics: ['async def', 'Depends', 'FastAPI', 'Pydantic']
      },
      'Flask': {
        keywords: ['flask'],
        filePatterns: ['app.py', 'run.py', '__init__.py'],
        dependencyPatterns: ['flask'],
        versionPatterns: [/flask\s*[:\^~=]?\s*(\d+\.\d+\.\d+)/i],
        endpointPatterns: ['@app.route', '@bp.route', 'Blueprint'],
        characteristics: ['Flask', 'request', 'jsonify', 'blueprint']
      },
      'Django': {
        keywords: ['django'],
        filePatterns: ['urls.py', 'views.py', 'models.py', 'settings.py'],
        dependencyPatterns: ['django'],
        versionPatterns: [/django\s*[:\^~=]?\s*(\d+\.\d+\.\d+)/i],
        endpointPatterns: ['path(', 'url(', 'def get', 'def post'],
        characteristics: ['HttpResponse', 'render', 'Model', 'ViewSet']
      },
      'Spring Boot': {
        keywords: ['spring', 'springboot', 'spring-boot'],
        filePatterns: ['Application.java', 'Controller.java'],
        dependencyPatterns: ['spring-boot-starter', 'springframework'],
        versionPatterns: [/spring-boot-starter\s*[:\^~]?\s*(\d+\.\d+\.\d+)/i],
        endpointPatterns: ['@RestController', '@GetMapping', '@PostMapping', '@RequestMapping'],
        characteristics: ['@Autowired', '@Service', '@Component', '@Repository']
      },
      'ASP.NET Core': {
        keywords: ['asp.net', 'aspnet', 'dotnet'],
        filePatterns: ['Startup.cs', 'Program.cs', 'Controller.cs'],
        dependencyPatterns: ['Microsoft.AspNetCore'],
        versionPatterns: [/Microsoft\.AspNetCore\s*[:\^~]?\s*(\d+\.\d+\.\d+)/i],
        endpointPatterns: ['[HttpGet]', '[HttpPost]', '[Route]', 'ApiController'],
        characteristics: ['IActionResult', 'ControllerBase', 'ConfigureServices', 'Configure']
      },
      'Gin': {
        keywords: ['gin', 'gin-gonic'],
        filePatterns: ['main.go', 'server.go'],
        dependencyPatterns: ['github.com/gin-gonic/gin'],
        versionPatterns: [/gin\s*v(\d+\.\d+\.\d+)/i],
        endpointPatterns: ['gin.Default', 'router.GET', 'router.POST', 'c.JSON'],
        characteristics: ['gin.Context', 'gin.H', 'gin.Engine']
      },
      'Rails': {
        keywords: ['rails', 'ruby on rails'],
        filePatterns: ['application.rb', 'routes.rb', 'Gemfile'],
        dependencyPatterns: ['rails'],
        versionPatterns: [/rails\s*[:\^~]?\s*(\d+\.\d+\.\d+)/i],
        endpointPatterns: ['get ', 'post ', 'put ', 'delete ', 'resources '],
        characteristics: ['ApplicationController', 'before_action', 'render json', 'params']
      }
    };
  }

  /**
   * Get framework-specific features and capabilities
   * @returns {Object} Framework features
   */
  getFrameworkFeatures() {
    return {
      'Express.js': {
        type: 'Web Framework',
        language: 'JavaScript/TypeScript',
        paradigm: 'Minimalist',
        strengths: ['Flexibility', 'Middleware ecosystem', 'Performance', 'Community'],
        patterns: ['RESTful APIs', 'Middleware chain', 'Route handlers'],
        commonUses: ['REST APIs', 'Web applications', 'Microservices'],
        performance: 'High',
        learningCurve: 'Easy'
      },
      'NestJS': {
        type: 'Progressive Framework',
        language: 'TypeScript',
        paradigm: 'Modular/Decorator-based',
        strengths: ['Type safety', 'Scalability', 'Architecture', 'Decorators'],
        patterns: ['Modules', 'Controllers', 'Services', 'Dependency Injection'],
        commonUses: ['Enterprise APIs', 'Microservices', 'GraphQL APIs'],
        performance: 'High',
        learningCurve: 'Medium'
      },
      'FastAPI': {
        type: 'Modern Web Framework',
        language: 'Python',
        paradigm: 'Async/Type hints',
        strengths: ['Performance', 'Auto documentation', 'Type validation', 'Modern'],
        patterns: ['Async/await', 'Pydantic models', 'Dependency injection'],
        commonUses: ['APIs', 'Data services', 'ML APIs'],
        performance: 'Very High',
        learningCurve: 'Easy'
      },
      'Flask': {
        type: 'Micro Framework',
        language: 'Python',
        paradigm: 'Minimalist',
        strengths: ['Simplicity', 'Flexibility', 'Lightweight', 'Extensible'],
        patterns: ['Blueprints', 'Decorators', 'Request context'],
        commonUses: ['Small APIs', 'Prototypes', 'Simple web apps'],
        performance: 'Medium',
        learningCurve: 'Very Easy'
      },
      'Django': {
        type: 'Full-stack Framework',
        language: 'Python',
        paradigm: 'Batteries included',
        strengths: ['Complete solution', 'ORM', 'Admin interface', 'Security'],
        patterns: ['MVT', 'ORM models', 'Class-based views'],
        commonUses: ['Web applications', 'Content management', 'APIs'],
        performance: 'Medium',
        learningCurve: 'Medium'
      },
      'Spring Boot': {
        type: 'Enterprise Framework',
        language: 'Java',
        paradigm: 'Convention over configuration',
        strengths: ['Enterprise features', 'Ecosystem', 'Scalability', 'Stability'],
        patterns: ['Dependency injection', 'Annotations', 'Auto-configuration'],
        commonUses: ['Enterprise APIs', 'Microservices', 'Backend services'],
        performance: 'High',
        learningCurve: 'Hard'
      },
      'ASP.NET Core': {
        type: 'Cross-platform Framework',
        language: 'C#',
        paradigm: 'MVC/Web API',
        strengths: ['Performance', 'Tooling', 'Type safety', 'Microsoft ecosystem'],
        patterns: ['MVC', 'Dependency injection', 'Middleware pipeline'],
        commonUses: ['Enterprise APIs', 'Web applications', 'Services'],
        performance: 'Very High',
        learningCurve: 'Medium'
      },
      'Gin': {
        type: 'HTTP Web Framework',
        language: 'Go',
        paradigm: 'Minimalist/High performance',
        strengths: ['Performance', 'Simplicity', 'Concurrency', 'Small footprint'],
        patterns: ['Handlers', 'Middleware', 'Context'],
        commonUses: ['APIs', 'Microservices', 'High-performance services'],
        performance: 'Very High',
        learningCurve: 'Easy'
      },
      'Rails': {
        type: 'Full-stack Framework',
        language: 'Ruby',
        paradigm: 'Convention over configuration',
        strengths: ['Productivity', 'Conventions', 'Ecosystem', 'Rapid development'],
        patterns: ['MVC', 'ActiveRecord', 'RESTful routes'],
        commonUses: ['Web applications', 'APIs', 'Rapid prototyping'],
        performance: 'Medium',
        learningCurve: 'Medium'
      }
    };
  }

  /**
   * Get framework-specific analysis rules
   * @returns {Object} Framework rules
   */
  getFrameworkRules() {
    return {
      'Express.js': {
        endpointNaming: 'camelCase or kebab-case',
        routeStructure: 'Flexible, often RESTful',
        middlewarePattern: 'Sequential middleware chain',
        errorHandling: 'Custom error middleware',
        commonIssues: ['Callback hell', 'Error handling', 'Security middleware']
      },
      'NestJS': {
        endpointNaming: 'camelCase methods with decorators',
        routeStructure: 'Controller-based with decorators',
        middlewarePattern: 'Guards, Interceptors, Pipes',
        errorHandling: 'Exception filters',
        commonIssues: ['Complex configuration', 'Learning curve', 'Boilerplate']
      },
      'FastAPI': {
        endpointNaming: 'snake_case functions',
        routeStructure: 'Decorator-based routes',
        middlewarePattern: 'ASGI middleware',
        errorHandling: 'Exception handlers',
        commonIssues: ['Async complexity', 'Documentation overhead']
      },
      'Flask': {
        endpointNaming: 'snake_case functions',
        routeStructure: 'Decorator-based routes',
        middlewarePattern: 'Before/after request hooks',
        errorHandling: 'Error handlers',
        commonIssues: ['Lack of structure', 'Manual configuration', 'Security']
      }
    };
  }

  /**
   * Initialize framework categories
   */
  initializeCategories() {
    const frameworks = Object.keys(this.frameworkFeatures);
    
    frameworks.forEach(framework => {
      this.categories.set(framework, {
        services: [],
        endpoints: [],
        totalEndpoints: 0,
        versions: new Set(),
        languages: new Set(),
        patterns: {
          endpointCount: 0,
          averageComplexity: 0,
          commonPaths: new Map(),
          httpMethods: new Map()
        },
        characteristics: this.frameworkFeatures[framework]
      });
    });

    // Unknown/Other category
    this.categories.set('Unknown', {
      services: [],
      endpoints: [],
      totalEndpoints: 0,
      versions: new Set(),
      languages: new Set(),
      patterns: {
        endpointCount: 0,
        averageComplexity: 0,
        commonPaths: new Map(),
        httpMethods: new Map()
      },
      characteristics: {
        type: 'Unknown',
        language: 'Mixed',
        paradigm: 'Unknown'
      }
    });
  }

  /**
   * Categorize a single service
   * @param {string} serviceName - Service name
   * @param {Object} serviceInfo - Service information
   * @param {Map} endpoints - All endpoints
   */
  categorizeService(serviceName, serviceInfo, endpoints) {
    if (!serviceInfo.analysisData?.unified) return;

    const service = serviceInfo.analysisData.unified;
    
    // Detect framework
    const detectedFramework = this.detectFramework(service, serviceInfo);
    
    // Get or create category
    const category = this.categories.get(detectedFramework) || this.categories.get('Unknown');
    
    // Add service to category
    category.services.push({
      name: serviceName,
      framework: service.service.framework || detectedFramework,
      language: service.service.language,
      version: service.service.version,
      endpointCount: service.endpoints.length,
      complexity: service.metadata.complexity,
      dependencies: service.metadata.totalDependencies,
      lastAnalyzed: service.service.analyzedAt
    });

    // Add endpoints to category
    service.endpoints.forEach(endpoint => {
      const fullEndpoint = {
        ...endpoint,
        serviceName,
        framework: detectedFramework
      };
      category.endpoints.push(fullEndpoint);
      category.totalEndpoints++;

      // Update patterns
      this.updatePatterns(category.patterns, endpoint);
    });

    // Update category metadata
    if (service.service.language) {
      category.languages.add(service.service.language);
    }
    
    if (service.service.version) {
      category.versions.add(service.service.version);
    }

    // Update framework stats
    this.updateFrameworkStats(detectedFramework, service);
  }

  /**
   * Detect framework for a service
   * @param {Object} service - Service data
   * @param {Object} serviceInfo - Raw service info
   * @returns {string} Detected framework
   */
  detectFramework(service, serviceInfo) {
    // Check explicit framework field first
    const explicitFramework = service.service.framework;
    if (explicitFramework && this.isKnownFramework(explicitFramework)) {
      return this.normalizeFrameworkName(explicitFramework);
    }

    // Use pattern-based detection
    return this.detectFrameworkByPatterns(service, serviceInfo);
  }

  /**
   * Check if framework is known
   * @param {string} framework - Framework name
   * @returns {boolean} True if known
   */
  isKnownFramework(framework) {
    const normalizedName = this.normalizeFrameworkName(framework);
    return this.categories.has(normalizedName);
  }

  /**
   * Normalize framework name
   * @param {string} framework - Raw framework name
   * @returns {string} Normalized name
   */
  normalizeFrameworkName(framework) {
    const lower = framework.toLowerCase();
    
    // Mapping common variations
    const mappings = {
      'express': 'Express.js',
      'expressjs': 'Express.js',
      'express.js': 'Express.js',
      'nest': 'NestJS',
      'nestjs': 'NestJS',
      'nest.js': 'NestJS',
      'fastapi': 'FastAPI',
      'flask': 'Flask',
      'django': 'Django',
      'spring': 'Spring Boot',
      'springboot': 'Spring Boot',
      'spring-boot': 'Spring Boot',
      'aspnet': 'ASP.NET Core',
      'asp.net': 'ASP.NET Core',
      'gin': 'Gin',
      'rails': 'Rails'
    };

    return mappings[lower] || framework;
  }

  /**
   * Detect framework by analyzing patterns
   * @param {Object} service - Service data
   * @param {Object} serviceInfo - Raw service info
   * @returns {string} Detected framework
   */
  detectFrameworkByPatterns(service, serviceInfo) {
    const scores = new Map();
    
    // Initialize scores
    Object.keys(this.options.frameworkPatterns).forEach(framework => {
      scores.set(framework, 0);
    });

    // Analyze dependencies
    if (service.dependencies.packages.length > 0) {
      this.scoreByDependencies(scores, service.dependencies.packages);
    }

    // Analyze endpoint patterns
    if (service.endpoints.length > 0) {
      this.scoreByEndpointPatterns(scores, service.endpoints);
    }

    // Analyze file references
    this.scoreByFilePatterns(scores, service);

    // Analyze language
    this.scoreByLanguage(scores, service.service.language);

    // Find highest scoring framework
    let maxScore = 0;
    let detectedFramework = 'Unknown';
    
    for (const [framework, score] of scores) {
      if (score > maxScore) {
        maxScore = score;
        detectedFramework = framework;
      }
    }

    // Require minimum confidence
    return maxScore >= 3 ? detectedFramework : 'Unknown';
  }

  /**
   * Score frameworks by dependencies
   * @param {Map} scores - Framework scores
   * @param {Array} packages - Package dependencies
   */
  scoreByDependencies(scores, packages) {
    packages.forEach(pkg => {
      const packageName = pkg.name.toLowerCase();
      
      Object.entries(this.options.frameworkPatterns).forEach(([framework, patterns]) => {
        patterns.dependencyPatterns.forEach(depPattern => {
          if (packageName.includes(depPattern.toLowerCase())) {
            scores.set(framework, scores.get(framework) + 5); // High weight for dependencies
          }
        });
      });
    });
  }

  /**
   * Score frameworks by endpoint patterns
   * @param {Map} scores - Framework scores
   * @param {Array} endpoints - Service endpoints
   */
  scoreByEndpointPatterns(scores, endpoints) {
    endpoints.forEach(endpoint => {
      const description = (endpoint.description || '').toLowerCase();
      const file = (endpoint.file || '').toLowerCase();
      const allText = `${description} ${file}`;
      
      Object.entries(this.options.frameworkPatterns).forEach(([framework, patterns]) => {
        patterns.endpointPatterns.forEach(pattern => {
          if (allText.includes(pattern.toLowerCase())) {
            scores.set(framework, scores.get(framework) + 2);
          }
        });
        
        patterns.characteristics.forEach(char => {
          if (allText.includes(char.toLowerCase())) {
            scores.set(framework, scores.get(framework) + 1);
          }
        });
      });
    });
  }

  /**
   * Score frameworks by file patterns
   * @param {Map} scores - Framework scores
   * @param {Object} service - Service data
   */
  scoreByFilePatterns(scores, service) {
    const files = [];
    
    // Collect file references from endpoints and schemas
    service.endpoints.forEach(endpoint => {
      if (endpoint.file) files.push(endpoint.file);
    });
    
    service.schemas.forEach(schema => {
      if (schema.file) files.push(schema.file);
    });

    files.forEach(file => {
      const fileName = file.toLowerCase();
      
      Object.entries(this.options.frameworkPatterns).forEach(([framework, patterns]) => {
        patterns.filePatterns.forEach(filePattern => {
          if (fileName.includes(filePattern.toLowerCase())) {
            scores.set(framework, scores.get(framework) + 3);
          }
        });
      });
    });
  }

  /**
   * Score frameworks by language
   * @param {Map} scores - Framework scores
   * @param {string} language - Service language
   */
  scoreByLanguage(scores, language) {
    if (!language) return;
    
    const langLower = language.toLowerCase();
    
    // Language-framework associations
    const languageFrameworks = {
      'javascript': ['Express.js', 'NestJS'],
      'typescript': ['NestJS', 'Express.js'],
      'python': ['FastAPI', 'Flask', 'Django'],
      'java': ['Spring Boot'],
      'c#': ['ASP.NET Core'],
      'go': ['Gin'],
      'ruby': ['Rails']
    };

    Object.entries(languageFrameworks).forEach(([lang, frameworks]) => {
      if (langLower.includes(lang)) {
        frameworks.forEach(framework => {
          if (scores.has(framework)) {
            scores.set(framework, scores.get(framework) + 1);
          }
        });
      }
    });
  }

  /**
   * Update endpoint patterns for a category
   * @param {Object} patterns - Pattern tracking object
   * @param {Object} endpoint - Endpoint data
   */
  updatePatterns(patterns, endpoint) {
    patterns.endpointCount++;

    // Track HTTP methods
    const method = endpoint.method;
    patterns.httpMethods.set(method, (patterns.httpMethods.get(method) || 0) + 1);

    // Track common path patterns
    const pathSegments = endpoint.path.split('/').filter(s => s.length > 0);
    if (pathSegments.length > 0) {
      const firstSegment = pathSegments[0];
      patterns.commonPaths.set(firstSegment, (patterns.commonPaths.get(firstSegment) || 0) + 1);
    }

    // Update average complexity
    const complexity = endpoint.complexity || 1;
    patterns.averageComplexity = ((patterns.averageComplexity * (patterns.endpointCount - 1)) + complexity) / patterns.endpointCount;
  }

  /**
   * Update framework statistics
   * @param {string} framework - Framework name
   * @param {Object} service - Service data
   */
  updateFrameworkStats(framework, service) {
    if (!this.frameworkStats.has(framework)) {
      this.frameworkStats.set(framework, {
        serviceCount: 0,
        totalEndpoints: 0,
        totalComplexity: 0,
        languages: new Set(),
        versions: new Set(),
        firstSeen: new Date(),
        lastSeen: new Date()
      });
    }

    const stats = this.frameworkStats.get(framework);
    stats.serviceCount++;
    stats.totalEndpoints += service.endpoints.length;
    stats.totalComplexity += service.metadata.complexity || 0;
    stats.languages.add(service.service.language);
    stats.versions.add(service.service.version);
    stats.lastSeen = new Date();
  }

  /**
   * Analyze framework patterns across categories
   */
  analyzeFrameworkPatterns() {
    for (const [framework, category] of this.categories) {
      if (category.services.length === 0) continue;

      // Calculate averages
      category.averageEndpoints = category.totalEndpoints / category.services.length;
      category.averageComplexity = category.services.reduce((sum, s) => sum + (s.complexity || 0), 0) / category.services.length;

      // Analyze version distribution
      category.versionAnalysis = this.analyzeVersions(Array.from(category.versions));

      // Find common patterns
      category.commonPatterns = this.findCommonPatterns(category);

      // Performance characteristics
      category.performanceProfile = this.analyzePerformanceProfile(framework, category);
    }
  }

  /**
   * Analyze version distribution
   * @param {Array} versions - List of versions
   * @returns {Object} Version analysis
   */
  analyzeVersions(versions) {
    if (versions.length === 0) return { latest: 'Unknown', distribution: {} };

    const distribution = {};
    versions.forEach(version => {
      if (version && version !== 'Unknown') {
        distribution[version] = (distribution[version] || 0) + 1;
      }
    });

    // Find most common version
    const mostCommon = Object.entries(distribution)
      .sort((a, b) => b[1] - a[1])[0];

    return {
      latest: mostCommon ? mostCommon[0] : 'Unknown',
      distribution,
      uniqueVersions: Object.keys(distribution).length,
      needsUpdate: this.needsVersionUpdate(Object.keys(distribution))
    };
  }

  /**
   * Check if versions need updating
   * @param {Array} versions - List of versions
   * @returns {boolean} True if update needed
   */
  needsVersionUpdate(versions) {
    // Simple heuristic: if any version is below major version 3, might need update
    return versions.some(version => {
      const match = version.match(/^(\d+)/);
      return match && parseInt(match[1]) < 3;
    });
  }

  /**
   * Find common patterns in a framework category
   * @param {Object} category - Framework category
   * @returns {Object} Common patterns
   */
  findCommonPatterns(category) {
    const patterns = {
      pathPrefixes: {},
      endpointNaming: {},
      complexityDistribution: { low: 0, medium: 0, high: 0 }
    };

    // Analyze path prefixes
    category.endpoints.forEach(endpoint => {
      const pathParts = endpoint.path.split('/').filter(p => p.length > 0);
      if (pathParts.length > 0) {
        const prefix = '/' + pathParts[0];
        patterns.pathPrefixes[prefix] = (patterns.pathPrefixes[prefix] || 0) + 1;
      }

      // Analyze complexity
      const complexity = endpoint.complexity || 1;
      if (complexity <= 3) patterns.complexityDistribution.low++;
      else if (complexity <= 6) patterns.complexityDistribution.medium++;
      else patterns.complexityDistribution.high++;
    });

    // Find most common path prefixes
    patterns.topPrefixes = Object.entries(patterns.pathPrefixes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([prefix, count]) => ({ prefix, count }));

    return patterns;
  }

  /**
   * Analyze performance profile for framework
   * @param {string} framework - Framework name
   * @param {Object} category - Framework category
   * @returns {Object} Performance profile
   */
  analyzePerformanceProfile(framework, category) {
    const features = this.frameworkFeatures[framework];
    
    const profile = {
      theoreticalPerformance: features?.performance || 'Unknown',
      endpointDensity: category.averageEndpoints || 0,
      complexityScore: category.averageComplexity || 0,
      scalabilityIndicators: {
        serviceCount: category.services.length,
        totalEndpoints: category.totalEndpoints,
        averageEndpointsPerService: category.averageEndpoints || 0
      }
    };

    // Add performance recommendations
    profile.recommendations = this.getPerformanceRecommendations(framework, profile);

    return profile;
  }

  /**
   * Get performance recommendations for framework
   * @param {string} framework - Framework name
   * @param {Object} profile - Performance profile
   * @returns {Array} Recommendations
   */
  getPerformanceRecommendations(framework, profile) {
    const recommendations = [];

    // High complexity services
    if (profile.complexityScore > 7) {
      recommendations.push({
        type: 'complexity',
        message: `High average complexity (${profile.complexityScore.toFixed(1)}) - consider service decomposition`,
        priority: 'medium'
      });
    }

    // Many endpoints per service
    if (profile.scalabilityIndicators.averageEndpointsPerService > 20) {
      recommendations.push({
        type: 'endpoints',
        message: `High endpoint count per service - consider breaking into smaller services`,
        priority: 'low'
      });
    }

    // Framework-specific recommendations
    const frameworkAdvice = this.getFrameworkSpecificAdvice(framework, profile);
    recommendations.push(...frameworkAdvice);

    return recommendations;
  }

  /**
   * Get framework-specific advice
   * @param {string} framework - Framework name
   * @param {Object} profile - Performance profile
   * @returns {Array} Advice
   */
  getFrameworkSpecificAdvice(framework, profile) {
    const advice = [];

    switch (framework) {
      case 'Express.js':
        if (profile.scalabilityIndicators.serviceCount > 10) {
          advice.push({
            type: 'architecture',
            message: 'Consider NestJS for larger Express.js deployments to improve maintainability',
            priority: 'low'
          });
        }
        break;

      case 'Flask':
        if (profile.endpointDensity > 15) {
          advice.push({
            type: 'performance',
            message: 'Consider FastAPI for better performance with many endpoints',
            priority: 'medium'
          });
        }
        break;

      case 'Django':
        advice.push({
          type: 'api',
          message: 'Consider Django REST Framework for dedicated API services',
          priority: 'low'
        });
        break;
    }

    return advice;
  }

  /**
   * Generate framework insights
   * @returns {Object} Framework insights
   */
  generateFrameworkInsights() {
    const insights = {
      frameworkDistribution: this.getFrameworkDistribution(),
      languageDistribution: this.getLanguageDistribution(),
      performanceComparison: this.compareFrameworkPerformance(),
      migrationOpportunities: this.identifyMigrationOpportunities(),
      modernizationSuggestions: this.generateModernizationSuggestions()
    };

    return insights;
  }

  /**
   * Get framework distribution
   * @returns {Object} Framework distribution
   */
  getFrameworkDistribution() {
    const distribution = {};
    let totalServices = 0;

    for (const [framework, category] of this.categories) {
      if (category.services.length > 0) {
        distribution[framework] = {
          services: category.services.length,
          endpoints: category.totalEndpoints,
          percentage: 0 // Will calculate after total
        };
        totalServices += category.services.length;
      }
    }

    // Calculate percentages
    Object.values(distribution).forEach(item => {
      item.percentage = Math.round((item.services / totalServices) * 100);
    });

    return {
      distribution,
      totalServices,
      frameworkCount: Object.keys(distribution).length
    };
  }

  /**
   * Get language distribution
   * @returns {Object} Language distribution
   */
  getLanguageDistribution() {
    const distribution = {};
    
    for (const [framework, category] of this.categories) {
      category.languages.forEach(language => {
        if (!distribution[language]) {
          distribution[language] = {
            frameworks: new Set(),
            services: 0
          };
        }
        distribution[language].frameworks.add(framework);
        distribution[language].services += category.services.length;
      });
    }

    // Convert sets to arrays
    Object.values(distribution).forEach(item => {
      item.frameworks = Array.from(item.frameworks);
    });

    return distribution;
  }

  /**
   * Compare framework performance characteristics
   * @returns {Array} Performance comparison
   */
  compareFrameworkPerformance() {
    const comparison = [];

    for (const [framework, category] of this.categories) {
      if (category.services.length === 0) continue;

      const features = this.frameworkFeatures[framework];
      comparison.push({
        framework,
        services: category.services.length,
        endpoints: category.totalEndpoints,
        averageComplexity: category.averageComplexity || 0,
        theoreticalPerformance: features?.performance || 'Unknown',
        learningCurve: features?.learningCurve || 'Unknown',
        scalabilityScore: this.calculateScalabilityScore(category)
      });
    }

    return comparison.sort((a, b) => b.scalabilityScore - a.scalabilityScore);
  }

  /**
   * Calculate scalability score
   * @param {Object} category - Framework category
   * @returns {number} Scalability score
   */
  calculateScalabilityScore(category) {
    const serviceCount = category.services.length;
    const avgEndpoints = category.averageEndpoints || 0;
    const avgComplexity = category.averageComplexity || 0;

    // Higher service count and moderate endpoint count = better scalability
    // Lower complexity = better scalability
    return (serviceCount * 2) + Math.min(avgEndpoints / 5, 10) - (avgComplexity / 2);
  }

  /**
   * Identify migration opportunities
   * @returns {Array} Migration opportunities
   */
  identifyMigrationOpportunities() {
    const opportunities = [];

    for (const [framework, category] of this.categories) {
      if (category.services.length === 0) continue;

      // Version-based migrations
      if (category.versionAnalysis?.needsUpdate) {
        opportunities.push({
          type: 'version_update',
          framework,
          services: category.services.length,
          reason: 'Outdated framework versions detected',
          priority: 'medium',
          effort: 'low'
        });
      }

      // Performance-based migrations
      const features = this.frameworkFeatures[framework];
      if (features?.performance === 'Medium' && category.totalEndpoints > 100) {
        opportunities.push({
          type: 'performance_upgrade',
          framework,
          services: category.services.length,
          reason: 'High endpoint count with medium-performance framework',
          suggestions: this.getPerformanceAlternatives(framework),
          priority: 'low',
          effort: 'high'
        });
      }
    }

    return opportunities;
  }

  /**
   * Get performance alternatives for a framework
   * @param {string} framework - Current framework
   * @returns {Array} Alternative frameworks
   */
  getPerformanceAlternatives(framework) {
    const alternatives = {
      'Flask': ['FastAPI'],
      'Django': ['FastAPI'],
      'Express.js': ['NestJS', 'Gin'],
      'Spring Boot': ['ASP.NET Core']
    };

    return alternatives[framework] || [];
  }

  /**
   * Generate modernization suggestions
   * @returns {Array} Modernization suggestions
   */
  generateModernizationSuggestions() {
    const suggestions = [];

    // Check for modern patterns
    const modernFrameworks = ['NestJS', 'FastAPI', 'ASP.NET Core'];
    const legacyFrameworks = ['Flask', 'Express.js'];

    let modernCount = 0;
    let legacyCount = 0;

    for (const [framework, category] of this.categories) {
      if (modernFrameworks.includes(framework)) {
        modernCount += category.services.length;
      } else if (legacyFrameworks.includes(framework)) {
        legacyCount += category.services.length;
      }
    }

    if (legacyCount > modernCount) {
      suggestions.push({
        type: 'modernization',
        message: 'Consider adopting more modern frameworks for new services',
        details: `${legacyCount} services use older frameworks vs ${modernCount} using modern ones`,
        recommendations: ['Use TypeScript-based frameworks', 'Adopt async/await patterns', 'Implement proper dependency injection']
      });
    }

    return suggestions;
  }

  /**
   * Generate categorization report
   * @param {Object} insights - Framework insights
   * @returns {Object} Complete categorization report
   */
  generateCategorizationReport(insights) {
    const report = {
      metadata: {
        analyzedAt: new Date().toISOString(),
        totalCategories: this.categories.size,
        analysisVersion: '1.0.0'
      },
      categories: this.convertCategoriesToObject(),
      insights,
      frameworkStats: this.convertFrameworkStatsToObject(),
      summary: {
        totalServices: insights.frameworkDistribution.totalServices,
        totalFrameworks: insights.frameworkDistribution.frameworkCount,
        dominantFramework: this.getDominantFramework(insights.frameworkDistribution),
        recommendedActions: this.getTopRecommendations(insights)
      }
    };

    return report;
  }

  /**
   * Convert categories to serializable object
   * @returns {Object} Categories object
   */
  convertCategoriesToObject() {
    const obj = {};
    
    for (const [framework, category] of this.categories) {
      if (category.services.length > 0) {
        obj[framework] = {
          ...category,
          languages: Array.from(category.languages),
          versions: Array.from(category.versions),
          httpMethods: Object.fromEntries(category.patterns.httpMethods),
          commonPaths: Object.fromEntries(category.patterns.commonPaths)
        };
      }
    }
    
    return obj;
  }

  /**
   * Convert framework stats to serializable object
   * @returns {Object} Framework stats object
   */
  convertFrameworkStatsToObject() {
    const obj = {};
    
    for (const [framework, stats] of this.frameworkStats) {
      obj[framework] = {
        ...stats,
        languages: Array.from(stats.languages),
        versions: Array.from(stats.versions),
        averageEndpointsPerService: Math.round((stats.totalEndpoints / stats.serviceCount) * 100) / 100,
        averageComplexityPerService: Math.round((stats.totalComplexity / stats.serviceCount) * 100) / 100
      };
    }
    
    return obj;
  }

  /**
   * Get dominant framework
   * @param {Object} distribution - Framework distribution
   * @returns {string} Dominant framework
   */
  getDominantFramework(distribution) {
    let maxServices = 0;
    let dominant = 'None';
    
    Object.entries(distribution.distribution).forEach(([framework, data]) => {
      if (data.services > maxServices) {
        maxServices = data.services;
        dominant = framework;
      }
    });
    
    return dominant;
  }

  /**
   * Get top recommendations
   * @param {Object} insights - Framework insights
   * @returns {Array} Top recommendations
   */
  getTopRecommendations(insights) {
    const recommendations = [];
    
    // Migration opportunities
    insights.migrationOpportunities.forEach(opp => {
      if (opp.priority === 'medium' || opp.priority === 'high') {
        recommendations.push(opp.reason);
      }
    });
    
    // Modernization suggestions
    insights.modernizationSuggestions.forEach(suggestion => {
      recommendations.push(suggestion.message);
    });
    
    return recommendations.slice(0, 5); // Top 5 recommendations
  }
}

module.exports = FrameworkCategorizer; 