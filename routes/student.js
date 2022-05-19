const express = require("express");
const router = express.Router();
const Student = require("../models/student");
const Warden = require("../models/warden");
const Outing = require("../models/outing");
const Block = require("../models/block");

// const isStudent = (req, res, next) => {
//   if (!req.session.student_id) {
//       return res.redirect('../auth/login')
//   }
//   next();
// }


router.route("/home/:id").get(async (req, res) => {
  student_id = req.params.id;
  const user = await Student.findById(student_id).populate('block').populate('pendingOutings').populate('activeOuting');
  const warden = await Warden.findById(user.block.wardens[0]);
  const pendingOutings = user.pendingOutings.slice(0,2);
  const activeOuting = user.activeOuting;
  res.render("student/home",{user,warden,pendingOutings,activeOuting});
});

router.route("/request/:id").get(async (req, res) => {
  student_id = req.params.id;
  const user = await Student.findById(student_id).populate('block');
  res.render("student/request",{user});
});


router.route("/request/:id").post(async (req, res) => {
  student_id = req.params.id;
  const user = await Student.findById(student_id).populate('block');
  const warden = await Warden.findById(user.block.wardens[0]);
  if (!warden) {
      return res.redirect("../home/"+student_id);
  }
  const { type, requestedFor, desc, where } = req.body;
  const requestedBy = user;
  const requestedTo = warden;
  const requestedOn = new Date();
  const outing = new Outing({type, requestedOn,requestedFor, desc, where,requestedBy,requestedTo});
  user.pendingOutings.push(outing);
  warden.pendingOutings.push(outing);
  outing.requestedBy = user;
  outing.requestedTo = warden;
  await warden.save();
  await user.save();
  await outing.save();
  res.redirect("/student/home/"+student_id);
});


router.route("/detailedActive/:outingid").get(async (req, res) => {
  outing_id = req.params.outingid;
  const outing = await Outing.findById(outing_id).populate('requestedBy');
  student_id = outing.requestedBy;
  const user = await Student.findById(student_id).populate('block');
  res.render("components/detailedActive", { user ,outing});
});


router.route("/detailedPending/:outingid").get(async (req, res) => {
  outing_id = req.params.outingid;
  const outing = await Outing.findById(outing_id).populate('requestedBy');
  student_id = outing.requestedBy;
  const user = await Student.findById(student_id).populate('block');
  res.render("components/detailedPending", { user ,outing});
});


router.route("/detailedDone/:outingid").get(async (req, res) => {
  outing_id = req.params.outingid;
  const outing = await Outing.findById(outing_id).populate('requestedBy');
  student_id = outing.requestedBy;
  const user = await Student.findById(student_id).populate('block');
  res.render("components/detailedDone", { user ,outing});
});


router.route("/profile/:id").get(async (req, res) => {
  student_id = req.params.id;
  const user = await Student.findById(student_id).populate('block');
  res.render("student/profile",{user});
});

router.route("/profile/:id/edit").get(async (req, res) => {
  student_id = req.params.id;
  const user = await Student.findById(student_id).populate('block');
  const branches = ['Biotech', 'Chemical', 'Civil', 'CSE', 'ECE', 'EEE', 'Mechanical', 'MME'];
  const blocks= await Block.find();
  res.render("student/edit",{user,blocks,branches});
});

router.route("/profile/:id/edit").post(async (req, res) => {
  student_id = req.params.id;
  const user = await Student.findById(student_id).populate('block');
  const { name, year, branch, gender, roomNumber, mobileNumber, parentMobileNumber, blockid } = req.body;
  const oldBlock = await Block.findById(user.block._id).populate('students');
  const newBlock = await Block.findById(blockid).populate('students');
  user.name = name;
  user.year = year;
  user.branch = branch;
  user.gender = gender;
  user.roomNumber = roomNumber;
  user.mobileNumber = mobileNumber;
  user.parentMobileNumber = parentMobileNumber;
  user.block = newBlock;
  
  await user.save();
  //remove user from old block
  oldBlock.students.splice(oldBlock.students.indexOf(user), 1);
  await oldBlock.save();
  //add user to new block
  newBlock.students.push(user);
  await newBlock.save();
  res.redirect('/student/profile/'+student_id);
});

router.route("/history/:id").get(async (req, res) => {
  student_id = req.params.id;
  const user = await Student.findById(student_id).populate('block').populate('pendingOutings').populate('usedOutings').populate('rejectedOutings');
  const pendingOutings = user.pendingOutings;
  const activeOuting = 0;
  const usedOutings = user.usedOutings;
  const rejectedOutings = user.rejectedOutings;
  res.render("student/history",{user,activeOuting,pendingOutings,usedOutings,rejectedOutings});
});

router.route("/pending/:id").get(async (req, res) => {
  student_id = req.params.id;
  const user = await Student.findById(student_id).populate('block').populate('pendingOutings');
  const pendingOutings = user.pendingOutings;
  res.render("student/pending",{user,pendingOutings});
});

router.post(("/use/:id"), async (req, res) => {
  const outing_id = req.params.id;
  const outing = await Outing.findById(outing_id);
  outing.usedOn = new Date();
  const student_id = outing.requestedBy;
  const student = await Student.findById(student_id).populate('activeOuting').populate('usedOutings');
  student.usedOutings.push(outing);
  student.activeOuting = null;
  await student.save();
  res.redirect("/student/home/"+student_id);
})

router.get('*', function (req, res) {
  res.redirect(("/auth/login"));
})
// router.route("/active").get((req, res) => {
//   res.render("partials/outingList");
// });
module.exports = router;
