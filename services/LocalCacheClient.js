/**
 * Digital Health Pass 
 *
 * (c) Copyright Merative US L.P. and others 2020-2022 
 *
 * SPDX-Licence-Identifier: Apache 2.0
 */

const NodeCache = require('node-cache');

const { CacheClient } = require('./CacheClient');

const DEFAULT_OPTIONS = {};

class LocalCacheClient extends CacheClient {
    constructor(options = {}) {
        super(options.logger);
        this.options = { ...DEFAULT_OPTIONS, ...options };

        this.cache = new NodeCache({
            stdTTL: this.options.defaultTtl || 360,
        });

        // subscribe to cache events
        this.cache.on('expired', (key, value) => {
            this.logger.info(`Cache entry expired: ${JSON.stringify({ key, value })}`);
        });

        this.cache.on('del', (key, value) => {
            this.logger.info(`Cache entry deleted: ${JSON.stringify({ key, value })}`);
        });

        this.cache.on('flush', () => {
            this.logger.info('Cache cleared');
        });
    }

    get(key) {
        this.logger.info(`Getting cache entry for key ${key}`);
        return Promise.resolve(this.cache.get(key));
    }

    set(key, value, ttl) {
        this.logger.info(`Setting cache entry for key ${key}`);
        return Promise.resolve(this.cache.set(key, value, ttl));
    }

    delete(key) {
        this.logger.info(`Deleting cache entry for key ${key}`);
        return Promise.resolve(this.cache.take(key));
    }

    clear() {
        this.logger.info('Clearing cache');
        return Promise.resolve(this.cache.flushAll());
    }
}

module.exports = { LocalCacheClient };
