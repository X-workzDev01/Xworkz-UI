import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login Page!!")
  };

  const handleCancel = (event) => {
    navigate('/')
  }
  
  return (
    <Container>
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-6" controlId="formBasicEmail">
          <Form.Control type="email"
           placeholder="User Name"
           required
            value={email}
             onChange={handleEmailChange} />
          </Form.Group>
        
        <Form.Group className="mb-6" controlId="formBasicEmail">
            <Form.Control type="password"
           placeholder="password"  
           required
           value={password} 
           onChange={handlePasswordChange} />
        </Form.Group>
        
        <Button type="submit" >Login</Button>
        &nbsp;&nbsp;&nbsp;
        <Button type='submit' onClick={(event) => handleCancel(event)}>Cancel</Button>
      </Form>
      </Container>
  );
};

export default LoginPage;

