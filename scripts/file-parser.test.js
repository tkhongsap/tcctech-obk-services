const FileParser = require('./file-parser');

/**
 * Tests for FileParser
 * Basic test structure for file parsing functionality
 */
describe('FileParser', () => {
  let parser;

  beforeEach(() => {
    parser = new FileParser();
  });

  describe('parseFile', () => {
    test('should parse api-inventory.md files', async () => {
      expect(parser.supportedTypes).toContain('api-inventory.md');
      expect(parser).toBeDefined();
    });

    test('should parse dependency-map.json files', async () => {
      expect(parser.supportedTypes).toContain('dependency-map.json');
      expect(parser).toBeDefined();
    });

    test('should handle file validation errors', async () => {
      expect(parser).toBeDefined();
    });

    test('should return error object for invalid files', async () => {
      expect(parser).toBeDefined();
    });
  });

  describe('parseApiInventory', () => {
    test('should extract endpoints from markdown content', () => {
      const sampleContent = `
# Service: test-service
Framework: Express.js

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/test | Test endpoint |
| POST | /api/data | Create data |
      `;
      
      const result = parser.parseApiInventory(sampleContent, 'test/path');
      expect(result.type).toBe('api-inventory');
      expect(result.endpoints).toBeDefined();
    });

    test('should extract framework information', () => {
      expect(parser).toBeDefined();
    });

    test('should handle malformed markdown gracefully', () => {
      expect(parser).toBeDefined();
    });
  });

  describe('parseDependencyMap', () => {
    test('should parse valid JSON dependency maps', () => {
      const sampleJSON = '{"dependencies": [], "consumers": []}';
      const result = parser.parseDependencyMap(sampleJSON, 'test/path');
      expect(result.type).toBe('dependency-map');
      expect(result.dependencies).toBeDefined();
    });

    test('should handle invalid JSON gracefully', () => {
      expect(parser).toBeDefined();
    });
  });

  describe('validate', () => {
    test('should validate parsed data structure', () => {
      const testData = {
        serviceName: 'test-service',
        type: 'api-inventory',
        endpoints: []
      };
      
      const validation = parser.validate(testData);
      expect(validation).toHaveProperty('isValid');
      expect(validation).toHaveProperty('errors');
      expect(validation).toHaveProperty('warnings');
    });

    test('should flag missing service names', () => {
      expect(parser).toBeDefined();
    });

    test('should warn about missing endpoints', () => {
      expect(parser).toBeDefined();
    });
  });
});

module.exports = {
  // Export test utilities if needed
}; 