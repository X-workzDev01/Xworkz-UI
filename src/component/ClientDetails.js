import {
  Alert,
  Autocomplete,
  Button,
  Grid,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { Urlconstant } from "../constant/Urlconstant";
import {
  validateContactNumber,
  validateEmail,
  validateWebsite,

} from "../constant/ValidationConstant";
import { ClientDropDown } from "../constant/ClientDropDown";
import { textFieldStyles } from "../constant/FormStyle";
import "./Company.css"
export default function ClientDetails() {

  const email = sessionStorage.getItem("userId");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [companyNameCheck, setCompanyNameCheck] = React.useState("");
  const [companyEmailCheck, setCompanyEmailCheck] = React.useState("");
  const [emailCheck, setEmailCheck] = React.useState("");
  const [phoneNumberCheck, setPhoneNumberCheck] = React.useState("");
  const [formData, setFormData] = React.useState({
    companyName: "",
    companyEmail: "",
    companyLandLineNumber: "",
    companyWebsite: "",
    companyLocation: "",
    companyFounder: "",
    sourceOfConnetion: "",
    companyType: "",
    companyAddress: "",
    status: "Active", // Default value set to "Active"
  });

  const [checkPhoneNumberExist, setCheckPhoneNumberExist] = React.useState("");
  const [checkCompanyWebsite, setCheckCompanyWebsite] = React.useState("");
  const [catchErrors, setCatchErrors] = React.useState("");
  const [dropdownState, setDropdownState] = React.useState({
    college: [],
  });

  const getCollegeDropDown = () => {
    axios
      .get(Urlconstant.url + "utils/dropdown", {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })
      .then((response) => {
        setDropdownState({ college: response.data.college });
      })
      .catch((error) => { });
  };
  const [dropdown, setDropDown] = React.useState({
    clientType: [],
    sourceOfConnection: [],
    sourceOfLocation: [],
    hrDesignation: [],
    callingStatus: []
  });
  React.useEffect(() => {
    getDropdown();
  }, [])
  const getDropdown = () => {
    axios.get(Urlconstant.url + `utils/clientdropdown`).then((response) => {
      setDropDown(response.data);
    })
  }

  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "companyType") {
      if(value.length>=2){
        getCollegeDropDown();
      }
      setFormData((prevData) => ({
        ...prevData,
        companyName: "", // Clear the companyName field
        [name]: value,
      }));
      setCompanyNameCheck("");
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    switch (name) {
      case "companyName":
        if (value.length <= 2) {
          setCompanyNameCheck("Name should not be empty");
        } else {
          setCompanyNameCheck("");
          handleCompanyName(value);
        }
        break;
      case "companyEmail":
        if (!validateEmail(value)) {
          setCompanyEmailCheck("");
          setEmailCheck("Enter the valid Email");
        } else {
          setEmailCheck("");
          handleCompanyEmail(value)
        }
        break;
      case "companyLandLineNumber":
        if (!validateContactNumber(value)) {
          setCheckPhoneNumberExist("");
          setPhoneNumberCheck("Enter valid contact number");
        } else {
          setPhoneNumberCheck("");
          handleCompanyContactNumber(value);
        }
        break;
      case "companyWebsite":
        if (!validateWebsite(value)) {
          setCheckCompanyWebsite("Enter valid website")
        } else {
          handleCompanyWebsite(value);
        }
        break;
      default:
        break;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true)
    try {
      const clientData = {
        ...formData,
        adminDto: { createdBy: email },
      };
      axios.post(Urlconstant.url + "api/registerclient", clientData).then((response) => {
        setOpen(true);
        setSnackbarMessage(response.data);
        setFormData({
          companyName: "",
          companyEmail: "",
          companyLandLineNumber: "",
          companyWebsite: "",
          companyLocation: "",
          companyFounder: "",
          sourceOfConnetion: "",
          companyType: "",
          companyAddress: "",
          status: "Active",
        });
      });
    } catch (error) {
      setCatchErrors("Wait for some time");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompanyName = (companyname) => {
    axios
      .get(Urlconstant.url + `/api/companynamecheck?companyName=${companyname}`)
      .then((res) => {
        if (res.data === "Company Already Exists") {
          setCompanyNameCheck("Already Exists");
        } else {
          setCompanyNameCheck("");
        }
      })
      .catch((error) => {
        if (error.response.status === 500) {
          setCompanyNameCheck("");
        } else {
          setCompanyNameCheck("An error occurred. Please try again.");
        }
      });
  };

  const handleCompanyEmail = (companyEmail) => {
    axios
      .get(
        Urlconstant.url + `/api/checkcompanyemail?companyEmail=${companyEmail}`
      )
      .then((res) => {
        if (res.data === "Company Email Already Exists") {
          setEmailCheck("");
          setCompanyEmailCheck("Email Already Exists");
        } else {
          setCompanyEmailCheck("");
          verifyEmail(companyEmail)
        }
      })
      .catch((error) => {
        if (error.response.status === 500) {
          setCompanyEmailCheck("");
        } else {
          setCompanyEmailCheck("An error occurred. Please try again.");
        }
      });
  };
  const verifyEmail = (email) => {
    console.log("calling verifyEmail")
    axios
      .get(`${Urlconstant.url}api/verify-email?email=${email}`)
      .then((response) => {
        if (response.status === 200) {
          if (response.data === "accepted_email") {
            setEmailCheck("");
            setCompanyEmailCheck("");
          } else if (response.data === "rejected_email") {
            setEmailCheck("");
            setCompanyEmailCheck(response.data);
          } else if (response.data === "invalid_domain") {
            setEmailCheck("");
            setCompanyEmailCheck(response.data);
          } else {
            setCompanyEmailCheck("")
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

  const handleCompanyContactNumber = (companyContactNumber) => {
   // const companyContactNumber = event.target.value;
    axios
      .get(
        Urlconstant.url +
        `/api/checkContactNumber?contactNumber=${companyContactNumber}`
      )
      .then((res) => {
        if (res.data === "Company ContactNumber Already Exists") {
          setCheckPhoneNumberExist("ContactNumber Already Exists");
          setIsSubmitting(false);
          setPhoneNumberCheck("");
        } else {
          setCheckPhoneNumberExist("");
        }
      })
      .catch((error) => {
        if (error.response.status === 500) {
          setCheckPhoneNumberExist("");
        } else {
          setCheckPhoneNumberExist("An error occurred. Please try again.");
        }
      });
  };

  const handleCompanyWebsite = (website) => {
    axios
      .get(
        Urlconstant.url +
        `/api/checkCompanyWebsite?companyWebsite=${website}`
      )
      .then((res) => {
        if (res.data === "CompanyWebsite Already Exists") {
          setCheckCompanyWebsite("Website Already Exists");
        } else {
          setCheckCompanyWebsite("");
        }
      })
      .catch((error) => {
        if (error.response.status === 500) {
          setCheckCompanyWebsite("");
        } else {
          setCheckCompanyWebsite("An error occurred. Please try again.");
        }
      });
  };


  const handleClearAction = () => {
    setFormData({
      companyName: "",
      companyEmail: "",
      companyLandLineNumber: "",
      companyWebsite: "",
      companyLocation: "",
      companyFounder: "",
      sourceOfConnetion: "",
      companyType: "",
      companyAddress: "",
      status: "Active",
    });
    setCheckCompanyWebsite("");
    setCheckPhoneNumberExist("")
    setPhoneNumberCheck("")
    setCompanyEmailCheck("")
    setCompanyNameCheck("")
    setEmailCheck("")
  }
  return (
    <div>
      <h1>Register Client</h1>

      <div className="container border mt-4 p-4">
        <div className="form-container">
          <Typography variant="h5" className="bold-text">
            Register Company
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Type"
                name="companyType"
                value={formData.companyType}
                onChange={handleChange}
                fullWidth
                margin="normal"
                select
                sx={textFieldStyles}
              >
                {dropdown.clientType.map((item, option) => (
                  <MenuItem value={item} key={option}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              {formData.companyType === 'College' ? (
                <Autocomplete
                  freeSolo
                  disableClearable
                  options={dropdownState.college}
                  value={formData.companyName}
                  onChange={(event, newValue) => {
                    handleChange({ target: { name: 'companyName', value: newValue } });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Name"
                      name="companyName"
                      fullWidth
                      margin="normal"
                      sx={textFieldStyles}
                    />
                  )}
                />
              ) : (
                <TextField
                  label="Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  sx={textFieldStyles}
                />
              )}
              {companyNameCheck && (
                <Alert severity="error">{companyNameCheck}</Alert>
              )}
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="E-mail"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={textFieldStyles}
              />
              {emailCheck && (
                <Alert severity="error">{emailCheck}</Alert>
              )}
              {companyEmailCheck && (
                <Alert severity="error">{companyEmailCheck}</Alert>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Contact Number"
                name="companyLandLineNumber"
                value={formData.companyLandLineNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={textFieldStyles}
              />
              {phoneNumberCheck && (
                <Alert severity="error">{phoneNumberCheck}</Alert>
              )}
              {checkPhoneNumberExist && (
                <Alert severity="error">{checkPhoneNumberExist}</Alert>
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Founder"
                name="companyFounder"
                value={formData.companyFounder}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Website"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                fullWidth
                margin="normal"
                sx={textFieldStyles}
              />
              {checkCompanyWebsite ? (
                <Alert severity="error">{checkCompanyWebsite}</Alert>
              ) : (
                " "
              )}
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Location"
                name="companyLocation"
                value={formData.companyLocation}
                onChange={handleChange}
                fullWidth
                margin="normal"
                select
                sx={textFieldStyles}
              >
                {dropdown.sourceOfLocation.map((item, option) => (
                  <MenuItem value={item} key={option}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Source Of Connection"
                name="sourceOfConnection"
                value={formData.sourceOfConnection}
                onChange={handleChange}
                fullWidth
                margin="normal"
                select
                sx={textFieldStyles}
              >
                {dropdown.sourceOfConnection.map((item, option) => (
                  <MenuItem value={item} key={option}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
                select
                sx={textFieldStyles}
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
                rows={3}
                label="Address"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                sx={textFieldStyles}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Grid container justifyContent="center">
                {/* Submit button */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={
                    isSubmitting ||
                    !formData.companyName ||
                    !formData.companyEmail ||
                    !formData.companyLandLineNumber ||
                    companyNameCheck ||
                    companyEmailCheck ||
                    emailCheck ||
                    phoneNumberCheck ||
                    checkPhoneNumberExist ||
                    checkCompanyWebsite
                  }
                  onClick={handleSubmit}
                  className="dark-button"
                  sx={{ marginRight: 1 }}
                >
                  Register
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClearAction}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
      <Snackbar
        open={open}
        onClose={handleClose}
        message={snackbarMessage}
        autoHideDuration={3000}
      />
    </div>
  );
}
