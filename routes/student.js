const express = require("express");
const router = express.Router();

router.route("/home").get((req, res) => {
  res.render("student/home");
});

router
  .route("/request")
  .get((req, res) => {
    res.render("student/request");
  })
  .post((req, res) => {
    res.redirect("/student/home");
  });

router.route("/detailed/:id").get((req, res) => {
  res.render("components/detailed");
});

router.route("/profile").get((req, res) => {
  res.render("student/profile");
});

router.route("/history").get((req, res) => {
  res.render("partials/outingList");
});

router.route("/pending").get((req, res) => {
  res.render("partials/outingList");
});

router.route("/active").get((req, res) => {
  res.render("partials/outingList");
});
module.exports = router;
