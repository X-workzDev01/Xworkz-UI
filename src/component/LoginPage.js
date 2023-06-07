import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Container, Typography, TextField, Button, Alert } from '@mui/material';
import { Form } from 'react-bootstrap';
import ProtectedRoutes from './ProtectedRoutes';
import { AccountCircle, LockClock, Login } from '@mui/icons-material';
import axios from 'axios';
import AuthContext from './AuthContext';
import Cookies from 'js-cookie';

const LoginPage = () => {
  let navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [enable, setEnable] = useState(true);
  const [displayMessage, setDisplayMessage] = useState();
 const {login} =useContext(AuthContext);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFormSubmit =async (event) => {
    event.preventDefault();
    if (!email || !password) {
      navigate("/x-workz/login");
    } else {
      //await login(email,password);
      axios.post(`http://localhost:8080/otp?email=${email}&otp=${password}`, {
        headers: {
          'spreadsheetId': '1p3G4et36vkzSDs3W63cj6qnUFEWljLos2HHXIZd78Gg'
        }
      }).then(response => {
        setIsLoggedIn(true);
        navigate("/x-workz/register");
        Cookies.get("Xworkz");
        const cookies=Cookies.get("Xworkz");
        console.log(cookies);
        console.log("Cookies",response.token);  
      }).catch(error => {
        console.error(error);
      });
    }
  };


  const handleOtp = () => {
    const userEmail = email;
    axios.post(`http://localhost:8080/login?email=${userEmail}`, {
      headers: {
        'spreadsheetId': '1p3G4et36vkzSDs3W63cj6qnUFEWljLos2HHXIZd78Gg'
      }
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)

      } else {
        console.log("user not found:", response.status)
      }
      alert("Sending OTP!!!!")
      setEnable(false);
      setDisplayMessage("OTP sent to your mail ID it will Expire with 10 Minutes")
      console.log(response.data);
    }).catch(error => {

      console.error(error);
    });

  }

  const isDisabled = !email

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

