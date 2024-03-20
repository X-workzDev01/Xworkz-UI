import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import { Urlconstant } from "../constant/Urlconstant";
import {
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	IconButton,
	Alert,
	Grid
} from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";

import "./Fields.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
	validateContactNumber,
	validateEmail
} from "../constant/ValidationConstant";
import { useSelector } from "react-redux";
const fieldStyle = { margin: "20px" };

const EditModal = ({
	open,
	handleClose,
	rowData,
	feeConcession,
	attemptStatus
}) => {
	const navigate = useNavigate();
	const email = useSelector(state => state.loginDetiles.email);
	const [feesConcession, setFeesConcession] = useState(feeConcession);
	const [isConfirming, setIsConfirming] = React.useState(false);
	const [selectedValue, setSelectedValue] = React.useState(" ");
	const [editedData, setEditedData] = React.useState([]);
	const [loading, setLoading] = React.useState(false);
	const [responseMessage, setResponseMessage] = React.useState("");
	const [snackbarOpen, setSnackbarOpen] = React.useState(false);
	const [dropdown, setDropDown] = React.useState([]);
	const [batchDetails, setBatchDetails] = React.useState("");
	const [emailCheck, setEmailCheck] = React.useState("");
	const [numberCheck, setNumberCheck] = React.useState(null);
	const [emailError, setEmailError] = React.useState(null);
	const [phoneNumberError, setPhoneNumberError] = React.useState("");
	const [verifyHandleEmail, setverifyHandleEmail] = React.useState("");
	const [verifyHandleEmailerror, setverifyHandleEmailError] = React.useState(
		""
	);
	const [xworkzEmailErrorVerify, setXworkzEmailErrorVerify] = useState("");
	const [disble, setDisable] = useState(false);
	const [emailValue, setEmailValue] = React.useState("");
	const [formData, setFormData] = React.useState({
		branch: "",
		trainerName: "",
		batchType: "",
		course: "",
		batchTiming: "",
		startTime: ""
	});

	const [usnCheck, setUsnCheck] = React.useState("");
	const [traineeNameCheck, setTraineeNameCheck] = React.useState("");
	const [alternativeNumberCheck, setAlternativeNumberCheck] = React.useState(
		""
	);
	const [referalContactNumber, setReferalContactNumber] = React.useState("");
	const [referalNameCheck, setReferalNameCheck] = React.useState("");
	const [comments, setComments] = React.useState("");
	const [xworkzemailCheck, setXworkzEmailCheck] = React.useState("");
	const [xworkzEmailCheckExists, setXworkzEmailCheckExists] = useState("");
	const [isConfirmed, setIsConfirmed] = React.useState(false);
	const [sslcError, setSslcError] = useState("");
	const [pucError, setPucError] = useState("");
	const [degreeError, setDegreeError] = useState("");

	const [sslcToPerc, setSslcToPerc] = useState("");
	const [pucToPerc, setPucToPerc] = useState("");
	const [degreeToPerc, setDegreeToPerc] = useState("");

	React.useEffect(
		() => {
			setXworkzEmailErrorVerify("");
			setXworkzEmailCheckExists("");
			setEditedData(rowData);
			setUsnCheck("");
			setEmailError("");
			setverifyHandleEmail("");
			setEmailCheck("");
			setPhoneNumberError("");
			setTraineeNameCheck("");
			setNumberCheck("");
			setPhoneNumberError("");
			setAlternativeNumberCheck("");
			setReferalContactNumber("");
			setReferalNameCheck("");
			setComments("");
			setXworkzEmailCheck("");
			setverifyHandleEmailError("");
			setSslcError("");
			setPucError("");
			setDegreeError("");
		},
		[rowData]
	);

	useEffect(
		() => {
			if (open) {
				rowData.percentageDto.sslcPercentage
					? setSslcToPerc(
							(rowData.percentageDto.sslcPercentage / 10 + 0.7).toFixed(2) +
								" CGPA"
						)
					: setSslcToPerc(null);
				rowData.percentageDto.pucPercentage
					? setPucToPerc(
							(rowData.percentageDto.pucPercentage / 10 + 0.7).toFixed(2) +
								" CGPA"
						)
					: setPucToPerc(null);
				rowData.percentageDto.degreePercentage
					? setDegreeToPerc(
							(rowData.percentageDto.degreePercentage / 10 + 0.7).toFixed(2) +
								" CGPA"
						)
					: setDegreeToPerc(null);
			}
		},
		[open]
	);
	useEffect(
		() => {
			const percDisabled = sslcError || pucError || degreeError;
			setDisable(percDisabled);
		},
		[sslcError, pucError, degreeError]
	);

	React.useEffect(() => {
		axios
			.get(Urlconstant.url + "utils/dropdown", {
				headers: {
					spreadsheetId: Urlconstant.spreadsheetId
				}
			})
			.then(response => {
				setDropDown(response.data);
			})
			.catch(error => {});
		axios
			.get(Urlconstant.url + "api/getCourseName?status=Active", {
				headers: {
					spreadsheetId: Urlconstant.spreadsheetId
				}
			})
			.then(res => {
				setBatchDetails(res.data);
				if (selectedValue) {
					fetchData(selectedValue); // Call fetchData with the selectedValue
				}
			})
			.catch(e => {});
	}, []);
	React.useEffect(
		() => {
			if (rowData && rowData.courseInfo) {
				setEditedData(rowData);
				if (rowData.courseInfo.course) {
					setSelectedValue(rowData.courseInfo.course);
					fetchData(rowData.courseInfo.course);
				}
			}
		},
		[rowData]
	);
	if (!rowData) {
		return null;
	}

	const fetchData = selectedValue => {
		axios
			.get(
				Urlconstant.url + `api/getCourseDetails?courseName=${selectedValue}`,
				{ headers: { spreadsheetId: Urlconstant.spreadsheetId } }
			)
			.then(response => {
				const data = response.data;
				setFormData({
					branch: data.branchName,
					trainerName: data.trainerName,
					batchType: data.batchType,
					course: data.courseName,
					batchTiming: data.startTime,
					startDate: data.startDate
				});
			})
			.catch(error => {});
	};

	const handleInputChange = event => {
		const { name, value } = event.target;

		if (name === "feeConcession") {
			setFeesConcession(value);
		}

		const [section, field] = name.split(".");

		if (section === "courseInfo" && field === "course") {
			setSelectedValue(value);
			fetchData(value);
		}
		if (name === "othersDto.referalName") {
			if (value === "") {
				setReferalNameCheck("");
			} else if (value.length <= 2) {
				setReferalNameCheck("Referal name should not be Empty");
			} else {
				setReferalNameCheck("");
			}
		}
		if (name === "email") {
			setEmailValue(value);
			if (!value) {
				setEmailError("Email is required");
				setEmailCheck("");
				setverifyHandleEmailError("");
			} else if (!validateEmail(value)) {
				setEmailError("Invalid email address");
				setEmailCheck("");
				setverifyHandleEmailError("");
			} else {
				setEmailError("");
			}
		}
		if (name === "othersDto.xworkzEmail") {
			if (!validateEmail(value)) {
				setXworkzEmailErrorVerify("");
				setXworkzEmailCheckExists("");
				setXworkzEmailCheck("Enter the correct E-mail ID");
				setDisable(true);
			} else {
				xworkzEmailExists(value);
				setXworkzEmailErrorVerify("");
				setXworkzEmailCheckExists("");
				setXworkzEmailCheck("");
			}
		}
		if (name === "othersDto.referalContactNumber") {
			if (value.trim() === "") {
				setReferalContactNumber("");
			}
			if (value.trim() !== "" && !validateContactNumber(value)) {
				setReferalContactNumber("Enter the valid Contact Number");
			} else {
				setReferalContactNumber("");
			}
		}
		if (name === "csrDto.alternateContactNumber") {
			if (value === "") {
				setAlternativeNumberCheck("");
			} else if (value !== "" && !validateContactNumber(value)) {
				setAlternativeNumberCheck("Enter the valid Number");
			} else {
				setAlternativeNumberCheck("");
			}
		}
		if (name === "basicInfo.contactNumber") {
			setNumberCheck("");
			if (!validateContactNumber(value)) {
				setPhoneNumberError("Enter the Correct Number");
			} else {
				setPhoneNumberError("");
			}
		}
		if (name === "basicInfo.traineeName") {
			if (!value) {
				setTraineeNameCheck("Trainee Name is Required");
			} else if (value.length <= 2) {
				setTraineeNameCheck("Trainee name should not be Empty");
			} else {
				setTraineeNameCheck("");
			}
		}
		if (name === "csrDto.usnNumber") {
			if (value === "") {
				setUsnCheck("");
			} else if (value !== "" && value.length === 10) {
				setUsnCheck("");
			} else {
				setUsnCheck("Enter the valid USN number");
			}
		}
		if (name === "percentageDto.sslcPercentage") {
			if (!value) {
				setSslcError("SSLC (10th) Percentage is required");
				setSslcToPerc("");
			} else if (value < 1 || value > 99.99) {
				setSslcError("Enter proper percentage");
			} else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(value)) {
				setSslcError("Only two decimals are allowed");
			} else {
				setSslcToPerc("");
				setSslcError("");
			}
			if (/^\d{1}\.\d{1,2}$/.test(value) || value.length == 1) {
				setSslcToPerc(((value - 0.7) * 10).toFixed(2) + "%");
			}
			if (/^\d{2}\.\d{1,2}$/.test(value) || /^\d{2}$/.test(value)) {
				setSslcToPerc((value / 10 + 0.7).toFixed(2) + " CGPA");
			}
		}

		if (name === "percentageDto.pucPercentage") {
			if (!value) {
				setPucError("PUC Percentage is required");
				setPucToPerc("");
			} else if (value < 1 || value > 99.99) {
				setPucError("Enter proper percentage");
			} else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(value)) {
				setPucError("Only two decimals are allowed");
			} else {
				setPucToPerc("");
				setPucError("");
			}
			if (/^\d{1}\.\d{1,2}$/.test(value) || value.length == 1) {
				setPucToPerc(((value - 0.7) * 10).toFixed(2) + "%");
			}
			if (/^\d{2}\.\d{1,2}$/.test(value) || /^\d{2}$/.test(value)) {
				setPucToPerc((value / 10 + 0.7).toFixed(2) + " CGPA");
			}
		}

		if (name === "percentageDto.degreePercentage") {
			if (!value) {
				setDegreeError("Degree Percentage  is required");
				setDegreeToPerc("");
			} else if (value < 1 || value > 99.99) {
				setDegreeError("Enter proper percentage");
			} else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(value)) {
				setDegreeError("Only two decimals are allowed");
			} else {
				setDegreeToPerc("");
				setDegreeError("");
			}
			if (/^\d{1}\.\d{1,2}$/.test(value) || value.length == 1) {
				setDegreeToPerc(((value - 0.7) * 10).toFixed(2) + "%");
			}
			if (/^\d{2}\.\d{1,2}$/.test(value) || /^\d{2}$/.test(value)) {
				setDegreeToPerc((value / 10 + 0.7).toFixed(2) + " CGPA");
			}
		}

		if (name === "othersDto.comments") {
			if (value === "") {
				setComments("");
			} else if (value.length <= 2) {
				setComments("Comments should not be empty");
			} else {
				setComments("");
			}
		}
		setEditedData(prevData => ({
			...prevData,
			[section]: {
				...prevData[section],
				[field]: value
			}
		}));
	};

	const handleEmail = email => {
		if (rowData.basicInfo.email === email) {
			setEmailCheck(null);
			return;
		}
		if (validateEmail(email)) {
			axios
				.get(Urlconstant.url + `api/emailCheck?email=${email}`, {
					headers: {
						spreadsheetId: Urlconstant.spreadsheetId
					}
				})
				.then(response => {
					if (response.data === "Email does not exist") {
						if (validateEmail(email)) {
							verifyEmail(email);
						}
					} else {
						setEmailCheck(response.data);
					}
				})
				.catch({});
		}
	};

	const xworkzEmailExists = email => {
		if (rowData.othersDto.xworkzEmail !== email) {
			const response = axios.get(
				Urlconstant.url + `api/checkxworkzemail?email=${email}`
			);
			response.then(res => {
				if (res.data === "Email Exist") {
					setXworkzEmailCheckExists(res.data);
				} else {
					setXworkzEmailCheckExists("");
				}
			});
		}
	};

	const verifyEmail = email => {
		emailVerification(email)
			.then(response => {
				setEmailCheck("");
				if (response.data === "accepted_email") {
					setverifyHandleEmailError(response.data);
				} else if (response.data === "rejected_email") {
					setverifyHandleEmailError(response.data);
				} else if (response.status === 500) {
					setverifyHandleEmailError("");
				} else {
					setverifyHandleEmailError(response.data);
				}
			})
			.catch(e => {});
	};
	const handleVerifyEmail = event => {
		const email = event.target.value;
		if (email.trim() !== "") {
			handleEmail(event.target.value);
		}
	};

	const handleNumberChange = e => {
		const contactNumber = e.target.value;
		if (contactNumber == rowData.basicInfo.contactNumber) {
			setNumberCheck("");
			setPhoneNumberError("");
			return;
		} else {
			if (contactNumber.trim() != "") {
				axios
					.get(
						Urlconstant.url +
							`api/contactNumberCheck?contactNumber=${contactNumber}`,
						{
							headers: {
								spreadsheetId: Urlconstant.spreadsheetId
							}
						}
					)
					.then(response => {
						if (response.status === 201) {
							setNumberCheck(response.data);
							setPhoneNumberError("");
						} else {
							setNumberCheck("");
						}
					})
					.catch(error => {});
			}
		}
	};
	const handleEditClick = () => {
		setIsConfirming(true);
		setSnackbarOpen(false);
	};

	const handleSaveClick = () => {
		if (!isConfirming || loading) {
			setIsConfirming(false);
		}
		setIsConfirmed(true);
		let newEmail;
		const updatedData = {
			...editedData,
			adminDto: {
				...editedData.adminDto,
				updatedBy: email
			},
			basicInfo: {
				...editedData.basicInfo,
				email: emailValue
			},
			courseInfo: {
				...editedData.courseInfo,
				...formData
			},
			othersDto: {
				...editedData.othersDto,
				xworkzEmail:
					editedData.othersDto.xworkzEmail === ""
						? rowData.othersDto.xworkzEmail
						: editedData.othersDto.xworkzEmail,
				referalContactNumber:
					editedData.othersDto.referalContactNumber === ""
						? rowData.othersDto.referalContactNumber
						: editedData.othersDto.referalContactNumber,
				referalName:
					editedData.othersDto.referalName === ""
						? rowData.othersDto.referalName
						: editedData.othersDto.referalName,
				comments:
					editedData.othersDto.comments === ""
						? rowData.othersDto.comments
						: editedData.othersDto.comments
			},
			csrDto: {
				...editedData.csrDto,
				usnNumber:
					editedData.csrDto.usnNumber === ""
						? rowData.csrDto.usnNumber
						: editedData.csrDto.usnNumber,
				alternateContactNumber:
					editedData.csrDto.alternateContactNumber === ""
						? rowData.csrDto.alternateContactNumber
						: editedData.csrDto.alternateContactNumber
			}
		};
		if (emailValue !== "") {
			newEmail = emailValue;
		} else {
			newEmail = editedData.basicInfo.email;
		}
		setLoading(true);
		axios.put(
			Urlconstant.url +
				`api/updateFeesDetailsChangeEmailAndFeeConcession/${feesConcession}/${updatedData
					.basicInfo.traineeName}/${rowData.basicInfo
					.email}/${newEmail}/${updatedData.adminDto.updatedBy}`
		);
		axios
			.put(
				Urlconstant.url + `api/update?email=${rowData.basicInfo.email}`,
				updatedData,
				{
					headers: {
						"Content-Type": "application/json",
						spreadsheetId: Urlconstant.spreadsheetId
					}
				}
			)
			.then(response => {
				setLoading(false);
				setResponseMessage("Data updated successfully!");
				setSnackbarOpen(true);
				setIsConfirming(false);
				setIsConfirmed(false);
				if (response.status === 200) {
					setTimeout(() => {
						handleCloseForm();
					}, 1000);
				}
				if (emailValue === "" && emailValue != null) {
					navigate(Urlconstant.navigate + `profile/${rowData.basicInfo.email}`);

					return;
				}
				navigate(Urlconstant.navigate + `profile/${emailValue}`);
			})
			.catch(error => {
				setLoading(false);
				setIsConfirming(false);

				setResponseMessage("Error updating data. Please try again.");
				setSnackbarOpen(true);
			});
	};

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	const handleConfirmBoxClose = () => {
		setIsConfirming(false);
	};

	const handleCloseForm = () => {
		setResponseMessage("");
		setSnackbarOpen(false);
		handleClose();
	};
	const handlefunctionClose = () => {
		setEmailCheck("");
		handleClose();
	};

	const handleEmailCheck = email => {
		emailVerification(email)
			.then(response => {
				if (response.data === "accepted_email") {
					setXworkzEmailErrorVerify(response.data);
				}
				if (response.data === "rejected_email") {
					setXworkzEmailErrorVerify(response.data);
				} else {
					setXworkzEmailErrorVerify(response.data);
				}
				if (response.status === 500) {
					setXworkzEmailErrorVerify("");
				}
			})
			.catch(error => {
				console.log("check emailable credentils");
			});
		//}
	};

	const handleVerifyXworkzEmail = event => {
		let xworkzemail = event.target.value;
		if (xworkzemail.trim() !== "") {
			if (xworkzemail.includes(".xworkz")) {
				if (!validateEmail(xworkzemail)) {
					setXworkzEmailErrorVerify("");
					setXworkzEmailCheck("Enter the Valid Email");
				} else {
					setXworkzEmailCheck("");
					setDisable(false);
					if (
						xworkzEmailCheckExists === "" &&
						rowData.othersDto.xworkzEmail !== xworkzemail
					) {
						handleEmailCheck(xworkzemail);
					}
				}
			} else if (xworkzemail === "rowData.othersDto.xworkzEmail") {
				setXworkzEmailCheck("");
				setXworkzEmailErrorVerify("");
				setDisable(false);
			} else {
				setXworkzEmailErrorVerify("");
				setXworkzEmailCheck("Email should contains xworkz");
			}
		}
	};

	const handleUsnNumber = event => {
		const usn = event.target.value;
		if (usn === rowData.csrDto.usnNumber) {
			setUsnCheck("");
			return;
		} else {
			if (usn.trim() !== "" && usn.length === 10) {
				axios
					.get(Urlconstant.url + `api/csr/checkUsn?usnNumber=${usn}`, {
						headers: {
							spreadsheetId: Urlconstant.spreadsheetId
						}
					})
					.then(response => {
						if (response.data === "Usn Number Already Exists") {
							setUsnCheck(response.data);
						} else {
							setUsnCheck("");
						}
					})
					.catch(error => {});
			}
		}
	};
	const emailVerification = email => {
		return axios.get(Urlconstant.url + `api/verify-email?email=${email}`);
	};

	const isValidate =
		usnCheck ||
		traineeNameCheck ||
		referalNameCheck ||
		referalContactNumber ||
		emailCheck ||
		(xworkzEmailErrorVerify !== "accepted_email" && xworkzEmailErrorVerify) ||
		(verifyHandleEmailerror !== "accepted_email" && verifyHandleEmailerror) ||
		xworkzemailCheck ||
		xworkzEmailCheckExists ||
		phoneNumberError ||
		numberCheck ||
		emailError ||
		comments;
	return (
		<Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
			<DialogTitle>Edit Details</DialogTitle>
			<DialogContent>
				<IconButton
					color="inherit"
					onClick={handlefunctionClose}
					edge="start"
					aria-label="close"
					style={{ position: "absolute", right: "8px", top: "8px" }}
				>
					<GridCloseIcon />
				</IconButton>
				<Grid container spacing={2}>
					<Grid item xs={4}>
						<TextField
							label="Email"
							name="email"
							defaultValue={rowData.basicInfo.email}
							onChange={handleInputChange}
							onBlur={handleVerifyEmail}
							style={fieldStyle}
						/>

						{verifyHandleEmailerror === "accepted_email"
							? <Alert severity="success">
									{verifyHandleEmailerror}
								</Alert>
							: " "}
						{verifyHandleEmailerror
							? <Alert severity="error">
									{verifyHandleEmailerror}
								</Alert>
							: " "}
						{verifyHandleEmailerror &&
							verifyHandleEmailerror !== "accepted_email" &&
							<Alert severity="error">
								{verifyHandleEmailerror}
							</Alert>}
						{emailError
							? <Alert severity="error">
									{emailError}{" "}
								</Alert>
							: " "}
						{emailCheck
							? <Alert severity="error">
									{emailCheck}
								</Alert>
							: " "}

						{verifyHandleEmail
							? <Alert severity="success">
									{verifyHandleEmail}
								</Alert>
							: " "}
					</Grid>
					<Grid item xs={4}>
						<TextField
							label="Name"
							name="basicInfo.traineeName"
							defaultValue={rowData.basicInfo.traineeName}
							style={fieldStyle}
							onChange={handleInputChange}
						/>
						{traineeNameCheck
							? <Alert severity="error">
									{traineeNameCheck}{" "}
								</Alert>
							: " "}
					</Grid>
					<Grid item xs={4}>
						<TextField
							label="Contact Number"
							name="basicInfo.contactNumber"
							defaultValue={rowData.basicInfo.contactNumber}
							onChange={handleInputChange}
							style={fieldStyle}
							onBlur={handleNumberChange}
						/>
						{phoneNumberError
							? <Alert severity="error">
									{phoneNumberError}
								</Alert>
							: " "}
						{numberCheck
							? <Alert severity="error">
									{numberCheck}
								</Alert>
							: " "}
					</Grid>
					<Grid item xs={4}>
						<TextField
							label="Date Of Birth"
							name="basicInfo.dateOfBirth"
							defaultValue={rowData.basicInfo.dateOfBirth}
							style={fieldStyle}
							onChange={handleInputChange}
							type="date"
							InputLabelProps={{
								shrink: true
							}}
							sx={{
								marginRight: "20px",
								width: "225px"
							}}
						/>
					</Grid>
					<Grid item xs={4}>
						<FormControl>
							<InputLabel id="demo-simple-select-label">
								Qualification
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								label="Qualification"
								name="educationInfo.qualification"
								defaultValue={rowData.educationInfo.qualification}
								onChange={handleInputChange}
								style={fieldStyle}
								sx={{
									marginRight: "20px",
									width: "225px"
								}}
							>
								{dropdown.qualification.map((item, index) =>
									<MenuItem value={item} key={index}>
										{item}
									</MenuItem>
								)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={4}>
						<FormControl>
							<InputLabel id="demo-simple-select-label">Stream</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								label="Stream"
								name="educationInfo.stream"
								defaultValue={rowData.educationInfo.stream}
								onChange={handleInputChange}
								style={fieldStyle}
								sx={{
									marginRight: "20px",
									width: "225px"
								}}
							>
								{dropdown.stream.map((item, index) =>
									<MenuItem value={item} key={index}>
										{item}
									</MenuItem>
								)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={4}>
						<FormControl>
							<InputLabel id="demo-simple-select-label">
								Year Of Passout
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								label="Year Of Passout"
								name="educationInfo.yearOfPassout"
								defaultValue={rowData.educationInfo.yearOfPassout}
								onChange={handleInputChange}
								style={fieldStyle}
								sx={{
									marginRight: "20px",
									width: "225px"
								}}
							>
								{dropdown.yearofpass.map((item, index) =>
									<MenuItem value={item} key={index}>
										{item}
									</MenuItem>
								)}
							</Select>
						</FormControl>
					</Grid>

					<Grid item xs={4}>
						<TextField
							label="Unique ID"
							name="csrDto.uniqueId"
							defaultValue={rowData.csrDto.uniqueId}
							onChange={handleInputChange}
							style={fieldStyle}
							InputProps={{
								readOnly: true
							}}
						/>
					</Grid>
					<Grid item xs={4}>
						<TextField
							label="USN Number"
							name="csrDto.usnNumber"
							defaultValue={
								rowData.csrDto.usnNumber != "NA" ? rowData.csrDto.usnNumber : ""
							}
							onChange={handleInputChange}
							style={fieldStyle}
							onBlur={handleUsnNumber}
							placeholder={rowData.csrDto.usnNumber === "NA" ? "NA" : ""}
						/>
						{usnCheck
							? <Alert severity="error">
									{usnCheck}
								</Alert>
							: " "}
					</Grid>

					<Grid item xs={4}>
						<TextField
							label="WhatsApp Number"
							name="csrDto.alternateContactNumber"
							defaultValue={
								rowData.csrDto.alternateContactNumber != 0
									? rowData.csrDto.alternateContactNumber
									: ""
							}
							onChange={handleInputChange}
							style={fieldStyle}
							placeholder={rowData.csrDto.alternateContactNumber === 0 ? 0 : ""}
						/>
						{alternativeNumberCheck
							? <Alert severity="error">
									{alternativeNumberCheck}
								</Alert>
							: " "}
					</Grid>
					<Grid item xs={4}>
						<FormControl>
							<InputLabel id="demo-simple-select-label">
								College Name
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								label="College Name"
								name="educationInfo.collegeName"
								defaultValue={rowData.educationInfo.collegeName}
								onChange={handleInputChange}
								style={fieldStyle}
								sx={{
									marginRight: "20px",
									width: "225px"
								}}
							>
								{dropdown.college.map((item, index) =>
									<MenuItem value={item} key={index}>
										{item}
									</MenuItem>
								)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={4}>
						<FormControl>
							<InputLabel id="demo-simple-select-label">Course</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								label="Course"
								name="courseInfo.course"
								defaultValue={rowData.courseInfo.course}
								onChange={handleInputChange}
								style={fieldStyle}
								sx={{
									marginRight: "20px",
									width: "225px"
								}}
							>
								{batchDetails.map((item, index) =>
									<MenuItem value={item} key={index}>
										{item}
									</MenuItem>
								)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={4}>
						<TextField
							label="Branch"
							name="courseInfo.branch"
							value={formData.branch || ""}
							onChange={handleInputChange}
							style={fieldStyle}
						/>
					</Grid>
					<Grid item xs={4}>
						<TextField
							label="Batch Type"
							name="courseInfo.batchType"
							value={formData.batchType || ""}
							onChange={handleInputChange}
							style={fieldStyle}
						/>
					</Grid>
					<Grid item xs={4}>
						<TextField
							label="Trainer Name"
							name="courseInfo.trainerName"
							value={formData.trainerName || ""}
							onChange={handleInputChange}
							style={fieldStyle}
						/>
					</Grid>
					<Grid item xs={4}>
						<TextField
							label="Batch Timing"
							name="courseInfo.batchTiming"
							value={formData.batchTiming || ""}
							onChange={handleInputChange}
							style={fieldStyle}
						/>
					</Grid>
					<Grid item xs={4}>
						<TextField
							label="Start Date"
							name="courseInfo.startTime"
							value={formData.startDate || ""}
							onChange={handleInputChange}
							style={fieldStyle}
						/>
					</Grid>

					<Grid item xs={4}>
						<FormControl style={fieldStyle}>
							<InputLabel id="demo-simple-select-label">Offered As</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								label="Offered As"
								name="courseInfo.offeredAs"
								defaultValue={rowData.courseInfo.offeredAs}
								onChange={handleInputChange}
								variant="outlined"
								sx={{
									marginRight: "20px",
									width: "225px"
								}}
							>
								{dropdown.offered.map((item, index) =>
									<MenuItem value={item} key={index}>
										{item}
									</MenuItem>
								)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={4}>
						<TextField
							label="Referal Name"
							name="othersDto.referalName"
							defaultValue={
								rowData.othersDto.referalName != "NA"
									? rowData.othersDto.referalName
									: ""
							}
							placeholder={rowData.othersDto.referalName === "NA" ? "NA" : ""}
							onChange={handleInputChange}
							style={fieldStyle}
						/>
						{referalNameCheck
							? <Alert severity="error">
									{referalNameCheck}
								</Alert>
							: " "}
					</Grid>
					<Grid item xs={4}>
						<TextField
							label="Referal Contact Number"
							name="othersDto.referalContactNumber"
							defaultValue={
								rowData.othersDto.referalContactNumber != 0
									? rowData.othersDto.referalContactNumber
									: ""
							}
							placeholder={
								rowData.othersDto.referalContactNumber === 0 ? 0 : ""
							}
							onChange={handleInputChange}
							style={fieldStyle}
						/>
						{referalContactNumber
							? <Alert severity="error">
									{referalContactNumber}
								</Alert>
							: " "}
					</Grid>
					<Grid item xs={4}>
						<TextField
							label="X-workz E-mail"
							name="othersDto.xworkzEmail"
							defaultValue={
								rowData.othersDto.xworkzEmail != "NA"
									? rowData.othersDto.xworkzEmail
									: ""
							}
							placeholder={rowData.othersDto.xworkzEmail === "NA" ? "NA" : ""}
							onChange={handleInputChange}
							style={fieldStyle}
							onBlur={handleVerifyXworkzEmail}
						/>
						{xworkzemailCheck || xworkzEmailCheckExists
							? <Alert severity="error">
									{xworkzemailCheck}
									{xworkzEmailCheckExists}
								</Alert>
							: ""}
						{xworkzEmailErrorVerify &&
						xworkzEmailErrorVerify === "accepted_email"
							? <Alert severity="success">
									{xworkzEmailErrorVerify}
								</Alert>
							: xworkzEmailErrorVerify !== "accepted_email" &&
								xworkzEmailErrorVerify !== ""
								? <Alert severity="error">
										{xworkzEmailErrorVerify}
									</Alert>
								: ""}
					</Grid>
					<Grid item xs={4}>
						<FormControl>
							<InputLabel id="demo-simple-select-label">
								preferred Location
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								label="Preferred Location"
								name="othersDto.preferredLocation"
								onChange={handleInputChange}
								defaultValue={rowData.othersDto.preferredLocation}
								variant="outlined"
								sx={{
									marginRight: "20px",
									width: "225px"
								}}
								style={fieldStyle}
							>
								{dropdown.branchname.map((item, index) =>
									<MenuItem value={item} key={index}>
										{item}
									</MenuItem>
								)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={4}>
						<FormControl>
							<InputLabel id="demo-simple-select-label">
								preferred Class Type
							</InputLabel>
							<Select
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								label="Preferred Class Type"
								name="othersDto.preferredClassType"
								onChange={handleInputChange}
								defaultValue={rowData.othersDto.preferredClassType}
								variant="outlined"
								sx={{
									marginRight: "20px",
									width: "225px"
								}}
								style={fieldStyle}
							>
								{dropdown.batch.map((item, index) =>
									<MenuItem value={item} key={index}>
										{item}
									</MenuItem>
								)}
							</Select>
						</FormControl>
					</Grid>
					{attemptStatus
						? attemptStatus === "Joined"
							? <Grid item xs={4}>
									<FormControl>
										<InputLabel id="demo-simple-select-label">
											Fees Concession
										</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											label="Concession"
											name="feeConcession"
											onChange={handleInputChange}
											defaultValue={feeConcession}
											variant="outlined"
											sx={{
												marginRight: "20px",
												width: "225px"
											}}
											style={fieldStyle}
										>
											{[...Array(26).keys()].map((item, index) =>
												<MenuItem value={item} key={index}>
													{item}
												</MenuItem>
											)}
										</Select>
									</FormControl>
								</Grid>
							: ""
						: ""}

					{/* <Grid item xs={4}>
            <TextField
              type="number"
              label="SSLC or 10th Percentage"
              name="percentageDto.sslcPercentage"
              defaultValue={rowData.percentageDto.sslcPercentage}
              onChange={handleInputChange}
              style={fieldStyle}
              
            />
            <div style={{ marginTop: "-57px", marginLeft: "250px" }}>
              {sslcToPerc ? <span>{sslcToPerc}</span> : ""}
            </div>
            <div style={{ marginTop: "45px" }}>
              {sslcError ? (<Alert severity="error">{sslcError}</Alert>) : " "}
            </div>
          </Grid>
          <Grid item xs={4}>
            <TextField
              type="number"
              label="PUC or Diploma Percentage"
              name="percentageDto.pucPercentage"
              defaultValue={rowData.percentageDto.pucPercentage}
              onChange={handleInputChange}
              style={fieldStyle}
              
            />
            <div style={{ marginTop: "-57px", marginLeft: "250px" }}>
              {pucToPerc ? <span>{pucToPerc}</span> : ""}
            </div>
            <div style={{ marginTop: "45px" }}>
              {pucError ? (<Alert severity="error">{pucError}</Alert>) : " "}
            </div>

          </Grid>

          <Grid item xs={4}>
            <TextField
              type="number"
              label="Degree Percentage or CGPA"
              name="percentageDto.degreePercentage"
              defaultValue={rowData.percentageDto.degreePercentage}
              onChange={handleInputChange}
              style={fieldStyle}
              
            />
            <div style={{ marginTop: "-57px", marginLeft: "250px" }}>
              {degreeToPerc ? <span>{degreeToPerc}</span> : ""}
            </div>
            <div style={{ marginTop: "45px" }}>
              {degreeError ? (<Alert severity="error">{degreeError}</Alert>) : " "}
            </div>
          </Grid>

                    */}

					<Grid item xs={4}>
						<TextField
							label="Comments"
							name="othersDto.comments"
							defaultValue={
								rowData.othersDto.comments != "NA"
									? rowData.othersDto.comments
									: ""
							}
							placeholder={rowData.othersDto.comments === "NA" ? "NA" : ""}
							onChange={handleInputChange}
							style={fieldStyle}
							className="custom-textfield"
							multiline
							rows={4}
							sx={{
								marginRight: "20px",
								width: "300px"
							}}
						/>
						{comments
							? <Alert severity="error">
									{comments}{" "}
								</Alert>
							: " "}
					</Grid>
				</Grid>
			</DialogContent>

			<DialogActions>
				{loading
					? <CircularProgress size={20} /> // Show loading spinner
					: <Button
							disabled={isValidate}
							onClick={handleEditClick}
							color="primary"
						>
							Edit
						</Button>}
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
				<DialogContent>Are you sure you want to update the data?</DialogContent>
				<DialogActions>
					<IconButton
						color="inherit"
						onClick={() => setIsConfirming(false)}
						edge="start"
						aria-label="close"
						style={{ position: "absolute", right: "8px", top: "8px" }}
					>
						<GridCloseIcon />
					</IconButton>
					<Button
						onClick={handleSaveClick}
						color="primary"
						disabled={isConfirmed}
					>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</Dialog>
	);
};

export default EditModal;
