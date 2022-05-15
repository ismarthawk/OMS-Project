const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();
const Student = require("../models/student");
const Warden = require("../models/warden");
const Block = require("../models/block");

// app.use(express.json())

router.route("/login").get((req, res) => {
  res.render("auth/login");
});


router.post("/login", async (req, res) => {
    const { mail, password } = req.body;
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
      res.redirect("/student/home/"+foundStudent._id);
    }
    else if (validWarden) {
      req.session.warden_id = foundWarden._id;
      res.redirect("/warden/home");
    }
    else {
      res.redirect("/auth/login");
    }
});

const branches = ['Biotech', 'Chemical', 'Civil', 'CSE', 'ECE', 'EEE', 'Mechanical', 'MME'];

router.get("/register", async (req, res) => {
  const blocks = await Block.find();
  res.render("auth/register", {blocks,branches});
});


router.get("/wardenregister", async (req, res) => {
  const blocks = await Block.find();
  res.render("auth/wardenregister",{blocks});
});




router.post("/register", async (req, res) => {
  const { name,regNumber,rollNumber,year,branch,gender ,blockid,roomNumber, mobileNumber ,parentMobileNumber,mail,pass } = req.body;
  const block = await Block.findById(blockid);  
  const password = await bcrypt.hash(pass, 12);
  const student = new Student({name,regNumber,rollNumber,year,branch,gender ,block,roomNumber, mobileNumber ,parentMobileNumber, mail, password });
  block.students.push(student);
  student.block = block;
  await student.save();
  await block.save();
  res.redirect(("/auth/login"));
});


router.post("/wardenregister", async (req, res) => {
  const { name, blockid, mobileNumber ,mail,pass } = req.body;
  const block = await Block.findById(blockid);  
  const password = await bcrypt.hash(pass, 12);
  const warden = new Warden({ name, mobileNumber, mail, password });
  block.wardens.push(warden);
  warden.block = block;
  await warden.save();
  await block.save();
  res.redirect(("/auth/login"));
});


router.post("/logout", (req, res) => {
  req.session.student_id = null;
  res.redirect(("/auth/login"));
})



module.exports = router;