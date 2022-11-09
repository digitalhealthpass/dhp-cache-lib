/**
 * Digital Health Pass 
 *
 * (c) Copyright Merative US L.P. and others 2020-2022 
 *
 * SPDX-Licence-Identifier: Apache 2.0
 */

const { Logger } = require('dhp-logging-lib');

const { CacheClient } = require('../../../services/CacheClient');

const logger = new Logger({
    name: 'CacheClient tests',
});

describe('CacheClient tests', () => {
    it('get rejects with error', (done) => {
        const cacheClient = new CacheClient(logger);
        cacheClient
            .get()
            .then(() => {
                done('expected an error');
            })
            .catch(() => {
                done();
            });
    });

    it('set rejects with error', (done) => {
        const cacheClient = new CacheClient(logger);
        cacheClient
            .set()
            .then(() => {
                done('expected an error');
            })
            .catch(() => {
                done();
            });
    });

    it('delete rejects with error', (done) => {
        const cacheClient = new CacheClient(logger);
        cacheClient
            .delete()
            .then(() => {
                done('expected an error');
            })
            .catch(() => {
                done();
            });
    });

    it('clear rejects with error', (done) => {
        const cacheClient = new CacheClient(logger);
        cacheClient
            .clear()
            .then(() => {
                done('expected an error');
            })
            .catch(() => {
                done();
            });
    });
});
