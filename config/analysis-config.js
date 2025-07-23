/**
 * Configuration System for API Usage Analysis
 * Provides centralized configuration for analysis parameters and thresholds
 */

const path = require('path');

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  // Analysis directories
  paths: {
    analysis: 'analysis',
    output: 'output',
    analysisSummary: 'analysis-summary',
    logs: 'logs'
  },

  // File processing settings
  files: {
    supportedTypes: [
      'api-inventory.md',
      'dependency-map.json',
      'openapi.yaml',
      'openapi.yml'
    ],
    maxFileSize: 10 * 1024 * 1024, // 10MB
    encoding: 'utf8',
    cacheEnabled: true,
    cacheExpiry: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  },

  // Risk assessment thresholds
  risk: {
    // API usage frequency thresholds
    apiUsage: {
      low: 1,
      medium: 3,
      high: 5,
      critical: 10
    },
    
    // Service dependency thresholds
    dependencies: {
      lowDependency: 2,
      moderateDependency: 5,
      highDependency: 10,
      criticalDependency: 15
    },

    // Bottleneck detection thresholds
    bottleneck: {
      minServicesForBottleneck: 3,
      highRiskServiceCount: 5,
      criticalRiskServiceCount: 10
    },

    // Service health thresholds
    serviceHealth: {
      maxErrorsPerService: 5,
      maxWarningsPerService: 10,
      minEndpointsForActiveService: 1
    }
  },

  // Analysis processing settings
  analysis: {
    // Maximum number of services to process in parallel
    maxConcurrentServices: 5,
    
    // Timeout settings (in milliseconds)
    timeouts: {
      fileRead: 30000,        // 30 seconds
      parsing: 60000,         // 1 minute
      analysis: 300000,       // 5 minutes
      total: 1800000          // 30 minutes
    },

    // Progress reporting intervals
    progress: {
      reportingInterval: 10,  // Report progress every N services
      enableDetailedLogging: true,
      enablePerformanceMetrics: true
    },

    // Validation settings
    validation: {
      requireMinimumServices: 1,
      requireApiInventory: false,
      requireDependencyMap: false,
      strictValidation: false
    }
  },

  // Logging configuration
  logging: {
    level: 'info', // debug, info, warn, error
    enableConsole: true,
    enableFile: true,
    maxLogFiles: 10,
    maxLogSize: 50 * 1024 * 1024, // 50MB
    datePattern: 'YYYY-MM-DD'
  },

  // Report generation settings
  reports: {
    formats: ['json', 'markdown'],
    includeRawData: true,
    includeMetrics: true,
    maxAPIRankingEntries: 20,
    dualDirectoryOutput: true,
    
    // Report content settings
    content: {
      includeFrameworkStats: true,
      includeRiskAssessment: true,
      includeRecommendations: true,
      includeBottleneckAnalysis: true,
      includeDependencyGraph: false, // Large data, exclude by default
      maxServicesInTables: 50
    }
  },

  // Performance optimization settings
  performance: {
    enableCaching: true,
    enableCompression: false,
    batchSize: 100,
    memoryLimitMB: 512,
    gcThreshold: 0.8
  }
};

/**
 * Environment-specific configurations
 */
const ENVIRONMENT_CONFIGS = {
  development: {
    logging: {
      level: 'debug',
      enableConsole: true,
      enableFile: true
    },
    analysis: {
      maxConcurrentServices: 2,
      timeouts: {
        total: 600000 // 10 minutes for dev
      }
    },
    performance: {
      enableCaching: true,
      memoryLimitMB: 256
    }
  },

  testing: {
    paths: {
      analysis: 'test/fixtures/analysis',
      output: 'test/output',
      analysisSummary: 'test/analysis-summary'
    },
    logging: {
      level: 'warn',
      enableConsole: false,
      enableFile: false
    },
    analysis: {
      maxConcurrentServices: 1,
      timeouts: {
        total: 60000 // 1 minute for tests
      }
    },
    performance: {
      enableCaching: false,
      memoryLimitMB: 128
    }
  },

  production: {
    logging: {
      level: 'info',
      enableConsole: false,
      enableFile: true
    },
    analysis: {
      maxConcurrentServices: 10,
      timeouts: {
        total: 3600000 // 1 hour for production
      }
    },
    performance: {
      enableCaching: true,
      enableCompression: true,
      memoryLimitMB: 1024
    },
    reports: {
      content: {
        includeDependencyGraph: true
      }
    }
  }
};

