# # SuiteQL

Run SQL queries against NetSuite using SuiteQL through SuiteTalk Rest Webservices. 

This class extends [netsuite-rest](https://github.com/ehmad11/netsuite-rest)

# Installation

    npm i suiteQL

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
string = select query to run
limit = limit number of rows, max is 1000
offset = Rows to start from


    let transactions = await suiteQL.query("select id from transaction", 10, 0);

it returns with promise support, response will be JSON

#### QueryAll (Stream)

When working on large number of rows, stream is handy

     let items = [];
        let st = await suiteQL.queryAll(`
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


