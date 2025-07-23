#!/usr/bin/env node

const { program } = require('commander');
const APIAnalyzer = require('./api-analyzer');
const ReportGenerator = require('./report-generator');
const { config } = require('../config/analysis-config');
const { logger } = require('./logger');
const fs = require('fs').promises;
const path = require('path');

/**
 * Command Line Interface for API Usage Analysis
 * Provides comprehensive CLI for running analysis with various options
 */

// Define CLI version and description
program
  .name('api-analyzer')
  .description('Analyze API usage patterns across microservices')
  .version('1.0.0');

// Main analysis command
program
  .command('analyze')
  .description('Run complete API usage analysis')
  .option('-i, --input <path>', 'Analysis directory path', config.get('paths.analysis'))
  .option('-o, --output <path>', 'Output directory path', config.get('paths.output'))
  .option('-c, --config <path>', 'Configuration file path')
  .option('-e, --env <environment>', 'Environment (development, testing, production)', 'development')
  .option('-v, --verbose', 'Enable verbose logging')
  .option('-q, --quiet', 'Suppress console output')
  .option('--no-cache', 'Disable caching')
  .option('--no-reports', 'Skip report generation')
  .option('--json-only', 'Generate only JSON reports')
  .option('--markdown-only', 'Generate only Markdown reports')
  .option('--timeout <seconds>', 'Analysis timeout in seconds', '1800')
  .action(async (options) => {
    try {
      await runAnalysis(options);
    } catch (error) {
      console.error('Analysis failed:', error.message);
      process.exit(1);
    }
  });

// Service discovery command
program
  .command('discover')
  .description('Discover services without running full analysis')
  .option('-i, --input <path>', 'Analysis directory path', config.get('paths.analysis'))
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (options) => {
    try {
      await discoverServices(options);
    } catch (error) {
      console.error('Service discovery failed:', error.message);
      process.exit(1);
    }
  });

// Configuration command
program
  .command('config')
  .description('Display current configuration')
  .option('-e, --env <environment>', 'Environment', 'development')
  .option('-p, --path <keyPath>', 'Specific configuration path to display')
  .action(async (options) => {
    try {
      displayConfiguration(options);
    } catch (error) {
      console.error('Configuration display failed:', error.message);
      process.exit(1);
    }
  });

// Validation command
program
  .command('validate')
  .description('Validate analysis directory and configuration')
  .option('-i, --input <path>', 'Analysis directory path', config.get('paths.analysis'))
  .option('-c, --config <path>', 'Configuration file path')
  .option('--strict', 'Enable strict validation')
  .action(async (options) => {
    try {
      await validateSetup(options);
    } catch (error) {
      console.error('Validation failed:', error.message);
      process.exit(1);
    }
  });

// Report generation command
program
  .command('report')
  .description('Generate reports from existing analysis data')
  .option('-i, --input <path>', 'Input analysis JSON file')
  .option('-o, --output <path>', 'Output directory path', config.get('paths.output'))
  .option('--json-only', 'Generate only JSON reports')
  .option('--markdown-only', 'Generate only Markdown reports')
  .action(async (options) => {
    try {
      await generateReports(options);
    } catch (error) {
      console.error('Report generation failed:', error.message);
      process.exit(1);
    }
  });

/**
 * Run complete API usage analysis
 * @param {Object} options - CLI options
 */
async function runAnalysis(options) {
  // Configure logging
  if (options.verbose) {
    config.set('logging.level', 'debug');
  } else if (options.quiet) {
    config.set('logging.enableConsole', false);
  }

  // Load custom configuration
  if (options.config) {
    config.loadFromFile(options.config);
  }

  // Set environment
  process.env.NODE_ENV = options.env;

  // Update configuration with CLI options
  if (options.noCahe) {
    config.set('performance.enableCaching', false);
  }

  // Set timeout
  const timeoutMs = parseInt(options.timeout) * 1000;
  config.set('analysis.timeouts.total', timeoutMs);

  console.log('🚀 Starting API Usage Analysis...');
  console.log(`📁 Analysis Directory: ${options.input}`);
  console.log(`📊 Output Directory: ${options.output}`);
  console.log(`⚙️  Environment: ${options.env}`);
  console.log(`⏱️  Timeout: ${options.timeout} seconds`);

  // Initialize analyzer
  const analyzer = new APIAnalyzer({
    analysisPath: options.input,
    outputPath: options.output
  });

  // Run analysis
  const startTime = Date.now();
  const results = await analyzer.analyze();
  const duration = Math.round((Date.now() - startTime) / 1000);

  console.log('\n✅ Analysis completed successfully!');
  console.log(`⏱️  Duration: ${duration} seconds`);

  // Display summary
  const summary = analyzer.getSummary();
  console.log('\n📋 Summary:');
  console.log(`   Services: ${summary.services.successful}/${summary.services.total}`);
  console.log(`   APIs: ${summary.apis.total}`);
  console.log(`   Cross-Service APIs: ${summary.apis.crossService}`);
  console.log(`   Bottlenecks: ${summary.apis.bottlenecks}`);

  if (summary.services.errors > 0) {
    console.log(`   ⚠️  Errors: ${summary.services.errors}`);
  }

  // Generate reports
  if (!options.noReports) {
    console.log('\n📝 Generating reports...');
    const reportGenerator = new ReportGenerator({
      outputDirs: [options.output, config.get('paths.analysisSummary')]
    });

    const reportPaths = await reportGenerator.generateAllReports(results, summary);
    
    console.log('📄 Reports generated:');
    if (options.jsonOnly) {
      reportPaths.json.forEach(path => console.log(`   📄 ${path}`));
    } else if (options.markdownOnly) {
      reportPaths.markdown.forEach(path => console.log(`   📝 ${path}`));
    } else {
      [...reportPaths.json, ...reportPaths.markdown].forEach(path => 
        console.log(`   📄 ${path}`)
      );
    }
  }

  console.log('\n🎉 API Usage Analysis completed successfully!');
}

