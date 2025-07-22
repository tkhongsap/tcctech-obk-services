#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Service Discovery Script - Read-Only Analysis
 * Scans directories to identify all service folders from automate-trunk to tcct-serviceabstraction-dev
 * This script only reads files and directories - no code execution
 */

class ServiceDiscovery {
    constructor() {
        this.rootDir = process.cwd();
        this.servicePatterns = /(trunk|dev|main)$/;
        this.discoveredServices = [];
        this.configFiles = ['package.json', 'pom.xml', 'requirements.txt', 'Dockerfile', 'docker-compose.yml'];
    }

    /**
     * Scan directory structure to find all service folders
     */
    scanDirectories() {
        console.log('🔍 Starting service discovery...');
        console.log(`📁 Scanning root directory: ${this.rootDir}`);
        
        try {
            const entries = fs.readdirSync(this.rootDir, { withFileTypes: true });
            
            for (const entry of entries) {
                if (entry.isDirectory() && this.servicePatterns.test(entry.name)) {
                    console.log(`✅ Found service folder: ${entry.name}`);
                    this.analyzeServiceFolder(entry.name);
                }
            }
            
            console.log(`\n📊 Discovery complete! Found ${this.discoveredServices.length} services`);
            return this.discoveredServices;
            
        } catch (error) {
            console.error('❌ Error scanning directories:', error.message);
            return [];
        }
    }

    /**
     * Analyze individual service folder to detect project type and framework
     */
    analyzeServiceFolder(folderName) {
        const folderPath = path.join(this.rootDir, folderName);
        const service = {
            name: folderName,
            path: folderPath,
            type: 'unknown',
            framework: 'unknown',
            language: 'unknown',
            configFiles: [],
            hasAPI: false,
            apiFiles: [],
            lastModified: null
        };

        try {
            // Check folder stats
            const stats = fs.statSync(folderPath);
            service.lastModified = stats.mtime;

            // Scan for configuration files
            const files = fs.readdirSync(folderPath);
            
            for (const file of files) {
                if (this.configFiles.includes(file)) {
                    service.configFiles.push(file);
                    this.detectFrameworkFromConfig(service, file, folderPath);
                }
            }

            // Look for API-related files
            this.detectAPIFiles(service, folderPath);

            console.log(`  📋 ${folderName}: ${service.framework} (${service.language})`);
            
        } catch (error) {
            console.error(`  ❌ Error analyzing ${folderName}:`, error.message);
        }

        this.discoveredServices.push(service);
    }

    /**
     * Detect framework and language from configuration files
     */
    detectFrameworkFromConfig(service, configFile, folderPath) {
        const configPath = path.join(folderPath, configFile);
        
        try {
            if (configFile === 'package.json') {
                const packageJson = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                service.language = 'JavaScript/TypeScript';
                
                // Detect framework from dependencies
                const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
                if (deps.express) service.framework = 'Express.js';
                else if (deps.fastify) service.framework = 'Fastify';
                else if (deps.next) service.framework = 'Next.js';
                else if (deps.react) service.framework = 'React';
                else service.framework = 'Node.js';
                
            } else if (configFile === 'requirements.txt') {
                const requirements = fs.readFileSync(configPath, 'utf8');
                service.language = 'Python';
                
                if (requirements.includes('fastapi')) service.framework = 'FastAPI';
                else if (requirements.includes('flask')) service.framework = 'Flask';
                else if (requirements.includes('django')) service.framework = 'Django';
                else service.framework = 'Python';
                
            } else if (configFile === 'pom.xml') {
                const pom = fs.readFileSync(configPath, 'utf8');
                service.language = 'Java';
                
                if (pom.includes('spring-boot')) service.framework = 'Spring Boot';
                else if (pom.includes('spring')) service.framework = 'Spring';
                else service.framework = 'Java';
            }
            
            service.type = 'service';
            
        } catch (error) {
            console.error(`    ⚠️  Error reading ${configFile}:`, error.message);
        }
    }

    /**
     * Detect API-related files in the service
     */
    detectAPIFiles(service, folderPath) {
        const apiPatterns = [
            /route[s]?\.(js|ts|py)$/i,
            /controller[s]?\.(js|ts|py|java)$/i,
            /api\.(js|ts|py)$/i,
            /main\.(js|ts|py)$/i,
            /app\.(js|ts|py)$/i,
            /server\.(js|ts|py)$/i
        ];

        try {
            this.scanForAPIFiles(folderPath, apiPatterns, service.apiFiles);
            service.hasAPI = service.apiFiles.length > 0;
            
        } catch (error) {
            console.error(`    ⚠️  Error scanning for API files:`, error.message);
        }
    }

    /**
     * Recursively scan for API files
     */
    scanForAPIFiles(dirPath, patterns, apiFiles) {
        try {
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);
                
                if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
                    this.scanForAPIFiles(fullPath, patterns, apiFiles);
                } else if (entry.isFile()) {
                    for (const pattern of patterns) {
                        if (pattern.test(entry.name)) {
                            apiFiles.push(fullPath);
                            break;
                        }
                    }
                }
            }
        } catch (error) {
            // Skip directories we can't read
        }
    }

    /**
     * Save discovery results to JSON file
     */
    saveResults() {
        const outputPath = path.join(this.rootDir, 'data', 'service-inventory.json');
        const results = {
            timestamp: new Date().toISOString(),
            totalServices: this.discoveredServices.length,
            services: this.discoveredServices,
            summary: this.generateSummary()
        };

        try {
            fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
            console.log(`\n💾 Results saved to: ${outputPath}`);
            return outputPath;
        } catch (error) {
            console.error('❌ Error saving results:', error.message);
            return null;
        }
    }

    /**
     * Generate summary statistics
     */
    generateSummary() {
        const summary = {
            byFramework: {},
            byLanguage: {},
            withAPI: 0,
            withoutAPI: 0
        };

        for (const service of this.discoveredServices) {
            // Count by framework
            summary.byFramework[service.framework] = (summary.byFramework[service.framework] || 0) + 1;
            
            // Count by language
            summary.byLanguage[service.language] = (summary.byLanguage[service.language] || 0) + 1;
            
            // Count API services
            if (service.hasAPI) summary.withAPI++;
            else summary.withoutAPI++;
        }

        return summary;
    }
}

// Main execution
if (require.main === module) {
    const discovery = new ServiceDiscovery();
    const services = discovery.scanDirectories();
    
    if (services.length > 0) {
        const outputPath = discovery.saveResults();
        
        console.log('\n📈 Summary:');
        const summary = discovery.generateSummary();
        console.log(`  Services with APIs: ${summary.withAPI}`);
        console.log(`  Services without APIs: ${summary.withoutAPI}`);
        console.log('  Frameworks found:', Object.keys(summary.byFramework).join(', '));
        console.log('  Languages found:', Object.keys(summary.byLanguage).join(', '));
        
        if (outputPath) {
            console.log(`\n✅ Service discovery completed successfully!`);
            console.log(`📄 Results saved to: ${outputPath}`);
        }
    } else {
        console.log('❌ No services found');
        process.exit(1);
    }
}

module.exports = ServiceDiscovery; 