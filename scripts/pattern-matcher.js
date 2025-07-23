/**
 * Pattern Matcher
 * Identifies similar endpoints across services for deduplication and standardization
 */
class PatternMatcher {
  constructor(options = {}) {
    this.options = {
      pathSimilarityThreshold: options.pathSimilarityThreshold || 0.8,
      parameterSimilarityThreshold: options.parameterSimilarityThreshold || 0.7,
      responseSimilarityThreshold: options.responseSimilarityThreshold || 0.6,
      overallSimilarityThreshold: options.overallSimilarityThreshold || 0.75,
      enableFuzzyMatching: options.enableFuzzyMatching !== false,
      enableSemanticMatching: options.enableSemanticMatching !== false,
      ignoreServiceBoundaries: options.ignoreServiceBoundaries !== false,
      ...options
    };

    this.patterns = new Map();
    this.similarityMatrix = new Map();
    this.clusters = [];
    this.duplicates = [];
  }

  /**
   * Analyze patterns across all endpoints
   * @param {Map} endpoints - All endpoints to analyze
   * @param {Map} services - Service context data
   * @returns {Object} Pattern analysis results
   */
  analyzePatterns(endpoints, services) {
    // Build similarity matrix
    this.buildSimilarityMatrix(endpoints);

    // Identify patterns
    this.identifyPatterns(endpoints);

    // Cluster similar endpoints
    this.clusterSimilarEndpoints();

    // Find potential duplicates
    this.findPotentialDuplicates();

    // Generate standardization opportunities
    const opportunities = this.generateStandardizationOpportunities(services);

    return this.generatePatternReport(opportunities);
  }

  /**
   * Build similarity matrix between all endpoints
   * @param {Map} endpoints - All endpoints
   */
  buildSimilarityMatrix(endpoints) {
    const endpointList = Array.from(endpoints.values());
    
    for (let i = 0; i < endpointList.length; i++) {
      const endpoint1 = endpointList[i];
      const similarityRow = new Map();
      
      for (let j = 0; j < endpointList.length; j++) {
        if (i === j) {
          similarityRow.set(endpoint1.endpoint.id, 1.0);
          continue;
        }

        const endpoint2 = endpointList[j];
        
        // Skip same service comparison if configured
        if (!this.options.ignoreServiceBoundaries && 
            endpoint1.endpoint.serviceName === endpoint2.endpoint.serviceName) {
          similarityRow.set(endpoint2.endpoint.id, 0.0);
          continue;
        }

        const similarity = this.calculateEndpointSimilarity(endpoint1.endpoint, endpoint2.endpoint);
        similarityRow.set(endpoint2.endpoint.id, similarity);
      }
      
      this.similarityMatrix.set(endpoint1.endpoint.id, similarityRow);
    }
  }

  /**
   * Calculate similarity between two endpoints
   * @param {Object} endpoint1 - First endpoint
   * @param {Object} endpoint2 - Second endpoint
   * @returns {number} Similarity score (0-1)
   */
  calculateEndpointSimilarity(endpoint1, endpoint2) {
    const weights = {
      path: 0.35,
      method: 0.15,
      parameters: 0.25,
      responses: 0.15,
      semantic: 0.1
    };

    // Method similarity (exact match)
    const methodSimilarity = endpoint1.method === endpoint2.method ? 1.0 : 0.0;

    // Path similarity
    const pathSimilarity = this.calculatePathSimilarity(endpoint1.path, endpoint2.path);

    // Parameter similarity
    const parameterSimilarity = this.calculateParameterSimilarity(
      endpoint1.parameters || [], 
      endpoint2.parameters || []
    );

    // Response similarity
    const responseSimilarity = this.calculateResponseSimilarity(
      endpoint1.responses || [], 
      endpoint2.responses || []
    );

    // Semantic similarity (based on descriptions and names)
    const semanticSimilarity = this.options.enableSemanticMatching
      ? this.calculateSemanticSimilarity(endpoint1, endpoint2)
      : 0.0;

    // Calculate weighted overall similarity
    const overallSimilarity = 
      (pathSimilarity * weights.path) +
      (methodSimilarity * weights.method) +
      (parameterSimilarity * weights.parameters) +
      (responseSimilarity * weights.responses) +
      (semanticSimilarity * weights.semantic);

    return Math.round(overallSimilarity * 1000) / 1000; // Round to 3 decimal places
  }

