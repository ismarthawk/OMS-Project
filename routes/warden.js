const express = require("express");
const router = express.Router();

router.route("/home").get((req, res) => {
  res.render("warden/home");
});

module.exports = router;
