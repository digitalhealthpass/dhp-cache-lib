/**
 * Digital Health Pass 
 *
 * (c) Copyright Merative US L.P. and others 2020-2022 
 *
 * SPDX-Licence-Identifier: Apache 2.0
 */

const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { Logger } = require('dhp-logging-lib');

const { Cache, CACHE_TYPES } = require('../../index');

const { expect } = chai;
chai.use(chaiAsPromised);

const logger = new Logger({
    name: 'Cache tests',
});

describe('Cache tests', () => {
    it('get returns undefined', () => {
        const cache = new Cache(logger);
        expect(cache.get('key')).to.eventually.equal(undefined);
    });

    it('set returns true', () => {
        const cache = new Cache(logger, {});
        expect(cache.set('key', 'val')).to.eventually.equal(true);
    });

    it('creating a cache of an unsupported type throws an error', (done) => {
        try {
            const cache = new Cache(logger, {
                type: 'foo',
            });
            logger.info('Created cache', cache);
            done('failed to throw an error');
        } catch (err) {
            done();
        }
    });

    it('creating a cache of a supported type succeeds', (done) => {
        try {
            const localCache = new Cache(logger, {
                type: CACHE_TYPES.LOCAL,
            });
            logger.info('Created cache local cache', localCache);
            const replicatedCache = new Cache(logger, {
                type: CACHE_TYPES.REPLICATED,
            });
            logger.info('Created cache replicated cache', replicatedCache);
            done();
        } catch (err) {
            done(err);
        }
    });

    it('delete returns true', () => {
        const cache = new Cache(logger, {});
        expect(cache.delete('key')).to.eventually.equal(undefined);
    });

    it('clear returns true', () => {
        const cache = new Cache(logger, {});
        expect(cache.delete('key')).to.eventually.equal(undefined);
    });

    it('replicated cache is supported', () => {
        const cache = new Cache(logger, {
            type: CACHE_TYPES.REPLICATED,
            replicatedCache: {
                monitor: () => {},
                on: () => {},
            },
        });
        assert.ok(cache);
    });
});
