/**
 * Digital Health Pass 
 *
 * (c) Copyright Merative US L.P. and others 2020-2022 
 *
 * SPDX-Licence-Identifier: Apache 2.0
 */

const assert = require('assert');
const { Logger } = require('dhp-logging-lib');

const { ReplicatedCacheClient } = require('../../../services/ReplicatedCacheClient');

const logger = new Logger({
    name: 'ReplicatedCacheClient tests',
});

/**
 * Simple mock for Redis. Add mock functions as need.
 * As of the writing of this unit test, the following
 * commands are used: GET, SETEX, KEYS, and DEL
 */
class MockReplicatedCache {
    constructor() {
        this.data = new Map();
    }

    // eslint-disable-next-line class-methods-use-this
    monitor() {}

    // eslint-disable-next-line class-methods-use-this
    on() {}
}

// eslint-disable-next-line max-lines-per-function
describe('ReplicatedCacheClient tests', () => {
    it('get resolves with undefined for empty cache', (done) => {
        const replicatedCache = new MockReplicatedCache();
        replicatedCache.get = function get(key, cb) {
            const value = this.data.get(key);
            cb(undefined, value);
        };
        const cacheClient = new ReplicatedCacheClient({
            logger,
            replicatedCache,
        });
        cacheClient.ready = true;
        cacheClient
            .get('123')
            .then((value) => {
                assert.strictEqual(undefined, value);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it('get resolves with value provided during set', (done) => {
        const replicatedCache = new MockReplicatedCache();
        replicatedCache.get = function get(key, cb) {
            const value = this.data.get(key);
            cb(undefined, value);
        };
        replicatedCache.setex = function set(key, ttl, value, cb) {
            this.data.set(key, value);
            cb(undefined, 'OK');
        };
        const cacheClient = new ReplicatedCacheClient({
            logger,
            replicatedCache,
        });
        cacheClient.ready = true;
        const key = '123';
        const testValue = {
            foo: 'bar',
        };
        cacheClient
            .set(key, testValue)
            .then((success) => {
                if (success) {
                    cacheClient
                        .get(key)
                        .then((value) => {
                            assert.deepEqual(testValue, value);
                            done();
                        })
                        .catch((err) => {
                            done(err);
                        });
                } else {
                    done('failed to set test object in cache');
                }
            })
            .catch((err) => {
                done(err);
            });
    });

    it('delete removes the entry added via set', (done) => {
        const replicatedCache = new MockReplicatedCache();
        replicatedCache.setex = function set(key, ttl, value, cb) {
            this.data.set(key, value);
            cb(undefined, 'OK');
        };
        replicatedCache.get = function get(key, cb) {
            const value = this.data.get(key);
            cb(undefined, value);
        };
        replicatedCache.del = function del(key, cb) {
            this.data.delete(key);
            cb(undefined, undefined);
        };
        const cacheClient = new ReplicatedCacheClient({
            logger,
            replicatedCache,
        });
        cacheClient.ready = true;
        const key = '123';
        const testValue = {
            foo: 'bar',
        };
        // set cache item
        cacheClient
            .set(key, testValue)
            .then((success) => {
                if (success) {
                    // delete cache item
                    cacheClient
                        .delete(key)
                        .then((value) => {
                            assert.deepEqual(testValue, value);
                            // confirm cache item is gone
                            cacheClient
                                .get(key)
                                .then((value) => {
                                    assert.strictEqual(value, undefined);
                                    done();
                                })
                                .catch((err) => {
                                    done(err);
                                });
                        })
                        .catch((err) => {
                            done(err);
                        });
                } else {
                    done('failed to cache test object');
                }
            })
            .catch((err) => {
                done(err);
            });
    });

    it('clear removes cache entry added via set', (done) => {
        const replicatedCache = new MockReplicatedCache();
        replicatedCache.setex = function set(key, ttl, value, cb) {
            this.data.set(key, value);
            cb(undefined, 'OK');
        };
        replicatedCache.get = function get(key, cb) {
            const value = this.data.get(key);
            cb(undefined, value);
        };
        replicatedCache.del = function del(key, cb) {
            this.data.delete(key);
            cb(undefined, undefined);
        };
        replicatedCache.keys = function keys(pattern, cb) {
            const keys = [];
            const dataKeys = this.data.keys();
            // eslint-disable-next-line no-restricted-syntax
            for (const key of dataKeys) {
                keys.push(key);
            }
            cb(undefined, keys);
        };
        const cacheClient = new ReplicatedCacheClient({
            logger,
            replicatedCache,
        });
        cacheClient.ready = true;
        const key = '123';
        const testValue = {
            foo: 'bar',
        };
        // set cache item
        cacheClient
            .set(key, testValue)
            .then((success) => {
                if (success) {
                    // delete cache item
                    cacheClient
                        .clear()
                        .then(() => {
                            // confirm cache item is gone
                            cacheClient
                                .get(key)
                                .then((value) => {
                                    assert.strictEqual(value, undefined);
                                    done();
                                })
                                .catch((err) => {
                                    done(err);
                                });
                        })
                        .catch((err) => {
                            done(err);
                        });
                } else {
                    done('failed to cache test object');
                }
            })
            .catch((err) => {
                done(err);
            });
    });

    it("get doesn't break when the string value can't be parsed into an object", (done) => {
        const replicatedCache = new MockReplicatedCache();
        replicatedCache.get = function get(key, cb) {
            const value = this.data.get(key);
            cb(undefined, value);
        };
        replicatedCache.setex = function set(key, ttl, value, cb) {
            this.data.set(key, value);
            cb(undefined, 'OK');
        };
        const cacheClient = new ReplicatedCacheClient({
            logger,
            replicatedCache,
        });
        cacheClient.ready = true;
        const key = '123';
        const testValue = 'u4AtF3KFc6oJP6STeXVWvw==';
        cacheClient
            .set(key, testValue)
            .then((success) => {
                if (success) {
                    cacheClient
                        .get(key)
                        .then((value) => {
                            assert.deepEqual(testValue, value);
                            done();
                        })
                        .catch((err) => {
                            done(err);
                        });
                } else {
                    done('failed to set test object in cache');
                }
            })
            .catch((err) => {
                done(err);
            });
    });
});
