import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import { Urlconstant } from '../constant/Urlconstant';

const fieldStyle = { margin: '20px' };

const EditFollowUp = ({ open, handleClose, rowData }) => {
 
console.log(rowData)
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [editedData, setEditedData] = React.useState({ ...rowData });
  const [loading, setLoading] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState('');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);


  React.useEffect(()=>{
    setEditedData(rowData); // Use rowData directly
  }, [rowData]);

  if (!rowData) {
    return null; // Render nothing if rowData is not available yet
  }


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const keys = name.split('.'); // Split the name attribute
    let updatedData = { ...editedData };
  
    // Traverse the keys and update the data accordingly
    let currentData = updatedData;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i === keys.length - 1) {
        currentData[key] = value;
      } else {
        currentData[key] = currentData[key] || {}; // Ensure nested object exists
        currentData = currentData[key];
      }
    }
    setEditedData(updatedData);
  };

  const handleEditClick = () => {
    setIsConfirming(true);
    setSnackbarOpen(false);
  };


  const handleSaveClick = () => {
    if (isConfirming) {
      setLoading(true);
      const statusDto = editedData;
      console.log(editedData)
      console.log(rowData.basicInfo.email)
      axios
        .put(Urlconstant.url + `api/updateFollowUp?email=${rowData.basicInfo.email}`, statusDto, {
          headers: {
            'Content-Type': 'application/json',
            spreadsheetId: Urlconstant.spreadsheetId,
          },
        })
        .then((response) => {
          console.log('Update success:', response);
          setLoading(false);
          setResponseMessage('Data updated successfully!');
          setSnackbarOpen(true);
        })
        .catch((error) => {
          console.error('Error updating data:', error);
          setLoading(false);
          setResponseMessage('Error updating data. Please try again.');
          setSnackbarOpen(true);
        });
    }

  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    handleClose();
  };

  const handleConfirmBoxClose = () => {
    setIsConfirming(false);

  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Details</DialogTitle>
      <DialogContent>
        {/* Render your form fields here */}

       <TextField
          label="ID"
          name="basicInfo.id"
          defaultValue={rowData.basicInfo.id}
          style={fieldStyle}
          onChange={handleInputChange}
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
        />
        <TextField
          label="Email"
          name="basicInfo.email"
          value={rowData.basicInfo.email}
          onChange={handleInputChange}
          defaultValue={rowData.basicInfo.email}
          style={fieldStyle}
          InputProps={{
            readOnly: true,
          }}
        />
        
        <TextField
          label="Contact Number"
          name="basicInfo.contactNumber"
          defaultValue={rowData.basicInfo.contactNumber}
          onChange={handleInputChange}
          style={fieldStyle}
        />
         <TextField
          label="Registation Date"
          name="registrationDate"
          defaultValue={rowData.registrationDate}
          onChange={handleInputChange}
          style={fieldStyle}
        />
         <TextField
          label="Joining Date"
          name="joiningDate"
          defaultValue={rowData.joiningDate}
          onChange={handleInputChange}
          style={fieldStyle}
          InputLabelProps={{
            shrink: true,
        }}
        />
        <TextField
          label="Course Name"
          name="courseName"
          defaultValue={rowData.courseName}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="Currently FollowedBy"
          name="currentlyFollowedBy"
          defaultValue={rowData.currentlyFollowedBy}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="Current status"
          name="currentStatus"
          defaultValue={rowData.currentStatus}
          onChange={handleInputChange}
          style={fieldStyle}
        />
       
        </DialogContent>
      <DialogActions>
        
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        {loading ? (
        <CircularProgress size={20} /> // Show loading spinner
      ) : (
        <Button onClick={handleEditClick} color="primary">
          Edit
        </Button>
      )}
      </DialogActions>

      {/* Snackbar for response message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000000} // Adjust as needed
        onClose={handleSnackbarClose}
        message={responseMessage}
      />

      {/* Confirmation Dialog */}
      <Dialog open={isConfirming} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          Are you sure you want to update the data?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirming(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveClick} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default EditFollowUp;