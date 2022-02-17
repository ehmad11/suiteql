"use strict";
var NetsuiteRest = require("netsuite-rest");
const Readable = require("stream").Readable;

module.exports = class suiteql extends NetsuiteRest {
  constructor(options) {
    if (typeof options !== "object")
      throw new TypeError("Please provide netsuite api credentials");
    super(options);
  }

  async connect() {
    return await this.request({
      path: "*",
      method: "OPTIONS",
    });
  }

  async query(string, limit = 1000, offset = 0) {
    let queryresult = {};
    if (typeof string !== "string")
      throw new TypeError("Query is not a string");
    if (limit > 1000) throw new Error("Max limit is 1000");
    // replace all \t with spaces as suggested in #5
    string = string.replace(/\t/g, ' ');
    string = string.replace(/\r?\n|\r/gm, "");
    let bodycontent = `{"q": "${string}" }`;

    await this.request({
      path: `query/v1/suiteql?limit=${limit}&offset=${offset}`,
      method: "POST",
      body: bodycontent,
    }).then(async (response) => {
      queryresult.items = response.data.items;
      queryresult.hasMore = response.data.hasMore;
    });
    return queryresult;
  }

  queryAll(string, limit = 1000) {
    const stream = new Readable({
      objectMode: true,
      read() {},
    });
    let offset = 0;
    const getNextPage = async () => {
      let hasMore = true;
      while (hasMore === true) {
        let sqlresult = await this.query(string, limit, offset);
        sqlresult.items.forEach((item) => stream.push(item));
        hasMore = sqlresult.hasMore;
        offset = offset + limit;
      }
      stream.push(null);
    };
    getNextPage();
    return stream;
  }
};
