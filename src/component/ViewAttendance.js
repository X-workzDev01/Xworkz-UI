import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Urlconstant } from '../constant/Urlconstant';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

export default function ViewAttendance() {
  const { email } = useParams();
  const [attendanceData, setAttendanceData] = React.useState([]);

  useEffect(() => {
    const attendanceApi = Urlconstant.url + `api/byEmail?email=${email}`;
    axios.get(attendanceApi)
      .then(response => {
        const mappedData = response.data.map(item => ({
          ...item,
          markAs: item.markAs === 1 ? 'No' : 'Yes',
          
        }))
        setAttendanceData(mappedData);
      })
      .catch(error => {});
  }, []);
console.log(attendanceData)
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'markAs', headerName: 'Present/Absent', width: 120 },
  ];

  return (
    <div>
      <h2>View Attendance</h2>
      <h2>Attendance Details</h2>
      <div style={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={attendanceData}
          columns={columns}
          pageSize={10}
        />
      </div>
    </div>
  );
}
