// AttendanceModal.js

import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Urlconstant } from '../constant/Urlconstant';
import axios from 'axios';

const CircularProgressWithLabel = (props) => {
  const getColor = (percentage) => {
    if (percentage >= 80) {
      return 'green';
    } else if (percentage >= 50) {
      return 'orange';
    } else {
      return 'red';
    }
  };

  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        variant="determinate"
        {...props}
        sx={{ color: props.color || getColor(props.value) }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5" component="div" color="textSecondary">
          {props.label}
        </Typography>
      </Box>
    </Box>
  );
};

const AttendanceModal = ({ open, handleClose, id, batch }) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    if (open && !initialLoadComplete) {
      // Fetch data only when the modal is open
      axios.get(Urlconstant.url + `api/attendance/id/${id}?batch=${batch}`)
        .then((response) => {
          setAttendanceData(response.data);
          console.log(response.data);

          // Your logic to calculate progressValue and setInitialLoadComplete goes here

        })
        .catch((error) => {
          console.error("Error fetching attendance data:", error);
        });
    }
  }, [open, id, batch, initialLoadComplete]);

  // Dummy data, replace with your actual data
  const totalClasses = attendanceData ? attendanceData.totalClass : 0;
  const totalAbsent = attendanceData?.list?.length || 0;
  const totalPresent = totalClasses - totalAbsent;
  const newAttendancePercentage = totalClasses === 0 ? 0 : (totalPresent / totalClasses) * 100;

  useEffect(() => {
    if (open && !initialLoadComplete) {
    
  
      // Set an interval to gradually increase the progressValue
      const interval = setInterval(() => {
        setProgressValue((prevValue) => {
          const increment = (newAttendancePercentage / 100) * 2; // Adjust the increment based on the total percentage
          const newValue = prevValue + increment;
          return newValue <= newAttendancePercentage
            ? newValue
            : newAttendancePercentage;
        });
      }, 100); // Adjust the interval duration if needed
  
      // Set a timeout to clear the interval and finalize the progressValue
      setTimeout(() => {
        clearInterval(interval);
        setProgressValue(newAttendancePercentage);
        setInitialLoadComplete(true);
      }, 2000); // Set the timeout duration to a larger value than the interval duration
  
      // Cleanup function to clear the interval when the component unmounts or dependencies change
      return () => clearInterval(interval);
    }
  }, [open, initialLoadComplete]);
  
  // List of absent days with reasons
  const absentDays = attendanceData?.list || [];

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'white',
            boxShadow: 24,
            p: 4,
            borderRadius: 8,
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="div" gutterBottom>
            Attendance Information
          </Typography>
          <Grid container spacing={2} direction="row">
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', margin: '20px 0' }}>
                <CircularProgressWithLabel
                  value={newAttendancePercentage.toFixed()}
                  size={100}
                  thickness={4}
                  label={`${totalPresent}/${totalClasses}`}
                />
                <div> Total Classes </div>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center', margin: '20px 0' }}>
                <CircularProgressWithLabel
                  value={newAttendancePercentage.toFixed()}
                  size={100}
                  thickness={4}
                  label={`${newAttendancePercentage.toFixed()}%`}
                />
                <div> Attendance Percentage </div>
              </Box>
            </Grid>
          </Grid>

          {/* Display absent days with reasons */}
          <Typography variant="h6" component="div" gutterBottom>
            Absent Days
          </Typography>
          <List>
            {absentDays.map((absentDay, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={absentDay.date}
                    secondary={`Reason: ${absentDay.reason}`}
                  />
                </ListItem>
                {index < absentDays.length - 1 && <Divider />}
              </React.Fragment>
            ))}
            {absentDays.length === 0 && (
              <Typography variant="body2" color="textSecondary" align="center">
                No absent days
              </Typography>
            )}
          </List>
        </Box>
      </Modal>
    </div>
  );
};

export default AttendanceModal;
