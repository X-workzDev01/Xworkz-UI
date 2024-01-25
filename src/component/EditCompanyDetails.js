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
} from "../constant/ValidationConstant";

const EditCompanyDetails = ({ open, handleClose, rowData }) => {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const attemptedEmail = sessionStorage.getItem("userId");
  const [editedData, setEditedData] = React.useState([]);

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

  const statusList = ["Active", "InActive"].slice().sort();
  const clientType = [
    "IT Consultency",
    "Service Based",
    "Product Based",
    "Others",
  ];
  const sourceOfConnection = [
    "Linkdin",
    "Social Media",
    "Job Portal",
    "Old Student Reference",
    "Reference",
    "Other Reference",
  ];
  const sourceOfLocation = [
    "Bangalore",
    "Mumbai",
    "Chandigarh",
    "Hyderabad",
    "Kochi",
    "Pune",
    "Thiruvanthapuram",
    "Chennai",
    "Kolakata",
    "Ahmedabad",
    "Delhi",
  ];

  React.useEffect(() => {
    setEditedData(rowData);
    setNameCheck("");
    setCompanyNameCheck("");
    setCheckEmailExist("");
    setEmailCheck("");
    setCheckCompanyWebsite("");
    setPhoneNumberCheck("");
    setCheckPhoneNumberExist("");
    setVerifyEmail("");
    setError("");
  }, [rowData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "companyName") {
      if (value === " " || (value.length === 0 && value.length <= 2)) {
        setNameCheck("Enter the Correct Company Name");
        setCompanyNameCheck("");
      } else {
        setNameCheck("");
      }
    }
    if (name === "companyEmail") {
      if (validateEmail(value)) {
        setEmailCheck("");
      } else {
        setCheckEmailExist("");
        setVerifyEmail("");
        setEmailCheck("Enter the correct Email");
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
    if (name === "companyWebsite") {
      if (value.length <= 1) {
        setCheckCompanyWebsite("");
        setError("Enter the valid website");
      } else {
        setError("");
      }
    }

    if (name === "companyFounder") {
      if (value.length <= 1) {
        setFounderNameCheck("Enter the Correct Name");
      } else {
        setFounderNameCheck("");
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
    setSnackbarOpen(false);
    handleClose();
  };

  const handleCompanyNameCheck = (companyName) => {
    if (companyName === "NA") {
      setCompanyNameCheck("");
    } else {
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
        .catch((err) => {
          if (err.response.status === 500) {
            setCompanyNameCheck("Error occured please wait for some time");
          } else {
            setCompanyNameCheck("");
          }
        });
    }
  };
  const handleCompanyEmail = (companyEmail) => {
    if (companyEmail === "NA") {
      setCheckEmailExist("");
    } else {
      axios
        .get(
          Urlconstant.url +
            `/api/checkcompanyemail?companyEmail=${companyEmail}`
        )
        .then((res) => {
          if (res.data === "Company Email Already Exists") {
            setCheckEmailExist(res.data);
          } else {
            setCheckEmailExist("");
            validatingEmail(companyEmail);
          }
        });
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

  const handleCompanyWebsite = (companyWebsite) => {
    if (companyWebsite === "NA") {
      setCheckCompanyWebsite("");
    } else {
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
    }
  };

  const handleCompanyContactNumber = (companyContactNumber) => {
    if (companyContactNumber == "0") {
      setCheckPhoneNumberExist("");
    } else {
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
        .catch((error) => {
          if (error.response.status === 500) {
            setCheckPhoneNumberExist("Contact number not found.");
          } else {
            setCheckPhoneNumberExist("An error occurred. Please try again.");
          }
        });
    }
  };

  const handleEmail = (event) => {
    const email = event.target.value;
    if (email != rowData.companyEmail) {
      handleCompanyEmail(email);
    }
  };

  const handleCompanyName = (event) => {
    const companyName = event.target.value;
    if (companyName != rowData.companyName) {
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
    if (companyWebsite != rowData.companyWebsite) {
      handleCompanyWebsite(companyWebsite);
    }
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
            Urlconstant.url + `api/clientupdate?companyId=${rowData.id}`,
            updatedData
          )
          .then((response) => {
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
    verifyEmail;
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
            {emailCheck ? <Alert severity="error">{emailCheck}</Alert> : " "}
            {checkEmailExist ? (
              <Alert severity="error">{checkEmailExist}</Alert>
            ) : (
              " "
            )}
            {verifyEmail ? <Alert severity="error">{verifyEmail}</Alert> : " "}
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
              defaultValue={rowData.companyWebsite}
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
            >
              {sourceOfLocation.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Company Founder"
              name="companyFounder"
              defaultValue={rowData.companyFounder}
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
              label="Source Of Connetion"
              name="sourceOfConnetion"
              defaultValue={rowData.sourceOfConnetion}
              onChange={handleChange}
              fullWidth
              margin="normal"
              select
            >
              {sourceOfConnection.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
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
              {clientType.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
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
              {statusList.map((option) => (
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
              defaultValue={rowData.companyAddress}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
            />
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
      <Dialog open={isConfirming} onClose={handleClose} fullWidth maxWidth="xs">
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
          <Button onClick={handleSaveClick} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};
export default EditCompanyDetails;

