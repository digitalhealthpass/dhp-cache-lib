/* eslint-disable class-methods-use-this */
/**
 * Digital Health Pass 
 *
 * (c) Copyright Merative US L.P. and others 2020-2022 
 *
 * SPDX-Licence-Identifier: Apache 2.0
 */

const { Logger } = require('dhp-logging-lib');
const uuid = require('uuid');

class CacheClient {
    constructor(logger) {
        this.logger = logger
            ? logger.child({ name: 'CacheClient' })
            : new Logger({ name: 'CacheClient', correlationId: uuid.v4() });
    }

    // eslint-disable-next-line no-unused-vars
    get(key) {
        return Promise.reject(new Error('not implemented'));
    }

    // eslint-disable-next-line no-unused-vars
    set(key, value, ttl) {
        return Promise.reject(new Error('not implemented'));
    }

    // eslint-disable-next-line no-unused-vars
    delete(key) {
        return Promise.reject(new Error('not implemented'));
    }

    clear() {
        return Promise.reject(new Error('not implemented'));
    }
}

module.exports = { CacheClient };
