const express = require("express");
const router = express.Router();
const Warden = require("../models/warden");
const Outing = require("../models/outing");
const Student= require("../models/student");
const Block= require("../models/block")

router.route("/home/:id").get(async(req, res) => {
  warden_id = req.params.id;
  const user = await Warden.findById(warden_id).populate('block').populate({ path: 'pendingOutings', populate: { path: 'requestedBy' } }).populate({ path: 'approvedOutings', populate: { path: 'requestedBy' } }).populate({ path:'rejectedOutings',populate:{path:'requestedBy'}});
  const pendingOutings = user.pendingOutings.slice(0, 2);
  const approvedOutings = user.approvedOutings.slice(0,2);
  const rejectedOutings = user.rejectedOutings.slice(0, 2);
  const block = await Block.findById(user.block).populate('students');
  const students = block.students.slice(0,2);
  res.render("warden/home",{user,pendingOutings,approvedOutings,rejectedOutings,students});
});


router.route("/profile/:id").get(async (req, res) => {
  student_id = req.params.id;
  const user = await Warden.findById(student_id).populate('block');
  res.render("warden/profile",{user});
});

router.route("/profile/:id/edit").get(async (req, res) => {
  warden_id = req.params.id;
  const user = await Warden.findById(warden_id).populate('block');
  const branches = ['Biotech', 'Chemical', 'Civil', 'CSE', 'ECE', 'EEE', 'Mechanical', 'MME'];
  const blocks= await Block.find();
  res.render("warden/edit",{user,blocks,branches});
});

router.route("/profile/:id/edit").post(async (req, res) => {
  warden_id = req.params.id;
  const user = await Warden.findById(warden_id).populate('block');
  const { name,mobileNumber, blockid } = req.body;
  const oldBlock = await Block.findById(user.block._id).populate('wardens');
  const newBlock = await Block.findById(blockid).populate('wardens');
  user.name = name;
  user.mobileNumber = mobileNumber;
  if (newBlock.wardens.length!==0) {
    await user.save();
    return res.redirect("/warden/profile/" + warden_id);
  }
  user.block = newBlock;
  
  await user.save();
  //remove user from old block
  oldBlock.wardens = [];
  await oldBlock.save();
  //add user to new block
  newBlock.wardens[0]=user;
  await newBlock.save();
  res.redirect('/warden/profile/'+warden_id);
});



router.post(("/accept/:id"), async (req, res) => {
  const outing_id = req.params.id;
  const outing = await Outing.findById(outing_id);
  outing.approvedOn = new Date();
  const student_id = outing.requestedBy;
  const warden_id = outing.requestedTo;
  const student = await Student.findById(student_id).populate('pendingOutings').populate('activeOuting');
  const warden = await Warden.findById(warden_id).populate('pendingOutings').populate('approvedOutings');
  student.pendingOutings.remove(outing);
  warden.pendingOutings.remove(outing);
  student.activeOuting = outing;
  warden.approvedOutings.push(outing);
  await student.save();
  await warden.save();
  await outing.save();
  res.redirect("/warden/home/" + warden_id);
});

router.post(("/reject/:id"), async (req, res) => {
  const outing_id = req.params.id;
  const outing = await Outing.findById(outing_id);
  outing.approvedOn = new Date();
  const student_id = outing.requestedBy;
  const warden_id = outing.requestedTo;
  const student = await Student.findById(student_id).populate('pendingOutings').populate('rejectedOutings');
  const warden = await Warden.findById(warden_id).populate('pendingOutings').populate('rejectedOutings');
  student.pendingOutings.remove(outing);
  warden.pendingOutings.remove(outing);
  student.rejectedOutings.push(outing);
  warden.rejectedOutings.push(outing);
  await student.save();
  await warden.save();
  await outing.save();
  res.redirect("/warden/home/" + warden_id);
});


