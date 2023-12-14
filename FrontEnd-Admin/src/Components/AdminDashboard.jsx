import { Card, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 150 }}>
      <Card
        style={{
          width: 320,
          height: 100,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <Button
            variant={"contained"}
            onClick={() => {
              navigate("/addcourse");
            }}
          >
            Add courses
          </Button>
          <Button
            variant={"contained"}
            onClick={() => {
              navigate("/courses");
            }}
          >
            All courses
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default AdminDashboard;