import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import Loading from "./Loading";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import courseState from "../store/atoms/course";
import {BASE_URL} from "../config";
import {
  courseTitle,
  isEditing,
  courseDescription,
  coursePrice,
  courseImageLink,
  isCourseLoading
} from "../store/selectors/course";
import {
  Card,
  Typography,
  CardMedia,
  Button,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  ButtonBase,
} from "@mui/material";

function Course() {
  const { courseId } = useParams();
  const IsEditing = useRecoilValue(isEditing);
  const IsLoading = useRecoilValue(isCourseLoading);
  const setCourse = useSetRecoilState(courseState);

  async function getCourse() {
    const response = await axios.get(
      `${BASE_URL}/admin/courses/${courseId}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    const courseDetail = response.data;
    setTimeout(() => {
      setCourse({
        course : courseDetail.course,
        isLoading : false,
        isEditing : false
      });
    }, 350);
  }

  useEffect(() => {
    getCourse();
  }, []);

  if(IsLoading){
    return <Loading/>
  }

  return (
    <div>
      <GrayTopper/>
      <CourseCard/>
      {IsEditing ? <UpdateCard/> : null}
    </div>
  );
}

function CourseCard() {
  const navigate = useNavigate();
  const setIsEditing = useSetRecoilState(courseState);
  const title = useRecoilValue(courseTitle);
  const description = useRecoilValue(courseDescription);
  const price = useRecoilValue(coursePrice);
  const imageLink = useRecoilValue(courseImageLink);
  const { courseId } = useParams();

  return (
    <Card
    style={{
      width: 300,
      height: 340,
      margin: 40,
      padding: 5,
    }}
  >
    <Typography textAlign={"center"} variant="h6">
      {title}
    </Typography>
    <Typography textAlign={"center"} variant="subtitle1">
      {description}
    </Typography>

    <br />

    <CardMedia
      component="img"
      alt="Course Image"
      height="200"
      src={imageLink}
    />

    <br />

    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Typography>₹{price}</Typography>
      <div>
        {/* Delete Button */}
        <Button
          style={{ marginRight: 10 }}
          variant="contained"
          size="large"
          onClick={async () => {
            if (confirm("Are you sure you want to DELETE this course?")) {
              await axios.delete(
                `${BASE_URL}/admin/courses/${courseId}`,
                {
                  headers: {
                    Authorization:
                      "Bearer " + localStorage.getItem("token"),
                  },
                }
              );
              navigate("/courses");
              alert("This course was DELETED!");
            }
          }}
        >
          Delete
        </Button>

        {/* Edit Button */}
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            setIsEditing((prevCourseState) => ({
              ...prevCourseState,
              isEditing : true
            }));
          }}
        >
          Edit
        </Button>
      </div>
    </div>
  </Card>
  )
}

function GrayTopper() {
  const title = useRecoilValue(courseTitle);

  return (
    <div
      style={{
        height: 250,
        width: "100vw",
        background: "#212121",
        marginBottom: -250,
      }}
    >
      <div
        style={{
          height: 250,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          style={{ fontWeight: 600, color: "white" }}
          textAlign={"center"}
          variant={"h2"}
        >
           {title}
        </Typography>
      </div>
    </div>
  );
}

function UpdateCard() {
  const { courseId } = useParams();
  const [course,setCourse] = useRecoilState(courseState);
  const [UpdatedTitle, setUpdatedTitle] = useState(course.course.title);
  const [UpdatedDescription, setUpdatedDescription] = useState(course.course.description);
  const [UpdatedPrice, setUpdatedPrice] = useState(course.course.price);
  const [UpdatedPublish, setUpdatedPublish] = useState(course.course.publish);
  const [UpdatedImageLink, setUpdatedImageLink] = useState(course.course.imageLink);

  return (
    <div style={{ marginTop: -150 }}>
      {/* Input Card */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Card variant="outlined" style={{ width: 350, padding: 25 }}>
          {/* Edit card close button */}
          <div
            style={{
              display: "flex",
              justifyContent: "Space-between",
              marginBottom: 10,
            }}
          >
            <Typography
              style={{ marginLeft: 100, marginBottom: 10, fontWeight: 550 }}
              variant={"h6"}
            >
              Update course
            </Typography>
            <ButtonBase
              onClick={() => {
                setCourse((prevCourseState) => ({
                  ...prevCourseState,
                  isEditing : false
                }));
              }}
            >
              <CloseIcon />
            </ButtonBase>
          </div>

          {/* Title Input */}
          <TextField
            value={UpdatedTitle}
            label={"Updated title"}
            variant={"outlined"}
            type={"text"}
            fullWidth={true}
            onChange={(event) => {
              setUpdatedTitle(event.target.value);
            }}
          />

          <br />
          <br />

          {/* Description Input */}
          <TextField
            value={UpdatedDescription}
            label={"Updated description"}
            variant={"outlined"}
            type={"text"}
            fullWidth={true}
            onChange={(event) => {
              setUpdatedDescription(event.target.value);
            }}
          />

          <br />
          <br />

          {/* Image link Input */}
          <TextField
            value={UpdatedImageLink}
            label={"Updated image link"}
            variant={"outlined"}
            type={"text"}
            fullWidth={true}
            onChange={(event) => {
              setUpdatedImageLink(event.target.value);
            }}
          />

          <br />
          <br />

          {/* Price Input */}
          <TextField
            value={UpdatedPrice}
            label={"Updated price"}
            variant={"outlined"}
            type={"number"}
            fullWidth={true}
            onChange={(event) => {
              setUpdatedPrice(event.target.value);
            }}
          />

          <br />
          <br />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* Publish Checkbox */}
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(event) => {
                      setUpdatedPublish(event.target.checked);
                    }}
                  />
                }
                label="Publish"
                checked={UpdatedPublish}
              />
            </FormGroup>

            {/* Add course button */}
            <Button
              variant="contained"
              size="large"
              onClick={async () => {
                const response = await axios.put(
                  `${BASE_URL}/admin/courses/${courseId}`,
                  {
                    title: UpdatedTitle,
                    description: UpdatedDescription,
                    publish: UpdatedPublish,
                    price: UpdatedPrice,
                    imageLink: UpdatedImageLink,
                  },
                  {
                    headers: {
                      Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                  }
                );
                const data = response.data;

                const updatedCourse = {
                  title: UpdatedTitle,
                  description: UpdatedDescription,
                  price: UpdatedPrice,
                  imageLink: UpdatedImageLink,
                  publish: UpdatedPublish,
                  id: courseId,
                };
                setCourse({
                  course : updatedCourse,
                  isLoading : true,
                  isEditing : false
                });
                alert(data.message);
              }}
            >
              Update Course
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Course;
