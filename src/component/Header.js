import { AccountCircle, NotificationsActiveRounded } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  IconButton,
  Popover,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Urlconstant } from "../constant/Urlconstant";

export default function Header() {
  const email = sessionStorage.getItem("userId");
  const [yesterDayCandidate, setYesterDayCandidate] = useState([]);
  const [todayDayCandidate, setTodayDayCandidate] = useState([]);
  const [afterFourDayCandidate, setAfterFourDayCandidate] = useState([]);
  const [count, setCount] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    if (email) {
      axios(Urlconstant.url + `api/notification?email=${email}`)
        .then((res) => {
          setYesterDayCandidate(res.data.yesterdayCandidates);
          setTodayDayCandidate(res.data.todayCandidates);
          setAfterFourDayCandidate(res.data.afterFourDayCandidates);
          setCount(
            res.data.yesterdayCandidates.length +
              res.data.todayCandidates.length +
              res.data.afterFourDayCandidates.length
          );
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
            <div
              style={{
                maxHeight: "450px",
                overflowY: "auto",
                marginRight: "-1rem",
              }}
            >
              {todayDayCandidate ? (
                <div>
                  <div>
                    <p
                      style={{
                        backgroundColor: "white",
                        marginTop: "0.5rem",
                        textAlign: "center",
                        marginLeft: "-20px",
                        marginRight: "-2rem",
                        color: "green",
                        paddingBottom: "-6px",
                        fontStyle: "bold",
                      }}
                    >
                      Today followUp candidates
                    </p>
                    <div>
                      <div>
                        <hr style={{ paddingBottom: "-1rem" }}></hr>
                      </div>
                      {todayDayCandidate.map((v, k) => (
                        <p key={k}>
                          {v ? (
                            <Link
                              to={
                                Urlconstant.navigate +
                                `profile/${v.basicInfo.email}`
                              }
                              style={{ color: "blue", fontSize: "14px" }}
                            >
                              {v.basicInfo.traineeName} &nbsp;
                            </Link>
                          ) : null}
                          {v.basicInfo.email}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <hr style={{ paddingBottom: "-1rem" }}></hr>
                  </div>
                </div>
              ) : (
                ""
              )}
              <div>
                {yesterDayCandidate ? (
                  <div>
                    <div>
                      <hr style={{ paddingBottom: "-1rem" }}></hr>
                    </div>
                    <div>
                      <p
                        style={{
                          backgroundColor: "white",
                          marginTop: "-1rem",
                          textAlign: "center",
                          marginLeft: "-20px",
                          marginRight: "-2rem",
                          color: "red",
                          paddingBottom: "-6px",
                          fontStyle: "bold",
                        }}
                      >
                        yesterday Candidate Followup
                      </p>
                      <div>
                        <div>
                          <hr style={{ paddingBottom: "-1rem" }}></hr>
                        </div>
                        {yesterDayCandidate.map((v, k) => (
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
                        ))}
                      </div>
                    </div>
                    <div>
                      <hr style={{ paddingBottom: "-1rem" }}></hr>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div>
                {afterFourDayCandidate ? (
                  <div>
                    <div>
                      <hr style={{ paddingBottom: "-1rem" }}></hr>
                    </div>
                    <p
                      style={{
                        backgroundColor: "white",
                        marginTop: "-1rem",
                        textAlign: "center",
                        marginLeft: "-20px",
                        marginRight: "-2rem",
                        color: "green",
                        paddingBottom: "-6px",
                        fontStyle: "bold",
                      }}
                    >
                      After Four days Candidate Followup
                    </p>
                    <div>
                      <div>
                        <hr style={{ paddingBottom: "-1rem" }}></hr>
                      </div>
                      {afterFourDayCandidate.map((v, k) => (
                        <p key={k}>
                          {v ? (
                            <Link
                              to={
                                Urlconstant.navigate +
                                `profile/${v.basicInfo.email}`
                              }
                              style={{ color: "blue", fontSize: "14px" }}
                            >
                              {v.basicInfo.traineeName} &nbsp;
                            </Link>
                          ) : null}
                          {v.basicInfo.email}
                        </p>
                      ))}
                    </div>
                    <div>
                      <hr style={{ paddingBottom: "-1rem" }}></hr>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <p
              style={{
                backgroundColor: "white",
                marginTop: "-1rem",
                textAlign: "center",
                marginLeft: "-20px",
                marginRight: "-2rem",
                color: "green",
                paddingBottom: "-6px",
                fontStyle: "bold",
              }}
            ></p>
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

  // Extract the name from the email
  const extractNameFromEmail = (email) => {
    const parts = email.split("@");
    return parts.length > 0 ? parts[0] : email;
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
              {extractNameFromEmail(sessionStorage.getItem("userId", email))}
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
