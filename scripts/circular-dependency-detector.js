/**
 * Circular Dependency Detector
 * Specialized algorithm for detecting and analyzing circular dependencies in service graphs
 */
class CircularDependencyDetector {
  constructor(options = {}) {
    this.options = {
      maxDepth: options.maxDepth || 10,
      includeWeak: options.includeWeak !== false,
      strengthThreshold: options.strengthThreshold || 0.3,
      ignoreExternal: options.ignoreExternal !== false,
      detectComplexCycles: options.detectComplexCycles !== false,
      ...options
    };

    this.graph = null;
    this.cycles = [];
    this.visited = new Set();
    this.recursionStack = new Set();
    this.pathStack = [];
    this.statistics = {
      totalCycles: 0,
      criticalCycles: 0,
      averageCycleLength: 0,
      maxCycleLength: 0,
      affectedServices: new Set()
    };
  }

  /**
   * Detect circular dependencies in a dependency graph
   * @param {Object} dependencyGraph - Graph with nodes and edges
   * @returns {Object} Detection results with analysis
   */
  detectCircularDependencies(dependencyGraph) {
    this.graph = dependencyGraph;
    this.cycles = [];
    this.visited = new Set();
    this.recursionStack = new Set();
    this.pathStack = [];
    this.statistics = {
      totalCycles: 0,
      criticalCycles: 0,
      averageCycleLength: 0,
      maxCycleLength: 0,
      affectedServices: new Set()
    };

    // Run detection algorithm
    this.runDetection();

    // Analyze detected cycles
    this.analyzeCycles();

    // Generate detailed analysis
    return this.generateDetectionReport();
  }

