import { AppBar, IconButton, Toolbar } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
   
const Navbar = (props) => {

  return (
    <AppBar sx={{ background: "#070606" }}>
      <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="logo">
            <a href="https://www.x-workz.in/Logo.png">
            <img src='https://www.x-workz.in/Logo.png'  width={60} height={40} alt="Logo"></img>
            </a>
          </IconButton>
            <Link to="/x-workz/login" onClick={props.login}>Login</Link>
        
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
