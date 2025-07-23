const fs = require('fs');
const path = require('path');

/**
 * CSV Generator for API Documentation
 * Creates detailed CSV files with comprehensive API endpoint information
 */
class CSVGenerator {
    constructor(analysisData) {
        this.data = analysisData;
        this.serviceName = analysisData.service.name;
        this.baseUrl = analysisData.service.baseUrl || 'http://localhost:3000';
        this.framework = analysisData.service.framework || 'unknown';
    }

    /**
     * Generate comprehensive CSV content
     */
    generateCSV() {
        const headers = [
            'Service Name',
            'API URL', 
            'Method',
            'Path',
            'Endpoint Name',
            'Description',
            'Parameters',
            'Request Payload',
            'Response Example',
            'Status Codes',
            'Authentication',
            'Controller/File',
            'Framework'
        ];

        let csvContent = headers.join(',') + '\n';

        if (!this.data.api.endpoints || this.data.api.endpoints.length === 0) {
            // Add a row indicating no endpoints found
            const row = [
                this.serviceName,
                this.baseUrl,
                'N/A',
                'N/A',
                'N/A',
                'No API endpoints detected in this service',
                'N/A',
                'N/A',
                'N/A',
                'N/A',
                'N/A',
                this.data.service.framework || 'Configuration/Support',
                this.framework
            ];
            csvContent += this.formatCSVRow(row) + '\n';
            return csvContent;
        }

        for (const endpoint of this.data.api.endpoints) {
            const fullUrl = this.buildFullUrl(endpoint.path);
            const parameters = this.formatParameters(endpoint.parameters);
            const requestPayload = this.formatRequestPayload(endpoint.parameters);
            const responseExample = this.formatResponseExample(endpoint.responses);
            const statusCodes = this.formatStatusCodes(endpoint.responses);
            const authentication = this.formatAuthentication(endpoint.authentication);
            const controllerInfo = this.formatControllerInfo(endpoint);

            const row = [
                this.serviceName,
                fullUrl,
                endpoint.method || 'GET',
                endpoint.path || '/',
                endpoint.actionName || endpoint.functionName || 'Unknown',
                endpoint.description || 'No description available',
                parameters,
                requestPayload,
                responseExample,
                statusCodes,
                authentication,
                controllerInfo,
                this.framework
            ];

            csvContent += this.formatCSVRow(row) + '\n';
        }

        return csvContent;
    }

    /**
     * Build full URL combining base URL and endpoint path
     */
    buildFullUrl(endpointPath) {
        if (!endpointPath) return this.baseUrl;
        
        const cleanPath = endpointPath.startsWith('/') ? endpointPath : '/' + endpointPath;
        const cleanBaseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
        
        return cleanBaseUrl + cleanPath;
    }

    /**
     * Format parameters for CSV display
     */
    formatParameters(parameters) {
        if (!parameters || parameters.length === 0) {
            return 'None';
        }

        return parameters.map(param => {
            const required = param.required ? '[Required]' : '[Optional]';
            const location = param.location ? `(${param.location})` : '';
            return `${param.name}:${param.type} ${required} ${location}`;
        }).join('; ');
    }

    /**
     * Format request payload information
     */
    formatRequestPayload(parameters) {
        if (!parameters || parameters.length === 0) {
            return 'None';
        }

        const bodyParams = parameters.filter(p => p.location === 'body');
        if (bodyParams.length === 0) {
            return 'None';
        }

        return bodyParams.map(param => {
            if (param.schema) {
                return `${param.name}: ${JSON.stringify(param.schema, null, 0)}`;
            } else {
                return `${param.name} (${param.type})`;
            }
        }).join('; ');
    }

    /**
     * Format response examples
     */
    formatResponseExample(responses) {
        if (!responses || responses.length === 0) {
            return 'Standard HTTP response';
        }

        const successResponse = responses.find(r => r.status >= 200 && r.status < 300) || responses[0];
        
        if (successResponse.example) {
            if (typeof successResponse.example === 'object') {
                return JSON.stringify(successResponse.example, null, 0);
            } else {
                return successResponse.example;
            }
        }

        return successResponse.description || 'Standard response';
    }

    /**
     * Format status codes
     */
    formatStatusCodes(responses) {
        if (!responses || responses.length === 0) {
            return '200 OK';
        }

        return responses.map(r => `${r.status} ${r.description || 'Response'}`).join('; ');
    }

    /**
     * Format authentication information
     */
    formatAuthentication(auth) {
        if (!auth) {
            return 'None';
        }

        if (typeof auth === 'object') {
            return `${auth.type}: ${auth.description || 'Required'}`;
        }

        return auth.toString();
    }

    /**
     * Format controller/file information
     */
    formatControllerInfo(endpoint) {
        const parts = [];
        
        if (endpoint.controllerName) {
            parts.push(`Controller: ${endpoint.controllerName}`);
        }
        
        if (endpoint.file) {
            const fileName = path.basename(endpoint.file);
            parts.push(`File: ${fileName}`);
        }

        return parts.length > 0 ? parts.join(', ') : 'N/A';
    }

    /**
     * Format a CSV row with proper escaping
     */
    formatCSVRow(row) {
        return row.map(cell => {
            // Convert to string and handle null/undefined
            const cellValue = cell == null ? '' : String(cell);
            
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            if (cellValue.includes(',') || cellValue.includes('"') || cellValue.includes('\n')) {
                return '"' + cellValue.replace(/"/g, '""') + '"';
            }
            
            return cellValue;
        }).join(',');
    }

    /**
     * Save CSV to file
     */
    saveToFile(outputPath) {
        const csvContent = this.generateCSV();
        fs.writeFileSync(outputPath, csvContent, 'utf8');
        console.log(`📊 CSV saved: ${outputPath}`);
        return outputPath;
    }
}

/**
 * Main function to generate CSV from analysis JSON
 */
function generateCSVFromAnalysis(analysisJsonPath, outputDir) {
    try {
        // Read analysis data
        const analysisData = JSON.parse(fs.readFileSync(analysisJsonPath, 'utf8'));
        
        // Create CSV generator
        const generator = new CSVGenerator(analysisData);
        
        // Generate output filename
        const serviceName = analysisData.service.name;
        const outputPath = path.join(outputDir, `${serviceName}-api-documentation.csv`);
        
        // Generate and save CSV
        generator.saveToFile(outputPath);
        
        return outputPath;
    } catch (error) {
        console.error(`❌ Error generating CSV: ${error.message}`);
        throw error;
    }
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log('Usage: node csv-generator.js <analysis.json> <output-dir>');
        process.exit(1);
    }

    const [analysisJsonPath, outputDir] = args;
    
    try {
        generateCSVFromAnalysis(analysisJsonPath, outputDir);
        console.log('✅ CSV generation completed successfully!');
    } catch (error) {
        console.error('💥 CSV generation failed:', error.message);
        process.exit(1);
    }
}

module.exports = { CSVGenerator, generateCSVFromAnalysis };