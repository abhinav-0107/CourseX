import axios from "axios";
import { useState } from "react";
import {BASE_URL} from "../config";
import { Typography, Card, TextField, Button } from "@mui/material";

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            paddingTop: 150,
            marginBottom: 20,
          }}
        >
          <Typography variant={"h5"}>
            Welcome back to Course-X. Log In below!
          </Typography>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Card style={{ width: 350, padding: 25 }}>
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            type={"email"}
            fullWidth={true}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <br />
          <br />
          <TextField
            id="outlined-basic"
            label="Password"
            variant="outlined"
            type={"password"}
            fullWidth={true}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <br />
          <br />
          <Button
            variant="contained"
            size="large"
            onClick={async () => {
              const response = await axios.post(`${BASE_URL}/admin/login`,{
                  username,
                  password,
              });
              
              const data = response.data;
              localStorage.setItem("token", data.token);
              window.location = "/AdminDashboard";
            }}
          >
            LogIn
          </Button>
        </Card>
      </div>
    </>
  );
}

export default Signin;
