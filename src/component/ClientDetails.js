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
  const [isDisabled, setDisable] = React.useState(true);
  const [formData, setFormData] = React.useState({
    companyName: "",
    companyEmail: "",
    companyLandLineNumber: "",
    companyWebsite: "",
    companyLocation: "",
    companyFounder: "",
    sourceOfConnection: "",
    companyType: "",
    companyAddress: "",
    status: "Active", // Default value set to "Active"
  });
  const [checkPhoneNumberExist, setCheckPhoneNumberExist] = React.useState("");
  const [checkCompanyWebsite, setCheckCompanyWebsite] = React.useState("");
  const [checkCompanyWebsiteExist, setCheckCompanyWebsiteExist] = React.useState("");
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

  let valueDisabled = isSubmitting ||
    !formData.companyName ||
    !formData.companyEmail ||
    !formData.companyLandLineNumber ||
    companyNameCheck ||
    companyEmailCheck ||
    emailCheck ||
    phoneNumberCheck ||
    checkPhoneNumberExist ||
    checkCompanyWebsite ||
    !formData.companyType

  const handleChange = (e) => {
    setDisable(valueDisabled);
    const { name, value } = e.target;
    if (name === "companyType") {
      if (value === "College") {
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
        }
        break;
      case "companyEmail":
        if (!validateEmail(value)) {
          setCompanyEmailCheck("");
          setEmailCheck("Enter the valid Email");
        } else {
          setEmailCheck("");
        }
        break;
      case "companyLandLineNumber":
        if (!validateContactNumber(value)) {
          setCheckPhoneNumberExist("");
          setPhoneNumberCheck("Enter valid contact number");
        } else {
          setPhoneNumberCheck("");
        }
        break;
      case "companyWebsite":
        if (!validateWebsite(value)) {
          setCheckCompanyWebsiteExist("");
          setCheckCompanyWebsite("Enter valid website");
        } else {
          setCheckCompanyWebsite("");
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
    setDisable(true)
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

  const handleCompanyName = (event) => {
    const companyName = event.target.value;
    if (companyName.trim() !== "") {
      axios
        .get(Urlconstant.url + `/api/companynamecheck?companyName=${companyName}`)
        .then((res) => {
          if (res.data === "Company Already Exists") {
            setCompanyNameCheck("Already Exists");
          } else {
            setCompanyNameCheck("");
          }
        })
        .catch((error) => { });
    }
  };

  const handleCompanyEmail = (event) => {
    const companyEmail = event.target.value;
    if (companyEmail.trim() !== "" && validateEmail(companyEmail)) {
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
            if (validateEmail(companyEmail)) {
              verifyEmail(companyEmail);
            }
          }
        })
        .catch((error) => { });
    }
  };
  const verifyEmail = (email) => {
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

  const handleCompanyContactNumber = (event) => {
    const companyContactNumber = event.target.value;
    if (companyContactNumber.trim() !== "" && companyContactNumber.length === 10) {
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
        .catch((error) => { });
    }
  };

  const handleCompanyWebsite = (event) => {
    const website = event.target.value;
    if (website.trim() !== "" && validateWebsite(website)) {
      axios
        .get(
          Urlconstant.url +
          `/api/checkCompanyWebsite?companyWebsite=${website}`
        )
        .then((res) => {
          if (res.data === "CompanyWebsite Already Exists") {
            setCheckCompanyWebsite("");
            setCheckCompanyWebsiteExist(res.data);
          } else {
            if (validateWebsite(website)) {
              setCheckCompanyWebsiteExist("");
            } else {
              setCheckCompanyWebsite("Enter the valid website")
            }
          }
        })
        .catch((error) => { });
    }
  };


  const handleClearAction = () => {
    setFormData({
      companyName: "",
      companyEmail: "",
      companyLandLineNumber: "",
      companyWebsite: "",
      companyLocation: "",
      companyFounder: "",
      sourceOfConnection: "",
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
                      onBlur={handleCompanyName}
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
                  onBlur={handleCompanyName}
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
                onBlur={handleCompanyEmail}
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
                onBlur={handleCompanyContactNumber}
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
                onBlur={handleCompanyWebsite}
              />
              {checkCompanyWebsite ? (
                <Alert severity="error">{checkCompanyWebsite}</Alert>
              ) : (
                " "
              )}
              {checkCompanyWebsiteExist ? (
                <Alert severity="error">{checkCompanyWebsiteExist}</Alert>
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
                  disabled={isDisabled}
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
