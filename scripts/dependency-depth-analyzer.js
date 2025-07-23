/**
 * Dependency Depth Analyzer
 * Analyzes dependency chains to identify complex patterns and calculate depth metrics
 */
class DependencyDepthAnalyzer {
  constructor(options = {}) {
    this.options = {
      maxDepth: options.maxDepth || 10,
      minChainLength: options.minChainLength || 3,
      strengthThreshold: options.strengthThreshold || 0.3,
      includeExternal: options.includeExternal !== false,
      trackBidirectional: options.trackBidirectional !== false,
      ...options
    };

    this.graph = null;
    this.chains = [];
    this.depthMetrics = new Map();
    this.statistics = {
      totalChains: 0,
      maxDepth: 0,
      averageDepth: 0,
      complexChains: 0,
      leafNodes: [],
      rootNodes: [],
      criticalPaths: []
    };
  }

  /**
   * Analyze dependency depths in the service graph
   * @param {Object} dependencyGraph - Graph with nodes and edges
   * @returns {Object} Depth analysis results
   */
  analyzeDepths(dependencyGraph) {
    this.graph = dependencyGraph;
    this.chains = [];
    this.depthMetrics = new Map();
    
    // Calculate depth metrics for each node
    this.calculateNodeDepths();
    
    // Find dependency chains
    this.findDependencyChains();
    
    // Analyze chain complexity
    this.analyzeChainComplexity();
    
    // Identify critical paths
    this.identifyCriticalPaths();
    
    // Calculate statistics
    this.calculateStatistics();
    
    return this.generateDepthReport();
  }

  /**
   * Calculate depth metrics for each node
   */
  calculateNodeDepths() {
    const nodes = this.getInternalNodes();
    
    for (const nodeId of nodes) {
      const metrics = {
        nodeId,
        incomingDepth: this.calculateIncomingDepth(nodeId),
        outgoingDepth: this.calculateOutgoingDepth(nodeId),
        totalDepth: 0,
        fanIn: this.calculateFanIn(nodeId),
        fanOut: this.calculateFanOut(nodeId),
        pathComplexity: 0,
        criticalityScore: 0
      };
      
      metrics.totalDepth = metrics.incomingDepth + metrics.outgoingDepth;
      metrics.pathComplexity = this.calculatePathComplexity(nodeId, metrics);
      metrics.criticalityScore = this.calculateCriticalityScore(metrics);
      
      this.depthMetrics.set(nodeId, metrics);
    }
  }

  /**
   * Get internal nodes (excluding external services)
   * @returns {Array} Internal node IDs
   */
  getInternalNodes() {
    return this.graph.nodes
      .filter(node => node.type === 'internal')
      .map(node => node.id);
  }

  /**
   * Calculate incoming depth (longest path to reach this node)
   * @param {string} nodeId - Target node ID
   * @returns {number} Incoming depth
   */
  calculateIncomingDepth(nodeId) {
    const visited = new Set();
    const depths = new Map();
    
    const dfs = (currentNode, depth) => {
      if (depth > this.options.maxDepth) return depth;
      if (visited.has(currentNode)) return depths.get(currentNode) || 0;
      
      visited.add(currentNode);
      let maxDepth = depth;
      
      // Find all nodes that point to current node
      const predecessors = this.getPredecessors(currentNode);
      
      for (const pred of predecessors) {
        if (this.shouldTraverseEdge(pred, currentNode)) {
          const predDepth = dfs(pred, depth + 1);
          maxDepth = Math.max(maxDepth, predDepth);
        }
      }
      
      depths.set(currentNode, maxDepth);
      return maxDepth;
    };
    
    return dfs(nodeId, 0);
  }

