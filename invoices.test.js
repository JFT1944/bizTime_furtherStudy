process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app.js");
const db = require("../db.js");

let testinvoices;

beforeEach(async function () {
  let result = await db.query(`
INSERT INTO invoices (code, industry) VALUES ('aple', 'tech') RETURNING code, industry`);

  testinvoices = result.rows[0];
});

describe("GET /invoices", function () {
  test("Gets a list of 1 invoice", async function () {
    const response = await request(app).get(`/invoices`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      invoices: [testinvoices],
    });
  });
});

describe("GET /invoices/:id", function () {
  test("Gets a single company", async function () {
    const response = await request(app).get(`/invoices`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      invoices: [testinvoices],
    });
  });
  test("Responds with 404 if can't find company", async function () {
    const response = await request(app).get(`/invoices/10`);
    expect(response.statusCode).toEqual(404);
  });
});

describe("POST /invoices", function () {
  test("Creates a new company", async function () {
    const response = await request(app).post(`/invoices`).send({
      code: "apple",
      invoices: 'tech'
    });
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      cat: {
        code: expect.any(Text),
        invoices: 'tech'
      },
    });
  });
});

describe("PATCH /invoices/:id", function () {
  test("Updates a single company", async function () {
    const response = await request(app)
      .patch(`/invoices/${testinvoices.id}`)
      .send({
        code: "aple",
        invoices: "farming",
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      invoices: {
        code: testinvoices.code,
        name: "Mircosoft",
        description: "what",
      },
    });
  });

  test("Responds with 404 if can't find cat", async function () {
    const response = await request(app).patch(`/invoices/0`);
    expect(response.statusCode).toEqual(404);
  });
});

describe("DELETE /invoices/:id", function() {
    test("Deletes a single a company", async function() {
      const response = await request(app)
        .delete(`/invoices/${testinvoices.code}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ message: "Company deleted" });
    });
  });

afterEach(async function () {
  let result = await db.query("DELETE FROM invoices");
});
afterAll(async function () {
  await db.end;
});
