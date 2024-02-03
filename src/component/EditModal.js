import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import { Urlconstant } from "../constant/Urlconstant";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Alert,
  Grid,
} from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";

import "./Fields.css";
import { useNavigate } from "react-router-dom";

const fieldStyle = { margin: "20px" };

const EditModal = ({ open, handleClose, rowData }) => {
  const navigate = useNavigate();
  const email = sessionStorage.getItem("userId");
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(" ");
  const [editedData, setEditedData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [dropdown, setDropDown] = React.useState([]);
  const [batchDetails, setBatchDetails] = React.useState("");
  const [emailCheck, setEmailCheck] = React.useState("");
  const [numberCheck, setNumberCheck] = React.useState(null);
  const [emailError, setEmailError] = React.useState(null);
  const [phoneNumberError, setPhoneNumberError] = React.useState("");
  const [verifyHandaleEmail, setverifyHandleEmail] = React.useState("");
  const [verifyHandaleEmailerror, setverifyHandleEmailError] =
    React.useState("");
  const [disble, setDisable] = useState(false);
  const [emailValue, setEmailValue] = React.useState("");
  const [formData, setFormData] = React.useState({
    branch: "",
    trainerName: "",
    batchType: "",
    course: "",
    batchTiming: "",
    startTime: "",
  });

  React.useEffect(() => {
    setEditedData(rowData);
  }, [rowData]);

  React.useEffect(() => {
    axios
      .get(Urlconstant.url + "utils/dropdown", {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })
      .then((response) => {
        setDropDown(response.data);
      })
      .catch((error) => { });
    axios
      .get(Urlconstant.url + "api/getCourseName?status=Active", {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })

      .then((res) => {
        setBatchDetails(res.data);
        if (selectedValue) {
          fetchData(selectedValue); // Call fetchData with the selectedValue
        }
      })
      .catch((e) => { });
  }, []);
  React.useEffect(() => {
    if (rowData && rowData.courseInfo) {
      setEditedData(rowData);
      if (rowData.courseInfo.course) {
        setSelectedValue(rowData.courseInfo.course);
        fetchData(rowData.courseInfo.course);
      }
    }
  }, [rowData]);
  if (!rowData) {
    return null;
  }

  const fetchData = (selectedValue) => {
    axios
      .get(
        Urlconstant.url + `api/getCourseDetails?courseName=${selectedValue}`,
        { headers: { spreadsheetId: Urlconstant.spreadsheetId } }
      )
      .then((response) => {
        const data = response.data;
        setFormData({
          branch: data.branch,
          trainerName: data.trainerName,
          batchType: data.batchType,
          course: data.courseName,
          batchTiming: data.timing,
          startDate: data.startDate,
        });
      })
      .catch((error) => { });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const [section, field] = name.split(".");
    if (section === "courseInfo" && field === "course") {
      setSelectedValue(value);
      fetchData(value);
    }
    if (name === "email") {
      setEmailValue(value);
      if (!value) {
        setEmailError("Email is required");
        setverifyHandleEmail("");
        setEmailCheck("");
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        setEmailError("Invalid email address");
        setverifyHandleEmail("");
        setEmailCheck("");
      } else {
        setEmailError("");
      }
    } else if (name === "basicInfo.contactNumber") {
      // Update the name to target the correct field
      if (!value) {
        setPhoneNumberError("Phone number is required");
      } else if (!/^\d+$/.test(value)) {
        setPhoneNumberError("Phone number must contain only digits");
      } else if (value.length !== 10) {
        setPhoneNumberError("Phone number must contain exactly 10 digits");
      } else {
        setPhoneNumberError(""); // Clear the error if phone number is valid
      }
      if (name === "csrDto.unsNumber") {
        console.log(value)
      }

    }
    setEditedData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };
  const handleEmail = (email) => {
    if (rowData.basicInfo.email === email) {
      setDisable(false);
      setEmailCheck(null);
      return;
    }

    axios
      .get(Urlconstant.url + `api/emailCheck?email=${email}`, {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setDisable(false);
          setEmailCheck(null);
        } else if (response.status === 201) {
          setDisable(true);
          setEmailCheck(response.data);
        } else {
          setEmailCheck(null);
        }
      })
      .catch({});
  };

  const verifyEmail = (email) => {
    handleEmail(email);
    if (emailCheck === "Email does not exist") {
      axios
        .get(Urlconstant.url + `api/verify-email?email=${email}`)
        .then((response) => {
          if (response.data === "accepted_email") {
            setverifyHandleEmail(response.data);
          }
          if (response.data === "rejected_email") {
            setverifyHandleEmailError(response.data);
            setverifyHandleEmail("");
            setEmailError("");
            setEmailCheck("");
          } else {
            setverifyHandleEmailError("");
          }
        });
    }
  };

  const handleNumberChange = (e) => {
    if (!formData.contactNumber) {
      return;
    }
    axios
      .get(
        Urlconstant.url +
        `api/contactNumberCheck?contactNumber=${formData.contactNumber}`,
        {
          headers: {
            spreadsheetId: Urlconstant.spreadsheetId,
          },
        }
      )
      .then((response) => {
        if (response.status === 201) {
          setNumberCheck(response.data);
        } else {
          setNumberCheck("");
        }
      })
      .catch((error) => { });
  };
  const handleEditClick = () => {
    setIsConfirming(true);
    setSnackbarOpen(false);
  };

  const handleSaveClick = () => {
    if (!isConfirming || loading) {
      setIsConfirming(false);
    }
    const updatedData = {
      ...editedData,
      adminDto: {
        ...editedData.adminDto,
        updatedBy: email,
      },
      basicInfo: {
        ...editedData.basicInfo,
        email: emailValue,
      },
      courseInfo: {
        ...editedData.courseInfo,
        ...formData,
      },
    };
    setLoading(true);
    axios
      .put(
        Urlconstant.url + `api/update?email=${rowData.basicInfo.email}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            spreadsheetId: Urlconstant.spreadsheetId,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        setResponseMessage("Data updated successfully!");
        setSnackbarOpen(true);
        setIsConfirming(false);
        if (response.status === 200) {
          setTimeout(() => {
            handleCloseForm();
          }, 1000);
        }

        if (emailValue === "" && emailValue != null) {
          navigate(Urlconstant.navigate + `profile/${rowData.basicInfo.email}`);

          return;
        }

        navigate(Urlconstant.navigate + `profile/${emailValue}`);
      })
      .catch((error) => {
        setLoading(false);
        setIsConfirming(false);

        setResponseMessage("Error updating data. Please try again.");
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleConfirmBoxClose = () => {
    setIsConfirming(false);
  };

  const handleCloseForm = () => {
    setResponseMessage("");
    setSnackbarOpen(false);
    handleClose();
  };
  const handlefunctionClose = () => {
    setEmailCheck("");
    setDisable(false);
    handleClose();
  };
  const handleVerifyEmail = (event) => {
    verifyEmail(event.target.value);
  };

  const handleUsnNumber = (event) => {
    console.log(event.target.value)
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Details</DialogTitle>
      <DialogContent>
        {/* Render your form fields here */}
        <IconButton
          color="inherit"
          onClick={handlefunctionClose}
          edge="start"
          aria-label="close"
          style={{ position: "absolute", right: "8px", top: "8px" }}
        >
          <GridCloseIcon />
        </IconButton>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label="Email"
              name="email"
              defaultValue={rowData.basicInfo.email}
              onChange={handleInputChange}
              onBlur={handleVerifyEmail}
              style={fieldStyle}
            // InputProps={{
            //   readOnly: true,
            // }}
            />
            {verifyHandaleEmailerror ? (
              <Alert severity="success">{verifyHandaleEmailerror}</Alert>
            ) : (
              " "
            )}
            {verifyHandaleEmailerror ? (
              <Alert severity="error">{verifyHandaleEmailerror}</Alert>
            ) : (
              " "
            )}
            {emailError ? <Alert severity="error">{emailError} </Alert> : " "}
            {emailCheck ? <Alert severity="error">{emailCheck}</Alert> : " "}

            {verifyHandaleEmail ? (
              <Alert severity="success">{verifyHandaleEmail}</Alert>
            ) : (
              " "
            )}
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Name"
              name="basicInfo.traineeName"
              defaultValue={rowData.basicInfo.traineeName}
              style={fieldStyle}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Contact Number"
              name="basicInfo.contactNumber"
              defaultValue={rowData.basicInfo.contactNumber}
              onChange={handleInputChange}
              style={fieldStyle}
              onBlur={handleNumberChange}
            />
            {phoneNumberError && <Alert severity="error">{phoneNumberError}</Alert>}
            {numberCheck && <Alert severity="error">{numberCheck}</Alert>}
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Date Of Birth"
              name="basicInfo.dateOfBirth"
              defaultValue={rowData.basicInfo.dateOfBirth}
              style={fieldStyle}
              onChange={handleInputChange}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <InputLabel id="demo-simple-select-label">Qualification</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                inputLabel="Qualification"
                name="educationInfo.qualification"
                defaultValue={rowData.educationInfo.qualification}
                onChange={handleInputChange}
                style={fieldStyle}
                sx={{
                  marginRight: "20px",
                  width: "225px",
                }}
              >
                {dropdown.qualification.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <InputLabel id="demo-simple-select-label">Stream</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                inputLabel="Stream"
                name="educationInfo.stream"
                defaultValue={rowData.educationInfo.stream}
                onChange={handleInputChange}
                style={fieldStyle}
                sx={{
                  marginRight: "20px",
                  width: "225px",
                }}
              >
                {dropdown.stream.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <InputLabel id="demo-simple-select-label">Year Of Passout</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Year Of Passout"
                name="educationInfo.yearOfPassout"
                defaultValue={rowData.educationInfo.yearOfPassout}
                onChange={handleInputChange}
                style={fieldStyle}
                sx={{
                  marginRight: "20px",
                  width: "225px",
                }}
              >
                {dropdown.yearofpass.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <TextField
              label="Unique ID"
              name="csrDto.uniqueId"
              defaultValue={rowData.csrDto.uniqueId}
              onChange={handleInputChange}
              style={fieldStyle}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="USN Number"
              name="csrDto.usnNumber"
              defaultValue={rowData.csrDto.usnNumber}
              onChange={handleInputChange}
              style={fieldStyle}
              onBlur={handleUsnNumber}
            />
          </Grid>

          <Grid item xs={4}>
            {/* need to add validation */}
            <TextField
              label="WhatsApp Number"
              name="csrDto.alternateContactNumber"
              defaultValue={rowData.csrDto.alternateContactNumber}
              onChange={handleInputChange}
              style={fieldStyle}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <InputLabel id="demo-simple-select-label">College Name</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="College Name"
                name="educationInfo.collegeName"
                defaultValue={rowData.educationInfo.collegeName}
                onChange={handleInputChange}
                style={fieldStyle}
                sx={{
                  marginRight: "20px",
                  width: "225px",
                }}
              >
                {dropdown.college.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <InputLabel id="demo-simple-select-label">Course</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Course"
                name="courseInfo.course"
                defaultValue={rowData.courseInfo.course}
                onChange={handleInputChange}
                style={fieldStyle}
                sx={{
                  marginRight: "20px",
                  width: "225px",
                }}
              >
                {batchDetails.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Branch"
              name="courseInfo.branch"
              value={formData.branch || ""}
              onChange={handleInputChange}
              style={fieldStyle}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Batch Type"
              name="courseInfo.batchType"
              value={formData.batchType || ""}
              onChange={handleInputChange}
              style={fieldStyle}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Trainer Name"
              name="courseInfo.trainerName"
              value={formData.trainerName || ""}
              onChange={handleInputChange}
              style={fieldStyle}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Batch Timing"
              name="courseInfo.batchTiming"
              value={formData.batchTiming || ""}
              onChange={handleInputChange}
              style={fieldStyle}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Start Date"
              name="courseInfo.startTime"
              value={formData.startDate || ""}
              onChange={handleInputChange}
              style={fieldStyle}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl style={fieldStyle}>
              <InputLabel id="demo-simple-select-label">Offered As</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Offered As"
                name="courseInfo.offeredAs"
                onChange={handleInputChange}
                defaultValue={rowData.courseInfo.offeredAs}
                variant="outlined"

                sx={{
                  marginRight: "20px",
                  width: "225px",
                }}
              >
                {dropdown.offered.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Referal Name"
              name="referralInfo.referalName"
              defaultValue={rowData.othersDto.referalName}
              onChange={handleInputChange}
              style={fieldStyle}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Referal Contact Number"
              name="othersDto.referalContactNumber"
              defaultValue={rowData.othersDto.referalContactNumber}
              onChange={handleInputChange}
              style={fieldStyle}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="X-workz E-mail"
              name="othersDto.xworkzEmail"
              defaultValue={rowData.othersDto.xworkzEmail}
              onChange={handleInputChange}
              style={fieldStyle}
              onBlur={handleVerifyEmail}
            />

            {verifyHandaleEmailerror ? (
              <Alert severity="error">{verifyHandaleEmailerror}</Alert>
            ) : (
              " "
            )}
            {emailError ? <Alert severity="error">{emailError} </Alert> : " "}
          </Grid>

          <Grid item xs={4}>
            <FormControl>
              <InputLabel id="demo-simple-select-label">
                preferred Location
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Preferred Location"
                name="othersDto.preferredLocation"
                onChange={handleInputChange}
                defaultValue={rowData.othersDto.preferredLocation}
                variant="outlined"
                sx={{
                  marginRight: "20px",
                  width: "225px",
                }}
                style={fieldStyle}
              >
                {dropdown.branchname.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <InputLabel id="demo-simple-select-label">
                preferred Class Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Preferred Class Type"
                name="othersDto.preferredClassType"
                onChange={handleInputChange}
                defaultValue={rowData.othersDto.preferredClassType}
                variant="outlined"
                sx={{
                  marginRight: "20px",
                  width: "225px",
                }}
                style={fieldStyle}
              >
                {dropdown.batch.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Comments"
              name="othersDto.comments"
              defaultValue={rowData.othersDto.comments}
              onChange={handleInputChange}
              style={fieldStyle}
              className="custom-textfield"
              multiline
              rows={4}
              sx={{
                marginRight: "20px",
                width: "500px",
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        {loading ? (
          <CircularProgress size={20} /> // Show loading spinner
        ) : (
          <Button disabled={disble} onClick={handleEditClick} color="primary">
            Edit
          </Button>
        )}
      </DialogActions>

      {/* Snackbar for response message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000000} // Adjust as needed
        onClose={handleSnackbarClose}
        message={responseMessage}
      />

      {/* Confirmation Dialog */}
      <Dialog open={isConfirming} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>Are you sure you want to update the data?</DialogContent>
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
          <Button onClick={handleSaveClick} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default EditModal;
