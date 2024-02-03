import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Urlconstant } from "../constant/Urlconstant";

export default function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate(Urlconstant.navigate + "login");
  };
  return (
    <div>
      <h2 className="">Home</h2>
      <h3>Welcome to X-workz</h3>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleLogin}
      > 
        Login
      </Button>
    </div>
  );
}