  /**
   * Calculate outgoing depth (longest path from this node)
   * @param {string} nodeId - Source node ID
   * @returns {number} Outgoing depth
   */
  calculateOutgoingDepth(nodeId) {
    const visited = new Set();
    const depths = new Map();
    
    const dfs = (currentNode, depth) => {
      if (depth > this.options.maxDepth) return depth;
      if (visited.has(currentNode)) return depths.get(currentNode) || 0;
      
      visited.add(currentNode);
      let maxDepth = depth;
      
      // Find all nodes that current node points to
      const successors = this.getSuccessors(currentNode);
      
      for (const succ of successors) {
        if (this.shouldTraverseEdge(currentNode, succ)) {
          const succDepth = dfs(succ, depth + 1);
          maxDepth = Math.max(maxDepth, succDepth);
        }
      }
      
      depths.set(currentNode, maxDepth);
      return maxDepth;
    };
    
    return dfs(nodeId, 0);
  }

  /**
   * Get predecessor nodes
   * @param {string} nodeId - Target node ID
   * @returns {Array} Predecessor node IDs
   */
  getPredecessors(nodeId) {
    const predecessors = [];
    
    this.graph.edges.forEach(edge => {
      if (edge.to === nodeId) {
        predecessors.push(edge.from);
      }
    });
    
    return predecessors;
  }

  /**
   * Get successor nodes
   * @param {string} nodeId - Source node ID
   * @returns {Array} Successor node IDs
   */
  getSuccessors(nodeId) {
    const successors = [];
    
    this.graph.edges.forEach(edge => {
      if (edge.from === nodeId) {
        successors.push(edge.to);
      }
    });
    
    return successors;
  }

  /**
   * Check if edge should be traversed
   * @param {string} from - Source node
   * @param {string} to - Target node
   * @returns {boolean} True if should traverse
   */
  shouldTraverseEdge(from, to) {
    const edge = this.findEdge(from, to);
    if (!edge) return false;
    
    // Skip weak edges if below threshold
    if (edge.strength < this.options.strengthThreshold) return false;
    
    // Skip external nodes if configured
    if (!this.options.includeExternal) {
      const toNode = this.getNode(to);
      if (toNode?.type === 'external') return false;
    }
    
    return true;
  }

  /**
   * Find edge between nodes
   * @param {string} from - Source node
   * @param {string} to - Target node
   * @returns {Object|null} Edge data
   */
  findEdge(from, to) {
    return this.graph.edges.find(edge => edge.from === from && edge.to === to);
  }

  /**
   * Get node by ID
   * @param {string} nodeId - Node ID
   * @returns {Object|null} Node data
   */
  getNode(nodeId) {
    return this.graph.nodes.find(node => node.id === nodeId);
  }

  /**
   * Calculate fan-in (number of incoming dependencies)
   * @param {string} nodeId - Node ID
   * @returns {number} Fan-in count
   */
  calculateFanIn(nodeId) {
    return this.getPredecessors(nodeId).filter(pred => 
      this.shouldTraverseEdge(pred, nodeId)
    ).length;
  }

  /**
   * Calculate fan-out (number of outgoing dependencies)
   * @param {string} nodeId - Node ID
   * @returns {number} Fan-out count
   */
  calculateFanOut(nodeId) {
    return this.getSuccessors(nodeId).filter(succ => 
      this.shouldTraverseEdge(nodeId, succ)
    ).length;
  }

  /**
   * Calculate path complexity for a node
   * @param {string} nodeId - Node ID
   * @param {Object} metrics - Node metrics
   * @returns {number} Path complexity score
   */
  calculatePathComplexity(nodeId, metrics) {
    const depthFactor = (metrics.incomingDepth + metrics.outgoingDepth) * 0.3;
    const fanFactor = (metrics.fanIn + metrics.fanOut) * 0.2;
    const balanceFactor = Math.abs(metrics.fanIn - metrics.fanOut) * 0.1;
    
    return Math.round((depthFactor + fanFactor + balanceFactor) * 100) / 100;
  }

  /**
   * Calculate criticality score
   * @param {Object} metrics - Node metrics
   * @returns {number} Criticality score
   */
  calculateCriticalityScore(metrics) {
    // High incoming depth + high fan-in = critical receiver
    // High outgoing depth + high fan-out = critical provider
    const receiverScore = metrics.incomingDepth * metrics.fanIn * 0.4;
    const providerScore = metrics.outgoingDepth * metrics.fanOut * 0.4;
    const balanceScore = metrics.totalDepth * 0.2;
    
    return Math.round((receiverScore + providerScore + balanceScore) * 100) / 100;
  }

