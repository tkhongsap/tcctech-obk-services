const fs = require('fs').promises;
const path = require('path');

/**
 * Directory Scanner for API Analysis
 * Discovers all services in the /analysis directory and their documentation files
 */
class DirectoryScanner {
  constructor(analysisPath = 'analysis') {
    this.analysisPath = analysisPath;
    this.supportedFiles = [
      'api-inventory.md',
      'dependency-map.json',
      'openapi.yaml',
      'openapi.yml'
    ];
  }

  /**
   * Discover all services in the analysis directory
   * @returns {Promise<Array>} Array of service objects with their file paths
   */
  async discoverServices() {
    try {
      const services = [];
      const analysisDir = await this.getAnalysisDirectory();
      
      if (!analysisDir) {
        throw new Error(`Analysis directory '${this.analysisPath}' not found`);
      }

      const entries = await fs.readdir(analysisDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const servicePath = path.join(analysisDir, entry.name);
          const serviceInfo = await this.scanService(entry.name, servicePath);
          
          if (serviceInfo.files.length > 0) {
            services.push(serviceInfo);
          }
        }
      }

      return services;
    } catch (error) {
      throw new Error(`Failed to discover services: ${error.message}`);
    }
  }

  /**
   * Scan a specific service directory for documentation files
   * @param {string} serviceName - Name of the service
   * @param {string} servicePath - Path to the service directory
   * @returns {Promise<Object>} Service information object
   */
  async scanService(serviceName, servicePath) {
    const serviceInfo = {
      name: serviceName,
      path: servicePath,
      files: {}
    };

    try {
      const files = await fs.readdir(servicePath);
      
      for (const file of files) {
        if (this.supportedFiles.includes(file)) {
          const filePath = path.join(servicePath, file);
          const stats = await fs.stat(filePath);
          
          serviceInfo.files[file] = {
            path: filePath,
            size: stats.size,
            modified: stats.mtime
          };
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan service ${serviceName}: ${error.message}`);
    }

    return serviceInfo;
  }

  /**
   * Get the analysis directory path
   * @returns {Promise<string|null>} Path to analysis directory or null if not found
   */
  async getAnalysisDirectory() {
    try {
      const stats = await fs.stat(this.analysisPath);
      return stats.isDirectory() ? this.analysisPath : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get summary statistics of discovered services
   * @returns {Promise<Object>} Summary statistics
   */
  async getDiscoverySummary() {
    const services = await this.discoverServices();
    
    const summary = {
      totalServices: services.length,
      servicesWithApiInventory: 0,
      servicesWithDependencyMap: 0,
      servicesWithOpenAPI: 0,
      fileTypeCounts: {}
    };

    this.supportedFiles.forEach(fileType => {
      summary.fileTypeCounts[fileType] = 0;
    });

    services.forEach(service => {
      Object.keys(service.files).forEach(fileName => {
        if (fileName === 'api-inventory.md') summary.servicesWithApiInventory++;
        if (fileName === 'dependency-map.json') summary.servicesWithDependencyMap++;
        if (fileName.startsWith('openapi.')) summary.servicesWithOpenAPI++;
        
        summary.fileTypeCounts[fileName] = (summary.fileTypeCounts[fileName] || 0) + 1;
      });
    });

    return summary;
  }
}

module.exports = DirectoryScanner;

// CLI execution
if (require.main === module) {
  const scanner = new DirectoryScanner();
  scanner.discoverServices()
    .then(services => {
      console.log('\n=== Service Discovery Summary ===');
      console.log(`Total Services: ${services.length}`);
      console.log(`Services with API Inventory: ${services.filter(s => s.files['api-inventory.md']).length}`);
      console.log(`Services with Dependency Map: ${services.filter(s => s.files['dependency-map.json']).length}`);
      console.log(`Services with OpenAPI: ${services.filter(s => Object.keys(s.files).some(f => f.startsWith('openapi.'))).length}`);
      
      console.log('\nFile Type Counts:');
      Object.entries(scanner.supportedFiles).forEach(([fileType, count]) => {
        console.log(`  ${fileType}: ${count} services`);
      });

      // Optional: save report to file
      // fs.writeFile('output/discovery-report.json', JSON.stringify(report, null, 2));
    })
    .catch(error => {
      console.error('Error discovering services:', error);
      process.exit(1);
    });
} 