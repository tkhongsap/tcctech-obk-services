/**
 * Dependency Graph Builder
 * Builds comprehensive service dependency graphs from analyzed relationships
 */
class DependencyGraphBuilder {
  constructor(options = {}) {
    this.options = {
      includeExternal: options.includeExternal !== false,
      includePackages: options.includePackages !== false,
      includeIndirect: options.includeIndirect !== false,
      maxDepth: options.maxDepth || 5,
      circularDetection: options.circularDetection !== false,
      ...options
    };

    this.graph = {
      nodes: new Map(), // service -> node data
      edges: new Map(), // from -> Map(to -> edge data)
      metadata: {
        totalNodes: 0,
        totalEdges: 0,
        externalNodes: 0,
        circularDependencies: [],
        orphanNodes: [],
        clusters: []
      }
    };

    this.analysisData = {
      services: new Map(),
      crossReferences: new Map(),
      frequencyData: null
    };
  }

  /**
   * Build dependency graph from analysis results
   * @param {Map} services - Analyzed service data
   * @param {Object} crossReferences - Cross-reference analysis results
   * @param {Object} frequencyData - Frequency analysis data
   * @returns {Object} Dependency graph analysis
   */
  buildGraph(services, crossReferences, frequencyData) {
    // Store analysis data
    this.analysisData.services = services;
    this.analysisData.crossReferences = crossReferences;
    this.analysisData.frequencyData = frequencyData;

    // Build nodes
    this.buildNodes(services);

    // Build edges from different sources
    this.buildEdgesFromServiceData(services);
    this.buildEdgesFromCrossReferences(crossReferences);
    this.buildEdgesFromFrequencyData(frequencyData);

    // Analyze graph structure
    this.analyzeGraphStructure();

    // Detect patterns
    this.detectPatterns();

    return this.generateGraphReport();
  }

  /**
   * Build graph nodes from services
   * @param {Map} services - Service data
   */
  buildNodes(services) {
    for (const [serviceName, serviceInfo] of services) {
      if (!serviceInfo.analysisData?.unified) continue;

      const service = serviceInfo.analysisData.unified;
      
      const node = {
        id: serviceName,
        type: 'internal',
        label: serviceName,
        metadata: {
          framework: service.service.framework,
          language: service.service.language,
          version: service.service.version,
          endpointCount: service.endpoints.length,
          complexity: service.metadata.complexity,
          internalDependencies: service.dependencies.internal.length,
          externalDependencies: service.dependencies.external.length,
          packageDependencies: service.dependencies.packages.length
        },
        properties: {
          size: this.calculateNodeSize(service),
          category: this.categorizeService(service),
          criticality: this.calculateCriticality(service),
          maturity: this.assessMaturity(service)
        },
        position: { x: 0, y: 0 }, // Will be calculated during layout
        connections: {
          incoming: 0,
          outgoing: 0,
          bidirectional: 0
        }
      };

      this.graph.nodes.set(serviceName, node);
    }

    // Add external service nodes if enabled
    if (this.options.includeExternal) {
      this.addExternalNodes(services);
    }

    this.graph.metadata.totalNodes = this.graph.nodes.size;
  }

  /**
   * Calculate node size based on service characteristics
   * @param {Object} service - Service data
   * @returns {number} Node size score
   */
  calculateNodeSize(service) {
    const endpointWeight = service.endpoints.length * 0.3;
    const complexityWeight = (service.metadata.complexity || 0) * 0.2;
    const dependencyWeight = service.dependencies.internal.length * 0.1;
    
    return Math.min(100, Math.max(10, endpointWeight + complexityWeight + dependencyWeight));
  }

  /**
   * Categorize service based on characteristics
   * @param {Object} service - Service data
   * @returns {string} Service category
   */
  categorizeService(service) {
    const endpoints = service.endpoints.length;
    const dependencies = service.dependencies.internal.length;
    
    if (endpoints > 20 && dependencies > 5) return 'core';
    if (endpoints > 10) return 'service';
    if (dependencies > 8) return 'hub';
    if (dependencies === 0) return 'leaf';
    return 'utility';
  }

  /**
   * Calculate service criticality
   * @param {Object} service - Service data
   * @returns {string} Criticality level
   */
  calculateCriticality(service) {
    const complexity = service.metadata.complexity || 0;
    const endpoints = service.endpoints.length;
    const dependencies = service.dependencies.internal.length;
    
    const score = (complexity * 0.4) + (endpoints * 0.3) + (dependencies * 0.3);
    
    if (score > 15) return 'critical';
    if (score > 10) return 'high';
    if (score > 5) return 'medium';
    return 'low';
  }

  /**
   * Assess service maturity
   * @param {Object} service - Service data
   * @returns {string} Maturity level
   */
  assessMaturity(service) {
    const hasVersion = !!service.service.version;
    const hasDocumentation = service.endpoints.some(e => e.description);
    const hasErrorHandling = service.endpoints.some(e => 
      e.responses.some(r => parseInt(r.statusCode) >= 400)
    );
    
    const maturityScore = (hasVersion ? 1 : 0) + 
                         (hasDocumentation ? 1 : 0) + 
                         (hasErrorHandling ? 1 : 0);
    
    if (maturityScore >= 3) return 'mature';
    if (maturityScore >= 2) return 'developing';
    return 'early';
  }

