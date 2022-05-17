const express = require("express");
const router = express.Router();
const Warden = require("../models/warden");
const Outing = require("../models/outing");
const Student= require("../models/student");

router.route("/home/:id").get(async(req, res) => {
  warden_id = req.params.id;
  const user = await Warden.findById(warden_id).populate('block').populate('pendingOutings');
  const pendingOutings = user.pendingOutings;
  res.render("warden/home",{user,pendingOutings});
});

router.post(("/accept/:id"), async (req, res) => {
  const outing_id = req.params.id;
  const outing = await Outing.findById(outing_id);
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
  res.redirect("/warden/home/" + warden_id);
});

router.post(("/reject/:id"), async (req, res) => {
  const outing_id = req.params.id;
  const outing = await Outing.findById(outing_id);
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
  res.redirect("/warden/home/" + warden_id);
});


router.post(("/acceptAll/:id"), async (req, res) => {
  const warden_id = req.params.id;
  const warden = await Warden.findById(warden_id).populate('pendingOutings').populate('approvedOutings');
  for (let outing of warden.pendingOutings) {
    const student_id = outing.requestedBy;
    const student = await Student.findById(student_id).populate('pendingOutings').populate('activeOuting');
    student.pendingOutings.remove(outing);
    student.activeOuting = outing;
    await student.save();
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
    const student_id = outing.requestedBy;
    const student = await Student.findById(student_id).populate('pendingOutings').populate('activeOuting');
    student.pendingOutings.remove(outing);
    student.rejectedOutings.push(outing);
    await student.save();
    // warden.pendingOutings.remove(outing);
    warden.rejectedOutings.push(outing);
  }
  warden.pendingOutings = [];

  await warden.save();
  res.redirect("/warden/home/" + warden_id);
});



module.exports = router;
