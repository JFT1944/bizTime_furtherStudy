\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS company_industries;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
    code text PRIMARY KEY ON DELETE CASCADE,
    industry text NOT NULL UNIQUE
);

CREATE TABLE company_industries(
    id serial PRIMARY KEY,
    company_code text Not NULL REFERENCES companies ,
    industries_code text Not NULL REFERENCES industries
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries
  VALUES ('acct', 'accounting'),
         ('tech', 'technology'), 
         ('sci', 'science');

INSERT INTO company_industries (company_code, industries_code)
  VALUES ('apple', 'tech'),
         ('ibm', 'tech')