import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    MenuItem,
    Snackbar,
    TextField,
  } from "@mui/material";
  import { GridCloseIcon } from "@mui/x-data-grid";
  import { fieldStyle, style } from "../constant/FormStyle";
  import React from "react";
  import axios from "axios";
  import { Urlconstant } from "../constant/Urlconstant";
  import {
    validateContactNumber,
    validateEmail,
  } from "../constant/ValidationConstant";
  
  const EditHRDetails = ({ open, handleClose, rowData }) => {
    const [editedData, setEditedData] = React.useState([]);
    const [isConfirming, setIsConfirming] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [responseMessage, setResponseMessage] = React.useState("");
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const attemptedEmail = sessionStorage.getItem("userId");
    const [emailCheck, setEmailCheck] = React.useState("");
    const [phoneNumber, setPhoneNumberCheck] = React.useState("");
    const [checkEmailExist, setCheckEmailExist] = React.useState("");
    const [checkPhoneNumberExist, setCheckPhoneNumberExist] = React.useState("");
    const [verifyEmail, setVerifyEmail] = React.useState("");
    const [validateName, setValidateName] = React.useState("");
    const [validateDesignation, setValidateDesignation] = React.useState("");
    const hrDisgnation = [
      "HR",
      "HR Manager",
      "HR Assistant",
      "Recruiter",
      "HR Analyst",
      "Talent Acquisition",
      "Other",
    ];
  
    React.useEffect(() => {
      setEditedData(rowData);
      setValidateDesignation("");
      setEmailCheck("");
      setPhoneNumberCheck("");
      setCheckEmailExist("");
      setCheckPhoneNumberExist("");
      setValidateName("");
      setVerifyEmail("");
    }, [rowData]);
  
    const handleEditClick = () => {
      setIsConfirming(true);
      setSnackbarOpen(false);
    };
  
    const handleCloseForm = () => {
      setResponseMessage("");
      setSnackbarOpen(false);
      handleClose();
    };
    const handleSnackbarClose = () => {
      setSnackbarOpen(false);
      handleClose();
    };
  
    const handleInput = (event) => {
      const { name, value } = event.target;
      if (name === "hrScopName") {
        if (value === " " || (value.length === 0 && value.length <= 2)) {
          setValidateName("Enter the valid name");
        } else {
          setValidateName("");
        }
      }
      if (name === "hrEmail") {
        if (validateEmail(value)) {
          setEmailCheck("");
        } else {
          setEmailCheck("invalid email");
          setCheckEmailExist("");
        }
      }
      if (name === "hrContactNumber") {
        if (validateContactNumber(value)) {
          setPhoneNumberCheck("");
        } else {
          setPhoneNumberCheck("Invalid Contact Number");
          setCheckPhoneNumberExist("");
        }
      }
      if (name === "designation") {
        if (value && value.length <= 1) {
          setValidateDesignation("Enter the correct designation");
        } else {
          setValidateDesignation("");
        }
      }
      setEditedData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
    const handleSaveClick = () => {
      if (setIsConfirming) {
        setLoading(true);
        try {
          const updatedData = {
            ...editedData,
            adminDto: {
              ...editedData.adminDto,
              updatedBy: attemptedEmail,
            },
          };
          axios
            .put(
              Urlconstant.url + `api/updatebyId?hrId=${rowData.id}`,
              updatedData
            )
            .then((response) => {
              setResponseMessage(response.data);
              if (response.status === 200) {
                setSnackbarOpen(true);
                setLoading(false);
                setResponseMessage(response.data);
                setIsConfirming(false);
                setTimeout(() => {
                  handleCloseForm();
                }, 1000);
              }
            });
        } catch (response) {
          setResponseMessage("HR profile not Updated");
          setLoading(false);
          setSnackbarOpen(true);
        }
      }
    };
  
    const validatingEmail = (email) => {
      axios
        .get(`${Urlconstant.url}api/verify-email?email=${email}`)
        .then((response) => {
          if (response.status === 200) {
            if (response.data === "accepted_email") {
              setVerifyEmail(response.data);
            } else if (response.data === "rejected_email") {
              setVerifyEmail(response.data);
            } else {
              setVerifyEmail("");
            }
          } else {
            if (response.status === 500) {
              console.log("Internal Server Error:", response.status);
            } else {
              console.log("Unexpected Error:", response.status);
            }
          }
        })
        .catch((error) => {
          console.log("check emailable credentils");
        });
    };
  
    const handleEmailCheck = (email) => {
      if (email === "NA") {
        setCheckEmailExist("");
      } else {
        axios
          .get(Urlconstant.url + `api/hremailcheck?hrEmail=${email}`)
          .then((response) => {
            if (response.data === "Email already exists.") {
              setEmailCheck("");
              setCheckEmailExist(response.data);
            } else {
              validatingEmail(email);
              setCheckEmailExist("");
            }
          });
      }
    };
    const handleNumberCheck = (contactNumber) => {
      if (contactNumber === "0") {
        setCheckPhoneNumberExist("");
      } else {
        axios
          .get(
            Urlconstant.url +
              `api/hrcontactnumbercheck?contactNumber=${contactNumber}`
          )
          .then((response) => {
            if (response.data === "Contact Number Already exist.") {
              setCheckPhoneNumberExist(response.data);
            } else {
              setCheckPhoneNumberExist("");
              setPhoneNumberCheck("");
            }
          });
      }
    };
  
    const handleEmail = (event) => {
      let email = event.target.value;
      if (email != rowData.hrEmail) {
        handleEmailCheck(email);
      }
    };
    const handleContactNumber = (event) => {
      let contactNumber = event.target.value;
      if (contactNumber != rowData.hrContactNumber) {
        if (contactNumber.length === 10) {
          handleNumberCheck(contactNumber);
        }
      }
    };
  
    const isDisabled =
      emailCheck ||
      phoneNumber ||
      checkEmailExist ||
      checkPhoneNumberExist ||
      verifyEmail ||
      validateName ||
      validateDesignation;
    return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          Edit HR Details{" "}
          <IconButton
            color="inherit"
            onClick={handleClose}
            edge="start"
            aria-label="close"
            style={style}
          >
            <GridCloseIcon />
          </IconButton>{" "}
        </DialogTitle>{" "}
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Hr name"
                name="hrScopName"
                style={fieldStyle}
                defaultValue={rowData.hrScopName}
                onChange={handleInput}
              />{" "}
              {validateName ? (
                <Alert severity="error"> {validateName} </Alert>
              ) : (
                " "
              )}{" "}
            </Grid>{" "}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Hr Email Id"
                name="hrEmail"
                style={fieldStyle}
                defaultValue={rowData.hrEmail}
                onChange={handleInput}
                onBlur={handleEmail}
              />{" "}
              {emailCheck ? <Alert severity="error"> {emailCheck} </Alert> : " "}{" "}
              {checkEmailExist ? (
                <Alert severity="error"> {checkEmailExist} </Alert>
              ) : (
                " "
              )}{" "}
              {verifyEmail ? (
                <Alert severity="error"> {verifyEmail} </Alert>
              ) : (
                " "
              )}{" "}
            </Grid>{" "}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Hr ContactNumber"
                name="hrContactNumber"
                style={fieldStyle}
                defaultValue={rowData.hrContactNumber}
                onChange={handleInput}
                onBlur={handleContactNumber}
              />{" "}
              {phoneNumber ? (
                <Alert severity="error"> {phoneNumber} </Alert>
              ) : (
                " "
              )}{" "}
              {checkPhoneNumberExist ? (
                <Alert severity="error"> {checkPhoneNumberExist} </Alert>
              ) : (
                " "
              )}
            </Grid>{" "}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Hr Designation"
                name="designation"
                onChange={handleInput}
                style={fieldStyle}
                defaultValue={rowData.designation}
                select
                fullWidth
                margin="normal"
              >
                {" "}
                {hrDisgnation.map((option) => (
                  <MenuItem key={option} value={option}>
                    {" "}
                    {option}{" "}
                  </MenuItem>
                ))}{" "}
              </TextField>{" "}
            </Grid>{" "}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Comments"
                name="status"
                style={fieldStyle}
                defaultValue={rowData.status}
                onChange={handleInput}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />{" "}
            </Grid>{" "}
          </Grid>{" "}
        </DialogContent>{" "}
        <DialogActions>
          {" "}
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <Button
              disabled={isDisabled}
              onClick={handleEditClick}
              color="primary"
            >
              Edit{" "}
            </Button>
          )}{" "}
        </DialogActions>{" "}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
            {" "}
            {responseMessage}{" "}
          </Alert>{" "}
        </Snackbar>{" "}
        <Dialog open={isConfirming} onClose={handleClose} fullWidth maxWidth="xs">
          <DialogTitle> Confirm Save </DialogTitle>{" "}
          <DialogContent>
            {" "}
            Are you sure Want to Update the HR Details{" "}
          </DialogContent>{" "}
          <DialogActions>
            <IconButton
              color="inherit"
              onClick={() => setIsConfirming(false)}
              edge="start"
              aria-label="close"
              style={style}
            >
              <GridCloseIcon />
            </IconButton>{" "}
            <Button onClick={handleSaveClick} color="primary">
              Confirm{" "}
            </Button>{" "}
          </DialogActions>{" "}
        </Dialog>{" "}
      </Dialog>
    );
  };
  export default EditHRDetails;
  