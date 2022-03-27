const express = require("express");
const router = express.Router();

router
  .route("/login")
  .get((req, res) => {
    res.render("auth/login");
  })
  .post((req, res) => {
    console.log(req.body);
  });

router
  .route("/register")
  .get((req, res) => {
    res.render("auth/register");
  })
  .post((req, res) => {
    console.log("submitted");
    console.log(req.body);
    // res.render("auth/login");
  });

module.exports = router;
