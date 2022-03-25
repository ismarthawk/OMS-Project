const mongoose = require("mongoose");
module.exports = async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");
  } catch (error) {
    console.log("Error connecting to database!");
    console.error(error);
  }
};
