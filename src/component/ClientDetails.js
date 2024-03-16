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
import { useSelector } from "react-redux";
export default function ClientDetails() {
  const email = useSelector(state => state.loginDetiles.email)
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [companyNameCheck, setCompanyNameCheck] = React.useState("");
  const [companyEmailCheck, setCompanyEmailCheck] = React.useState("");
  const [emailCheck, setEmailCheck] = React.useState("");
  const [phoneNumberCheck, setPhoneNumberCheck] = React.useState("");
  const [formData, setFormData] = React.useState({
    status: "Active",
  });
  const [checkPhoneNumberExist, setCheckPhoneNumberExist] = React.useState("");
  const [checkCompanyWebsite, setCheckCompanyWebsite] = React.useState("");
  const [checkCompanyWebsiteExist, setCheckCompanyWebsiteExist] = React.useState("");
  const [catchErrors, setCatchErrors] = React.useState("");
  const [checkCompanyNameExist, setCompanyNameCheckExist] = React.useState("");
  const [emailCheckError, setEmailCheckError] = React.useState("");

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
    setIsSubmitting(false)
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "companyType") {
      if (value !== formData.companyType) {
        setFormData({ status: "Active" });
        handleClearAction();
      };
      if (value === "College") {
        getCollegeDropDown();
      }
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "companyName" && value.length <= 3 && value.trim() === "") {
      setCompanyNameCheck("Name should not be empty");
      setCompanyNameCheckExist("");
    }
    else if (value.length >= 3) {
      setCompanyNameCheck("")
    }
    if (name === "companyLandLineNumber") {
      if (!validateContactNumber(value) && value.trim() !== "") {
        setPhoneNumberCheck("Enter valid contact Number")
        setCheckPhoneNumberExist("");
      } else if (validateContactNumber(value)) {
        setPhoneNumberCheck("");
      }
    }
    if (name === "companyEmail" && !validateEmail(value) && value.trim() !== "") {
      setEmailCheck("Enter the valid E-mail");
      setCompanyEmailCheck("");
      setEmailCheckError("");
      setEmailCheckError("");
    } else if (validateEmail(value)) {
      setEmailCheck("");
    }
    if (name === "companyWebsite" && !validateWebsite(value) && value.trim() !== "") {
      setCheckCompanyWebsite("Enter the Valid Website");
      setCheckCompanyWebsiteExist("");
      valueDisabled = true;
    } else if (validateWebsite(value)) {
      setCheckCompanyWebsite("");
    } else if (value.trim() === "") {
      valueDisabled = false;
      setCheckCompanyWebsite("");
    }

  };
  var valueDisabled =
    !formData.companyName ||
    !formData.companyEmail ||
    !formData.companyLandLineNumber ||
    !formData.companyType ||
    companyNameCheck ||
    companyEmailCheck ||
    (emailCheckError !== "accepted_email" && emailCheckError) ||
    emailCheck ||
    phoneNumberCheck ||
    checkPhoneNumberExist ||
    checkCompanyNameExist ||
    checkCompanyWebsiteExist ||
    checkCompanyWebsite;
  const handleSubmit = (e) => {
    setIsSubmitting(true)
    try {
      const clientData = {
        ...formData,
        adminDto: { createdBy: email },
      };
      axios.post(Urlconstant.url + "api/registerclient", clientData).then((response) => {
        setOpen(true);
        setSnackbarMessage(response.data);
        setFormData({ status: "Active", });
      });
    } catch (error) {
      setCatchErrors("Wait for some time");
    } finally {
    }
  };

  const handleCompanyName = (event) => {
    const companyName = event.target.value;
    if (companyName.trim() !== "" && companyName.length > 2) {
      axios
        .get(Urlconstant.url + `/api/companynamecheck?companyName=${companyName}`)
        .then((res) => {
          if (res.data === "Company Already Exists") {
            setCompanyNameCheck("");
            setCompanyNameCheckExist("Already Exists")
          }
          else {
            setCompanyNameCheck("");
            setCompanyNameCheckExist("");
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
            setEmailCheckError(response.data);
          } else if (response.data === "rejected_email") {
            setEmailCheck("");
            setEmailCheckError(response.data);
          } else {
            setEmailCheck("")
            setEmailCheckError(response.data)
          }
        } else {
          if (response.status === 500) {
            setEmailCheckError("");
          }
        }
      })
      .catch((error) => {
      });
  };

  const handleCompanyContactNumber = (event) => {
    const companyContactNumber = event.target.value;
    if (companyContactNumber.trim() !== "" && validateContactNumber(companyContactNumber)) {
      axios
        .get(
          Urlconstant.url +
          `/api/checkContactNumber?contactNumber=${companyContactNumber}`
        )
        .then((res) => {
          if (res.data === "Company ContactNumber Already Exists") {
            setCheckPhoneNumberExist("ContactNumber Already Exists");
            setPhoneNumberCheck("");
          } else {
            setPhoneNumberCheck("")
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
    valueDisabled = true;
    setFormData({ status: "Active", })
    setCheckCompanyWebsite("")
    setCheckPhoneNumberExist("")
    setPhoneNumberCheck("")
    setCompanyEmailCheck("")
    setCompanyNameCheck("")
    setEmailCheck("")
    setCompanyNameCheckExist("")
    setCheckCompanyWebsiteExist("")
    setCheckCompanyWebsite("")
    setEmailCheckError("")
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
                value={formData.companyType ? formData.companyType : ""}
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
                  value={formData.companyName ? formData.companyName : ""}
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
              {checkCompanyNameExist && (
                <Alert severity="error">{checkCompanyNameExist}</Alert>
              )}
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="E-mail"
                name="companyEmail"
                value={formData.companyEmail ? formData.companyEmail : ""}
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

              {emailCheckError === "accepted_email" && (
                <Alert severity="success">{emailCheckError}</Alert>
              )}
              {emailCheckError && emailCheckError !== "accepted_email" && <Alert severity="error">{emailCheckError}</Alert>}
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Contact Number"
                name="companyLandLineNumber"
                value={formData.companyLandLineNumber ? formData.companyLandLineNumber : ""}
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
                value={formData.companyFounder ? formData.companyFounder : ""}
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
                value={formData.companyWebsite ? formData.companyWebsite : ""}
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
                value={formData.companyLocation ? formData.companyLocation : ""}
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
                value={formData.sourceOfConnection ? formData.sourceOfConnection : ""}
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
                value={formData.companyAddress ? formData.companyAddress : ""}
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
                  disabled={valueDisabled || isSubmitting}
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
