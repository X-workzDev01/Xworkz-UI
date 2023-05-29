import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {

  return (
    <AppBar sx={{ background: "#070606" }}>
      <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="logo">
            <a href="https://www.x-workz.in/Logo.png">
            <img src='https://www.x-workz.in/Logo.png'  width={60} height={40} alt="Logo"></img>
            </a>
          </IconButton>
          <div>

            <Link>Home</Link>
            <Link to="/login">Login</Link>
          </div>
        
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
