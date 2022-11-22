# Digital Healthpass cache-lib

## Introduction

This module provides general-purpose cache functionality, used by backed services.

## Build

```
npm install
```

## Implementation notes
- [node-cache](https://www.npmjs.com/package/node-cache) is leveraged for caching that doesn't require replication across the cluster
- [redis](https://www.npmjs.com/package/ioredis) : Not fully supported currently
- The module exports a class `Cache` that will use node-cache as default, unless otherwise specified the initialization options.

## Library Licenses

This section lists license details of libraries / dependencies.

| Name                   | License type            | Link                                                         |
| :--------------------- | :---------------------- | :----------------------------------------------------------- |
| node-cache             | MIT                     | git://github.com/node-cache/node-cache.git                   |
| redis                  | MIT                     | git://github.com/NodeRedis/node-redis.git                    |
| uuid                   | MIT                     | git+https://github.com/uuidjs/uuid.git                       |
| assert                 | MIT                     | git+https://github.com/browserify/commonjs-assert.git        |
| chai                   | MIT                     | git+https://github.com/chaijs/chai.git                       |
| chai-as-promised       | WTFPL                   | git+https://github.com/domenic/chai-as-promised.git          |
| eslint                 | MIT                     | git+https://github.com/eslint/eslint.git                     |
| eslint-config-airbnb   | MIT                     | git+https://github.com/airbnb/javascript.git                 |
| eslint-config-node     | ISC                     | git+https://github.com/kunalgolani/eslint-config.git         |
| eslint-config-prettier | MIT                     | git+https://github.com/prettier/eslint-config-prettier.git   |
| eslint-plugin-jsx-a11y | MIT                     | git+https://github.com/jsx-eslint/eslint-plugin-jsx-a11y.git |
| eslint-plugin-node     | MIT                     | git+https://github.com/mysticatea/eslint-plugin-node.git     |
| eslint-plugin-prettier | MIT                     | git+https://github.com/prettier/eslint-plugin-prettier.git   |
| eslint-plugin-react    | MIT                     | git+https://github.com/jsx-eslint/eslint-plugin-react.git    |
| husky                  | MIT                     | git+https://github.com/typicode/husky.git                    |
| mocha                  | MIT                     | git+https://github.com/mochajs/mocha.git                     |
| nodemon                | MIT                     | git+https://github.com/remy/nodemon.git                      |
| nyc                    | ISC                     | git+ssh://git@github.com/istanbuljs/nyc.git                  |
| sinon                  | BSD-3-Clause            | git+ssh://git@github.com/sinonjs/sinon.git                   |
| sinon-chai             | (BSD-2-Clause OR WTFPL) | git+https://github.com/domenic/sinon-chai.git                |
| stream                 | MIT                     | git://github.com/juliangruber/stream.git                     |
| supertest              | MIT                     | git+https://github.com/visionmedia/supertest.git             |