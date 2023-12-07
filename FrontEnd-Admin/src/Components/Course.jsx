import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
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
import axios from "axios";

function Course() {
  const navigate = useNavigate();
  const [course, setCourse] = useState({});
  const { courseId } = useParams();
  const [IsEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function getCourse() {
      const response = await axios.get(
        `http://localhost:3000/admin/courses/${courseId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const courseDetail = response.data;
      setCourse(courseDetail.course);
    }
    getCourse();
  }, []);

  return (
    <div>
      <GrayTopper title={course.title} />
      <Card
        style={{
          width: 300,
          height: 340,
          margin: 40,
          padding: 5,
        }}
      >
        <Typography textAlign={"center"} variant="h6">
          {course.title}
        </Typography>
        <Typography textAlign={"center"} variant="subtitle1">
          {course.description}
        </Typography>

        <br />

        <CardMedia
          component="img"
          alt="Course Image"
          height="200"
          src={course.imageLink}
        />

        <br />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>₹{course.price}</Typography>
          <div >
            <Button
              style={{marginRight : 10 }}
              variant="contained"
              size="large"
              onClick={async () => {
                if (confirm('Are you sure you want to DELETE this course?')) {
                  await axios.delete(
                    `http://localhost:3000/admin/courses/${courseId}`,
                    {
                      headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
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
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              Edit
            </Button>
          </div>
        </div>
      </Card>
      {IsEditing ? (
        <UpdateCard
          setCourse={setCourse}
          courseId={courseId}
          course={course}
          setIsEditing={setIsEditing}
        />
      ) : null}
    </div>
  );
}

function GrayTopper(props) {
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
          style={{ fontweight: 600, color: "white" }}
          textAlign={"center"}
          variant={"h2"}
        >
          {props.title}
        </Typography>
      </div>
    </div>
  );
}

function UpdateCard(props) {
  const [UpdatedTitle, setUpdatedTitle] = useState(props.course.title);
  const [UpdatedDescription, setUpdatedDescription] = useState(
    props.course.description
  );
  const [UpdatedPrice, setUpdatedPrice] = useState(props.course.price);
  const [UpdatedPublish, setUpdatedPublish] = useState(props.course.publish);
  const [UpdatedImageLink, setUpdatedImageLink] = useState(
    props.course.imageLink
  );

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
                props.setIsEditing(false);
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
                  `http://localhost:3000/admin/courses/${props.courseId}`,
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
                  id: props.courseId,
                };
                props.setCourse(updatedCourse);
                props.setIsEditing(false);
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
