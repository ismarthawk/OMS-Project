const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const Warden = require("../models/warden");


router.route("/home/:id").get(async (req, res) => {
  student_id = req.params.id;
  const user = await Student.findById(student_id).populate('block');
  const warden = await Warden.findById(user.block.wardens[0]);
  res.render("student/home",{user,warden});
});

router.route("/request").get((req, res) => {
  res.render("student/request");
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
