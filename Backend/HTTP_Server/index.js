const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(bodyParser.json());

// Separate secrets for Admin and User.
const adminSecret = "S3cr3T";
const userSecret = "Sup3rS3cr3T";

let ADMINS = [];
let USERS = [];
let COURSES = [];

function generateAdminJwt(admin) {
  const payload = admin;
  return jwt.sign(payload, adminSecret, { expiresIn: "1h" });
}

// Middleware for authenticating Admin's Jwt
function authenticateAdminJwt(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, adminSecret, (err, admin) => {
    if (err) throw err;
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
    req.user = user; // gets used while purchasing a course
    next();
  });
}

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  let adminExist = ADMINS.find((a) => a.username === admin.username) === admin;

  if (adminExist) {
    res.status(403).json({ message: "Admin already exist!" });
  } else {
    ADMINS.push(admin);
    const token = generateAdminJwt(admin);
    res.json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", (req, res) => {
  // logic to login admin
  const admin = req.body;
  let Admin = ADMINS.find(
    (a) => a.username === admin.username && a.password === admin.password
  );

  if (Admin) {
    const token = generateAdminJwt(admin);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Admin Authentication Failed!" });
  }
});

app.post("/admin/courses", authenticateAdminJwt, (req, res) => {
  // logic to create a course
  const course = req.body;

  if (!course.title) {
    res.status(411).json({ message: "Please enter course title!" });
  }
  if (!course.price) {
    res.status(411).json({ message: "Please enter the course price!" });
  }
  course.id = Date.now();
  COURSES.push(course);
  res.json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", authenticateAdminJwt, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const newCourse = req.body;
  const Index = COURSES.findIndex((element) => element.id === courseId);

  if (Index != -1) {
    newCourse.id = courseId;
    COURSES[Index] = newCourse;
    res.json({ message: "Course updated successfully!" });
  } else {
    res.status(411).json({ message: "Course does not exist!" });
  }
});

app.get("/admin/courses", authenticateAdminJwt, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const user = { ...req.body, purchasedCoursesId: [] };
  let userExist = USERS.find((u) => u.username === user.username) === user;

  if (userExist) {
    res.status(403).json({ message: "User already exist!" });
  } else {
    USERS.push(user);
    const token = generateUserJwt(user);
    res.json({ message: "User created successfully", token });
  }
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const credentialSendByClient = req.body;
  let user = USERS.find(
    (u) =>
      u.username === credentialSendByClient.username &&
      u.password === credentialSendByClient.password
  );

  if (user) {
    const token = generateUserJwt(user);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "User Authentication Failed!" });
  }
});

app.get("/users/courses", authenticateUserJwt, (req, res) => {
  // logic to list all courses
  res.send({ courses: COURSES.filter((c) => c.published) });
});

app.post("/users/courses/:courseId", authenticateUserJwt, (req, res) => {
  // logic to purchase a course
  const { username } = req.user;
  const courseIdToPurchase = parseInt(req.params.courseId);
  const courseToPurchase = COURSES.find(
    (c) => c.id === courseIdToPurchase && c.published
  );

  if (courseToPurchase) {
    const user = USERS.find((u) => u.username === username);
    user.purchasedCoursesId.push(courseIdToPurchase);
    res.json({ message: "Course purchased successfully" });
  } else {
    res.status(404).json({ message: "Please enter a valid course ID!" });
  }
});

app.get("/users/purchasedCourses", authenticateUserJwt, (req, res) => {
  // logic to view purchased courses
  const { username } = req.user;
  const user = USERS.find((u) => u.username === username); //Ids of all the purchaed courses by this user!
  const purchasedCoursesIds = user.purchasedCoursesId;

  if (purchasedCoursesIds.length) {
    let purchasedCourses = [];
    for (let i = 0; i < COURSES.length; i++) {
      if (purchasedCoursesIds.indexOf(COURSES[i].id) != -1) {
        purchasedCourses.push(COURSES[i]);
      }
    }
    res.json({ purchasedCourses });
  } else {
    res.status(411).json({ message: "No course purchased to display!" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});