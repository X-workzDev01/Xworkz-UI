import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Container, Typography, TextField, Button } from '@mui/material';
import { Form } from 'react-bootstrap';


const LoginPage = () => {
  let navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if(!email){
  
      navigate("/register");
    }else{
      navigate("/")
    }
    console.log(email);
  };

  return (
    <Container maxWidth="sm">
      <h2>Login</h2>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <Form onSubmit={handleFormSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;

