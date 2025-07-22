#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * API Analyzer - Static Code Analysis for API Endpoints
 * Analyzes FastAPI, Express.js, Spring Boot, and other frameworks
 * This script only reads and parses source files - no code execution
 */

class APIAnalyzer {
    constructor(servicePath) {
        this.servicePath = servicePath;
        this.serviceName = path.basename(servicePath);
        this.endpoints = [];
        this.schemas = [];
        this.dependencies = [];
        this.framework = 'unknown';
        this.language = 'unknown';
    }

    /**
     * Analyze the service to extract all API information
     */
    async analyze() {
        console.log(`🔍 Analyzing service: ${this.serviceName}`);
        console.log(`📁 Service path: ${this.servicePath}`);

        try {
            // Detect framework and language
            await this.detectFramework();
            
            // Extract API endpoints
            await this.extractEndpoints();
            
            // Extract schemas and models
            await this.extractSchemas();
            
            // Detect external dependencies
            await this.extractDependencies();
            
            console.log(`✅ Analysis complete for ${this.serviceName}`);
            return this.generateReport();
            
        } catch (error) {
            console.error('❌ Error during analysis:', error.message);
            return null;
        }
    }

    /**
     * Detect framework and language from configuration files
     */
    async detectFramework() {
        const configFiles = ['package.json', 'requirements.txt', 'pom.xml'];
        
        for (const configFile of configFiles) {
            const configPath = path.join(this.servicePath, configFile);
            
            if (fs.existsSync(configPath)) {
                console.log(`📋 Found config: ${configFile}`);
                
                if (configFile === 'requirements.txt') {
                    const content = fs.readFileSync(configPath, 'utf8');
                    this.language = 'Python';
                    
                    if (content.includes('fastapi')) {
                        this.framework = 'FastAPI';
                    } else if (content.includes('flask')) {
                        this.framework = 'Flask';
                    } else if (content.includes('django')) {
                        this.framework = 'Django';
                    }
                } else if (configFile === 'package.json') {
                    const packageJson = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                    this.language = 'JavaScript/TypeScript';
                    
                    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
                    if (deps.express) this.framework = 'Express.js';
                    else if (deps.fastify) this.framework = 'Fastify';
                    else if (deps.next) this.framework = 'Next.js';
                }
            }
        }
        
        console.log(`🏗️  Framework: ${this.framework} (${this.language})`);
    }

    /**
     * Extract API endpoints based on framework
     */
    async extractEndpoints() {
        console.log('🔎 Extracting API endpoints...');
        
        if (this.framework === 'FastAPI') {
            await this.extractFastAPIEndpoints();
        } else if (this.framework === 'Express.js') {
            await this.extractExpressEndpoints();
        }
        
        console.log(`📊 Found ${this.endpoints.length} endpoints`);
    }

    /**
     * Extract FastAPI endpoints from Python files
     */
    async extractFastAPIEndpoints() {
        const pythonFiles = this.findFiles(this.servicePath, /\.(py)$/);
        
        for (const filePath of pythonFiles) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.servicePath, filePath);
                
