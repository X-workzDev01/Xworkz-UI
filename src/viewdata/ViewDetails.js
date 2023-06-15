import React from 'react'
import { useState } from 'react';
import Header from '../component/Header';
import { Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect } from 'react';
import axios from 'axios';

export default function ViewDetails() {
    const [count, setCount] = useState(10);
    const [previousCount, setPreviousCount] = useState(1);
    const [errorMessage,setError] =useState();
const [records,setRecords]=useState();
    const [dataSize,setDataSize]=useState(100);

    useEffect(() => {
        increaseCount();
      }, []);
      

    const increaseCount = () => {
        console.log(previousCount,count)
        axios.get(`http://localhost:8080/connection/trainees/page?startIndex=${previousCount}&endIndex=${count}`, {
            headers: {
                sheetId: "1WiZVpFrIsl_Wf_mpAG8LV-ObF2Gmwb8Wjw9Bev6qmY4",
            }
        }).then(response => {
            setRecords(response.data)
            console.log(response.data)
        });
        if (count !== dataSize) {
            setPreviousCount(count)
            setCount(count + 10);
        }else{
            setError("out of range")
        }
    };


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
                    {
            records.map((user, index) => (
              <tr className='table-light'>
                <th key={index}>{index + 1}</th>
                <td>{user.studentName}</td>
                <td>{user.email}</td>
                <td>{user.contactNumber}</td>
                <td>{user.address}</td>
                <td>
                <Link className="btn btn-outline-primary" to={'/edit'} state={user}>Update</Link>
                  &nbsp;&nbsp;&nbsp;

                </td>
              </tr>
            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <h3>Previous count:{previousCount} Count:{count} </h3>
            <button onClick={increaseCount}>next</button>
        </div>
    )
}