  /**
   * Find dependency chains in the graph
   */
  findDependencyChains() {
    const visited = new Set();
    
    // Start from leaf nodes (no outgoing dependencies)
    const leafNodes = this.findLeafNodes();
    
    for (const leafNode of leafNodes) {
      this.traceChains(leafNode, [], visited);
    }
    
    // Also trace from root nodes (no incoming dependencies)
    const rootNodes = this.findRootNodes();
    
    for (const rootNode of rootNodes) {
      this.traceChains(rootNode, [], visited, 'forward');
    }
  }

  /**
   * Find leaf nodes (no outgoing dependencies)
   * @returns {Array} Leaf node IDs
   */
  findLeafNodes() {
    const leafNodes = [];
    
    for (const nodeId of this.getInternalNodes()) {
      const fanOut = this.calculateFanOut(nodeId);
      if (fanOut === 0) {
        leafNodes.push(nodeId);
      }
    }
    
    return leafNodes;
  }

  /**
   * Find root nodes (no incoming dependencies)
   * @returns {Array} Root node IDs
   */
  findRootNodes() {
    const rootNodes = [];
    
    for (const nodeId of this.getInternalNodes()) {
      const fanIn = this.calculateFanIn(nodeId);
      if (fanIn === 0) {
        rootNodes.push(nodeId);
      }
    }
    
    return rootNodes;
  }

  /**
   * Trace dependency chains from a starting node
   * @param {string} currentNode - Current node ID
   * @param {Array} currentPath - Current path
   * @param {Set} visited - Visited nodes in this trace
   * @param {string} direction - 'backward' or 'forward'
   */
  traceChains(currentNode, currentPath, visited, direction = 'backward') {
    if (currentPath.length > this.options.maxDepth) {
      return;
    }
    
    if (visited.has(currentNode)) {
      // Found a cycle, record it separately
      return;
    }
    
    const newPath = [...currentPath, currentNode];
    const localVisited = new Set([...visited, currentNode]);
    
    // Record chain if it meets minimum length
    if (newPath.length >= this.options.minChainLength) {
      this.recordChain(newPath, direction);
    }
    
    // Continue tracing
    const nextNodes = direction === 'backward' 
      ? this.getPredecessors(currentNode)
      : this.getSuccessors(currentNode);
    
    for (const nextNode of nextNodes) {
      const edgeValid = direction === 'backward'
        ? this.shouldTraverseEdge(nextNode, currentNode)
        : this.shouldTraverseEdge(currentNode, nextNode);
        
      if (edgeValid && !localVisited.has(nextNode)) {
        this.traceChains(nextNode, newPath, localVisited, direction);
      }
    }
  }

  /**
   * Record a dependency chain
   * @param {Array} path - Chain path
   * @param {string} direction - Chain direction
   */
  recordChain(path, direction) {
    const chain = {
      id: `chain_${this.chains.length + 1}`,
      path: [...path],
      direction,
      length: path.length,
      strength: this.calculateChainStrength(path, direction),
      complexity: this.calculateChainComplexityScore(path),
      type: this.classifyChain(path, direction),
      edges: this.getChainEdges(path, direction),
      metrics: {
        totalDepth: this.calculateChainTotalDepth(path),
        averageStrength: 0,
        criticalNodes: [],
        bottlenecks: []
      }
    };
    
    chain.metrics.averageStrength = chain.strength;
    chain.metrics.criticalNodes = this.findChainCriticalNodes(path);
    chain.metrics.bottlenecks = this.findChainBottlenecks(path);
    
    this.chains.push(chain);
  }

