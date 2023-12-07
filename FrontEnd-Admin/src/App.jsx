import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddCourse from "./Components/Addcourse";
import Courses from "./Components/Courses";
import Appbar from "./Components/Appbar";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Course from "./Components/Course";
import Home from "./Components/Home";
import AdminDashboard from "./Components/AdminDashboard";

function App() {
  return (
      <div style={{ width: "100vw", height: "100vh", background: "#f0f0f0" }}>
        <Router>
          <Appbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/addcourse" element={<AddCourse />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:courseId" element={<Course />} />
          </Routes>
        </Router>
      </div>
  );
}

export default App;
