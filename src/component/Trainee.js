import { TextField, Button, Alert, Typography, Container } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Urlconstant } from "../constant/Urlconstant";
import EditModal from "./EditModal";
import { validateEmail } from "../constant/ValidationConstant";

export const Trainee = ({ formData, setFormData, onNext }) => {
	const [error, setError] = useState();
	const [emailCheck, setEmailCheck] = useState(null);
	const [numberCheck, setNumberCheck] = useState(null);
	const [emailError, setEmailError] = useState(null);
	const [nameError, setNameError] = useState(null);
	const [buttonEnabled, setButtonEnabled] = useState(false);
	const [phoneNumberError, setPhoneNumberError] = useState("");
	const [verifyHandaleEmail, setverifyHandleEmail] = useState("");
	const [verifyHandaleEmailerror, setverifyHandleEmailError] = useState("");

	const handleInputChange = e => {
		const { name, value } = e.target;

		if (name === "traineeName") {
			if (!value) {
				setNameError("Name is required");
			} else if (value.length < 3) {
				setNameError("Enter a Valid Name");
			} else {
				setNameError("");
			}
		} else if (name === "email") {
			if (!value) {
				setEmailError("Email is required");
				setverifyHandleEmailError("");
				setverifyHandleEmail("");
				setEmailCheck("");
			} else if (!validateEmail(value)) {
				setverifyHandleEmailError("");
				setEmailError("Invalid email address");
				setverifyHandleEmail("");
				setEmailCheck("");
			} else {
				setEmailError("");
				validEmail(value);
			}
		} else if (name === "contactNumber") {
			if (!value) {
				setPhoneNumberError("Phone number is required");
				setNumberCheck("");
			} else if (!/^\d+$/.test(value)) {
				setPhoneNumberError("Phone number must contain only digits");
				setNumberCheck("");
			} else if (value.length !== 10) {
				setPhoneNumberError("Phone number must contain exactly 10 digits");
				setNumberCheck("");
			} else {
				setPhoneNumberError("");
			}
		}
		setFormData({ ...formData, [name]: value });
	};

	const verifyEmail = email => {
		axios
			.get(`${Urlconstant.url}api/verify-email?email=${email}`)
			.then(response => {
				if (response.status === 200) {
					if (response.data === "accepted_email") {
						setverifyHandleEmail(response.data);
						setverifyHandleEmailError("");
					} else if (response.data === "rejected_email") {
						setEmailError("");
						setverifyHandleEmail("");
						setEmailCheck("");
						setverifyHandleEmailError(response.data);
					} else {
						setverifyHandleEmailError(response.data);
						setverifyHandleEmail("");
						setEmailError("");
						setEmailCheck("");
					}
				} else {
					if (response.status === 500) {
						console.log("Internal Server Error:", response.status);
					} else {
						console.log("Unexpected Error:", response.status);
					}
				}
			})
			.catch(error => {
				console.log("check emailable credentils");
			});
	};

	const handleEmail = email => {
		axios
			.get(Urlconstant.url + `api/emailCheck?email=${email}`, {
				headers: {
					spreadsheetId: Urlconstant.spreadsheetId
				}
			})
			.then(response => {
				if (response.status === 201) {
					setEmailCheck(response.data);
				} else {
					setEmailCheck("");
				}
			})
			.catch();
		console.log(error);
	};

	const validEmail = email => {
		handleEmail(email);
	};

	const handleNumberChange = e => {
		if (!formData.contactNumber) {
			console.log("Contact number is blank. Cannot make the API call.");
			return;
		}

		axios
			.get(
				Urlconstant.url +
					`api/contactNumberCheck?contactNumber=${formData.contactNumber}`,
				{
					headers: {
						spreadsheetId: Urlconstant.spreadsheetId
					}
				}
			)
			.then(response => {
				if (response.status === 201) {
					setPhoneNumberError("");
					setNumberCheck(response.data);
				} else {
					setNumberCheck(null);
				}
			})
			.catch(error => {
				console.log(error);
			});
	};

	const handleEmailVeryfy = e => {
		const email = e.target.value;
		if (email !== "" && emailError === "" && emailCheck === "") {
			verifyEmail(email);
		}
	};

	const today = new Date();
	const maxDate = today.toISOString().split("T")[0];
	const isDisabled =
		!formData.traineeName ||
		!formData.email ||
		!formData.contactNumber ||
		!formData.dateOfBirth ||
		verifyHandaleEmailerror ||
		numberCheck ||
		emailCheck ||
		nameError;
	return (
		<div>
			<Container maxWidth="sm">
				<Typography component="div" style={{ height: "50vh" }}>
					<h2>Trainee</h2>
					<Form>
						{error &&
							<Alert severity="error">
								{error}
							</Alert>}
						<TextField
							type="text"
							label="User Name"
							name="traineeName"
							fullWidth
							margin="normal"
							required
							id="outlined-basic"
							variant="outlined"
							defaultValue={"NA"}
							value={formData.traineeName || ""}
							onChange={handleInputChange}
						/>
						{nameError &&
							<Alert severity="error">
								{nameError}
							</Alert>}

						<TextField
							type="email"
							label="E-mail"
							required
							name="email"
							fullWidth
							margin="normal"
							id="outlined-basic"
							variant="outlined"
							value={formData.email || ""}
							onBlur={handleEmailVeryfy}
							onChange={handleInputChange}
						/>
						{verifyHandaleEmail
							? <Alert severity="success">
									{verifyHandaleEmail}
								</Alert>
							: " "}
						{verifyHandaleEmailerror
							? <Alert severity="error">
									{verifyHandaleEmailerror}
								</Alert>
							: " "}
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
						<TextField
							type="number"
							label="Contact Number"
							required
							fullWidth
							margin="normal"
							id="outlined-basic"
							variant="outlined"
							name="contactNumber"
							value={formData.contactNumber || ""}
							onChange={handleInputChange}
							onBlur={handleNumberChange}
						/>
						{phoneNumberError &&
							<Alert severity="error">
								{phoneNumberError}
							</Alert>}
						{numberCheck &&
							<Alert severity="error">
								{numberCheck}
							</Alert>}
						<TextField
							type="date"
							name="dateOfBirth"
							label="Date Of Birth"
							value={formData.dateOfBirth || ""}
							onChange={handleInputChange}
							required
							fullWidth
							margin="normal"
							id="outlined-basic"
							variant="outlined"
							InputLabelProps={{
								shrink: true
							}}
							inputProps={{
								max: maxDate
							}}
						/>
					</Form>
					<Button variant="contained" disabled={isDisabled} onClick={onNext}>
						Next
					</Button>
				</Typography>
			</Container>
		</div>
	);
};
