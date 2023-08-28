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

const FollowUpStatus = ({ open, handleClose, rowData }) => {
    const [isConfirming, setIsConfirming] = React.useState(false);
    const [editedData, setEditedData] = React.useState({ ...rowData });
    const [loading, setLoading] = React.useState(false);
    const [responseMessage, setResponseMessage] = React.useState('');
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);


    React.useEffect(() => {
        setEditedData(rowData); // Use rowData directly
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

    const handleSaveClick = () => {
        if (isConfirming) {
            setLoading(true);
            const statusDto = { ...editedData };
            console.log(statusDto)
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
                    label="ID"
                    name="id"
                    defaultValue={rowData.basicInfo?.id || ''}
                    style={fieldStyle}
                    InputProps={{
                        readOnly: true,
                    }}
                />

                <TextField
                    label="Name"
                    name="name"
                    defaultValue={rowData.basicInfo?.traineeName || ''}
                    style={fieldStyle}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField
                    label="Email"
                    name="email"
                    value={rowData.basicInfo?.email || ''}
                    style={fieldStyle}
                    InputProps={{
                        readOnly: true,
                    }}
                />

                <TextField
                    label="Attempted By"
                    name="attemptedBy"
                    defaultValue={rowData.attemptedBy}
                    onChange={handleInputChange}
                    style={fieldStyle}
                />
                <TextField
                    label="Attempt Status"
                    name="attemptStatus"
                    defaultValue={rowData.attemptStatus}
                    onChange={handleInputChange}
                    style={fieldStyle}
                />
                <TextField
                    label="Comments"
                    name="comments"
                    defaultValue={rowData.comments}
                    onChange={handleInputChange}
                    style={fieldStyle}
                />
                <TextField
                    label="Call Duration"
                    name="callDuration"
                    defaultValue={rowData.callDuration}
                    onChange={handleInputChange}
                    style={fieldStyle}
                />
                <TextField
                    label="Call Back"
                    name="callBack"
                    defaultValue={rowData.callBack}
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
                    Added Follow Up Details
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

export default FollowUpStatus;