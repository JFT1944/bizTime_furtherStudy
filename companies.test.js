process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app.js");
const db = require("../db.js");

let testCompanies;

beforeEach(async function () {
  let result = await db.query(`
  INSERT INTO
    companies (code, name, description) values ('micro', 'microsoft', 'first comp company')
    returning code, name`);

  testCompanies = result.rows[0];
});

describe("GET /companies", function () {
  test("Gets a list of 1 company", async function () {
    const response = await request(app).get(`/companies`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      companies: [testCompanies],
    });
  });
});

describe("GET /companies/:id", function () {
  test("Gets a single company", async function () {
    const response = await request(app).get(`/companies`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      companies: [testCompanies],
    });
  });
  test("Responds with 404 if can't find company", async function () {
    const response = await request(app).get(`/companies/10`);
    expect(response.statusCode).toEqual(404);
  });
});

describe("POST /companies", function () {
  test("Creates a new company", async function () {
    const response = await request(app).post(`/companies`).send({
      code: "aple",
      name: "apple",
      description: "second comp",
    });
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      cat: {
        code: expect.any(Text),
        name: "apple",
        description: "second comp",
      },
    });
  });
});

describe("PATCH /companies/:id", function () {
  test("Updates a single company", async function () {
    const response = await request(app)
      .patch(`/companies/${testCompanies.id}`)
      .send({
        name: "Microsoft",
        description: "what",
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      companies: {
        code: testCompanies.code,
        name: "Mircosoft",
        description: "what",
      },
    });
  });

  test("Responds with 404 if can't find cat", async function () {
    const response = await request(app).patch(`/companies/0`);
    expect(response.statusCode).toEqual(404);
  });
});

describe("DELETE /companies/:id", function() {
    test("Deletes a single a company", async function() {
      const response = await request(app)
        .delete(`/companies/${testCompanies.code}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ message: "Company deleted" });
    });
  });

afterEach(async function () {
  let result = await db.query("DELETE FROM companies");
});
afterAll(async function () {
  await db.end;
});