                // FastAPI route patterns
                const routePatterns = [
                    /@router\.(get|post|put|delete|patch|options|head)\s*\(\s*["']([^"']+)["']/g,
                    /@app\.(get|post|put|delete|patch|options|head)\s*\(\s*["']([^"']+)["']/g
                ];
                
                for (const pattern of routePatterns) {
                    let match;
                    while ((match = pattern.exec(content)) !== null) {
                        const [fullMatch, method, path] = match;
                        
                        // Extract function name and documentation
                        const functionMatch = content.substring(match.index).match(/async def (\w+)\s*\([^)]*\):\s*(?:\s*"""([^"]*?)""")?/);
                        const functionName = functionMatch ? functionMatch[1] : 'unknown';
                        const docString = functionMatch ? functionMatch[2] : null;
                        
                        // Extract parameters from function signature
                        const paramMatch = content.substring(match.index).match(/async def \w+\s*\(([^)]*)\):/);
                        const parameters = this.parseParameters(paramMatch ? paramMatch[1] : '');
                        
                        const endpoint = {
                            method: method.toUpperCase(),
                            path: path,
                            functionName: functionName,
                            description: docString ? docString.trim() : `${method.toUpperCase()} ${path}`,
                            file: relativePath,
                            parameters: parameters,
                            responses: this.extractResponses(content, match.index),
                            middleware: [],
                            authentication: this.detectAuthentication(content, match.index)
                        };
                        
                        this.endpoints.push(endpoint);
                        console.log(`  ✅ ${method.toUpperCase()} ${path} (${functionName})`);
                    }
                }
                
            } catch (error) {
                console.error(`  ⚠️  Error reading ${filePath}:`, error.message);
            }
        }
    }

    /**
     * Extract Express.js endpoints from JavaScript/TypeScript files
     */
    async extractExpressEndpoints() {
        const jsFiles = this.findFiles(this.servicePath, /\.(js|ts)$/);
        
        for (const filePath of jsFiles) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.servicePath, filePath);
                
                // Express route patterns
                const routePatterns = [
                    /router\.(get|post|put|delete|patch|options|head)\s*\(\s*["']([^"']+)["']/g,
                    /app\.(get|post|put|delete|patch|options|head)\s*\(\s*["']([^"']+)["']/g
                ];
                
                for (const pattern of routePatterns) {
                    let match;
                    while ((match = pattern.exec(content)) !== null) {
                        const [fullMatch, method, path] = match;
                        
                        const endpoint = {
                            method: method.toUpperCase(),
                            path: path,
                            file: relativePath,
                            description: `${method.toUpperCase()} ${path}`,
                            parameters: this.extractExpressParams(content, match.index),
                            responses: [],
                            middleware: [],
                            authentication: null
                        };
                        
                        this.endpoints.push(endpoint);
                        console.log(`  ✅ ${method.toUpperCase()} ${path}`);
                    }
                }
                
            } catch (error) {
                console.error(`  ⚠️  Error reading ${filePath}:`, error.message);
            }
        }
    }

    /**
     * Parse function parameters
     */
    parseParameters(paramString) {
        if (!paramString) return [];
        
        const params = [];
        const paramParts = paramString.split(',').map(p => p.trim());
        
        for (const part of paramParts) {
            if (part && !part.includes('self') && !part.includes('request') && !part.includes('Request')) {
                const [name, type] = part.split(':').map(s => s.trim());
                params.push({
                    name: name,
                    type: type || 'unknown',
                    required: !part.includes('='),
                    location: 'query' // Default for FastAPI
                });
            }
        }
        
        return params;
    }

    /**
     * Extract response information
     */
    extractResponses(content, startIndex) {
        const responses = [];
        
        // Look for return statements
        const returnMatches = content.substring(startIndex, startIndex + 1000).match(/return\s+({[^}]+}|\w+)/g);
        if (returnMatches) {
            for (const returnMatch of returnMatches) {
                responses.push({
                    status: 200,
                    description: 'Success response',
                    example: returnMatch.replace('return ', '').trim()
                });
            }
        }
        
        return responses;
    }

    /**
     * Detect authentication requirements
     */
    detectAuthentication(content, startIndex) {
        const authPatterns = [
            'Depends(get_current_user)',
            'HTTPBearer',
            'OAuth2PasswordBearer',
            '@require_auth',
            'jwt_required'
        ];
        
        for (const pattern of authPatterns) {
            if (content.includes(pattern)) {
                return { type: 'bearer_token', description: pattern };
            }
        }
        
        return null;
    }

    /**
     * Extract schemas and data models
     */
    async extractSchemas() {
        console.log('📝 Extracting schemas and models...');
        
        if (this.framework === 'FastAPI') {
            await this.extractPydanticModels();
        }
    }

    /**
     * Extract Pydantic models for FastAPI
     */
    async extractPydanticModels() {
        const pythonFiles = this.findFiles(this.servicePath, /\.(py)$/);
        
        for (const filePath of pythonFiles) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.servicePath, filePath);
                
                // Look for Pydantic BaseModel classes
                const classPattern = /class\s+(\w+)\s*\([^)]*BaseModel[^)]*\):\s*([\s\S]*?)(?=\n\S|\nclass|\n$)/g;
                let match;
                
                while ((match = classPattern.exec(content)) !== null) {
                    const [fullMatch, className, classBody] = match;
                    
                    const fields = this.extractPydanticFields(classBody);
                    
                    const schema = {
                        name: className,
                        type: 'pydantic_model',
                        file: relativePath,
                        fields: fields,
                        description: this.extractClassDocstring(classBody)
                    };
                    
                    this.schemas.push(schema);
                    console.log(`  📄 Schema: ${className} (${fields.length} fields)`);
                }
                
            } catch (error) {
                console.error(`  ⚠️  Error extracting schemas from ${filePath}:`, error.message);
            }
        }
    }

    /**
     * Extract Pydantic model fields
     */
    extractPydanticFields(classBody) {
        const fields = [];
        const fieldPattern = /(\w+)\s*:\s*([^\n=]+)(?:\s*=\s*([^\n]+))?/g;
        let match;
        
        while ((match = fieldPattern.exec(classBody)) !== null) {
            const [fullMatch, fieldName, fieldType, defaultValue] = match;
            
            if (!fieldName.startsWith('_') && fieldName !== 'model_config') {
                fields.push({
                    name: fieldName,
                    type: fieldType.trim(),
                    required: !defaultValue,
                    default: defaultValue ? defaultValue.trim() : null
                });
            }
        }
        
        return fields;
    }

    /**
     * Extract class docstring
     */
    extractClassDocstring(classBody) {
        const docMatch = classBody.match(/^\s*"""([^"]+)"""/);
        return docMatch ? docMatch[1].trim() : null;
    }

    /**
     * Extract external dependencies
     */
    async extractDependencies() {
        console.log('🔗 Extracting external dependencies...');
        
        // Check requirements.txt for Python dependencies
        const reqPath = path.join(this.servicePath, 'requirements.txt');
        if (fs.existsSync(reqPath)) {
            const content = fs.readFileSync(reqPath, 'utf8');
            const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
            
            for (const line of lines) {
                const [name, version] = line.split('==');
                if (name) {
                    this.dependencies.push({
                        name: name.trim(),
                        version: version ? version.trim() : 'latest',
                        type: 'python_package'
                    });
                }
            }
        }
        
        // Look for external API calls in code
        await this.extractExternalAPICalls();
        
        console.log(`📦 Found ${this.dependencies.length} dependencies`);
    }

    /**
     * Extract external API calls from code
     */
    async extractExternalAPICalls() {
        const sourceFiles = this.findFiles(this.servicePath, /\.(py|js|ts)$/);
        
        for (const filePath of sourceFiles) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Look for HTTP client calls
                const httpPatterns = [
                    /requests\.(get|post|put|delete|patch)\s*\(\s*["']([^"']+)["']/g,
                    /axios\.(get|post|put|delete|patch)\s*\(\s*["']([^"']+)["']/g,
                    /fetch\s*\(\s*["']([^"']+)["']/g
                ];
                
                for (const pattern of httpPatterns) {
                    let match;
                    while ((match = pattern.exec(content)) !== null) {
                        const url = match[2] || match[1];
                        if (url && (url.startsWith('http') || url.includes('api'))) {
                            this.dependencies.push({
                                name: url,
                                type: 'external_api',
                                method: match[1] ? match[1].toUpperCase() : 'GET',
                                file: path.relative(this.servicePath, filePath)
                            });
                        }
                    }
                }
                
            } catch (error) {
                console.error(`  ⚠️  Error scanning ${filePath} for API calls:`, error.message);
            }
        }
    }

    /**
     * Find files matching pattern recursively
     */
    findFiles(dir, pattern) {
        const files = [];
        
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                
                if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== '__pycache__' && entry.name !== 'node_modules') {
                    files.push(...this.findFiles(fullPath, pattern));
                } else if (entry.isFile() && pattern.test(entry.name)) {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            // Skip directories we can't read
        }
        
        return files;
    }

    /**
     * Generate comprehensive analysis report
     */
    generateReport() {
        const report = {
            service: {
                name: this.serviceName,
                path: this.servicePath,
                framework: this.framework,
                language: this.language,
                analyzed_at: new Date().toISOString()
            },
            api: {
                total_endpoints: this.endpoints.length,
                endpoints: this.endpoints,
                schemas: this.schemas
            },
            dependencies: {
                total: this.dependencies.length,
                external_apis: this.dependencies.filter(d => d.type === 'external_api'),
                packages: this.dependencies.filter(d => d.type !== 'external_api')
            },
            summary: {
                methods: this.getMethodSummary(),
                has_authentication: this.endpoints.some(e => e.authentication),
                has_documentation: this.endpoints.some(e => e.description && e.description.length > 20)
            }
        };
        
        return report;
    }

    /**
     * Get HTTP methods summary
     */
    getMethodSummary() {
        const methods = {};
        for (const endpoint of this.endpoints) {
            methods[endpoint.method] = (methods[endpoint.method] || 0) + 1;
        }
        return methods;
    }
}

// Main execution
if (require.main === module) {
    const servicePath = process.argv[2] || process.cwd();
    
    if (!fs.existsSync(servicePath)) {
        console.error('❌ Service path does not exist:', servicePath);
        process.exit(1);
    }
    
    const analyzer = new APIAnalyzer(servicePath);
    
    analyzer.analyze().then(report => {
        if (report) {
            // Save report
            const outputPath = path.join(process.cwd(), 'output', `${report.service.name}-analysis.json`);
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
            
            console.log('\n📊 Analysis Summary:');
            console.log(`  Service: ${report.service.name} (${report.service.framework})`);
            console.log(`  Endpoints: ${report.api.total_endpoints}`);
            console.log(`  Schemas: ${report.api.schemas.length}`);
            console.log(`  Dependencies: ${report.dependencies.total}`);
            console.log(`  Methods: ${Object.entries(report.summary.methods).map(([k,v]) => `${k}(${v})`).join(', ')}`);
            console.log(`\n💾 Report saved to: ${outputPath}`);
        } else {
            console.log('❌ Analysis failed');
            process.exit(1);
        }
    }).catch(error => {
        console.error('❌ Analysis error:', error);
        process.exit(1);
    });
}

module.exports = APIAnalyzer; 