const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  regNumber: {
    type: Number,
    required: true,
    maxLength: 6,
  },
  rollNumber: {
    type: Number,
    required: true,
    maxLength: 6,
  },
  year: {
    type: Number,
    required: true,
    maxLength: 1,
  },
  branch: {
    type: String,
    enum: [
      "Biotech",
      "Chemical",
      "Civil",
      "CSE",
      "ECE",
      "EEE",
      "Mechanical",
      "MME",
    ],
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  Block: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Block",
  },
  roomNumber: {
    type: String,
  },
  mail: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
    maxLength: 10,
  },
  parentMobileNumber: {
    type: Number,
    required: true,
    maxLength: 10,
  },
  password: {
    type: String,
    required: true,
  },
  pendingOutings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outing",
    },
  ],
  usedOutings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outing",
    },
  ],
  activeOuting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Outing",
  },
  rejectedOutings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outing",
    },
  ],
  inCampus: {
    type: Boolean,
    default: true,
    required: true,
  },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
