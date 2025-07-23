/**
 * Risk Scoring Engine
 * Calculates comprehensive risk scores based on fan-in/fan-out metrics and dependency patterns
 */
class RiskScoringEngine {
  constructor(options = {}) {
    this.options = {
      weights: {
        fanIn: options.weights?.fanIn || 0.25,
        fanOut: options.weights?.fanOut || 0.20,
        complexity: options.weights?.complexity || 0.15,
        depth: options.weights?.depth || 0.15,
        coupling: options.weights?.coupling || 0.10,
        stability: options.weights?.stability || 0.10,
        criticality: options.weights?.criticality || 0.05
      },
      thresholds: {
        lowRisk: options.thresholds?.lowRisk || 3,
        mediumRisk: options.thresholds?.mediumRisk || 6,
        highRisk: options.thresholds?.highRisk || 8
      },
      ...options
    };

    this.riskScores = new Map();
    this.riskFactors = new Map();
    this.statistics = {
      totalServices: 0,
      riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
      averageRiskScore: 0,
      maxRiskScore: 0,
      riskTrends: []
    };
  }

  /**
   * Calculate risk scores for all services
   * @param {Object} dependencyGraph - Dependency graph data
   * @param {Object} depthAnalysis - Depth analysis results
   * @param {Object} complexityData - Complexity analysis data
   * @returns {Object} Risk scoring results
   */
  calculateRiskScores(dependencyGraph, depthAnalysis, complexityData) {
    this.graph = dependencyGraph;
    this.depthData = depthAnalysis;
    this.complexityData = complexityData;
    
    // Calculate individual risk factors
    this.calculateFanInOutRisks();
    this.calculateComplexityRisks();
    this.calculateDepthRisks();
    this.calculateCouplingRisks();
    this.calculateStabilityRisks();
    this.calculateCriticalityRisks();
    
    // Combine into overall risk scores
    this.calculateOverallRiskScores();
    
    // Analyze risk patterns
    this.analyzeRiskPatterns();
    
    // Calculate statistics
    this.calculateStatistics();
    
    return this.generateRiskReport();
  }

  /**
   * Calculate fan-in/fan-out risk factors
   */
  calculateFanInOutRisks() {
    const internalNodes = this.getInternalNodes();
    
    for (const nodeId of internalNodes) {
      const fanIn = this.calculateFanIn(nodeId);
      const fanOut = this.calculateFanOut(nodeId);
      
      const riskFactors = {
        fanInRisk: this.calculateFanInRisk(fanIn),
        fanOutRisk: this.calculateFanOutRisk(fanOut),
        fanImbalanceRisk: this.calculateFanImbalanceRisk(fanIn, fanOut),
        hubRisk: this.calculateHubRisk(fanIn, fanOut)
      };
      
      this.setRiskFactors(nodeId, 'fanInOut', riskFactors);
    }
  }

  /**
   * Get internal nodes
   * @returns {Array} Internal node IDs
   */
  getInternalNodes() {
    return this.graph.nodes
      .filter(node => node.type === 'internal')
      .map(node => node.id);
  }

  /**
   * Calculate fan-in for a node
   * @param {string} nodeId - Node ID
   * @returns {number} Fan-in count
   */
  calculateFanIn(nodeId) {
    return this.graph.edges.filter(edge => edge.to === nodeId).length;
  }

  /**
   * Calculate fan-out for a node
   * @param {string} nodeId - Node ID
   * @returns {number} Fan-out count
   */
  calculateFanOut(nodeId) {
    return this.graph.edges.filter(edge => edge.from === nodeId).length;
  }

  /**
   * Calculate fan-in risk score
   * @param {number} fanIn - Fan-in count
   * @returns {number} Risk score (0-10)
   */
  calculateFanInRisk(fanIn) {
    // High fan-in indicates many dependencies on this service
    if (fanIn >= 10) return 10;
    if (fanIn >= 7) return 8;
    if (fanIn >= 5) return 6;
    if (fanIn >= 3) return 4;
    if (fanIn >= 1) return 2;
    return 0; // No incoming dependencies
  }

  /**
   * Calculate fan-out risk score
   * @param {number} fanOut - Fan-out count
   * @returns {number} Risk score (0-10)
   */
  calculateFanOutRisk(fanOut) {
    // High fan-out indicates this service depends on many others
    if (fanOut >= 12) return 10;
    if (fanOut >= 8) return 7;
    if (fanOut >= 5) return 5;
    if (fanOut >= 3) return 3;
    if (fanOut >= 1) return 1;
    return 0; // No outgoing dependencies
  }

  /**
   * Calculate fan imbalance risk
   * @param {number} fanIn - Fan-in count
   * @param {number} fanOut - Fan-out count
   * @returns {number} Risk score (0-10)
   */
  calculateFanImbalanceRisk(fanIn, fanOut) {
    const total = fanIn + fanOut;
    if (total === 0) return 0;
    
    const imbalance = Math.abs(fanIn - fanOut);
    const imbalanceRatio = imbalance / total;
    
    // High imbalance can indicate architectural issues
    if (imbalanceRatio >= 0.8) return 8;
    if (imbalanceRatio >= 0.6) return 6;
    if (imbalanceRatio >= 0.4) return 4;
    if (imbalanceRatio >= 0.2) return 2;
    return 0;
  }

