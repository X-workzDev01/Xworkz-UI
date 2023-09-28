import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Urlconstant } from '../constant/Urlconstant';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';

export default function ViewAttendance() {
  const { email } = useParams();
  const [data, setData] = useState({ rows: [], totalCount: 0 });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
const[rowCount,setRowCount]=useState();
  
useEffect(() => {
    const apiUrl = `${Urlconstant.url}api/byEmail?email=${email}&startIndex=0&maxRows=10`;

    axios
      .get(apiUrl)
      .then(response => {
        console.log(response)
        setData({
          rows: response.data.dto || [],
        });

        setPageSize(pageSize);
        setRowCount(response.data.size);
      }).catch(error => {});
  }, [email, page, pageSize]);
  

  const renderMarkAsColumn = (params) => {
    console.log(params.field)
    console.log( params.field === 'markAs' && params.value === 1 ? 'No' : 'Yes')
    console.log(params.value);
    if (params.row.markAs !== undefined) {
      return params.row.markAs === 1 ? 'No' : 'Yes';
  }
    return 'No';
  };


  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'date', headerName: 'Date', width: 150 },
    {
      field: 'markAs',
      headerName: 'Present/Absent',
      width: 120,
      valueGetter: (params) => params.row.markAs, // Define the valueGetter
      renderCell: renderMarkAsColumn, // Use the custom rendering function
    },
  ];

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to the first page when changing page size
  };

  

  return (
    <div>
      <div>
        <h2>View Attendance</h2>
        <h2>Attendance Details</h2>
        <DataGrid
          rows={data.rows}
          columns={columns}
          pagination
          pageSize={pageSize}
          rowCount={rowCount}
          page={page}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />

      </div>
    </div>
  );
}
