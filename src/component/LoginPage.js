import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Container,
	Typography,
	TextField,
	Button,
	Alert,
	CircularProgress
} from "@mui/material";
import { Form } from "react-bootstrap";
import { AccountCircle, LockClock, Send } from "@mui/icons-material";
import axios from "axios";
import { Urlconstant } from "../constant/Urlconstant";
import Navbar from "./NavBar";
import { useDispatch } from "react-redux";
import { saveLoginEmail } from "../store/loginAuth/LoginEmail";

const LoginPage = props => {
	let navigate = useNavigate();
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [enable, setEnable] = useState(true);
	const [displayMessage, setDisplayMessage] = useState();
	const [emailError, setEmailError] = useState();
	const [otpError, setOtpError] = useState();
	const [isSending, setIsSending] = useState(false);
	const [effect, setEffect] = useState(false);
	const [loginProg, setLoginProg] = useState(false);

	const handleEmailChange = event => {
		//storing
		setEmail(event.target.value);
	};

	useEffect(
		() => {
			if (effect) {
			}
		},
		[effect]
	);

	const handlePasswordChange = event => {
		setPassword(event.target.value);
	};

	const handleFormSubmit = async event => {
		event.preventDefault();
		setLoginProg(true);
		setEnable(true);
		if (!password) {
			navigate(Urlconstant.navigate + "login");
			setOtpError("Enter Otp");
			setLoginProg(false);
			setEnable(false);
		} else {
			axios
				.post(Urlconstant.url + `otp?email=${email}&otp=${password}`, {
					headers: {
						spreadsheetId: Urlconstant.spreadsheetId
					}
				})
				.then(response => {
					props.get(true);
					console.log(response.data);
					if (response.data === "OTP Wrong") {
						setOtpError("Wrong Otp entered");
						setLoginProg(false);
						setEnable(false);
					} else {
						setLoginProg(false);
						navigate(Urlconstant.navigate + "display", { state: { email } });
					}
					setEffect(true);
				})
				.catch(error => {});
		}
	};

	const handleOtp = () => {
		setIsSending(true);
		dispatch(saveLoginEmail(email));

		axios
			.post(Urlconstant.url + `login?email=${email}`, {
				headers: {
					spreadsheetId: Urlconstant.spreadsheetId
				}
			})
			.then(response => {
				if (response.status === 200) {
				} else {
					console.log("user not found:", response.status);
				}
				setEnable(false);
				setEmailError("");
				setDisplayMessage(
					"OTP has been sent to your mail ID it will Expire within 10 Minutes"
				);
			})
			.catch(error => {
				setEmailError("check the E-mail");
			})
			.finally(() => {
				setIsSending(false);
			});
	};

	return (
		<div>
			<Navbar />
			<Container
				maxWidth="sm"
				style={{
					marginBottom: "4.5rem",
					border: "1px solid #C9C8C8",
					maxWidth: "400px",
					borderRadius: "6px",
					marginTop: "80px",
					height: "70vh"
				}}
			>
				<Typography component="div" style={{ height: "50vh" }}>
					<Form onSubmit={handleFormSubmit} style={{ textAlign: "center" }}>
						<h2>Login</h2>
						{emailError &&
							<Alert severity="error">
								{emailError}
							</Alert>}
						<TextField
							label="Email"
							type="email"
							value={email}
							onChange={handleEmailChange}
							required
							fullWidth
							margin="normal"
							InputProps={{
								startAdornment: (
									<AccountCircle
										sx={{ color: "action.active", marginRight: "8px" }}
									/>
								)
							}}
							helperText={emailError}
						/>

						<Button
							type="submit"
							variant="contained"
							color="primary"
							onClick={handleOtp}
							disabled={isSending}
							startIcon={<Send />}
						>
							{isSending
								? <CircularProgress size={24} color="inherit" />
								: "Send OTP"}
						</Button>
						<br />
						{displayMessage &&
							<Alert severity="info">
								{displayMessage}
							</Alert>}
						<TextField
							label="OTP"
							disabled={enable}
							type="password"
							value={password}
							onChange={handlePasswordChange}
							fullWidth
							margin="normal"
							InputProps={{
								startAdornment: (
									<LockClock
										sx={{ color: "action.active", marginRight: "8px" }}
									/>
								)
							}}
						/>
						{otpError &&
							<Alert severity="error">
								{otpError}
							</Alert>}
						<Button
							type="submit"
							variant="contained"
							color="primary"
							disabled={enable}
						>
							{loginProg
								? <CircularProgress size={24} color="inherit" />
								: "Login"}
						</Button>
					</Form>
				</Typography>
			</Container>
		</div>
	);
};
export default LoginPage;
