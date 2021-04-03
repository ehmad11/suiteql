const dotenv = require("dotenv").config();
const suiteql = require("./suiteql");
var suiteQL;

describe("Netsuite SuiteQL Tests", () => {
  jest.setTimeout(10000);

  test("it should check that secrets exists", () => {
    expect(process.env.consumer_key).toBeDefined();
    expect(process.env.consumer_secret_key).toBeDefined();
    expect(process.env.token).toBeDefined();
    expect(process.env.token_secret).toBeDefined();
    expect(process.env.realm).toBeDefined();
    expect(process.env.base_url).toBeDefined();
  });

  test("it should throw error if config is missing", () => {
    const t = () => {
      suiteQL = new suiteql()
    };
    expect(t).toThrow(TypeError);
  });

  test("it should not connect to NetSuite because of invalid token", () => {
    expect.assertions(1);
    suiteQL = new suiteql({
      consumer_key: process.env.consumer_key,
      consumer_secret_key: process.env.consumer_secret_key,
      token: "INVALID TOKEN",
      token_secret: process.env.token_secret,
      realm: process.env.realm
    });
    return expect(suiteQL.connect()).rejects.toThrow(Error);
  });

  test("it should connect to NetSuite", () => {
    expect.assertions(1);

    suiteQL = new suiteql({
      consumer_key: process.env.consumer_key,
      consumer_secret_key: process.env.consumer_secret_key,
      token: process.env.token,
      token_secret: process.env.token_secret,
      realm: process.env.realm,
      base_url: process.env.base_url
    });

    return suiteQL.connect()
      .then((response) => {
        expect(response.statusCode).toEqual(204);
      })
      .catch((err) => {
        console.log("Connect Test Failed.", err);
      });
  });

  test("it should get 2 records from transaction table ", async () => {
    expect.assertions(1);
    let transactions = await suiteQL.query("select id from transaction", 2);
    expect(transactions.items.length).toEqual(2);
  });

  test("it should get 0 records from transaction table ", async () => {
    expect.assertions(1);
    let transactions = await suiteQL.query(`select id from transaction where id = 1 `);
    expect(transactions.items.length).toEqual(0);
  });

  test("it should throw error if query is not string", async () => {
    expect.assertions(1);
    await expect(
      suiteQL.query(123)
    ).rejects.toThrow(Error);
  });

  test("it should throw error if query fails", async () => {
    expect.assertions(1);
    await expect(
      suiteQL.query("select id from transactiontablethatdoesnotexist", 2)
    ).rejects.toThrow(Error);
  });

  test("it should throw error if limit exceeds 1000", async () => {
    expect.assertions(1);
    await expect(
      suiteQL.query("select id from transaction", 1001)
    ).rejects.toThrow("Max limit is 1000");
  });  

  test("it should get all 30 records from transaction table using queryAll", async (done) => {
    expect.assertions(1);
    let items = [];
    let st = suiteQL.queryAll('select  tranid, id from transaction  where rownum <= 30');
    st.on("data", (data) => {
      items.push(data);
    });
    st.on("end", () => {
      expect(items.length).toEqual(30);
      done();
    });
  });
});