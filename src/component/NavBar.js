import { AppBar, Container, IconButton, Toolbar, Typography } from '@mui/material';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

   
const Navbar = ({children}) => {
 
  return (
    <>
    <AppBar sx={{ background: "#070606" }}>
      <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="logo">
            <a href="https://www.x-workz.in/Logo.png">
            <img src='https://www.x-workz.in/Logo.png'  width={60} height={40} alt="Logo"></img>
            </a>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 3 }}>
           
          </Typography>
          <Link to="/x-workz/login" >Login</Link>
      </Toolbar>
    </AppBar>
    <Container>{children}</Container>
    </>
  );
};

export default Navbar;
