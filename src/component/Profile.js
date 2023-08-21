import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  function stringAvatar(name) {
    let avatarText = '';
  
    if (name.includes(' ')) {
      // Two-word name
      const [firstName, lastName] = name.split(' ');
      avatarText = `${firstName[0]}${lastName[0]}`;
    } else {
      // One-word name
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
    const { email } = useParams(); // Get the email from the URL parameter
    const [profileData, setProfileData] = useState(null);
    const [followUpData, setFollowUpData] = useState(null);
    const [statusData, setStatusData] = useState(null);

    useEffect(() => {
        // Define the URL for your API endpoint using the email parameter
        const traineeApi = Urlconstant.url + `api/readByEmail?email=${email}`;
        const followUpApi = Urlconstant.url + `api/getFollowUpEmail/${email}`;
        const statusApi = Urlconstant.url + `api/getFollowUpStatusByEmail/${email}`;

        // Make the API requests for profile and follow-up data in parallel
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
                axios.spread((profileResponse, followUpResponse , statusResponse) => {
                    setProfileData(profileResponse.data);
                    setFollowUpData(followUpResponse.data);
                    setStatusData(statusResponse.data);
                })
            )
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [email]);

    if (!profileData || !followUpData || !statusData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="card">
            
                <div className="infos">
                <Avatar {...stringAvatar(profileData.basicInfo.traineeName)} />
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
                            <h3>{followUpData.courseName}</h3>
                            <h4>Course Name</h4>
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
                        <Button variant="outlined" startIcon={<AddIcon />}>
                            Add FollowUp
                        </Button>
                        <Button variant="outlined" startIcon={<ModeEditIcon />}>
                            Edit
                        </Button>
                    </div>
                </div>
            </div>
            
            {statusData ? <FollowStatusGrid rows={statusData} /> : null}
        </div>
        
    );
};

export default Profile;