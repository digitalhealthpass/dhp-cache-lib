/**
 * Digital Health Pass 
 *
 * (c) Copyright Merative US L.P. and others 2020-2022 
 *
 * SPDX-Licence-Identifier: Apache 2.0
 */

const assert = require('assert');
const { Logger } = require('dhp-logging-lib');

const { LocalCacheClient } = require('../../../services/LocalCacheClient');

const logger = new Logger({
    name: 'LocalCacheClient tests',
});

// eslint-disable-next-line max-lines-per-function
describe('LocalCacheClient tests', () => {
    it('get resolves with undefined for empty cache', (done) => {
        const cacheClient = new LocalCacheClient({
            logger,
        });
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
        const cacheClient = new LocalCacheClient({
            logger,
        });
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
        const cacheClient = new LocalCacheClient({
            logger,
        });
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
        const cacheClient = new LocalCacheClient({
            logger,
        });
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
});
