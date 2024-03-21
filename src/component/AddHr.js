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
  InputAdornment,
  MenuItem,
  Snackbar,
  TextField
} from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import axios from "axios";
import React from "react";
import { fieldStyle, style } from "../constant/FormStyle";
import { Urlconstant } from "../constant/Urlconstant";
import {
  validateContactNumber,
  validateEmail,
} from "../constant/ValidationConstant";
import { useSelector } from "react-redux";

const AddHr = ({ open, handleClose, rowData, dropdown, handleAfterResponse }) => {
  const email = useSelector(state => state.loginDetiles.email)
  const [loading, setLoading] = React.useState(false);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const [emailCheck, setEmailCheck] = React.useState("");
  const [phoneNumber, setPhoneNumberCheck] = React.useState("");
  const [checkEmailExist, setCheckEmailExist] = React.useState("");
  const [checkPhoneNumberExist, setCheckPhoneNumberExist] = React.useState("");
  const [verifyEmail, setVerifyEmail] = React.useState("");
  const [validateName, setValidateName] = React.useState("");
  const [validateDesignation, setValidateDesignation] = React.useState("");
  React.useEffect(() => {
    setFormData({});
    if (open) {
      setPhoneNumberCheck("");
      setEmailCheck("");
      setCheckEmailExist("");
      setCheckPhoneNumberExist("");
      setVerifyEmail("");
      setValidateName("");
      setCharCount("");
    }
  }, [open, handleClose]);

  const [charCount, setCharCount] = React.useState("");
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "hrSpocName") {
      if (value && value.length <= 2) {
        setValidateName("Enter the valid name");
      } else {
        setValidateName("");
      }
    }
    if (name === "hrEmail") {
      if (validateEmail(value)) {
        setEmailCheck("");
      } else {
        setEmailCheck("Invalid email");
        setCheckEmailExist("");
        setVerifyEmail("");
      }
    }
    if (name === "hrContactNumber") {
      if (value.length <= 9 || value.length > 10 && !validateContactNumber(value)) {
        setPhoneNumberCheck("Invalid Contact Number");
        setCheckPhoneNumberExist("");
      } else {
        setPhoneNumberCheck("");
      }
    }
    if (name === "designation") {
      if (value && value.length <= 1) {
        setValidateDesignation("Enter the correct designation");
      } else {
        setValidateDesignation("");
      }
    }
    if (name === "status") {
      setCharCount(value.length);
    } else {
      setCharCount("");
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleHrAddClick = () => {
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
    handleClose();
    handleAfterResponse();
  };

  const handleSaveClick = () => {
    if (isConfirming) {
      setIsConfirmed(true)
      setLoading(true);
      try {
        const hrData = {
          ...formData,
          companyId: rowData.id,
          adminDto: { createdBy: email },
        };

        for (const field in hrData) {
          if (!hrData[field]) {
            hrData[field] = "NA";
          }
        }

        axios
          .post(Urlconstant.url + "api/registerclienthr", hrData)
          .then((response) => {
            if (response.status === 200) {
              setSnackbarOpen(true);
              setLoading(false);
              setResponseMessage(response.data);
              setIsConfirming(false);
              setIsConfirmed(false);
              setTimeout(() => {
                handleCloseForm();
              }, 1000);
              setFormData({});
              handleAfterResponse();
            }
          })
          .catch((error) => {
            if (error.response && error.response.status === 500) {
              // Handle HTTP status code 500
              setLoading(false);
              setResponseMessage(
                "Internal Server Error: Please try again later"
              );
              setSnackbarOpen(true);
            } else {
              // Handle other errors
              setLoading(false);
              setResponseMessage("HR information saved");
              setSnackbarOpen(true);
            }
          });
      } catch (error) {
        setLoading(false);
        setResponseMessage("HR information not saved");
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
            setEmailCheck("");
            setCheckEmailExist("");
          } else if (response.data === "rejected_email") {
            setVerifyEmail(response.data);
            setEmailCheck("");
            setCheckEmailExist("");
          }
          else if (response.data === "low_quality") {
            setVerifyEmail(response.data);
            setEmailCheck("");
            setCheckEmailExist("");
          }
          else {
            setVerifyEmail(response.data);
            setEmailCheck("");
            setCheckEmailExist("");
          }
        } else {
          if (response.status === 500) {
            setVerifyEmail("");
          }
        }
      })
      .catch((error) => {
      });
  };

  const handleEmailCheck = (event) => {
    let email = event.target.value;
    if (email.trim() !== "" && validateEmail(email)) {
      axios
        .get(Urlconstant.url + `api/hremailcheck?hrEmail=${email}`)
        .then((response) => {
          if (response.data === "Email already exists.") {
            setEmailCheck("");
            setVerifyEmail("");
            setCheckEmailExist(response.data);
          } else {
            if (validateEmail(email)) {
              validatingEmail(email)
              setCheckEmailExist("");
            }
          }
        })
        .catch((error) => { });
    }
  };

  const handleNumberCheck = (event) => {
    let contactNumber = event.target.value;
    if (contactNumber.trim() !== "" && validateContactNumber(contactNumber)) {
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
        })
        .catch((error) => { });
    }
  };

  const isDisable = ((verifyEmail !== "accepted_email" && verifyEmail !== "low_quality") && verifyEmail)
    || checkEmailExist || validateName || emailCheck || checkPhoneNumberExist
    || phoneNumber || !formData.hrSpocName || !formData.hrContactNumber ||
    !formData.designation || !formData.hrEmail
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        Add New HR
        <IconButton
          color="inherit"
          onClick={handleClose}
          edge="start"
          aria-label="close"
          style={style}
        >
          <GridCloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Hr Spoc Name"
              name="hrSpocName"
              onChange={handleInputChange}
              style={fieldStyle}
              value={formData.hrSpocName}
            />
            {validateName ? (
              <Alert severity="error">{validateName}</Alert>
            ) : (
              " "
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Hr Email Id"
              name="hrEmail"
              onChange={handleInputChange}
              style={fieldStyle}
              value={formData.hrEmail}
              onBlur={handleEmailCheck}
            />
            {emailCheck ? <Alert severity="error">{emailCheck}</Alert> : " "}
            {checkEmailExist ? (
              <Alert severity="error">{checkEmailExist}</Alert>
            ) : (
              " "
            )}

            {(verifyEmail === "accepted_email" || verifyEmail === "low_quality") && (
              <Alert severity="success">{verifyEmail}</Alert>
            )}
            {verifyEmail && (verifyEmail !== "accepted_email" && verifyEmail !== "low_quality") && <Alert severity="error">{verifyEmail}</Alert>}
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Hr ContactNumber"
              name="hrContactNumber"
              onChange={handleInputChange}
              style={fieldStyle}
              value={formData.hrContactNumber}
              onBlur={handleNumberCheck}
            />
            {phoneNumber ? <Alert severity="error">{phoneNumber}</Alert> : " "}
            {checkPhoneNumberExist ? (
              <Alert severity="error">{checkPhoneNumberExist}</Alert>
            ) : (
              " "
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Hr Designation"
              name="designation"
              onChange={handleInputChange}
              style={fieldStyle}
              value={formData.designation}
              select
              fullWidth
              margin="normal"
            >
              {dropdown.hrDesignation.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Comments"
              name="status"
              onChange={handleInputChange}
              style={fieldStyle}
              value={formData.status}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              InputProps={{
                style: { right: 1, bottom: 1 },
                endAdornment: (
                  <InputAdornment position="left">
                    {charCount}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          <Button
            disabled={isDisable}
            onClick={handleHrAddClick}
            color="primary"
          >
            Add
          </Button>
        )}
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {responseMessage}
        </Alert>
      </Snackbar>
      <Dialog open={isConfirming} onClose={() => setIsConfirming(false)} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>Adding New HR Details</DialogContent>
        <DialogActions>
          <IconButton
            color="inherit"
            onClick={() => setIsConfirming(false)}
            edge="start"
            aria-label="close"
            style={style}
          >
            <GridCloseIcon />
          </IconButton>
          <Button onClick={handleSaveClick} color="primary" disabled={isConfirmed}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};
export default AddHr;
