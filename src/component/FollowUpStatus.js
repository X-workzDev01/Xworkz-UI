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
import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select } from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider, TimePicker } from '@mui/lab';

const fieldStyle = { margin: '20px' };

const FollowUpStatus = ({ open, handleClose, rowData }) => {
    const [isConfirming, setIsConfirming] = React.useState(false);
    const [editedData, setEditedData] = React.useState({ ...rowData });
    const [loading, setLoading] = React.useState(false);
    const [responseMessage, setResponseMessage] = React.useState('');
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [dropdownData, setDropdownData] = React.useState([]);
    const [isButtonDisabled, setButtonDisabled] = React.useState(false);

    const getCurrentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        // Fetch your dropdown data from the API here
        axios.get(Urlconstant.url + 'utils/dropdown', {
            headers: {
                'spreadsheetId': Urlconstant.spreadsheetId
            }
        }).then((response) => {
            setDropdownData(response.data); // Assuming the response contains an array of dropdown options
        })
            .catch((error) => {
                console.error('Error fetching dropdown data:', error);
            });
    }, []);

    React.useEffect(() => {
        setEditedData(rowData);
    }, [rowData]);

    if (!rowData) {
        return null; // Render nothing if rowData is not available yet
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditClick = () => {
        setIsConfirming(true);
        setSnackbarOpen(false);

    };
    const attemtedUser = sessionStorage.getItem("userId");

    const handleSaveClick = () => {
        if (isConfirming) {
            setLoading(true);
            setButtonDisabled(true);
            const statusDto = {
                ...editedData,
                attemptedBy: attemtedUser,
            };
            axios
                .post(Urlconstant.url + `api/updateFollowStatus`, statusDto, {
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
                    setIsConfirming(false);
                    handleClose();
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
            <DialogTitle>Add to Follow Up

                <IconButton
                    color="inherit"
                    onClick={handleClose}
                    edge="start"
                    aria-label="close"
                    style={{ position: 'absolute', right: '8px', top: '8px' }}
                >
                    <GridCloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>

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
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField
                    label="Attempted By"
                    name="attemptedBy"
                    value={attemtedUser}
                    defaultValue={rowData.attemptedBy}
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
                        defaultValue={rowData.attemptStatus}
                        variant="outlined"
                        sx={{
                            marginRight: '20px',
                            width: '200px', // Adjust padding for a smaller size
                            fontSize: '20px', // Adjust font size for a smaller size
                        }}
                    >
                        {dropdownData.status.map((item, index) => (
                            <MenuItem value={item} key={index}>{item}</MenuItem>
                        ))}

                    </Select>
                </FormControl>

                <TextField
                    label="Comments"
                    name="comments"
                    defaultValue={rowData.comments}
                    onChange={handleInputChange}
                    style={fieldStyle}
                    rows={4}
                />
                <TextField
                    label="Call Duration"
                    name="callDuration"
                    defaultValue={rowData.callDuration}
                    placeholder="hh:mm:ss"
                    onChange={handleInputChange}
                    style={fieldStyle}

                />

                <TextField type="date"
                    label="Call Back Date"
                    name="callBack"
                    defaultValue={rowData.callBack}
                    onChange={handleInputChange}
                    style={fieldStyle}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        min: getCurrentDate()
                    }}
                />
                 <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TextField type="time"
                    label="Call Back Time"
                    name="callBackTime"
                    defaultValue={rowData.callBackTime}
                    onChange={handleInputChange}
                    style={fieldStyle}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
               </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                {loading ? (
                    <CircularProgress size={20} /> // Show loading spinner
                ) : (
                    <Button onClick={handleEditClick} color="primary">
                        Add
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
                    Added Follow Up Details
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

export default FollowUpStatus;