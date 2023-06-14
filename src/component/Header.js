import { AccountCircle } from '@mui/icons-material'
import { AppBar, Avatar, IconButton, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom';

export default function Header() {
    const location = useLocation();
    const email = location.state && location.state.email;
    return (
        <>
            <AppBar sx={{ background: "#070606" }} spacing={10}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="logo">
                        <a href="https://www.x-workz.in/Logo.png">
                            <img src='https://www.x-workz.in/Logo.png' width={60} height={40} alt="Logo"></img>
                        </a>
                    </IconButton>
                
                    <Link to="/x-workz/view" >View</Link>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 6 }}>
                        <AccountCircle
                            sx={{ color: 'action.active', marginRight: '8px' }}
                        />
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {email}
                    </Typography>
                    <Avatar>X</Avatar><br></br>
                    <Link to="/x-workz/login" >Logout</Link>
                </Toolbar>
            </AppBar>

        </>
    )
}
