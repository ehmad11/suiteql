# SuiteQL

[![Node.js CI](https://github.com/ehmad11/suiteql/actions/workflows/node.js.yml/badge.svg)](https://github.com/ehmad11/suiteql/actions/workflows/node.js.yml) [![npm version](https://badge.fury.io/js/suiteql.svg)](https://www.npmjs.com/package/suiteql) [![downloads](https://img.shields.io/npm/dm/suiteql.svg)](https://www.npmjs.com/package/suiteql) [![Coverage Status](https://coveralls.io/repos/github/ehmad11/suiteql/badge.svg?branch=main)](https://coveralls.io/github/ehmad11/suiteql?branch=main)

[![NPM](https://nodei.co/npm/suiteql.png)](https://nodei.co/npm/suiteql/)

Run SQL queries against NetSuite using SuiteQL through SuiteTalk Rest Webservices.

This class extends [netsuite-rest](https://github.com/ehmad11/netsuite-rest)

# Installation

    npm i suiteql

### ESM or CommonJS?

This package is still compatible with CommonJS. But some dependencies, like [`got`](https://www.npmjs.com/package/got) are now available only in [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). This package [will not be](https://github.com/ehmad11/netsuite-rest/issues/27) modified to support latest `got` versions to stay compatible with CommonJS. Instead you can use the native ESM module [netsuite-api-client](https://www.npmjs.com/package/netsuite-api-client), which is a fork of the current package.

## Quick Start

    const suiteql = require('suiteql');
    let suiteQL = new suiteql({
    	consumer_key: process.env.consumer_key,
    	consumer_secret_key: process.env.consumer_secret_key,
    	token: process.env.token,
    	token_secret: process.env.token_secret,
    	realm: process.env.realm,
    	base_url: process.env.base_url
    });

## query

    query(string, limit = 1000, offset = 0)

- **string** - Select query to run

- **limit** - Limit number of rows, max is 1000

- **offset** - Rows to start from

This method returns with the promise support, response will be in JSON format

### Example

    let transactions = await suiteQL.query("select id from transaction", 10, 0);

## queryAll (Stream)

When working on large number of rows, stream is handy

    queryAll(string, limit = 1000)

- **string** - Select query to run

- **limit** - Limit number of rows, max is 1000

### Example

     let items = [];
        let st = suiteQL.queryAll(`
            select
                tranid, id from transaction
            where
                rownum <= 30
        `);

        st.on("data", (data) => {
          items.push(data);
        });

        st.on("end", () => {
            console.log("stream ended")
        });
