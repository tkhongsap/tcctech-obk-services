#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Output Generator - Creates documentation from analysis data
 * Generates Markdown, OpenAPI, and JSON outputs
 * This script only reads analysis data and generates documentation files
 */

class OutputGenerator {
    constructor(analysisPath, servicePath) {
        this.analysisPath = analysisPath;
        this.servicePath = servicePath;
        this.analysisData = null;
        this.serviceName = '';
    }

    /**
     * Generate all documentation formats
     */
    async generate() {
        try {
            // Load analysis data
            this.analysisData = JSON.parse(fs.readFileSync(this.analysisPath, 'utf8'));
            this.serviceName = this.analysisData.service.name;
            
            console.log(`📝 Generating documentation for: ${this.serviceName}`);
            
            // Generate different formats
            const outputs = {
                markdown: await this.generateMarkdown(),
                openapi: await this.generateOpenAPI(),
                json: await this.generateJSON()
            };
            
            // Save files to service directory
            await this.saveToServiceDirectory(outputs);
            
            console.log(`✅ Documentation generated for ${this.serviceName}`);
            return outputs;
            
        } catch (error) {
            console.error('❌ Error generating documentation:', error.message);
            return null;
        }
    }

    /**
     * Generate Markdown documentation
     */
    async generateMarkdown() {
        console.log('📄 Generating Markdown documentation...');
        
        const template = fs.readFileSync('templates/api-inventory-template.md', 'utf8');
        const data = this.analysisData;
        
        // Prepare template data
        const templateData = {
            SERVICE_NAME: data.service.name,
            FRAMEWORK: data.service.framework,
            LANGUAGE: data.service.language,
            ANALYSIS_DATE: new Date(data.service.analyzed_at).toLocaleDateString(),
            TOTAL_ENDPOINTS: data.api.total_endpoints,
            TOTAL_DEPENDENCIES: data.dependencies.total,
            EXTERNAL_API_COUNT: data.dependencies.external_apis.length,
            TOTAL_SCHEMAS: data.api.schemas.length,
            HTTP_METHODS: Object.keys(data.summary.methods).join(', '),
            HAS_AUTHENTICATION: data.summary.has_authentication ? 'Yes' : 'No',
            HAS_DOCUMENTATION: data.summary.has_documentation ? 'Yes' : 'No'
        };
        
        let markdown = template;
        
        // Replace simple placeholders
        for (const [key, value] of Object.entries(templateData)) {
            const placeholder = `{{${key}}}`;
            markdown = markdown.replace(new RegExp(placeholder, 'g'), value);
        }
        
        // Generate endpoints section
        let endpointsSection = '';
        for (const endpoint of data.api.endpoints) {
            endpointsSection += `### ${endpoint.method} ${endpoint.path}\n\n`;
            endpointsSection += `- **Method**: ${endpoint.method}\n`;
            endpointsSection += `- **Path**: ${endpoint.path}\n`;
            endpointsSection += `- **Function**: \`${endpoint.functionName}\`\n`;
            endpointsSection += `- **File**: \`${endpoint.file}\`\n`;
            endpointsSection += `- **Description**: ${endpoint.description}\n\n`;
            
            // Parameters
            if (endpoint.parameters && endpoint.parameters.length > 0) {
                endpointsSection += '#### Parameters\n';
                for (const param of endpoint.parameters) {
                    const required = param.required ? 'Required' : 'Optional';
                    endpointsSection += `- **${param.name}** (\`${param.type}\`) - ${required}\n`;
                }
                endpointsSection += '\n';
            }
            
            // Responses
            if (endpoint.responses && endpoint.responses.length > 0) {
                endpointsSection += '#### Responses\n';
                for (const response of endpoint.responses) {
                    endpointsSection += `- **${response.status}**: ${response.description}\n`;
                    if (response.example) {
                        endpointsSection += `  \`\`\`json\n  ${response.example}\n  \`\`\`\n`;
                    }
                }
                endpointsSection += '\n';
            }
            
            // Authentication
            if (endpoint.authentication) {
                endpointsSection += '#### Authentication\n';
                endpointsSection += `- **Type**: ${endpoint.authentication.type}\n`;
                endpointsSection += `- **Description**: ${endpoint.authentication.description}\n\n`;
            }
            
            endpointsSection += '---\n\n';
        }
        
        // Replace endpoints section
        markdown = markdown.replace(/{{#ENDPOINTS}}[\s\S]*?{{\/ENDPOINTS}}/g, endpointsSection);
        
        // Generate schemas section
        let schemasSection = '';
        for (const schema of data.api.schemas) {
            schemasSection += `### ${schema.name}\n\n`;
            if (schema.description) {
                schemasSection += `**Description**: ${schema.description}\n\n`;
            }
            schemasSection += `**File**: \`${schema.file}\`\n\n`;
            
            if (schema.fields && schema.fields.length > 0) {
                schemasSection += '#### Fields\n';
                for (const field of schema.fields) {
                    const required = field.required ? 'Required' : 'Optional';
                    const defaultValue = field.default ? ` - Default: \`${field.default}\`` : '';
                    schemasSection += `- **${field.name}** (\`${field.type}\`) - ${required}${defaultValue}\n`;
                }
            }
            
            schemasSection += '\n---\n\n';
        }
        
        // Replace schemas section
        markdown = markdown.replace(/{{#SCHEMAS}}[\s\S]*?{{\/SCHEMAS}}/g, schemasSection);
        
        // Generate dependencies section
        let pythonPackagesSection = '';
        for (const pkg of data.dependencies.packages) {
            pythonPackagesSection += `- **${pkg.name}** (${pkg.version})\n`;
        }
        
        let externalApisSection = '';
        for (const api of data.dependencies.external_apis) {
            externalApisSection += `- **${api.method} ${api.name}** - Used in \`${api.file}\`\n`;
        }
        
        // Replace dependencies sections
        markdown = markdown.replace(/{{#PYTHON_PACKAGES}}[\s\S]*?{{\/PYTHON_PACKAGES}}/g, pythonPackagesSection);
        markdown = markdown.replace(/{{#EXTERNAL_APIS}}[\s\S]*?{{\/EXTERNAL_APIS}}/g, externalApisSection);
        
        return markdown;
    }

    /**
     * Generate OpenAPI specification
     */
    async generateOpenAPI() {
        console.log('📋 Generating OpenAPI specification...');
        
        const data = this.analysisData;
        
        const openapi = {
            openapi: '3.0.0',
            info: {
                title: `${data.service.name} API`,
                version: '1.0.0',
                description: `API documentation for ${data.service.name} service (${data.service.framework})`,
                contact: {
                    name: 'API Documentation Generator'
                }
            },
            servers: [
                {
                    url: 'http://localhost:8000',
                    description: 'Development server'
                }
            ],
            paths: {},
            components: {
                schemas: {}
            }
        };
        
        // Add endpoints
        for (const endpoint of data.api.endpoints) {
            const path = endpoint.path;
            const method = endpoint.method.toLowerCase();
            
            if (!openapi.paths[path]) {
                openapi.paths[path] = {};
            }
            
            const operation = {
                summary: endpoint.description,
                description: endpoint.description,
                operationId: endpoint.functionName || `${method}${path.replace(/\//g, '_')}`,
                responses: {
                    '200': {
                        description: 'Successful response',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object'
                                }
                            }
                        }
                    }
                }
            };
            
            // Add parameters
            if (endpoint.parameters && endpoint.parameters.length > 0) {
                operation.parameters = [];
                for (const param of endpoint.parameters) {
                    operation.parameters.push({
                        name: param.name,
                        in: param.location || 'query',
                        required: param.required,
                        schema: {
                            type: this.mapPythonTypeToOpenAPI(param.type)
                        }
                    });
                }
            }
            
            // Add request body for POST/PUT methods
            if (['post', 'put', 'patch'].includes(method)) {
                operation.requestBody = {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object'
                            }
                        }
                    }
                };
            }
            
            openapi.paths[path][method] = operation;
        }
        
        // Add schemas
        for (const schema of data.api.schemas) {
            const schemaName = schema.name;
            const properties = {};
            const required = [];
            
            for (const field of schema.fields || []) {
                properties[field.name] = {
                    type: this.mapPythonTypeToOpenAPI(field.type),
                    description: field.name
                };
                
                if (field.required) {
                    required.push(field.name);
                }
            }
            
            openapi.components.schemas[schemaName] = {
                type: 'object',
                properties: properties,
                required: required.length > 0 ? required : undefined
            };
        }
        
        return JSON.stringify(openapi, null, 2);
    }

    /**
     * Map Python types to OpenAPI types
     */
    mapPythonTypeToOpenAPI(pythonType) {
        const typeMap = {
            'str': 'string',
            'int': 'integer',
            'float': 'number',
            'bool': 'boolean',
            'list': 'array',
            'dict': 'object',
            'string': 'string',
            'integer': 'integer',
            'number': 'number',
            'boolean': 'boolean'
        };
        
        return typeMap[pythonType] || 'string';
    }

    /**
     * Generate JSON export
     */
    async generateJSON() {
        console.log('💾 Generating JSON export...');
        
        return JSON.stringify({
            service: this.analysisData.service,
            api_inventory: {
                endpoints: this.analysisData.api.endpoints,
                schemas: this.analysisData.api.schemas,
                summary: this.analysisData.summary
            },
            dependencies: this.analysisData.dependencies,
            generated_at: new Date().toISOString()
        }, null, 2);
    }

    /**
     * Save all outputs to service directory
     */
    async saveToServiceDirectory(outputs) {
        console.log('💾 Saving documentation files...');
        
        const serviceDir = this.servicePath;
        
        // Save Markdown documentation
        const markdownPath = path.join(serviceDir, 'api-inventory.md');
        fs.writeFileSync(markdownPath, outputs.markdown);
        console.log(`  ✅ Saved: ${markdownPath}`);
        
        // Save OpenAPI specification
        const openapiPath = path.join(serviceDir, 'openapi.yaml');
        fs.writeFileSync(openapiPath, outputs.openapi);
        console.log(`  ✅ Saved: ${openapiPath}`);
        
        // Save JSON export
        const jsonPath = path.join(serviceDir, 'dependency-map.json');
        fs.writeFileSync(jsonPath, outputs.json);
        console.log(`  ✅ Saved: ${jsonPath}`);
        
        // Also save to output directory
        const outputDir = path.join(process.cwd(), 'output', this.serviceName);
        fs.mkdirSync(outputDir, { recursive: true });
        
        fs.writeFileSync(path.join(outputDir, 'api-inventory.md'), outputs.markdown);
        fs.writeFileSync(path.join(outputDir, 'openapi.yaml'), outputs.openapi);
        fs.writeFileSync(path.join(outputDir, 'dependency-map.json'), outputs.json);
        
        console.log(`  ✅ Copied to: ${outputDir}`);
    }
}

// Main execution
if (require.main === module) {
    const analysisPath = process.argv[2];
    const servicePath = process.argv[3];
    
    if (!analysisPath || !servicePath) {
        console.error('❌ Usage: node output-generator.js <analysis-file> <service-path>');
        process.exit(1);
    }
    
    if (!fs.existsSync(analysisPath)) {
        console.error('❌ Analysis file does not exist:', analysisPath);
        process.exit(1);
    }
    
    if (!fs.existsSync(servicePath)) {
        console.error('❌ Service path does not exist:', servicePath);
        process.exit(1);
    }
    
    const generator = new OutputGenerator(analysisPath, servicePath);
    
    generator.generate().then(outputs => {
        if (outputs) {
            console.log('\n✅ Documentation generation completed successfully!');
        } else {
            console.log('❌ Documentation generation failed');
            process.exit(1);
        }
    }).catch(error => {
        console.error('❌ Generation error:', error);
        process.exit(1);
    });
}

module.exports = OutputGenerator; 