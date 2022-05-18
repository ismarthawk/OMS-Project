const express = require("express");
const router = express.Router();
const Warden = require("../models/warden");
const Outing = require("../models/outing");
const Student= require("../models/student");

router.route("/home/:id").get(async(req, res) => {
  warden_id = req.params.id;
  const user = await Warden.findById(warden_id).populate('block').populate('pendingOutings').populate('approvedOutings').populate('rejectedOutings');
  const pendingOutings = user.pendingOutings.slice(0,5);
  const approvedOutings = user.approvedOutings.slice(0,2);
  const rejectedOutings = user.rejectedOutings.slice(0,2);
  res.render("warden/home",{user,pendingOutings,approvedOutings,rejectedOutings});
});


router.route("/profile/:id").get(async (req, res) => {
  student_id = req.params.id;
  const user = await Warden.findById(student_id).populate('block');
  res.render("warden/profile",{user});
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
  const outing = await Outing.findById(outing_id).populate('requestedTo');
  warden_id = outing.requestedTo;
  const user = await Warden.findById(warden_id).populate('block');
  res.render("components/detailedActive", { user ,outing});
});


router.route("/detailedPending/:outingid").get(async (req, res) => {
  outing_id = req.params.outingid;
  const outing = await Outing.findById(outing_id).populate('requestedTo');
  warden_id = outing.requestedTo;
  const user = await Warden.findById(warden_id).populate('block');
  res.render("components/detailedPending", { user ,outing});
});


router.route("/detailedDone/:outingid").get(async (req, res) => {
  outing_id = req.params.outingid;
  const outing = await Outing.findById(outing_id).populate('requestedTo');
  warden_id = outing.requestedTo;
  const user = await Warden.findById(warden_id).populate('block');
  res.render("components/detailedDone", { user ,outing});
});

router.route("/pending/:id").get(async (req, res) => {
  warden_id = req.params.id;
  const user = await Warden.findById(warden_id).populate('block').populate('pendingOutings');
  const pendingOutings = user.pendingOutings;
  res.render("warden/pending",{user,pendingOutings});
});

router.route("/approved/:id").get(async (req, res) => {
  const warden_id = req.params.id;
  const user = await Warden.findById(warden_id).populate('block').populate('approvedOutings');
  const approvedOutings = user.approvedOutings;
  res.render("warden/approved",{user,approvedOutings});
});

router.route("/rejected/:id").get(async (req, res) => {
  const warden_id = req.params.id;
  const user = await Warden.findById(warden_id).populate('block').populate('rejectedOutings');
  const rejectedOutings = user.rejectedOutings;
  res.render("warden/rejected",{user,rejectedOutings});
});



router.get('*', function (req, res) {
  res.redirect(("/auth/login"));
})

module.exports = router;
