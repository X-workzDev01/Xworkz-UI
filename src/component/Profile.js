import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Profile.css';
import axios from 'axios';
import { Urlconstant } from '../constant/Urlconstant';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import EmailIcon from '@mui/icons-material/Email';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import FollowStatusGrid from './FollowStatusGrid';
import Avatar from '@mui/material/Avatar';
import EditModal from './EditModal';
import FollowUpStatus from './FollowUpStatus';
import { Alert } from '@mui/material';
import { VisibilityOutlined } from '@mui/icons-material';

function stringToColor(string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

function stringAvatar(name) {
    let avatarText = '';

    if (name.includes(' ')) {
        const [firstName, lastName] = name.split(' ');
        avatarText = `${firstName[0]}${lastName[0]}`;
    } else {
        avatarText = name[0];
    }

    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: avatarText,
    };
}
const Profile = () => {
    const { email } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [followUpData, setFollowUpData] = useState(null);
    const [statusData, setStatusData] = useState(null);
    const [isModalOpen, setModalOpen] = React.useState(false);
    const [editedRowData, setEditedRowData] = React.useState(null);
    const [dataLoadingError, setDataLoadingError] = React.useState(null);

    const [isFollowUpModalOpen, setFollowUpModalOpen] = React.useState(false);
    const [editedFollowUpRowData, setEditedFollowUpRowData] = React.useState(null);

    const [isFollowUpStatusModalOpen, setFollowUpStatusModalOpen] = React.useState(false);
    const [editedFollowUpStatusRowData, setEditedFollowUpStatusRowData] = React.useState(null);
    const [showAttendence, setShowAttendence] = useState(false);

    useEffect(() => {
        const traineeApi = Urlconstant.url + `api/readByEmail?email=${email}`;
        const followUpApi = Urlconstant.url + `api/getFollowUpEmail/${email}`;
        const statusApi = Urlconstant.url + `api/getFollowUpStatusByEmail/${email}`;
        axios
            .all([
                axios.get(traineeApi, {
                    headers: {
                        'Content-Type': 'application/json',
                        spreadsheetId: Urlconstant.spreadsheetId,
                    },
                }),
                axios.get(followUpApi, {
                    headers: {
                        'Content-Type': 'application/json',
                        spreadsheetId: Urlconstant.spreadsheetId,
                    },
                }),
                axios.get(statusApi, {
                    headers: {
                        'Content-Type': 'application/json',
                        spreadsheetId: Urlconstant.spreadsheetId,
                    },
                }),
            ])
            .then(
                axios.spread((profileResponse, followUpResponse, statusResponse) => {
                    setProfileData(profileResponse.data);
                    setFollowUpData(followUpResponse.data);
                    setStatusData(statusResponse.data);
                })
            )
            .catch((error) => {
                setDataLoadingError("Check the data loading...");

            });
    }, [email, isFollowUpStatusModalOpen, isModalOpen]);

    if (!profileData || !followUpData || !statusData) {
        return <div>Loading...</div>;
    }


    const handleEditClick = (row) => {
        setEditedRowData(row);
        setModalOpen(true);
    };
    const handleSaveClick = () => {
        setModalOpen(false)
    };

    const handleFollowUp = (row) => {
        setEditedFollowUpStatusRowData(row);
        setFollowUpStatusModalOpen(true);
    }

    const handleFollowUpStatusSave = () => {
        setFollowUpStatusModalOpen(false)
    }


    const handleAttendence = (row) => {
        console.log(row)
        setShowAttendence(true);
    }

    return (
        <div>
            <div className="card">

                <div className="infos">
                    <Avatar {...stringAvatar(profileData.basicInfo.traineeName)} />
                    {dataLoadingError && <Alert severity="error">{dataLoadingError}</Alert>}
                    <div className="name">
                        <h1>{profileData.basicInfo.traineeName}</h1>
                        <h3>
                            <EmailIcon sx={{ color: '#1277B2' }} />{' '}
                            {profileData.basicInfo.email}
                        </h3>
                        <h3>
                            <PhoneAndroidIcon sx={{ color: '#1277B2' }} />{' '}
                            {profileData.basicInfo.contactNumber}
                        </h3>
                    </div>
                    <ul className="stats">
                        <li>
                            <h3>{profileData.educationInfo.qualification}</h3>
                            <h4>qualification</h4>
                        </li>
                        <li>
                            <h3>{profileData.educationInfo.yearOfPassout}</h3>
                            <h4>Passout</h4>
                        </li>

                        <li>
                            <h3>{profileData.referralInfo.preferredLocation}</h3>
                            <h4>Preferred Location</h4>
                        </li>
                        <li>
                            <h3>{profileData.referralInfo.preferredClassType}</h3>
                            <h4>Preferred Class TYpe</h4>
                        </li>
                    </ul>
                    <ul className="stats">

                        <li>
                            <h3>{followUpData.registrationDate}</h3>
                            <h4>Registration Date</h4>
                        </li>
                        <li>
                            <h3>{followUpData.joiningDate}</h3>
                            <h4>Joining Date</h4>
                        </li>
                        <li>
                            <h3>{followUpData.currentlyFollowedBy}</h3>
                            <h4>Currently Followed By</h4>
                        </li>
                        <li>
                            <h3>{followUpData.currentStatus}</h3>
                            <h4>Current Status</h4>
                        </li>

                    </ul>
                    <div className="links">
                        <Button variant="outlined" startIcon={<AddIcon />} onClick={() => {
                            handleFollowUp(profileData)
                        }}>
                            Add FollowUp
                        </Button>
                        <Button variant="outlined" startIcon={<ModeEditIcon />} onClick={() => handleEditClick(profileData)}>
                            Edit Profile
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<VisibilityOutlined />}
                            component={Link}
                            to={`/x-workz/attenance/${profileData.basicInfo.email}`}
                        >
                            View Attendance
                        </Button>


                    </div>
                </div>

            </div>

            <EditModal
                open={isModalOpen}
                handleClose={() => setModalOpen(false)}
                rowData={editedRowData}
                setRowData={setEditedRowData}
                handleSaveClick={handleSaveClick}
            />

            <FollowUpStatus
                open={isFollowUpStatusModalOpen}
                handleClose={() => setFollowUpStatusModalOpen(false)}
                rowData={editedFollowUpStatusRowData}
                setRowData={setEditedFollowUpStatusRowData}
                handleSaveClick={handleFollowUpStatusSave}
                FollowUp={handleFollowUp}
            />
            {statusData ? <FollowStatusGrid rows={statusData} /> : null}
        </div>

    );
};

export default Profile;