  /**
   * Calculate hub risk (services that are both highly depended upon and depend on many)
   * @param {number} fanIn - Fan-in count
   * @param {number} fanOut - Fan-out count
   * @returns {number} Risk score (0-10)
   */
  calculateHubRisk(fanIn, fanOut) {
    const total = fanIn + fanOut;
    const hubScore = Math.min(fanIn, fanOut); // Lower of the two
    
    // Services that are both highly connected in both directions are risky
    if (total >= 12 && hubScore >= 4) return 9;
    if (total >= 8 && hubScore >= 3) return 7;
    if (total >= 5 && hubScore >= 2) return 5;
    if (total >= 3 && hubScore >= 1) return 3;
    return 0;
  }

  /**
   * Calculate complexity-based risks
   */
  calculateComplexityRisks() {
    const complexityMetrics = this.complexityData?.detailedMetrics || [];
    
    for (const metric of complexityMetrics) {
      const nodeId = metric.serviceName;
      
      const riskFactors = {
        endpointComplexityRisk: this.calculateEndpointComplexityRisk(metric),
        parameterComplexityRisk: this.calculateParameterComplexityRisk(metric),
        responseComplexityRisk: this.calculateResponseComplexityRisk(metric),
        overallComplexityRisk: this.calculateOverallComplexityRisk(metric)
      };
      
      this.setRiskFactors(nodeId, 'complexity', riskFactors);
    }
  }

  /**
   * Calculate endpoint complexity risk
   * @param {Object} metric - Complexity metric
   * @returns {number} Risk score (0-10)
   */
  calculateEndpointComplexityRisk(metric) {
    const complexity = metric.overallComplexity || 0;
    
    if (complexity >= 9) return 10;
    if (complexity >= 7) return 8;
    if (complexity >= 5) return 6;
    if (complexity >= 3) return 4;
    if (complexity >= 1) return 2;
    return 0;
  }

  /**
   * Calculate parameter complexity risk
   * @param {Object} metric - Complexity metric
   * @returns {number} Risk score (0-10)
   */
  calculateParameterComplexityRisk(metric) {
    const paramComplexity = metric.parameterComplexity?.score || 0;
    
    if (paramComplexity >= 8) return 9;
    if (paramComplexity >= 6) return 7;
    if (paramComplexity >= 4) return 5;
    if (paramComplexity >= 2) return 3;
    return 0;
  }

  /**
   * Calculate response complexity risk
   * @param {Object} metric - Complexity metric
   * @returns {number} Risk score (0-10)
   */
  calculateResponseComplexityRisk(metric) {
    const responseComplexity = metric.responseComplexity?.score || 0;
    
    if (responseComplexity >= 8) return 8;
    if (responseComplexity >= 6) return 6;
    if (responseComplexity >= 4) return 4;
    if (responseComplexity >= 2) return 2;
    return 0;
  }

  /**
   * Calculate overall complexity risk
   * @param {Object} metric - Complexity metric
   * @returns {number} Risk score (0-10)
   */
  calculateOverallComplexityRisk(metric) {
    const level = metric.complexityLevel;
    
    const levelRisks = {
      'critical': 10,
      'high': 7,
      'medium': 4,
      'low': 1
    };
    
    return levelRisks[level] || 0;
  }

  /**
   * Calculate depth-based risks
   */
  calculateDepthRisks() {
    const nodeMetrics = this.depthData?.nodeMetrics || [];
    
    for (const metric of nodeMetrics) {
      const nodeId = metric.nodeId;
      
      const riskFactors = {
        incomingDepthRisk: this.calculateIncomingDepthRisk(metric.incomingDepth),
        outgoingDepthRisk: this.calculateOutgoingDepthRisk(metric.outgoingDepth),
        totalDepthRisk: this.calculateTotalDepthRisk(metric.totalDepth),
        pathComplexityRisk: this.calculatePathComplexityRisk(metric.pathComplexity)
      };
      
      this.setRiskFactors(nodeId, 'depth', riskFactors);
    }
  }

  /**
   * Calculate incoming depth risk
   * @param {number} incomingDepth - Incoming dependency depth
   * @returns {number} Risk score (0-10)
   */
  calculateIncomingDepthRisk(incomingDepth) {
    if (incomingDepth >= 8) return 9;
    if (incomingDepth >= 6) return 7;
    if (incomingDepth >= 4) return 5;
    if (incomingDepth >= 2) return 3;
    return 0;
  }

  /**
   * Calculate outgoing depth risk
   * @param {number} outgoingDepth - Outgoing dependency depth
   * @returns {number} Risk score (0-10)
   */
  calculateOutgoingDepthRisk(outgoingDepth) {
    if (outgoingDepth >= 8) return 8;
    if (outgoingDepth >= 6) return 6;
    if (outgoingDepth >= 4) return 4;
    if (outgoingDepth >= 2) return 2;
    return 0;
  }