  /**
   * Calculate chain strength
   * @param {Array} path - Chain path
   * @param {string} direction - Chain direction
   * @returns {number} Chain strength
   */
  calculateChainStrength(path, direction) {
    let totalStrength = 0;
    let edgeCount = 0;
    
    for (let i = 0; i < path.length - 1; i++) {
      const from = direction === 'backward' ? path[i + 1] : path[i];
      const to = direction === 'backward' ? path[i] : path[i + 1];
      
      const edge = this.findEdge(from, to);
      if (edge) {
        totalStrength += edge.strength;
        edgeCount++;
      }
    }
    
    return edgeCount > 0 ? totalStrength / edgeCount : 0;
  }

  /**
   * Calculate chain complexity score
   * @param {Array} path - Chain path
   * @returns {number} Complexity score
   */
  calculateChainComplexityScore(path) {
    const lengthFactor = path.length * 0.4;
    const depthFactor = path.reduce((sum, nodeId) => {
      const metrics = this.depthMetrics.get(nodeId);
      return sum + (metrics ? metrics.totalDepth : 0);
    }, 0) * 0.3;
    const fanFactor = path.reduce((sum, nodeId) => {
      const metrics = this.depthMetrics.get(nodeId);
      return sum + (metrics ? metrics.fanIn + metrics.fanOut : 0);
    }, 0) * 0.3;
    
    return Math.round((lengthFactor + depthFactor + fanFactor) * 100) / 100;
  }

  /**
   * Classify chain type
   * @param {Array} path - Chain path
   * @param {string} direction - Chain direction
   * @returns {string} Chain type
   */
  classifyChain(path, direction) {
    const length = path.length;
    const strength = this.calculateChainStrength(path, direction);
    
    if (length >= 6) {
      return strength > 0.7 ? 'deep_strong' : 'deep_weak';
    } else if (length >= 4) {
      return strength > 0.7 ? 'medium_strong' : 'medium_weak';
    } else {
      return strength > 0.7 ? 'short_strong' : 'short_weak';
    }
  }

  /**
   * Get edges that form the chain
   * @param {Array} path - Chain path
   * @param {string} direction - Chain direction
   * @returns {Array} Chain edges
   */
  getChainEdges(path, direction) {
    const edges = [];
    
    for (let i = 0; i < path.length - 1; i++) {
      const from = direction === 'backward' ? path[i + 1] : path[i];
      const to = direction === 'backward' ? path[i] : path[i + 1];
      
      const edge = this.findEdge(from, to);
      if (edge) {
        edges.push({
          from: edge.from,
          to: edge.to,
          strength: edge.strength,
          type: edge.type
        });
      }
    }
    
    return edges;
  }

  /**
   * Calculate chain total depth
   * @param {Array} path - Chain path
   * @returns {number} Total depth
   */
  calculateChainTotalDepth(path) {
    return path.reduce((sum, nodeId) => {
      const metrics = this.depthMetrics.get(nodeId);
      return sum + (metrics ? metrics.totalDepth : 0);
    }, 0);
  }

  /**
   * Find critical nodes in chain
   * @param {Array} path - Chain path
   * @returns {Array} Critical node IDs
   */
  findChainCriticalNodes(path) {
    const criticalNodes = [];
    
    path.forEach(nodeId => {
      const metrics = this.depthMetrics.get(nodeId);
      if (metrics && metrics.criticalityScore > 5) {
        criticalNodes.push({
          nodeId,
          criticalityScore: metrics.criticalityScore,
          reason: this.getCriticalityReason(metrics)
        });
      }
    });
    
    return criticalNodes.sort((a, b) => b.criticalityScore - a.criticalityScore);
  }

  /**
   * Get criticality reason
   * @param {Object} metrics - Node metrics
   * @returns {string} Criticality reason
   */
  getCriticalityReason(metrics) {
    if (metrics.fanIn > 5) return 'high_fan_in';
    if (metrics.fanOut > 5) return 'high_fan_out';
    if (metrics.totalDepth > 8) return 'deep_dependencies';
    if (metrics.fanIn > 3 && metrics.fanOut > 3) return 'central_hub';
    return 'complex_patterns';
  }

