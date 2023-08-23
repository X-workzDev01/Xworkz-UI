import { Button, Grid } from '@mui/material'
import React from 'react'
import Header from '../component/Header'
import { useNavigate } from 'react-router-dom'

export default function PageList() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/x-workz/register")
    }
    const handleview = () => {
        navigate("/x-workz/display")
    }

    const handleSearch=()=>{
        navigate("/x-workz/search")
    }

    const handlefollowup=()=>{
        navigate("/x-workz/followup")
    }
    return (
        <>
            <h1>Hello</h1>
            <Header/>
            <Grid container spacing={10}>
                
                <Grid item>
                    <Button type="submit" variant="contained" color='primary' onClick={handleClick}>
                        Register
                    </Button>
                </Grid>
                <Grid item>
                    <Button type="submit" variant="contained" color='primary' onClick={handleview}>
                        View Records
                    </Button>
                </Grid>

                <Grid item>
                    <Button type="submit" variant="contained" color='primary' onClick={handlefollowup}>
                        Follow Up
                    </Button>
                </Grid>

                
                <Grid item>
                    <Button variant="contained" color="primary">
                        Fee
                    </Button>
                </Grid>
            </Grid>

        </>
    )
}
