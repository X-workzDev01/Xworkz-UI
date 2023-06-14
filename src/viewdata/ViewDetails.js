import React from 'react'
import { useState } from 'react';
import Header from '../component/Header';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect } from 'react';
import axios from 'axios';

export default function ViewDetails() {
    const [count, setCount] = useState(10);
    const [previousCount, setPreviousCount] = useState(1);
    const [errorMessage,setError] =useState();

    const [dataSize,setDataSize]=useState(100);

    const increaseCount = () => {
        console.log(previousCount,count)
        const response= axios.get('',{
                headers: {
                    'spreadsheetId': '1p3G4et36vkzSDs3W63cj6qnUFEWljLos2HHXIZd78Gg'
                  }
        }).then(response => {
            console.log(response.data)
        });
        if (count !== dataSize) {
            setPreviousCount(count)
            setCount(count + 10);
        }else{
            setError("out of range")
        }
    };

    useEffect(() => {
        fetchData();
    },);

    const fetchData = async () => {
        console.log(previousCount,count)
        const response=await axios.get('',{
                headers: {
                    'spreadsheetId': '1p3G4et36vkzSDs3W63cj6qnUFEWljLos2HHXIZd78Gg'
                  }
        }).then(response => {
            console.log(response.data)
        });
    }

    return (
        <div>
            <Header />
            <h1>Displaying data</h1>
            <div key={errorMessage} style={{ color: 'Red' }} >
           <h4> {errorMessage}</h4>
          </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 400 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Sl.No</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">E-mail</TableCell>
                            <TableCell align="right">Contact Number</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                    </TableBody>
                </Table>
            </TableContainer>
            <h3>Previous count:{previousCount} Count:{count} </h3>
            <button onClick={increaseCount}>next</button>
        </div>
    )
}
