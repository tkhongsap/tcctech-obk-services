const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { logger } = require('./logger');

/**
 * Cache Manager for API Analysis
 * Provides file-based caching to avoid re-parsing unchanged files
 */
class CacheManager {
  constructor(options = {}) {
    this.cacheDir = options.cacheDir || '.cache';
    this.enabled = options.enabled !== false;
    this.maxAge = options.maxAge || 24 * 60 * 60 * 1000; // 24 hours
    this.logger = logger.forService('CacheManager');
  }

  /**
   * Get cached parse result for a file
   * @param {string} filePath - Path to the file
   * @returns {Promise<Object|null>} Cached result or null if not found/expired
   */
  async get(filePath) {
    if (!this.enabled) return null;

    try {
      const cacheKey = await this.generateCacheKey(filePath);
      const cachePath = path.join(this.cacheDir, `${cacheKey}.json`);

      // Check if cache file exists
      const cacheExists = await this.fileExists(cachePath);
      if (!cacheExists) {
        this.logger.debug('Cache miss - file not found', { filePath, cacheKey });
        return null;
      }

      // Load cache metadata and content
      const cacheData = JSON.parse(await fs.readFile(cachePath, 'utf8'));
      
      // Check if cache is expired
      if (Date.now() - cacheData.timestamp > this.maxAge) {
        this.logger.debug('Cache miss - expired', { filePath, cacheKey });
        await this.delete(cacheKey);
        return null;
      }

      // Check if source file has been modified
      const sourceStats = await fs.stat(filePath);
      if (sourceStats.mtime.getTime() > cacheData.sourceModified) {
        this.logger.debug('Cache miss - source modified', { filePath, cacheKey });
        await this.delete(cacheKey);
        return null;
      }

      this.logger.debug('Cache hit', { filePath, cacheKey });
      return cacheData.content;

    } catch (error) {
      this.logger.warn('Cache retrieval failed', { filePath }, error);
      return null;
    }
  }

  /**
   * Store parse result in cache
   * @param {string} filePath - Path to the source file
   * @param {Object} content - Parsed content to cache
   * @returns {Promise<void>}
   */
  async set(filePath, content) {
    if (!this.enabled) return;

    try {
      await this.ensureCacheDir();
      
      const cacheKey = await this.generateCacheKey(filePath);
      const cachePath = path.join(this.cacheDir, `${cacheKey}.json`);

      // Get source file metadata
      const sourceStats = await fs.stat(filePath);
      
      const cacheData = {
        filePath,
        cacheKey,
        timestamp: Date.now(),
        sourceModified: sourceStats.mtime.getTime(),
        sourceSize: sourceStats.size,
        content
      };

      await fs.writeFile(cachePath, JSON.stringify(cacheData, null, 2));
      this.logger.debug('Content cached', { filePath, cacheKey });

    } catch (error) {
      this.logger.warn('Cache storage failed', { filePath }, error);
    }
  }

  /**
   * Delete cache entry
   * @param {string} cacheKey - Cache key to delete
   * @returns {Promise<void>}
   */
  async delete(cacheKey) {
    try {
      const cachePath = path.join(this.cacheDir, `${cacheKey}.json`);
      await fs.unlink(cachePath);
      this.logger.debug('Cache entry deleted', { cacheKey });
    } catch (error) {
      // Ignore errors for non-existent files
      if (error.code !== 'ENOENT') {
        this.logger.warn('Cache deletion failed', { cacheKey }, error);
      }
    }
  }

  /**
   * Clear entire cache
   * @returns {Promise<void>}
   */
  async clear() {
    try {
      const cacheExists = await this.fileExists(this.cacheDir);
      if (!cacheExists) return;

      const files = await fs.readdir(this.cacheDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      await Promise.all(
        jsonFiles.map(file => fs.unlink(path.join(this.cacheDir, file)))
      );

      this.logger.info('Cache cleared', { deletedFiles: jsonFiles.length });
    } catch (error) {
      this.logger.error('Cache clear failed', {}, error);
    }
  }

  /**
   * Get cache statistics
   * @returns {Promise<Object>} Cache statistics
   */
  async getStats() {
    try {
      const cacheExists = await this.fileExists(this.cacheDir);
      if (!cacheExists) {
        return {
          enabled: this.enabled,
          entries: 0,
          totalSize: 0,
          oldestEntry: null,
          newestEntry: null
        };
      }

      const files = await fs.readdir(this.cacheDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      let totalSize = 0;
      let oldestEntry = null;
      let newestEntry = null;

      for (const file of jsonFiles) {
        const filePath = path.join(this.cacheDir, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;

        if (!oldestEntry || stats.mtime < oldestEntry) {
          oldestEntry = stats.mtime;
        }
        if (!newestEntry || stats.mtime > newestEntry) {
          newestEntry = stats.mtime;
        }
      }

      return {
        enabled: this.enabled,
        entries: jsonFiles.length,
        totalSize,
        totalSizeFormatted: this.formatBytes(totalSize),
        oldestEntry,
        newestEntry,
        maxAge: this.maxAge,
        maxAgeFormatted: this.formatDuration(this.maxAge)
      };

    } catch (error) {
      this.logger.error('Failed to get cache stats', {}, error);
      return {
        enabled: this.enabled,
        entries: 0,
        totalSize: 0,
        error: error.message
      };
    }
  }

  /**
   * Clean expired cache entries
   * @returns {Promise<void>}
   */
  async cleanup() {
    try {
      const cacheExists = await this.fileExists(this.cacheDir);
      if (!cacheExists) return;

      const files = await fs.readdir(this.cacheDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      let deletedCount = 0;
      const now = Date.now();

      for (const file of jsonFiles) {
        try {
          const filePath = path.join(this.cacheDir, file);
          const cacheData = JSON.parse(await fs.readFile(filePath, 'utf8'));
          
          if (now - cacheData.timestamp > this.maxAge) {
            await fs.unlink(filePath);
            deletedCount++;
          }
        } catch (error) {
          // Delete corrupted cache files
          await fs.unlink(path.join(this.cacheDir, file));
          deletedCount++;
        }
      }

      if (deletedCount > 0) {
        this.logger.info('Cache cleanup completed', { deletedEntries: deletedCount });
      }

    } catch (error) {
      this.logger.error('Cache cleanup failed', {}, error);
    }
  }

  /**
   * Generate cache key for a file
   * @private
   * @param {string} filePath - File path
   * @returns {Promise<string>} Cache key
   */
  async generateCacheKey(filePath) {
    const stats = await fs.stat(filePath);
    const input = `${filePath}:${stats.mtime.getTime()}:${stats.size}`;
    return crypto.createHash('md5').update(input).digest('hex');
  }

  /**
   * Check if file exists
   * @private
   * @param {string} filePath - File path to check
   * @returns {Promise<boolean>} True if file exists
   */
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Ensure cache directory exists
   * @private
   * @returns {Promise<void>}
   */
  async ensureCacheDir() {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  /**
   * Format bytes to human readable string
   * @private
   * @param {number} bytes - Bytes to format
   * @returns {string} Formatted string
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Format duration to human readable string
   * @private
   * @param {number} ms - Milliseconds to format
   * @returns {string} Formatted string
   */
  formatDuration(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    if (hours >= 24) {
      return `${Math.floor(hours / 24)} days`;
    } else if (hours > 0) {
      return `${hours} hours`;
    } else {
      return `${Math.floor(ms / (1000 * 60))} minutes`;
    }
  }
}

module.exports = CacheManager; 