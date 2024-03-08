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
import { fieldStyle, style } from "../constant/FormStyle";
import { getCurrentDate } from "../constant/ValidationConstant";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const HrFollowUp = ({ open, handleClose, rowData, dropdown }) => {
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState("");
  const attemtedUser = sessionStorage.getItem("userId");

  React.useEffect(() => {
    if (open) {
      setFormData({
        attemptBy: attemtedUser,
        attemptStatus: "",
        callDuration: "",
        callBackDate: "",
        callBackTime: "",
        comments: "",
      });
    }
  }, [open]);

  const handleInputChange = (event) => {
    if (event && event.target) {
      console.log(event.target.value)

    }
    const { name, value } = event.target;
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
          hrId: rowData.id,
          attemptBy: attemtedUser,
        };

        axios
          .post(Urlconstant.url + `api/hrfollowup`, hrFollowUpData)
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
            setFormData("");
          });
      } catch (response) {
        setResponseMessage("Not added to follow up");
        setLoading(false);
        setSnackbarOpen(true);
      }
    }
  };
 
  const isDisabled = !formData.attemptStatus
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
          <Button onClick={handleSaveClick} color="primary" disabled={isConfirmed}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};
export default HrFollowUp;