  /**
   * Find bottlenecks in chain
   * @param {Array} path - Chain path
   * @returns {Array} Bottleneck node IDs
   */
  findChainBottlenecks(path) {
    const bottlenecks = [];
    
    path.forEach(nodeId => {
      const metrics = this.depthMetrics.get(nodeId);
      if (metrics) {
        const isBottleneck = 
          (metrics.fanIn >= 3 && metrics.fanOut <= 1) ||
          (metrics.fanOut >= 3 && metrics.fanIn <= 1) ||
          (metrics.fanIn >= 5) ||
          (metrics.fanOut >= 5);
          
        if (isBottleneck) {
          bottlenecks.push({
            nodeId,
            type: this.getBottleneckType(metrics),
            severity: this.calculateBottleneckSeverity(metrics)
          });
        }
      }
    });
    
    return bottlenecks;
  }

  /**
   * Get bottleneck type
   * @param {Object} metrics - Node metrics
   * @returns {string} Bottleneck type
   */
  getBottleneckType(metrics) {
    if (metrics.fanIn >= 5) return 'convergence_point';
    if (metrics.fanOut >= 5) return 'distribution_point';
    if (metrics.fanIn >= 3 && metrics.fanOut <= 1) return 'sink';
    if (metrics.fanOut >= 3 && metrics.fanIn <= 1) return 'source';
    return 'hub';
  }

  /**
   * Calculate bottleneck severity
   * @param {Object} metrics - Node metrics
   * @returns {string} Severity level
   */
  calculateBottleneckSeverity(metrics) {
    const totalConnections = metrics.fanIn + metrics.fanOut;
    const imbalance = Math.abs(metrics.fanIn - metrics.fanOut);
    
    if (totalConnections >= 8 || imbalance >= 5) return 'critical';
    if (totalConnections >= 5 || imbalance >= 3) return 'high';
    if (totalConnections >= 3 || imbalance >= 2) return 'medium';
    return 'low';
  }

  /**
   * Analyze chain complexity patterns
   */
  analyzeChainComplexity() {
    this.chains.forEach(chain => {
      chain.complexityAnalysis = {
        lengthCategory: this.categorizeLengthComplexity(chain.length),
        strengthCategory: this.categorizeStrengthComplexity(chain.strength),
        overallCategory: this.categorizeOverallComplexity(chain),
        riskFactors: this.identifyChainRiskFactors(chain),
        recommendations: this.generateChainRecommendations(chain)
      };
    });
  }

  /**
   * Categorize length complexity
   * @param {number} length - Chain length
   * @returns {string} Length category
   */
  categorizeLengthComplexity(length) {
    if (length >= 7) return 'very_long';
    if (length >= 5) return 'long';
    if (length >= 3) return 'medium';
    return 'short';
  }

  /**
   * Categorize strength complexity
   * @param {number} strength - Chain strength
   * @returns {string} Strength category
   */
  categorizeStrengthComplexity(strength) {
    if (strength >= 0.8) return 'very_strong';
    if (strength >= 0.6) return 'strong';
    if (strength >= 0.4) return 'medium';
    return 'weak';
  }

  /**
   * Categorize overall complexity
   * @param {Object} chain - Chain data
   * @returns {string} Overall category
   */
  categorizeOverallComplexity(chain) {
    const lengthScore = chain.length >= 5 ? 2 : chain.length >= 3 ? 1 : 0;
    const strengthScore = chain.strength >= 0.7 ? 2 : chain.strength >= 0.5 ? 1 : 0;
    const criticalScore = chain.metrics.criticalNodes.length >= 2 ? 2 : 
                         chain.metrics.criticalNodes.length >= 1 ? 1 : 0;
    
    const totalScore = lengthScore + strengthScore + criticalScore;
    
    if (totalScore >= 5) return 'very_complex';
    if (totalScore >= 3) return 'complex';
    if (totalScore >= 1) return 'moderate';
    return 'simple';
  }

