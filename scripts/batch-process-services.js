#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Batch process multiple services automatically
 */
class BatchServiceProcessor {
    constructor() {
        this.processedServices = [];
        this.failedServices = [];
        this.totalProcessed = 0;
    }

    /**
     * Get list of all service directories
     */
    getAllServices() {
        const dirs = fs.readdirSync('.', { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .filter(name => name.match(/(trunk|dev|main)$/))
            .sort();
        
        console.log(`📋 Found ${dirs.length} service directories`);
        return dirs;
    }

    /**
     * Check which services have already been processed
     */
    getProcessedServices() {
        const analysisDir = '.analysis';
        if (!fs.existsSync(analysisDir)) {
            return [];
        }
        
        return fs.readdirSync(analysisDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    }

    /**
     * Process a single service
     */
    async processSingleService(serviceName) {
        try {
            console.log(`\n🔍 Processing: ${serviceName}`);
            
            // Step 1: Run analysis
            console.log(`  📊 Running analysis...`);
            const analysisOutput = execSync(`node scripts/api-analyzer.js ${serviceName}`, 
                { encoding: 'utf-8', stdio: 'pipe' });
            
            // Extract metrics from analysis output
            const endpointMatch = analysisOutput.match(/Endpoints: (\d+)/);
            const schemaMatch = analysisOutput.match(/Schemas: (\d+)/);
            const dependencyMatch = analysisOutput.match(/Dependencies: (\d+)/);
            const frameworkMatch = analysisOutput.match(/Framework: ([^\s]+)/);
            
            const metrics = {
                endpoints: endpointMatch ? parseInt(endpointMatch[1]) : 0,
                schemas: schemaMatch ? parseInt(schemaMatch[1]) : 0,
                dependencies: dependencyMatch ? parseInt(dependencyMatch[1]) : 0,
                framework: frameworkMatch ? frameworkMatch[1] : 'unknown'
            };
            
            // Step 2: Generate documentation
            console.log(`  📝 Generating documentation...`);
            execSync(`node scripts/output-generator.js .analysis/${serviceName}/${serviceName}-analysis.json ${serviceName}`, 
                { encoding: 'utf-8', stdio: 'pipe' });
            
            // Step 3: Git commit
            console.log(`  💾 Committing changes...`);
            execSync(`git add .`, { encoding: 'utf-8', stdio: 'pipe' });
            const commitMsg = `docs: API analysis for ${serviceName}

- ${metrics.framework} service with ${metrics.endpoints} endpoints, ${metrics.schemas} schemas, ${metrics.dependencies} dependencies
- Analysis saved to .analysis/${serviceName}/
- Generated api-inventory.md, openapi.yaml, dependency-map.json`;
            
            execSync(`git commit -m "${commitMsg}"`, { encoding: 'utf-8', stdio: 'pipe' });
            execSync(`git push origin main`, { encoding: 'utf-8', stdio: 'pipe' });
            
            this.processedServices.push({
                name: serviceName,
                ...metrics,
                status: 'completed'
            });
            
            this.totalProcessed++;
            console.log(`  ✅ ${serviceName} completed (${this.totalProcessed} total)`);
            
            return true;
            
        } catch (error) {
            console.error(`  ❌ Error processing ${serviceName}:`, error.message);
            this.failedServices.push({
                name: serviceName,
                error: error.message
            });
            return false;
        }
    }

    /**
     * Process services in batches
     */
    async processBatch(services, startIndex = 0, batchSize = 5) {
        const batch = services.slice(startIndex, startIndex + batchSize);
        
        console.log(`\n🚀 Processing batch ${Math.floor(startIndex/batchSize) + 1}: ${batch.join(', ')}`);
        
        for (const service of batch) {
            await this.processSingleService(service);
        }
        
        // Progress report
        const completed = startIndex + batch.length;
        const total = services.length;
        const percentage = ((completed / total) * 100).toFixed(1);
        
        console.log(`\n📊 BATCH COMPLETE - Progress: ${completed}/${total} (${percentage}%)`);
        console.log(`✅ Successful: ${this.processedServices.length}`);
        console.log(`❌ Failed: ${this.failedServices.length}`);
        
        return completed < total;
    }

    /**
     * Generate final report
     */
    generateReport() {
        console.log(`\n📋 FINAL PROCESSING REPORT`);
        console.log(`==========================================`);
        console.log(`Total Processed: ${this.totalProcessed}`);
        console.log(`Successful: ${this.processedServices.length}`);
        console.log(`Failed: ${this.failedServices.length}`);
        
        if (this.processedServices.length > 0) {
            console.log(`\n✅ COMPLETED SERVICES:`);
            for (const service of this.processedServices) {
                console.log(`  - ${service.name}: ${service.framework} - ${service.endpoints} endpoints, ${service.schemas} schemas, ${service.dependencies} deps`);
            }
        }
        
        if (this.failedServices.length > 0) {
            console.log(`\n❌ FAILED SERVICES:`);
            for (const service of this.failedServices) {
                console.log(`  - ${service.name}: ${service.error}`);
            }
        }
    }
}

// Main execution
if (require.main === module) {
    const processor = new BatchServiceProcessor();
    
    // Get services to process (exclude already processed ones)
    const allServices = processor.getAllServices();
    const alreadyProcessed = processor.getProcessedServices();
    const servicesToProcess = allServices.filter(service => !alreadyProcessed.includes(service));
    
    console.log(`📊 Services Status:`);
    console.log(`  Total Available: ${allServices.length}`);
    console.log(`  Already Processed: ${alreadyProcessed.length}`);
    console.log(`  Remaining: ${servicesToProcess.length}`);
    
    if (servicesToProcess.length === 0) {
        console.log(`✅ All services have been processed!`);
        process.exit(0);
    }
    
    console.log(`\n🚀 Starting batch processing of ${servicesToProcess.length} remaining services...`);
    
    // Process all remaining services
    (async () => {
        let startIndex = 0;
        const batchSize = 3; // Process 3 services at a time
        
        while (startIndex < servicesToProcess.length) {
            await processor.processBatch(servicesToProcess, startIndex, batchSize);
            startIndex += batchSize;
            
            // Small delay between batches
            if (startIndex < servicesToProcess.length) {
                console.log(`⏳ Pausing 2 seconds before next batch...`);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        processor.generateReport();
        console.log(`\n🎉 ALL SERVICES PROCESSING COMPLETE!`);
    })();
}

module.exports = BatchServiceProcessor; 