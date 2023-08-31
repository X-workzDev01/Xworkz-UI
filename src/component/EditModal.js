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
import { Select , MenuItem , FormHelperText} from '@mui/material';

const fieldStyle = { margin: '20px' };

const EditModal = ({ open, handleClose, rowData }) => {


  const [isConfirming, setIsConfirming] = React.useState(false);
  const [editedData, setEditedData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState('');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [xworkzEmail, setXworkzEmail] = React.useState('');
  const [dropdown, setDropDown] = React.useState([]);


  React.useEffect(() => {
    setEditedData(rowData); // Use rowData directly
  }, [rowData]);

  useEffect(() => {

   
    // Fetch dropdown data from your API
    axios.get(Urlconstant.url+'utils/dropdown', {
      headers: {
        'spreadsheetId': Urlconstant.spreadsheetId
      }
    }).then(response => {
      setDropDown(response.data)
    }).catch(error => {
      console.log(error);
    })
  }, []); 

  if (!rowData) {
    return null; // Render nothing if rowData is not available yet
  }


  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const [section, field] = name.split('.');
    setEditedData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],

        [field]: value,
      },
      
    }));
  };

  const handleEditClick = () => {
    setIsConfirming(true);
    setSnackbarOpen(false);
  };

  const handleSaveClick = () => {
    editedData.xworkzEmail = xworkzEmail;
    if (isConfirming) {
      setLoading(true);
      const updatedData = { ...editedData, xworkzEmail };
      console.log(updatedData)
      axios
        .put(Urlconstant.url + `api/update?email=${rowData.basicInfo.email}`, updatedData, {
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
    setIsConfirming(false);
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
          label="Email"
          name="basicInfo.email"

          value={rowData.basicInfo.email}
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
        />
        <TextField
          label="Contact Number"
          name="basicInfo.contactNumber"
          defaultValue={rowData.basicInfo.contactNumber}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <Select
          name="educationInfo.qualification"
          defaultValue={rowData.educationInfo.qualification}
          onChange={handleInputChange}
          style={fieldStyle}
          sx={{
            marginRight: '20px',
            width: '300px', // Adjust padding for a smaller size
            // Adjust font size for a smaller size
        }}
          
        >
          {
            dropdown.qualification.map((item, index) => (
              <MenuItem value={item} key={index}>{item}</MenuItem>
            ))}
        </Select>
        <Select
          name="educationInfo.stream"
          defaultValue={rowData.educationInfo.stream}
          onChange={handleInputChange}
          style={fieldStyle}
        >
          {
            dropdown.stream.map((item, index) => (
              <MenuItem value={item} key={index}>{item}</MenuItem>
            ))}

        </Select>

        <Select
          name="educationInfo.yearOfPassout"
          defaultValue={rowData.educationInfo.yearOfPassout}
          onChange={handleInputChange}
          style={fieldStyle}
         
        >
           {
            dropdown.yearofpass.map((item, index) => (
              <MenuItem value={item} key={index}>{item}</MenuItem>
            ))}

        </Select>
        <Select
         
          name="educationInfo.collegeName"
          defaultValue={rowData.educationInfo.collegeName}
          onChange={handleInputChange}
          style={fieldStyle}
          sx={{
            marginRight: '20px',
            width: '500px', // Adjust padding for a smaller size
            // Adjust font size for a smaller size
        }}
          
        >
           {
            dropdown.college.map((item, index) => (
              <MenuItem value={item} key={index}>{item}</MenuItem>
            ))}

        </Select>
        <Select
      
          name="courseInfo.course"
          defaultValue={rowData.courseInfo.course}
          onChange={handleInputChange}
          style={fieldStyle}
        >
           {
            dropdown.course.map((item, index) => (
              <MenuItem value={item} key={index}>{item}</MenuItem>
            ))}


        </Select>
        <Select
         
          name="courseInfo.branch"
          defaultValue={rowData.courseInfo.branch}
          onChange={handleInputChange}
          style={fieldStyle}
        >
          {
            dropdown.branchname.map((item, index) => (
              <MenuItem value={item} key={index}>{item}</MenuItem>
            ))}

        </Select>
        <Select
         
          name="courseInfo.batch"
          defaultValue={rowData.courseInfo.batch}
          onChange={handleInputChange}
       
        >
           {
            dropdown.batch.map((item, index) => (
              <MenuItem value={item} key={index}>{item}</MenuItem>
            ))}

        </Select>
        <TextField
          label="Referal Name"
          name="referralInfo.referalName"
          defaultValue={rowData.referralInfo.referalName}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="Referal Contact Number"
          name="referralInfo.referalContactNumber"
          defaultValue={rowData.referralInfo.referalContactNumber}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="Comments"
          name="referralInfo.comments"
          defaultValue={rowData.referralInfo.comments}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="X-workz E-mail"
          name="xworkzEmail"
          value={xworkzEmail}
          onChange={(event) => setXworkzEmail(event.target.value)}
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

export default EditModal;
