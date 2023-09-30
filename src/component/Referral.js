import {
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { Form } from "react-bootstrap";

export const Referral = ({
  formData,
  setFormData,
  onNext,
  onPrevious,
  loading,
}) => {
  const [working, setWorking] = useState("No");
  const [isdiesable, setIsDiesable] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "referalContactNumber") {
      if (!value) {
        setPhoneNumberError("Phone number is required");
      } else if (!/^\d+$/.test(value)) {
        setPhoneNumberError("Phone number must contain only digits");
      } else if (value.length !== 10) {
        setPhoneNumberError("Phone number must contain exactly 10 digits");
      } else {
        setPhoneNumberError("");
      }
    }
    setIsDiesable(true);
  };
  

  return (
    <Container maxWidth="sm">
      <h2>Referral Details </h2>
      <Typography component="div" style={{ height: "50vh" }}>
        <Form>
          <TextField
            type="text"
            label="Name"
            name="referalName"
            value={formData.referalName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          />

          <TextField
            type="number"
            label="Contact Number"
            name="referalContactNumber"
            value={formData.referalContactNumber}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          />
          {phoneNumberError ? (
            <Alert severity="error">{phoneNumberError}</Alert>
          ) : (
            " "
          )}

          <TextField
            type="text"
            label="comments"
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          />
          <FormLabel id="demo-row-radio-buttons-group-label">Working</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name={"working"}
            style={{ marginLeft: "13rem" }}
            value={formData.working || working}
            onChange={handleInputChange}
            label={"No"}
          >
            <FormControlLabel
              component="legend"
              value={"Yes"}
              control={<Radio />}
              label="Yes"
            />
            <FormControlLabel
              component="legend"
              value={"No"}
              control={<Radio />}
              label="No"
            />
          </RadioGroup>
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleInputChange}
                name="accept"
                value={formData.accept}
                disabled={isdiesable}
              >
                Accept
              </Checkbox>
            }
            label="Confirm register *"
          />

        </Form>
        <div style={{ marginTop: "20px" }}>
          {loading ? (
            <CircularProgress size={24} style={{ marginTop: "20px" }} />
          ) : (
            <>
              <Button variant="contained" onClick={onPrevious}>
                Previous
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button
                variant="contained"
                onClick={onNext}
                disabled={!isdiesable}
              >
                Register
              </Button>
            </>
          )}
        </div>
      </Typography>
    </Container>
  );
};