  /**
   * Add external service nodes
   * @param {Map} services - Service data
   */
  addExternalNodes(services) {
    const externalServices = new Set();

    for (const [serviceName, serviceInfo] of services) {
      if (!serviceInfo.analysisData?.unified) continue;

      const service = serviceInfo.analysisData.unified;
      
      service.dependencies.external.forEach(dep => {
        externalServices.add(dep.name);
      });
    }

    for (const externalService of externalServices) {
      const node = {
        id: `external_${externalService}`,
        type: 'external',
        label: externalService,
        metadata: {
          framework: 'unknown',
          language: 'unknown',
          version: 'unknown'
        },
        properties: {
          size: 15,
          category: 'external',
          criticality: 'unknown',
          maturity: 'unknown'
        },
        connections: {
          incoming: 0,
          outgoing: 0,
          bidirectional: 0
        }
      };

      this.graph.nodes.set(node.id, node);
      this.graph.metadata.externalNodes++;
    }
  }

  /**
   * Build edges from service dependency data
   * @param {Map} services - Service data
   */
  buildEdgesFromServiceData(services) {
    for (const [serviceName, serviceInfo] of services) {
      if (!serviceInfo.analysisData?.unified) continue;

      const service = serviceInfo.analysisData.unified;
      
      // Internal dependencies
      service.dependencies.internal.forEach(dep => {
        this.addEdge(serviceName, dep.name, {
          type: 'dependency',
          source: 'service_config',
          strength: 1.0,
          endpoints: dep.endpoints || [],
          relationship: 'depends_on'
        });
      });

      // External dependencies
      if (this.options.includeExternal) {
        service.dependencies.external.forEach(dep => {
          this.addEdge(serviceName, `external_${dep.name}`, {
            type: 'external_dependency',
            source: 'service_config',
            strength: 0.7,
            endpoints: dep.endpoints || [],
            relationship: 'depends_on'
          });
        });
      }

      // API calls from relationships
      if (service.relationships?.apiCalls) {
        service.relationships.apiCalls.forEach(call => {
          this.addEdge(serviceName, call.to, {
            type: 'api_call',
            source: 'relationship_map',
            strength: 0.9,
            endpoint: call.endpoint,
            method: call.method,
            relationship: 'calls'
          });
        });
      }
    }
  }

  /**
   * Build edges from cross-reference analysis
   * @param {Object} crossReferences - Cross-reference data
   */
  buildEdgesFromCrossReferences(crossReferences) {
    if (!crossReferences?.sharedApis) return;

    crossReferences.sharedApis.forEach(api => {
      const targetService = api.serviceName;
      
      api.callers.forEach(callerService => {
        if (callerService !== targetService) {
          this.addEdge(callerService, targetService, {
            type: 'cross_reference',
            source: 'cross_reference_analysis',
            strength: 0.6,
            endpoint: api.path,
            method: api.method,
            relationship: 'references'
          });
        }
      });
    });
  }

  /**
   * Build edges from frequency analysis data
   * @param {Object} frequencyData - Frequency analysis results
   */
  buildEdgesFromFrequencyData(frequencyData) {
    if (!frequencyData?.callGraph) return;

    Object.entries(frequencyData.callGraph).forEach(([fromService, calls]) => {
      calls.forEach(call => {
        const [toService, endpoint] = call.split(':');
        
        this.addEdge(fromService, toService, {
          type: 'frequency_call',
          source: 'frequency_analysis',
          strength: 0.5,
          endpoint,
          relationship: 'frequently_calls'
        });
      });
    });
  }

  /**
   * Add edge to graph
   * @param {string} from - Source service
   * @param {string} to - Target service
   * @param {Object} edgeData - Edge properties
   */
  addEdge(from, to, edgeData) {
    // Ensure both nodes exist
    if (!this.graph.nodes.has(from) || !this.graph.nodes.has(to)) {
      return;
    }

    // Initialize edge map for source
    if (!this.graph.edges.has(from)) {
      this.graph.edges.set(from, new Map());
    }

    const edgeMap = this.graph.edges.get(from);
    const edgeKey = `${from}->${to}`;

    // Check if edge already exists
    if (edgeMap.has(to)) {
      // Merge edge data
      const existingEdge = edgeMap.get(to);
      existingEdge.sources.push(edgeData.source);
      existingEdge.strength = Math.max(existingEdge.strength, edgeData.strength);
      existingEdge.types.add(edgeData.type);
    } else {
      // Create new edge
      const edge = {
        id: edgeKey,
        from,
        to,
        type: edgeData.type,
        types: new Set([edgeData.type]),
        source: edgeData.source,
        sources: [edgeData.source],
        strength: edgeData.strength,
        weight: this.calculateEdgeWeight(edgeData),
        metadata: {
          endpoint: edgeData.endpoint,
          method: edgeData.method,
          endpoints: edgeData.endpoints,
          relationship: edgeData.relationship
        },
        properties: {
          style: this.getEdgeStyle(edgeData.type),
          color: this.getEdgeColor(edgeData.type),
          width: Math.max(1, edgeData.strength * 3)
        }
      };

      edgeMap.set(to, edge);
      
      // Update connection counts
      this.updateConnectionCounts(from, to);
      
      this.graph.metadata.totalEdges++;
    }
  }