  /**
   * Calculate total depth risk
   * @param {number} totalDepth - Total dependency depth
   * @returns {number} Risk score (0-10)
   */
  calculateTotalDepthRisk(totalDepth) {
    if (totalDepth >= 12) return 10;
    if (totalDepth >= 9) return 8;
    if (totalDepth >= 6) return 6;
    if (totalDepth >= 3) return 4;
    return 0;
  }

  /**
   * Calculate path complexity risk
   * @param {number} pathComplexity - Path complexity score
   * @returns {number} Risk score (0-10)
   */
  calculatePathComplexityRisk(pathComplexity) {
    if (pathComplexity >= 15) return 9;
    if (pathComplexity >= 10) return 7;
    if (pathComplexity >= 5) return 5;
    if (pathComplexity >= 2) return 3;
    return 0;
  }

  /**
   * Calculate coupling-based risks
   */
  calculateCouplingRisks() {
    const internalNodes = this.getInternalNodes();
    
    for (const nodeId of internalNodes) {
      const riskFactors = {
        tightCouplingRisk: this.calculateTightCouplingRisk(nodeId),
        bidirectionalRisk: this.calculateBidirectionalRisk(nodeId),
        strongDependencyRisk: this.calculateStrongDependencyRisk(nodeId)
      };
      
      this.setRiskFactors(nodeId, 'coupling', riskFactors);
    }
  }

  /**
   * Calculate tight coupling risk
   * @param {string} nodeId - Node ID
   * @returns {number} Risk score (0-10)
   */
  calculateTightCouplingRisk(nodeId) {
    const strongEdges = this.getStrongEdges(nodeId);
    const totalEdges = this.getTotalEdges(nodeId);
    
    if (totalEdges === 0) return 0;
    
    const strongRatio = strongEdges / totalEdges;
    
    if (strongRatio >= 0.8 && totalEdges >= 3) return 9;
    if (strongRatio >= 0.6 && totalEdges >= 2) return 7;
    if (strongRatio >= 0.4) return 5;
    if (strongRatio >= 0.2) return 3;
    return 0;
  }

  /**
   * Get strong edges for a node
   * @param {string} nodeId - Node ID
   * @returns {number} Count of strong edges
   */
  getStrongEdges(nodeId) {
    return this.graph.edges.filter(edge => 
      (edge.from === nodeId || edge.to === nodeId) && edge.strength >= 0.7
    ).length;
  }

  /**
   * Get total edges for a node
   * @param {string} nodeId - Node ID
   * @returns {number} Count of total edges
   */
  getTotalEdges(nodeId) {
    return this.graph.edges.filter(edge => 
      edge.from === nodeId || edge.to === nodeId
    ).length;
  }

  /**
   * Calculate bidirectional risk
   * @param {string} nodeId - Node ID
   * @returns {number} Risk score (0-10)
   */
  calculateBidirectionalRisk(nodeId) {
    const bidirectionalCount = this.getBidirectionalConnections(nodeId);
    const totalConnections = this.getTotalConnections(nodeId);
    
    if (totalConnections === 0) return 0;
    
    const bidirectionalRatio = bidirectionalCount / totalConnections;
    
    if (bidirectionalRatio >= 0.6 && bidirectionalCount >= 3) return 8;
    if (bidirectionalRatio >= 0.4 && bidirectionalCount >= 2) return 6;
    if (bidirectionalRatio >= 0.2) return 4;
    if (bidirectionalCount >= 1) return 2;
    return 0;
  }

  /**
   * Get bidirectional connections count
   * @param {string} nodeId - Node ID
   * @returns {number} Bidirectional connections count
   */
  getBidirectionalConnections(nodeId) {
    let count = 0;
    const connectedNodes = new Set();
    
    // Find all connected nodes
    this.graph.edges.forEach(edge => {
      if (edge.from === nodeId) connectedNodes.add(edge.to);
      if (edge.to === nodeId) connectedNodes.add(edge.from);
    });
    
    // Check for bidirectional connections
    for (const otherNode of connectedNodes) {
      const hasOutgoing = this.graph.edges.some(e => e.from === nodeId && e.to === otherNode);
      const hasIncoming = this.graph.edges.some(e => e.from === otherNode && e.to === nodeId);
      
      if (hasOutgoing && hasIncoming) {
        count++;
      }
    }
    
    return count;
  }

  /**
   * Get total unique connections
   * @param {string} nodeId - Node ID
   * @returns {number} Total unique connections
   */
  getTotalConnections(nodeId) {
    const connectedNodes = new Set();
    
    this.graph.edges.forEach(edge => {
      if (edge.from === nodeId) connectedNodes.add(edge.to);
      if (edge.to === nodeId) connectedNodes.add(edge.from);
    });
    
    return connectedNodes.size;
  }

