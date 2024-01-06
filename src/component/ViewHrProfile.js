import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Urlconstant } from "../constant/Urlconstant";
import { Avatar, Button } from "@mui/material";
import { AddCircleOutline, EmailOutlined, ModeEditOutline, ModeEditOutlined, PhoneAndroid, WorkOutlineOutlined } from "@mui/icons-material";
import HRFollowUpStatusGrid from "./HRFollowUpStatusGrid";
import EditHRDetails from "./EditHRDetails";
import HrFollowUp from "./HrFollowUp";

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
const ViewHrProfile = () => {
    const { id } = useParams();
    const [HrScopName, setHrScopName] = React.useState("");
    const [HrDetails, setHrDetails] = React.useState("");
    const [HrFollowUpStatus, setHrFollowUpStatus] = React.useState("")
    const [isEditHRDetailsModalOpen, setEditHRDetailsModalOpen] = React.useState(false);
    const [isHrFollowUpModalOpen,setHrFollowUpModalOpen] =React.useState("");


    const fetchHrDetails = (id) => {
        axios.get(Urlconstant.url + `api/getdetailsbyhrid?hrId=${id}`).then((response) => {
            setHrScopName(response.data.hrScopName);
            setHrDetails(response.data);
        })
    }
    const fetchHRFollowUp = (id) => {
        axios.get(Urlconstant.url + `api/gethrfollowupdetails?hrId=${id}`).then((response) => {
            setHrFollowUpStatus(response.data);
        })
    }
    useEffect(() => {
        fetchHrDetails(id);
    
    }, [isEditHRDetailsModalOpen]);

    useEffect(()=>{
        fetchHRFollowUp(id);
    },[isHrFollowUpModalOpen])

    const handleEditHRDetails = () => {
        setEditHRDetailsModalOpen(true);
    }

    const handleHRDetailsClick = () => {
        setEditHRDetailsModalOpen(false);
    }
    const handleHRFollowUp = () => {
        setHrFollowUpModalOpen(true);
    }

    const handleHRFollowUpClick = () => {
        setHrFollowUpModalOpen(false);
    }

    return (

        <div>
            <h1>HR Details</h1>
            <div className="card">
                <Avatar {...stringAvatar(HrScopName)} />
                <div className="name">
                    <h1>{HrScopName}</h1>
                    <h3>
                        <EmailOutlined sx={{ color: "#1277B2" }} />{" "}
                        {HrDetails.hrEmail}
                    </h3>
                    <h3>
                        <PhoneAndroid sx={{ color: "#1277B2" }} />{" "}
                        {HrDetails.hrContactNumber}
                    </h3>
                    <h3>
                        <WorkOutlineOutlined sx={{ color: "#1277B2" }} />{" "}
                        {HrDetails.designation}
                    </h3>
                    <Button
                        variant="outlined"
                        startIcon={<ModeEditOutlined />}
                        onClick={() => {
                            handleEditHRDetails(HrDetails)
                        }}
                    >
                        Edit Details
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<AddCircleOutline/>}
                        onClick={() => {
                            handleHRFollowUp(HrDetails)
                        }}
                    >
                    Follow Up
                    </Button>
                </div>
                <EditHRDetails
                    open={isEditHRDetailsModalOpen}
                    handleClose={() => setEditHRDetailsModalOpen(false)}
                    rowData={HrDetails}
                    handleSaveClick={handleHRDetailsClick}
                />
                <HrFollowUp
                 open={isHrFollowUpModalOpen}
                 handleClose={() => setHrFollowUpModalOpen(false)}
                 rowData={HrDetails}
                 handleSaveClick={handleHRFollowUpClick}
                />
            </div>
            {HrFollowUpStatus ? <HRFollowUpStatusGrid rows={HrFollowUpStatus} /> : null}
        </div>
    )
}

export default ViewHrProfile;