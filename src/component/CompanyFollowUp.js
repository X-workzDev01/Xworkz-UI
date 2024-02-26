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


const CompanyFollowUp = ({ open, handleClose, rowData }) => {
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState("");
  const attemtedUser = sessionStorage.getItem("userId");
  const [hrNameList, setHrNameList] = React.useState([]);
  const [hrDetails, setHrDetails] = React.useState("");
  
  const [dropdown, setDropDown] = React.useState({
    clientType: [],
    sourceOfConnection: [],
    sourceOfLocation: [],
    hrDesignation: [],
    callingStatus: []
  });
 
  const getDropdown = () => {
    axios.get(Urlconstant.url + `utils/clientdropdown`).then((response) => {
      setDropDown(response.data);
    })
  }
 
  const getdetailsbyCompanyId = () => {
    const companyId = rowData.id;
    axios
      .get(Urlconstant.url + `api/gethrdetails?companyId=${companyId}`)
      .then((response) => {
        setHrNameList(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getdetailsbyCompanyId();
    getDropdown();
    setIsConfirmed(false);
  }, [rowData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "hrScopName") {
      hrNameList.forEach((hrItem) => {
        if (hrItem.hrScopName === value) {
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
          attemptBy: attemtedUser,
        };
        console.log(hrFollowUpData);
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
  const isDisabled = !formData.attemptStatus||!hrDetails;
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
              name="hrScopName"
              onChange={handleInputChange}
              style={fieldStyle}
              fullWidth
              select
              margin="normal"
            >
              {hrNameList.map((hrItem) => (
                <MenuItem key={hrItem.id} value={hrItem.hrScopName}>
                  {hrItem.hrScopName}{" "}
                  {/* Assuming that 'name' is the property containing HR names */}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
      
          <Grid item xs={12} sm={4}>
            <TextField
              label="attemptBy"
              name="attemptBy"
              onChange={handleInputChange}
              style={fieldStyle}
              value={formData.attemptBy}
              defaultValue={attemtedUser}
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
              label="Call Duration"
              name="callDuration"
              onChange={handleInputChange}
              style={fieldStyle}
              value={formData.callDuration}
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
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="call Back Time"
              name="callBackTime"
              onChange={handleInputChange}
              style={fieldStyle}
              value={formData.callBackTime}
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
          <Button onClick={handleSaveClick} color="primary"disabled={isConfirmed} >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};
export default CompanyFollowUp;