  /**
   * Calculate edge weight
   * @param {Object} edgeData - Edge data
   * @returns {number} Edge weight
   */
  calculateEdgeWeight(edgeData) {
    const baseWeight = edgeData.strength;
    const typeWeights = {
      'dependency': 1.0,
      'api_call': 0.9,
      'cross_reference': 0.6,
      'frequency_call': 0.5,
      'external_dependency': 0.3
    };

    return baseWeight * (typeWeights[edgeData.type] || 0.5);
  }

  /**
   * Get edge visual style
   * @param {string} type - Edge type
   * @returns {string} Edge style
   */
  getEdgeStyle(type) {
    const styles = {
      'dependency': 'solid',
      'api_call': 'solid',
      'cross_reference': 'dashed',
      'frequency_call': 'dotted',
      'external_dependency': 'dashed'
    };

    return styles[type] || 'solid';
  }

  /**
   * Get edge color
   * @param {string} type - Edge type
   * @returns {string} Edge color
   */
  getEdgeColor(type) {
    const colors = {
      'dependency': '#2196F3',      // Blue
      'api_call': '#4CAF50',        // Green
      'cross_reference': '#FF9800', // Orange
      'frequency_call': '#9C27B0',  // Purple
      'external_dependency': '#757575' // Gray
    };

    return colors[type] || '#757575';
  }

  /**
   * Update connection counts for nodes
   * @param {string} from - Source node
   * @param {string} to - Target node
   */
  updateConnectionCounts(from, to) {
    const fromNode = this.graph.nodes.get(from);
    const toNode = this.graph.nodes.get(to);

    if (fromNode) {
      fromNode.connections.outgoing++;
    }

    if (toNode) {
      toNode.connections.incoming++;
    }

    // Check for bidirectional
    const reverseExists = this.graph.edges.get(to)?.has(from);
    if (reverseExists) {
      if (fromNode) fromNode.connections.bidirectional++;
      if (toNode) toNode.connections.bidirectional++;
    }
  }

  /**
   * Analyze graph structure and properties
   */
  analyzeGraphStructure() {
    this.detectCircularDependencies();
    this.findOrphanNodes();
    this.identifyClusters();
    this.calculateCentralityMetrics();
  }

  /**
   * Detect circular dependencies
   */
  detectCircularDependencies() {
    if (!this.options.circularDetection) return;

    const visited = new Set();
    const recursionStack = new Set();
    const circles = [];

    const dfs = (node, path = []) => {
      if (recursionStack.has(node)) {
        // Found cycle
        const cycleStart = path.indexOf(node);
        const cycle = path.slice(cycleStart);
        cycle.push(node);
        circles.push(cycle);
        return;
      }

      if (visited.has(node)) return;

      visited.add(node);
      recursionStack.add(node);
      path.push(node);

      const edges = this.graph.edges.get(node);
      if (edges) {
        for (const target of edges.keys()) {
          dfs(target, [...path]);
        }
      }

      recursionStack.delete(node);
    };

    for (const nodeId of this.graph.nodes.keys()) {
      if (!visited.has(nodeId)) {
        dfs(nodeId);
      }
    }

    this.graph.metadata.circularDependencies = circles.map(cycle => ({
      cycle,
      length: cycle.length - 1,
      severity: this.calculateCycleSeverity(cycle)
    }));
  }

  /**
   * Calculate cycle severity
   * @param {Array} cycle - Cycle nodes
   * @returns {string} Severity level
   */
  calculateCycleSeverity(cycle) {
    const length = cycle.length - 1;
    const involvedNodes = new Set(cycle);
    
    // Count strong dependencies in cycle
    let strongDependencies = 0;
    for (let i = 0; i < cycle.length - 1; i++) {
      const edge = this.graph.edges.get(cycle[i])?.get(cycle[i + 1]);
      if (edge && edge.strength > 0.7) {
        strongDependencies++;
      }
    }

    if (length <= 2 && strongDependencies === length) return 'critical';
    if (length <= 3 && strongDependencies > length / 2) return 'high';
    if (length <= 5) return 'medium';
    return 'low';
  }

  /**
   * Find orphan nodes (no connections)
   */
  findOrphanNodes() {
    const orphans = [];

    for (const [nodeId, node] of this.graph.nodes) {
      const hasIncoming = node.connections.incoming > 0;
      const hasOutgoing = node.connections.outgoing > 0;
      
      if (!hasIncoming && !hasOutgoing) {
        orphans.push({
          id: nodeId,
          type: node.type,
          category: node.properties.category
        });
      }
    }

    this.graph.metadata.orphanNodes = orphans;
  }

