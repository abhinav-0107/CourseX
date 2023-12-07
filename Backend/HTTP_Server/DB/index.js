const mongoose = require("mongoose");

// Defining user, admin and course's schemas.
const userSchema = new mongoose.Schema({
  username: { type: String },
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Courses" }], // Array whose is referencing the Courses collection.
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  publish: Boolean,
});

// Defining the mongoose Model/collections.
const USERS = mongoose.model("Users", userSchema);
const ADMINS = mongoose.model("Admin", adminSchema);
const COURSES = mongoose.model("Courses", courseSchema);

module.exports = {
  USERS,
  ADMINS,
  COURSES,
};