  /**
   * Run the main detection algorithm
   */
  runDetection() {
    const nodes = this.getInternalNodes();

    for (const nodeId of nodes) {
      if (!this.visited.has(nodeId)) {
        this.dfsDetection(nodeId);
      }
    }

    // Detect complex cycles if enabled
    if (this.options.detectComplexCycles) {
      this.detectComplexCycles();
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
   * Depth-first search for cycle detection
   * @param {string} nodeId - Current node ID
   * @param {number} depth - Current recursion depth
   */
  dfsDetection(nodeId, depth = 0) {
    if (depth > this.options.maxDepth) {
      return; // Prevent infinite recursion
    }

    if (this.recursionStack.has(nodeId)) {
      // Found a cycle
      this.recordCycle(nodeId);
      return;
    }

    if (this.visited.has(nodeId)) {
      return;
    }

    this.visited.add(nodeId);
    this.recursionStack.add(nodeId);
    this.pathStack.push(nodeId);

    // Explore neighbors
    const neighbors = this.getNeighbors(nodeId);
    
    for (const neighbor of neighbors) {
      if (this.shouldExploreEdge(nodeId, neighbor)) {
        this.dfsDetection(neighbor, depth + 1);
      }
    }

    this.recursionStack.delete(nodeId);
    this.pathStack.pop();
  }

  /**
   * Get neighbors of a node based on edges
   * @param {string} nodeId - Node ID
   * @returns {Array} Neighbor node IDs
   */
  getNeighbors(nodeId) {
    const neighbors = [];
    
    this.graph.edges.forEach(edge => {
      if (edge.from === nodeId) {
        neighbors.push(edge.to);
      }
    });

    return neighbors;
  }

  /**
   * Check if an edge should be explored
   * @param {string} from - Source node
   * @param {string} to - Target node
   * @returns {boolean} True if edge should be explored
   */
  shouldExploreEdge(from, to) {
    const edge = this.findEdge(from, to);
    
    if (!edge) return false;

    // Skip external nodes if configured
    if (this.options.ignoreExternal) {
      const toNode = this.getNode(to);
      if (toNode?.type === 'external') return false;
    }

    // Skip weak connections if configured
    if (!this.options.includeWeak && edge.strength < this.options.strengthThreshold) {
      return false;
    }

    return true;
  }

  /**
   * Find edge between two nodes
   * @param {string} from - Source node
   * @param {string} to - Target node
   * @returns {Object|null} Edge data or null
   */
  findEdge(from, to) {
    return this.graph.edges.find(edge => edge.from === from && edge.to === to);
  }

  /**
   * Get node by ID
   * @param {string} nodeId - Node ID
   * @returns {Object|null} Node data or null
   */
  getNode(nodeId) {
    return this.graph.nodes.find(node => node.id === nodeId);
  }

  /**
   * Record a detected cycle
   * @param {string} cycleStart - Node where cycle was detected
   */
  recordCycle(cycleStart) {
    const cycleStartIndex = this.pathStack.indexOf(cycleStart);
    
    if (cycleStartIndex === -1) return;

    const cyclePath = this.pathStack.slice(cycleStartIndex);
    cyclePath.push(cycleStart); // Complete the cycle

    // Check if this cycle already exists
    if (this.isCycleDuplicate(cyclePath)) {
      return;
    }

    const cycle = {
      id: `cycle_${this.cycles.length + 1}`,
      path: cyclePath,
      length: cyclePath.length - 1,
      strength: this.calculateCycleStrength(cyclePath),
      type: this.classifyCycleType(cyclePath),
      severity: null, // Will be calculated in analysis
      edges: this.getCycleEdges(cyclePath),
      affectedServices: [...new Set(cyclePath.slice(0, -1))],
      detectedAt: new Date().toISOString()
    };

    this.cycles.push(cycle);
    
    // Update statistics
    this.statistics.totalCycles++;
    cycle.affectedServices.forEach(service => this.statistics.affectedServices.add(service));
  }

  /**
   * Check if cycle is a duplicate
   * @param {Array} cyclePath - Cycle path
   * @returns {boolean} True if duplicate
   */
  isCycleDuplicate(cyclePath) {
    const cycleNodes = new Set(cyclePath.slice(0, -1));
    
    return this.cycles.some(existingCycle => {
      const existingNodes = new Set(existingCycle.path.slice(0, -1));
      
      // Same size and same nodes
      return cycleNodes.size === existingNodes.size &&
             [...cycleNodes].every(node => existingNodes.has(node));
    });
  }

  /**
   * Calculate cycle strength based on edge strengths
   * @param {Array} cyclePath - Cycle path
   * @returns {number} Cycle strength
   */
  calculateCycleStrength(cyclePath) {
    let totalStrength = 0;
    let edgeCount = 0;

    for (let i = 0; i < cyclePath.length - 1; i++) {
      const edge = this.findEdge(cyclePath[i], cyclePath[i + 1]);
      if (edge) {
        totalStrength += edge.strength;
        edgeCount++;
      }
    }

    return edgeCount > 0 ? totalStrength / edgeCount : 0;
  }

  /**
   * Classify cycle type based on characteristics
   * @param {Array} cyclePath - Cycle path
   * @returns {string} Cycle type
   */
  classifyCycleType(cyclePath) {
    const length = cyclePath.length - 1;
    const nodes = cyclePath.slice(0, -1);
    
    // Check for specific patterns
    if (length === 2) {
      // Bidirectional dependency
      return 'bidirectional';
    }
    
    if (length === 3) {
      // Triangle dependency
      return 'triangle';
    }
    
    if (this.hasStrongEdges(cyclePath)) {
      return 'strong_cycle';
    }
    
    if (this.hasWeakEdges(cyclePath)) {
      return 'weak_cycle';
    }
    
    return 'complex_cycle';
  }

  /**
   * Check if cycle has strong edges
   * @param {Array} cyclePath - Cycle path
   * @returns {boolean} True if has strong edges
   */
  hasStrongEdges(cyclePath) {
    for (let i = 0; i < cyclePath.length - 1; i++) {
      const edge = this.findEdge(cyclePath[i], cyclePath[i + 1]);
      if (edge && edge.strength > 0.7) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if cycle has weak edges
   * @param {Array} cyclePath - Cycle path
   * @returns {boolean} True if all edges are weak
   */
  hasWeakEdges(cyclePath) {
    for (let i = 0; i < cyclePath.length - 1; i++) {
      const edge = this.findEdge(cyclePath[i], cyclePath[i + 1]);
      if (!edge || edge.strength > 0.5) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get edges that form the cycle
   * @param {Array} cyclePath - Cycle path
   * @returns {Array} Cycle edges
   */
  getCycleEdges(cyclePath) {
    const edges = [];
    
    for (let i = 0; i < cyclePath.length - 1; i++) {
      const edge = this.findEdge(cyclePath[i], cyclePath[i + 1]);
      if (edge) {
        edges.push({
          from: edge.from,
          to: edge.to,
          type: edge.type,
          strength: edge.strength,
          metadata: edge.metadata
        });
      }
    }
    
    return edges;
  }

  /**
   * Detect complex cycles (cycles within cycles, overlapping cycles)
   */
  detectComplexCycles() {
    // Find overlapping cycles
    this.findOverlappingCycles();
    
    // Find nested cycles
    this.findNestedCycles();
    
    // Find cycle clusters
    this.findCycleClusters();
  }

  /**
   * Find overlapping cycles
   */
  findOverlappingCycles() {
    const overlappingGroups = [];
    
    for (let i = 0; i < this.cycles.length; i++) {
      for (let j = i + 1; j < this.cycles.length; j++) {
        const cycle1 = this.cycles[i];
        const cycle2 = this.cycles[j];
        
        const overlap = this.calculateCycleOverlap(cycle1, cycle2);
        
        if (overlap.nodeCount > 0) {
          // Mark cycles as overlapping
          cycle1.overlapping = true;
          cycle2.overlapping = true;
          
          overlappingGroups.push({
            cycles: [cycle1.id, cycle2.id],
            sharedNodes: overlap.sharedNodes,
            overlapRatio: overlap.ratio
          });
        }
      }
    }
    
    this.overlappingCycles = overlappingGroups;
  }

  /**
   * Calculate overlap between two cycles
   * @param {Object} cycle1 - First cycle
   * @param {Object} cycle2 - Second cycle
   * @returns {Object} Overlap information
   */
  calculateCycleOverlap(cycle1, cycle2) {
    const nodes1 = new Set(cycle1.path.slice(0, -1));
    const nodes2 = new Set(cycle2.path.slice(0, -1));
    
    const sharedNodes = [...nodes1].filter(node => nodes2.has(node));
    const totalUniqueNodes = new Set([...nodes1, ...nodes2]).size;
    
    return {
      nodeCount: sharedNodes.length,
      sharedNodes,
      ratio: totalUniqueNodes > 0 ? sharedNodes.length / totalUniqueNodes : 0
    };
  }

  /**
   * Find nested cycles (cycles contained within larger cycles)
   */
  findNestedCycles() {
    const nestedGroups = [];
    
    for (let i = 0; i < this.cycles.length; i++) {
      for (let j = 0; j < this.cycles.length; j++) {
        if (i === j) continue;
        
        const smallerCycle = this.cycles[i];
        const largerCycle = this.cycles[j];
        
        if (smallerCycle.length >= largerCycle.length) continue;
        
        if (this.isCycleNested(smallerCycle, largerCycle)) {
          smallerCycle.nested = true;
          largerCycle.containsNested = true;
          
          nestedGroups.push({
            parent: largerCycle.id,
            child: smallerCycle.id,
            nestingLevel: this.calculateNestingLevel(smallerCycle, largerCycle)
          });
        }
      }
    }
    
    this.nestedCycles = nestedGroups;
  }

  /**
   * Check if one cycle is nested within another
   * @param {Object} smallerCycle - Potentially nested cycle
   * @param {Object} largerCycle - Potentially containing cycle
   * @returns {boolean} True if nested
   */
  isCycleNested(smallerCycle, largerCycle) {
    const smallerNodes = new Set(smallerCycle.path.slice(0, -1));
    const largerNodes = new Set(largerCycle.path.slice(0, -1));
    
    // All nodes of smaller cycle must be in larger cycle
    return [...smallerNodes].every(node => largerNodes.has(node));
  }

  /**
   * Calculate nesting level
   * @param {Object} smallerCycle - Nested cycle
   * @param {Object} largerCycle - Containing cycle
   * @returns {number} Nesting level
   */
  calculateNestingLevel(smallerCycle, largerCycle) {
    return largerCycle.length - smallerCycle.length;
  }

  /**
   * Find cycle clusters (groups of related cycles)
   */
  findCycleClusters() {
    const clusters = [];
    const processed = new Set();
    
    for (const cycle of this.cycles) {
      if (processed.has(cycle.id)) continue;
      
      const cluster = this.buildCycleCluster(cycle, processed);
      if (cluster.cycles.length > 1) {
        clusters.push(cluster);
      }
    }
    
    this.cycleClusters = clusters;
  }

  /**
   * Build cycle cluster starting from a cycle
   * @param {Object} startCycle - Starting cycle
   * @param {Set} processed - Processed cycle IDs
   * @returns {Object} Cycle cluster
   */
  buildCycleCluster(startCycle, processed) {
    const cluster = {
      id: `cluster_${startCycle.id}`,
      cycles: [startCycle.id],
      sharedServices: new Set(startCycle.affectedServices),
      totalServices: new Set(startCycle.affectedServices),
      complexity: startCycle.length
    };
    
    processed.add(startCycle.id);
    
    // Find related cycles
    for (const otherCycle of this.cycles) {
      if (processed.has(otherCycle.id)) continue;
      
      const overlap = this.calculateCycleOverlap(startCycle, otherCycle);
      
      if (overlap.nodeCount > 0) {
        cluster.cycles.push(otherCycle.id);
        
        // Update shared and total services
        const otherServices = new Set(otherCycle.affectedServices);
        const newShared = [...cluster.sharedServices].filter(s => otherServices.has(s));
        cluster.sharedServices = new Set(newShared);
        
        otherServices.forEach(s => cluster.totalServices.add(s));
        cluster.complexity += otherCycle.length;
        
        processed.add(otherCycle.id);
      }
    }
    
    return cluster;
  }

  /**
   * Analyze detected cycles
   */
  analyzeCycles() {
    this.cycles.forEach(cycle => {
      cycle.severity = this.calculateCycleSeverity(cycle);
      cycle.impact = this.calculateCycleImpact(cycle);
      cycle.breakingSuggestions = this.generateBreakingSuggestions(cycle);
      cycle.risk = this.assessCycleRisk(cycle);
    });

    this.calculateStatistics();
  }

  /**
   * Calculate cycle severity
   * @param {Object} cycle - Cycle data
   * @returns {string} Severity level
   */
  calculateCycleSeverity(cycle) {
    const factors = {
      length: cycle.length <= 2 ? 3 : cycle.length <= 3 ? 2 : 1,
      strength: cycle.strength > 0.8 ? 3 : cycle.strength > 0.5 ? 2 : 1,
      type: cycle.type === 'bidirectional' ? 3 : cycle.type === 'triangle' ? 2 : 1
    };

    const score = factors.length + factors.strength + factors.type;

    if (score >= 8) return 'critical';
    if (score >= 6) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  }

  /**
   * Calculate cycle impact
   * @param {Object} cycle - Cycle data
   * @returns {Object} Impact assessment
   */
  calculateCycleImpact(cycle) {
    const affectedServices = cycle.affectedServices.length;
    const strongEdges = cycle.edges.filter(e => e.strength > 0.7).length;
    
    return {
      serviceCount: affectedServices,
      strongDependencies: strongEdges,
      deploymentComplexity: this.calculateDeploymentComplexity(cycle),
      testingComplexity: this.calculateTestingComplexity(cycle),
      maintenanceImpact: this.calculateMaintenanceImpact(cycle)
    };
  }

  /**
   * Calculate deployment complexity due to cycle
   * @param {Object} cycle - Cycle data
   * @returns {string} Complexity level
   */
  calculateDeploymentComplexity(cycle) {
    const strongEdges = cycle.edges.filter(e => e.strength > 0.7).length;
    const totalEdges = cycle.edges.length;
    
    if (strongEdges === totalEdges && cycle.length <= 3) return 'very_high';
    if (strongEdges > totalEdges / 2) return 'high';
    if (strongEdges > 0) return 'medium';
    return 'low';
  }

  /**
   * Calculate testing complexity
   * @param {Object} cycle - Cycle data
   * @returns {string} Complexity level
   */
  calculateTestingComplexity(cycle) {
    // More services in cycle = higher testing complexity
    if (cycle.affectedServices.length > 5) return 'very_high';
    if (cycle.affectedServices.length > 3) return 'high';
    if (cycle.affectedServices.length > 2) return 'medium';
    return 'low';
  }

  /**
   * Calculate maintenance impact
   * @param {Object} cycle - Cycle data
   * @returns {string} Impact level
   */
  calculateMaintenanceImpact(cycle) {
    const bidirectionalEdges = cycle.edges.filter(e => 
      this.findEdge(e.to, e.from) !== null
    ).length;
    
    if (bidirectionalEdges > cycle.edges.length / 2) return 'very_high';
    if (bidirectionalEdges > 0) return 'high';
    if (cycle.strength > 0.6) return 'medium';
    return 'low';
  }

  /**
   * Generate breaking suggestions for cycle
   * @param {Object} cycle - Cycle data
   * @returns {Array} Breaking suggestions
   */
  generateBreakingSuggestions(cycle) {
    const suggestions = [];

    // Find weakest edge
    const weakestEdge = cycle.edges.reduce((weakest, edge) => 
      edge.strength < weakest.strength ? edge : weakest
    );

    suggestions.push({
      type: 'break_weakest',
      edge: `${weakestEdge.from} -> ${weakestEdge.to}`,
      strength: weakestEdge.strength,
      suggestion: 'Break the weakest dependency link',
      effort: 'low'
    });

    // Suggest interface introduction
    if (cycle.type === 'bidirectional') {
      suggestions.push({
        type: 'introduce_interface',
        suggestion: 'Introduce an interface or abstraction layer',
        effort: 'medium'
      });
    }

    // Suggest event-driven pattern
    if (cycle.strength > 0.5) {
      suggestions.push({
        type: 'event_driven',
        suggestion: 'Replace direct calls with event-driven communication',
        effort: 'high'
      });
    }

    // Suggest service consolidation for small cycles
    if (cycle.length <= 3 && cycle.strength > 0.7) {
      suggestions.push({
        type: 'consolidate',
        suggestion: 'Consider consolidating tightly coupled services',
        effort: 'very_high'
      });
    }

    return suggestions;
  }

  /**
   * Assess cycle risk
   * @param {Object} cycle - Cycle data
   * @returns {Object} Risk assessment
   */
  assessCycleRisk(cycle) {
    const risks = {
      deployment: this.assessDeploymentRisk(cycle),
      scaling: this.assessScalingRisk(cycle),
      failure: this.assessFailureRisk(cycle),
      evolution: this.assessEvolutionRisk(cycle)
    };

    const overallRisk = this.calculateOverallRisk(risks);

    return {
      ...risks,
      overall: overallRisk,
      mitigationPriority: this.calculateMitigationPriority(cycle, risks)
    };
  }

  /**
   * Assess deployment risk
   * @param {Object} cycle - Cycle data
   * @returns {string} Risk level
   */
  assessDeploymentRisk(cycle) {
    if (cycle.type === 'bidirectional' && cycle.strength > 0.8) return 'high';
    if (cycle.length <= 3 && cycle.strength > 0.6) return 'medium';
    return 'low';
  }

  /**
   * Assess scaling risk
   * @param {Object} cycle - Cycle data
   * @returns {string} Risk level
   */
  assessScalingRisk(cycle) {
    if (cycle.affectedServices.length > 4) return 'high';
    if (cycle.affectedServices.length > 2) return 'medium';
    return 'low';
  }

  /**
   * Assess failure risk
   * @param {Object} cycle - Cycle data
   * @returns {string} Risk level
   */
  assessFailureRisk(cycle) {
    const strongEdges = cycle.edges.filter(e => e.strength > 0.7).length;
    if (strongEdges === cycle.edges.length) return 'high';
    if (strongEdges > 0) return 'medium';
    return 'low';
  }

  /**
   * Assess evolution risk
   * @param {Object} cycle - Cycle data
   * @returns {string} Risk level
   */
  assessEvolutionRisk(cycle) {
    if (cycle.type === 'bidirectional') return 'high';
    if (cycle.strength > 0.6) return 'medium';
    return 'low';
  }

  /**
   * Calculate overall risk
   * @param {Object} risks - Individual risk assessments
   * @returns {string} Overall risk level
   */
  calculateOverallRisk(risks) {
    const riskValues = { low: 1, medium: 2, high: 3 };
    const totalRisk = Object.values(risks).reduce((sum, risk) => sum + riskValues[risk], 0);
    const averageRisk = totalRisk / Object.keys(risks).length;

    if (averageRisk >= 2.5) return 'high';
    if (averageRisk >= 1.5) return 'medium';
    return 'low';
  }

  /**
   * Calculate mitigation priority
   * @param {Object} cycle - Cycle data
   * @param {Object} risks - Risk assessments
   * @returns {number} Priority score (1-10)
   */
  calculateMitigationPriority(cycle, risks) {
    const severityScore = { low: 1, medium: 3, high: 6, critical: 10 }[cycle.severity] || 1;
    const riskScore = { low: 1, medium: 2, high: 3 }[risks.overall] || 1;
    const impactScore = cycle.affectedServices.length;

    return Math.min(10, Math.max(1, severityScore + riskScore + impactScore));
  }

  /**
   * Calculate overall statistics
   */
  calculateStatistics() {
    this.statistics.totalCycles = this.cycles.length;
    this.statistics.criticalCycles = this.cycles.filter(c => c.severity === 'critical').length;
    
    if (this.cycles.length > 0) {
      this.statistics.averageCycleLength = this.cycles.reduce((sum, c) => sum + c.length, 0) / this.cycles.length;
      this.statistics.maxCycleLength = Math.max(...this.cycles.map(c => c.length));
    }
    
    // Round average
    this.statistics.averageCycleLength = Math.round(this.statistics.averageCycleLength * 100) / 100;
  }

  /**
   * Generate comprehensive detection report
   * @returns {Object} Complete detection report
   */
  generateDetectionReport() {
    return {
      metadata: {
        detectedAt: new Date().toISOString(),
        version: '1.0.0',
        options: this.options
      },
      statistics: {
        ...this.statistics,
        affectedServices: Array.from(this.statistics.affectedServices)
      },
      cycles: this.cycles.map(cycle => ({
        ...cycle,
        affectedServices: [...cycle.affectedServices]
      })),
      complexPatterns: {
        overlapping: this.overlappingCycles || [],
        nested: this.nestedCycles || [],
        clusters: this.cycleClusters || []
      },
      analysis: {
        severityDistribution: this.getSeverityDistribution(),
        typeDistribution: this.getTypeDistribution(),
        riskAnalysis: this.getRiskAnalysis(),
        breakingRecommendations: this.getBreakingRecommendations()
      },
      prioritization: {
        highPriority: this.getHighPriorityCycles(),
        quickWins: this.getQuickWinOpportunities(),
        strategicActions: this.getStrategicActions()
      }
    };
  }

  /**
   * Get severity distribution
   * @returns {Object} Severity distribution
   */
  getSeverityDistribution() {
    const distribution = { critical: 0, high: 0, medium: 0, low: 0 };
    
    this.cycles.forEach(cycle => {
      distribution[cycle.severity]++;
    });

    return distribution;
  }

  /**
   * Get type distribution
   * @returns {Object} Type distribution
   */
  getTypeDistribution() {
    const distribution = {};
    
    this.cycles.forEach(cycle => {
      distribution[cycle.type] = (distribution[cycle.type] || 0) + 1;
    });

    return distribution;
  }

  /**
   * Get risk analysis
   * @returns {Object} Risk analysis
   */
  getRiskAnalysis() {
    const riskDistribution = { high: 0, medium: 0, low: 0 };
    const topRisks = [];

    this.cycles.forEach(cycle => {
      riskDistribution[cycle.risk.overall]++;
      
      if (cycle.risk.overall === 'high') {
        topRisks.push({
          id: cycle.id,
          services: cycle.affectedServices,
          severity: cycle.severity,
          priority: cycle.risk.mitigationPriority
        });
      }
    });

    return {
      distribution: riskDistribution,
      topRisks: topRisks.sort((a, b) => b.priority - a.priority).slice(0, 5)
    };
  }

  /**
   * Get breaking recommendations
   * @returns {Array} Consolidated breaking recommendations
   */
  getBreakingRecommendations() {
    const recommendations = new Map();

    this.cycles.forEach(cycle => {
      cycle.breakingSuggestions.forEach(suggestion => {
        const key = suggestion.type;
        
        if (!recommendations.has(key)) {
          recommendations.set(key, {
            type: suggestion.type,
            count: 0,
            cycles: [],
            effort: suggestion.effort,
            description: suggestion.suggestion
          });
        }

        const rec = recommendations.get(key);
        rec.count++;
        rec.cycles.push(cycle.id);
      });
    });

    return Array.from(recommendations.values())
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get high priority cycles
   * @returns {Array} High priority cycles
   */
  getHighPriorityCycles() {
    return this.cycles
      .filter(cycle => cycle.risk.mitigationPriority >= 7)
      .sort((a, b) => b.risk.mitigationPriority - a.risk.mitigationPriority)
      .slice(0, 5)
      .map(cycle => ({
        id: cycle.id,
        services: cycle.affectedServices,
        severity: cycle.severity,
        priority: cycle.risk.mitigationPriority,
        topSuggestion: cycle.breakingSuggestions[0]
      }));
  }

  /**
   * Get quick win opportunities
   * @returns {Array} Quick win opportunities
   */
  getQuickWinOpportunities() {
    return this.cycles
      .filter(cycle => 
        cycle.breakingSuggestions.some(s => s.effort === 'low') &&
        cycle.severity !== 'low'
      )
      .sort((a, b) => a.length - b.length) // Shorter cycles first
      .slice(0, 3)
      .map(cycle => ({
        id: cycle.id,
        services: cycle.affectedServices,
        reason: 'Low effort, meaningful impact',
        suggestion: cycle.breakingSuggestions.find(s => s.effort === 'low')
      }));
  }

  /**
   * Get strategic actions
   * @returns {Array} Strategic actions
   */
  getStrategicActions() {
    const actions = [];

    // Cluster-level actions
    if (this.cycleClusters?.length > 0) {
      const largestCluster = this.cycleClusters
        .sort((a, b) => b.cycles.length - a.cycles.length)[0];
      
      actions.push({
        type: 'cluster_redesign',
        target: largestCluster,
        impact: 'high',
        effort: 'very_high',
        description: `Redesign service cluster affecting ${largestCluster.totalServices.size} services`
      });
    }

    // Critical cycles requiring architectural changes
    const criticalCycles = this.cycles.filter(c => c.severity === 'critical');
    if (criticalCycles.length > 0) {
      actions.push({
        type: 'architecture_review',
        target: criticalCycles,
        impact: 'very_high',
        effort: 'high',
        description: `Architectural review for ${criticalCycles.length} critical cycles`
      });
    }

    return actions;
  }
}

module.exports = CircularDependencyDetector; 