/**
 * Discover services in analysis directory
 * @param {Object} options - CLI options
 */
async function discoverServices(options) {
  const DirectoryScanner = require('./directory-scanner');
  
  console.log('🔍 Discovering services...');
  console.log(`📁 Analysis Directory: ${options.input}`);

  const scanner = new DirectoryScanner(options.input);
  const services = await scanner.discoverServices();
  const summary = await scanner.getDiscoverySummary();

  console.log('\n📋 Discovery Results:');
  console.log(`   Total Services: ${summary.totalServices}`);
  console.log(`   With API Inventory: ${summary.servicesWithApiInventory}`);
  console.log(`   With Dependency Map: ${summary.servicesWithDependencyMap}`);
  console.log(`   With OpenAPI: ${summary.servicesWithOpenAPI}`);

  console.log('\n📄 File Type Distribution:');
  Object.entries(summary.fileTypeCounts).forEach(([fileType, count]) => {
    console.log(`   ${fileType}: ${count} services`);
  });

  if (options.verbose) {
    console.log('\n📋 Services Found:');
    services.forEach(service => {
      console.log(`   📁 ${service.name}`);
      Object.keys(service.files).forEach(file => {
        console.log(`      📄 ${file}`);
      });
    });
  }
}

/**
 * Display current configuration
 * @param {Object} options - CLI options
 */
function displayConfiguration(options) {
  console.log('⚙️  Configuration:');
  console.log(`   Environment: ${options.env}`);

  if (options.path) {
    const value = config.get(options.path);
    console.log(`   ${options.path}: ${JSON.stringify(value, null, 2)}`);
  } else {
    console.log(JSON.stringify(config.export(), null, 2));
  }
}

/**
 * Validate analysis setup
 * @param {Object} options - CLI options
 */
async function validateSetup(options) {
  console.log('🔍 Validating analysis setup...');

  // Load custom configuration if provided
  if (options.config) {
    config.loadFromFile(options.config);
  }

  // Validate configuration
  const configValidation = config.validate();
  console.log('\n⚙️  Configuration Validation:');
  
  if (configValidation.isValid) {
    console.log('   ✅ Configuration is valid');
  } else {
    console.log('   ❌ Configuration has errors:');
    configValidation.errors.forEach(error => {
      console.log(`      • ${error}`);
    });
  }

  if (configValidation.warnings.length > 0) {
    console.log('   ⚠️  Configuration warnings:');
    configValidation.warnings.forEach(warning => {
      console.log(`      • ${warning}`);
    });
  }

  // Validate analysis directory
  console.log('\n📁 Directory Validation:');
  try {
    const stats = await fs.stat(options.input);
    if (stats.isDirectory()) {
      console.log(`   ✅ Analysis directory exists: ${options.input}`);
      
      // Check for services
      const DirectoryScanner = require('./directory-scanner');
      const scanner = new DirectoryScanner(options.input);
      const services = await scanner.discoverServices();
      
      if (services.length > 0) {
        console.log(`   ✅ Found ${services.length} services`);
        
        if (options.strict) {
          // Strict validation
          let validServices = 0;
          services.forEach(service => {
            const hasApiInventory = service.files['api-inventory.md'];
            const hasDependencyMap = service.files['dependency-map.json'];
            
            if (hasApiInventory && hasDependencyMap) {
              validServices++;
            } else {
              console.log(`   ⚠️  ${service.name} missing required files`);
            }
          });
          
          console.log(`   📊 Services with all required files: ${validServices}/${services.length}`);
        }
      } else {
        console.log('   ⚠️  No services found in analysis directory');
      }
    } else {
      console.log(`   ❌ Path is not a directory: ${options.input}`);
    }
  } catch (error) {
    console.log(`   ❌ Cannot access analysis directory: ${error.message}`);
  }

  console.log('\n🔍 Validation completed');
}

/**
 * Generate reports from existing analysis data
 * @param {Object} options - CLI options
 */
async function generateReports(options) {
  console.log('📝 Generating reports from existing data...');

  if (!options.input) {
    throw new Error('Input analysis file is required');
  }

  // Load analysis data
  const analysisData = JSON.parse(await fs.readFile(options.input, 'utf8'));
  
  // Extract results and summary
  const results = {
    analysis: analysisData.analysis,
    services: analysisData.services,
    errors: analysisData.errors || [],
    warnings: analysisData.warnings || []
  };
  
  const summary = analysisData.summary;

  // Generate reports
  const reportGenerator = new ReportGenerator({
    outputDirs: [options.output, config.get('paths.analysisSummary')]
  });

  const reportPaths = await reportGenerator.generateAllReports(results, summary);
  
  console.log('📄 Reports generated:');
  if (options.jsonOnly) {
    reportPaths.json.forEach(path => console.log(`   📄 ${path}`));
  } else if (options.markdownOnly) {
    reportPaths.markdown.forEach(path => console.log(`   📝 ${path}`));
  } else {
    [...reportPaths.json, ...reportPaths.markdown].forEach(path => 
      console.log(`   📄 ${path}`)
    );
  }
}

// Parse command line arguments
if (require.main === module) {
  program.parse();
}

module.exports = {
  program,
  runAnalysis,
  discoverServices,
  displayConfiguration,
  validateSetup,
  generateReports
}; 