/** BizTime express application. */


const express = require("express");
const morgan = require("morgan");

const app = express();
const ExpressError = require("./expressError")
const companyRoutes = require("./routes/companies");
const invoiceRoutes = require("./routes/invoices");
const industryRoutes = require('./routes/industry')

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
/** 404 handler */

app.get('/', (req, res, next) => {
  res.send("index page")
  })

app.use("/", companyRoutes);

app.use("/", invoiceRoutes);

app.use("/", industryRoutes);

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  // return res.redirect('/')
  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
