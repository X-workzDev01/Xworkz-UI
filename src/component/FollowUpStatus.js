import React, { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import { Urlconstant } from "../constant/Urlconstant";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import ReactInputMask from "react-input-mask";
const fieldStyle = { margin: "20px" };

const FollowUpStatus = ({ open, handleClose, rowData }) => {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [editedData, setEditedData] = React.useState({ ...rowData });
  const [loading, setLoading] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [dropdownData, setDropdownData] = React.useState([]);
  const fieldsToCheck = ['attemptStatus', 'joiningDate', 'callDuration', 'callBack', 'callBackTime', 'comments'];
  const [isEditButtonDisabled, setIsEditButtonDisabled] = React.useState(false);

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    // Fetch your dropdown data from the API here
    axios
      .get(Urlconstant.url + "utils/dropdown", {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })
      .then((response) => {
        setDropdownData(response.data); // Assuming the response contains an array of dropdown options
      })
      .catch((error) => {
        console.error("Error fetching dropdown data:", error);
      });
  }, []);

  React.useEffect(() => {
    setEditedData(rowData);
  }, [rowData]);

  if (!rowData) {
    return null; // Render nothing if rowData is not available yet
  }

  const handleInputChange = (event) => {
    const { name, value, } = event.target;

    const updatedValue = value.trim() === " " ? "NA" : value;

    setEditedData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
    }));

    if (name === 'attemptStatus' && (updatedValue === 'Joined' || updatedValue === 'Joining')) {
      document.getElementById('joiningDate').removeAttribute('disabled');
    } else {
      document.getElementById('joiningDate').setAttribute('disabled', 'true');
    }
    const disablingOptions = ["RNR", "Wrong Number", "Busy", "Not Reachable"];
    const isDisablingOption = disablingOptions.includes(updatedValue);

    if (name === 'attemptStatus') {
      if (isDisablingOption) {

        document.getElementById('joiningDate').setAttribute('disabled', 'true');
        document.getElementById('callDuration').setAttribute('disabled', 'true');
        document.getElementById('callBack').setAttribute('disabled', 'true');
        document.getElementById('callBackTime').setAttribute('disabled', 'true');
      } else {
        // Enable the fields if the attempt status is not one of the disabling options
        document.getElementById('joiningDate').removeAttribute('disabled');
        document.getElementById('callDuration').removeAttribute('disabled');
        document.getElementById('callBack').removeAttribute('disabled');
        document.getElementById('callBackTime').removeAttribute('disabled');
      }
    }
  };



  const handleEditClick = () => {
    setIsConfirming(true);
    setSnackbarOpen(false);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    handleClose();
  };
  const handleCloseForm = () => {
    handleClose();
  };
  const attemtedUser = sessionStorage.getItem("userId");

  const handleSaveClick = () => {
    if (isConfirming) {
      setLoading(true);
      const statusDto = {
        ...editedData,
        attemptedBy: attemtedUser,
      };
      fieldsToCheck.forEach((field) => {
        if (!statusDto[field]) {
          statusDto[field] = "NA";
        }
      });
      if (
        (statusDto.attemptStatus === 'Joined' || statusDto.attemptStatus === 'Joining') &&
        (!statusDto.joiningDate || !statusDto.comments)
      ) {
        setLoading(false);
        setResponseMessage("Joining Date and Call Comments are mandatory for 'Joined' or 'Joining' status.");
        setSnackbarOpen(true);
      } else {
        axios
          .post(Urlconstant.url + `api/updateFollowStatus`, statusDto, {
            headers: {
              "Content-Type": "application/json",
              spreadsheetId: Urlconstant.spreadsheetId,
            },
          })
          .then((response) => {
            setLoading(false);
            setResponseMessage("Data updated successfully!");
            setSnackbarOpen(true);
            setIsConfirming(false);
            if (response.status === 200) {
              setTimeout(() => {
                handleCloseForm();
              }, 2000);
            }
          })
          .catch((error) => {
            setLoading(false);
            setResponseMessage("Error updating data. Please try again.");
            setSnackbarOpen(true);
          });
        axios
          .post(Urlconstant.url + `registerAttendance`, statusDto)
          .then(() => { })
          .catch((e) => { });
      }
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        Add to Follow Up
        <IconButton
          color="inherit"
          onClick={handleClose}
          edge="start"
          aria-label="close"
          style={{ position: "absolute", right: "8px", top: "8px" }}
        >
          <GridCloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Email"
          name="basicInfo.email"
          defaultValue={rowData.basicInfo.email}
          onChange={handleInputChange}
          style={fieldStyle}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Name"
          name="basicInfo.traineeName"
          defaultValue={rowData.basicInfo.traineeName}
          style={fieldStyle}
          onChange={handleInputChange}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Attempted By"
          name="attemptedBy"
          defaultValue={attemtedUser}
          //defaultValue={rowData.attemptedBy||'NA'}
          onChange={handleInputChange}
          style={fieldStyle}
          InputProps={{
            readOnly: true,
          }}
        />
         <FormControl>
          <InputLabel id="demo-simple-select-label">Attempt Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Attempt Status"
            name="attemptStatus"
            onChange={handleInputChange}
            value={rowData.attemptStatus || 'NA'}
            variant="outlined"
            sx={{
              marginRight: "20px",
              width: "200px",
              fontSize: "20px",
            }}
          >
            {dropdownData.status.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl> 
        {/* <InputLabel id="demo-simple-select-label">Attempt Status</InputLabel>


        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Attempt Status"
          name="attemptStatus"
          onChange={handleInputChange}
          value={rowData.attemptStatus || 'NA'} // Use editedData here
          variant="outlined"
          sx={{
            marginRight: "20px",
            width: "200px",
            fontSize: "20px",
          }}
        >
          {dropdownData.status.map((item, index) => (
            <MenuItem value={item} key={index}>
              {item}
            </MenuItem>
          ))}
        </Select> */}

        <TextField
          type="date"
          label="Joining Date"
          name="joiningDate"
          defaultValue={rowData.joiningDate || 'NA'}
          onChange={handleInputChange}
          style={fieldStyle}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: getCurrentDate(),
          }}
          id="joiningDate"
          disabled={rowData.attemptStatus !== 'Joined'}
        />

        <ReactInputMask
          mask="99:99:99" // Define the mask pattern for hh:mm:ss
          defaultValue={rowData.callDuration || 'NA'}
          onChange={handleInputChange}
        >
          {() => (
            <TextField
              label="Call Duration"
              name="callDuration"
              placeholder="hh:mm:ss" // Update the placeholder here
              variant="outlined"
              id="callDuration"
            />

          )}
        </ReactInputMask>

        <TextField
          type="date"
          label="Call Back Date"
          name="callBack"
          defaultValue={rowData.callBack || 'NA'}
          onChange={handleInputChange}
          style={fieldStyle}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: getCurrentDate(),
          }}
          id="callBack"
        />
        <TextField
          type="time"
          label="Call Back Time"
          name="callBackTime"
          defaultValue={rowData.callBackTime || 'NA'}
          onChange={handleInputChange}
          style={fieldStyle}
          InputLabelProps={{
            shrink: true,
          }}
          id="callBackTime"
        />

        <TextField
          label="Comments"
          name="comments"
          defaultValue={rowData.comments}
          onChange={handleInputChange}
          style={fieldStyle}
          className="custom-textfield" // Apply the custom CSS class
          multiline
          rows={4}
          id="comments"
        />
      </DialogContent>
      <DialogActions>
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          <Button onClick={handleEditClick} color="primary">
            Add
          </Button>
        )}
      </DialogActions>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000000}
        onClose={handleSnackbarClose}
        message={responseMessage}
      />

      <Dialog open={isConfirming} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>Added Follow Up Details</DialogContent>
        <DialogActions>
          <IconButton
            color="inherit"
            onClick={() => setIsConfirming(false)}
            edge="start"
            aria-label="close"
            style={{ position: "absolute", right: "8px", top: "8px" }}
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

export default FollowUpStatus;