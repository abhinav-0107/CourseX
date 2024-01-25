import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import courseState from "../store/atoms/course";
import { useSetRecoilState } from "recoil";
import {BASE_URL} from "../config";
import { Card, Typography, CardMedia, ButtonBase } from "@mui/material";

function Courses() {
  const [courses, setCourses] = useState([]);

  async function getCourses() {
    const response = await axios.get(`${BASE_URL}/admin/courses`, {
      headers: {
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = response.data;
    setCourses(data.courses);
  }

  useEffect(() => {
    getCourses();
  }, []);

  if (!courses.length) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
        No course to dispaly!
      </div>
    );
  }

  return (
    <div
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
    >
      {courses.map((course) => {
        return <CourseCard course={course} />;
      })}
    </div>
  );
}

function CourseCard(props) {
  const navigate = useNavigate();
  const setCourse = useSetRecoilState(courseState);
  
  return (
      <ButtonBase
        onClick={() => {
          setCourse((prevCourseState) => ({
            ...prevCourseState,
            isLoading : true
          }));
          navigate(`/course/${props.course._id}`);
        }}
      >
        <Card style={{ width: 300, height: 340, margin: 20, padding: 5 }}>
          <Typography textAlign={"center"} variant="h6">
            {props.course.title}
          </Typography>
          <Typography textAlign={"center"} variant="subtitle1">
            {props.course.description}
          </Typography>
          <br />

          <CardMedia
            component="img"
            alt="Course Image"
            height="200"
            src={props.course.imageLink}
          />

          <br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography> ₹{props.course.price} </Typography>
            <Typography>
              {props.course.publish ? (
                <Typography style={{ color: "green" }}>Published</Typography>
              ) : (
                <Typography style={{ color: "red" }}>Not Published</Typography>
              )}
            </Typography>
          </div>
        </Card>
      </ButtonBase>
  );
}

export default Courses;