  /**
   * Identify service clusters
   */
  identifyClusters() {
    const clusters = [];
    const processed = new Set();

    for (const [nodeId, node] of this.graph.nodes) {
      if (processed.has(nodeId) || node.type === 'external') continue;

      const cluster = this.buildCluster(nodeId, processed);
      if (cluster.nodes.length > 2) {
        clusters.push(cluster);
      }
    }

    this.graph.metadata.clusters = clusters;
  }

  /**
   * Build cluster from starting node
   * @param {string} startNode - Starting node ID
   * @param {Set} processed - Already processed nodes
   * @returns {Object} Cluster data
   */
  buildCluster(startNode, processed) {
    const cluster = {
      id: `cluster_${startNode}`,
      nodes: [],
      connections: 0,
      density: 0,
      category: null
    };

    const toProcess = [startNode];
    const clusterNodes = new Set();

    while (toProcess.length > 0) {
      const current = toProcess.pop();
      
      if (processed.has(current) || clusterNodes.has(current)) continue;
      
      clusterNodes.add(current);
      processed.add(current);

      // Find connected nodes
      const edges = this.graph.edges.get(current);
      if (edges) {
        for (const [target, edge] of edges) {
          if (edge.strength > 0.5 && !clusterNodes.has(target)) {
            toProcess.push(target);
          }
        }
      }

      // Check reverse connections
      for (const [source, edgeMap] of this.graph.edges) {
        if (edgeMap.has(current) && edgeMap.get(current).strength > 0.5) {
          if (!clusterNodes.has(source)) {
            toProcess.push(source);
          }
        }
      }
    }

    cluster.nodes = Array.from(clusterNodes);
    cluster.connections = this.countClusterConnections(cluster.nodes);
    cluster.density = this.calculateClusterDensity(cluster.nodes);
    cluster.category = this.determineClusterCategory(cluster.nodes);

    return cluster;
  }

  /**
   * Count connections within cluster
   * @param {Array} nodes - Cluster nodes
   * @returns {number} Connection count
   */
  countClusterConnections(nodes) {
    let connections = 0;
    const nodeSet = new Set(nodes);

    for (const node of nodes) {
      const edges = this.graph.edges.get(node);
      if (edges) {
        for (const target of edges.keys()) {
          if (nodeSet.has(target)) {
            connections++;
          }
        }
      }
    }

    return connections;
  }

  /**
   * Calculate cluster density
   * @param {Array} nodes - Cluster nodes
   * @returns {number} Density score
   */
  calculateClusterDensity(nodes) {
    const n = nodes.length;
    if (n <= 1) return 0;

    const maxConnections = n * (n - 1);
    const actualConnections = this.countClusterConnections(nodes);

    return Math.round((actualConnections / maxConnections) * 100) / 100;
  }

  /**
   * Determine cluster category
   * @param {Array} nodes - Cluster nodes
   * @returns {string} Cluster category
   */
  determineClusterCategory(nodes) {
    const categories = {};

    nodes.forEach(nodeId => {
      const node = this.graph.nodes.get(nodeId);
      if (node) {
        const category = node.properties.category;
        categories[category] = (categories[category] || 0) + 1;
      }
    });

    // Return most common category
    return Object.entries(categories)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'mixed';
  }

  /**
   * Calculate centrality metrics for nodes
   */
  calculateCentralityMetrics() {
    for (const [nodeId, node] of this.graph.nodes) {
      node.centrality = {
        degree: this.calculateDegreeCentrality(nodeId),
        betweenness: this.calculateBetweennessCentrality(nodeId),
        closeness: this.calculateClosenessCentrality(nodeId),
        pagerank: this.calculatePageRank(nodeId)
      };
    }
  }

  /**
   * Calculate degree centrality
   * @param {string} nodeId - Node ID
   * @returns {number} Degree centrality
   */
  calculateDegreeCentrality(nodeId) {
    const node = this.graph.nodes.get(nodeId);
    if (!node) return 0;

    const totalConnections = node.connections.incoming + node.connections.outgoing;
    const maxPossible = (this.graph.nodes.size - 1) * 2; // Bidirectional

    return maxPossible > 0 ? totalConnections / maxPossible : 0;
  }

  /**
   * Calculate betweenness centrality (simplified)
   * @param {string} nodeId - Node ID
   * @returns {number} Betweenness centrality
   */
  calculateBetweennessCentrality(nodeId) {
    // Simplified calculation based on connections
    const node = this.graph.nodes.get(nodeId);
    if (!node) return 0;

    const incoming = node.connections.incoming;
    const outgoing = node.connections.outgoing;
    
    // Nodes with both high incoming and outgoing are likely bridges
    return (incoming * outgoing) / Math.max(1, this.graph.metadata.totalEdges);
  }

  /**
   * Calculate closeness centrality (simplified)
   * @param {string} nodeId - Node ID
   * @returns {number} Closeness centrality
   */
  calculateClosenessCentrality(nodeId) {
    // Simplified: inverse of average distance to other nodes
    const distances = this.calculateShortestPaths(nodeId);
    const totalDistance = Object.values(distances).reduce((sum, dist) => sum + dist, 0);
    const reachableNodes = Object.keys(distances).length;

    if (reachableNodes <= 1) return 0;

    const averageDistance = totalDistance / reachableNodes;
    return averageDistance > 0 ? 1 / averageDistance : 0;
  }

