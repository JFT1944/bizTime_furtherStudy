// const { application } = require("express");
const express = require("express");
const slugify = require('slugify')
// const { Router } = require("../app");
const db = require("../db.js");
const router = new express.Router();



// Routes related to companies are held in this file.
router.use(express.json());

router.get("/companies", async (req, res, next)=> {
    const results = await db.query("SELECT * FROM companies");
    console.log(results)
    return res.json({companies: results.rows})


    // res.send("company page")
})

router.get("/companies/:code", async (req, res, next)=> {
    let code = req.params.code
    let results = await db.query("SELECT * FROM companies WHERE code=$1", [code]);
    let industryResults = await db.query('Select * from company_industries WHERE company_code=$1', [code])
    console.log(industryResults.rows[0])
    let indRes = await db.query('SELECT * FROM industries WHERE code=$1', [industryResults.rows[0].industries_code])
    console.log(indRes.rows[0].industry)
    results.rows[0].industry = indRes.rows[0].industry


    if (results.rows.length === 0) {
        console.log(results.rows)
        next()
        // throw new ExpressError(`Can't find company with code of ${code}`, 404)
        
    }
    return res.json({company: results.rows[0]})

})

router.post("/companies", async (req, res, next)=> {
    let newCompany = req.query
    console.log(`data: ${newCompany}`)
    console.log(`data: ${newCompany.code}`)
    newCompany.code = slugify(newCompany.code)
    defNewCompany = await db.query("INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description", [newCompany.code, newCompany.name, newCompany.description])
    // console.log(defNewCompany)

    return res.json({info: newCompany})
})

router.put("/companies/:code", async(req, res, next)=> {
    let code = req.params.code
    let getCompany = await db.query("SELECT * FROM companies WHERE code=$1", [code])
    console.log(getCompany)
    if (getCompany.rows.length === 0) {
        next()
    }   
    let updateCompany = req.query
    console.log(updateCompany)
    let update = await db.query("UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description", [updateCompany.name, updateCompany.description, code])
    return res.json({company: update.rows[0]})
})

router.delete("/companies/:code", async (req, res, next)=> {
    console.log(req.params.code)
    preSearch = await db.query("select * from companies where code=$1", [req.params.code])
    if (preSearch.rows.length === 0) {
        // res.json({status: "not found"})
        next()
    }

    db.query("DELETE FROM companies WHERE code=$1", [req.params.code])
    return res.json({status: "deleted"})
})







module.exports = router;