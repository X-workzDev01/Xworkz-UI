import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');


  const handleUserChange = (e) => {
    setUser(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(user)
    navigate('/registration')
  };
  const handleClick = (event) => {
    if(!user){
    navigate('/register')
    }else{
      navigate('/login')
    }
  }

  const handleCancel = (event) => {
    navigate('/')
  }
  
  return (
    <Container>
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-6" controlId="formBasicEmail">
          <Form.Control type="text"
           placeholder="User Name"
           required
            value={user}
             onChange={handleUserChange} />
          </Form.Group>
        
        <Form.Group className="mb-6" controlId="formBasicEmail">
            <Form.Control type="password"
           placeholder="password"  
           required
           value={password} 
           onChange={handlePasswordChange} />
        </Form.Group>
        
        <Button type="submit" onClick={(event) => handleClick(event)}>Login</Button>
        &nbsp;&nbsp;&nbsp;
        <Button type='submit' onClick={(event) => handleCancel(event)}>Cancel</Button>
      </Form>
      </Container>
  );
};

export default LoginPage;

