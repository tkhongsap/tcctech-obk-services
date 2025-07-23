const ReportGenerator = require('./report-generator');
const fs = require('fs').promises;
const path = require('path');

// Mock fs module
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn(),
    writeFile: jest.fn()
  }
}));

/**
 * Tests for ReportGenerator
 * Comprehensive test suite for report generation functionality
 */
describe('ReportGenerator', () => {
  let generator;
  let mockAnalysisResults;
  let mockSummary;

  beforeEach(() => {
    generator = new ReportGenerator({
      outputDirs: ['test-output', 'test-analysis-summary']
    });

    // Reset mocks
    fs.mkdir.mockClear();
    fs.writeFile.mockClear();
    fs.mkdir.mockResolvedValue();
    fs.writeFile.mockResolvedValue();

    // Mock analysis results
    mockAnalysisResults = {
      timestamp: '2025-01-23T10:00:00.000Z',
      analysis: {
        apiFrequency: new Map([
          ['GET service-a/api/users', {
            method: 'GET',
            path: '/api/users',
            providedBy: 'service-a',
            usedBy: ['service-b', 'service-c'],
            totalUsage: 2,
            riskLevel: 'medium'
          }],
          ['POST service-a/api/users', {
            method: 'POST',
            path: '/api/users',
            providedBy: 'service-a',
            usedBy: ['service-b'],
            totalUsage: 1,
            riskLevel: 'low'
          }]
        ]),
        crossServiceAPIs: new Map([
          ['GET service-a/api/users', {
            method: 'GET',
            path: '/api/users',
            providedBy: 'service-a',
            usedBy: ['service-b', 'service-c'],
            totalUsage: 2,
            riskLevel: 'medium',
            isBottleneck: false
          }]
        ]),
        frameworkDistribution: {
          'Express.js': { count: 2, services: ['service-a', 'service-b'] },
          'NestJS': { count: 1, services: ['service-c'] }
        },
        dependencyGraph: {
          'service-a': { dependsOn: [], usedBy: ['service-b', 'service-c'] },
          'service-b': { dependsOn: ['service-a'], usedBy: [] },
          'service-c': { dependsOn: ['service-a'], usedBy: [] }
        },
        patterns: {
          highDependencyServices: [
            { service: 'service-b', dependencyCount: 15, riskLevel: 'high' }
          ],
          bottleneckAPIs: [
            {
              api: 'GET service-a/api/users',
              usageCount: 3,
              usedBy: ['service-b', 'service-c', 'service-d'],
              providedBy: 'service-a',
              riskLevel: 'high'
            }
          ],
          unusedServices: [
            { service: 'service-x', endpointCount: 5 }
          ],
          circularDependencies: []
        }
      },
      services: [
        { serviceName: 'service-a', framework: 'Express.js' },
        { serviceName: 'service-b', framework: 'Express.js' },
        { serviceName: 'service-c', framework: 'NestJS' }
      ],
      errors: [],
      warnings: []
    };

    mockSummary = {
      timestamp: '2025-01-23T10:00:00.000Z',
      services: {
        total: 3,
        successful: 3,
        errors: 0,
        warnings: 0
      },
      apis: {
        total: 15,
        crossService: 1,
        bottlenecks: 1
      },
      frameworks: {
        'Express.js': 2,
        'NestJS': 1
      },
      risks: {
        circularDependencies: 0,
        highDependencyServices: 1,
        unusedServices: 1
      }
    };
  });

  describe('constructor', () => {
    test('should initialize with default output directories', () => {
      const defaultGenerator = new ReportGenerator();
      expect(defaultGenerator.outputDirs).toEqual(['output', 'analysis-summary']);
    });

    test('should accept custom output directories', () => {
      expect(generator.outputDirs).toEqual(['test-output', 'test-analysis-summary']);
    });
  });

  describe('generateAllReports', () => {
    test('should generate all reports successfully', async () => {
      const reportPaths = await generator.generateAllReports(mockAnalysisResults, mockSummary);
      
      expect(reportPaths).toHaveProperty('json');
      expect(reportPaths).toHaveProperty('markdown');
      expect(reportPaths.json.length).toBeGreaterThan(0);
      expect(reportPaths.markdown.length).toBeGreaterThan(0);
    });

    test('should ensure directories are created', async () => {
      await generator.generateAllReports(mockAnalysisResults, mockSummary);
      
      expect(fs.mkdir).toHaveBeenCalledWith('test-output', { recursive: true });
      expect(fs.mkdir).toHaveBeenCalledWith('test-analysis-summary', { recursive: true });
    });

    test('should handle errors gracefully', async () => {
      fs.mkdir.mockRejectedValue(new Error('Directory creation failed'));
      
      await expect(generator.generateAllReports(mockAnalysisResults, mockSummary))
        .rejects.toThrow('Directory creation failed');
    });
  });

  describe('generateJSONReports', () => {
    test('should generate JSON analysis report', async () => {
      const paths = await generator.generateJSONReports(mockAnalysisResults, mockSummary);
      
      expect(paths).toHaveLength(4); // 2 files × 2 directories
      expect(paths).toContain('test-output/api-usage-analysis.json');
      expect(paths).toContain('test-analysis-summary/api-usage-analysis.json');
      expect(paths).toContain('test-output/dependency-summary.json');
      expect(paths).toContain('test-analysis-summary/dependency-summary.json');
    });

    test('should write valid JSON content', async () => {
      await generator.generateJSONReports(mockAnalysisResults, mockSummary);
      
      const writeFileCalls = fs.writeFile.mock.calls;
      const analysisReportCalls = writeFileCalls.filter(call => 
        call[0].includes('api-usage-analysis.json')
      );
      
      expect(analysisReportCalls).toHaveLength(2);
      
      // Verify JSON is valid and contains expected structure
      const jsonContent = JSON.parse(analysisReportCalls[0][1]);
      expect(jsonContent).toHaveProperty('metadata');
      expect(jsonContent).toHaveProperty('summary');
      expect(jsonContent).toHaveProperty('analysis');
      expect(jsonContent.metadata.reportType).toBe('api-usage-analysis');
    });
  });

  describe('generateMarkdownReports', () => {
    test('should generate main Markdown report', async () => {
      const paths = await generator.generateMarkdownReports(mockAnalysisResults, mockSummary);
      
      expect(paths).toHaveLength(4); // 2 files × 2 directories
      expect(paths).toContain('test-output/api-usage-report.md');
      expect(paths).toContain('test-analysis-summary/api-usage-report.md');
    });

    test('should generate bottleneck report', async () => {
      const paths = await generator.generateMarkdownReports(mockAnalysisResults, mockSummary);
      
      expect(paths).toContain('test-output/bottleneck-report.md');
      expect(paths).toContain('test-analysis-summary/bottleneck-report.md');
    });

    test('should include framework distribution in main report', async () => {
      await generator.generateMarkdownReports(mockAnalysisResults, mockSummary);
      
      const writeFileCalls = fs.writeFile.mock.calls;
      const mainReportCalls = writeFileCalls.filter(call => 
        call[0].includes('api-usage-report.md')
      );
      
      expect(mainReportCalls).toHaveLength(2);
      
      const markdownContent = mainReportCalls[0][1];
      expect(markdownContent).toContain('Framework Distribution');
      expect(markdownContent).toContain('Express.js');
      expect(markdownContent).toContain('NestJS');
    });
  });

  describe('generateMainMarkdownReport', () => {
    test('should include executive summary', () => {
      const markdown = generator.generateMainMarkdownReport(mockAnalysisResults, mockSummary);
      
      expect(markdown).toContain('# API Usage Analysis Report');
      expect(markdown).toContain('Executive Summary');
      expect(markdown).toContain('Total Services Analyzed**: 3');
      expect(markdown).toContain('Total API Endpoints**: 15');
    });

    test('should include framework distribution table', () => {
      const markdown = generator.generateMainMarkdownReport(mockAnalysisResults, mockSummary);
      
      expect(markdown).toContain('Framework Distribution');
      expect(markdown).toContain('| Framework | Service Count | Percentage |');
      expect(markdown).toContain('| Express.js | 2 | 67% |');
      expect(markdown).toContain('| NestJS | 1 | 33% |');
    });

    test('should include most frequently used APIs', () => {
      const markdown = generator.generateMainMarkdownReport(mockAnalysisResults, mockSummary);
      
      expect(markdown).toContain('Most Frequently Used APIs');
      expect(markdown).toContain('| Rank | API Endpoint | Provider | Usage Count |');
    });

    test('should include risk assessment section', () => {
      const markdown = generator.generateMainMarkdownReport(mockAnalysisResults, mockSummary);
      
      expect(markdown).toContain('Risk Assessment');
      expect(markdown).toContain('Critical Risks Identified');
      expect(markdown).toContain('High Dependency Services**: 1');
      expect(markdown).toContain('Unused Services**: 1');
    });

    test('should include recommendations', () => {
      const markdown = generator.generateMainMarkdownReport(mockAnalysisResults, mockSummary);
      
      expect(markdown).toContain('Recommendations');
      expect(markdown).toContain('Optimize High-Usage APIs');
      expect(markdown).toContain('Address Bottlenecks');
      expect(markdown).toContain('Reduce Dependencies');
    });
  });

  describe('generateBottleneckReport', () => {
    test('should include bottleneck overview', () => {
      const markdown = generator.generateBottleneckReport(mockAnalysisResults, mockSummary);
      
      expect(markdown).toContain('# API Bottleneck Analysis Report');
      expect(markdown).toContain('Overview');
      expect(markdown).toContain('Summary Statistics');
    });

    test('should include detailed bottleneck analysis', () => {
      const markdown = generator.generateBottleneckReport(mockAnalysisResults, mockSummary);
      
      expect(markdown).toContain('Detailed Bottleneck Analysis');
      expect(markdown).toContain('Critical Bottleneck APIs');
      expect(markdown).toContain('GET service-a/api/users');
    });

    test('should include risk mitigation strategies', () => {
      const markdown = generator.generateBottleneckReport(mockAnalysisResults, mockSummary);
      
      expect(markdown).toContain('Risk Mitigation Strategies');
      expect(markdown).toContain('Monitoring and Observability');
      expect(markdown).toContain('Performance Optimization');
      expect(markdown).toContain('Resilience Patterns');
    });

    test('should handle empty bottleneck data', () => {
      const emptyResults = {
        ...mockAnalysisResults,
        analysis: {
          ...mockAnalysisResults.analysis,
          patterns: { bottleneckAPIs: [] }
        }
      };
      
      const markdown = generator.generateBottleneckReport(emptyResults, mockSummary);
      expect(markdown).toContain('No Critical Bottlenecks Identified');
    });
  });

  describe('convertMapsToObjects', () => {
    test('should convert Maps to arrays', () => {
      const result = generator.convertMapsToObjects(mockAnalysisResults.analysis);
      
      expect(result.apiFrequency).toBeInstanceOf(Array);
      expect(result.crossServiceAPIs).toBeInstanceOf(Array);
      expect(result.apiFrequency[0]).toHaveProperty('key');
    });

    test('should handle empty or null analysis', () => {
      expect(generator.convertMapsToObjects(null)).toEqual({});
      expect(generator.convertMapsToObjects({})).toEqual({
        apiFrequency: [],
        crossServiceAPIs: []
      });
    });
  });

  describe('convertMapToArray', () => {
    test('should convert Map to array of objects', () => {
      const testMap = new Map([
        ['key1', { value: 'test1' }],
        ['key2', { value: 'test2' }]
      ]);
      
      const result = generator.convertMapToArray(testMap);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ key: 'key1', value: 'test1' });
      expect(result[1]).toEqual({ key: 'key2', value: 'test2' });
    });

    test('should handle non-Map inputs', () => {
      expect(generator.convertMapToArray(null)).toEqual([]);
      expect(generator.convertMapToArray(undefined)).toEqual([]);
      expect(generator.convertMapToArray({})).toEqual([]);
    });
  });

  describe('generateAPIRanking', () => {
    test('should rank APIs by usage frequency', () => {
      const ranking = generator.generateAPIRanking(mockAnalysisResults.analysis.apiFrequency, 5);
      
      expect(ranking).toHaveLength(2);
      expect(ranking[0].rank).toBe(1);
      expect(ranking[0].usageCount).toBe(2);
      expect(ranking[1].rank).toBe(2);
      expect(ranking[1].usageCount).toBe(1);
    });

    test('should limit results correctly', () => {
      const ranking = generator.generateAPIRanking(mockAnalysisResults.analysis.apiFrequency, 1);
      expect(ranking).toHaveLength(1);
    });

    test('should handle empty or invalid input', () => {
      expect(generator.generateAPIRanking(null)).toEqual([]);
      expect(generator.generateAPIRanking(new Map())).toEqual([]);
    });
  });

  describe('ensureDirectories', () => {
    test('should create all specified directories', async () => {
      await generator.ensureDirectories();
      
      expect(fs.mkdir).toHaveBeenCalledWith('test-output', { recursive: true });
      expect(fs.mkdir).toHaveBeenCalledWith('test-analysis-summary', { recursive: true });
    });

    test('should handle directory creation errors', async () => {
      fs.mkdir.mockRejectedValue(new Error('Permission denied'));
      
      await expect(generator.ensureDirectories()).rejects.toThrow('Permission denied');
    });
  });
});

module.exports = {
  // Export test utilities if needed
}; 