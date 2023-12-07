const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { ADMINS, COURSES } = require("../DB/index");
const { authenticateAdminJwt, adminSecret } = require("../Middlewares/auth");
const cors = require("cors");

const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(bodyParser.json());

function generateAdminJwt(admin) {
  const payload = admin;
  return jwt.sign(payload, adminSecret, { expiresIn: "1h" });
}

router.get("/me", authenticateAdminJwt, (req, res) => {
  // logic to get the admin username
  res.json({ username: req.admin.username });
});

router.post("/signup", async (req, res) => {
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

router.post("/login", async (req, res) => {
  // logic to login admin
  const admin = req.body;
  let Admin = await ADMINS.findOne({
    username: admin.username,
    password: admin.password,
  });
  
  if (Admin) {
    const token = generateAdminJwt(admin);
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Admin Authentication Failed!" });
  }
});

router.post("/courses", authenticateAdminJwt, async (req, res) => {
  // logic to create a course
  const course = req.body;
  console.log(course);
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

router.put("/courses/:courseId", authenticateAdminJwt, async (req, res) => {
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
      res.status(411).json({ message: "Course does not exist!" });
    }
  }
);

router.delete("/courses/:courseId", authenticateAdminJwt, async (req, res) => {
  // logic to delete a course
  const courseId = req.params.courseId;
  await COURSES.findByIdAndDelete(courseId);
  res.json({ message: "Course deleted successfully!" });
}
);

router.get("/courses", authenticateAdminJwt, async (req, res) => {
  // logic to get all courses
  const courses = await COURSES.find({ });
  res.json({ courses });
});

router.get("/courses/:courseId", authenticateAdminJwt, async (req, res) => {
    // logic to get a particular course
    const courseId = req.params.courseId;
    const requiredCourse = await COURSES.findById(courseId);
    res.json({ course: requiredCourse });
  }
);

module.exports = router;
