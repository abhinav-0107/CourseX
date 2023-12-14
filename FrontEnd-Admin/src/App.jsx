import axios from "axios";
import { useEffect } from "react";
import BASE_URL from "./config.js";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Appbar from "./Components/Appbar";
import Signup from "./Components/Signup";
import Course from "./Components/Course";
import Courses from "./Components/Courses";
import AddCourse from "./Components/Addcourse";
import AdminDashboard from "./Components/AdminDashboard";
import userState from "./store/atoms/users";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <RecoilRoot>
      <div style={{ width: "100vw", height: "100vh", background: "#f0f0f0" }}>
        <Router>
          <Appbar />
          <InitUser />
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
    </RecoilRoot>
  );
}

// Initializing User
function InitUser() {
  const setUser = useSetRecoilState(userState);
  const User = useRecoilValue(userState);

  async function init() {
    try {
      const response = await axios.get(`${BASE_URL}/admin/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      
      if (data.username) {
        setUser({
          isLoading: false,
          userEmail: data.username
      })
      } else {
        setUser({
          isLoading: false,
          userEmail: null,
        });
      }
    } catch {
      setUser({
        isLoading: false,
        userEmail: null,
      });
    }
  }

  useEffect(() => {
    init();
  }, []);

  return <></>;
}

export default App;
