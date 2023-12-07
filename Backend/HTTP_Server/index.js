const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const adminRouter = require("./Routes/admin");
const userRouter = require("./Routes/user");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRouter);
app.use("/users", userRouter);

// Connect to DB
mongoose.connect(
  "mongodb+srv://abhinavsinghbiz:SE5rzjkjuivW3vlL@cluster0.wsvcgox.mongodb.net/",
  { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" }
);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
