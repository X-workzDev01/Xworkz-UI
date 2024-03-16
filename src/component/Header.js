import { AccountCircle, NotificationsActiveRounded } from "@mui/icons-material";
import { BiRupee } from "react-icons/bi";
import { IoPower } from "react-icons/io5";
import { RxCountdownTimer } from "react-icons/rx";

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
import { FeesNotificationModal } from "./FeesNotificationModal";
import { useSelector } from "react-redux";


function stringToColor(string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name) {
  let avatarText = "";
  if (name.includes(" ")) {
    const [firstName, lastName] = name.split(" ");
    avatarText = `${firstName[0]}${lastName[0]}`;
  } else {
    avatarText = name[0];
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: avatarText,
  };
}
function Header() {
  const email = useSelector(state => state.loginDetiles.email);
  const [yesterDayCandidate, setYesterDayCandidate] = useState([]);
  const [todayDayCandidate, setTodayDayCandidate] = useState([]);
  const [afterFourDayCandidate, setAfterFourDayCandidate] = useState([]);
  const [count, setCount] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [feesShow, setFeesShow] = useState(false);
  const [feesData, setFeesData] = useState({});
  const [feesCount, setFeesCount] = useState();
  useEffect(() => {
    if (email) {
      feesNotification();
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
        .catch((e) => { });
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

  const feesNotification = () => {
    axios(Urlconstant.url + `api/feesNotification?email=${email}`)
      .then((res) => {
        setFeesData(res.data);
        setFeesCount(
          res.data.yesterdayCandidates.length +
          res.data.todayCandidates.length +
          res.data.afterFourDayCandidates.length
        );
      })
      .catch((e) => { });
  } 

  const popup = () => {
    return (
      <div className="container-fluid">
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
                width: "23rem",
                maxHeight: "470px",
                // minWidth:"550px",
                overflowY: "auto",
                overflowX: "auto",
                marginRight: "-1rem",
              }}
            >
              {todayDayCandidate && todayDayCandidate.length > 0 ? (
                <div>
                  <div>
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
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          marginTop: "3px",
                          justifyContent: "flex-start",
                        }}
                      >
                        <RxCountdownTimer />
                      </div>

                      <span
                        style={{
                          display: "flex",
                          marginLeft: "5rem",
                          paddingTop: "2px",
                        }}
                      >
                        Today
                      </span>
                      <span
                        style={{
                          display: "flex",
                          marginLeft: "0.5rem",
                          paddingTop: "2px",
                        }}
                      >
                        {`${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`}
                      </span>
                    </div>
                    <div>
                      <div>
                        <hr style={{ paddingBottom: "-1rem" }}></hr>
                      </div>
                      <div>
                        {todayDayCandidate.map((v, k) => (
                          <div style={{ paddingBottom: "0.7rem" }} key={k}>
                            {v ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <Link
                                  to={
                                    Urlconstant.navigate +
                                    `profile/${v.basicInfo.email}`
                                  }
                                  style={{ color: "blue", fontSize: "14px" }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    <Avatar
                                      style={{ width: "2rem", height: "2rem" }}
                                      {...stringAvatar(v.basicInfo.traineeName)}
                                    />

                                    <span
                                      style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        marginLeft: "20px",
                                        paddingTop: "5px",
                                        textTransform: "capitalize",
                                      }}
                                    >
                                      {v.basicInfo.traineeName} &nbsp;
                                    </span>
                                  </div>
                                </Link>
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    marginLeft: "5px",
                                    paddingTop: "5.3px",
                                  }}
                                >
                                  {" "}
                                  {v.basicInfo.email}
                                </span>
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    marginLeft: "5px",
                                    paddingTop: "5.3px",
                                    color: "green",
                                    marginRight: "-20rem"
                                  }}
                                >
                                  {" "}
                                  {v.currentStatus}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
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
                {yesterDayCandidate && yesterDayCandidate.length > 0 ? (
                  <div>
                    <div></div>
                    <div>
                      <p
                        style={{
                          backgroundColor: "white",
                          marginTop: "-1rem",
                          textAlign: "center",
                          marginLeft: "-20px",
                          marginRight: "-2rem",
                          paddingBottom: "-6px",
                          fontStyle: "bold",
                        }}
                      ></p>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            marginTop: "3px",
                            justifyContent: "flex-start",
                          }}
                        >
                          <RxCountdownTimer />
                        </div>

                        <span
                          style={{
                            display: "flex",
                            marginLeft: "5rem",
                            paddingTop: "2px",
                          }}
                        >
                          Yesterday
                        </span>
                        <span
                          style={{
                            display: "flex",
                            marginLeft: "0.5rem",
                            paddingTop: "2px",
                          }}
                        >
                          {`${new Date().getDate() - 1
                            }/${new Date().getMonth()}/${new Date().getFullYear()}`}
                        </span>
                      </div>
                      <div>
                        <div>
                          <hr style={{ paddingBottom: "-1rem" }}></hr>
                        </div>
                        <div>
                          {yesterDayCandidate.map((v, k) => (
                            <div style={{ paddingBottom: "0.7rem" }} key={k}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                }}
                              >
                                {v ? (
                                  <Link
                                    to={
                                      Urlconstant.navigate +
                                      `profile/${v.basicInfo.email}`
                                    }
                                    style={{ color: "blue", fontSize: "14px" }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        textTransform: "capitalize",
                                      }}
                                    >
                                      <Avatar
                                        style={{
                                          width: "2rem",
                                          height: "2rem",
                                        }}
                                        {...stringAvatar(
                                          v.basicInfo.traineeName
                                        )}
                                      />
                                      <span
                                        style={{
                                          display: "flex",
                                          alignItems: "flex-start",
                                          marginLeft: "18px",
                                          paddingTop: "7px",
                                          textTransform: "capitalize",
                                        }}
                                      >
                                        {v.basicInfo.traineeName} &nbsp;
                                      </span>
                                    </div>
                                  </Link>
                                ) : null}
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    marginLeft: "5px",
                                    paddingTop: "5.3px",
                                  }}
                                >
                                  {v.basicInfo.email}
                                </span>
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    marginLeft: "5px",
                                    paddingTop: "5.3px",
                                    color: "green",
                                    marginRight: "-20rem"
                                  }}
                                >
                                  {" "}
                                  {v.currentStatus}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
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
                {afterFourDayCandidate && afterFourDayCandidate.length > 0 ? (
                  <div>
                    <div
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
                    ></div>
                    <div
                      style={{
                        display: "flex",
                        paddingTop: "0.7rem",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          marginTop: "4px",
                          justifyContent: "flex-start",
                        }}
                      >
                        <RxCountdownTimer />
                      </div>

                      <span
                        style={{
                          display: "flex",
                          marginLeft: "5rem",
                          paddingTop: "2px",
                        }}
                      >
                        After 4 day
                      </span>
                      <span
                        style={{
                          display: "flex",
                          marginLeft: "0.5rem",
                          paddingTop: "2px",
                        }}
                      >
                        {`${new Date().getDate() + 4
                          }/${new Date().getMonth()}/${new Date().getFullYear()}`}
                      </span>
                    </div>
                    <div>
                      <div>
                        <hr style={{ paddingBottom: "-1rem" }}></hr>
                      </div>
                      <div>
                        {afterFourDayCandidate.map((v, k) => (
                          <div style={{ paddingBottom: "0.7rem" }} key={k}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                              }}
                            >
                              {v ? (
                                <Link
                                  to={
                                    Urlconstant.navigate +
                                    `profile/${v.basicInfo.email}`
                                  }
                                  style={{ color: "blue", fontSize: "14px" }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    <Avatar
                                      style={{
                                        width: "2rem",
                                        height: "2rem",
                                      }}
                                      {...stringAvatar(v.basicInfo.traineeName)}
                                    />
                                    <span
                                      style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        marginLeft: "18px",
                                        paddingTop: "7px",
                                        textTransform: "capitalize",
                                      }}
                                    >
                                      {v.basicInfo.traineeName} &nbsp;
                                    </span>
                                  </div>{" "}
                                </Link>
                              ) : null}
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  paddingTop: "5.3px",
                                }}
                              >
                                {" "}
                                {v.basicInfo.email}
                              </span>{" "}
                            </div>
                          </div>
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

