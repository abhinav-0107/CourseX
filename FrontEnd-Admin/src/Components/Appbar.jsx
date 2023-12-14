import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import userEmailState from "../store/selectors/userEmail";

function Appbar() {
  const navigate = useNavigate();
  const username = useRecoilValue(userEmailState);
  
  if (username) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 15,
          background: "LightGray",
        }}
      >
        <div style={{ display: "flex" }}>
          <Typography variant="h5">Course-X &nbsp;|</Typography>
          <Typography variant="h6">&nbsp;&nbsp;Admin</Typography>
        </div>
        <div>
          <b>{username}&nbsp;&nbsp;&nbsp;</b>
          {/* Logout button */}
          <Button
            variant="contained"
            onClick={() => {
              // Conditional Alert
              if (confirm("Are you sure you want to logout?")) {
                localStorage.setItem("token", null);
                window.location = "/";
              }
            }}
          >
            Log Out
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 15,
          background: "LightGray",
        }}
      >
        <div style={{ display: "flex" }}>
          <Typography variant="h5">Course-X&nbsp;|</Typography>
          <Typography variant="h6">&nbsp;&nbsp;Admin</Typography>
        </div>
        <div>
          {/* SignIn button */}
          <Button
            variant="contained"
            style={{ marginRight: 10 }}
            onClick={() => {
              navigate("/signup");
            }}
          >
            Sign Up
          </Button>

          {/* Login button */}
          <Button
            variant="contained"
            onClick={() => {
              navigate("/login");
            }}
          >
            Log In
          </Button>
        </div>
      </div>
    );
  }
}

export default Appbar;
