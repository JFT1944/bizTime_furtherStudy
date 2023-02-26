process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app.js");
const db = require("../db.js");

let testIndustries;

beforeEach(async function () {
  let result = await db.query(`
INSERT INTO industries (code, industry) VALUES ('aple', 'tech') RETURNING code, industry`);

  testIndustries = result.rows[0];
});

describe("GET /industries", function () {
  test("Gets a list of 1 industries", async function () {
    const response = await request(app).get(`/industries`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      industries: [testIndustries],
    });
  });
});

describe("GET /industries/:id", function () {
  test("Gets a single company", async function () {
    const response = await request(app).get(`/industries`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      industries: [testIndustries],
    });
  });
  test("Responds with 404 if can't find company", async function () {
    const response = await request(app).get(`/industries/10`);
    expect(response.statusCode).toEqual(404);
  });
});

describe("POST /industries", function () {
  test("Creates a new company", async function () {
    const response = await request(app).post(`/industries`).send({
      code: "apple",
      industries: 'tech'
    });
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      cat: {
        code: expect.any(Text),
        industries: 'tech'
      },
    });
  });
});

describe("PATCH /industries/:id", function () {
  test("Updates a single company", async function () {
    const response = await request(app)
      .patch(`/industries/${testIndustries.id}`)
      .send({
        code: "aple",
        industries: "farming",
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      industries: {
        code: testIndustries.code,
        name: "Mircosoft",
        description: "what",
      },
    });
  });

  test("Responds with 404 if can't find cat", async function () {
    const response = await request(app).patch(`/industries/0`);
    expect(response.statusCode).toEqual(404);
  });
});

describe("DELETE /industries/:id", function() {
    test("Deletes a single a company", async function() {
      const response = await request(app)
        .delete(`/industries/${testIndustries.code}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ message: "Company deleted" });
    });
  });

afterEach(async function () {
  let result = await db.query("DELETE FROM industries");
});
afterAll(async function () {
  await db.end;
});
