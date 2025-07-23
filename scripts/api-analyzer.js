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
        this.baseUrl = null;
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
            
            // Detect service base URL
            await this.detectBaseUrl();
            
            // Extract API endpoints
            await this.extractEndpoints();
            
            // Extract schemas and models for payload information
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
     * Detect framework and language from configuration files and project structure
     */
    async detectFramework() {
        // .NET/C# Detection
        if (await this.detectDotNetFramework()) {
            console.log(`🏗️  Framework: ${this.framework} (${this.language})`);
            return;
        }
        
        // Java Detection
        if (await this.detectJavaFramework()) {
            console.log(`🏗️  Framework: ${this.framework} (${this.language})`);
            return;
        }
        
        // Go Detection
        if (await this.detectGoFramework()) {
            console.log(`🏗️  Framework: ${this.framework} (${this.language})`);
            return;
        }
        
        // Node.js/JavaScript/TypeScript Detection
        if (await this.detectNodeFramework()) {
            console.log(`🏗️  Framework: ${this.framework} (${this.language})`);
            return;
        }
        
        // Python Detection
        if (await this.detectPythonFramework()) {
            console.log(`🏗️  Framework: ${this.framework} (${this.language})`);
            return;
        }
        
        // Flutter/Dart Detection
        if (await this.detectFlutterFramework()) {
            console.log(`🏗️  Framework: ${this.framework} (${this.language})`);
            return;
        }
        
        console.log(`🏗️  Framework: ${this.framework} (${this.language})`);
    }

    /**
     * Detect service base URL from configuration files
     */
    async detectBaseUrl() {
        try {
            // Try docker-compose files
            const dockerComposeFiles = this.findFiles(this.servicePath, /docker-compose\.ya?ml$/);
            for (const filePath of dockerComposeFiles) {
                const content = fs.readFileSync(filePath, 'utf8');
                const portMatch = content.match(/ports:\s*-\s*["']?(\d+):(\d+)["']?/);
                if (portMatch) {
                    this.baseUrl = `http://localhost:${portMatch[1]}`;
                    console.log(`🌐 Base URL detected: ${this.baseUrl}`);
                    return;
                }
            }

            // Try package.json for Node.js services
            if (this.framework.includes('Node.js') || this.framework.includes('Express') || this.framework.includes('Next.js')) {
                const packageJsonPath = path.join(this.servicePath, 'package.json');
                if (fs.existsSync(packageJsonPath)) {
                    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                    if (packageJson.scripts?.dev?.includes('--port')) {
                        const portMatch = packageJson.scripts.dev.match(/--port[=\s](\d+)/);
                        if (portMatch) {
                            this.baseUrl = `http://localhost:${portMatch[1]}`;
                            console.log(`🌐 Base URL detected: ${this.baseUrl}`);
                            return;
                        }
                    }
                }
            }

            // Try .env files
            const envFiles = this.findFiles(this.servicePath, /\.env$/);
            for (const filePath of envFiles) {
                const content = fs.readFileSync(filePath, 'utf8');
                const portMatch = content.match(/PORT\s*=\s*(\d+)/);
                const urlMatch = content.match(/BASE_URL\s*=\s*(.+)/);
                if (urlMatch) {
                    this.baseUrl = urlMatch[1].trim().replace(/['"]/g, '');
                    console.log(`🌐 Base URL detected: ${this.baseUrl}`);
                    return;
                }
                if (portMatch) {
                    this.baseUrl = `http://localhost:${portMatch[1]}`;
                    console.log(`🌐 Base URL detected: ${this.baseUrl}`);
                    return;
                }
            }

            // Default based on service name patterns
            if (this.serviceName.includes('api') || this.serviceName.includes('backend') || this.serviceName.includes('service')) {
                this.baseUrl = `http://localhost:3000`; // Common default
                console.log(`🌐 Base URL defaulted: ${this.baseUrl}`);
            }
        } catch (error) {
            console.log(`⚠️  Could not detect base URL: ${error.message}`);
        }
    }

    /**
     * Detect .NET/C# ASP.NET Core framework
     */
    async detectDotNetFramework() {
        // Look for .csproj files
        const csprojFiles = this.findFiles(this.servicePath, /\.csproj$/);
        if (csprojFiles.length > 0) {
            console.log(`📋 Found config: .csproj files (${csprojFiles.length})`);
            this.language = 'C#';
            
            // Check for Controllers directory
            const controllersDir = path.join(this.servicePath, 'Controllers');
            const hasControllers = fs.existsSync(controllersDir) || this.findFiles(this.servicePath, /Controllers/i).length > 0;
            
            if (hasControllers) {
                this.framework = 'ASP.NET Core';
                return true;
            }
            
            // Check for Program.cs or Startup.cs
            const programCs = path.join(this.servicePath, 'Program.cs');
            const startupCs = path.join(this.servicePath, 'Startup.cs');
            if (fs.existsSync(programCs) || fs.existsSync(startupCs)) {
                this.framework = 'ASP.NET Core';
                return true;
            }
            
            this.framework = '.NET';
            return true;
        }
        return false;
    }

    /**
     * Detect Java Spring Boot framework
     */
    async detectJavaFramework() {
        const pomXml = path.join(this.servicePath, 'pom.xml');
        const buildGradle = path.join(this.servicePath, 'build.gradle');
        
        if (fs.existsSync(pomXml) || fs.existsSync(buildGradle)) {
            console.log(`📋 Found config: ${fs.existsSync(pomXml) ? 'pom.xml' : 'build.gradle'}`);
            this.language = 'Java';
            
            // Check for Spring Boot indicators
            if (fs.existsSync(pomXml)) {
                const content = fs.readFileSync(pomXml, 'utf8');
                if (content.includes('spring-boot-starter-web')) {
                    this.framework = 'Spring Boot';
                    return true;
                }
            }
            
            this.framework = 'Java';
            return true;
        }
        return false;
    }

    /**
     * Detect Go framework
     */
    async detectGoFramework() {
        const goMod = path.join(this.servicePath, 'go.mod');
        if (fs.existsSync(goMod)) {
            console.log(`📋 Found config: go.mod`);
            this.language = 'Go';
            
            const content = fs.readFileSync(goMod, 'utf8');
            if (content.includes('gin-gonic/gin')) {
                this.framework = 'Gin';
            } else if (content.includes('gofiber/fiber')) {
                this.framework = 'Fiber';
            } else if (content.includes('echo')) {
                this.framework = 'Echo';
            } else {
                this.framework = 'Go';
            }
            return true;
        }
        return false;
    }

    /**
     * Detect Node.js frameworks
     */
    async detectNodeFramework() {
        const packageJson = path.join(this.servicePath, 'package.json');
        if (fs.existsSync(packageJson)) {
            console.log(`📋 Found config: package.json`);
            const packageData = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
            this.language = 'JavaScript/TypeScript';
            
            const deps = { ...packageData.dependencies, ...packageData.devDependencies };
            
            // Check for Next.js API routes
            if (deps.next) {
                const hasApiDir = fs.existsSync(path.join(this.servicePath, 'pages', 'api')) ||
                                 fs.existsSync(path.join(this.servicePath, 'app', 'api')) ||
                                 fs.existsSync(path.join(this.servicePath, 'src', 'pages', 'api')) ||
                                 fs.existsSync(path.join(this.servicePath, 'src', 'app', 'api'));
                
                this.framework = hasApiDir ? 'Next.js' : 'Next.js';
                return true;
            }
            
            if (deps.express) this.framework = 'Express.js';
            else if (deps['@nestjs/core']) this.framework = 'NestJS';
            else if (deps.fastify) this.framework = 'Fastify';
            else if (deps.koa) this.framework = 'Koa';
            else this.framework = 'Node.js';
            
            return true;
        }
        return false;
    }

    /**
     * Detect Python frameworks
     */
    async detectPythonFramework() {
        const requirementsTxt = path.join(this.servicePath, 'requirements.txt');
        if (fs.existsSync(requirementsTxt)) {
            console.log(`📋 Found config: requirements.txt`);
            const content = fs.readFileSync(requirementsTxt, 'utf8');
            this.language = 'Python';
            
            if (content.includes('fastapi')) {
                this.framework = 'FastAPI';
            } else if (content.includes('flask')) {
                this.framework = 'Flask';
            } else if (content.includes('django')) {
                this.framework = 'Django';
            } else {
                this.framework = 'Python';
            }
            return true;
        }
        return false;
    }

    /**
     * Detect Flutter framework
     */
    async detectFlutterFramework() {
        const pubspecYaml = path.join(this.servicePath, 'pubspec.yaml');
        if (fs.existsSync(pubspecYaml)) {
            console.log(`📋 Found config: pubspec.yaml`);
            this.language = 'Dart';
            this.framework = 'Flutter';
            return true;
        }
        return false;
    }

    /**
     * Extract API endpoints based on framework
     */
    async extractEndpoints() {
        console.log('🔎 Extracting API endpoints...');
        
        if (this.framework === 'ASP.NET Core' || this.framework === '.NET') {
            await this.extractDotNetEndpoints();
        } else if (this.framework === 'Spring Boot') {
            await this.extractSpringBootEndpoints();
        } else if (this.framework === 'FastAPI') {
            await this.extractFastAPIEndpoints();
        } else if (this.framework === 'Express.js') {
            await this.extractExpressEndpoints();
        } else if (this.framework === 'NestJS') {
            await this.extractNestJSEndpoints();
        } else if (this.framework === 'Next.js') {
            await this.extractNextJSEndpoints();
        } else if (this.framework === 'Gin' || this.framework === 'Fiber' || this.framework === 'Go') {
            await this.extractGoEndpoints();
        }
        
        console.log(`📊 Found ${this.endpoints.length} endpoints`);
    }

    /**
     * Extract .NET/C# ASP.NET Core endpoints from controller files
     */
    async extractDotNetEndpoints() {
        const csFiles = this.findFiles(this.servicePath, /\.(cs)$/);
        for (const filePath of csFiles) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.servicePath, filePath);
                
                // Skip if not a controller file
                if (!content.includes('[ApiController]') && !content.includes(': ControllerBase') && 
                    !content.includes(': Controller') && !relativePath.includes('Controller')) {
                    continue;
                }
                
                
                // Extract controller-level route
                const controllerRouteMatch = content.match(/\[Route\(\s*"([^"]+)"\s*\)\]/);
                const controllerRoute = controllerRouteMatch ? controllerRouteMatch[1] : '';
                
                // Extract controller name
                const controllerMatch = content.match(/class\s+(\w+)(?:Controller)?/);
                const controllerName = controllerMatch ? controllerMatch[1] : 'Unknown';
                
                // HTTP method patterns with optional route paths - handle multiple lines between attribute and method
                const httpPatterns = [
                    /\[Http(Get|Post|Put|Delete|Patch)\][\s\S]*?public\s+(?:async\s+)?(?:[^\s(]+\s+)*(\w+)\s*\(/g,
                    /\[Http(Get|Post|Put|Delete|Patch)\(\s*"([^"]+)"\s*\)\][\s\S]*?public\s+(?:async\s+)?(?:[^\s(]+\s+)*(\w+)\s*\(/g
                ];
                
                for (const pattern of httpPatterns) {
                    pattern.lastIndex = 0; // Reset regex state for each file
                    let match;
                    while ((match = pattern.exec(content)) !== null) {
                        let method, actionRoute, actionName;
                        
                        if (match.length === 3) {
                            // Pattern without route path
                            [, method, actionName] = match;
                            actionRoute = '';
                        } else {
                            // Pattern with route path
                            [, method, actionRoute, actionName] = match;
                            if (!actionName) {
                                actionName = actionRoute;
                                actionRoute = '';
                            }
                        }
                        
                        // Build full path
                        let fullPath = controllerRoute;
                        if (actionRoute) {
                            fullPath += (fullPath.endsWith('/') || actionRoute.startsWith('/')) ? actionRoute : `/${actionRoute}`;
                        }
                        
                        if (!fullPath) {
                            fullPath = `/${controllerName.toLowerCase()}/${actionName.toLowerCase()}`;
                        }
                        
                        // Extract parameters from method signature and context
                        const methodStartIndex = Math.max(0, match.index - 500);
                        const methodContent = content.substring(methodStartIndex, match.index + 1000);
                        const parameters = this.extractDotNetParameters(methodContent);
                        
                        // Extract response types
                        const responses = this.extractDotNetResponses(methodContent);
                        
                        // Extract rich description from Swagger annotations and comments
                        const description = this.extractDotNetDescription(methodContent, actionName, method, fullPath);
                        
                        const endpoint = {
                            method: method.toUpperCase(),
                            path: fullPath,
                            actionName: actionName,
                            controllerName: controllerName,
                            description: description,
                            file: relativePath,
                            parameters: parameters,
                            responses: responses,
                            middleware: [],
                            authentication: this.detectDotNetAuthentication(methodContent)
                        };
                        
                        this.endpoints.push(endpoint);
                        console.log(`  ✅ ${method.toUpperCase()} ${fullPath} (${actionName})`);
                    }
                }
                
            } catch (error) {
                console.error(`  ⚠️  Error reading ${filePath}:`, error.message);
            }
        }
    }

    /**
     * Extract parameters from .NET method signature
     */
    extractDotNetParameters(methodContent) {
        const parameters = [];
        
        // Route parameters from path like {id}, {userId:int}
        const routeParams = methodContent.match(/\{(\w+)(?::[\w]+)?\}/g);
        if (routeParams) {
            for (const param of routeParams) {
                const name = param.replace(/[{}:]/g, '').split(':')[0];
                parameters.push({
                    name: name,
                    type: 'string',
                    required: true,
                    location: 'path'
                });
            }
        }
        
        // FromBody parameters
        const fromBodyMatch = methodContent.match(/\[FromBody\]\s*(\w+)\s+(\w+)/);
        if (fromBodyMatch) {
            parameters.push({
                name: fromBodyMatch[2],
                type: fromBodyMatch[1],
                required: true,
                location: 'body'
            });
        }
        
        // FromQuery parameters
        const fromQueryMatches = methodContent.match(/\[FromQuery\]\s*(\w+)\s+(\w+)/g);
        if (fromQueryMatches) {
            for (const match of fromQueryMatches) {
                const parts = match.match(/\[FromQuery\]\s*(\w+)\s+(\w+)/);
                if (parts) {
                    parameters.push({
                        name: parts[2],
                        type: parts[1],
                        required: false,
                        location: 'query'
                    });
                }
            }
        }
        
        return parameters;
    }

    /**
     * Extract .NET response information
     */
    extractDotNetResponses(methodContent) {
        const responses = [];
        
        // ProducesResponseType attributes
        const responseMatches = methodContent.match(/\[ProducesResponseType\((\d+)(?:,\s*Type\s*=\s*typeof\(([^)]+)\))?\)\]/g);
        if (responseMatches) {
            for (const match of responseMatches) {
                const parts = match.match(/\[ProducesResponseType\((\d+)(?:,\s*Type\s*=\s*typeof\(([^)]+)\))?\)\]/);
                if (parts) {
                    responses.push({
                        status: parseInt(parts[1]),
                        description: this.getHttpStatusDescription(parseInt(parts[1])),
                        type: parts[2] || null
                    });
                }
            }
        } else {
            // Default response
            responses.push({
                status: 200,
                description: 'Success response'
            });
        }
        
        return responses;
    }

    /**
     * Detect .NET authentication requirements
     */
    detectDotNetAuthentication(methodContent) {
        const authPatterns = [
            '[Authorize]',
            '[RequireAuth]',
            '[JwtBearer]'
        ];
        
        for (const pattern of authPatterns) {
            if (methodContent.includes(pattern)) {
                return { type: 'bearer_token', description: pattern };
            }
        }
        
        return null;
    }

    /**
     * Extract rich description from .NET method annotations and comments
     */
    extractDotNetDescription(methodContent, actionName, method, fullPath) {
        // Try to extract from SwaggerOperation attribute
        const swaggerMatch = methodContent.match(/\[SwaggerOperation\(\s*Summary\s*=\s*["']([^"']*)["']/);
        if (swaggerMatch) {
            return swaggerMatch[1];
        }

        // Try to extract from XML documentation comments
        const xmlCommentMatch = methodContent.match(/\/\/\/\s*<summary>\s*([^<]*)\s*<\/summary>/);
        if (xmlCommentMatch) {
            return xmlCommentMatch[1].trim();
        }

        // Try to extract from inline comments above method
        const commentMatch = methodContent.match(/\/\/\s*(.+)\s*\n.*?\[Http/);
        if (commentMatch) {
            return commentMatch[1].trim();
        }

        // Generate descriptive name from action name
        if (actionName) {
            const readable = actionName
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();
            return `${readable} - ${method.toUpperCase()} ${fullPath}`;
        }

        // Fallback
        return `${method.toUpperCase()} ${fullPath}`;
    }

    /**
     * Get HTTP status description
     */
    getHttpStatusDescription(status) {
        const descriptions = {
            200: 'OK',
            201: 'Created',
            204: 'No Content',
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            409: 'Conflict',
            422: 'Unprocessable Entity',
            500: 'Internal Server Error'
        };
        
        return descriptions[status] || 'Response';
    }

    /**
     * Extract Next.js API routes
     */
    async extractNextJSEndpoints() {
        // Look for pages/api and app/api directories
        const apiDirs = [
            path.join(this.servicePath, 'pages', 'api'),
            path.join(this.servicePath, 'app', 'api'),
            path.join(this.servicePath, 'src', 'pages', 'api'),
            path.join(this.servicePath, 'src', 'app', 'api')
        ];
        
        for (const apiDir of apiDirs) {
            if (fs.existsSync(apiDir)) {
                await this.extractNextJSFromDirectory(apiDir, apiDir);
            }
        }
    }

    /**
     * Extract Next.js endpoints from directory
     */
    async extractNextJSFromDirectory(baseDir, currentDir) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            
            if (entry.isDirectory()) {
                await this.extractNextJSFromDirectory(baseDir, fullPath);
            } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.ts'))) {
                const content = fs.readFileSync(fullPath, 'utf8');
                const relativePath = path.relative(this.servicePath, fullPath);
                
                // Convert file path to API route
                const apiPath = path.relative(baseDir, fullPath)
                    .replace(/\.(js|ts)$/, '')
                    .replace(/\\/g, '/')
                    .replace(/index$/, '')
                    .replace(/\[(.+)\]/g, '{$1}');  // Convert [id] to {id}
                
                const routePath = apiPath.startsWith('/') ? apiPath : `/${apiPath}`;
                
                // Check for handler methods
                const methods = [];
                if (content.includes('export default function') || content.includes('export default async function')) {
                    methods.push('GET', 'POST');  // Default handler can handle multiple methods
                }
                if (content.includes('export async function GET')) methods.push('GET');
                if (content.includes('export async function POST')) methods.push('POST');
                if (content.includes('export async function PUT')) methods.push('PUT');
                if (content.includes('export async function DELETE')) methods.push('DELETE');
                if (content.includes('export async function PATCH')) methods.push('PATCH');
                
                // Check for method filtering in handler
                const methodChecks = content.match(/req\.method\s*===\s*['"](\w+)['"]/g);
                if (methodChecks) {
                    for (const check of methodChecks) {
                        const method = check.match(/['"](\w+)['"]/)[1];
                        if (!methods.includes(method)) {
                            methods.push(method);
                        }
                    }
                }
                
                if (methods.length === 0) {
                    methods.push('GET');  // Default method
                }
                
                for (const method of methods) {
                    const endpoint = {
                        method: method,
                        path: routePath,
                        description: `${method} ${routePath}`,
                        file: relativePath,
                        parameters: this.extractNextJSParameters(content, routePath),
                        responses: [{ status: 200, description: 'Success response' }],
                        middleware: [],
                        authentication: null
                    };
                    
                    this.endpoints.push(endpoint);
                    console.log(`  ✅ ${method} ${routePath}`);
                }
            }
        }
    }

    /**
     * Extract Next.js parameters
     */
    extractNextJSParameters(content, routePath) {
        const parameters = [];
        
        // Path parameters from route like {id}
        const pathParams = routePath.match(/\{(\w+)\}/g);
        if (pathParams) {
            for (const param of pathParams) {
                const name = param.replace(/[{}]/g, '');
                parameters.push({
                    name: name,
                    type: 'string',
                    required: true,
                    location: 'path'
                });
            }
        }
        
        // Query parameters from req.query usage
        const queryMatches = content.match(/req\.query\.(\w+)/g);
        if (queryMatches) {
            for (const match of queryMatches) {
                const name = match.replace('req.query.', '');
                if (!parameters.find(p => p.name === name)) {
                    parameters.push({
                        name: name,
                        type: 'string',
                        required: false,
                        location: 'query'
                    });
                }
            }
        }
        
        return parameters;
    }

    /**
     * Extract NestJS endpoints from TypeScript files
     */
    async extractNestJSEndpoints() {
        const tsFiles = this.findFiles(this.servicePath, /\.(ts)$/);
        
        for (const filePath of tsFiles) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.servicePath, filePath);
                
                // Skip if not a controller file
                if (!content.includes('@Controller') && !relativePath.includes('controller')) {
                    continue;
                }
                
                // Extract controller route prefix
                const controllerMatch = content.match(/@Controller\(\s*["']([^"']*)["']\s*\)/);
                const controllerPrefix = controllerMatch ? controllerMatch[1] : '';
                
                // HTTP method decorators
                const methodPatterns = [
                    /@(Get|Post|Put|Delete|Patch)\(\s*["']([^"']*)["']\s*\)\s*(?:\n\s*)?(\w+)\s*\(/g,
                    /@(Get|Post|Put|Delete|Patch)\(\)\s*(?:\n\s*)?(\w+)\s*\(/g
                ];
                
                for (const pattern of methodPatterns) {
                    let match;
                    while ((match = pattern.exec(content)) !== null) {
                        let method, actionRoute, actionName;
                        
                        if (match.length === 3) {
                            // Pattern without route
                            [, method, actionName] = match;
                            actionRoute = '';
                        } else {
                            // Pattern with route
                            [, method, actionRoute, actionName] = match;
                        }
                        
                        // Build full path
                        let fullPath = '';
                        if (controllerPrefix) fullPath += `/${controllerPrefix}`;
                        if (actionRoute) fullPath += `/${actionRoute}`;
                        if (!fullPath) fullPath = `/${actionName.toLowerCase()}`;
                        
                        const endpoint = {
                            method: method.toUpperCase(),
                            path: fullPath,
                            actionName: actionName,
                            description: `${method.toUpperCase()} ${fullPath}`,
                            file: relativePath,
                            parameters: [],
                            responses: [{ status: 200, description: 'Success response' }],
                            middleware: [],
                            authentication: null
                        };
                        
                        this.endpoints.push(endpoint);
                        console.log(`  ✅ ${method.toUpperCase()} ${fullPath} (${actionName})`);
                    }
                }
                
            } catch (error) {
                console.error(`  ⚠️  Error reading ${filePath}:`, error.message);
            }
        }
    }

    /**
     * Extract Spring Boot endpoints from Java files
     */
    async extractSpringBootEndpoints() {
        const javaFiles = this.findFiles(this.servicePath, /\.(java)$/);
        
        for (const filePath of javaFiles) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.servicePath, filePath);
                
                // Skip if not a controller file
                if (!content.includes('@RestController') && !content.includes('@Controller')) {
                    continue;
                }
                
                // Extract base request mapping
                const baseMapping = content.match(/@RequestMapping\(\s*"([^"]+)"\s*\)/);
                const basePath = baseMapping ? baseMapping[1] : '';
                
                // Spring mapping annotations
                const mappingPatterns = [
                    /@(Get|Post|Put|Delete|Patch)Mapping\(\s*"([^"]+)"\s*\)\s*(?:\n\s*)?public\s+\w+\s+(\w+)\s*\(/g,
                    /@(Get|Post|Put|Delete|Patch)Mapping\s*(?:\n\s*)?public\s+\w+\s+(\w+)\s*\(/g,
                    /@RequestMapping\(value\s*=\s*"([^"]+)".*?method\s*=\s*RequestMethod\.(\w+).*?\)\s*(?:\n\s*)?public\s+\w+\s+(\w+)\s*\(/g
                ];
                
                for (const pattern of mappingPatterns) {
                    let match;
                    while ((match = pattern.exec(content)) !== null) {
                        let method, actionPath, actionName;
                        
                        if (match.length === 3) {
                            // Pattern without path
                            [, method, actionName] = match;
                            actionPath = '';
                        } else if (match.length === 4) {
                            if (pattern.toString().includes('RequestMapping')) {
                                // RequestMapping pattern
                                [, actionPath, method, actionName] = match;
                            } else {
                                // Mapping with path
                                [, method, actionPath, actionName] = match;
                            }
                        }
                        
                        // Build full path
                        let fullPath = basePath;
                        if (actionPath) {
                            fullPath += (fullPath.endsWith('/') || actionPath.startsWith('/')) ? actionPath : `/${actionPath}`;
                        }
                        
                        const endpoint = {
                            method: method.toUpperCase(),
                            path: fullPath || `/${actionName.toLowerCase()}`,
                            actionName: actionName,
                            description: `${method.toUpperCase()} ${fullPath || actionName}`,
                            file: relativePath,
                            parameters: [],
                            responses: [{ status: 200, description: 'Success response' }],
                            middleware: [],
                            authentication: null
                        };
                        
                        this.endpoints.push(endpoint);
                        console.log(`  ✅ ${method.toUpperCase()} ${endpoint.path} (${actionName})`);
                    }
                }
                
            } catch (error) {
                console.error(`  ⚠️  Error reading ${filePath}:`, error.message);
            }
        }
    }

    /**
     * Extract Go framework endpoints
     */
    async extractGoEndpoints() {
        const goFiles = this.findFiles(this.servicePath, /\.(go)$/);
        
        for (const filePath of goFiles) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.servicePath, filePath);
                
                // Go framework patterns
                const patterns = [
                    // Gin framework
                    /r\.(GET|POST|PUT|DELETE|PATCH)\(\s*"([^"]+)"\s*,\s*(\w+)\)/g,
                    // Fiber framework  
                    /app\.(Get|Post|Put|Delete|Patch)\(\s*"([^"]+)"\s*,\s*(\w+)\)/g,
                    // Native http
                    /http\.HandleFunc\(\s*"([^"]+)"\s*,\s*(\w+)\)/g
                ];
                
                for (const pattern of patterns) {
                    let match;
                    while ((match = pattern.exec(content)) !== null) {
                        let method, path, handler;
                        
                        if (match.length === 3) {
                            // Native http pattern
                            [, path, handler] = match;
                            method = 'GET';  // Default method
                        } else {
                            [, method, path, handler] = match;
                        }
                        
                        const endpoint = {
                            method: method.toUpperCase(),
                            path: path,
                            handler: handler,
                            description: `${method.toUpperCase()} ${path}`,
                            file: relativePath,
                            parameters: [],
                            responses: [{ status: 200, description: 'Success response' }],
                            middleware: [],
                            authentication: null
                        };
                        
                        this.endpoints.push(endpoint);
                        console.log(`  ✅ ${method.toUpperCase()} ${path} (${handler})`);
                    }
                }
                
            } catch (error) {
                console.error(`  ⚠️  Error reading ${filePath}:`, error.message);
            }
        }
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
     * Extract Express.js parameters from route definition
     */
    extractExpressParams(content, startIndex) {
        const params = [];
        
        // Extract route parameters like :id, :userId
        const routeSection = content.substring(startIndex, startIndex + 500);
        const routeParamMatches = routeSection.match(/:(\w+)/g);
        if (routeParamMatches) {
            for (const match of routeParamMatches) {
                const paramName = match.substring(1);
                params.push({
                    name: paramName,
                    type: 'string',
                    required: true,
                    location: 'path'
                });
            }
        }
        
        // Extract query parameters from req.query usage
        const queryMatches = routeSection.match(/req\.query\.(\w+)/g);
        if (queryMatches) {
            for (const match of queryMatches) {
                const paramName = match.replace('req.query.', '');
                if (!params.find(p => p.name === paramName)) {
                    params.push({
                        name: paramName,
                        type: 'string',
                        required: false,
                        location: 'query'
                    });
                }
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
        } else if (this.framework === 'ASP.NET Core' || this.framework === '.NET') {
            await this.extractDotNetModels();
        } else if (this.framework === 'Express.js' || this.framework === 'NestJS' || this.framework === 'Next.js') {
            await this.extractTypeScriptModels();
        } else if (this.framework === 'Spring Boot') {
            await this.extractJavaModels();
        }
    }

    /**
     * Extract .NET DTOs and models
     */
    async extractDotNetModels() {
        const csFiles = this.findFiles(this.servicePath, /\.(cs)$/);
        
        for (const filePath of csFiles) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.servicePath, filePath);
                
                // Skip controller files
                if (relativePath.includes('Controller')) continue;
                
                // Look for classes (DTOs, Models, Entities)
                const classPattern = /public\s+class\s+(\w+)\s*(?::\s*([^{]+))?\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)*}/g;
                let match;
                
                while ((match = classPattern.exec(content)) !== null) {
                    const [fullMatch, className, baseClass, classBody] = match;
                    
                    const fields = this.extractDotNetFields(classBody);
                    
                    if (fields.length > 0) {
                        const schema = {
                            name: className,
                            type: 'csharp_class',
                            file: relativePath,
                            baseClass: baseClass ? baseClass.trim() : null,
                            fields: fields,
                            description: this.extractDotNetClassDocstring(content, match.index)
                        };
                        
                        this.schemas.push(schema);
                        console.log(`  📄 Schema: ${className} (${fields.length} fields)`);
                    }
                }
                
            } catch (error) {
                console.error(`  ⚠️  Error extracting schemas from ${filePath}:`, error.message);
            }
        }
    }

    /**
     * Extract .NET class fields (properties)
     */
    extractDotNetFields(classBody) {
        const fields = [];
        
        // Public properties pattern
        const propPattern = /public\s+([^?\s]+\??)\s+(\w+)\s*{\s*get;\s*set;\s*}(?:\s*=\s*([^;]+);)?/g;
        let match;
        
        while ((match = propPattern.exec(classBody)) !== null) {
            const [fullMatch, propType, propName, defaultValue] = match;
            
            fields.push({
                name: propName,
                type: propType.trim(),
                required: !propType.includes('?') && !defaultValue,
                default: defaultValue ? defaultValue.trim() : null
            });
        }
        
        // Also check for simple auto-properties
        const autoPropPattern = /public\s+(\w+\??)\s+(\w+)\s*{\s*get;\s*set;\s*}/g;
        while ((match = autoPropPattern.exec(classBody)) !== null) {
            const [fullMatch, propType, propName] = match;
            
            if (!fields.find(f => f.name === propName)) {
                fields.push({
                    name: propName,
                    type: propType.trim(),
                    required: !propType.includes('?'),
                    default: null
                });
            }
        }
        
        return fields;
    }

    /**
     * Extract .NET class documentation
     */
    extractDotNetClassDocstring(content, classIndex) {
        // Look backwards for /// comments
        const beforeClass = content.substring(Math.max(0, classIndex - 500), classIndex);
        const docMatch = beforeClass.match(/\/\/\/\s*<summary>\s*([^<]+)\s*<\/summary>/);
        return docMatch ? docMatch[1].trim() : null;
    }

    /**
     * Extract TypeScript interfaces and types
     */
    async extractTypeScriptModels() {
        const tsFiles = this.findFiles(this.servicePath, /\.(ts|tsx)$/);
        
        for (const filePath of tsFiles) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.servicePath, filePath);
                
                // Extract interfaces
                const interfacePattern = /interface\s+(\w+)(?:\s+extends\s+[^{]+)?\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)*}/g;
                let match;
                
                while ((match = interfacePattern.exec(content)) !== null) {
                    const [fullMatch, interfaceName, interfaceBody] = match;
                    
                    const fields = this.extractTypeScriptFields(interfaceBody);
                    
                    if (fields.length > 0) {
                        const schema = {
                            name: interfaceName,
                            type: 'typescript_interface',
                            file: relativePath,
                            fields: fields,
                            description: null
                        };
                        
                        this.schemas.push(schema);
                        console.log(`  📄 Schema: ${interfaceName} (${fields.length} fields)`);
                    }
                }
                
                // Extract types
                const typePattern = /type\s+(\w+)\s*=\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)*}/g;
                while ((match = typePattern.exec(content)) !== null) {
                    const [fullMatch, typeName, typeBody] = match;
                    
                    const fields = this.extractTypeScriptFields(typeBody);
                    
                    if (fields.length > 0) {
                        const schema = {
                            name: typeName,
                            type: 'typescript_type',
                            file: relativePath,
                            fields: fields,
                            description: null
                        };
                        
                        this.schemas.push(schema);
                        console.log(`  📄 Schema: ${typeName} (${fields.length} fields)`);
                    }
                }
                
            } catch (error) {
                console.error(`  ⚠️  Error extracting schemas from ${filePath}:`, error.message);
            }
        }
    }

    /**
     * Extract TypeScript interface/type fields
     */
    extractTypeScriptFields(body) {
        const fields = [];
        const fieldPattern = /(\w+)(\?)?:\s*([^;,\n]+)/g;
        let match;
        
        while ((match = fieldPattern.exec(body)) !== null) {
            const [fullMatch, fieldName, optional, fieldType] = match;
            
            fields.push({
                name: fieldName,
                type: fieldType.trim(),
                required: !optional,
                default: null
            });
        }
        
        return fields;
    }

    /**
     * Extract Java model classes
     */
    async extractJavaModels() {
        const javaFiles = this.findFiles(this.servicePath, /\.(java)$/);
        
        for (const filePath of javaFiles) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const relativePath = path.relative(this.servicePath, filePath);
                
                // Skip controller files
                if (content.includes('@RestController') || content.includes('@Controller')) continue;
                
                // Look for public classes
                const classPattern = /public\s+class\s+(\w+)(?:\s+extends\s+\w+)?\s*{([^{}]*(?:{[^{}]*}[^{}]*)*)*}/g;
                let match;
                
                while ((match = classPattern.exec(content)) !== null) {
                    const [fullMatch, className, classBody] = match;
                    
                    const fields = this.extractJavaFields(classBody);
                    
                    if (fields.length > 0) {
                        const schema = {
                            name: className,
                            type: 'java_class',
                            file: relativePath,
                            fields: fields,
                            description: null
                        };
                        
                        this.schemas.push(schema);
                        console.log(`  📄 Schema: ${className} (${fields.length} fields)`);
                    }
                }
                
            } catch (error) {
                console.error(`  ⚠️  Error extracting schemas from ${filePath}:`, error.message);
            }
        }
    }

    /**
     * Extract Java class fields
     */
    extractJavaFields(classBody) {
        const fields = [];
        
        // Look for private fields with getters/setters (common pattern)
        const fieldPattern = /private\s+(\w+(?:<[^>]+>)?)\s+(\w+);/g;
        let match;
        
        while ((match = fieldPattern.exec(classBody)) !== null) {
            const [fullMatch, fieldType, fieldName] = match;
            
            // Check if there are getters/setters for this field
            const getterPattern = new RegExp(`public\\s+${fieldType}\\s+get${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}\\s*\\(`);
            const setterPattern = new RegExp(`public\\s+void\\s+set${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}\\s*\\(`);
            
            if (getterPattern.test(classBody) || setterPattern.test(classBody)) {
                fields.push({
                    name: fieldName,
                    type: fieldType,
                    required: true,
                    default: null
                });
            }
        }
        
        return fields;
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
        
        // .NET dependencies from .csproj files
        if (this.framework === 'ASP.NET Core' || this.framework === '.NET') {
            await this.extractDotNetDependencies();
        }
        
        // Node.js dependencies from package.json
        if (this.framework === 'Express.js' || this.framework === 'NestJS' || this.framework === 'Next.js') {
            await this.extractNodeDependencies();
        }
        
        // Python dependencies from requirements.txt
        if (this.framework === 'FastAPI' || this.framework === 'Flask' || this.framework === 'Django') {
            await this.extractPythonDependencies();
        }
        
        // Java dependencies from pom.xml or build.gradle
        if (this.framework === 'Spring Boot' || this.framework === 'Java') {
            await this.extractJavaDependencies();
        }
        
        // Go dependencies from go.mod
        if (this.framework === 'Gin' || this.framework === 'Fiber' || this.framework === 'Go') {
            await this.extractGoDependencies();
        }
        
        // Look for external API calls in code
        await this.extractExternalAPICalls();
        
        console.log(`📦 Found ${this.dependencies.length} dependencies`);
    }

    /**
     * Extract .NET NuGet dependencies from .csproj files
     */
    async extractDotNetDependencies() {
        const csprojFiles = this.findFiles(this.servicePath, /\.csproj$/);
        
        for (const csprojPath of csprojFiles) {
            try {
                const content = fs.readFileSync(csprojPath, 'utf8');
                
                // Extract PackageReference elements
                const packageMatches = content.match(/<PackageReference\s+Include="([^"]+)"\s+Version="([^"]+)"\s*\/>/g);
                if (packageMatches) {
                    for (const match of packageMatches) {
                        const includeMatch = match.match(/Include="([^"]+)"/);
                        const versionMatch = match.match(/Version="([^"]+)"/);
                        
                        if (includeMatch && versionMatch) {
                            this.dependencies.push({
                                name: includeMatch[1],
                                version: versionMatch[1],
                                type: 'nuget_package'
                            });
                        }
                    }
                }
                
            } catch (error) {
                console.error(`  ⚠️  Error reading ${csprojPath}:`, error.message);
            }
        }
    }

    /**
     * Extract Node.js dependencies from package.json
     */
    async extractNodeDependencies() {
        const packageJsonPath = path.join(this.servicePath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            try {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                
                const allDeps = {
                    ...packageJson.dependencies,
                    ...packageJson.devDependencies,
                    ...packageJson.peerDependencies
                };
                
                for (const [name, version] of Object.entries(allDeps)) {
                    this.dependencies.push({
                        name: name,
                        version: version,
                        type: 'npm_package'
                    });
                }
                
            } catch (error) {
                console.error(`  ⚠️  Error reading package.json:`, error.message);
            }
        }
    }

    /**
     * Extract Python dependencies from requirements.txt
     */
    async extractPythonDependencies() {
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
    }

    /**
     * Extract Java dependencies from pom.xml
     */
    async extractJavaDependencies() {
        const pomPath = path.join(this.servicePath, 'pom.xml');
        if (fs.existsSync(pomPath)) {
            try {
                const content = fs.readFileSync(pomPath, 'utf8');
                
                // Extract dependency elements
                const depMatches = content.match(/<dependency>[\s\S]*?<\/dependency>/g);
                if (depMatches) {
                    for (const depMatch of depMatches) {
                        const groupMatch = depMatch.match(/<groupId>([^<]+)<\/groupId>/);
                        const artifactMatch = depMatch.match(/<artifactId>([^<]+)<\/artifactId>/);
                        const versionMatch = depMatch.match(/<version>([^<]+)<\/version>/);
                        
                        if (groupMatch && artifactMatch) {
                            this.dependencies.push({
                                name: `${groupMatch[1]}:${artifactMatch[1]}`,
                                version: versionMatch ? versionMatch[1] : 'latest',
                                type: 'maven_dependency'
                            });
                        }
                    }
                }
                
            } catch (error) {
                console.error(`  ⚠️  Error reading pom.xml:`, error.message);
            }
        }
    }

    /**
     * Extract Go dependencies from go.mod
     */
    async extractGoDependencies() {
        const goModPath = path.join(this.servicePath, 'go.mod');
        if (fs.existsSync(goModPath)) {
            try {
                const content = fs.readFileSync(goModPath, 'utf8');
                
                // Extract require statements
                const requireMatches = content.match(/^\s*([^\s]+)\s+([^\s]+)/gm);
                if (requireMatches) {
                    for (const match of requireMatches) {
                        const parts = match.trim().split(/\s+/);
                        if (parts.length >= 2 && !parts[0].startsWith('//')) {
                            this.dependencies.push({
                                name: parts[0],
                                version: parts[1],
                                type: 'go_module'
                            });
                        }
                    }
                }
                
            } catch (error) {
                console.error(`  ⚠️  Error reading go.mod:`, error.message);
            }
        }
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
                baseUrl: this.baseUrl,
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
                    // Save report to .analysis directory
        const analysisDir = path.join(process.cwd(), '.analysis', report.service.name);
        fs.mkdirSync(analysisDir, { recursive: true });
        const outputPath = path.join(analysisDir, `${report.service.name}-analysis.json`);
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