  /**
   * Calculate strong dependency risk
   * @param {string} nodeId - Node ID
   * @returns {number} Risk score (0-10)
   */
  calculateStrongDependencyRisk(nodeId) {
    const strongIncoming = this.graph.edges.filter(edge => 
      edge.to === nodeId && edge.strength >= 0.8
    ).length;
    
    const strongOutgoing = this.graph.edges.filter(edge => 
      edge.from === nodeId && edge.strength >= 0.8
    ).length;
    
    const totalStrong = strongIncoming + strongOutgoing;
    
    if (totalStrong >= 8) return 10;
    if (totalStrong >= 5) return 8;
    if (totalStrong >= 3) return 6;
    if (totalStrong >= 1) return 4;
    return 0;
  }

  /**
   * Calculate stability-based risks
   */
  calculateStabilityRisks() {
    const internalNodes = this.getInternalNodes();
    
    for (const nodeId of internalNodes) {
      const riskFactors = {
        instabilityRisk: this.calculateInstabilityRisk(nodeId),
        changeRisk: this.calculateChangeRisk(nodeId),
        evolutionRisk: this.calculateEvolutionRisk(nodeId)
      };
      
      this.setRiskFactors(nodeId, 'stability', riskFactors);
    }
  }

  /**
   * Calculate instability risk using I = Ce / (Ca + Ce)
   * @param {string} nodeId - Node ID
   * @returns {number} Risk score (0-10)
   */
  calculateInstabilityRisk(nodeId) {
    const ca = this.calculateAfferentCoupling(nodeId); // Incoming
    const ce = this.calculateEfferentCoupling(nodeId); // Outgoing
    
    if (ca + ce === 0) return 0;
    
    const instability = ce / (ca + ce);
    
    // High instability (close to 1) means high risk
    if (instability >= 0.9) return 9;
    if (instability >= 0.8) return 7;
    if (instability >= 0.7) return 5;
    if (instability >= 0.5) return 3;
    return 0;
  }

  /**
   * Calculate afferent coupling (incoming dependencies)
   * @param {string} nodeId - Node ID
   * @returns {number} Afferent coupling
   */
  calculateAfferentCoupling(nodeId) {
    return this.graph.edges.filter(edge => edge.to === nodeId).length;
  }

  /**
   * Calculate efferent coupling (outgoing dependencies)
   * @param {string} nodeId - Node ID
   * @returns {number} Efferent coupling
   */
  calculateEfferentCoupling(nodeId) {
    return this.graph.edges.filter(edge => edge.from === nodeId).length;
  }

  /**
   * Calculate change risk based on coupling patterns
   * @param {string} nodeId - Node ID
   * @returns {number} Risk score (0-10)
   */
  calculateChangeRisk(nodeId) {
    const fanIn = this.calculateFanIn(nodeId);
    const fanOut = this.calculateFanOut(nodeId);
    
    // Services with high fan-in are risky to change (affects many)
    // Services with high fan-out are risky due to many dependencies
    const changeImpact = fanIn * 0.7 + fanOut * 0.3;
    
    if (changeImpact >= 12) return 10;
    if (changeImpact >= 8) return 8;
    if (changeImpact >= 5) return 6;
    if (changeImpact >= 2) return 4;
    return 0;
  }

