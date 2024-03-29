import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Container, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { Form } from 'react-bootstrap';
import { AccountCircle, LockClock, Send } from '@mui/icons-material';
import axios from 'axios';
import { Urlconstant } from '../constant/Urlconstant';

const LoginPage = (props) => {
  let navigate = useNavigate()
  const [error, setError] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enable, setEnable] = useState(true);
  const [displayMessage, setDisplayMessage] = useState();
  const [emailError, setEmailError] = useState();
  const [otpError, setOtpError] = useState();
  const [isSending, setIsSending] = useState(false);

  const handleEmailChange = (event) => {
    //storing 
    setEmail(event.target.value);
  };
  const validateEmail = (value) => {
    if (!value) {
      setEmailError('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      navigate("/x-workz/login");
    } else {
      axios.post(Urlconstant.url + `otp?email=${email}&otp=${password}`, {
        headers: {
          'spreadsheetId': Urlconstant.spreadsheetId
        }
      }).then(response => {
        props.get(true);
        console.log("sucess");
        navigate("/x-workz/view", { state: { email } });
      }).catch(error => {
        
        setOtpError("Wrong Otp entered");
      });
    }
  };

  const handleOtp = () => {
    setIsSending(true);
    sessionStorage.setItem("userId", email);
    axios.post(Urlconstant.url + `login?email=${email}`, {
      headers: {
        'spreadsheetId': Urlconstant.spreadsheetId
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
      } else {
        console.log("user not found:", response.status)
      }
      setEnable(false);
      setDisplayMessage("OTP sent to your mail ID it will Expire with 10 Minutes")
    }).catch(error => {
      setEmailError("check the E-mail")
    }).finally(() => {
      setIsSending(false);
    });;
  }
  const isDisabled = !email
  return (
    <Container maxWidth="sm">
      <h2>Login </h2>
      <h2>Login </h2>
      <Typography component="div" style={{ height: '50vh' }}>
        <Form onSubmit={handleFormSubmit}>
          {emailError && <Alert severity="error">{emailError}</Alert>}
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
                  sx={{ color: 'action.active', marginRight: '8px' }}
                />
              ),
            }}
            helperText={emailError}
          />

          <Button type="submit" variant="contained" color='primary'
           onClick={handleOtp} disabled={isSending} startIcon={<Send />}>     
          {isSending ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Send OTP'
          )}
           </Button>
          <br></br>
          {displayMessage && <Alert severity="info">{displayMessage}</Alert>}
          <TextField
            label="OTP"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <LockClock
                  sx={{ color: 'action.active', marginRight: '8px' }}
                />
              ),
            }}
          />
          {otpError && <Alert severity="error">{otpError}</Alert>}
          <Button type="submit" variant="contained" color='primary' disabled={enable}>
            Login
          </Button>
        </Form>
      </Typography>
    </Container>
  );
};
export default LoginPage;

