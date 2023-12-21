import axios from 'axios';
import React from 'react'
import { useParams } from 'react-router-dom';
import { Urlconstant } from '../constant/Urlconstant';
import { Avatar, Button } from '@mui/material';
import { AddCircleOutline, EmailRounded, ModeEditOutline, PhoneAndroidOutlined } from '@mui/icons-material';
import AddHr from './AddHr';
import HRDetails from './HrDetails';
import EditCompanyDetails from './EditCompanyDetails';
import HrFollowUp from './HrFollowUp';

function stringToColor(string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name) {
  let avatarText = "";

  if (name.includes(" ")) {
    const [firstName, lastName] = name.split(" ");
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
const CompanyProfile = () => {
  const { id } = useParams();
  const [companyDetails, setCompanyDetails] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [isAddHrModalOpen, setAddHrModalOpen] = React.useState(false);
  const [isHrFollowupModalOpen, setHrFollowupModalOpen] = React.useState(false);
  const [isGetHRDetailsModalOpen, setGetHRDetailsModalOpen] = React.useState(false);
  const [isEditCompanyDetailsModalOpen, setEditCompanyDetailsModalOpen] = React.useState(false);


  const fetchData = (id) => {
    axios.get(Urlconstant.url + `api/getdetailsbyid?companyId=${id}`)
      .then(response => {
        setCompanyDetails(response.data);
        setCompanyName(response.data.companyName);
      })
  }
  React.useEffect(() => {
    fetchData(id, isAddHrModalOpen);
  }, [id, isAddHrModalOpen, isHrFollowupModalOpen, isGetHRDetailsModalOpen]);

  const handleAddClientHr = () => {
    setAddHrModalOpen(true);
  };

  const handleSaveClick = () => {
    setAddHrModalOpen(false);
  };

  const handlegetHRDetails = (id) => {
    // console.log("handlegetHRDetails",companyDetails)
    setGetHRDetailsModalOpen(true);
  };

  const handleHR = (id) => {
    setGetHRDetailsModalOpen(false);
  };


  const handleEditCompanyDetails = () => {
    setEditCompanyDetailsModalOpen(true);
  }

  const handleCompanyDetailsClick = () => {
    setEditCompanyDetailsModalOpen(false);
  }

  return (
    <div>CompanyProfile
      <div className="card">
        <div className="infos">
          <Avatar {...stringAvatar(companyName)} />
          <div className="name">
            <h1>{companyName}</h1>
            <h3>
              <EmailRounded sx={{ color: "#1277B2" }} />{" "}
              {companyDetails.companyEmail}
            </h3>
            <h3>
              <PhoneAndroidOutlined sx={{ color: "#1277B2" }} />{" "}
              {companyDetails.companyLandLineNumber}
            </h3>
          </div>
          <ul className="stats">
            <li>
              <h3> {companyDetails.companyType}</h3>
              <h4>Company Type</h4>
            </li>
            <li>
              <h3> {companyDetails.status}</h3>
              <h4>Status</h4>
            </li>
            <li>
              <h3> {companyDetails.companyWebsite}</h3>
              <h4>Company Website</h4>
            </li>
          </ul>
          <div className="links">
            <Button
              variant="outlined"
              startIcon={<AddCircleOutline />}
              onClick={() => {
                handleAddClientHr(companyDetails);
              }}
            >
              Add HR
            </Button>
            <Button
              variant="outlined"
              startIcon={<ModeEditOutline />}
              onClick={() => {
                handleEditCompanyDetails(companyDetails);
              }}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddCircleOutline />}
              onClick={() => {
                handlegetHRDetails(companyDetails);
              }}
            >
              Get HR Details
            </Button>
            {/* <Button
              variant="outlined"
              startIcon={<AddCircleOutline />}
              onClick={()=>{
                handleHRFollowUp()
              }}
            >
              Add Follow up
            </Button> */}
          </div>
        </div>
      </div>
      <AddHr
        open={isAddHrModalOpen}
        handleClose={() => setAddHrModalOpen(false)}
        rowData={companyDetails}
        handleSaveClick={handleSaveClick}
      />
      <HRDetails
        open={isGetHRDetailsModalOpen}
        handleClose={() => setGetHRDetailsModalOpen(false)}
        id={id}
        handleSaveClick={handleHR}
        hr={handlegetHRDetails}
      />
      <EditCompanyDetails
        open={isEditCompanyDetailsModalOpen}
        handleClose={() => setEditCompanyDetailsModalOpen(false)}
        rowData={companyDetails}
        handleSaveClick={handleCompanyDetailsClick}
      />
      <HrFollowUp

      />
    </div>
  )
}
export default CompanyProfile;

