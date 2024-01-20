import {
  Alert,
  Button,
  Grid,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { Form } from "react-bootstrap";
import { Urlconstant } from "../constant/Urlconstant";
import {
  validateContactNumber,
  validateEmail,
} from "../constant/ValidationConstant";

export default function ClientDetails() {
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
  const email = sessionStorage.getItem("userId");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [companyNameCheck, setCompanyNameCheck] = React.useState("");
  const [companyEmailCheck, setCompanyEmailCheck] = React.useState("");
  const [emailCheck, setEmailCheck] = React.useState("");
  const [phoneNumberCheck, setPhoneNumberCheck] = React.useState("");
  const [formData, setFormData] = React.useState("");
  const [checkPhoneNumberExist, setCheckPhoneNumberExist] = React.useState("");
  const [checkCompanyWebsite, setCheckCompanyWebsite] = React.useState("");
  const [catchErrors, setCatchErrors] = React.useState("");

  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Validate email and phone number as the user types
    if (name === "companyEmail") {
      if (validateEmail(value)) {
        setEmailCheck("");
      } else {
        setCompanyEmailCheck("");
        setEmailCheck("Enter the correct Email");
      }
    }
    if (name === "companyLandLineNumber") {
      if (validateContactNumber(value)) {
        setPhoneNumberCheck("");
      } else {
        setCheckPhoneNumberExist("");
        setPhoneNumberCheck("Phone number is incorrect");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //        setIsSubmitting(false);
    try {
      const clientData = {
        ...formData,
        adminDto: { createdBy: email },
      };
      axios.post(Urlconstant.url + "api/registerclient", clientData);
      setOpen(true);
      setSnackbarMessage("Client information added successfully");
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
        status: "",
      });
    } catch (error) {
      setCatchErrors("Wait for some time");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompanyName = (event) => {
    const companyname = event.target.value;
    axios
      .get(Urlconstant.url + `/api/companynamecheck?companyName=${companyname}`)
      .then((res) => {
        if (res.data === "Company Already Exists") {
          setEmailCheck("");
          setCompanyNameCheck(res.data);
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

  const handleCompanyEmail = (event) => {
    const companyEmail = event.target.value;
    axios
      .get(
        Urlconstant.url + `/api/checkcompanyemail?companyEmail=${companyEmail}`
      )
      .then((res) => {
        if (res.data === "Company Email Already Exists") {
          setEmailCheck("");
          setCompanyEmailCheck(res.data);
        } else {
          setCompanyEmailCheck("");
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

  const handleCompanyContactNumber = (event) => {
    const companyContactNumber = event.target.value;
    axios
      .get(
        Urlconstant.url +
          `/api/checkContactNumber?contactNumber=${companyContactNumber}`
      )
      .then((res) => {
        if (res.data === "Company ContactNumber Already Exists") {
          setCheckPhoneNumberExist(res.data);
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

  const handleCompanyWebsite = (event) => {
    const companyWebsite = event.target.value;
    axios
      .get(
        Urlconstant.url +
          `/api/checkCompanyWebsite?companyWebsite=${companyWebsite}`
      )
      .then((res) => {
        if (res.data === "CompanyWebsite Already Exists") {
          setCheckCompanyWebsite(res.data);
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

  const isSubmitValid =
    !formData.companyName ||
    companyNameCheck ||
    companyEmailCheck ||
    emailCheck ||
    phoneNumberCheck ||
    checkPhoneNumberExist ||
    checkCompanyWebsite;
  return (
    <div>
      <h2>Register Client</h2>

      <Typography variant="h5" gutterBottom>
        Register Company
        {/* {setCatchErrors ? <Alert severity="error">{setCatchErrors}</Alert> : " "} */}
      </Typography>
      <Form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              onBlur={handleCompanyName}
              required
              fullWidth
              margin="normal"
            />
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
              value={formData.companyEmail}
              onChange={handleChange}
              fullWidth
              margin="normal"
              onBlur={handleCompanyEmail}
            />
            {companyEmailCheck ? (
              <Alert severity="error">{companyEmailCheck}</Alert>
            ) : (
              " "
            )}
            {emailCheck ? <Alert severity="error">{emailCheck}</Alert> : " "}
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Company Contact Number"
              name="companyLandLineNumber"
              value={formData.companyLandLineNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
              onBlur={handleCompanyContactNumber}
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
              value={formData.companyWebsite}
              onChange={handleChange}
              fullWidth
              margin="normal"
              onBlur={handleCompanyWebsite}
            />
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
              value={formData.companyLocation}
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
              value={formData.companyFounder}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Source Of Connetion"
              name="sourceOfConnetion"
              value={formData.sourceOfConnetion}
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
              value={formData.companyType}
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
              value={formData.status}
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
              value={formData.companyAddress}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitValid}
        >
          Register
        </Button>
      </Form>

      <Snackbar
        open={open}
        onClose={handleClose}
        message={snackbarMessage}
        autoHideDuration={3000}
      />
    </div>
  );
}
