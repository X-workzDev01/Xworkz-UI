import React from 'react';
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
import { Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { GridCloseIcon } from '@mui/x-data-grid';

import './Fields.css';
const fieldStyle = { margin: '20px' };

const EditModal = ({ open, handleClose, rowData }) => {
  const location = useLocation();
  const email = location.state && location.state.email;
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('Java');
  const [editedData, setEditedData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState('');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [dropdown, setDropDown] = React.useState([]);
  const [batchDetails, setBatchDetails] = React.useState("");
  const [formData, setFormData] = React.useState({
    branch: rowData.courseInfo.branch || '',
    trainerName: rowData.courseInfo.trainerName || '',
    batchType: rowData.courseInfo.batchType || '',
    course: rowData.courseInfo.course || '',
    batchTiming: rowData.courseInfo.batchTiming || '',
    startTime: rowData.courseInfo.startTime || '',
  });

  React.useEffect(() => {
    setEditedData(rowData);
  }, [rowData]);



  React.useEffect(() => {
    axios.get(Urlconstant.url + 'utils/dropdown', {
      headers: {
        'spreadsheetId': Urlconstant.spreadsheetId
      }
    }).then(response => {
      setDropDown(response.data)
    }).catch(error => { })
    axios
      .get(Urlconstant.url + "api/getCourseName?status=Active", {
        headers: {
          spreadsheetId: Urlconstant.spreadsheetId,
        },
      })

      .then((res) => {
        setBatchDetails(res.data);
        console.log(selectedValue);
        if (selectedValue) {
          fetchData(selectedValue); // Call fetchData with the selectedValue
        }
      })
      .catch((e) => { });
  }, []);
  React.useEffect(() => {
    setEditedData(rowData);
    if (rowData.courseInfo.course) {
      setSelectedValue(rowData.courseInfo.course);
      fetchData(rowData.courseInfo.course);
    }

  }, [rowData]);

  if (!rowData) {
    return null;
  }

  const fetchData = (selectedValue) => {
    console.log("course" + selectedValue);

    axios
      .get(
        Urlconstant.url + `api/getCourseDetails?courseName=${selectedValue}`,
        { headers: { spreadsheetId: Urlconstant.spreadsheetId } }
      )
      .then((response) => {
        const data = response.data;
        console.log(data);

        // Update the formData state with fetched data
        setFormData({
          branch: data.branch,
          trainerName: data.trainerName,
          batchType: data.batchType,
          course: data.courseName,
          batchTiming: data.timing,
          startTime: data.startTime,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };






  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const [section, field] = name.split('.');
    if (section === 'courseInfo' && field === 'course') {
      // If the course name field is changed, update selectedValue
      setSelectedValue(value);
      fetchData(value); // Call fetchData with the new selectedValue
    }

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
    if (isConfirming) {
      setLoading(true);
      const updatedData = {
        ...editedData,
        adminDto: {
          updatedBy: email, // Add the updatedBy field
        },
      };
      axios
        .put(Urlconstant.url + `api/update?email=${rowData.basicInfo.email}`, updatedData, {
          headers: {
            'Content-Type': 'application/json',
            spreadsheetId: Urlconstant.spreadsheetId,
          },
        })
        .then((response) => {
          setLoading(false);
          setResponseMessage('Data updated successfully!');
          setSnackbarOpen(true);
          setIsConfirming(false);
          handleClose();
        })
        .catch((error) => {
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
        <IconButton
          color="inherit"
          onClick={handleClose}
          edge="start"
          aria-label="close"
          style={{ position: 'absolute', right: '8px', top: '8px' }}
        >
          <GridCloseIcon />
        </IconButton>

        <TextField
          label="Email"
          name="basicInfo.email"
          value={rowData.basicInfo.email || ''}
          onChange={handleInputChange}
          style={fieldStyle}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Name"
          name="basicInfo.traineeName"
          defaultValue={rowData.basicInfo.traineeName || ''}
          style={fieldStyle}
          onChange={handleInputChange}
        />
        <TextField
          label="Contact Number"
          name="basicInfo.contactNumber"
          defaultValue={rowData.basicInfo.contactNumber || ''}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <FormControl>
          <InputLabel id="demo-simple-select-label">Qualification</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            inputLabel="Qualification"
            name="educationInfo.qualification"
            defaultValue={rowData.educationInfo.qualification || ''}
            onChange={handleInputChange}
            style={fieldStyle}
            sx={{
              marginRight: '20px',
              width: '300px',
            }}

          >
            {
              dropdown.qualification.map((item, index) => (
                <MenuItem value={item} key={index}>{item}</MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Stream</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            inputLabel="Stream"
            name="educationInfo.stream"
            defaultValue={rowData.educationInfo.stream || ''}
            onChange={handleInputChange}
            style={fieldStyle}
            sx={{
              marginRight: '20px',
              width: '300px',
            }}
          >
            {
              dropdown.stream.map((item, index) => (
                <MenuItem value={item} key={index}>{item}</MenuItem>
              ))}

          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Year Of Passout</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Year Of Passout"
            name="educationInfo.yearOfPassout"
            defaultValue={rowData.educationInfo.yearOfPassout || ''}
            onChange={handleInputChange}
            style={fieldStyle}
            sx={{
              marginRight: '20px',
              width: '300px', // Adjust padding for a smaller size
              // Adjust font size for a smaller size
            }}
          >
            {
              dropdown.yearofpass.map((item, index) => (
                <MenuItem value={item} key={index}>{item}</MenuItem>
              ))}

          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="demo-simple-select-label">College Name</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="College Name"
            name="educationInfo.collegeName"
            defaultValue={rowData.educationInfo.collegeName || ''}
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
        </FormControl>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Course</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Course"
            name="courseInfo.course"
            defaultValue={rowData.courseInfo.course || ''}
            onChange={handleInputChange}
            style={fieldStyle}
            sx={{
              marginRight: '20px',
              width: '300px', // Adjust padding for a smaller size
              // Adjust font size for a smaller size
            }}
          >
            {
              batchDetails.map((item, index) => (
                <MenuItem value={item} key={index}>{item}</MenuItem>
              ))}


          </Select>
        </FormControl>

        {/* 
        <TextField
          label="Branch"
          name="courseInfo.branch"
          defaultValue={rowData.courseInfo.branch || ''}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="Batch Type"
          name="courseInfo.batchType"
          defaultValue={rowData.courseInfo.batchType || ''}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="Trainer Name"
          name="courseInfo.trainerName"
          defaultValue={rowData.courseInfo.trainerName || ''}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="Batch Timing"
          name="courseInfo.batchTiming"
          defaultValue={rowData.courseInfo.batchTiming || ''}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="Start Time"
          name="courseInfo.startTime"
          defaultValue={rowData.courseInfo.startTime || ''}
          onChange={handleInputChange}
          style={fieldStyle}
        /> */}
        <TextField
          label="Branch"
          name="courseInfo.branch"
          value={formData.branch || ''}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="Batch Type"
          name="courseInfo.batchType"
          value={formData.batchType || ''}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="Trainer Name"
          name="courseInfo.trainerName"
          value={formData.trainerName || ''}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="Batch Timing"
          name="courseInfo.batchTiming"
          value={formData.batchTiming || ''}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="Start Time"
          name="courseInfo.startTime"
          value={formData.startTime || ''}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <FormControl>
          <InputLabel id="demo-simple-select-label">Offered As</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="offeredAs"
            defaultValue={rowData.courseInfo.offeredAs || ""}
            required
            margin="normal"
            variant="outlined"
            style={fieldStyle}
          >
            {dropdown.offered.map((item, index) => (
              <MenuItem value={item} key={index}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Referal Name"
          name="referralInfo.referalName"
          defaultValue={rowData.referralInfo.referalName || ''}
          onChange={handleInputChange}
          style={fieldStyle}
        />
        <TextField
          label="Referal Contact Number"
          name="referralInfo.referalContactNumber"
          defaultValue={rowData.referralInfo.referalContactNumber || ''}
          onChange={handleInputChange}
          style={fieldStyle}
        />

        <TextField

          label="Comments"
          name="referralInfo.comments"
          defaultValue={rowData.referralInfo.comments || ''}
          onChange={handleInputChange}
          style={fieldStyle}
        />

        <TextField
          label="X-workz E-mail"
          name="referralInfo.xworkzEmail"
          defaultValue={rowData.referralInfo.xworkzEmail || ''}
          onChange={handleInputChange}
          style={fieldStyle}
        />

        <FormControl>
          <InputLabel id="demo-simple-select-label">preferred Location</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Preferred Location"
            name="referralInfo.preferredLocation"
            onChange={handleInputChange}
            defaultValue={rowData.referralInfo.preferredLocation || ''}
            variant="outlined"
            sx={{
              marginRight: '20px',
              width: '200px', // Adjust padding for a smaller size
              fontSize: '20px', // Adjust font size for a smaller size
            }}
          >
            {dropdown.branchname.map((item, index) => (
              <MenuItem value={item} key={index}>{item}</MenuItem>
            ))}

          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="demo-simple-select-label">preferred Class Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Preferred Class Type"
            name="referralInfo.preferredClassType"
            onChange={handleInputChange}
            defaultValue={rowData.referralInfo.preferredClassType || ''}
            variant="outlined"
            sx={{
              marginRight: '20px',
              width: '200px', // Adjust padding for a smaller size
              fontSize: '20px', // Adjust font size for a smaller size
            }}
          >
            {dropdown.batch.map((item, index) => (
              <MenuItem value={item} key={index}>{item}</MenuItem>
            ))}

          </Select>
        </FormControl>


      </DialogContent>

      <DialogActions>

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

          <IconButton
            color="inherit"
            onClick={() => setIsConfirming(false)}
            edge="start"
            aria-label="close"
            style={{ position: 'absolute', right: '8px', top: '8px' }}
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

export default EditModal;