  /**
   * Calculate shortest paths from node (simplified BFS)
   * @param {string} startNode - Starting node
   * @returns {Object} Distance to each reachable node
   */
  calculateShortestPaths(startNode) {
    const distances = {};
    const queue = [{ node: startNode, distance: 0 }];
    const visited = new Set();

    while (queue.length > 0) {
      const { node, distance } = queue.shift();
      
      if (visited.has(node)) continue;
      visited.add(node);
      
      if (node !== startNode) {
        distances[node] = distance;
      }

      // Add neighbors
      const edges = this.graph.edges.get(node);
      if (edges) {
        for (const target of edges.keys()) {
          if (!visited.has(target)) {
            queue.push({ node: target, distance: distance + 1 });
          }
        }
      }
    }

    return distances;
  }

  /**
   * Calculate PageRank (simplified)
   * @param {string} nodeId - Node ID
   * @returns {number} PageRank score
   */
  calculatePageRank(nodeId) {
    // Simplified PageRank based on weighted incoming connections
    const node = this.graph.nodes.get(nodeId);
    if (!node) return 0;

    let score = 0.15; // Base score
    
    // Sum weighted incoming edges
    for (const [source, edgeMap] of this.graph.edges) {
      const edge = edgeMap.get(nodeId);
      if (edge) {
        const sourceNode = this.graph.nodes.get(source);
        const sourceOutgoing = sourceNode?.connections.outgoing || 1;
        score += (0.85 * edge.weight) / sourceOutgoing;
      }
    }

    return Math.round(score * 1000) / 1000;
  }

  /**
   * Detect patterns in the dependency graph
   */
  detectPatterns() {
    this.detectHubPattern();
    this.detectLayeredPattern();
    this.detectMicroservicePatterns();
  }

  /**
   * Detect hub and spoke patterns
   */
  detectHubPattern() {
    const hubs = [];

    for (const [nodeId, node] of this.graph.nodes) {
      if (node.type === 'external') continue;

      const incoming = node.connections.incoming;
      const outgoing = node.connections.outgoing;
      const total = incoming + outgoing;

      // Hub criteria: high connectivity with more incoming than outgoing
      if (total > 5 && incoming > outgoing * 1.5) {
        hubs.push({
          id: nodeId,
          incoming,
          outgoing,
          total,
          hubScore: incoming / Math.max(1, outgoing)
        });
      }
    }

    this.graph.metadata.hubs = hubs.sort((a, b) => b.hubScore - a.hubScore);
  }

  /**
   * Detect layered architecture patterns
   */
  detectLayeredPattern() {
    // Analyze if services form distinct layers
    const layers = this.identifyLayers();
    
    this.graph.metadata.layers = {
      detected: layers.length > 2,
      count: layers.length,
      layers: layers.map((layer, index) => ({
        level: index,
        services: layer,
        size: layer.length
      }))
    };
  }

  /**
   * Identify architectural layers
   * @returns {Array} Array of layers (each layer is array of services)
   */
  identifyLayers() {
    const layers = [];
    const processed = new Set();
    
    // Start with leaf nodes (no outgoing dependencies)
    let currentLayer = [];
    
    for (const [nodeId, node] of this.graph.nodes) {
      if (node.type === 'external') continue;
      
      if (node.connections.outgoing === 0) {
        currentLayer.push(nodeId);
        processed.add(nodeId);
      }
    }
    
    if (currentLayer.length > 0) {
      layers.push([...currentLayer]);
    }

    // Build subsequent layers
    while (processed.size < this.graph.nodes.size - this.graph.metadata.externalNodes) {
      const nextLayer = [];
      
      for (const [nodeId, node] of this.graph.nodes) {
        if (processed.has(nodeId) || node.type === 'external') continue;
        
        // Check if all dependencies are in processed layers
        const edges = this.graph.edges.get(nodeId);
        let allDependenciesProcessed = true;
        
        if (edges) {
          for (const target of edges.keys()) {
            const targetNode = this.graph.nodes.get(target);
            if (targetNode?.type !== 'external' && !processed.has(target)) {
              allDependenciesProcessed = false;
              break;
            }
          }
        }
        
        if (allDependenciesProcessed) {
          nextLayer.push(nodeId);
        }
      }
      
      if (nextLayer.length === 0) break; // Prevent infinite loop
      
      nextLayer.forEach(nodeId => processed.add(nodeId));
      layers.push(nextLayer);
    }

    return layers;
  }

  /**
   * Detect microservice architecture patterns
   */
  detectMicroservicePatterns() {
    const patterns = {
      apiGateway: this.detectApiGatewayPattern(),
      serviceRegistry: this.detectServiceRegistryPattern(),
      database: this.detectDatabasePattern(),
      messaging: this.detectMessagingPattern()
    };

    this.graph.metadata.microservicePatterns = patterns;
  }

