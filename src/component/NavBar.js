import React from 'react';
import './NavBar.css';
import { AppBar, Toolbar, Tab, Tabs, IconButton } from '@mui/material';
import { Link } from 'react-router-dom'

function NavBar() {
  
  return (
    <React.Fragment>
      <AppBar sx={{ background: "#070606" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="logo">
            <a href="https://www.x-workz.in/Logo.png">
            <img src='https://www.x-workz.in/Logo.png'  width={60} height={40} alt="Logo"></img>
            </a>
          </IconButton>
          <Tabs textColor='inherit'>
            <Tab label="Home" />
          </Tabs>
          <Link sx={{ marginLeft: '100px' }} variant='outlined' to={"/login"}>Login</Link>
        </Toolbar>

      </AppBar>

    </React.Fragment>
  );
};

export default NavBar;