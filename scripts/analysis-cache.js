/**
 * Analysis Cache Manager
 * Manages caching of processed analysis results for performance optimization
 */
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class AnalysisCache {
  constructor(options = {}) {
    this.options = {
      cacheDirectory: options.cacheDirectory || './cache',
      enableCache: options.enableCache !== false,
      maxCacheAge: options.maxCacheAge || 24 * 60 * 60 * 1000, // 24 hours in ms
      maxCacheSize: options.maxCacheSize || 100 * 1024 * 1024, // 100MB
      compressionLevel: options.compressionLevel || 6,
      enableCompression: options.enableCompression !== false,
      ...options
    };

    this.cacheStats = {
      hits: 0,
      misses: 0,
      writes: 0,
      deletes: 0,
      errors: 0
    };

    this.initialized = false;
  }

  /**
   * Initialize cache directory and metadata
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.initialized || !this.options.enableCache) {
      return;
    }

    try {
      // Ensure cache directory exists
      await fs.mkdir(this.options.cacheDirectory, { recursive: true });

      // Load or create cache metadata
      await this.loadCacheMetadata();

      // Clean expired entries
      await this.cleanExpiredEntries();

      this.initialized = true;
    } catch (error) {
      this.cacheStats.errors++;
      console.warn('Failed to initialize cache:', error.message);
    }
  }

  /**
   * Load cache metadata
   * @returns {Promise<void>}
   */
  async loadCacheMetadata() {
    const metadataPath = path.join(this.options.cacheDirectory, 'metadata.json');
    
    try {
      const metadataContent = await fs.readFile(metadataPath, 'utf8');
      this.metadata = JSON.parse(metadataContent);
    } catch (error) {
      // Initialize new metadata
      this.metadata = {
        version: '1.0.0',
        created: new Date().toISOString(),
        entries: {},
        totalSize: 0
      };
    }
  }

  /**
   * Save cache metadata
   * @returns {Promise<void>}
   */
  async saveCacheMetadata() {
    const metadataPath = path.join(this.options.cacheDirectory, 'metadata.json');
    
    try {
      await fs.writeFile(metadataPath, JSON.stringify(this.metadata, null, 2));
    } catch (error) {
      this.cacheStats.errors++;
      console.warn('Failed to save cache metadata:', error.message);
    }
  }

  /**
   * Generate cache key for given data
   * @param {string} type - Cache entry type
   * @param {Object} data - Data to generate key for
   * @param {Object} options - Additional options
   * @returns {string} Cache key
   */
  generateCacheKey(type, data, options = {}) {
    const keyData = {
      type,
      data: this.normalizeDataForKey(data),
      options: this.normalizeDataForKey(options),
      version: '1.0.0'
    };

    const keyString = JSON.stringify(keyData);
    return crypto.createHash('sha256').update(keyString).digest('hex');
  }

  /**
   * Normalize data for consistent key generation
   * @param {any} data - Data to normalize
   * @returns {any} Normalized data
   */
  normalizeDataForKey(data) {
    if (data === null || data === undefined) {
      return null;
    }

    if (typeof data === 'object') {
      if (Array.isArray(data)) {
        return data.map(item => this.normalizeDataForKey(item)).sort();
      } else {
        const normalized = {};
        Object.keys(data)
          .sort()
          .forEach(key => {
            // Skip non-deterministic fields
            if (!['timestamp', 'analyzedAt', 'lastModified', 'processedAt'].includes(key)) {
              normalized[key] = this.normalizeDataForKey(data[key]);
            }
          });
        return normalized;
      }
    }

    return data;
  }

  /**
   * Get cached analysis result
   * @param {string} type - Analysis type
   * @param {Object} input - Input data
   * @param {Object} options - Cache options
   * @returns {Promise<Object|null>} Cached result or null
   */
  async get(type, input, options = {}) {
    if (!this.options.enableCache) {
      return null;
    }

    await this.initialize();

    try {
      const cacheKey = this.generateCacheKey(type, input, options);
      const entry = this.metadata.entries[cacheKey];

      if (!entry) {
        this.cacheStats.misses++;
        return null;
      }

      // Check if entry is expired
      const now = Date.now();
      const entryAge = now - new Date(entry.created).getTime();
      
      if (entryAge > this.options.maxCacheAge) {
        await this.delete(cacheKey);
        this.cacheStats.misses++;
        return null;
      }

      // Read cached data
      const cachedData = await this.readCachedData(cacheKey, entry);
      
      if (cachedData) {
        this.cacheStats.hits++;
        
        // Update access time
        entry.lastAccessed = new Date().toISOString();
        await this.saveCacheMetadata();
        
        return cachedData;
      } else {
        this.cacheStats.misses++;
        return null;
      }

    } catch (error) {
      this.cacheStats.errors++;
      console.warn('Cache get error:', error.message);
      return null;
    }
  }

  /**
   * Store analysis result in cache
   * @param {string} type - Analysis type
   * @param {Object} input - Input data
   * @param {Object} result - Analysis result
   * @param {Object} options - Cache options
   * @returns {Promise<boolean>} Success status
   */
  async set(type, input, result, options = {}) {
    if (!this.options.enableCache) {
      return false;
    }

    await this.initialize();

    try {
      const cacheKey = this.generateCacheKey(type, input, options);
      
      // Check cache size limits
      await this.ensureCacheSpace();

      // Prepare cache entry
      const entry = {
        type,
        created: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        size: 0,
        compressed: this.options.enableCompression,
        options
      };

      // Write cached data
      const success = await this.writeCachedData(cacheKey, result, entry);
      
      if (success) {
        this.metadata.entries[cacheKey] = entry;
        this.metadata.totalSize += entry.size;
        
        await this.saveCacheMetadata();
        this.cacheStats.writes++;
        
        return true;
      }

      return false;

    } catch (error) {
      this.cacheStats.errors++;
      console.warn('Cache set error:', error.message);
      return false;
    }
  }

  /**
   * Read cached data from file
   * @param {string} cacheKey - Cache key
   * @param {Object} entry - Cache entry metadata
   * @returns {Promise<Object|null>} Cached data
   */
  async readCachedData(cacheKey, entry) {
    const filePath = path.join(this.options.cacheDirectory, `${cacheKey}.json`);
    
    try {
      let content = await fs.readFile(filePath, 'utf8');
      
      if (entry.compressed) {
        content = await this.decompressData(content);
      }

      return JSON.parse(content);

    } catch (error) {
      // File might be corrupted or missing
      await this.delete(cacheKey);
      return null;
    }
  }

  /**
   * Write data to cache file
   * @param {string} cacheKey - Cache key
   * @param {Object} data - Data to cache
   * @param {Object} entry - Cache entry metadata
   * @returns {Promise<boolean>} Success status
   */
  async writeCachedData(cacheKey, data, entry) {
    const filePath = path.join(this.options.cacheDirectory, `${cacheKey}.json`);
    
    try {
      let content = JSON.stringify(data);
      
      if (entry.compressed) {
        content = await this.compressData(content);
      }

      await fs.writeFile(filePath, content, 'utf8');
      
      // Update entry size
      const stats = await fs.stat(filePath);
      entry.size = stats.size;
      
      return true;

    } catch (error) {
      console.warn('Failed to write cache file:', error.message);
      return false;
    }
  }

  /**
   * Compress data string
   * @param {string} data - Data to compress
   * @returns {Promise<string>} Compressed data
   */
  async compressData(data) {
    const zlib = require('zlib');
    const util = require('util');
    const gzip = util.promisify(zlib.gzip);
    
    const compressed = await gzip(Buffer.from(data, 'utf8'), {
      level: this.options.compressionLevel
    });
    
    return compressed.toString('base64');
  }

  /**
   * Decompress data string
   * @param {string} compressedData - Compressed data
   * @returns {Promise<string>} Decompressed data
   */
  async decompressData(compressedData) {
    const zlib = require('zlib');
    const util = require('util');
    const gunzip = util.promisify(zlib.gunzip);
    
    const buffer = Buffer.from(compressedData, 'base64');
    const decompressed = await gunzip(buffer);
    
    return decompressed.toString('utf8');
  }

  /**
   * Delete cache entry
   * @param {string} cacheKey - Cache key to delete
   * @returns {Promise<boolean>} Success status
   */
  async delete(cacheKey) {
    try {
      const entry = this.metadata.entries[cacheKey];
      
      if (entry) {
        const filePath = path.join(this.options.cacheDirectory, `${cacheKey}.json`);
        
        try {
          await fs.unlink(filePath);
        } catch (error) {
          // File might already be deleted
        }

        this.metadata.totalSize -= entry.size;
        delete this.metadata.entries[cacheKey];
        
        await this.saveCacheMetadata();
        this.cacheStats.deletes++;
        
        return true;
      }

      return false;

    } catch (error) {
      this.cacheStats.errors++;
      return false;
    }
  }

  /**
   * Clean expired cache entries
   * @returns {Promise<number>} Number of cleaned entries
   */
  async cleanExpiredEntries() {
    const now = Date.now();
    const expiredKeys = [];

    for (const [key, entry] of Object.entries(this.metadata.entries)) {
      const entryAge = now - new Date(entry.created).getTime();
      
      if (entryAge > this.options.maxCacheAge) {
        expiredKeys.push(key);
      }
    }

    // Delete expired entries
    for (const key of expiredKeys) {
      await this.delete(key);
    }

    return expiredKeys.length;
  }

  /**
   * Ensure cache doesn't exceed size limits
   * @returns {Promise<void>}
   */
  async ensureCacheSpace() {
    if (this.metadata.totalSize <= this.options.maxCacheSize) {
      return;
    }

    // Get entries sorted by last access time (LRU)
    const entries = Object.entries(this.metadata.entries)
      .map(([key, entry]) => ({ key, ...entry }))
      .sort((a, b) => new Date(a.lastAccessed) - new Date(b.lastAccessed));

    // Remove oldest entries until under size limit
    for (const entry of entries) {
      if (this.metadata.totalSize <= this.options.maxCacheSize * 0.8) { // 80% of limit
        break;
      }
      
      await this.delete(entry.key);
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStatistics() {
    const hitRate = this.cacheStats.hits + this.cacheStats.misses > 0
      ? Math.round((this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses)) * 100)
      : 0;

    return {
      ...this.cacheStats,
      hitRate: `${hitRate}%`,
      totalEntries: Object.keys(this.metadata?.entries || {}).length,
      totalSize: this.formatBytes(this.metadata?.totalSize || 0),
      sizeLimit: this.formatBytes(this.options.maxCacheSize),
      ageLimit: this.formatDuration(this.options.maxCacheAge)
    };
  }

  /**
   * Format bytes to human readable format
   * @param {number} bytes - Bytes count
   * @returns {string} Formatted string
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * Format duration to human readable format
   * @param {number} ms - Duration in milliseconds
   * @returns {string} Formatted string
   */
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `${seconds} second${seconds > 1 ? 's' : ''}`;
  }

  /**
   * Clear all cache entries
   * @returns {Promise<boolean>} Success status
   */
  async clear() {
    try {
      const entries = Object.keys(this.metadata?.entries || {});
      
      for (const key of entries) {
        await this.delete(key);
      }

      return true;

    } catch (error) {
      this.cacheStats.errors++;
      return false;
    }
  }

  /**
   * Get cache entry information
   * @param {string} type - Analysis type
   * @param {Object} input - Input data
   * @param {Object} options - Cache options
   * @returns {Promise<Object|null>} Entry info or null
   */
  async getEntryInfo(type, input, options = {}) {
    const cacheKey = this.generateCacheKey(type, input, options);
    const entry = this.metadata?.entries?.[cacheKey];

    if (!entry) {
      return null;
    }

    return {
      key: cacheKey,
      type: entry.type,
      created: entry.created,
      lastAccessed: entry.lastAccessed,
      size: this.formatBytes(entry.size),
      compressed: entry.compressed,
      age: this.formatDuration(Date.now() - new Date(entry.created).getTime())
    };
  }

  /**
   * Cache wrapper for analysis functions
   * @param {string} type - Analysis type
   * @param {Object} input - Input data
   * @param {Function} analysisFunction - Function to execute if cache miss
   * @param {Object} options - Cache options
   * @returns {Promise<Object>} Analysis result
   */
  async cached(type, input, analysisFunction, options = {}) {
    // Try to get from cache first
    const cachedResult = await this.get(type, input, options);
    
    if (cachedResult) {
      return {
        ...cachedResult,
        metadata: {
          ...cachedResult.metadata,
          fromCache: true,
          cacheHit: true
        }
      };
    }

    // Execute analysis function
    const result = await analysisFunction();
    
    // Cache the result
    await this.set(type, input, result, options);
    
    return {
      ...result,
      metadata: {
        ...result.metadata,
        fromCache: false,
        cacheHit: false
      }
    };
  }

  /**
   * Invalidate cache entries by pattern
   * @param {string} pattern - Pattern to match (simple string matching)
   * @returns {Promise<number>} Number of invalidated entries
   */
  async invalidateByPattern(pattern) {
    const matchingKeys = Object.keys(this.metadata?.entries || {})
      .filter(key => key.includes(pattern));

    for (const key of matchingKeys) {
      await this.delete(key);
    }

    return matchingKeys.length;
  }

  /**
   * Invalidate cache entries by type
   * @param {string} type - Analysis type
   * @returns {Promise<number>} Number of invalidated entries
   */
  async invalidateByType(type) {
    const matchingKeys = Object.entries(this.metadata?.entries || {})
      .filter(([key, entry]) => entry.type === type)
      .map(([key]) => key);

    for (const key of matchingKeys) {
      await this.delete(key);
    }

    return matchingKeys.length;
  }

  /**
   * Export cache configuration and statistics
   * @returns {Object} Cache information
   */
  exportInfo() {
    return {
      configuration: {
        enabled: this.options.enableCache,
        directory: this.options.cacheDirectory,
        maxAge: this.formatDuration(this.options.maxCacheAge),
        maxSize: this.formatBytes(this.options.maxCacheSize),
        compression: this.options.enableCompression
      },
      statistics: this.getStatistics(),
      entries: Object.entries(this.metadata?.entries || {}).map(([key, entry]) => ({
        key: key.substring(0, 8) + '...', // Truncated key
        type: entry.type,
        created: entry.created,
        size: this.formatBytes(entry.size),
        compressed: entry.compressed
      }))
    };
  }
}

// Factory function for creating cached analysis functions
function createCachedAnalyzer(cacheManager, analysisType) {
  return async function(input, analysisFunction, options = {}) {
    return await cacheManager.cached(analysisType, input, analysisFunction, options);
  };
}

module.exports = {
  AnalysisCache,
  createCachedAnalyzer
}; 