  /**
   * Identify chain risk factors
   * @param {Object} chain - Chain data
   * @returns {Array} Risk factors
   */
  identifyChainRiskFactors(chain) {
    const risks = [];
    
    if (chain.length >= 6) {
      risks.push({
        type: 'deep_dependency',
        severity: 'high',
        description: `Chain length of ${chain.length} creates deep dependency`
      });
    }
    
    if (chain.strength >= 0.8) {
      risks.push({
        type: 'tight_coupling',
        severity: 'medium',
        description: `High chain strength (${chain.strength}) indicates tight coupling`
      });
    }
    
    if (chain.metrics.criticalNodes.length >= 2) {
      risks.push({
        type: 'multiple_critical_points',
        severity: 'high',
        description: `${chain.metrics.criticalNodes.length} critical nodes in chain`
      });
    }
    
    if (chain.metrics.bottlenecks.length >= 1) {
      const criticalBottlenecks = chain.metrics.bottlenecks.filter(b => b.severity === 'critical');
      if (criticalBottlenecks.length > 0) {
        risks.push({
          type: 'critical_bottleneck',
          severity: 'critical',
          description: `Critical bottleneck in dependency chain`
        });
      }
    }
    
    return risks;
  }

  /**
   * Generate chain recommendations
   * @param {Object} chain - Chain data
   * @returns {Array} Recommendations
   */
  generateChainRecommendations(chain) {
    const recommendations = [];
    
    if (chain.length >= 5) {
      recommendations.push({
        type: 'chain_reduction',
        priority: 'high',
        description: 'Consider breaking long dependency chain',
        actions: ['Introduce intermediate abstractions', 'Remove unnecessary dependencies']
      });
    }
    
    if (chain.strength >= 0.7 && chain.length >= 3) {
      recommendations.push({
        type: 'loose_coupling',
        priority: 'medium',
        description: 'Reduce coupling in dependency chain',
        actions: ['Use interfaces', 'Implement event-driven patterns']
      });
    }
    
    if (chain.metrics.bottlenecks.length > 0) {
      recommendations.push({
        type: 'bottleneck_resolution',
        priority: 'high',
        description: 'Address bottlenecks in dependency chain',
        actions: ['Load balancing', 'Service decomposition', 'Caching strategies']
      });
    }
    
    return recommendations;
  }

  /**
   * Identify critical paths in the system
   */
  identifyCriticalPaths() {
    const criticalPaths = [];
    
    // Find longest chains
    const longestChains = this.chains
      .filter(chain => chain.length >= 4)
      .sort((a, b) => b.length - a.length)
      .slice(0, 5);
    
    // Find strongest chains
    const strongestChains = this.chains
      .filter(chain => chain.strength >= 0.6)
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 5);
    
    // Find most complex chains
    const complexChains = this.chains
      .filter(chain => chain.complexity >= 10)
      .sort((a, b) => b.complexity - a.complexity)
      .slice(0, 5);
    
    // Combine and deduplicate
    const allCritical = [...longestChains, ...strongestChains, ...complexChains];
    const uniqueCritical = allCritical.filter((chain, index, arr) => 
      arr.findIndex(c => c.id === chain.id) === index
    );
    