  /**
   * Calculate path similarity
   * @param {string} path1 - First path
   * @param {string} path2 - Second path
   * @returns {number} Path similarity score
   */
  calculatePathSimilarity(path1, path2) {
    if (path1 === path2) return 1.0;

    // Normalize paths
    const norm1 = this.normalizePath(path1);
    const norm2 = this.normalizePath(path2);

    if (norm1 === norm2) return 0.95; // High but not perfect due to normalization

    // Calculate structural similarity
    const structuralSim = this.calculateStructuralSimilarity(norm1, norm2);
    
    // Calculate token-based similarity
    const tokenSim = this.calculateTokenSimilarity(norm1, norm2);
    
    // Calculate edit distance similarity
    const editSim = this.calculateEditDistanceSimilarity(norm1, norm2);

    // Combine similarities
    return Math.max(structuralSim, (tokenSim + editSim) / 2);
  }

  /**
   * Normalize path for comparison
   * @param {string} path - Original path
   * @returns {string} Normalized path
   */
  normalizePath(path) {
    return path
      .toLowerCase()
      .replace(/\{[^}]+\}/g, '{param}')      // Normalize all parameters
      .replace(/\/+/g, '/')                  // Remove duplicate slashes
      .replace(/\/$/, '')                    // Remove trailing slash
      .replace(/^\//, '');                   // Remove leading slash for easier comparison
  }

  /**
   * Calculate structural similarity (path segments and structure)
   * @param {string} path1 - First normalized path
   * @param {string} path2 - Second normalized path
   * @returns {number} Structural similarity
   */
  calculateStructuralSimilarity(path1, path2) {
    const segments1 = path1.split('/').filter(s => s.length > 0);
    const segments2 = path2.split('/').filter(s => s.length > 0);

    // Different number of segments - lower similarity
    if (segments1.length !== segments2.length) {
      const maxLength = Math.max(segments1.length, segments2.length);
      const minLength = Math.min(segments1.length, segments2.length);
      
      if (maxLength === 0) return 1.0;
      
      // Partial structural match based on common prefix
      let commonPrefix = 0;
      for (let i = 0; i < minLength; i++) {
        if (segments1[i] === segments2[i]) {
          commonPrefix++;
        } else {
          break;
        }
      }
      
      return (commonPrefix / maxLength) * 0.7; // Penalty for different lengths
    }

    // Same length - compare segment by segment
    let matches = 0;
    for (let i = 0; i < segments1.length; i++) {
      if (segments1[i] === segments2[i]) {
        matches++;
      } else if (segments1[i] === '{param}' || segments2[i] === '{param}') {
        matches += 0.8; // Partial match for parameters
      } else {
        // Check for similar segment names
        const segmentSim = this.calculateStringEditSimilarity(segments1[i], segments2[i]);
        if (segmentSim > 0.7) {
          matches += segmentSim * 0.6;
        }
      }
    }

    return segments1.length > 0 ? matches / segments1.length : 0;
  }