  /**
   * Calculate evolution risk
   * @param {string} nodeId - Node ID
   * @returns {number} Risk score (0-10)
   */
  calculateEvolutionRisk(nodeId) {
    const node = this.getNode(nodeId);
    if (!node) return 0;
    
    // Consider framework maturity and patterns
    const framework = node.metadata?.framework;
    const language = node.metadata?.language;
    
    let riskScore = 0;
    
    // Framework-based risk
    const frameworkRisks = {
      'Express.js': 2,
      'NestJS': 1,
      'FastAPI': 1,
      'Flask': 3,
      'Django': 2,
      'Spring Boot': 1,
      'ASP.NET Core': 1,
      'Gin': 2,
      'Rails': 3,
      'unknown': 5
    };
    
    riskScore += frameworkRisks[framework] || 5;
    
    // Add complexity factor
    const complexity = node.metadata?.complexity || 0;
    riskScore += Math.min(5, complexity * 0.5);
    
    return Math.min(10, riskScore);
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
   * Calculate criticality-based risks
   */
  calculateCriticalityRisks() {
    const internalNodes = this.getInternalNodes();
    
    for (const nodeId of internalNodes) {
      const riskFactors = {
        businessCriticalityRisk: this.calculateBusinessCriticalityRisk(nodeId),
        singlePointFailureRisk: this.calculateSinglePointFailureRisk(nodeId),
        cascadeFailureRisk: this.calculateCascadeFailureRisk(nodeId)
      };
      
      this.setRiskFactors(nodeId, 'criticality', riskFactors);
    }
  }

  /**
   * Calculate business criticality risk
   * @param {string} nodeId - Node ID
   * @returns {number} Risk score (0-10)
   */
  calculateBusinessCriticalityRisk(nodeId) {
    const node = this.getNode(nodeId);
    if (!node) return 0;
    
    const criticality = node.properties?.criticality;
    
    const criticalityRisks = {
      'critical': 10,
      'high': 7,
      'medium': 4,
      'low': 1
    };
    
    return criticalityRisks[criticality] || 5;
  }

  /**
   * Calculate single point of failure risk
   * @param {string} nodeId - Node ID
   * @returns {number} Risk score (0-10)
   */
  calculateSinglePointFailureRisk(nodeId) {
    const fanIn = this.calculateFanIn(nodeId);
    const node = this.getNode(nodeId);
    
    if (!node) return 0;
    
    // High fan-in services are potential single points of failure
    if (fanIn >= 8) return 10;
    if (fanIn >= 5) return 8;
    if (fanIn >= 3) return 6;
    if (fanIn >= 2) return 4;
    return 0;
  }

  /**
   * Calculate cascade failure risk
   * @param {string} nodeId - Node ID
   * @returns {number} Risk score (0-10)
   */
  calculateCascadeFailureRisk(nodeId) {
    const fanOut = this.calculateFanOut(nodeId);
    const fanIn = this.calculateFanIn(nodeId);
    
    // Services that both depend on many and are depended upon by many
    // have high cascade failure risk
    const cascadeScore = Math.min(fanIn, fanOut) + (fanIn + fanOut) * 0.1;
    
    if (cascadeScore >= 8) return 10;
    if (cascadeScore >= 5) return 8;
    if (cascadeScore >= 3) return 6;
    if (cascadeScore >= 1) return 4;
    return 0;
  }

  /**
   * Set risk factors for a node and category
   * @param {string} nodeId - Node ID
   * @param {string} category - Risk category
   * @param {Object} factors - Risk factors
   */
  setRiskFactors(nodeId, category, factors) {
    if (!this.riskFactors.has(nodeId)) {
      this.riskFactors.set(nodeId, {});
    }
    
    this.riskFactors.get(nodeId)[category] = factors;
  }

  /**
   * Calculate overall risk scores
   */
  calculateOverallRiskScores() {
    const internalNodes = this.getInternalNodes();
    
    for (const nodeId of internalNodes) {
      const factors = this.riskFactors.get(nodeId) || {};
      
      const categoryScores = {
        fanInOut: this.calculateCategoryScore(factors.fanInOut || {}),
        complexity: this.calculateCategoryScore(factors.complexity || {}),
        depth: this.calculateCategoryScore(factors.depth || {}),
        coupling: this.calculateCategoryScore(factors.coupling || {}),
        stability: this.calculateCategoryScore(factors.stability || {}),
        criticality: this.calculateCategoryScore(factors.criticality || {})
      };
      
      const overallScore = this.calculateWeightedScore(categoryScores);
      const riskLevel = this.determineRiskLevel(overallScore);
      
      this.riskScores.set(nodeId, {
        nodeId,
        overallScore,
        riskLevel,
        categoryScores,
        factors,
        recommendations: this.generateRiskRecommendations(nodeId, factors, categoryScores),
        mitigationPriority: this.calculateMitigationPriority(overallScore, factors)
      });
    }
  }

  /**
   * Calculate category score from individual factors
   * @param {Object} factors - Category factors
   * @returns {number} Category score
   */
  calculateCategoryScore(factors) {
    const scores = Object.values(factors).filter(score => typeof score === 'number');
    
    if (scores.length === 0) return 0;
    
    // Use maximum score for category (worst case)
    return Math.max(...scores);
  }

  /**
   * Calculate weighted overall score
   * @param {Object} categoryScores - Category scores
   * @returns {number} Weighted score
   */
  calculateWeightedScore(categoryScores) {
    const weights = this.options.weights;
    
    const weightedScore = 
      (categoryScores.fanInOut * weights.fanIn) +
      (categoryScores.fanInOut * weights.fanOut) +
      (categoryScores.complexity * weights.complexity) +
      (categoryScores.depth * weights.depth) +
      (categoryScores.coupling * weights.coupling) +
      (categoryScores.stability * weights.stability) +
      (categoryScores.criticality * weights.criticality);
    
    return Math.round(weightedScore * 100) / 100;
  }

  /**
   * Determine risk level from score
   * @param {number} score - Risk score
   * @returns {string} Risk level
   */
  determineRiskLevel(score) {
    const thresholds = this.options.thresholds;
    
    if (score >= thresholds.highRisk) return 'critical';
    if (score >= thresholds.mediumRisk) return 'high';
    if (score >= thresholds.lowRisk) return 'medium';
    return 'low';
  }

  /**
   * Generate risk recommendations
   * @param {string} nodeId - Node ID
   * @param {Object} factors - Risk factors
   * @param {Object} categoryScores - Category scores
   * @returns {Array} Recommendations
   */
  generateRiskRecommendations(nodeId, factors, categoryScores) {
    const recommendations = [];
    
    // Fan-in/fan-out recommendations
    if (categoryScores.fanInOut >= 7) {
      const fanInRisk = factors.fanInOut?.fanInRisk || 0;
      const fanOutRisk = factors.fanInOut?.fanOutRisk || 0;
      
      if (fanInRisk >= 6) {
        recommendations.push({
          type: 'reduce_fan_in',
          priority: 'high',
          message: 'High fan-in indicates many services depend on this service',
          actions: ['Implement load balancing', 'Add caching layers', 'Consider service decomposition']
        });
      }
      
      if (fanOutRisk >= 6) {
        recommendations.push({
          type: 'reduce_fan_out',
          priority: 'medium',
          message: 'High fan-out indicates dependencies on many services',
          actions: ['Consolidate dependencies', 'Use service mesh', 'Implement circuit breakers']
        });
      }
    }
    
    // Complexity recommendations
    if (categoryScores.complexity >= 6) {
      recommendations.push({
        type: 'reduce_complexity',
        priority: 'medium',
        message: 'High complexity increases maintenance and deployment risks',
        actions: ['Simplify API design', 'Break down complex endpoints', 'Improve documentation']
      });
    }
    
    // Coupling recommendations
    if (categoryScores.coupling >= 7) {
      recommendations.push({
        type: 'reduce_coupling',
        priority: 'high',
        message: 'Tight coupling increases change propagation risks',
        actions: ['Introduce interfaces', 'Use event-driven patterns', 'Implement loose coupling']
      });
    }
    
    // Stability recommendations
    if (categoryScores.stability >= 6) {
      recommendations.push({
        type: 'improve_stability',
        priority: 'medium',
        message: 'Stability issues can cause cascade failures',
        actions: ['Add monitoring', 'Implement health checks', 'Use graceful degradation']
      });
    }
    
    return recommendations;
  }

  /**
   * Calculate mitigation priority
   * @param {number} overallScore - Overall risk score
   * @param {Object} factors - Risk factors
   * @returns {number} Priority score (1-10)
   */
  calculateMitigationPriority(overallScore, factors) {
    let priority = overallScore;
    
    // Boost priority for critical risk factors
    const criticalFactors = this.countCriticalFactors(factors);
    priority += criticalFactors * 0.5;
    
    // Boost priority for single point of failure risk
    const spofRisk = factors.criticality?.singlePointFailureRisk || 0;
    if (spofRisk >= 8) priority += 1;
    
    return Math.min(10, Math.round(priority));
  }

  /**
   * Count critical risk factors
   * @param {Object} factors - All risk factors
   * @returns {number} Count of critical factors
   */
  countCriticalFactors(factors) {
    let count = 0;
    
    Object.values(factors).forEach(categoryFactors => {
      if (typeof categoryFactors === 'object') {
        Object.values(categoryFactors).forEach(score => {
          if (typeof score === 'number' && score >= 8) {
            count++;
          }
        });
      }
    });
    
    return count;
  }

  /**
   * Analyze risk patterns across services
   */
  analyzeRiskPatterns() {
    const riskData = Array.from(this.riskScores.values());
    
    // Find high-risk clusters
    this.identifyHighRiskClusters(riskData);
    
    // Analyze risk correlations
    this.analyzeRiskCorrelations(riskData);
    
    // Identify systemic risks
    this.identifySystemicRisks(riskData);
  }

  /**
   * Identify high-risk clusters
   * @param {Array} riskData - Risk score data
   */
  identifyHighRiskClusters(riskData) {
    const highRiskServices = riskData.filter(r => r.riskLevel === 'critical' || r.riskLevel === 'high');
    
    this.highRiskClusters = this.findConnectedComponents(highRiskServices);
  }

  /**
   * Find connected components of high-risk services
   * @param {Array} highRiskServices - High-risk services
   * @returns {Array} Connected clusters
   */
  findConnectedComponents(highRiskServices) {
    const clusters = [];
    const visited = new Set();
    
    for (const service of highRiskServices) {
      if (!visited.has(service.nodeId)) {
        const cluster = this.buildRiskCluster(service.nodeId, highRiskServices, visited);
        if (cluster.size > 1) {
          clusters.push({
            services: Array.from(cluster),
            riskLevel: 'high',
            size: cluster.size
          });
        }
      }
    }
    
    return clusters;
  }

  /**
   * Build risk cluster from starting service
   * @param {string} startService - Starting service
   * @param {Array} highRiskServices - High-risk services
   * @param {Set} visited - Visited services
   * @returns {Set} Cluster services
   */
  buildRiskCluster(startService, highRiskServices, visited) {
    const cluster = new Set();
    const toVisit = [startService];
    
    while (toVisit.length > 0) {
      const current = toVisit.pop();
      
      if (visited.has(current)) continue;
      
      visited.add(current);
      cluster.add(current);
      
      // Find connected high-risk services
      const connectedServices = this.getConnectedServices(current);
      
      for (const connected of connectedServices) {
        if (!visited.has(connected) && 
            highRiskServices.some(hrs => hrs.nodeId === connected)) {
          toVisit.push(connected);
        }
      }
    }
    
    return cluster;
  }

  /**
   * Get services connected to a given service
   * @param {string} serviceId - Service ID
   * @returns {Array} Connected service IDs
   */
  getConnectedServices(serviceId) {
    const connected = new Set();
    
    this.graph.edges.forEach(edge => {
      if (edge.from === serviceId) connected.add(edge.to);
      if (edge.to === serviceId) connected.add(edge.from);
    });
    
    return Array.from(connected);
  }

  /**
   * Analyze risk correlations
   * @param {Array} riskData - Risk score data
   */
  analyzeRiskCorrelations(riskData) {
    this.riskCorrelations = {
      fanInComplexity: this.calculateCorrelation(riskData, 'fanInOut', 'complexity'),
      depthCoupling: this.calculateCorrelation(riskData, 'depth', 'coupling'),
      complexityStability: this.calculateCorrelation(riskData, 'complexity', 'stability')
    };
  }

  /**
   * Calculate correlation between two risk categories
   * @param {Array} riskData - Risk data
   * @param {string} category1 - First category
   * @param {string} category2 - Second category
   * @returns {number} Correlation coefficient
   */
  calculateCorrelation(riskData, category1, category2) {
    const pairs = riskData.map(r => [
      r.categoryScores[category1] || 0,
      r.categoryScores[category2] || 0
    ]);
    
    if (pairs.length < 2) return 0;
    
    // Simple Pearson correlation
    const n = pairs.length;
    const sum1 = pairs.reduce((sum, pair) => sum + pair[0], 0);
    const sum2 = pairs.reduce((sum, pair) => sum + pair[1], 0);
    const sum1Sq = pairs.reduce((sum, pair) => sum + pair[0] * pair[0], 0);
    const sum2Sq = pairs.reduce((sum, pair) => sum + pair[1] * pair[1], 0);
    const pSum = pairs.reduce((sum, pair) => sum + pair[0] * pair[1], 0);
    
    const num = pSum - (sum1 * sum2 / n);
    const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
    
    return den === 0 ? 0 : num / den;
  }

  /**
   * Identify systemic risks
   * @param {Array} riskData - Risk score data
   */
  identifySystemicRisks(riskData) {
    const criticalServices = riskData.filter(r => r.riskLevel === 'critical').length;
    const highRiskServices = riskData.filter(r => r.riskLevel === 'high').length;
    const totalServices = riskData.length;
    
    this.systemicRisks = {
      criticalRatio: totalServices > 0 ? criticalServices / totalServices : 0,
      highRiskRatio: totalServices > 0 ? (criticalServices + highRiskServices) / totalServices : 0,
      cascadeRisk: this.calculateCascadeRisk(riskData),
      systemStability: this.calculateSystemStability(riskData)
    };
  }

  /**
   * Calculate cascade risk
   * @param {Array} riskData - Risk score data
   * @returns {string} Cascade risk level
   */
  calculateCascadeRisk(riskData) {
    const cascadeFactors = riskData.map(r => 
      r.factors.criticality?.cascadeFailureRisk || 0
    );
    
    const avgCascadeRisk = cascadeFactors.reduce((sum, r) => sum + r, 0) / cascadeFactors.length;
    
    if (avgCascadeRisk >= 7) return 'very_high';
    if (avgCascadeRisk >= 5) return 'high';
    if (avgCascadeRisk >= 3) return 'medium';
    return 'low';
  }

  /**
   * Calculate system stability
   * @param {Array} riskData - Risk score data
   * @returns {string} Stability level
   */
  calculateSystemStability(riskData) {
    const stabilityFactors = riskData.map(r => 
      r.factors.stability?.instabilityRisk || 0
    );
    
    const avgInstability = stabilityFactors.reduce((sum, r) => sum + r, 0) / stabilityFactors.length;
    
    if (avgInstability >= 7) return 'unstable';
    if (avgInstability >= 5) return 'moderately_unstable';
    if (avgInstability >= 3) return 'moderately_stable';
    return 'stable';
  }

  /**
   * Calculate statistics
   */
  calculateStatistics() {
    const riskData = Array.from(this.riskScores.values());
    
    this.statistics.totalServices = riskData.length;
    
    // Risk distribution
    riskData.forEach(risk => {
      this.statistics.riskDistribution[risk.riskLevel]++;
    });
    
    // Average and max scores
    if (riskData.length > 0) {
      this.statistics.averageRiskScore = riskData.reduce((sum, r) => sum + r.overallScore, 0) / riskData.length;
      this.statistics.maxRiskScore = Math.max(...riskData.map(r => r.overallScore));
    }
    
    // Round average
    this.statistics.averageRiskScore = Math.round(this.statistics.averageRiskScore * 100) / 100;
  }

  /**
   * Generate comprehensive risk report
   * @returns {Object} Complete risk analysis report
   */
  generateRiskReport() {
    return {
      metadata: {
        analyzedAt: new Date().toISOString(),
        version: '1.0.0',
        options: this.options
      },
      statistics: this.statistics,
      riskScores: this.convertRiskScoresToArray(),
      patterns: {
        highRiskClusters: this.highRiskClusters || [],
        riskCorrelations: this.riskCorrelations || {},
        systemicRisks: this.systemicRisks || {}
      },
      analysis: {
        topRiskServices: this.getTopRiskServices(),
        categoryAnalysis: this.getCategoryAnalysis(),
        mitigationPriorities: this.getMitigationPriorities(),
        riskTrends: this.analyzeRiskTrends()
      },
      recommendations: {
        immediate: this.getImmediateRiskRecommendations(),
        strategic: this.getStrategicRiskRecommendations(),
        monitoring: this.getRiskMonitoringRecommendations()
      }
    };
  }

  /**
   * Convert risk scores to array
   * @returns {Array} Risk scores array
   */
  convertRiskScoresToArray() {
    return Array.from(this.riskScores.values());
  }

  /**
   * Get top risk services
   * @returns {Array} Top risk services
   */
  getTopRiskServices() {
    return Array.from(this.riskScores.values())
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, 10)
      .map(risk => ({
        nodeId: risk.nodeId,
        overallScore: risk.overallScore,
        riskLevel: risk.riskLevel,
        topRiskFactors: this.getTopRiskFactors(risk.factors),
        mitigationPriority: risk.mitigationPriority
      }));
  }

