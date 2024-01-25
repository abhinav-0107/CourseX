import axios from "axios";
import { useState } from "react";
import {BASE_URL} from "../config";
import {
  Typography,
  Card,
  TextField,
  Button,
  FormGroup,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

function AddCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(null);
  const [publish, setPublish] = useState(false);
  const [imageLink, setImageLink] = useState("");

  return (
    <>
      {/* Text above the card */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            paddingTop: 150,
            marginBottom: 20,
          }}
        >
          <Typography variant={"h5"}>Add courses for the users</Typography>
        </div>
      </div>

      {/* Input Card */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Card variant="outlined" style={{ width: 350, padding: 25 }}>
          {/* Title Input */}
          <TextField
            label={"Title"}
            variant={"outlined"}
            type={"text"}
            fullWidth={true}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />

          <br />
          <br />

          {/* Description Input */}
          <TextField
            label={"Description"}
            variant={"outlined"}
            type={"text"}
            fullWidth={true}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />

          <br />
          <br />

          {/* Image link Input */}
          <TextField
            label={"Image link"}
            variant={"outlined"}
            type={"text"}
            fullWidth={true}
            onChange={(event) => {
              setImageLink(event.target.value);
            }}
          />

          <br />
          <br />

          {/* Price Input */}
          <TextField
            label={"Price"}
            variant={"outlined"}
            type={"number"}
            fullWidth={true}
            onChange={(event) => {
              setPrice(event.target.value);
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
                      setPublish(event.target.checked);
                    }}
                  />
                }
                label="Publish"
              />
            </FormGroup>

            {/* Add course button */}
            <Button
              variant="contained"
              size="large"
              onClick={async () => {
                const response = await axios.post(
                  `${BASE_URL}/admin/courses`,
                  {
                    title,
                    description,
                    imageLink,
                    price,
                    publish
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + localStorage.getItem("token"),
                    }
                  }
                );
                const data = response.data;
                alert(data.message);
              }}
            >
              Add Course
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

export default AddCourse;
