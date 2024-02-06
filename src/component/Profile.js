import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import axios from "axios";
import React, { useState } from "react";
import { SiContactlesspayment } from "react-icons/si";
import { useParams } from "react-router-dom";
import { Urlconstant } from "../constant/Urlconstant";
import EditModal from "./EditModal";
import FollowStatusGrid from "./FollowStatusGrid";
import FollowUpStatus from "./FollowUpStatus";
import Header from "./Header";

import AttendanceModal from "./AttendanceModal";

import "./Profile.css";
import { PayFee } from "./PayFee";
import { Modal } from "react-bootstrap";
import { FeesHistory } from "./FeesHistory";
import { MdWorkHistory } from "react-icons/md";

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
const Profile = (courseName, searchValue) => {
  console.log(courseName, searchValue);
  const [openFeesHistory, setOpenFeesHistory] = useState(false);
  const { email } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [followUpData, setFollowUpData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [editedRowData, setEditedRowData] = React.useState(null);
  const [dataLoadingError, setDataLoadingError] = React.useState(null);
  const [open, setOpen] = useState(false);
  const [feesData, setFeesData] = useState({});
  const [feesHistory, setFeesHistory] = useState({});
  const [payFeesDisabled, setPayFeesDisabled] = useState(false);
  const [isFollowUpModalOpen, setFollowUpModalOpen] = React.useState(false);
  const [editedFollowUpRowData, setEditedFollowUpRowData] =
    React.useState(null);

  const [isFollowUpStatusModalOpen, setFollowUpStatusModalOpen] =
    React.useState(false);
  const [editedFollowUpStatusRowData, setEditedFollowUpStatusRowData] =
    React.useState(null);
  const [showAttendence, setShowAttendence] = useState(false);

  const [isAttendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [attendanceId, setAttendanceId] = useState(null);
  const [batch, setbatch] = useState(null);

  const handleAttendanceModalOpen = (rowData) => {
    setAttendanceModalOpen(true);
  };

  React.useEffect(() => {
    fetchData(
      email,

      isFollowUpStatusModalOpen,
      isModalOpen,
      setProfileData,
      setFollowUpData,
      setStatusData,
      setDataLoadingError
    );
  }, [email, isFollowUpStatusModalOpen, isModalOpen]);
  const getFeesDetiles = () => {
    setFeesData("");
    const response = axios.get(
      Urlconstant.url + `api/getFeesDetilesByEmail/${email}`
    );
    response.then((res) => {
      setFeesData(res.data.feesDto[0]);
      setFeesHistory(res.data.feesHistoryDto);
      if (res.data.feesDto.length !== 0 && res.data.feesDto[0].balance === 0) {
        setPayFeesDisabled(true);
      }
    });
    response.catch(() => {});
  };
  const fetchData = (
    email,
    isFollowUpStatusModalOpen,
    isModalOpen,
    setProfileData,
    setFollowUpData,
    setStatusData,
    setDataLoadingError
  ) => {
    const traineeApi = Urlconstant.url + `api/readByEmail?email=${email}`;
    const followUpApi = Urlconstant.url + `api/getFollowUpEmail/${email}`;
    const statusApi = Urlconstant.url + `api/getFollowUpStatusByEmail/${email}`;
    getFeesDetiles();
    axios
      .all([
        axios.get(traineeApi, {
          headers: {
            "Content-Type": "application/json",
            spreadsheetId: Urlconstant.spreadsheetId,
          },
        }),
        axios.get(followUpApi, {
          headers: {
            "Content-Type": "application/json",
            spreadsheetId: Urlconstant.spreadsheetId,
          },
        }),
        axios.get(statusApi, {
          headers: {
            "Content-Type": "application/json",
            spreadsheetId: Urlconstant.spreadsheetId,
          },
        }),
      ])
      .then(
        axios.spread((profileResponse, followUpResponse, statusResponse) => {
          setProfileData(profileResponse.data);
          setFollowUpData(followUpResponse.data);
          setStatusData(statusResponse.data);
        })
      )
      .catch((error) => {
        setDataLoadingError("Check the data loading...");
      });
  };

  if (!profileData || !followUpData || !statusData) {
    return <div>Loading...</div>;
  }

  const handleEditClick = (row) => {
    setEditedRowData(row);
    setModalOpen(true);
  };
  const handleSaveClick = () => {
    setModalOpen(false);
  };

  const handleFollowUp = (row) => {
    setEditedFollowUpStatusRowData(row);
    setFollowUpStatusModalOpen(true);
  };

  const handleFollowUpStatusSave = () => {
    setFollowUpStatusModalOpen(false);
  };

  const handleAttendence = (row) => {
    console.log(row);
    setShowAttendence(true);
  };
  const handleFees = () => {
    setOpen(true);
  };
  const handleFeesHistory = () => {
    setOpenFeesHistory(true);
  };

  return (
    <div>
      <Header />
      <div className="card">
        <div className="infos">
          <Avatar {...stringAvatar(profileData.basicInfo.traineeName)} />
          <div className="name">
            <h1>{profileData.basicInfo.traineeName}</h1>
            <h3>
              <EmailIcon sx={{ color: "#1277B2" }} />{" "}
              {profileData.basicInfo.email}
            </h3>
            <h3>
              <PhoneAndroidIcon sx={{ color: "#1277B2" }} />{" "}
              {profileData.basicInfo.contactNumber}
            </h3>
          </div>
          <ul className="stats">
            <li>
              <h3>{profileData.educationInfo.qualification}</h3>
              <h4>qualification</h4>
            </li>
            <li>
              <h3>{profileData.educationInfo.yearOfPassout}</h3>
              <h4>Passout</h4>
            </li>

            <li>
              <h3>{profileData.othersDto.preferredLocation}</h3>
              <h4>Preferred Location</h4>
            </li>
            <li>
              <h3>{profileData.othersDto.preferredClassType}</h3>
              <h4>Preferred Class TYpe</h4>
            </li>
          </ul>
          <ul className="stats">
            <li>
              <h3>{followUpData.registrationDate}</h3>
              <h4>Registration Date and Time</h4>
            </li>
            <li>
              <h3>{followUpData.joiningDate}</h3>
              <h4>Joining Date</h4>
            </li>
            <li>
              <h3>{followUpData.currentlyFollowedBy}</h3>
              <h4>Currently Followed By</h4>
            </li>
            <li>
              <h3>{followUpData.currentStatus}</h3>
              <h4>Current Status</h4>
            </li>
          </ul>
          <div className="links">
            <Button
              style={{ marginRight: "0.5rem" }}
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                handleFollowUp(profileData);
              }}
            >
              Add FollowUp
            </Button>
            <Button
              style={{ marginRight: "0.5rem" }}
              variant="outlined"
              startIcon={<ModeEditIcon />}
              onClick={() => handleEditClick(profileData)}
            >
              Edit Profile
            </Button>
            {followUpData.currentStatus ? (
              followUpData.currentStatus === "Joined" ? (
                <Button
                  style={{ marginRight: "0.5rem" }}
                  variant="outlined"
                  startIcon={<ModeEditIcon />}
                  onClick={() => handleAttendanceModalOpen(profileData)} // Pass profileData or appropriate rowData
                >
                  View Attendance
                </Button>
              ) : (
                ""
              )
            ) : (
              ""
            )}

            {followUpData.currentStatus ? (
              feesData ? (
                followUpData.currentStatus === "Joined" ? (
                  <Button
                    style={{ marginRight: "0.5rem" }}
                    variant="outlined"
                    startIcon={<SiContactlesspayment />}
                    onClick={handleFees}
                    disabled={payFeesDisabled}
                  >
                    Pay Fees
                  </Button>
                ) : (
                  ""
                )
              ) : (
                ""
              )
            ) : (
              ""
            )}

            {followUpData.currentStatus && feesData ? (
              followUpData.currentStatus === "Joined" ? (
                feesHistory && feesHistory.length > 0 ? (
                  <Button
                    style={{ marginRight: "0.5rem" }}
                    variant="outlined"
                    startIcon={<MdWorkHistory />}
                    onClick={handleFeesHistory}
                  >
                    Fees History
                  </Button>
                ) : (
                  ""
                )
              ) : (
                ""
              )
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <EditModal
        open={isModalOpen}
        handleClose={() => setModalOpen(false)}
        rowData={editedRowData}
        setRowData={setEditedRowData}
        handleSaveClick={handleSaveClick}
      />

      <FollowUpStatus
        open={isFollowUpStatusModalOpen}
        handleClose={() => setFollowUpStatusModalOpen(false)}
        rowData={editedFollowUpStatusRowData}
        setRowData={setEditedFollowUpStatusRowData}
        handleSaveClick={handleFollowUpStatusSave}
        FollowUp={handleFollowUp}
      />

      {followUpData.currentStatus ? (
        followUpData.currentStatus === "Joined" && feesHistory ? (
          <FeesHistory
            isOpen={openFeesHistory}
            handleClose={() => setOpenFeesHistory(false)}
            row={feesHistory}
          />
        ) : (
          ""
        )
      ) : (
        ""
      )}
      <AttendanceModal
        open={isAttendanceModalOpen}
        handleClose={() => setAttendanceModalOpen(false)}
        id={profileData.id}
        batch={profileData.courseInfo.course}
      />

      <FeesHistory
        isOpen={openFeesHistory}
        handleClose={() => setOpenFeesHistory(false)}
        row={feesHistory}
      />

      {followUpData.currentStatus ? (
        followUpData.currentStatus === "Joined" && feesData ? (
          <PayFee
            open={open}
            handleClose={() => setOpen(false)}
            traineeEmail={profileData.basicInfo.email}
            name={profileData.basicInfo.tr}
            feesData={feesData}
            feesDetils={getFeesDetiles}
          />
        ) : (
          ""
        )
      ) : (
        ""
      )}

      {statusData ? <FollowStatusGrid rows={statusData} /> : null}
    </div>
  );
};

export default Profile;
