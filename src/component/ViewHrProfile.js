import axios from "axios";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Urlconstant } from "../constant/Urlconstant";
import { Avatar, Button } from "@mui/material";
import {
	AddCircleOutline,
	EmailOutlined,
	ModeEditOutlined,
	PersonOutline,
	PhoneAndroid,
	WorkOutlineOutlined
} from "@mui/icons-material";
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
			bgcolor: stringToColor(name)
		},
		children: avatarText
	};
}
const ViewHrProfile = () => {
	const { id } = useParams();
	const [HrSpocName, setHrSpocName] = React.useState("");
	const [HrDetails, setHrDetails] = React.useState("");
	const [HrFollowUpStatus, setHrFollowUpStatus] = React.useState("");
	const [isEditHRDetailsModalOpen, setEditHRDetailsModalOpen] = React.useState(
		false
	);
	const [isHrFollowUpModalOpen, setHrFollowUpModalOpen] = React.useState("");
	const [companyId, setCompanyId] = React.useState("");
	const [dropdown, setDropDown] = React.useState({
		clientType: [],
		sourceOfConnection: [],
		sourceOfLocation: [],
		hrDesignation: [],
		callingStatus: []
	});

	const getDropdown = () => {
		axios.get(Urlconstant.url + `utils/clientdropdown`).then(response => {
			setDropDown(response.data);
		});
	};

	React.useEffect(() => {
		getDropdown();
	}, []);

	const fetchHrDetails = id => {
		axios
			.get(Urlconstant.url + `api/getdetailsbyhrid?hrId=${id}`)
			.then(response => {
				setHrSpocName(response.data.hrSpocName);
				setHrDetails(response.data);
				setCompanyId(response.data.companyId);
			})
			.catch(error => {
				if (error.response && error.response.status === 500) {
					setHrSpocName("");
					setHrDetails("");
				}
			});
	};
	const fetchHRFollowUp = id => {
		axios
			.get(Urlconstant.url + `api/gethrfollowupdetails?hrId=${id}`)
			.then(response => {
				setHrFollowUpStatus(response.data);
			})
			.catch(error => {
				if (error.response && error.response.status === 500) {
					setHrFollowUpStatus("");
				}
			});
	};
	useEffect(
		() => {
			fetchHrDetails(id);
		},
		[id, isEditHRDetailsModalOpen]
	);

	useEffect(
		() => {
			fetchHRFollowUp(id);
		},
		[id, isHrFollowUpModalOpen]
	);

	const handleEditHRDetails = () => {
		setEditHRDetailsModalOpen(true);
	};
	const handleHRDetailsClick = () => {
		setEditHRDetailsModalOpen(false);
	};
	const handleHRFollowUp = () => {
		setHrFollowUpModalOpen(true);
	};

	const handleHRFollowUpClick = () => {
		setHrFollowUpModalOpen(false);
	};

	return (
		<div>
			<h1>HR Details</h1>
			<div className="card">
				<Avatar {...stringAvatar(HrSpocName)} />
				<div className="name">
					<h1>
						{HrSpocName}
					</h1>
					<h3>
						<EmailOutlined sx={{ color: "#1277B2" }} /> {HrDetails.hrEmail}
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
							handleEditHRDetails(HrDetails);
						}}
						sx={{ marginRight: "10px" }}
					>
						Edit Details
					</Button>
					<Button
						variant="outlined"
						startIcon={<AddCircleOutline />}
						onClick={() => {
							handleHRFollowUp(HrDetails);
						}}
						sx={{ marginRight: "10px" }}
					>
						Follow Up
					</Button>
					<Button
						variant="outlined"
						color="primary"
						startIcon={<PersonOutline />}
						component={Link}
						to={Urlconstant.navigate + `companies/${companyId}`}
					>
						Back
					</Button>
				</div>
				<EditHRDetails
					open={isEditHRDetailsModalOpen}
					handleClose={() => setEditHRDetailsModalOpen(false)}
					rowData={HrDetails}
					handleSaveClick={handleHRDetailsClick}
					dropdown={dropdown}
				/>
				<HrFollowUp
					open={isHrFollowUpModalOpen}
					handleClose={() => setHrFollowUpModalOpen(false)}
					rowData={HrDetails}
					handleSaveClick={handleHRFollowUpClick}
					dropdown={dropdown}
				/>
			</div>
			{HrFollowUpStatus
				? <HRFollowUpStatusGrid rows={HrFollowUpStatus} />
				: null}
		</div>
	);
};

export default ViewHrProfile;
