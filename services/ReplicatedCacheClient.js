/* eslint-disable no-underscore-dangle */
/**
 * Digital Health Pass 
 *
 * (c) Copyright Merative US L.P. and others 2020-2022 
 *
 * SPDX-Licence-Identifier: Apache 2.0
 */

const redis = require('redis');

const { CacheClient } = require('./CacheClient');

const DEFAULT_OPTIONS = {
    password: process.env.REDIS_PASSWORD,
    replicatedCache: undefined,
    enable_offline_queue: true,
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    defaultTtl: 30,
};

class ReplicatedCacheClient extends CacheClient {
    constructor(options = {}) {
        super(options.logger);
        this.options = { ...DEFAULT_OPTIONS, ...options };

        this.ready = false;

        this.cache =
            this.options.replicatedCache ||
            this._bootstrapCache(
                redis.createClient({
                    password: this.options.password,
                    enable_offline_queue: this.options.enable_offline_queue,
                    host: this.options.host,
                    port: this.options.port,
                })
            );
    }

    /**
     * Bootstrap cache client, subscribing
     * to key lifecycle events
     *
     * @param {object} cache
     * @returns cache
     */
    _bootstrapCache(cache) {
        cache.on('error', (err) => {
            this.logger.error({
                host: this.cache.host,
                port: this.cache.port,
                error: err,
            });
        });

        cache.on('ready', (err) => {
            if (!err) {
                this.logger.info('Connected to remote cache');
                this.ready = true;
            } else {
                this.logger.warn(`Could not connect to remote cache: ${err}`);
            }
        });

        cache.on('reconnecting', (err) => {
            this.logger.warn(`Connection to remote cache lost (${err}). Reconnectiong...`);
            this.ready = false;
        });

        return cache;
    }

    get(key) {
        if (!this.ready) {
            this.logger.warn('Not ready to read from cache');
            return Promise.resolve(undefined);
        }

        return new Promise((resolve) => {
            this.logger.info(`Getting cache entry for key ${key}`);
            this.cache.get(key, (err, res) => {
                if (err) {
                    this.logger.error(`Failed to get cache entry: ${JSON.stringify(err)}`);
                    resolve(undefined);
                } else {
                    /**
                     * Redis doesn't accept JSON values; thus
                     * we have to determine whether the value
                     * is a plain string or a stringified object
                     */
                    // eslint-disable-next-line no-lonely-if
                    if (typeof res === 'string') {
                        try {
                            // eslint-disable-next-line no-param-reassign
                            res = JSON.parse(res);
                        } catch (err) {
                            // not json
                        } finally {
                            resolve(res);
                        }
                    } else {
                        if (!res) {
                            // eslint-disable-next-line no-param-reassign
                            res = undefined;
                        } else {
                            this.logger.info(`Successfully retrieved cache entry: ${res}`);
                        }
                        resolve(res);
                    }
                }
            });
        });
    }

    set(key, value, ttl) {
        if (!this.ready) {
            this.logger.warn('Not ready to write to cache. Sorry!');
            return Promise.resolve(false);
        }

        return new Promise((resolve) => {
            if (!ttl) {
                // eslint-disable-next-line no-param-reassign
                ttl = this.options.defaultTtl;
            }
            this.logger.info(`Setting cache entry for key ${key} with ttl of ${ttl}s`);
            /**
             * Redis doesn't accept JSON values; thus
             * we have to stringify objects. There is
             * probably a safer way to serialize them.
             */
            if (value instanceof Object) {
                // eslint-disable-next-line no-param-reassign
                value = JSON.stringify(value);
            }
            this.cache.setex(key, ttl, value, (err, res) => {
                if (res && res === 'OK') {
                    resolve(true);
                } else {
                    if (err) {
                        this.logger.error(`Failed to set cache entry: ${JSON.stringify(err)}`);
                    }
                    resolve(false);
                }
            });
        });
    }

    delete(key) {
        return this.get(key).then((value) => {
            return new Promise((resolve) => {
                this.cache.del(key, (err) => {
                    if (err) {
                        this.logger.error(`Failed to delete cache entry: ${JSON.stringify(err)}`);
                        resolve(undefined);
                    } else {
                        this.logger.info(`Successfully removed cache entry: ${JSON.stringify(value)}`);
                        resolve(value);
                    }
                });
            });
        });
    }

    clear() {
        return new Promise((resolve, reject) => {
            this.logger.info('Attempting to clear cache');
            this.cache.keys('*', (err, res) => {
                if (err) {
                    this.logger.error(`Failed to clear cache: ${JSON.stringify(err)}`);
                    reject(err);
                } else {
                    const keys = res || [];
                    const deleteTasks = [];
                    keys.forEach((key) => {
                        deleteTasks.push(this.delete(key));
                    });
                    Promise.all(deleteTasks)
                        .then(() => {
                            this.logger.info('Successfully cleared cache');
                            resolve();
                        })
                        .catch((err) => reject(err));
                }
            });
        });
    }
}

module.exports = { ReplicatedCacheClient };
