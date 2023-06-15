import { Button, Grid } from '@mui/material'
import React from 'react'
import Header from '../component/Header'
import { useNavigate } from 'react-router-dom'
import Registration from '../component/Registration';
import DisplayData from './DisplayData';

export default function PageList() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/x-workz/register")
    }
    const handleview = () => {
        navigate("/x-workz/display")
    }

    const hanledisplay = () => {
        navigate("/x-workz/viewdetails")
    }

    return (
        <>
            <h1>Hello</h1>
            <Header/>
            <Grid container spacing={25}>
                
                <Grid item>
                    <Button type="submit" variant="contained" color='primary' onClick={handleClick}>
                        Register
                    </Button>
                </Grid>

                <Grid item>
                    <Button type="submit" variant="contained" color='primary' onClick={hanledisplay}>
                        View Details
                    </Button>
                </Grid>
                <Grid item>
                    <Button type="submit" variant="contained" color='primary' onClick={handleview}>
                        GridView
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