  /**
   * Calculate token-based similarity
   * @param {string} path1 - First path
   * @param {string} path2 - Second path
   * @returns {number} Token similarity
   */
  calculateTokenSimilarity(path1, path2) {
    const tokens1 = new Set(path1.split(/[\/\-_]/).filter(t => t.length > 0));
    const tokens2 = new Set(path2.split(/[\/\-_]/).filter(t => t.length > 0));

    const intersection = new Set([...tokens1].filter(t => tokens2.has(t)));
    const union = new Set([...tokens1, ...tokens2]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Calculate edit distance similarity
   * @param {string} path1 - First path
   * @param {string} path2 - Second path
   * @returns {number} Edit similarity
   */
  calculateEditDistanceSimilarity(path1, path2) {
    const maxLength = Math.max(path1.length, path2.length);
    if (maxLength === 0) return 1.0;

    const editDistance = this.calculateLevenshteinDistance(path1, path2);
    return 1 - (editDistance / maxLength);
  }

  /**
   * Calculate string edit similarity
   * @param {string} str1 - First string
   * @param {string} str2 - Second string
   * @returns {number} Similarity score
   */
  calculateStringEditSimilarity(str1, str2) {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1.0;

    const editDistance = this.calculateLevenshteinDistance(str1, str2);
    return 1 - (editDistance / maxLength);
  }

  /**
   * Calculate Levenshtein distance
   * @param {string} str1 - First string
   * @param {string} str2 - Second string
   * @returns {number} Edit distance
   */
  calculateLevenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Calculate parameter similarity
   * @param {Array} params1 - First endpoint parameters
   * @param {Array} params2 - Second endpoint parameters
   * @returns {number} Parameter similarity
   */
  calculateParameterSimilarity(params1, params2) {
    if (params1.length === 0 && params2.length === 0) return 1.0;
    if (params1.length === 0 || params2.length === 0) return 0.0;

    // Create parameter signatures for comparison
    const sig1 = this.createParameterSignature(params1);
    const sig2 = this.createParameterSignature(params2);

    // Compare signatures
    const namesSim = this.compareParameterNames(sig1.names, sig2.names);
    const typesSim = this.compareParameterTypes(sig1.types, sig2.types);
    const structuralSim = this.compareParameterStructure(sig1, sig2);

    return (namesSim * 0.4) + (typesSim * 0.3) + (structuralSim * 0.3);
  }

  /**
   * Create parameter signature
   * @param {Array} parameters - Parameters array
   * @returns {Object} Parameter signature
   */
  createParameterSignature(parameters) {
    return {
      count: parameters.length,
      names: parameters.map(p => p.name?.toLowerCase() || ''),
      types: parameters.map(p => p.type?.toLowerCase() || 'string'),
      required: parameters.filter(p => p.required).length,
      optional: parameters.filter(p => !p.required).length,
      locations: parameters.map(p => p.in || 'query')
    };
  }

  /**
   * Compare parameter names
   * @param {Array} names1 - First parameter names
   * @param {Array} names2 - Second parameter names
   * @returns {number} Name similarity
   */
  compareParameterNames(names1, names2) {
    const set1 = new Set(names1);
    const set2 = new Set(names2);
    
    const intersection = new Set([...set1].filter(n => set2.has(n)));
    const union = new Set([...set1, ...set2]);
    
    if (union.size === 0) return 1.0;
    
    const exactMatch = intersection.size / union.size;
    
    // Also check for similar names (fuzzy matching)
    if (this.options.enableFuzzyMatching && exactMatch < 0.5) {
      let fuzzyMatches = 0;
      let totalComparisons = 0;
      
      names1.forEach(name1 => {
        names2.forEach(name2 => {
          totalComparisons++;
          const similarity = this.calculateStringEditSimilarity(name1, name2);
          if (similarity > 0.7) {
            fuzzyMatches += similarity;
          }
        });
      });
      
      const fuzzyScore = totalComparisons > 0 ? fuzzyMatches / totalComparisons : 0;
      return Math.max(exactMatch, fuzzyScore * 0.8); // Lower weight for fuzzy matches
    }
    
    return exactMatch;
  }

  /**
   * Compare parameter types
   * @param {Array} types1 - First parameter types
   * @param {Array} types2 - Second parameter types
   * @returns {number} Type similarity
   */
  compareParameterTypes(types1, types2) {
    if (types1.length !== types2.length) {
      const maxLength = Math.max(types1.length, types2.length);
      const minLength = Math.min(types1.length, types2.length);
      
      // Compare the overlapping portion
      let matches = 0;
      for (let i = 0; i < minLength; i++) {
        if (this.areTypesCompatible(types1[i], types2[i])) {
          matches++;
        }
      }
      
      return matches / maxLength;
    }

    // Same length - compare each type
    let matches = 0;
    for (let i = 0; i < types1.length; i++) {
      if (this.areTypesCompatible(types1[i], types2[i])) {
        matches++;
      }
    }

    return types1.length > 0 ? matches / types1.length : 1.0;
  }

  /**
   * Check if two parameter types are compatible
   * @param {string} type1 - First type
   * @param {string} type2 - Second type
   * @returns {boolean} True if compatible
   */
  areTypesCompatible(type1, type2) {
    if (type1 === type2) return true;
    
    // Define type compatibility groups
    const numericTypes = ['number', 'integer', 'int', 'float', 'double'];
    const stringTypes = ['string', 'text', 'varchar', 'char'];
    const booleanTypes = ['boolean', 'bool'];
    
    const groups = [numericTypes, stringTypes, booleanTypes];
    
    // Check if both types belong to the same compatibility group
    for (const group of groups) {
      if (group.includes(type1) && group.includes(type2)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Compare parameter structure
   * @param {Object} sig1 - First parameter signature
   * @param {Object} sig2 - Second parameter signature
   * @returns {number} Structural similarity
   */
  compareParameterStructure(sig1, sig2) {
    const countSim = 1 - Math.abs(sig1.count - sig2.count) / Math.max(sig1.count, sig2.count, 1);
    const requiredSim = 1 - Math.abs(sig1.required - sig2.required) / Math.max(sig1.required, sig2.required, 1);
    const optionalSim = 1 - Math.abs(sig1.optional - sig2.optional) / Math.max(sig1.optional, sig2.optional, 1);

    return (countSim * 0.4) + (requiredSim * 0.3) + (optionalSim * 0.3);
  }

  /**
   * Calculate response similarity
   * @param {Array} responses1 - First endpoint responses
   * @param {Array} responses2 - Second endpoint responses
   * @returns {number} Response similarity
   */
  calculateResponseSimilarity(responses1, responses2) {
    if (responses1.length === 0 && responses2.length === 0) return 1.0;
    if (responses1.length === 0 || responses2.length === 0) return 0.0;

    // Extract status codes
    const codes1 = new Set(responses1.map(r => r.statusCode));
    const codes2 = new Set(responses2.map(r => r.statusCode));

    // Calculate status code similarity
    const codeIntersection = new Set([...codes1].filter(c => codes2.has(c)));
    const codeUnion = new Set([...codes1, ...codes2]);
    const codeSimilarity = codeUnion.size > 0 ? codeIntersection.size / codeUnion.size : 0;

    // Calculate schema similarity for matching status codes
    let schemaSimilarity = 0;
    let schemaComparisons = 0;

    for (const code of codeIntersection) {
      const response1 = responses1.find(r => r.statusCode === code);
      const response2 = responses2.find(r => r.statusCode === code);
      
      if (response1 && response2) {
        schemaComparisons++;
        if (response1.schema && response2.schema) {
          schemaSimilarity += this.compareSchemas(response1.schema, response2.schema);
        } else if (!response1.schema && !response2.schema) {
          schemaSimilarity += 1.0; // Both have no schema
        } else {
          schemaSimilarity += 0.5; // One has schema, one doesn't
        }
      }
    }

    const avgSchemaSimilarity = schemaComparisons > 0 ? schemaSimilarity / schemaComparisons : 0;

    return (codeSimilarity * 0.6) + (avgSchemaSimilarity * 0.4);
  }

  /**
   * Compare two schemas
   * @param {Object} schema1 - First schema
   * @param {Object} schema2 - Second schema
   * @returns {number} Schema similarity
   */
  compareSchemas(schema1, schema2) {
    // Simple schema comparison based on type and structure
    if (!schema1 || !schema2) return 0;
    
    if (schema1.type !== schema2.type) return 0.3; // Different types but both exist

    if (schema1.type === 'object') {
      const props1 = Object.keys(schema1.properties || {});
      const props2 = Object.keys(schema2.properties || {});
      
      const propSet1 = new Set(props1);
      const propSet2 = new Set(props2);
      
      const intersection = new Set([...propSet1].filter(p => propSet2.has(p)));
      const union = new Set([...propSet1, ...propSet2]);
      
      return union.size > 0 ? intersection.size / union.size : 1.0;
    }

    return 0.8; // Same type but not object
  }

  /**
   * Calculate semantic similarity based on descriptions and names
   * @param {Object} endpoint1 - First endpoint
   * @param {Object} endpoint2 - Second endpoint
   * @returns {number} Semantic similarity
   */
  calculateSemanticSimilarity(endpoint1, endpoint2) {
    const text1 = this.extractSemanticText(endpoint1);
    const text2 = this.extractSemanticText(endpoint2);

    if (!text1 || !text2) return 0;

    // Simple keyword-based semantic similarity
    const words1 = new Set(this.extractKeywords(text1));
    const words2 = new Set(this.extractKeywords(text2));

    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Extract semantic text from endpoint
   * @param {Object} endpoint - Endpoint data
   * @returns {string} Combined semantic text
   */
  extractSemanticText(endpoint) {
    const texts = [
      endpoint.summary || '',
      endpoint.description || '',
      endpoint.operationId || '',
      ...(endpoint.tags || [])
    ].filter(t => t.length > 0);

    return texts.join(' ').toLowerCase();
  }

  /**
   * Extract keywords from text
   * @param {string} text - Input text
   * @returns {Array} Keywords
   */
  extractKeywords(text) {
    // Remove common stopwords and extract meaningful terms
    const stopwords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
      'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
      'to', 'was', 'will', 'with', 'get', 'post', 'put', 'delete', 'api'
    ]);

    return text
      .split(/\s+/)
      .map(word => word.replace(/[^a-zA-Z0-9]/g, ''))
      .filter(word => word.length > 2 && !stopwords.has(word));
  }

  /**
   * Identify common patterns across endpoints
   * @param {Map} endpoints - All endpoints
   */
  identifyPatterns(endpoints) {
    const pathPatterns = new Map();
    const parameterPatterns = new Map();
    const responsePatterns = new Map();

    // Analyze path patterns
    for (const [id, endpointData] of endpoints) {
      const endpoint = endpointData.endpoint;
      const normalizedPath = this.normalizePath(endpoint.path);
      
      // Group by path pattern
      if (!pathPatterns.has(normalizedPath)) {
        pathPatterns.set(normalizedPath, []);
      }
      pathPatterns.get(normalizedPath).push(endpoint);

      // Analyze parameter patterns
      const paramSignature = this.createParameterSignature(endpoint.parameters || []);
      const paramKey = this.serializeParameterSignature(paramSignature);
      
      if (!parameterPatterns.has(paramKey)) {
        parameterPatterns.set(paramKey, []);
      }
      parameterPatterns.get(paramKey).push(endpoint);

      // Analyze response patterns
      const responseSignature = this.createResponseSignature(endpoint.responses || []);
      const responseKey = this.serializeResponseSignature(responseSignature);
      
      if (!responsePatterns.has(responseKey)) {
        responsePatterns.set(responseKey, []);
      }
      responsePatterns.get(responseKey).push(endpoint);
    }

    this.patterns.set('path', pathPatterns);
    this.patterns.set('parameter', parameterPatterns);
    this.patterns.set('response', responsePatterns);
  }

  /**
   * Serialize parameter signature for pattern matching
   * @param {Object} signature - Parameter signature
   * @returns {string} Serialized signature
   */
  serializeParameterSignature(signature) {
    return `${signature.count}:${signature.types.sort().join(',')}:${signature.required}:${signature.optional}`;
  }

  /**
   * Create response signature
   * @param {Array} responses - Response array
   * @returns {Object} Response signature
   */
  createResponseSignature(responses) {
    return {
      count: responses.length,
      statusCodes: responses.map(r => r.statusCode).sort(),
      hasSchema: responses.some(r => r.schema !== undefined)
    };
  }

  /**
   * Serialize response signature
   * @param {Object} signature - Response signature
   * @returns {string} Serialized signature
   */
  serializeResponseSignature(signature) {
    return `${signature.count}:${signature.statusCodes.join(',')}:${signature.hasSchema}`;
  }

  /**
   * Cluster similar endpoints using similarity threshold
   */
  clusterSimilarEndpoints() {
    const processed = new Set();
    this.clusters = [];

    for (const [endpointId, similarityRow] of this.similarityMatrix) {
      if (processed.has(endpointId)) continue;

      const cluster = {
        id: `cluster_${this.clusters.length + 1}`,
        endpoints: [endpointId],
        averageSimilarity: 0,
        pattern: null
      };

      // Find similar endpoints
      for (const [otherId, similarity] of similarityRow) {
        if (otherId !== endpointId && 
            !processed.has(otherId) && 
            similarity >= this.options.overallSimilarityThreshold) {
          cluster.endpoints.push(otherId);
          processed.add(otherId);
        }
      }

      if (cluster.endpoints.length > 1) {
        // Calculate average similarity within cluster
        cluster.averageSimilarity = this.calculateClusterSimilarity(cluster.endpoints);
        this.clusters.push(cluster);
      }

      processed.add(endpointId);
    }
  }

  /**
   * Calculate average similarity within a cluster
   * @param {Array} endpointIds - Endpoint IDs in cluster
   * @returns {number} Average similarity
   */
  calculateClusterSimilarity(endpointIds) {
    let totalSimilarity = 0;
    let comparisons = 0;

    for (let i = 0; i < endpointIds.length; i++) {
      for (let j = i + 1; j < endpointIds.length; j++) {
        const similarity = this.similarityMatrix.get(endpointIds[i])?.get(endpointIds[j]) || 0;
        totalSimilarity += similarity;
        comparisons++;
      }
    }

    return comparisons > 0 ? Math.round((totalSimilarity / comparisons) * 1000) / 1000 : 0;
  }

  /**
   * Find potential duplicates (very high similarity)
   */
  findPotentialDuplicates() {
    const duplicateThreshold = 0.95;
    this.duplicates = [];

    for (const [endpointId, similarityRow] of this.similarityMatrix) {
      for (const [otherId, similarity] of similarityRow) {
        if (endpointId !== otherId && 
            similarity >= duplicateThreshold &&
            !this.isDuplicateAlreadyRecorded(endpointId, otherId)) {
          
          this.duplicates.push({
            endpoint1: endpointId,
            endpoint2: otherId,
            similarity,
            type: this.classifyDuplicateType(similarity)
          });
        }
      }
    }
  }

  /**
   * Check if duplicate pair is already recorded
   * @param {string} id1 - First endpoint ID
   * @param {string} id2 - Second endpoint ID
   * @returns {boolean} True if already recorded
   */
  isDuplicateAlreadyRecorded(id1, id2) {
    return this.duplicates.some(dup => 
      (dup.endpoint1 === id1 && dup.endpoint2 === id2) ||
      (dup.endpoint1 === id2 && dup.endpoint2 === id1)
    );
  }

  /**
   * Classify duplicate type based on similarity score
   * @param {number} similarity - Similarity score
   * @returns {string} Duplicate type
   */
  classifyDuplicateType(similarity) {
    if (similarity >= 0.98) return 'exact';
    if (similarity >= 0.95) return 'near_duplicate';
    return 'similar';
  }

  /**
   * Generate standardization opportunities
   * @param {Map} services - Service data
   * @returns {Object} Standardization opportunities
   */
  generateStandardizationOpportunities(services) {
    return {
      pathStandardization: this.identifyPathStandardizationOpportunities(),
      parameterStandardization: this.identifyParameterStandardizationOpportunities(),
      responseStandardization: this.identifyResponseStandardizationOpportunities(),
      duplicateResolution: this.generateDuplicateResolutionSuggestions(),
      clusterOptimization: this.generateClusterOptimizationSuggestions()
    };
  }

  /**
   * Identify path standardization opportunities
   * @returns {Array} Path standardization suggestions
   */
  identifyPathStandardizationOpportunities() {
    const pathPatterns = this.patterns.get('path') || new Map();
    const opportunities = [];

    for (const [pattern, endpoints] of pathPatterns) {
      if (endpoints.length > 1) {
        // Multiple endpoints with same normalized path but different actual paths
        const actualPaths = [...new Set(endpoints.map(e => e.path))];
        
        if (actualPaths.length > 1) {
          opportunities.push({
            type: 'path_normalization',
            pattern,
            endpoints: endpoints.length,
            services: [...new Set(endpoints.map(e => e.serviceName))],
            actualPaths,
            suggestion: `Standardize path format across ${endpoints.length} endpoints`
          });
        }
      }
    }

    return opportunities.sort((a, b) => b.endpoints - a.endpoints);
  }

  /**
   * Identify parameter standardization opportunities
   * @returns {Array} Parameter standardization suggestions
   */
  identifyParameterStandardizationOpportunities() {
    const paramPatterns = this.patterns.get('parameter') || new Map();
    const opportunities = [];

    for (const [signature, endpoints] of paramPatterns) {
      if (endpoints.length > 2) {
        opportunities.push({
          type: 'parameter_standardization',
          signature,
          endpoints: endpoints.length,
          services: [...new Set(endpoints.map(e => e.serviceName))],
          suggestion: `Standardize parameter format across ${endpoints.length} endpoints`
        });
      }
    }

    return opportunities.sort((a, b) => b.endpoints - a.endpoints);
  }

  /**
   * Identify response standardization opportunities
   * @returns {Array} Response standardization suggestions
   */
  identifyResponseStandardizationOpportunities() {
    const responsePatterns = this.patterns.get('response') || new Map();
    const opportunities = [];

    for (const [signature, endpoints] of responsePatterns) {
      if (endpoints.length > 2) {
        opportunities.push({
          type: 'response_standardization',
          signature,
          endpoints: endpoints.length,
          services: [...new Set(endpoints.map(e => e.serviceName))],
          suggestion: `Standardize response format across ${endpoints.length} endpoints`
        });
      }
    }

    return opportunities.sort((a, b) => b.endpoints - a.endpoints);
  }

  /**
   * Generate duplicate resolution suggestions
   * @returns {Array} Duplicate resolution suggestions
   */
  generateDuplicateResolutionSuggestions() {
    return this.duplicates.map(dup => ({
      type: 'duplicate_resolution',
      endpoint1: dup.endpoint1,
      endpoint2: dup.endpoint2,
      similarity: dup.similarity,
      duplicateType: dup.type,
      suggestion: dup.type === 'exact' 
        ? 'Consider removing one of these duplicate endpoints'
        : 'Review these similar endpoints for potential consolidation'
    }));
  }

  /**
   * Generate cluster optimization suggestions
   * @returns {Array} Cluster optimization suggestions
   */
  generateClusterOptimizationSuggestions() {
    return this.clusters
      .filter(cluster => cluster.endpoints.length >= 3)
      .map(cluster => ({
        type: 'cluster_optimization',
        clusterId: cluster.id,
        endpoints: cluster.endpoints.length,
        averageSimilarity: cluster.averageSimilarity,
        suggestion: `Consider creating a shared interface or base class for ${cluster.endpoints.length} similar endpoints`
      }))
      .sort((a, b) => b.endpoints - a.endpoints);
  }

  /**
   * Generate comprehensive pattern report
   * @param {Object} opportunities - Standardization opportunities
   * @returns {Object} Complete pattern analysis report
   */
  generatePatternReport(opportunities) {
    return {
      metadata: {
        analyzedAt: new Date().toISOString(),
        totalEndpoints: this.similarityMatrix.size,
        analysisOptions: this.options,
        version: '1.0.0'
      },
      patterns: {
        pathPatterns: this.convertPatternsToObject('path'),
        parameterPatterns: this.convertPatternsToObject('parameter'),
        responsePatterns: this.convertPatternsToObject('response')
      },
      clusters: {
        total: this.clusters.length,
        details: this.clusters.map(cluster => ({
          id: cluster.id,
          endpointCount: cluster.endpoints.length,
          averageSimilarity: cluster.averageSimilarity
        }))
      },
      duplicates: {
        total: this.duplicates.length,
        byType: this.groupDuplicatesByType(),
        details: this.duplicates
      },
      opportunities,
      statistics: {
        clusteredEndpoints: this.clusters.reduce((sum, cluster) => sum + cluster.endpoints.length, 0),
        duplicateEndpoints: this.duplicates.length * 2, // Each duplicate involves 2 endpoints
        averageClusterSize: this.clusters.length > 0 
          ? Math.round((this.clusters.reduce((sum, c) => sum + c.endpoints.length, 0) / this.clusters.length) * 100) / 100
          : 0
      },
      recommendations: this.generateTopRecommendations(opportunities)
    };
  }

  /**
   * Convert patterns map to serializable object
   * @param {string} patternType - Type of pattern
   * @returns {Object} Pattern object
   */
  convertPatternsToObject(patternType) {
    const patterns = this.patterns.get(patternType) || new Map();
    const obj = {};

    for (const [key, endpoints] of patterns) {
      if (endpoints.length > 1) { // Only include patterns with multiple endpoints
        obj[key] = {
          count: endpoints.length,
          services: [...new Set(endpoints.map(e => e.serviceName))],
          endpoints: endpoints.map(e => ({
            id: e.id,
            service: e.serviceName,
            method: e.method,
            path: e.path
          }))
        };
      }
    }

    return obj;
  }

  /**
   * Group duplicates by type
   * @returns {Object} Duplicates grouped by type
   */
  groupDuplicatesByType() {
    const grouped = {};

    this.duplicates.forEach(dup => {
      const type = dup.type;
      if (!grouped[type]) {
        grouped[type] = 0;
      }
      grouped[type]++;
    });

    return grouped;
  }

  /**
   * Generate top recommendations
   * @param {Object} opportunities - All opportunities
   * @returns {Array} Top recommendations
   */
  generateTopRecommendations(opportunities) {
    const recommendations = [];

    // High-priority recommendations
    if (this.duplicates.length > 0) {
      const exactDuplicates = this.duplicates.filter(d => d.type === 'exact').length;
      if (exactDuplicates > 0) {
        recommendations.push({
          type: 'remove_duplicates',
          priority: 'high',
          message: `${exactDuplicates} exact duplicate endpoints found`,
          suggestion: 'Remove duplicate endpoints to reduce maintenance overhead'
        });
      }
    }

    // Medium-priority recommendations
    if (this.clusters.length > 5) {
      recommendations.push({
        type: 'standardize_interfaces',
        priority: 'medium',
        message: `${this.clusters.length} clusters of similar endpoints found`,
        suggestion: 'Create shared interfaces or base classes for similar endpoints'
      });
    }

    // Low-priority recommendations
    const pathOpportunities = opportunities.pathStandardization || [];
    if (pathOpportunities.length > 0) {
      recommendations.push({
        type: 'standardize_paths',
        priority: 'low',
        message: `${pathOpportunities.length} path standardization opportunities`,
        suggestion: 'Standardize URL path formats across services'
      });
    }

    return recommendations.slice(0, 5); // Top 5 recommendations
  }
}

module.exports = PatternMatcher; 