    this.statistics.criticalPaths = uniqueCritical.map(chain => ({
      id: chain.id,
      path: chain.path,
      length: chain.length,
      strength: chain.strength,
      complexity: chain.complexity,
      type: chain.type,
      reason: this.getCriticalPathReason(chain, longestChains, strongestChains, complexChains)
    }));
  }

  /**
   * Get reason why path is critical
   * @param {Object} chain - Chain data
   * @param {Array} longestChains - Longest chains
   * @param {Array} strongestChains - Strongest chains
   * @param {Array} complexChains - Complex chains
   * @returns {string} Reason
   */
  getCriticalPathReason(chain, longestChains, strongestChains, complexChains) {
    const reasons = [];
    
    if (longestChains.some(c => c.id === chain.id)) reasons.push('longest');
    if (strongestChains.some(c => c.id === chain.id)) reasons.push('strongest');
    if (complexChains.some(c => c.id === chain.id)) reasons.push('most_complex');
    
    return reasons.join(', ');
  }

  /**
   * Calculate overall statistics
   */
  calculateStatistics() {
    this.statistics.totalChains = this.chains.length;
    
    if (this.chains.length > 0) {
      this.statistics.maxDepth = Math.max(...this.chains.map(c => c.length));
      this.statistics.averageDepth = this.chains.reduce((sum, c) => sum + c.length, 0) / this.chains.length;
      this.statistics.complexChains = this.chains.filter(c => 
        c.complexityAnalysis?.overallCategory === 'complex' || 
        c.complexityAnalysis?.overallCategory === 'very_complex'
      ).length;
    }
    
    this.statistics.leafNodes = this.findLeafNodes();
    this.statistics.rootNodes = this.findRootNodes();
    
    // Round average
    this.statistics.averageDepth = Math.round(this.statistics.averageDepth * 100) / 100;
  }

  /**
   * Generate comprehensive depth analysis report
   * @returns {Object} Complete depth analysis report
   */
  generateDepthReport() {
    return {
      metadata: {
        analyzedAt: new Date().toISOString(),
        version: '1.0.0',
        options: this.options
      },
      statistics: this.statistics,
      nodeMetrics: this.convertDepthMetricsToArray(),
      chains: this.chains.map(chain => ({
        ...chain,
        complexityAnalysis: { ...chain.complexityAnalysis }
      })),
      analysis: {
        depthDistribution: this.getDepthDistribution(),
        complexityAnalysis: this.getComplexityAnalysis(),
        bottleneckAnalysis: this.getBottleneckAnalysis(),
        riskAssessment: this.getRiskAssessment()
      },
      recommendations: {
        immediate: this.getImmediateRecommendations(),
        strategic: this.getStrategicRecommendations(),
        monitoring: this.getMonitoringRecommendations()
      }
    };
  }

  /**
   * Convert depth metrics to array
   * @returns {Array} Depth metrics array
   */
  convertDepthMetricsToArray() {
    return Array.from(this.depthMetrics.values()).map(metrics => ({
      ...metrics
    }));
  }

  /**
   * Get depth distribution
   * @returns {Object} Depth distribution stats
   */
  getDepthDistribution() {
    const distribution = { shallow: 0, medium: 0, deep: 0, very_deep: 0 };
    const nodeMetrics = Array.from(this.depthMetrics.values());
    
    nodeMetrics.forEach(metrics => {
      const totalDepth = metrics.totalDepth;
      
      if (totalDepth <= 2) distribution.shallow++;
      else if (totalDepth <= 5) distribution.medium++;
      else if (totalDepth <= 8) distribution.deep++;
      else distribution.very_deep++;
    });
    
    return {
      distribution,
      totalNodes: nodeMetrics.length,
      averageTotalDepth: nodeMetrics.length > 0 
        ? Math.round((nodeMetrics.reduce((sum, m) => sum + m.totalDepth, 0) / nodeMetrics.length) * 100) / 100
        : 0
    };
  }

  /**
   * Get complexity analysis
   * @returns {Object} Complexity analysis
   */
  getComplexityAnalysis() {
    const chainComplexity = { simple: 0, moderate: 0, complex: 0, very_complex: 0 };
    
    this.chains.forEach(chain => {
      const category = chain.complexityAnalysis?.overallCategory || 'simple';
      chainComplexity[category]++;
    });
    
    return {
      chainComplexity,
      topComplexChains: this.chains
        .filter(c => c.complexity >= 5)
        .sort((a, b) => b.complexity - a.complexity)
        .slice(0, 5)
        .map(c => ({
          id: c.id,
          length: c.length,
          complexity: c.complexity,
          type: c.type
        }))
    };
  }

  /**
   * Get bottleneck analysis
   * @returns {Object} Bottleneck analysis
   */
  getBottleneckAnalysis() {
    const allBottlenecks = [];
    
    this.chains.forEach(chain => {
      chain.metrics.bottlenecks.forEach(bottleneck => {
        allBottlenecks.push({
          ...bottleneck,
          chainId: chain.id
        });
      });
    });
    
    const severityDistribution = { critical: 0, high: 0, medium: 0, low: 0 };
    allBottlenecks.forEach(bottleneck => {
      severityDistribution[bottleneck.severity]++;
    });
    
    return {
      totalBottlenecks: allBottlenecks.length,
      severityDistribution,
      criticalBottlenecks: allBottlenecks
        .filter(b => b.severity === 'critical')
        .slice(0, 5)
    };
  }

  /**
   * Get risk assessment
   * @returns {Object} Risk assessment
   */
  getRiskAssessment() {
    const allRisks = [];
    
    this.chains.forEach(chain => {
      chain.complexityAnalysis?.riskFactors?.forEach(risk => {
        allRisks.push({
          ...risk,
          chainId: chain.id,
          chainLength: chain.length
        });
      });
    });
    
    const riskDistribution = { critical: 0, high: 0, medium: 0, low: 0 };
    allRisks.forEach(risk => {
      riskDistribution[risk.severity]++;
    });
    
    return {
      totalRisks: allRisks.length,
      riskDistribution,
      highRiskChains: this.chains
        .filter(c => c.complexityAnalysis?.riskFactors?.some(r => r.severity === 'critical' || r.severity === 'high'))
        .length
    };
  }

  /**
   * Get immediate recommendations
   * @returns {Array} Immediate recommendations
   */
  getImmediateRecommendations() {
    const recommendations = [];
    
    // Critical bottlenecks
    const criticalBottlenecks = this.chains
      .filter(c => c.metrics.bottlenecks.some(b => b.severity === 'critical'))
      .length;
    
    if (criticalBottlenecks > 0) {
      recommendations.push({
        type: 'critical_bottlenecks',
        priority: 'immediate',
        message: `${criticalBottlenecks} chains have critical bottlenecks`,
        action: 'Review and optimize critical bottleneck services'
      });
    }
    
    // Very long chains
    const veryLongChains = this.chains.filter(c => c.length >= 7).length;
    
    if (veryLongChains > 0) {
      recommendations.push({
        type: 'long_chains',
        priority: 'immediate',
        message: `${veryLongChains} very long dependency chains detected`,
        action: 'Break down long dependency chains'
      });
    }
    
    return recommendations;
  }

  /**
   * Get strategic recommendations
   * @returns {Array} Strategic recommendations
   */
  getStrategicRecommendations() {
    const recommendations = [];
    
    // Architecture review
    if (this.statistics.complexChains > this.statistics.totalChains * 0.3) {
      recommendations.push({
        type: 'architecture_review',
        priority: 'strategic',
        message: 'High proportion of complex dependency chains',
        action: 'Consider architectural refactoring to reduce dependencies'
      });
    }
    
    // Service consolidation opportunities
    const shortStrongChains = this.chains.filter(c => 
      c.length <= 3 && c.strength >= 0.8
    ).length;
    
    if (shortStrongChains > 0) {
      recommendations.push({
        type: 'service_consolidation',
        priority: 'strategic',
        message: `${shortStrongChains} tightly coupled service pairs`,
        action: 'Consider consolidating tightly coupled services'
      });
    }
    
    return recommendations;
  }

  /**
   * Get monitoring recommendations
   * @returns {Array} Monitoring recommendations
   */
  getMonitoringRecommendations() {
    const recommendations = [];
    
    // Monitor critical paths
    if (this.statistics.criticalPaths.length > 0) {
      recommendations.push({
        type: 'critical_path_monitoring',
        priority: 'monitoring',
        message: `Monitor ${this.statistics.criticalPaths.length} critical dependency paths`,
        action: 'Set up monitoring for critical dependency chains'
      });
    }
    
    // Monitor high-depth nodes
    const highDepthNodes = Array.from(this.depthMetrics.values())
      .filter(m => m.totalDepth >= 8).length;
    
    if (highDepthNodes > 0) {
      recommendations.push({
        type: 'depth_monitoring',
        priority: 'monitoring',
        message: `${highDepthNodes} services with high dependency depth`,
        action: 'Monitor performance and reliability of high-depth services'
      });
    }
    
    return recommendations;
  }
}

module.exports = DependencyDepthAnalyzer; 