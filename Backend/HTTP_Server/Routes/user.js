const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { USERS, COURSES } = require("../DB/index");
const { authenticateUserJwt, userSecret } = require("../Middlewares/auth");
const cors = require("cors");

const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(bodyParser.json());

function generateUserJwt(user) {
  const payload = user;
  return jwt.sign(payload, userSecret, { expiresIn: "1h" });
}

router.post("/signup", async (req, res) => {
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

router.post("/login", async (req, res) => {
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

router.get("/courses", authenticateUserJwt, async (req, res) => {
  // logic to list all courses
  const courses = await COURSES.find({ published: true });
  res.send({ courses });
});

router.post( "/courses/:courseId", authenticateUserJwt, async (req, res) => {
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
  }
);

router.get("/purchasedCourses", authenticateUserJwt, async (req, res) => {
  // logic to view purchased courses
  const { username } = req.user;
  const user = await USERS.findOne({ username }).populate("purchasedCourses");

  if (user.purchasedCourses.length) {
    res.json({ purchasedCourses: user.purchasedCourses });
  } else {
    res.status(411).json({ message: "No course purchased yet!" });
  }
});

module.exports = router;
