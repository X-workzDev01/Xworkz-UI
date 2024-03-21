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
import axios from "axios";
import React from "react";
import { Urlconstant } from "../constant/Urlconstant";
import { style } from "../constant/FormStyle";
import {
  validateContactNumber,
  validateEmail,
  validateWebsite,
} from "../constant/ValidationConstant";
import { ClientDropDown } from "../constant/ClientDropDown";
import { useSelector } from "react-redux";

const EditCompanyDetails = ({ open, handleClose, rowData, dropdown }) => {
  const email = useSelector(state => state.loginDetiles.email)
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [editedData, setEditedData] = React.useState([]);
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [companyNameCheck, setCompanyNameCheck] = React.useState("");
  const [nameCheck, setNameCheck] = React.useState("");
  const [verifyEmail, setVerifyEmail] = React.useState("");
  const [checkCompanyWebsite, setCheckCompanyWebsite] = React.useState("");
  const [checkPhoneNumberExist, setCheckPhoneNumberExist] = React.useState("");
  const [error, setError] = React.useState("");
  const [founderNameCheck, setFounderNameCheck] = React.useState("");
  const [emailCheck, setEmailCheck] = React.useState("");
  const [phoneNumberCheck, setPhoneNumberCheck] = React.useState("");
  const [checkEmailExist, setCheckEmailExist] = React.useState("");
  const [addressError, setAddressError] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setEditedData(rowData);
      setNameCheck("");
      setCompanyNameCheck("");
      setCheckEmailExist("");
      setEmailCheck("");
      setPhoneNumberCheck("");
      setCheckPhoneNumberExist("");
      setVerifyEmail("");
      setCheckCompanyWebsite("");
      setError("");
      setFounderNameCheck("");
      setAddressError("");
    }
  }, [open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "companyName") {
      if (value === " " || value.length <= 2) {
        setNameCheck("Enter the Correct Company Name");
        setCompanyNameCheck("");
      } else {
        setNameCheck("");
      }
    }
    if (name === "companyEmail") {
      if (!validateEmail(value)) {
        setEmailCheck("Enter the valid E-mail");
        setCheckEmailExist("");
        setVerifyEmail("");
      } else {
        setEmailCheck("");
      }
    }
    if (name === "companyLandLineNumber") {
      if (validateContactNumber(value)) {
        setPhoneNumberCheck("");
      } else {
        setCheckPhoneNumberExist("");
        setPhoneNumberCheck("Contact number should be 10 digit");
      }
    }
    if (name === "companyWebsite" && value.length <= 3 && !validateWebsite(value)) {
      setCheckCompanyWebsite("");
      setError("Enter the valid website");
    } else if (validateWebsite(value)) {
      setError("");
    }

    if (name === "companyFounder") {
      if (value === "") {
        setFounderNameCheck("");
      } else if (value.length <= 2) {
        setFounderNameCheck("Enter Correct Name")
      } else if (value.length >= 2) {
        setFounderNameCheck("");
      }
    }
    if (name === "companyAddress") {
      if (value === "") {
        setAddressError("");
      } else if (value.length <= 2) {
        setAddressError("Comments should not be empty");
      } else {
        setAddressError("");
      }
    }
    setEditedData((prevData) => ({
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
    setSnackbarOpen(true);
    handleClose();
  };

  const handleCompanyNameCheck = (companyName) => {
    if (companyName === "NA") {
      setCompanyNameCheck("");
    } else {
      if (companyName.trim() != "") {
        axios
          .get(
            Urlconstant.url + `/api/companynamecheck?companyName=${companyName}`
          )
          .then((response) => {
            if (response.data === "Company Already Exists") {
              setCompanyNameCheck(response.data);
            } else {
              setCompanyNameCheck("");
            }
          })
          .catch((err) => { });
      }
    }
  };
  const handleCompanyEmail = (companyEmail) => {
    if (companyEmail === "NA") {
      setCheckEmailExist("");
    } else {
      if (companyEmail.trim() != "" && validateEmail(companyEmail)) {
        axios
          .get(
            Urlconstant.url +
            `/api/checkcompanyemail?companyEmail=${companyEmail}`
          )
          .then((res) => {
            if (res.data === "Company Email Already Exists") {
              setCheckEmailExist(res.data);
              setEmailCheck("");
              setVerifyEmail("");
            } else {
              setCheckEmailExist("");
              if (validateEmail(companyEmail)) {
                validatingEmail(companyEmail);
              }
            }
          });
      } else {
        setEmailCheck("");
        setCheckEmailExist("Enter the valid E-mail");
      }
    }
  };

  const validatingEmail = (email) => {
    axios
      .get(`${Urlconstant.url}api/verify-email?email=${email}`)
      .then((response) => {
        if (response.status === 200) {
          if (response === "accepted_email") {
            setVerifyEmail(response);
          } else if (response.data === "rejected_email") {
            setVerifyEmail(response);
          } else if (response.data === "low_quality") {
            setVerifyEmail(response);
          }
        } else {
          if (response.status === 500) {
            setVerifyEmail("");
          }
        }
      })
      .catch((error) => { });
  };

  const handleCompanyWebsite = (companyWebsite) => {
    if (companyWebsite === "NA") {
      setCheckCompanyWebsite("");
    } else {
      if (companyWebsite.trim() != "" && validateWebsite(companyWebsite)) {
        axios
          .get(
            Urlconstant.url +
            `/api/checkCompanyWebsite?companyWebsite=${companyWebsite}`
          )
          .then((res) => {
            if (res.data === "CompanyWebsite Already Exists") {
              setCheckCompanyWebsite(res.data);
              setError("");
            } else {
              setCheckCompanyWebsite("");
            }
          });
      } else {
        setError("");
      }
    }
  };

  const handleCompanyContactNumber = (companyContactNumber) => {
    if (companyContactNumber == "0") {
      setCheckPhoneNumberExist("");
    } else {
      if (companyContactNumber.trim() != "" && validateContactNumber(companyContactNumber)) {
        axios
          .get(
            Urlconstant.url +
            `/api/checkContactNumber?contactNumber=${companyContactNumber}`
          )
          .then((res) => {
            if (res.data === "Company ContactNumber Already Exists") {
              setPhoneNumberCheck("");
              setCheckPhoneNumberExist(res.data);
            } else {
              setCheckPhoneNumberExist("");
            }
          })
          .catch((error) => { });
      }
    }
  };

  const handleEmail = (event) => {
    const email = event.target.value;
    if (email !== rowData.companyEmail) {
      handleCompanyEmail(email);
    } else {
      setCheckEmailExist("");
    }
  };

  const handleCompanyName = (event) => {
    const companyName = event.target.value;
    if (companyName !== rowData.companyName) {
      handleCompanyNameCheck(companyName);
    }
  };
  const handlePhoneNumber = (event) => {
    const phoneNumber = event.target.value;
    if (phoneNumber != rowData.companyLandLineNumber) {
      if (phoneNumber.length === 10) {
        handleCompanyContactNumber(phoneNumber);
      }
    }
  };

  const handleWebsite = (event) => {
    const companyWebsite = event.target.value;
    if (companyWebsite !== rowData.companyWebsite) {
      handleCompanyWebsite(companyWebsite);
    }
  };

  const handleSaveClick = () => {
    if (setIsConfirming) {
      setLoading(true);
      setIsConfirmed(true)
      try {
        const updatedData = {
          ...editedData,
          adminDto: {
            ...editedData.adminDto,
            updatedBy: email,
          },
          companyFounder: editedData.companyFounder === "" ? rowData.companyFounder : editedData.companyFounder,
          companyWebsite: editedData.companyWebsite === "" ? rowData.companyWebsite : editedData.companyWebsite,
          companyAddress: editedData.companyAddress === "" ? rowData.companyAddress : editedData.companyAddress,
        };
        axios
          .put(
            Urlconstant.url + `api/clientupdate?companyId=${rowData.id}`,
            updatedData
          )
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
            }
          });
      } catch (response) {
        setResponseMessage("Company profile not updated");
        setLoading(false);
        setSnackbarOpen(true);
      }
    }
  };

  const disable =
    nameCheck ||
    companyNameCheck ||
    emailCheck ||
    phoneNumberCheck ||
    checkEmailExist ||
    nameCheck ||
    checkCompanyWebsite ||
    checkPhoneNumberExist ||
    error ||
    founderNameCheck ||
    addressError ||
    ((verifyEmail !== "accepted_email" || verifyEmail !== "low_quality") && verifyEmail);
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        Edit Company Details
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
              label="Company Name"
              name="companyName"
              defaultValue={rowData.companyName}
              onChange={handleChange}
              onBlur={handleCompanyName}
              required
              fullWidth
              margin="normal"
            />

            {nameCheck ? <Alert severity="error">{nameCheck}</Alert> : " "}
            {companyNameCheck ? (
              <Alert severity="error">{companyNameCheck}</Alert>
            ) : (
              " "
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Company Email"
              name="companyEmail"
              defaultValue={rowData.companyEmail}
              onChange={handleChange}
              fullWidth
              margin="normal"
              onBlur={handleEmail}
            />
            {emailCheck ? <Alert severity="error">{emailCheck}</Alert> : ""}
            {checkEmailExist ? <Alert severity="error">{checkEmailExist}</Alert> : ""}
            {(verifyEmail === "accepted_email" || verifyEmail === "low_quality") && <Alert severity="success">{verifyEmail}</Alert>}
            {verifyEmail && (verifyEmail !== "accepted_email" || verifyEmail !== "low_quality") && <Alert severity="error">{verifyEmail}</Alert>}
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Company Contact Number"
              name="companyLandLineNumber"
              defaultValue={rowData.companyLandLineNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
              onBlur={handlePhoneNumber}
            />

            {phoneNumberCheck ? (
              <Alert severity="error">{phoneNumberCheck}</Alert>
            ) : (
              " "
            )}
            {checkPhoneNumberExist ? (
              <Alert severity="error">{checkPhoneNumberExist}</Alert>
            ) : (
              " "
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Company Website"
              name="companyWebsite"
              defaultValue={rowData.companyWebsite != "NA" ? rowData.companyWebsite : ""}
              placeholder={rowData.companyWebsite === "NA" ? "NA" : ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              onBlur={handleWebsite}
            />
            {error ? <Alert severity="error">{error}</Alert> : " "}
            {checkCompanyWebsite ? (
              <Alert severity="error">{checkCompanyWebsite}</Alert>
            ) : (
              " "
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Company Location"
              name="companyLocation"
              defaultValue={rowData.companyLocation}
              onChange={handleChange}
              fullWidth
              margin="normal"
              select
            >{dropdown.sourceOfLocation.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Company Founder"
              name="companyFounder"
              defaultValue={rowData.companyFounder != "NA" ? rowData.companyFounder : ""}
              placeholder={rowData.companyFounder === "NA" ? "NA" : ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            {founderNameCheck ? (
              <Alert severity="error">{founderNameCheck}</Alert>
            ) : (
              " "
            )}
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Source Of Connection"
              name="sourceOfConnection"
              defaultValue={rowData.sourceOfConnection}
              onChange={handleChange}
              fullWidth
              margin="normal"
              select
            >
              {dropdown.sourceOfConnection.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Company Type"
              name="companyType"
              defaultValue={rowData.companyType}
              onChange={handleChange}
              fullWidth
              margin="normal"
              select
            >
              {dropdown.clientType.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Company Status"
              name="status"
              defaultValue={rowData.status}
              onChange={handleChange}
              required
              fullWidth
              margin="normal"
              select
            >
              {ClientDropDown.statusList.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="standard-multiline-static"
              rows={4}
              label="Company Address"
              name="companyAddress"
              defaultValue={rowData.companyAddress != "NA" ? rowData.companyAddress : ""}
              placeholder={rowData.companyAddress === "NA" ? "NA" : ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
            />
            {addressError ? (
              <Alert severity="error">{addressError}</Alert>
            ) : (
              " "
            )}

          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          <Button disabled={disable} onClick={handleHrAddClick} color="primary">
            Edit
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
      <Dialog open={isConfirming} onClose={handleClose} fullWidth maxWidth="xs" >
        <DialogTitle>Confirm Edit</DialogTitle>
        <DialogContent>
          Are you sure want to Edit the Company Details?
        </DialogContent>
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
export default EditCompanyDetails;

