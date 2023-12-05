const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = express();
const cors = require("cors");
const fs = require("fs");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Separate secrets for Admin and User.
const adminSecret = "S3cr3T";
const userSecret = "Sup3rS3cr3T";

// Defining schemas of user, admin and course collection.
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
  published: Boolean,
});

// Defining the mongoose Model/collections.
const USERS = mongoose.model("Users", userSchema);
const ADMINS = mongoose.model("Admin", adminSchema);
const COURSES = mongoose.model("Courses", courseSchema);

function generateAdminJwt(admin) {
  const payload = admin;
  return jwt.sign(payload, adminSecret, { expiresIn: "1h" });
}

// Middleware for authenticating Admin's Jwt
function authenticateAdminJwt(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, adminSecret, (err, admin) => {
    if (err) throw err;
    req.admin = admin;
    next();
  });
}

function generateUserJwt(user) {
  const payload = user;
  return jwt.sign(payload, userSecret, { expiresIn: "1h" });
}

// Middleware for authenticating User's Jwt
function authenticateUserJwt(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, userSecret, (err, user) => {
    if (err) throw err;
    req.user = user;
    next();
  });
}

// Connect to DB
mongoose.connect(
  "mongodb+srv://USE_YOUR_CONNECTION_STRING.net/",
  { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" }
);

// Admin routes

app.get("/admin/me", authenticateAdminJwt, (req, res) => {
  // logic to get the admin username
  res.json({ username: req.admin.username });
});

app.post("/admin/signup", async (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  let adminExist = await ADMINS.findOne({ username: admin.username });

  if (adminExist) {
    res.status(403).json({ message: "Admin already exist!" });
  } else {
    const AdminToSave = new ADMINS(admin);
    await AdminToSave.save();
    const token = generateAdminJwt(admin);
    res.json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", async (req, res) => {
  // logic to login admin
  const admin = req.body;
  let Admin = await ADMINS.findOne({
    username: admin.username,
    password: admin.password,
  });
  console.log(Admin);
  if (Admin) {
    const token = generateAdminJwt(admin);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Admin Authentication Failed!" });
  }
});

app.post("/admin/courses", authenticateAdminJwt, async (req, res) => {
  // logic to create a course
  const course = req.body;

  if (!course.title) {
    res.status(411).json({ message: "Please enter course title!" });
  }
  if (!course.price) {
    res.status(411).json({ message: "Please enter the course price!" });
  }

  const courseToSave = new COURSES(course);
  await courseToSave.save();
  res.json({
    message: "Course created successfully",
    courseId: courseToSave.id,
  });
});

app.put("/admin/courses/:courseId", authenticateAdminJwt, async (req, res) => {
  // logic to edit a course
  const updatedCourse = req.body;
  const course = await COURSES.findByIdAndUpdate(
    req.params.courseId,
    updatedCourse,
    { new: true }
  );

  if (course) {
    res.json({ message: "Course updated successfully!" });
  } else {
    // Doubt, This is not working when i am sending a wrong id!
    res.status(411).json({ message: "Course does not exist!" });
  }
});

app.get("/admin/courses", authenticateAdminJwt, async (req, res) => {
  // logic to get all courses
  const courses = await COURSES.find({});
  res.json({ courses });
});

app.get("/admin/courses/:courseId", authenticateAdminJwt, async (req, res) => {
  // logic to get a particular course
  const courseId = req.params.courseId;
  const requiredCourse = await COURSES.findById(courseId);
  res.json({ course: requiredCourse });
});

// User routes
app.post("/users/signup", async (req, res) => {
  // logic to sign up user
  const user = req.body;
  let userExist = await USERS.findOne({ username: user.username });

  if (userExist) {
    res.status(403).json({ message: "User already exist!" });
  } else {
    const newUser = new USERS(user);
    await newUser.save();
    const token = generateUserJwt(user);
    res.json({ message: "User created successfully", token });
  }
});

app.post("/users/login", async (req, res) => {
  // logic to log in user
  const credentialByClient = req.body;
  let user = await USERS.findOne({
    username: credentialByClient.username,
    password: credentialByClient.password,
  });

  if (user) {
    const token = generateUserJwt({
      username: user.username,
      password: user.password,
    });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "User Authentication Failed!" });
  }
});

app.get("/users/courses", authenticateUserJwt, async (req, res) => {
  // logic to list all courses
  const courses = await COURSES.find({ published: true });
  res.send({ courses });
});

app.post("/users/courses/:courseId", authenticateUserJwt, async (req, res) => {
  // logic to purchase a course
  const { username } = req.user;
  const courseToPurchase = await COURSES.findOne({
    _id: req.params.courseId,
    published: true,
  });

  if (courseToPurchase) {
    const user = await USERS.findOne({ username });
    if (user) {
      user.purchasedCourses.push(courseToPurchase);
      await user.save();
      res.json({ message: "Course purchased successfully" });
    }
  } else {
    res.status(404).json({ message: "Please enter a valid course ID!" });
  }
});

app.get("/users/purchasedCourses", authenticateUserJwt, async (req, res) => {
  // logic to view purchased courses
  const { username } = req.user;
  const user = await USERS.findOne({ username }).populate("purchasedCourses");

  if (user.purchasedCourses.length) {
    res.json({ purchasedCourses: user.purchasedCourses });
  } else {
    res.status(411).json({ message: "No course purchased yet!" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
