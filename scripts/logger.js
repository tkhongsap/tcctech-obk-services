const fs = require('fs').promises;
const path = require('path');

/**
 * Logger utility for API Analysis
 * Provides structured logging with different levels and file output
 */
class Logger {
  constructor(options = {}) {
    this.level = options.level || 'info';
    this.outputDir = options.outputDir || 'output';
    this.logFile = options.logFile || 'api-analysis.log';
    this.enableConsole = options.enableConsole !== false;
    this.enableFile = options.enableFile !== false;
    
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };

    this.currentLevel = this.levels[this.level] || this.levels.info;
    this.logs = [];
    this.startTime = new Date();
    
    this.ensureOutputDirectory();
  }

  /**
   * Ensure output directory exists
   */
  async ensureOutputDirectory() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      // Directory already exists or other error - continue silently
    }
  }

  /**
   * Log an error message
   */
  error(message, context = {}, error = null) {
    this.log('error', message, context, error);
  }

  /**
   * Log a warning message
   */
  warn(message, context = {}) {
    this.log('warn', message, context);
  }

  /**
   * Log an info message
   */
  info(message, context = {}) {
    this.log('info', message, context);
  }

  /**
   * Log a debug message
   */
  debug(message, context = {}) {
    this.log('debug', message, context);
  }

  /**
   * Core logging method
   */
  log(level, message, context = {}, error = null) {
    const levelNum = this.levels[level] || this.levels.info;
    
    if (levelNum > this.currentLevel) {
      return; // Skip if level is not enabled
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      context,
      ...(error && { 
        error: {
          message: error.message,
          stack: error.stack,
          code: error.code
        }
      })
    };

    this.logs.push(logEntry);

    if (this.enableConsole) {
      this.writeToConsole(logEntry);
    }

    if (this.enableFile) {
      this.writeToFile(logEntry);
    }
  }

  /**
   * Write log entry to console
   */
  writeToConsole(logEntry) {
    const timestamp = logEntry.timestamp.substring(11, 19); // HH:MM:SS
    const level = logEntry.level.padEnd(5);
    const contextStr = Object.keys(logEntry.context).length > 0 
      ? ` ${JSON.stringify(logEntry.context)}` 
      : '';
    
    const message = `${timestamp} [${level}] ${logEntry.message}${contextStr}`;
    
    switch (logEntry.level) {
      case 'ERROR':
        console.error(message);
        if (logEntry.error && logEntry.error.stack) {
          console.error(logEntry.error.stack);
        }
        break;
      case 'WARN':
        console.warn(message);
        break;
      case 'DEBUG':
        console.debug(message);
        break;
      default:
        console.log(message);
    }
  }

  /**
   * Write log entry to file (async)
   */
  async writeToFile(logEntry) {
    try {
      const logLine = JSON.stringify(logEntry) + '\n';
      const logPath = path.join(this.outputDir, this.logFile);
      await fs.appendFile(logPath, logLine);
    } catch (error) {
      // Fallback to console if file write fails
      console.error('Failed to write to log file:', error.message);
    }
  }

  /**
   * Start a timing operation
   */
  startTimer(operation) {
    const startTime = Date.now();
    this.debug(`Starting operation: ${operation}`);
    
    return (result = 'completed') => {
      const duration = Date.now() - startTime;
      this.info(`Operation ${operation} ${result}`, { duration: `${duration}ms` });
      return duration;
    };
  }

  /**
   * Create a service-specific logger
   */
  forService(serviceName) {
    return {
      error: (message, context = {}, error = null) => 
        this.error(message, { service: serviceName, ...context }, error),
      warn: (message, context = {}) => 
        this.warn(message, { service: serviceName, ...context }),
      info: (message, context = {}) => 
        this.info(message, { service: serviceName, ...context }),
      debug: (message, context = {}) => 
        this.debug(message, { service: serviceName, ...context }),
      startTimer: (operation) => 
        this.startTimer(`${serviceName}:${operation}`)
    };
  }
}

// Create default logger instance
const defaultLogger = new Logger();

module.exports = {
  Logger,
  logger: defaultLogger
}; 