const  FeesNotificationClick=(event)=>{
setFeesShow(anchorEl ? null : event.currentTarget);
}

  const feesNotificationDisplay = () => {
    return (
      <div>
        <IconButton
          variant="contained"
          color="inherit"
          aria-label="Notification"
          onClick={FeesNotificationClick}
          aria-describedby={id}
        >
          <Badge badgeContent={feesCount} color="warning">
            <BiRupee />
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
            <div
              style={{
                display: "flex",
                justifyItems: "flex-start",
                width: "100rem",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
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
              <Link to={Urlconstant.navigate + "display"} className="text-decoration-none text-white fs-4">Home</Link>
              <Typography variant="h6" component="div" sx={{ flexGrow: 6 }}>
                <AccountCircle
                  sx={{ color: "action.active", marginRight: "8px" }}
                />
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                justifyItems: "flex-end",
              }}
            >
              <Typography
                variant="h6"
                component="div"
                style={{
                  textTransform: "capitalize",
                  flexGrow: 1,
                  marginRight: "1rem",
                }}
              >
                {extractNameFromEmail(email)}
              </Typography>
              <div style={{ marginRight: "1rem" }}>{notificationDisplay()}</div>
              {popup()}
              <div style={{ marginRight: "1rem" }}>{feesNotificationDisplay()}</div>
              <FeesNotificationModal
              plsOpen={feesShow}
              feesData={feesData}
              handleClose={()=>setFeesShow(null)}
              />
              <Avatar
                style={{
                  marginRight: "1rem",
                  textTransform: "capitalize",
                }}
                {...stringAvatar(
                  extractNameFromEmail(email)
                )}
              />
              <br></br>
              <Link
                to={Urlconstant.navigate + "login"}
                style={{ marginRight: "1rem" }}
              >
                <IoPower />
              </Link>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    </>
  );
}
export default Header;
