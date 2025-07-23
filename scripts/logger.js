const fs = require('fs').promises;
const path = require('path');

/**
 * Logging System for API Analysis
 * Tracks parsing progress, errors, and performance metrics
 */
class Logger {
  constructor(options = {}) {
    this.options = {
      logLevel: options.logLevel || 'info', // debug, info, warn, error
      logToFile: options.logToFile !== false,
      logToConsole: options.logToConsole !== false,
      logDirectory: options.logDirectory || './logs',
      maxLogFiles: options.maxLogFiles || 10,
      maxLogSize: options.maxLogSize || 10 * 1024 * 1024, // 10MB
      sessionId: options.sessionId || this.generateSessionId(),
      includeTimestamp: options.includeTimestamp !== false,
      includeContext: options.includeContext !== false,
      ...options
    };

    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };

    this.session = {
      id: this.options.sessionId,
      startTime: new Date(),
      endTime: null,
      totalServices: 0,
      processedServices: 0,
      skippedServices: 0,
      errors: 0,
      warnings: 0,
      performance: {}
    };

    this.serviceProgress = new Map();
    this.currentLogFile = null;
    
    this.initializeLogging();
  }

  /**
   * Initialize logging system
   */
  async initializeLogging() {
    if (this.options.logToFile) {
      try {
        await fs.mkdir(this.options.logDirectory, { recursive: true });
        this.currentLogFile = path.join(
          this.options.logDirectory, 
          `api-analysis-${this.options.sessionId}.log`
        );
        await this.writeToFile(`=== API Analysis Session Started ===`);
        await this.writeToFile(`Session ID: ${this.options.sessionId}`);
        await this.writeToFile(`Start Time: ${this.session.startTime.toISOString()}`);
        await this.writeToFile(`Log Level: ${this.options.logLevel}`);
      } catch (error) {
        console.error('Failed to initialize log file:', error.message);
        this.options.logToFile = false;
      }
    }

    this.info('Logger initialized', 'system');
  }

  /**
   * Generate unique session ID
   * @returns {string} Session ID
   */
  generateSessionId() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}`;
  }

  /**
   * Log debug message
   * @param {string} message - Log message
   * @param {string} context - Context/component
   * @param {Object} data - Additional data
   */
  debug(message, context = 'general', data = null) {
    this.log('debug', message, context, data);
  }

  /**
   * Log info message
   * @param {string} message - Log message
   * @param {string} context - Context/component
   * @param {Object} data - Additional data
   */
  info(message, context = 'general', data = null) {
    this.log('info', message, context, data);
  }

  /**
   * Log warning message
   * @param {string} message - Log message
   * @param {string} context - Context/component
   * @param {Object} data - Additional data
   */
  warn(message, context = 'general', data = null) {
    this.log('warn', message, context, data);
    this.session.warnings++;
  }

  /**
   * Log error message
   * @param {string} message - Log message
   * @param {string} context - Context/component
   * @param {Object} data - Additional data
   */
  error(message, context = 'general', data = null) {
    this.log('error', message, context, data);
    this.session.errors++;
  }

  /**
   * Core logging method
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {string} context - Context/component
   * @param {Object} data - Additional data
   */
  log(level, message, context = 'general', data = null) {
    const levelNum = this.levels[level] || 1;
    const currentLevelNum = this.levels[this.options.logLevel] || 1;

    if (levelNum < currentLevelNum) return;

    const logEntry = this.formatLogEntry(level, message, context, data);

    if (this.options.logToConsole) {
      this.writeToConsole(logEntry, level);
    }

    if (this.options.logToFile && this.currentLogFile) {
      this.writeToFile(logEntry.formatted).catch(error => {
        console.error('Failed to write to log file:', error.message);
      });
    }
  }

  /**
   * Format log entry
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {string} context - Context
   * @param {Object} data - Additional data
   * @returns {Object} Formatted log entry
   */
  formatLogEntry(level, message, context, data) {
    const timestamp = new Date().toISOString();
    const pid = process.pid;
    
    const entry = {
      timestamp,
      level: level.toUpperCase(),
      context,
      message,
      data,
      sessionId: this.options.sessionId,
      pid
    };

    // Format for file output
    let formatted = '';
    if (this.options.includeTimestamp) {
      formatted += `${timestamp} `;
    }
    formatted += `[${level.toUpperCase()}]`;
    if (this.options.includeContext && context) {
      formatted += ` [${context}]`;
    }
    formatted += ` ${message}`;
    if (data) {
      formatted += ` | Data: ${JSON.stringify(data)}`;
    }

    entry.formatted = formatted;
    return entry;
  }

  /**
   * Write to console with appropriate formatting
   * @param {Object} logEntry - Log entry
   * @param {string} level - Log level
   */
  writeToConsole(logEntry, level) {
    const colors = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[37m',  // White
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m'  // Red
    };
    const reset = '\x1b[0m';
    const color = colors[level] || colors.info;

    console.log(`${color}${logEntry.formatted}${reset}`);
  }

  /**
   * Write to log file
   * @param {string} content - Content to write
   */
  async writeToFile(content) {
    if (!this.currentLogFile) return;

    try {
      await fs.appendFile(this.currentLogFile, content + '\n');
      
      // Check file size and rotate if necessary
      const stats = await fs.stat(this.currentLogFile);
      if (stats.size > this.options.maxLogSize) {
        await this.rotateLogFile();
      }
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  /**
   * Rotate log file when it gets too large
   */
  async rotateLogFile() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const archivedFile = this.currentLogFile.replace('.log', `-${timestamp}.log`);
      
      await fs.rename(this.currentLogFile, archivedFile);
      
      // Clean up old log files
      await this.cleanupOldLogs();
      
      this.info('Log file rotated', 'system', { archivedFile });
    } catch (error) {
      this.error('Failed to rotate log file', 'system', { error: error.message });
    }
  }

  /**
   * Clean up old log files
   */
  async cleanupOldLogs() {
    try {
      const files = await fs.readdir(this.options.logDirectory);
      const logFiles = files
        .filter(file => file.startsWith('api-analysis-') && file.endsWith('.log'))
        .map(file => ({
          name: file,
          path: path.join(this.options.logDirectory, file),
          stat: null
        }));

      // Get file stats
      for (const file of logFiles) {
        try {
          file.stat = await fs.stat(file.path);
        } catch (error) {
          // Skip files that can't be read
        }
      }

      // Sort by modification time (newest first)
      const validFiles = logFiles
        .filter(file => file.stat)
        .sort((a, b) => b.stat.mtime.getTime() - a.stat.mtime.getTime());

      // Remove excess files
      if (validFiles.length > this.options.maxLogFiles) {
        const filesToDelete = validFiles.slice(this.options.maxLogFiles);
        for (const file of filesToDelete) {
          await fs.unlink(file.path);
          this.debug('Deleted old log file', 'system', { file: file.name });
        }
      }
    } catch (error) {
      this.error('Failed to cleanup old logs', 'system', { error: error.message });
    }
  }

  /**
   * Start service processing
   * @param {string} serviceName - Name of service
   * @param {Object} metadata - Service metadata
   */
  startService(serviceName, metadata = {}) {
    const progress = {
      name: serviceName,
      startTime: new Date(),
      endTime: null,
      status: 'processing',
      steps: [],
      errors: [],
      warnings: [],
      metadata
    };

    this.serviceProgress.set(serviceName, progress);
    this.info(`Started processing service: ${serviceName}`, 'service', metadata);
  }

  /**
   * Log service step completion
   * @param {string} serviceName - Name of service
   * @param {string} step - Step name
   * @param {Object} result - Step result
   */
  serviceStep(serviceName, step, result = {}) {
    const progress = this.serviceProgress.get(serviceName);
    if (progress) {
      progress.steps.push({
        name: step,
        timestamp: new Date(),
        result,
        success: !result.error
      });

      if (result.error) {
        progress.errors.push(result.error);
        this.error(`Service ${serviceName} - ${step} failed`, 'service', result);
      } else {
        this.debug(`Service ${serviceName} - ${step} completed`, 'service', result);
      }
    }
  }

  /**
   * Complete service processing
   * @param {string} serviceName - Name of service
   * @param {Object} result - Final result
   */
  completeService(serviceName, result = {}) {
    const progress = this.serviceProgress.get(serviceName);
    if (progress) {
      progress.endTime = new Date();
      progress.status = result.success ? 'completed' : 'failed';
      progress.duration = progress.endTime - progress.startTime;

      this.session.processedServices++;
      
      if (result.success) {
        this.info(`Completed service: ${serviceName}`, 'service', {
          duration: progress.duration,
          steps: progress.steps.length,
          errors: progress.errors.length
        });
      } else {
        this.error(`Failed to process service: ${serviceName}`, 'service', result);
      }
    }
  }

  /**
   * Skip service processing
   * @param {string} serviceName - Name of service
   * @param {string} reason - Reason for skipping
   */
  skipService(serviceName, reason = 'Unknown') {
    this.session.skippedServices++;
    this.warn(`Skipped service: ${serviceName}`, 'service', { reason });
  }

  /**
   * Log performance metrics
   * @param {string} operation - Operation name
   * @param {number} duration - Duration in milliseconds
   * @param {Object} metadata - Additional metadata
   */
  performance(operation, duration, metadata = {}) {
    if (!this.session.performance[operation]) {
      this.session.performance[operation] = {
        count: 0,
        totalTime: 0,
        avgTime: 0,
        minTime: Infinity,
        maxTime: 0
      };
    }

    const perf = this.session.performance[operation];
    perf.count++;
    perf.totalTime += duration;
    perf.avgTime = perf.totalTime / perf.count;
    perf.minTime = Math.min(perf.minTime, duration);
    perf.maxTime = Math.max(perf.maxTime, duration);

    this.debug(`Performance: ${operation} took ${duration}ms`, 'performance', {
      operation,
      duration,
      average: Math.round(perf.avgTime),
      ...metadata
    });
  }

  /**
   * Set total services count
   * @param {number} total - Total number of services
   */
  setTotalServices(total) {
    this.session.totalServices = total;
    this.info(`Processing ${total} services`, 'session');
  }

  /**
   * Get current progress summary
   * @returns {Object} Progress summary
   */
  getProgress() {
    const progress = {
      session: {
        id: this.session.id,
        startTime: this.session.startTime,
        duration: new Date() - this.session.startTime,
        totalServices: this.session.totalServices,
        processedServices: this.session.processedServices,
        skippedServices: this.session.skippedServices,
        remainingServices: this.session.totalServices - this.session.processedServices - this.session.skippedServices,
        completionPercentage: this.session.totalServices > 0 
          ? Math.round((this.session.processedServices / this.session.totalServices) * 100) 
          : 0,
        errors: this.session.errors,
        warnings: this.session.warnings
      },
      services: Array.from(this.serviceProgress.values()),
      performance: this.session.performance
    };

    return progress;
  }

  /**
   * End logging session
   */
  async endSession() {
    this.session.endTime = new Date();
    const duration = this.session.endTime - this.session.startTime;

    this.info('Analysis session completed', 'session', {
      duration,
      totalServices: this.session.totalServices,
      processedServices: this.session.processedServices,
      skippedServices: this.session.skippedServices,
      errors: this.session.errors,
      warnings: this.session.warnings
    });

    if (this.options.logToFile && this.currentLogFile) {
      await this.writeToFile(`=== API Analysis Session Ended ===`);
      await this.writeToFile(`End Time: ${this.session.endTime.toISOString()}`);
      await this.writeToFile(`Duration: ${duration}ms`);
      await this.writeToFile(`Services Processed: ${this.session.processedServices}/${this.session.totalServices}`);
      await this.writeToFile(`Errors: ${this.session.errors}, Warnings: ${this.session.warnings}`);
    }
  }

  /**
   * Generate detailed report
   * @returns {string} Formatted report
   */
  generateReport() {
    const progress = this.getProgress();
    
    let report = `\n=== API Analysis Progress Report ===\n`;
    report += `Session ID: ${progress.session.id}\n`;
    report += `Start Time: ${progress.session.startTime.toISOString()}\n`;
    report += `Duration: ${Math.round(progress.session.duration / 1000)}s\n`;
    report += `Progress: ${progress.session.processedServices}/${progress.session.totalServices} services (${progress.session.completionPercentage}%)\n`;
    report += `Skipped: ${progress.session.skippedServices}\n`;
    report += `Errors: ${progress.session.errors}\n`;
    report += `Warnings: ${progress.session.warnings}\n`;

    if (Object.keys(progress.performance).length > 0) {
      report += `\nPerformance Metrics:\n`;
      Object.entries(progress.performance).forEach(([operation, metrics]) => {
        report += `  ${operation}: ${metrics.count} ops, avg ${Math.round(metrics.avgTime)}ms\n`;
      });
    }

    if (progress.services.length > 0) {
      report += `\nService Status:\n`;
      progress.services.forEach(service => {
        const status = service.status === 'completed' ? '✓' : 
                      service.status === 'failed' ? '✗' : '⏳';
        const duration = service.duration ? `(${Math.round(service.duration)}ms)` : '';
        report += `  ${status} ${service.name} ${duration}\n`;
      });
    }

    return report;
  }
}

module.exports = Logger;

// CLI execution for testing
if (require.main === module) {
  const logger = new Logger({ 
    logLevel: 'debug',
    logToFile: true,
    logDirectory: './test-logs'
  });

  // Test logging functionality
  logger.info('Testing logger functionality', 'test');
  
  // Simulate service processing
  logger.setTotalServices(3);
  
  ['service-1', 'service-2', 'service-3'].forEach((service, index) => {
    setTimeout(() => {
      logger.startService(service, { framework: 'Express.js' });
      
      setTimeout(() => {
        logger.serviceStep(service, 'parse-markdown', { endpoints: 5 });
        logger.serviceStep(service, 'parse-json', { dependencies: 3 });
        
        setTimeout(() => {
          logger.completeService(service, { success: true });
          logger.performance('service-processing', 1000 + Math.random() * 2000);
          
          if (index === 2) {
            setTimeout(() => {
              console.log(logger.generateReport());
              logger.endSession();
            }, 100);
          }
        }, 200);
      }, 100);
    }, index * 300);
  });
} 