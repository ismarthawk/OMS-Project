const express = require("express");
const router = express.Router();

router.route("/login").get((req, res) => {
  res.render("auth/login");
});

router.get("/register", (req, res) => {
  res.render("auth/register");
});

module.exports = router;
