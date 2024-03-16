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
import React, { useEffect } from "react";
import { fieldStyle, style } from "../constant/FormStyle";
import { Urlconstant } from "../constant/Urlconstant";
import { getCurrentDate } from "../constant/ValidationConstant";
import { useSelector } from "react-redux";

const CompanyFollowUp = ({ open, handleClose, rowData, dropdown }) => {
  const email = useSelector(state => state.loginDetiles.email)
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState("");
  const [hrNameList, setHrNameList] = React.useState([]);
  const [hrDetails, setHrDetails] = React.useState("");
  const getdetailsbyCompanyId = () => {
    if (rowData && rowData.id) {
      const companyId = rowData.id;
      axios
        .get(Urlconstant.url + `api/gethrdetails?companyId=${companyId}`)
        .then((response) => {
          setHrNameList(response.data);
        })
        .catch((e) => { });
    }
  };

  useEffect(() => {
    setIsConfirmed(false);
    if (open) {
      getdetailsbyCompanyId();
      setFormData({});
    }
  }, [rowData, open]);

  React.useEffect(() => {
    getdetailsbyCompanyId();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "hrSpocName") {
      hrNameList.forEach((hrItem) => {
        if (hrItem.hrSpocName === value) {
          setHrDetails(hrItem);
        }
      });
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
  };
  const handleSaveClick = () => {
    if (setIsConfirming) {
      setLoading(true);
      setIsConfirmed(true)
      try {
        const hrFollowUpData = {
          ...formData,
          hrId: hrDetails.id,
          attemptBy: email,
        };
        axios
          .post(Urlconstant.url + `api/hrfollowup`, hrFollowUpData)
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
        setResponseMessage("Not added to follow up");
        setLoading(false);
        setSnackbarOpen(true);
      }
    }
  };
  const isDisabled = !formData.attemptStatus || !hrDetails || !formData.hrSpocName
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        Follow Up
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
              label="HR Name"
              name="hrSpocName"
              onChange={handleInputChange}
              // style={fieldStyle}
              fullWidth
              select
              margin="normal"
            >
              {hrNameList.map((hrItem) => (
                <MenuItem key={hrItem.id} value={hrItem.hrSpocName}>
                  {hrItem.hrSpocName}{" "}
                  {/* Assuming that 'name' is the property containing HR names */}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Attempt By"
              name="attemptBy"
              onChange={handleInputChange}
              style={fieldStyle}
              value={formData.attemptBy}
              defaultValue={email}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Attempt Status"
              name="attemptStatus"
              onChange={handleInputChange}
              style={fieldStyle}
              value={formData.attemptStatus}
              fullWidth
              select
              margin="normal"
            >
              {dropdown.callingStatus.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              type="time"
              label="Call Duration"
              name="callDuration"
              placeholder="hh:mm:ss"
              onChange={handleInputChange}
              style={fieldStyle}
              value={formData.callDuration}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                marginRight: "20px",
                width: "200px",
                marginLeft: "40px",
                fontSize: "14px",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              type="date"
              label="Call Back Date"
              name="callBackDate"
              onChange={handleInputChange}
              style={fieldStyle}
              value={formData.callBackDate}
              id="callBackDate"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: getCurrentDate(),
              }}
              sx={{
                marginRight: "10px",
                width: "200px",
                marginLeft: "30px",
                fontSize: "14px",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              type="time"
              label="call Back Time"
              name="callBackTime"
              onChange={handleInputChange}
              style={fieldStyle}
              value={formData.callBackTime}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                marginRight: "10px",
                width: "200px",
                marginLeft: "30px",
                fontSize: "14px",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              labelId="demo-simple-select-label"
              label="comments"
              name="comments"
              onChange={handleInputChange}
              value={formData.comments}
              multiline
              rows={4}
              style={fieldStyle}
              id="comments"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          <Button
            disabled={isDisabled}
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

      <Dialog open={isConfirming} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>Adding Follow Up</DialogContent>
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
          <Button onClick={handleSaveClick} color="primary" disabled={isConfirmed} >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};
export default CompanyFollowUp;