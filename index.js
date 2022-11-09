/**
 * Digital Health Pass 
 *
 * (c) Copyright Merative US L.P. and others 2020-2022 
 *
 * SPDX-Licence-Identifier: Apache 2.0
 */

const { Logger } = require('dhp-logging-lib');
const uuid = require('uuid');

const { LocalCacheClient } = require('./services/LocalCacheClient');
const { ReplicatedCacheClient } = require('./services/ReplicatedCacheClient');

const CACHE_TYPES = {
    LOCAL: 'local',
    REPLICATED: 'replicated',
};

const DEFAULT_OPTIONS = {
    name: 'default',
    type: CACHE_TYPES.LOCAL,
    default_ttl: 3600, // keeping for backward compatibility
    defaultTtl: 3600,
};

const createLocalCacheClient = (options = DEFAULT_OPTIONS) => {
    return new LocalCacheClient(options);
};

const createReplicatedCacheClient = (options = DEFAULT_OPTIONS) => {
    return new ReplicatedCacheClient(options);
};

const createCacheClient = (options = DEFAULT_OPTIONS) => {
    const { logger } = options;

    if (options.type === CACHE_TYPES.LOCAL) {
        logger.info('Creating local cache instance...');
        return createLocalCacheClient(options);
    }

    if (options.type === CACHE_TYPES.REPLICATED) {
        logger.info('Creating client for replicated cache...');
        return createReplicatedCacheClient(options);
    }

    logger.error(`Cache type of "${options.type}" is not supported`);
    throw new Error('Unsupported cache type specified');
};

class Cache {
    /**
     * @param {*} options configuration options for the cache. See
     * <code>DEFAULT_OPTIONS</code> and
     * https://www.npmjs.com/package/node-cache#options for valid
     * values
     */
    constructor(logger, options = {}) {
        if (logger) {
            this.logger = logger;
        } else {
            this.logger = new Logger({
                name: 'dhp-cache-lib',
                correlationId: uuid.v4(),
            });
        }

        this.options = { ...DEFAULT_OPTIONS, ...options };
        this.options.logger = this.logger;
        this.cacheClient = createCacheClient(this.options);
    }

    /**
     *
     * @param {*} key the identifier for the cached value to be requested
     * @returns {Promise<object>} the value of the cache entry with a key
     * that matches `key` or undefined
     */
    get(key) {
        return this.cacheClient.get(key);
    }

    /**
     * Synchronous version of `get`
     * @param {*} key
     */
    getSync(key) {
        return this.cacheClient.getSync(key);
    }

    /**
     *
     * @param {*} key the identifier for the value to be cached
     * @param {*} value the value to be cached
     * @param {*} ttl the desired time to elapse before the value can be removed
     * from the cache
     * @returns {Promise<boolean>} true if setting the cache entry was
     * successful, otherwise false
     */
    set(key, value, ttl) {
        return this.cacheClient.set(key, value, ttl);
    }

    /**
     *
     * @param {*} key
     * @returns {Promise<boolean>} whether the operation was successful
     */
    delete(key) {
        return this.cacheClient.delete(key);
    }

    /**
     * @returns {Promise<boolean>} whether the operation was successful
     */
    clear() {
        return this.cacheClient.clear();
    }
}

module.exports = {
    Cache,
    CACHE_TYPES, // kept for backwards compatibility
    SupportedCacheTypes: CACHE_TYPES,
    CacheOptions: DEFAULT_OPTIONS,
};