  /**
   * Detect API Gateway pattern
   * @returns {Object} API Gateway detection result
   */
  detectApiGatewayPattern() {
    // Look for services with many incoming connections and external access
    const candidates = [];

    for (const [nodeId, node] of this.graph.nodes) {
      if (node.type === 'external') continue;

      const incoming = node.connections.incoming;
      const isPublicFacing = node.metadata.endpointCount > 10;
      
      if (incoming > 3 && isPublicFacing) {
        candidates.push({
          id: nodeId,
          score: incoming + (node.metadata.endpointCount * 0.1)
        });
      }
    }

    return {
      detected: candidates.length > 0,
      candidates: candidates.sort((a, b) => b.score - a.score).slice(0, 3)
    };
  }

  /**
   * Detect Service Registry pattern
   * @returns {Object} Service Registry detection result
   */
  detectServiceRegistryPattern() {
    // Look for services that many others depend on but don't depend on many others
    const candidates = [];

    for (const [nodeId, node] of this.graph.nodes) {
      if (node.type === 'external') continue;

      const incoming = node.connections.incoming;
      const outgoing = node.connections.outgoing;
      
      if (incoming > 4 && outgoing < 2) {
        candidates.push({
          id: nodeId,
          score: incoming - outgoing
        });
      }
    }

    return {
      detected: candidates.length > 0,
      candidates: candidates.sort((a, b) => b.score - a.score).slice(0, 2)
    };
  }

  /**
   * Detect Database pattern
   * @returns {Object} Database pattern detection result
   */
  detectDatabasePattern() {
    // Look for services with "data", "db", "storage" in name and many incoming connections
    const candidates = [];

    for (const [nodeId, node] of this.graph.nodes) {
      if (node.type === 'external') continue;

      const nameHints = nodeId.toLowerCase().match(/(data|db|database|storage|repo)/);
      const incoming = node.connections.incoming;
      
      if (nameHints && incoming > 2) {
        candidates.push({
          id: nodeId,
          score: incoming + (nameHints.length * 2)
        });
      }
    }

    return {
      detected: candidates.length > 0,
      candidates: candidates.sort((a, b) => b.score - a.score)
    };
  }

  /**
   * Detect Messaging pattern
   * @returns {Object} Messaging pattern detection result
   */
  detectMessagingPattern() {
    // Look for services with "queue", "message", "event" in name
    const candidates = [];

    for (const [nodeId, node] of this.graph.nodes) {
      if (node.type === 'external') continue;

      const nameHints = nodeId.toLowerCase().match(/(queue|message|event|bus|broker)/);
      const bidirectional = node.connections.bidirectional;
      
      if (nameHints || bidirectional > 2) {
        candidates.push({
          id: nodeId,
          score: (nameHints?.length || 0) * 3 + bidirectional
        });
      }
    }

    return {
      detected: candidates.length > 0,
      candidates: candidates.sort((a, b) => b.score - a.score)
    };
  }

  /**
   * Generate comprehensive dependency graph report
   * @returns {Object} Complete graph analysis report
   */
  generateGraphReport() {
    return {
      metadata: {
        analyzedAt: new Date().toISOString(),
        version: '1.0.0',
        options: this.options
      },
      graph: {
        nodes: this.convertNodesToArray(),
        edges: this.convertEdgesToArray(),
        statistics: this.calculateGraphStatistics()
      },
      analysis: {
        centrality: this.getCentralityAnalysis(),
        patterns: this.getPatternAnalysis(),
        risks: this.getRiskAnalysis(),
        recommendations: this.getRecommendations()
      },
      visualization: {
        layout: this.generateLayoutData(),
        groupings: this.generateGroupingData()
      }
    };
  }

  /**
   * Convert nodes to array for serialization
   * @returns {Array} Nodes array
   */
  convertNodesToArray() {
    return Array.from(this.graph.nodes.values()).map(node => ({
      ...node,
      connections: { ...node.connections },
      centrality: { ...node.centrality }
    }));
  }

  /**
   * Convert edges to array for serialization
   * @returns {Array} Edges array
   */
  convertEdgesToArray() {
    const edges = [];
    
    for (const [source, edgeMap] of this.graph.edges) {
      for (const [target, edge] of edgeMap) {
        edges.push({
          ...edge,
          types: Array.from(edge.types),
          sources: [...edge.sources]
        });
      }
    }
    
    return edges;
  }

  /**
   * Calculate comprehensive graph statistics
   * @returns {Object} Graph statistics
   */
  calculateGraphStatistics() {
    const nodes = Array.from(this.graph.nodes.values());
    const edges = this.convertEdgesToArray();

    return {
      ...this.graph.metadata,
      density: this.calculateGraphDensity(),
      averageConnections: this.calculateAverageConnections(nodes),
      connectivityDistribution: this.calculateConnectivityDistribution(nodes),
      edgeTypeDistribution: this.calculateEdgeTypeDistribution(edges),
      clusteringCoefficient: this.calculateClusteringCoefficient()
    };
  }

  /**
   * Calculate graph density
   * @returns {number} Graph density
   */
  calculateGraphDensity() {
    const n = this.graph.nodes.size;
    if (n <= 1) return 0;

    const maxEdges = n * (n - 1);
    return maxEdges > 0 ? this.graph.metadata.totalEdges / maxEdges : 0;
  }

