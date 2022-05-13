const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();
const Student = require("../models/student");
const Warden = require("../models/warden")

// app.use(express.json())

router.route("/login").get((req, res) => {
  res.render("auth/login");
});


router.post("/login", async (req, res) => {
  const {mail,password} = req.body;
  const foundStudent = await Student.findOne({ mail });
  const foundWarden = await Warden.findOne({ mail });
  var validStudent = false, validWarden = false;
  if (foundStudent) {
    validStudent = await bcrypt.compare(password, foundStudent.password);
  }
  if (foundWarden) {
    validWarden = await bcrypt.compare(password, foundWarden.password);
  }
  if (validStudent) {
    req.session.student_id = foundStudent._id;
      res.redirect("/student/home");
  }
  else if(validWarden){
    req.session.warden_id = foundWarden._id;
      res.redirect("/warden/home");
  }
  else {
    res.redirect("/auth/login");
  }
});

router.get("/register", async (req, res) => {
  res.render("auth/register");
});

router.post("/register", async (req, res) => {
  const { password} = req.body;
  const hash = await bcrypt.hash(password, 12);
  req.body.password = hash;
  const student = new Student(req.body, hash);
  await student.save();
  res.redirect(("/auth/login"));
});

router.post("/logout", (req, res) => {
  req.session.student_id = null;
  res.redirect(("/auth/login"));
})



module.exports = router;