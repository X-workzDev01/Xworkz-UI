import React from "react";
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
  const [emailCheck, setEmailCheck] = React.useState(null);
  const [numberCheck, setNumberCheck] = React.useState(null);
  const [emailError, setEmailError] = React.useState(null);
  const [phoneNumberError, setPhoneNumberError] = React.useState("");
  const [verifyHandaleEmail, setverifyHandleEmail] = React.useState("");
  const [verifyHandaleEmailerror, setverifyHandleEmailError] =
    React.useState("");

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
      .catch((error) => {});
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
      .catch((e) => {});
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
          startTime: data.startTime,
        });
      })
      .catch((error) => {});
  };


  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const [section, field] = name.split('.');
    if (section === 'courseInfo' && field === 'course') {
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
    } else if (name === "basicInfo.contactNumber") { // Update the name to target the correct field
      if (!value) {
        setPhoneNumberError("Phone number is required");
      } else if (!/^\d+$/.test(value)) {
        setPhoneNumberError("Phone number must contain only digits");
      } else if (value.length !== 10) {
        setPhoneNumberError("Phone number must contain exactly 10 digits");
      } else {
        setPhoneNumberError(""); // Clear the error if phone number is valid
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
    validateEmail(email);
    axios
      .get(Urlconstant.url + `api/emailCheck?email=${email}`, {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })
      .then((response) => {
        if (response.status === 201) {
          setEmailCheck(response.data);
        } else {
          setEmailCheck(null);
        }
      })
      .catch({});
  };

  const validEmail = (email) => {
    handleEmail(email);
    verifyEmail(email);
  };
  const validateEmail = (value) => {
    if (!value) {
      setEmailError("Email is required");
      setEmailCheck("");
      setverifyHandleEmail("");
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Invalid email address");
      setverifyHandleEmail("");
      setEmailCheck("");
    } else {
      setEmailError("");
    }
  };

  const verifyEmail = (email) => {
    axios
      .get(Urlconstant.url + `api/verify-email?email=${email}`)
      .then((response) => {
        if (response.data === "accepted_email") {
          setverifyHandleEmail(response.data);
          console.log(response.data);
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
  };

  const handleNumberChange = (e) => {
    if (!formData.contactNumber) {
      console.log("Contact number is blank. Cannot make the API call.");
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
      .catch((error) => {
        console.log(error);
      });
  };
  const handleEditClick = () => {
    setIsConfirming(true);
    setSnackbarOpen(false);
  };

  const handleSaveClick = () => {
    if (!isConfirming || loading) {
      setIsConfirming(false);
      return;
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
        navigate(`/x-workz/profile/${emailValue}`);
      })
      .catch((error) => {
        setLoading(false);
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

  const handleVerifyEmail = (event) => {
    verifyEmail(event.target.value);
  };
  const isDisabled = verifyHandaleEmailerror || numberCheck || emailCheck;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Details</DialogTitle>
      <DialogContent>
        {/* Render your form fields here */}
        <IconButton
          color="inherit"
          onClick={handleClose}
          edge="start"
          aria-label="close"
          style={{ position: "absolute", right: "8px", top: "8px" }}
        >
          <GridCloseIcon />
        </IconButton>
      
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
        {verifyHandaleEmail ? (
          <Alert severity="success">{verifyHandaleEmail}</Alert>
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
        <TextField
          label="Name"
          name="basicInfo.traineeName"
          defaultValue={rowData.basicInfo.traineeName}
          style={fieldStyle}
          onChange={handleInputChange}
        />
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
              width: "300px",
            }}
          >
            {dropdown.qualification.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
              width: "300px",
            }}
          >
            {dropdown.stream.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
              width: "300px", // Adjust padding for a smaller size
              // Adjust font size for a smaller size
            }}
          >
            {dropdown.yearofpass.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
              width: "500px", // Adjust padding for a smaller size
              // Adjust font size for a smaller size
            }}
          >
            {dropdown.college.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
              width: "300px", // Adjust padding for a smaller size
              // Adjust font size for a smaller size
            }}
          >
            {batchDetails.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Branch"
          name="courseInfo.branch"
          value={formData.branch || ""}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="Batch Type"
          name="courseInfo.batchType"
          value={formData.batchType || ""}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="Trainer Name"
          name="courseInfo.trainerName"
          value={formData.trainerName || ""}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="Batch Timing"
          name="courseInfo.batchTiming"
          value={formData.batchTiming || ""}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="Start Time"
          name="courseInfo.startTime"
          value={formData.startTime || ""}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <FormControl>
          <InputLabel id="demo-simple-select-label">Offered As</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="offeredAs"
            defaultValue={rowData.courseInfo.offeredAs || ""}
            required
            margin="normal"
            variant="outlined"
            style={fieldStyle}
          >
            {dropdown.offered.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Referal Name"
          name="referralInfo.referalName"
          defaultValue={rowData.othersDto.referalName}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="Referal Contact Number"
          name="othersDto.referalContactNumber"
          defaultValue={rowData.othersDto.referalContactNumber}
          onChange={handleInputChange}
          style={fieldStyle}
        />

        <TextField
          label="Comments"
          name="othersDto.comments"
          defaultValue={rowData.othersDto.comments}
          onChange={handleInputChange}
          style={fieldStyle}
          className="custom-textfield" // Apply the custom CSS class
          multiline
          rows={4}
        />

        <TextField
          label="X-workz E-mail"
          name="othersDto.xworkzEmail"
          defaultValue={rowData.othersDto.xworkzEmail}
          onChange={handleInputChange}
          style={fieldStyle}
        />

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
              width: "200px", // Adjust padding for a smaller size
              fontSize: "20px", // Adjust font size for a smaller size
            }}
          >
            {dropdown.branchname.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
              width: "200px", // Adjust padding for a smaller size
              fontSize: "20px", // Adjust font size for a smaller size
            }}
          >
            {dropdown.batch.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        {loading ? (
          <CircularProgress size={20} /> // Show loading spinner
        ) : (
          <Button
            onClick={handleEditClick}
            disabled={isDisabled}
            color="primary"
          >
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