  /**
   * Calculate average connections per node
   * @param {Array} nodes - Nodes array
   * @returns {number} Average connections
   */
  calculateAverageConnections(nodes) {
    const totalConnections = nodes.reduce((sum, node) => 
      sum + node.connections.incoming + node.connections.outgoing, 0
    );
    
    return nodes.length > 0 ? totalConnections / nodes.length : 0;
  }

  /**
   * Calculate connectivity distribution
   * @param {Array} nodes - Nodes array
   * @returns {Object} Distribution stats
   */
  calculateConnectivityDistribution(nodes) {
    const distribution = { isolated: 0, low: 0, medium: 0, high: 0 };
    
    nodes.forEach(node => {
      const total = node.connections.incoming + node.connections.outgoing;
      
      if (total === 0) distribution.isolated++;
      else if (total <= 2) distribution.low++;
      else if (total <= 5) distribution.medium++;
      else distribution.high++;
    });

    return distribution;
  }

  /**
   * Calculate edge type distribution
   * @param {Array} edges - Edges array
   * @returns {Object} Edge type counts
   */
  calculateEdgeTypeDistribution(edges) {
    const distribution = {};
    
    edges.forEach(edge => {
      edge.types.forEach(type => {
        distribution[type] = (distribution[type] || 0) + 1;
      });
    });

    return distribution;
  }

  /**
   * Calculate clustering coefficient
   * @returns {number} Clustering coefficient
   */
  calculateClusteringCoefficient() {
    let totalCoefficient = 0;
    let nodeCount = 0;

    for (const [nodeId, node] of this.graph.nodes) {
      if (node.type === 'external') continue;

      const coefficient = this.calculateNodeClusteringCoefficient(nodeId);
      totalCoefficient += coefficient;
      nodeCount++;
    }

    return nodeCount > 0 ? totalCoefficient / nodeCount : 0;
  }