router.post(("/acceptAll/:id"), async (req, res) => {
  const warden_id = req.params.id;
  const warden = await Warden.findById(warden_id).populate('pendingOutings').populate('approvedOutings');
  for (let outing of warden.pendingOutings) {
    outing.approvedOn = new Date();
    const student_id = outing.requestedBy;
    const student = await Student.findById(student_id).populate('pendingOutings').populate('activeOuting');
    student.pendingOutings.remove(outing);
    student.activeOuting = outing;
    await student.save();
    await outing.save();
    // warden.pendingOutings.remove(outing);
    warden.approvedOutings.push(outing);
  }
  warden.pendingOutings = [];
  await warden.save();
  res.redirect("/warden/home/" + warden_id);
});


router.post(("/rejectAll/:id"), async (req, res) => {
  const warden_id = req.params.id;
  const warden = await Warden.findById(warden_id).populate('pendingOutings').populate('approvedOutings');
  for (let outing of warden.pendingOutings) {
    outing.approvedOn = new Date();
    const student_id = outing.requestedBy;
    const student = await Student.findById(student_id).populate('pendingOutings').populate('activeOuting');
    student.pendingOutings.remove(outing);
    student.rejectedOutings.push(outing);
    await student.save();
    await outing.save();
    // warden.pendingOutings.remove(outing);
    warden.rejectedOutings.push(outing);
  }
  warden.pendingOutings = [];
  await warden.save();
  res.redirect("/warden/home/" + warden_id);
});

router.route("/detailedActive/:outingid").get(async (req, res) => {
  outing_id = req.params.outingid;
  const isStudent = false;
  const outing = await Outing.findById(outing_id).populate('requestedTo').populate('requestedBy');
  warden_id = outing.requestedTo;
  const user = await Warden.findById(warden_id).populate('block');
  res.render("components/detailedActive", { user ,outing,isStudent});
});


router.route("/detailedPending/:outingid").get(async (req, res) => {
  outing_id = req.params.outingid;
  const isStudent = false;
  const outing = await Outing.findById(outing_id).populate('requestedTo').populate('requestedBy');
  warden_id = outing.requestedTo;
  const user = await Warden.findById(warden_id).populate('block');
  res.render("components/detailedPending", { user ,outing,isStudent});
});


router.route("/detailedDone/:outingid").get(async (req, res) => {
  outing_id = req.params.outingid;
  const isStudent = false;
  const outing = await Outing.findById(outing_id).populate('requestedTo').populate('requestedBy');
  warden_id = outing.requestedTo;
  const user = await Warden.findById(warden_id).populate('block');
  res.render("components/detailedDone", { user ,outing,isStudent});
});

router.route("/pending/:id").get(async (req, res) => {
  warden_id = req.params.id;
  const user = await Warden.findById(warden_id).populate('block').populate({ path: 'pendingOutings', populate: { path: 'requestedBy' } });
  const pendingOutings = user.pendingOutings;
  res.render("warden/pending",{user,pendingOutings});
});

router.route("/approved/:id").get(async (req, res) => {
  const warden_id = req.params.id;
  const user = await Warden.findById(warden_id).populate('block').populate({ path:'approvedOutings',populate:{ path: 'requestedBy' } });
  const approvedOutings = user.approvedOutings;
  res.render("warden/approved",{user,approvedOutings});
});

router.route("/rejected/:id").get(async (req, res) => {
  const warden_id = req.params.id;
  const user = await Warden.findById(warden_id).populate('block').populate({path:'rejectedOutings',populate:{ path: 'requestedBy'}});
  const rejectedOutings = user.rejectedOutings;
  res.render("warden/rejected",{user,rejectedOutings});
});

router.route("/studentsList/:id").get(async (req, res) => {
  const warden_id = req.params.id;
  const user = await Warden.findById(warden_id).populate('block');
  const block = await Block.findById(user.block).populate('students');
  const students = block.students;
  res.render("warden/studentsList",{user,students});
});

router.route("/:id/detailedStudent/:student_id").get(async (req, res) => {
  const warden_id = req.params.id;
  const user = await Warden.findById(warden_id).populate('block');
  const student_id = req.params.student_id;
  const student = await Student.findById(student_id);
  res.render("warden/detailedStudent",{user,student});
});



router.get('*', function (req, res) {
  res.redirect(("/auth/login"));
})

module.exports = router;
