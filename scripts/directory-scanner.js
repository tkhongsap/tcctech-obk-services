const fs = require('fs').promises;
const path = require('path');

/**
 * Directory Scanner for API Analysis
 * Discovers all services in /analysis directory and identifies file types
 */
class DirectoryScanner {
  constructor(analysisDir = './analysis') {
    this.analysisDir = analysisDir;
    this.requiredFiles = [
      'api-inventory.md',
      'dependency-map.json', 
      'openapi.yaml'
    ];
  }

  /**
   * Discover all service directories in the analysis folder
   * @returns {Promise<Array>} Array of service directory objects
   */
  async discoverServices() {
    try {
      const services = [];
      const entries = await fs.readdir(this.analysisDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const servicePath = path.join(this.analysisDir, entry.name);
          const serviceInfo = await this.analyzeServiceDirectory(servicePath, entry.name);
          services.push(serviceInfo);
        }
      }

      console.log(`Discovered ${services.length} services in ${this.analysisDir}`);
      return services;
    } catch (error) {
      console.error('Error discovering services:', error.message);
      throw error;
    }
  }

  /**
   * Analyze a single service directory for required files
   * @param {string} servicePath - Path to service directory
   * @param {string} serviceName - Name of the service
   * @returns {Promise<Object>} Service analysis object
   */
  async analyzeServiceDirectory(servicePath, serviceName) {
    const serviceInfo = {
      name: serviceName,
      path: servicePath,
      files: {},
      missingFiles: [],
      isComplete: true
    };

    try {
      const files = await fs.readdir(servicePath);
      
      // Check for required files
      for (const requiredFile of this.requiredFiles) {
        const filePath = path.join(servicePath, requiredFile);
        
        if (files.includes(requiredFile)) {
          const stats = await fs.stat(filePath);
          serviceInfo.files[requiredFile] = {
            exists: true,
            path: filePath,
            size: stats.size,
            modified: stats.mtime
          };
        } else {
          serviceInfo.files[requiredFile] = { exists: false };
          serviceInfo.missingFiles.push(requiredFile);
          serviceInfo.isComplete = false;
        }
      }

      // Check for additional analysis files
      const additionalFiles = files.filter(file => 
        file.endsWith('-analysis.json') || 
        file.endsWith('-api-documentation.csv')
      );
      
      serviceInfo.additionalFiles = additionalFiles;

    } catch (error) {
      console.error(`Error analyzing service ${serviceName}:`, error.message);
      serviceInfo.error = error.message;
      serviceInfo.isComplete = false;
    }

    return serviceInfo;
  }

  /**
   * Get summary statistics of discovered services
   * @param {Array} services - Array of service objects
   * @returns {Object} Summary statistics
   */
  getSummary(services) {
    const summary = {
      total: services.length,
      complete: services.filter(s => s.isComplete).length,
      incomplete: services.filter(s => !s.isComplete).length,
      missingFiles: {},
      frameworks: {}
    };

    // Count missing files
    services.forEach(service => {
      service.missingFiles.forEach(file => {
        summary.missingFiles[file] = (summary.missingFiles[file] || 0) + 1;
      });
    });

    summary.completionRate = ((summary.complete / summary.total) * 100).toFixed(1);
    
    return summary;
  }

  /**
   * Generate detailed report of service discovery
   * @returns {Promise<Object>} Complete discovery report
   */
  async generateReport() {
    const services = await this.discoverServices();
    const summary = this.getSummary(services);
    
    const report = {
      timestamp: new Date().toISOString(),
      analysisDirectory: this.analysisDir,
      summary,
      services: services.sort((a, b) => a.name.localeCompare(b.name))
    };

    console.log('\n=== Service Discovery Summary ===');
    console.log(`Total Services: ${summary.total}`);
    console.log(`Complete Services: ${summary.complete}`);
    console.log(`Incomplete Services: ${summary.incomplete}`);
    console.log(`Completion Rate: ${summary.completionRate}%`);
    
    if (Object.keys(summary.missingFiles).length > 0) {
      console.log('\nMissing Files:');
      Object.entries(summary.missingFiles).forEach(([file, count]) => {
        console.log(`  ${file}: ${count} services missing`);
      });
    }

    return report;
  }
}

module.exports = DirectoryScanner;

// CLI execution
if (require.main === module) {
  const scanner = new DirectoryScanner();
  scanner.generateReport()
    .then(report => {
      console.log('\nFull report generated successfully');
      // Optional: save report to file
      // fs.writeFile('output/discovery-report.json', JSON.stringify(report, null, 2));
    })
    .catch(error => {
      console.error('Error generating report:', error);
      process.exit(1);
    });
} 