  /**
   * Get top risk factors for a service
   * @param {Object} factors - Risk factors
   * @returns {Array} Top risk factors
   */
  getTopRiskFactors(factors) {
    const allFactors = [];
    
    Object.entries(factors).forEach(([category, categoryFactors]) => {
      Object.entries(categoryFactors).forEach(([factor, score]) => {
        if (typeof score === 'number' && score >= 5) {
          allFactors.push({
            category,
            factor,
            score
          });
        }
      });
    });
    
    return allFactors
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  /**
   * Get category analysis
   * @returns {Object} Category analysis
   */
  getCategoryAnalysis() {
    const riskData = Array.from(this.riskScores.values());
    const categories = ['fanInOut', 'complexity', 'depth', 'coupling', 'stability', 'criticality'];
    
    const analysis = {};
    
    categories.forEach(category => {
      const scores = riskData.map(r => r.categoryScores[category] || 0);
      
      analysis[category] = {
        average: scores.reduce((sum, s) => sum + s, 0) / scores.length,
        max: Math.max(...scores),
        servicesAboveThreshold: scores.filter(s => s >= 6).length
      };
      
      analysis[category].average = Math.round(analysis[category].average * 100) / 100;
    });
    
    return analysis;
  }

  /**
   * Get mitigation priorities
   * @returns {Array} Prioritized mitigation actions
   */
  getMitigationPriorities() {
    return Array.from(this.riskScores.values())
      .filter(risk => risk.mitigationPriority >= 7)
      .sort((a, b) => b.mitigationPriority - a.mitigationPriority)
      .slice(0, 10)
      .map(risk => ({
        nodeId: risk.nodeId,
        priority: risk.mitigationPriority,
        riskLevel: risk.riskLevel,
        topRecommendation: risk.recommendations[0]
      }));
  }

  /**
   * Analyze risk trends
   * @returns {Object} Risk trend analysis
   */
  analyzeRiskTrends() {
    // This would typically analyze historical data
    // For now, return current state analysis
    return {
      currentState: 'analysis_complete',
      riskProgression: 'stable',
      emergingRisks: this.identifyEmergingRisks()
    };
  }

  /**
   * Identify emerging risks
   * @returns {Array} Emerging risk factors
   */
  identifyEmergingRisks() {
    const risks = [];
    
    // High correlation between categories might indicate emerging systemic risk
    if (this.riskCorrelations?.fanInComplexity > 0.7) {
      risks.push({
        type: 'complexity_fan_in_correlation',
        description: 'High correlation between fan-in and complexity indicates architectural stress'
      });
    }
    
    if (this.systemicRisks?.criticalRatio > 0.2) {
      risks.push({
        type: 'critical_service_proliferation',
        description: 'High proportion of critical services indicates system brittleness'
      });
    }
    
    return risks;
  }

  /**
   * Get immediate risk recommendations
   * @returns {Array} Immediate recommendations
   */
  getImmediateRiskRecommendations() {
    const recommendations = [];
    
    const criticalServices = Array.from(this.riskScores.values())
      .filter(r => r.riskLevel === 'critical').length;
    
    if (criticalServices > 0) {
      recommendations.push({
        type: 'critical_services',
        priority: 'immediate',
        message: `${criticalServices} services have critical risk levels`,
        action: 'Implement immediate risk mitigation for critical services'
      });
    }
    
    return recommendations;
  }

  /**
   * Get strategic risk recommendations
   * @returns {Array} Strategic recommendations
   */
  getStrategicRiskRecommendations() {
    const recommendations = [];
    
    if (this.systemicRisks?.highRiskRatio > 0.3) {
      recommendations.push({
        type: 'systemic_risk',
        priority: 'strategic',
        message: 'High proportion of risky services indicates systemic issues',
        action: 'Consider architectural refactoring to reduce systemic risk'
      });
    }
    
    return recommendations;
  }

  /**
   * Get risk monitoring recommendations
   * @returns {Array} Monitoring recommendations
   */
  getRiskMonitoringRecommendations() {
    const recommendations = [];
    
    const highRiskServices = Array.from(this.riskScores.values())
      .filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical').length;
    
    if (highRiskServices > 0) {
      recommendations.push({
        type: 'risk_monitoring',
        priority: 'monitoring',
        message: `Monitor ${highRiskServices} high-risk services`,
        action: 'Set up enhanced monitoring for high-risk services'
      });
    }
    
    return recommendations;
  }
}

module.exports = RiskScoringEngine; 