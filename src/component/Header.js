import { AccountCircle, NotificationsActiveRounded } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  IconButton,
  Popover,
  Toolbar,
  Typography,
  makeStyles,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Urlconstant } from "../constant/Urlconstant";

export default function Header() {
  const location = useLocation();
  const email = location.state && location.state.email;
  const [notification, setNotification] = useState([]);
  const [count, setCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    if (email) {



      axios(Urlconstant.url + `api/notification?email=${email}`)
        .then((res) => {
          setNotification(res.data);
          console.log(res.data);
          setCount(res.data.length);
        })
        .catch((e) => {});
    }
  }, [email]);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const NotificationClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const popup = () => {
    return (
      <div>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Typography sx={{ p: 2 }}>
            <div>
              <p
                style={{
                  backgroundColor: "blue",
                  marginTop: "-1rem",
                  textAlign: "center",
                  marginLeft: "-20px",
                  marginRight: "-2rem",
                  padding: "0.5rem 0.5rem",
                  color: "white",
                }}
              >
                Today followUp candidates
              </p>
            </div>
            <div
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                marginRight: "-1rem",
              }}
            >
              {notification
                ? notification.map((v, k) => (
                    <p key={k}>
                      {v ? (
                        <Link
                          to={`/x-workz/profile/${v.basicInfo.email}`}
                          style={{ color: "blue", fontSize: "14px" }}
                        >
                          {v.basicInfo.traineeName} &nbsp;
                        </Link>
                      ) : null}
                      {v.basicInfo.email}
                    </p>
                  ))
                : ""}
            </div>
          </Typography>
        </Popover>
      </div>
    );
  };

  const notificationDisplay = () => {
    return (
      <div>
        <IconButton
          variant="contained"
          color="inherit"
          aria-label="Notification"
          onClick={NotificationClick}
          aria-describedby={id}
        >
          <Badge badgeContent={count} color="warning">
            <NotificationsActiveRounded />
          </Badge>
        </IconButton>
      </div>
    );
  };

  return (
    <>
      <div>
        <AppBar sx={{ background: "#070606" }} spacing={10}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="logo">
              <a href="https://www.x-workz.in/Logo.png">
                <img
                  src="https://www.x-workz.in/Logo.png"
                  width={60}
                  height={40}
                  alt="Logo"
                ></img>
              </a>
            </IconButton>

            <Link to="/x-workz/view">Home</Link>
            <Typography variant="h6" component="div" sx={{ flexGrow: 6 }}>
              <AccountCircle
                sx={{ color: "action.active", marginRight: "8px" }}
              />
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {sessionStorage.getItem("userId", email)}
            </Typography>

            {notificationDisplay()}
            {popup()}
            <Avatar>X</Avatar>
            <br></br>
            <Link to="/x-workz/login">Logout</Link>
          </Toolbar>
        </AppBar>
      </div>
    </>
  );
}
