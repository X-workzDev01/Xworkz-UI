import React from 'react'
import { useParams } from 'react-router-dom'
import { Urlconstant } from '../constant/Urlconstant';
import { DataGrid } from '@mui/x-data-grid';

export default function ViewAttendance() {
  const { email } = useParams();
  console.log(email)
  const initialPageSize = 25;
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: initialPageSize,
  });
  const [gridData, setGridData] = React.useState({
    rows: [],
    rowCount: 0,
  });
  const [loading, setLoading] = React.useState(false);
  console.log(initialPageSize);
  console.log(paginationModel);

  React.useEffect(() => {
    setLoading(true);
    console.log("use effect",email);
    searchServerRows(paginationModel.page, paginationModel.pageSize,email).then((newGridData) => {
      setGridData(newGridData);
      setLoading(false);
    });
  }, [paginationModel.page, paginationModel.pageSize,email]);


  function searchServerRows(page, pageSize,email) {
    
    const startingIndex = page * pageSize;

    const apiUrl = Urlconstant.url + `api/byEmail?email=${email}&startIndex=${startingIndex}&maxRows=25`;
    return new Promise((resolve, reject) => {
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log('Received data from server:', data);
          
          const newGridData = {
            rows: data.dto.map((row) => ({ id: row.id.toString(), ...row })),
            rowCount: data.size,
          };
          resolve(newGridData);
        }, 1000)
        .catch((error) => {
          resolve({ rows: [], rowCount: 0 });
        });
    });
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'basicInfo.traineeName',
      headerName: 'Trainee Name',
      valueGetter: (params) => params.row.basicInfo.traineeName,
      width: 100,
    },
    { field: 'date', headerName: 'Date', width: 150 },

    {
      field: 'markAs',
      headerName: 'Present/Absent',
      width: 120,
      flex: 1,
      valueGetter: (params) =>{
        const markAs = params.row.markAs;
      if (typeof markAs === 'number') {
        return markAs === 1 ? 'Yes' : 'no';
      } else if (typeof markAs === 'string') {
        return markAs === '1' ? 'Yes' : 'No';
      } else {
        return 'unknown';
      }
    },
  }
  ]


  return (
    <div>
      <h1>Attendance</h1>
      <h1>Attendance Details</h1>
      <div style={{ height: '650px', width: '75%',display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <DataGrid
          columns={columns}
          rows={gridData.rows}
          pagination
          paginationModel={paginationModel}
          pageSizeOptions={[5, 10, 15]}
          rowCount={gridData.rowCount}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          loading={loading}
          keepNonExistentRowsSelected
        />
      </div>
    </div>
  )
}
