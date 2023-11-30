const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(express.json());
app.use(bodyParser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin Authentication middleware
const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  let Admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );
  if (Admin) {
    next();
  } else {
    res.json({ message: "Admin Authentication Failed!" });
  }
};

// User Authentication middleware
const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  let User = USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (User) {
    req.user = User; // Add user object to the request // User is passed by reference so any change in req.user will be reflected in USERS array!
    next();
  } else {
    res.json({ message: "User Authentication Failed!" });
  }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  let adminExist = ADMINS.find((a) => a.username === admin.username);

  if (adminExist) {
    res.status(403).json({ message: "Admin already exist!" });
  } else {
    ADMINS.push(admin);
    res.json({ message: "Admin created successfully" });
  }
});

app.post("/admin/login", adminAuthentication, (req, res) => {
  // logic to log in admin
  res.json({ message: "Logged in successfully" });
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
  // logic to create a course
  const course = req.body;
  if (!course.title) {
    res.status(411).json({ message: "Please enter course title!" });
  }
  if (!course.price) {
    res.status(411).json({ message: "Please enter the course price!" });
  }
  course.id = Date.now(); // use timestamp as course ID
  COURSES.push(course);
  res.json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
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

app.get("/admin/courses", adminAuthentication, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const user = { ...req.body, purchasedCoursesId: [] };
  let userExist = USERS.find((u) => u.username === user.username);

  if (userExist) {
    res.status(403).json({ message: "User already exist!" });
  } else {
    USERS.push(user);
    res.json({ message: "User created successfully" });
  }
});

app.post("/users/login", userAuthentication, (req, res) => {
  // logic to log in user
  res.json({ message: "Logged in successfully" });
});

app.get("/users/courses", userAuthentication, (req, res) => {
  // logic to list all courses
  res.send({ courses: COURSES.filter((c) => c.published) });
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  // logic to purchase a course
  const courseIdToPurchase = parseInt(req.params.courseId);
  const courseToPurchase = COURSES.find(
    (c) => c.id === courseIdToPurchase && c.published
  );
  if (courseToPurchase) {
    req.user.purchasedCoursesId.push(courseIdToPurchase);
    res.json({ message: "Course purchased successfully" });
  } else {
    res.status(404).json({ message: "Please enter a valid course ID!" });
  }
});

app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
  // logic to view purchased courses
  const purchasedCoursesIds = req.user.purchasedCoursesId; //Ids of all the purchaed courses!
  if (purchasedCoursesIds.length != 0) {
    let purchasedCourses = [];
    for (let i = 0; i < COURSES.length; i++) {
      if (purchasedCoursesIds.indexOf(COURSES[i].id) != -1) {
        purchasedCourses.push(COURSES[i]);
      }
    }
    res.json({ purchasedCourses: purchasedCourses });
  } else {
    res.status(411).json({ message: "No course purchased to display!" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});