/**
 * Configuration Manager Class
 */
class ConfigManager {
  constructor(environment = null) {
    this.environment = environment || this.detectEnvironment();
    this.config = this.buildConfig();
  }

  /**
   * Detect current environment
   * @returns {string} Environment name
   */
  detectEnvironment() {
    return process.env.NODE_ENV || 'development';
  }

  /**
   * Build complete configuration by merging default and environment configs
   * @returns {Object} Complete configuration object
   */
  buildConfig() {
    const envConfig = ENVIRONMENT_CONFIGS[this.environment] || {};
    return this.deepMerge(DEFAULT_CONFIG, envConfig);
  }

  /**
   * Get configuration value by path
   * @param {string} keyPath - Dot-notation path (e.g., 'risk.apiUsage.high')
   * @param {*} defaultValue - Default value if key not found
   * @returns {*} Configuration value
   */
  get(keyPath, defaultValue = undefined) {
    return this.getNestedValue(this.config, keyPath.split('.'), defaultValue);
  }

  /**
   * Set configuration value by path
   * @param {string} keyPath - Dot-notation path
   * @param {*} value - Value to set
   */
  set(keyPath, value) {
    this.setNestedValue(this.config, keyPath.split('.'), value);
  }

  /**
   * Update configuration with partial config object
   * @param {Object} partialConfig - Partial configuration to merge
   */
  update(partialConfig) {
    this.config = this.deepMerge(this.config, partialConfig);
  }

  /**
   * Load configuration from file
   * @param {string} configPath - Path to configuration file
   */
  loadFromFile(configPath) {
    try {
      const fileConfig = require(path.resolve(configPath));
      this.update(fileConfig);
    } catch (error) {
      console.warn(`Failed to load config from ${configPath}: ${error.message}`);
    }
  }

  /**
   * Export current configuration
   * @returns {Object} Current configuration
   */
  export() {
    return JSON.parse(JSON.stringify(this.config));
  }

  /**
   * Validate configuration
   * @returns {Object} Validation result
   */
  validate() {
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Validate required paths
    const requiredPaths = ['paths.analysis', 'paths.output'];
    requiredPaths.forEach(keyPath => {
      if (!this.get(keyPath)) {
        validation.errors.push(`Missing required configuration: ${keyPath}`);
        validation.isValid = false;
      }
    });

    // Validate numeric thresholds
    const numericPaths = [
      'risk.apiUsage.low',
      'risk.dependencies.lowDependency',
      'analysis.maxConcurrentServices'
    ];
    
    numericPaths.forEach(keyPath => {
      const value = this.get(keyPath);
      if (typeof value !== 'number' || value < 0) {
        validation.errors.push(`Invalid numeric value for ${keyPath}: ${value}`);
        validation.isValid = false;
      }
    });

    // Validate timeout values
    const timeouts = this.get('analysis.timeouts', {});
    Object.entries(timeouts).forEach(([key, value]) => {
      if (typeof value !== 'number' || value <= 0) {
        validation.warnings.push(`Invalid timeout value for ${key}: ${value}`);
      }
    });

    return validation;
  }

  /**
   * Get nested value from object using path array
   * @private
   */
  getNestedValue(obj, path, defaultValue) {
    return path.reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
  }

  /**
   * Set nested value in object using path array
   * @private
   */
  setNestedValue(obj, path, value) {
    const lastKey = path.pop();
    const target = path.reduce((current, key) => {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  /**
   * Deep merge two objects
   * @private
   */
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
}

// Create and export default instance
const configManager = new ConfigManager();

module.exports = {
  ConfigManager,
  DEFAULT_CONFIG,
  ENVIRONMENT_CONFIGS,
  config: configManager
}; 