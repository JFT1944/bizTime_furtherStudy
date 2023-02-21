const express = require("express");

const db = require("../db.js");
const router = new express.Router();

// Routes related to industries are held in this file.
router.use(express.json());

router.get('/industries', async (req, res, next)=>{
    let industries = await db.query('SELECT * FROM industries')
    console.log(industries.rows)
    let mappedI = industries.rows.map(r => r)
    res.json(mappedI)
})

router.post('/industries', async (req, res, next)=>{
  try{  let newIndustry = req.query
    console.log(newIndustry)
    let add_industry = await db.query("INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry", [req.query.code, req.query.industry])
    res.json(add_industry.rows[0])
}catch(e){
    next(e)
}
})

router.get('/industries/:code', async (req, res, next)=>{
   try{ let code = req.params.code
    console.log(code)
    let industry = await db.query('SELECT * FROM industries WHERE code=$1', [code])
    let companies_industry = await db.query('select * from company_industries where industries_code=$1', [code])
    console.log(companies_industry.rows)

    industry.rows[0].companies = companies_industry.rows.map(r => r.company_code)
    
    
    console.log(industry.rows[0])
    res.json(industry.rows[0])
}catch(err){
    next(err)
}
})










module.exports = router;