  /**
   * Calculate clustering coefficient for a node
   * @param {string} nodeId - Node ID
   * @returns {number} Node clustering coefficient
   */
  calculateNodeClusteringCoefficient(nodeId) {
    const neighbors = this.getNeighbors(nodeId);
    if (neighbors.length < 2) return 0;

    let connectedPairs = 0;
    const maxPairs = neighbors.length * (neighbors.length - 1) / 2;

    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        if (this.areConnected(neighbors[i], neighbors[j])) {
          connectedPairs++;
        }
      }
    }

    return maxPairs > 0 ? connectedPairs / maxPairs : 0;
  }

  /**
   * Get neighbors of a node
   * @param {string} nodeId - Node ID
   * @returns {Array} Neighbor node IDs
   */
  getNeighbors(nodeId) {
    const neighbors = new Set();

    // Outgoing connections
    const edges = this.graph.edges.get(nodeId);
    if (edges) {
      for (const target of edges.keys()) {
        neighbors.add(target);
      }
    }

    // Incoming connections
    for (const [source, edgeMap] of this.graph.edges) {
      if (edgeMap.has(nodeId)) {
        neighbors.add(source);
      }
    }

    return Array.from(neighbors);
  }

  /**
   * Check if two nodes are connected
   * @param {string} node1 - First node ID
   * @param {string} node2 - Second node ID
   * @returns {boolean} True if connected
   */
  areConnected(node1, node2) {
    return this.graph.edges.get(node1)?.has(node2) || 
           this.graph.edges.get(node2)?.has(node1);
  }

  /**
   * Get centrality analysis
   * @returns {Object} Centrality analysis
   */
  getCentralityAnalysis() {
    const nodes = Array.from(this.graph.nodes.values())
      .filter(node => node.type === 'internal');

    return {
      topByDegree: this.getTopNodesByCentrality(nodes, 'degree'),
      topByBetweenness: this.getTopNodesByCentrality(nodes, 'betweenness'),
      topByCloseness: this.getTopNodesByCentrality(nodes, 'closeness'),
      topByPageRank: this.getTopNodesByCentrality(nodes, 'pagerank')
    };
  }

  /**
   * Get top nodes by centrality metric
   * @param {Array} nodes - Nodes array
   * @param {string} metric - Centrality metric
   * @returns {Array} Top nodes
   */
  getTopNodesByCentrality(nodes, metric) {
    return nodes
      .filter(node => node.centrality && node.centrality[metric] !== undefined)
      .sort((a, b) => b.centrality[metric] - a.centrality[metric])
      .slice(0, 5)
      .map(node => ({
        id: node.id,
        score: node.centrality[metric],
        category: node.properties.category
      }));
  }

  /**
   * Get pattern analysis
   * @returns {Object} Pattern analysis
   */
  getPatternAnalysis() {
    return {
      clusters: this.graph.metadata.clusters,
      hubs: this.graph.metadata.hubs,
      layers: this.graph.metadata.layers,
      microservicePatterns: this.graph.metadata.microservicePatterns
    };
  }

  /**
   * Get risk analysis
   * @returns {Object} Risk analysis
   */
  getRiskAnalysis() {
    return {
      circularDependencies: this.graph.metadata.circularDependencies,
      orphanNodes: this.graph.metadata.orphanNodes,
      singlePointsOfFailure: this.identifySinglePointsOfFailure(),
      tightlyCoupledServices: this.identifyTightlyCoupledServices()
    };
  }

  /**
   * Identify single points of failure
   * @returns {Array} Critical nodes
   */
  identifySinglePointsOfFailure() {
    const criticalNodes = [];

    for (const [nodeId, node] of this.graph.nodes) {
      if (node.type === 'external') continue;

      const incoming = node.connections.incoming;
      const centrality = node.centrality?.betweenness || 0;
      
      if (incoming > 3 && centrality > 0.1) {
        criticalNodes.push({
          id: nodeId,
          incoming,
          centrality,
          riskScore: incoming * centrality
        });
      }
    }

    return criticalNodes.sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
  }

  /**
   * Identify tightly coupled services
   * @returns {Array} Coupled service pairs
   */
  identifyTightlyCoupledServices() {
    const coupledPairs = [];

    for (const [source, edgeMap] of this.graph.edges) {
      for (const [target, edge] of edgeMap) {
        if (edge.strength > 0.8 && edge.types.size > 1) {
          // Check for bidirectional high-strength connection
          const reverseEdge = this.graph.edges.get(target)?.get(source);
          
          if (reverseEdge && reverseEdge.strength > 0.8) {
            coupledPairs.push({
              service1: source,
              service2: target,
              coupling: (edge.strength + reverseEdge.strength) / 2,
              connectionTypes: Array.from(new Set([...edge.types, ...reverseEdge.types]))
            });
          }
        }
      }
    }

    return coupledPairs.sort((a, b) => b.coupling - a.coupling).slice(0, 5);
  }

  /**
   * Get recommendations
   * @returns {Array} Recommendations
   */
  getRecommendations() {
    const recommendations = [];

    // Circular dependency recommendations
    if (this.graph.metadata.circularDependencies.length > 0) {
      const criticalCycles = this.graph.metadata.circularDependencies.filter(
        cycle => cycle.severity === 'critical' || cycle.severity === 'high'
      );
      
      if (criticalCycles.length > 0) {
        recommendations.push({
          type: 'circular_dependencies',
          priority: 'high',
          message: `${criticalCycles.length} critical circular dependencies detected`,
          suggestion: 'Break circular dependencies by introducing interfaces or event-driven patterns'
        });
      }
    }

    // Hub recommendations
    if (this.graph.metadata.hubs?.length > 0) {
      recommendations.push({
        type: 'hub_services',
        priority: 'medium',
        message: `${this.graph.metadata.hubs.length} hub services identified`,
        suggestion: 'Monitor hub services for performance and implement circuit breakers'
      });
    }

    // Orphan recommendations
    if (this.graph.metadata.orphanNodes.length > 0) {
      recommendations.push({
        type: 'orphan_services',
        priority: 'low',
        message: `${this.graph.metadata.orphanNodes.length} isolated services found`,
        suggestion: 'Review isolated services for potential removal or integration'
      });
    }

    return recommendations.slice(0, 5);
  }

  /**
   * Generate layout data for visualization
   * @returns {Object} Layout data
   */
  generateLayoutData() {
    // Simple force-directed layout positions
    const nodes = Array.from(this.graph.nodes.values());
    
    // Assign positions based on centrality and connections
    nodes.forEach((node, index) => {
      const centrality = node.centrality?.degree || 0;
      const angle = (index / nodes.length) * 2 * Math.PI;
      const radius = 100 + (centrality * 200);
      
      node.position = {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      };
    });

    return {
      algorithm: 'force_directed',
      nodes: nodes.map(node => ({
        id: node.id,
        x: node.position.x,
        y: node.position.y,
        size: node.properties.size
      }))
    };
  }

  /**
   * Generate grouping data
   * @returns {Object} Grouping data
   */
  generateGroupingData() {
    return {
      byClusters: this.graph.metadata.clusters.map(cluster => ({
        id: cluster.id,
        nodes: cluster.nodes,
        category: cluster.category
      })),
      byLayers: this.graph.metadata.layers?.layers || [],
      byFramework: this.groupByFramework(),
      byCriticality: this.groupByCriticality()
    };
  }

  /**
   * Group nodes by framework
   * @returns {Object} Framework groupings
   */
  groupByFramework() {
    const groups = {};
    
    for (const [nodeId, node] of this.graph.nodes) {
      if (node.type === 'external') continue;
      
      const framework = node.metadata.framework || 'unknown';
      
      if (!groups[framework]) {
        groups[framework] = [];
      }
      
      groups[framework].push(nodeId);
    }

    return groups;
  }

  /**
   * Group nodes by criticality
   * @returns {Object} Criticality groupings
   */
  groupByCriticality() {
    const groups = { critical: [], high: [], medium: [], low: [] };
    
    for (const [nodeId, node] of this.graph.nodes) {
      if (node.type === 'external') continue;
      
      const criticality = node.properties.criticality || 'low';
      groups[criticality].push(nodeId);
    }

    return groups;
  }
}

module.exports = DependencyGraphBuilder; 