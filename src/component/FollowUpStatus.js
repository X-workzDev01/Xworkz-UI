import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import { GridCloseIcon } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Urlconstant } from "../constant/Urlconstant";

import "dayjs/locale/de";
import "dayjs/locale/en-gb";
const fieldStyle = { margin: "20px" };

const FollowUpStatus = ({ open, handleClose, rowData, followUpdata }) => {
  const [joinedError, setJoinedError] = useState("");
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [editedData, setEditedData] = React.useState({ ...rowData });
  const [loading, setLoading] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [dropdownData, setDropdownData] = React.useState([]);
  const [isDisabled, setIdDisabled] = React.useState(false);
  const [feesData, setFeesData] = useState({});
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const reminingStatus = [
    "Drop after free course",
    "Drop after placement",
  ];
  const fieldsToCheck = [
    "attemptStatus",
    "joiningDate",
    "callDuration",
    "callBack",
    "callBackTime",
    "comments",
  ];
  const [attemptStatus, setAttemptStatus] = useState("");
  const [commentError, setCommentError] = useState(false);
  const [count, setCount] = useState(0);

  const navigate = useNavigate();
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    axios
      .get(Urlconstant.url + "utils/dropdown", {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })
      .then((response) => {
        // Filter out "New" and "Enquiry" from the dropdownData.status array
        const filteredStatus = response.data.status.filter(
          (item) => item !== "New" && item !== "Enquiry"
        );

        setDropdownData({ ...response.data, status: filteredStatus });
      })
      .catch((error) => {});
  }, []);

  React.useEffect(() => {
    setEditedData(rowData);
    setIdDisabled(false);
    setJoinedError(null);
    setIdDisabled(true)

  }, [rowData]);

  if (!rowData) {
    return null;
  }
  const handlecount = (event) => {
    const { name, value } = event.target;
    setCount(event.target.value.length);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const updatedValue = (value ?? "").trim() === "" ? "NA" : value;

    setEditedData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));
    if (name === "joiningDate" && value !== "NA") {
      setIdDisabled(false);
    }

    if (name === "attemptStatus") {
      setAttemptStatus(updatedValue);
      if (value == "Joined" && rowData.courseInfo.course === "NA") {
        setIdDisabled(true);
        setJoinedError("Please trainee update batch before select joined Trainee");
      } else {
        setJoinedError("");
        setIdDisabled(false);
      }
      if (value === "Joined" && editedData.joiningDate !== "NA") {
        setIdDisabled(true);
      }
    }
  };

  const handleEditClick = () => {
    setIsConfirming(true);
    setSnackbarOpen(false);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    handleClose();
  };
  const handleCloseForm = () => {
    setResponseMessage("");
    setSnackbarOpen(false);
    setAttemptStatus("");
    handleClose();
  };
  const attemtedUser = sessionStorage.getItem("userId");

  const validateAndSaveData = (statusDto, attendanceDto, dto) => {
    setIsConfirmed(true);
    axios
      .post(Urlconstant.url + `api/updateFollowStatus`, statusDto, {
        headers: {
          "Content-Type": "application/json",
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })
      .then((response) => {
        setLoading(false);
        setResponseMessage("Data updated successfully!");
        setSnackbarOpen(true);
        setIsConfirming(false);
        setIsConfirmed(false);
        if (response.status === 200) {
          setTimeout(() => {
            handleCloseForm();
          }, 1000);
        }
        navigate(Urlconstant.navigate + `profile/${statusDto.basicInfo.email}`);
      })
      .catch((error) => {
        setLoading(false);
        setResponseMessage("Error updating data. Please try again.");
        setSnackbarOpen(true);
      });
    axios
      .post(Urlconstant.url + `api/attendance/register`, attendanceDto)
      .then(() => {})
      .catch((e) => {});
    axios.post(Urlconstant.url + `api/saveFees`, dto);
  };

  const handleSaveClick = () => {
    const statusDto = {
      ...editedData,
      attemptedBy: attemtedUser,
    };

    const dto = {
      email: statusDto.basicInfo.email,
      name: statusDto.basicInfo.traineeName,
      status: statusDto.attemptStatus,
      adminDto: {
        createdBy: statusDto.adminDto.createdBy,
        createdOn: statusDto.adminDto.createdOn,
        updatedBy: statusDto.adminDto.updatedBy,
        updatedOn: statusDto.adminDto.updatedOn,
      },
    };

    const attendanceDto = {
      attemptStatus: attemptStatus,
      traineeName: statusDto.basicInfo.traineeName,
      id: statusDto.id,
      course: statusDto.courseInfo.course,
      adminDto: { createdBy: sessionStorage.getItem("userId") },
    };
    if (isConfirming) {
      setLoading(true);

      fieldsToCheck.forEach((field) => {
        if (!statusDto[field]) {
          statusDto[field] = "NA";
        }
      });
      validateAndSaveData(statusDto, attendanceDto, dto);
    }
  };
  const handleErrr = (e) => {
    if (e.target.value.length < 20) {
      setLoading(false);
      setResponseMessage("Comment must be at least 20 characters.");
      setIdDisabled(true);
    } else {
      setResponseMessage("");
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        Add to Follow Up
        <IconButton
          color="inherit"
          onClick={handleClose}
          edge="start"
          aria-label="close"
          style={{ position: "absolute", right: "8px", top: "8px" }}
        >
          <GridCloseIcon />
        </IconButton>
      </DialogTitle>
      <div style={{ marginLeft: "19rem" }}>
        {" "}
        <span style={{ color: "red" }}>{joinedError}</span>
      </div>
      <DialogContent>
        <TextField
          label="Email"
          name="basicInfo.email"
          defaultValue={rowData.basicInfo.email}
          onChange={handleInputChange}
          style={fieldStyle}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Name"
          name="basicInfo.traineeName"
          defaultValue={rowData.basicInfo.traineeName}
          style={fieldStyle}
          onChange={handleInputChange}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Attempted By"
          name="attemptedBy"
          defaultValue={attemtedUser}
          onChange={handleInputChange}
          style={fieldStyle}
          InputProps={{
            readOnly: true,
          }}
        />
        <FormControl>
          <InputLabel id="demo-simple-select-label">Attempt Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Attempt Status"
            name="attemptStatus"
            onChange={handleInputChange}
            variant="outlined"
            sx={{
              marginRight: "20px",
              width: "200px",
              fontSize: "20px",
            }}
          >
            {followUpdata.currentStatus
              ? followUpdata.currentStatus === "Joined" ||
                followUpdata.currentStatus === "Drop after placement" ||
                followUpdata.currentStatus === "Drop after free course"
                ? reminingStatus.map((item, key) => (
                    <MenuItem value={item} key={key}>
                      {item}
                    </MenuItem>
                  ))
                : dropdownData.status
                    .filter(
                      (item) =>
                        item !== "Enquiry" &&
                        item !== "New" &&
                        item !== "Drop after placement" &&
                        item !== "Drop after free course"
                    )
                    .map((item, index) => (
                      <MenuItem value={item} key={index}>
                        {item}
                      </MenuItem>
                    ))
              : ""}
          </Select>
        </FormControl>

        <TextField
          type="date"
          label="Joining Date"
          name="joiningDate"
          defaultValue={rowData.joiningDate || "NA"}
          onChange={handleInputChange}
          style={fieldStyle}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: getCurrentDate(),
          }}
        />

        <TextField
          label="Call Duration"
          name="callDuration"
          placeholder="mm:ss"
          variant="outlined"
          id="callDuration"
          defaultValue={rowData.callDuration || ""}
          onChange={handleInputChange}
        />

        <TextField
          type="date"
          label="Call Back Date"
          name="callBack"
          defaultValue={rowData.callBack || "NA"}
          onChange={handleInputChange}
          style={fieldStyle}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: getCurrentDate(),
          }}
          id="callBack"
        />
        <TextField
          type="time"
          label="Call Back Time"
          name="callBackTime"
          defaultValue={rowData.callBackTime || "NA"}
          onChange={handleInputChange}
          style={fieldStyle}
          InputLabelProps={{
            shrink: true,
          }}
          id="callBackTime"
        />

        <FormControl>
          <InputLabel id="demo-simple-select-label">
            {count ? (
              <p
                style={{
                  color: "green",
                  paddingTop: "4.5rem",
                  marginLeft: "18rem",
                }}
              >
                {" "}
                {count}/20
              </p>
            ) : (
              ""
            )}
          </InputLabel>

          <TextField
            labelId="demo-simple-select-label"
            label="Comments"
            name="comments"
            onBlur={handleErrr}
            defaultValue={rowData.comments}
            onKeyUp={handleInputChange}
            onChange={handlecount}
            style={{ width: 350, height: 0.5 }}
            className="custom-textfield" // Apply the custom CSS class
            multiline
            disabled={[
              "RNR",
              "Wrong Number",
              "Busy",
              "Not Reachable",
              "Incoming call not available",
            ].includes(attemptStatus)}
            rows={4}
            id="comments"
            error={commentError}
            helperText={commentError ? "Comment is mandatory." : ""}
          ></TextField>
          {responseMessage ? (
            <p style={{ color: "green", marginTop: "90px" }}>
              {responseMessage}
            </p>
          ) : (
            ""
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          <Button
            disabled={isDisabled}
            onClick={handleEditClick}
            color="primary"
          >
            Add
          </Button>
        )}
      </DialogActions>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000000}
        onClose={handleSnackbarClose}
        // message={responseMessage}
      />

      <Dialog open={isConfirming} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>Added Follow Up Details</DialogContent>
        <DialogActions>
          <IconButton
            color="inherit"
            onClick={() => setIsConfirming(false)}
            edge="start"
            aria-label="close"
            style={{ position: "absolute", right: "8px", top: "8px" }}
          >
            <GridCloseIcon />
          </IconButton>
          <Button
            onClick={handleSaveClick}
            color="primary"
            disabled={isConfirmed}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default FollowUpStatus;
