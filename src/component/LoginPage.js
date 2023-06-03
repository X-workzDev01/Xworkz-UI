import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Container, Typography, TextField, Button } from '@mui/material';
import { Form } from 'react-bootstrap';
import ProtectedRoutes from './ProtectedRoutes';
import { AccountCircle, LockClock, LockOpenOutlined } from '@mui/icons-material';


const LoginPage = () => {
  let navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [enable,setEnable]=useState(true);
  const [displayMessage,setDisplayMessage]=useState();


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!email || !password) {
      navigate("/x-workz/login");
    } else {
      //backend code check
      
      
      navigate("/x-workz/register")
      setIsLoggedIn(true)
      console.log(isLoggedIn)
    }
  };

  const handleOtp =()=>{
    //handling back end call
    alert("Sending OTP!!!!")
    setEnable(false);
    setDisplayMessage("OTP sent to your mail ID it will Expire with 5 Minutes")
  }

  const isDisabled=!email

  return (
    <Container maxWidth="sm">
      <h2>Login </h2>
      <Typography component="div" style={{ height: '50vh' }}>
        <Form onSubmit={handleFormSubmit}>
          
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
          />
           <Button type="submit" variant="contained" color='primary' onClick={handleOtp} disabled={isDisabled}>
            Send Otp
          </Button>
          <br></br>
          {displayMessage}
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
          <Button type="submit" variant="contained" color='primary' disabled={enable}>
            Login
          </Button>
          <ProtectedRoutes isLoggedIn={isLoggedIn} />
        </Form>
      </Typography>
    </Container>
  );
};
export default LoginPage;

